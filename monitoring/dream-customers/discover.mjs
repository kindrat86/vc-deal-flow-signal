#!/usr/bin/env node
// Daily Marcus discovery — Playwright + saved x.com session, no LLM, no API key.
//
// Picks 5 random HIGH-confidence anchors from data.json (deterministic by date,
// so re-running the same day is a no-op), visits each, harvests "You might
// like" / "Who to follow" sidebar handles, dedupes, quick-qualifies each
// candidate by visiting their profile and regex-matching VC-role keywords in
// the bio, appends up to 8 new contacts per run as Sourced rows with
// confidence: LOW. Atomic write to data.json. Schema-aware (v1 one-line vs
// v2 stage-on-disk). Calls build.mjs at the end to regenerate the dashboard.
//
// Hard gates:
// 1. .x-state.json must exist (run `node setup-discover.mjs` once first).
// 2. After loading, the page must show a logged-in shell (home side-nav link
//    present). If X has logged us out, write a "re-run setup" log line and
//    exit 0 — cron tries again tomorrow.

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(HERE, 'data.json');
const STATE_PATH = path.join(HERE, '.x-state.json');
const LOG_PATH = path.join(HERE, 'cron.discovery.log');

const ANCHOR_PICK_COUNT = 5;
const MAX_NEW_PER_RUN = 8;
const HARD_CAP_TOTAL = 300;
const NAV_DELAY_MS = 4000;

// Firm-level handles / parody accounts to never accept as candidates.
const HANDLE_BLOCKLIST = new Set(
  [
    'usv', 'GreylockVC', 'a16z', 'sequoiacap', 'benchmark', 'accel', 'kpcb',
    'firstround', 'foundryvc', 'bessemervp', 'lightspeedvp', 'Theoryvc',
    'craftventures', 'indexventures', 'generalcatalyst', 'nea', 'khoslaventures',
    'redpoint', 'Cowboy_VC', 'unionsquare', 'flybridge', 'bedrockcap',
    'precursorvc', 'slow', 'weekendfund', 'worklife', 'floodgate', 'xfund',
    'sapphirepartners', 'HustleFund', 'BananaCapital', 'VCBrags',
  ].map((h) => h.toLowerCase())
);

// Bio keywords that mark a candidate as Marcus-fit (VC partner/GP/founder of fund).
const ROLE_KEYWORDS = [
  /\bpartner\b/i,
  /\bgeneral partner\b/i,
  /\bmanaging partner\b/i,
  /\bsolo gp\b/i,
  /\bfounding partner\b/i,
  /\bfounder\b.{0,40}\b(venture|capital|fund|ventures|vc)\b/i,
  /\binvest(or|ing)\b.{0,40}\b(seed|pre[- ]?seed|series [a-d]|venture|early[- ]?stage)\b/i,
  /\b(seed|pre[- ]?seed|early[- ]?stage)\b.{0,40}\binvestor\b/i,
];

const ISO = () => new Date().toISOString();

async function log(line) {
  await fs.appendFile(LOG_PATH, line.endsWith('\n') ? line : line + '\n');
}

function seededRandomPick(arr, n, seed) {
  // Deterministic pick: hash seed, sort by hash(seed + item), take first n.
  const decorated = arr.map((item) => ({
    item,
    key: crypto.createHash('sha256').update(seed + ':' + item).digest('hex'),
  }));
  decorated.sort((a, b) => a.key.localeCompare(b.key));
  return decorated.slice(0, n).map((d) => d.item);
}

function detectSchemaVersion(contacts) {
  if (contacts.length === 0) return 'v2'; // default to richer shape
  return 'stage' in contacts[0] ? 'v2' : 'v1';
}

function buildContact({ handle, name, firm, role, segment }, schemaVersion) {
  const base = {
    handle,
    name,
    firm: firm || null,
    role: role || null,
    segment: segment || null,
    confidence: 'LOW',
    last_tweet_at: null,
    last_tweet_text: null,
    last_checked_at: null,
  };
  if (schemaVersion === 'v2') {
    return {
      ...base,
      is_dream_customer: true,
      stage: 'sourced',
      stage_source: 'auto:x-discovery-sweep',
      stage_updated_at: ISO(),
    };
  }
  return base;
}

async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeDataAtomic(data) {
  const tmp = DATA_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + '\n');
  await fs.rename(tmp, DATA_PATH);
}

async function regenerateDashboard() {
  await new Promise((resolve, reject) => {
    const child = spawn('node', ['build.mjs'], { cwd: HERE, stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('build.mjs exit ' + code))));
  });
}

async function sleep(ms) { await new Promise((r) => setTimeout(r, ms)); }

async function harvestSidebar(page, anchor) {
  await page.goto(`https://x.com/${anchor}`, { waitUntil: 'domcontentloaded' });
  // Wait briefly for the right rail to render. The "Who to follow" widget is
  // injected async; up to ~3s is usually enough.
  for (let i = 0; i < 6; i++) {
    const count = await page.locator('aside [data-testid="UserCell"]').count();
    if (count > 0) break;
    await sleep(500);
  }
  const cells = page.locator('aside [data-testid="UserCell"]');
  const handles = [];
  const cellCount = await cells.count();
  for (let i = 0; i < cellCount; i++) {
    const a = cells.nth(i).locator('a[role="link"]').first();
    const href = await a.getAttribute('href').catch(() => null);
    if (!href || !href.startsWith('/')) continue;
    const h = href.slice(1).split('/')[0];
    if (h && !h.includes('?') && !h.includes('=')) handles.push(h);
  }
  return [...new Set(handles)];
}

