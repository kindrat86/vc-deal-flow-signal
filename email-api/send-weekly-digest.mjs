#!/usr/bin/env node
/**
 * Send the weekly Signal Digest to all active subscribers.
 *
 * Dry-run by default. Pass --send to actually fire. Logs every send to the
 * PocketBase email_log collection with email_key="digest-<date>" so re-running
 * the same day is idempotent (skips already-sent subscribers).
 *
 * Usage:
 *   node send-weekly-digest.mjs                                 # dry-run, counts subs
 *   node send-weekly-digest.mjs --to you@example.com            # send one test copy
 *   node send-weekly-digest.mjs --limit 5 --send                # send to first 5 active subs
 *   node send-weekly-digest.mjs --send                          # broadcast to all active subs
 *   node send-weekly-digest.mjs --date 2026-04-19 --send        # pin a specific digest issue
 *   node send-weekly-digest.mjs --file path/to/custom.html --send
 */

import { Resend } from "resend";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { isExcluded } from "./excluded-emails.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

// --- env ---
try {
  const envFile = readFileSync(join(__dirname, ".env"), "utf-8");
  for (const line of envFile.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (k) process.env[k] = v;
  }
} catch (e) {
  console.error("Warning: could not load .env:", e.message);
}

const { RESEND_API_KEY, PB_URL, PB_EMAIL, PB_PASSWORD, FROM_EMAIL, FROM_NAME } = process.env;
if (!RESEND_API_KEY || !FROM_EMAIL || !FROM_NAME) {
  console.error("Missing required env: RESEND_API_KEY, FROM_EMAIL, FROM_NAME");
  process.exit(1);
}

// --- args ---
function arg(name, fallback) {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const i = process.argv.indexOf(`--${name}`);
  if (i !== -1 && i + 1 < process.argv.length && !process.argv[i + 1].startsWith("--")) {
    return process.argv[i + 1];
  }
  return fallback;
}
function flag(name) {
  return process.argv.includes(`--${name}`);
}

const SEND = flag("send");
const LIMIT = Number(arg("limit", "0")) || 0;
const TEST_TO = arg("to");
const DATE = arg("date", new Date().toISOString().slice(0, 10));
const FILE = arg("file", join(REPO_ROOT, "emails", `signal-digest-${DATE}.html`));

if (!existsSync(FILE)) {
  console.error(`Digest HTML not found at ${FILE}.`);
  console.error(`Generate it first: cd pseo-site && npx tsx scripts/generate-signal-digest-email.ts`);
  process.exit(1);
}

const html = readFileSync(FILE, "utf-8");

// Pull subject from the <title> tag of the digest HTML
const titleMatch = html.match(/<title>([^<]+)<\/title>/);
const subject = titleMatch ? titleMatch[1].trim() : `Signal Digest — Week of ${DATE}`;

const EMAIL_KEY = `digest-${DATE}`;
const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;
const UNSUB_MAILTO = `<mailto:${FROM_EMAIL}?subject=Unsubscribe>`;