async function qualifyCandidate(page, handle) {
  await page.goto(`https://x.com/${handle}`, { waitUntil: 'domcontentloaded' });
  // Wait for the profile header to render.
  for (let i = 0; i < 6; i++) {
    const present = await page.locator('[data-testid="UserName"]').count();
    if (present > 0) break;
    await sleep(500);
  }
  const nameNode = page.locator('[data-testid="UserName"]').first();
  const bioNode = page.locator('[data-testid="UserDescription"]').first();
  const name = (await nameNode.innerText().catch(() => '')).split('\n')[0]?.trim() || handle;
  const bio = (await bioNode.innerText().catch(() => '')).trim();
  if (!bio) return null;
  const matchesRole = ROLE_KEYWORDS.some((re) => re.test(bio));
  if (!matchesRole) return null;
  // Extract a likely firm name. Cheap heuristic: token before "Partner",
  // or value after "at " before " | " or end. Fall back to first capitalized
  // multi-word phrase. Truncate to 40 chars.
  let firm = null;
  const atMatch = bio.match(/\bat\s+([A-Z][A-Za-z0-9 &.'-]{1,40})/);
  if (atMatch) firm = atMatch[1].trim();
  // Role: first matching ROLE_KEYWORD, normalized.
  let role = null;
  for (const re of ROLE_KEYWORDS) {
    const m = bio.match(re);
    if (m) { role = m[0].slice(0, 40); break; }
  }
  // Segment: best-effort. Default B (institutional). If "solo" / "seed" / "early-stage"
  // appears, lean A. Sequoia / Conviction / Sapphire → F.
  let segment = 'B';
  const bioLower = bio.toLowerCase();
  if (/(solo|micro|seed|pre[- ]?seed|early[- ]?stage)/.test(bioLower)) segment = 'A';
  if (/(sequoia|conviction|sapphire partners)/.test(bioLower)) segment = 'F';
  if (/(iconiq)/.test(bioLower)) segment = 'D';
  return { handle, name, firm, role, segment };
}

async function loggedInCheck(page) {
  await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded' });
  await sleep(1000);
  // If we land on /home and a SideNav home link is present, we're logged in.
  // If X has redirected us to /login (or any *login* path), we're not.
  const url = page.url();
  if (/\/login|\/i\/flow\/login/.test(url)) return false;
  const sideNavHome = await page.locator('a[href="/home"][aria-label*="Home"]').first().count();
  return sideNavHome > 0;
}

async function main() {
  // Gate 1: state file exists?
  try {
    await fs.access(STATE_PATH);
  } catch {
    const msg = `${ISO()} skipped reason=no-state-file note=run-node-setup-discover.mjs-once`;
    await log(msg);
    console.log(msg);
    return; // exit 0
  }

  // Read roster, build anchor pool.
  const data = await readData();
  const allContacts = data.contacts || [];
  if (allContacts.length >= HARD_CAP_TOTAL) {
    await log(`${ISO()} skipped reason=hard-cap roster=${allContacts.length}`);
    return;
  }
  const existingHandles = new Set(allContacts.map((c) => c.handle.toLowerCase()));
  const anchorPool = allContacts
    .filter((c) => (c.confidence || '').toUpperCase() === 'HIGH')
    .map((c) => c.handle);
  if (anchorPool.length < 1) {
    await log(`${ISO()} skipped reason=no-HIGH-anchors`);
    return;
  }
  const dateSeed = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const anchors = seededRandomPick(anchorPool, Math.min(ANCHOR_PICK_COUNT, anchorPool.length), dateSeed);

  const schemaVersion = detectSchemaVersion(allContacts);

  // Launch.
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: STATE_PATH,
    viewport: { width: 1400, height: 900 },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  // Gate 2: still logged in?
  const loggedIn = await loggedInCheck(page);
  if (!loggedIn) {
    await browser.close();
    const msg = `${ISO()} skipped reason=session-expired note=re-run-node-setup-discover.mjs`;
    await log(msg);
    console.log(msg);
    return;
  }

  // Harvest from each anchor.
  let candidatesSeen = 0;
  let blocked = 0;
  const candidateHandles = new Set();
  for (const anchor of anchors) {
    await sleep(NAV_DELAY_MS);
    let sidebar = [];
    try {
      sidebar = await harvestSidebar(page, anchor);
    } catch (err) {
      await log(`${ISO()} anchor=${anchor} harvest-error=${err.message.slice(0, 80)}`);
      continue;
    }
    for (const h of sidebar) {
      candidatesSeen++;
      if (HANDLE_BLOCKLIST.has(h.toLowerCase()) || existingHandles.has(h.toLowerCase())) {
        blocked++;
        continue;
      }
      candidateHandles.add(h);
    }
  }

  // Qualify each unique candidate (cap at MAX_NEW_PER_RUN qualified).
  const kept = [];
  for (const handle of candidateHandles) {
    if (kept.length >= MAX_NEW_PER_RUN) break;
    await sleep(NAV_DELAY_MS);
    try {
      const q = await qualifyCandidate(page, handle);
      if (q) kept.push(q);
      else blocked++;
    } catch (err) {
      await log(`${ISO()} candidate=${handle} qualify-error=${err.message.slice(0, 80)}`);
    }
  }

  await browser.close();

  // Append.
  if (kept.length > 0) {
    const newRows = kept.map((c) => buildContact(c, schemaVersion));
    data.contacts = [...allContacts, ...newRows];
    data.generated_at = ISO();
    await writeDataAtomic(data);
    await regenerateDashboard();
  }

  await log(
    `${ISO()} anchors=${anchors.length} candidates=${candidatesSeen} kept=${kept.length} blocked=${blocked} schema=${schemaVersion}`
  );
  console.log(`done — kept ${kept.length} new contacts`);
}

main().catch(async (err) => {
  await log(`${ISO()} FATAL ${err.message.slice(0, 200)}`);
  console.error(err);
  process.exit(1);
});