// --- test mode: send one copy to --to and exit ---
if (TEST_TO) {
  if (!SEND) {
    console.log(`[DRY-RUN] Would send test digest to ${TEST_TO}`);
    console.log(`  subject: ${subject}`);
    console.log(`  file:    ${FILE}`);
    console.log(`  email_key: ${EMAIL_KEY}`);
    console.log(`\nPass --send to actually fire.`);
    process.exit(0);
  }
  const resend = new Resend(RESEND_API_KEY);
  const result = await resend.emails.send({
    from: FROM,
    to: TEST_TO,
    subject,
    html,
    headers: {
      "List-Unsubscribe": UNSUB_MAILTO,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// --- PocketBase: fetch active subscribers + already-sent set ---
if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) {
  console.error("Missing PB_URL / PB_EMAIL / PB_PASSWORD in .env (needed for broadcast).");
  console.error("Use --to <email> to send a single test copy without PocketBase.");
  process.exit(1);
}

async function pbAuth() {
  const res = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: PB_EMAIL, password: PB_PASSWORD }),
  });
  if (!res.ok) throw new Error(`PB auth failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.token;
}

const pbToken = await pbAuth();
async function pb(path, init = {}) {
  const res = await fetch(`${PB_URL}${path}`, {
    ...init,
    headers: { Authorization: pbToken, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`PB ${init.method || "GET"} ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function fetchAllActive() {
  const out = [];
  let page = 1;
  while (true) {
    const res = await pb(`/api/collections/subscribers/records?filter=(status='active')&perPage=100&page=${page}`);
    out.push(...(res.items || []));
    if (!res.items || res.items.length < 100) break;
    page++;
  }
  return out;
}

async function alreadySentIds() {
  const out = new Set();
  let page = 1;
  while (true) {
    const res = await pb(
      `/api/collections/email_log/records?filter=(email_key='${EMAIL_KEY}' %26%26 status='sent')&perPage=100&page=${page}`
    );
    for (const row of res.items || []) out.add(row.subscriber);
    if (!res.items || res.items.length < 100) break;
    page++;
  }
  return out;
}

const [subs, sent] = await Promise.all([fetchAllActive(), alreadySentIds()]);
const excludedHits = subs.filter((s) => isExcluded(s.email)).map((s) => s.email);
if (excludedHits.length) {
  console.log(`Skipping ${excludedHits.length} excluded address(es): ${excludedHits.join(", ")}`);
}
let queue = subs.filter((s) => !sent.has(s.id) && !isExcluded(s.email));
if (LIMIT > 0) queue = queue.slice(0, LIMIT);

console.log(`Digest file: ${FILE}`);
console.log(`Subject:     ${subject}`);
console.log(`Email key:   ${EMAIL_KEY}`);
console.log(`Active subs: ${subs.length}`);
console.log(`Already sent this issue: ${sent.size}`);
console.log(`Queued to send: ${queue.length}${LIMIT ? ` (capped by --limit ${LIMIT})` : ""}`);
if (queue.length) {
  console.log(`First few:   ${queue.slice(0, 5).map((s) => s.email).join(", ")}`);
}

if (!SEND) {
  console.log(`\n[DRY-RUN] Pass --send to actually fire. Re-runs are idempotent per email_key.`);
  process.exit(0);
}

if (queue.length === 0) {
  console.log(`Nothing to send.`);
  process.exit(0);
}

// --- broadcast ---
const resend = new Resend(RESEND_API_KEY);
let okCount = 0;
let errCount = 0;

for (const sub of queue) {
  try {
    const result = await resend.emails.send({
      from: FROM,
      to: sub.email,
      subject,
      html,
      headers: {
        "List-Unsubscribe": UNSUB_MAILTO,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    await pb("/api/collections/email_log/records", {
      method: "POST",
      body: JSON.stringify({
        subscriber: sub.id,
        email_key: EMAIL_KEY,
        subject,
        resend_id: result.data?.id ?? "",
        status: "sent",
        sent_at: new Date().toISOString(),
      }),
    });

    okCount++;
    if (okCount % 10 === 0) console.log(`  sent ${okCount}/${queue.length}`);
    // Gentle throttle — Resend free-tier is 10/s, stay well under
    await new Promise((r) => setTimeout(r, 150));
  } catch (err) {
    errCount++;
    console.error(`  FAILED ${sub.email}: ${err.message}`);
    try {
      await pb("/api/collections/email_log/records", {
        method: "POST",
        body: JSON.stringify({
          subscriber: sub.id,
          email_key: EMAIL_KEY,
          subject,
          status: "failed",
        }),
      });
    } catch {}
  }
}

console.log(`\nDone. sent=${okCount} failed=${errCount} skipped=${sent.size} total_active=${subs.length}`);
