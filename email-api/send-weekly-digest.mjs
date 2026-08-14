#!/usr/bin/env node
/**
 * Send the weekly Signal Digest to all active subscribers.
 *
 * Recipient source: the Resend audience (GET /audiences/{id}/contacts),
 * skipping `unsubscribed: true` contacts and the excluded-emails skip-list.
 * The old PocketBase "subscribers" collection this script used to read no
 * longer exists — Resend is the source of truth for the list.
 *
 * Dry-run by default. Pass --send to actually fire. Every successful send is
 * appended to a local sent-log file (sent-log/digest-<date>.json) so
 * re-running the same day is idempotent (already-sent recipients are
 * skipped). Sends are also tagged in Resend (email_key=digest-<date>) for
 * dashboard-side auditing.
 *
 * Usage:
 *   node send-weekly-digest.mjs                                 # dry-run, counts subs
 *   node send-weekly-digest.mjs --to you@example.com --send     # send one test copy
 *   node send-weekly-digest.mjs --limit 5 --send                # send to first 5 active subs
 *   node send-weekly-digest.mjs --send                          # broadcast to all active subs
 *   node send-weekly-digest.mjs --date 2026-04-19 --send        # pin a specific digest issue
 *   node send-weekly-digest.mjs --file path/to/custom.html --send
 */

import { Resend } from "resend";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { createHmac, randomBytes } from "crypto";
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

const { RESEND_API_KEY, FROM_EMAIL, FROM_NAME, VERIFY_SECRET } = process.env;
const SITE_URL = process.env.SITE_URL || "https://signals.gitdealflow.com";
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

// One-click HTTPS unsubscribe (RFC 8058). Mints the same v2 signed token as
// pseo-site/lib/verify-token.ts (purpose "unsubscribe"), which /api/unsubscribe
// on signals verifies before flipping the Resend contact to unsubscribed:true.
// Falls back to mailto-only if VERIFY_SECRET is absent, so a misconfigured env
// degrades to prior behavior instead of breaking the broadcast.
function b64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
function unsubscribeUrl(email) {
  // ~10y TTL — an unsubscribe link must not expire in any practical timeframe.
  const ttlMs = 10 * 365 * 86_400 * 1000;
  const payload = {
    e: String(email).toLowerCase(),
    p: "unsubscribe",
    x: Date.now() + ttlMs,
    n: randomBytes(8).toString("hex"),
  };
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", VERIFY_SECRET).update(body).digest("hex");
  return `${SITE_URL}/api/unsubscribe?token=${encodeURIComponent(`${body}.${sig}`)}`;
}
function unsubHeaders(email) {
  const listUnsubscribe = VERIFY_SECRET
    ? `<${unsubscribeUrl(email)}>, ${UNSUB_MAILTO}`
    : UNSUB_MAILTO;
  return {
    "List-Unsubscribe": listUnsubscribe,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

const resend = new Resend(RESEND_API_KEY);

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
  const result = await resend.emails.send({
    from: FROM,
    to: TEST_TO,
    bcc: ["sales@sipiteno.com"],
    subject,
    html,
    tags: [{ name: "email_key", value: EMAIL_KEY }],
    headers: unsubHeaders(TEST_TO),
  });
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// --- Resend audience: fetch all contacts ---
async function resendApi(path) {
  const res = await fetch(`https://api.resend.com${path}`, {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`Resend GET ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function resolveAudienceId() {
  if (process.env.RESEND_AUDIENCE_ID) return process.env.RESEND_AUDIENCE_ID;
  const body = await resendApi("/audiences");
  const id = body.data?.[0]?.id;
  if (!id) throw new Error("No Resend audience found (and RESEND_AUDIENCE_ID not set).");
  return id;
}

async function fetchAllContacts(audienceId) {
  const body = await resendApi(`/audiences/${audienceId}/contacts`);
  return body.data ?? [];
}

// --- local sent-log: per-date idempotency (replaces the PB email_log) ---
const SENT_LOG_DIR = join(__dirname, "sent-log");
const SENT_LOG_FILE = join(SENT_LOG_DIR, `${EMAIL_KEY}.json`);

function loadSentLog() {
  try {
    return new Set(JSON.parse(readFileSync(SENT_LOG_FILE, "utf-8")));
  } catch {
    return new Set();
  }
}
function saveSentLog(set) {
  mkdirSync(SENT_LOG_DIR, { recursive: true });
  writeFileSync(SENT_LOG_FILE, JSON.stringify([...set].sort(), null, 2));
}

const audienceId = await resolveAudienceId();
const contacts = await fetchAllContacts(audienceId);
const sentLog = loadSentLog();

const active = contacts.filter((c) => !c.unsubscribed);
const excludedHits = active.filter((c) => isExcluded(c.email)).map((c) => c.email);
if (excludedHits.length) {
  console.log(`Skipping ${excludedHits.length} excluded address(es): ${excludedHits.join(", ")}`);
}
let queue = active.filter(
  (c) => !isExcluded(c.email) && !sentLog.has(String(c.email).toLowerCase()),
);
if (LIMIT > 0) queue = queue.slice(0, LIMIT);

console.log(`Digest file: ${FILE}`);
console.log(`Subject:     ${subject}`);
console.log(`Email key:   ${EMAIL_KEY}`);
console.log(`Audience:    ${audienceId}`);
console.log(`Contacts:    ${contacts.length} total, ${active.length} active (not unsubscribed)`);
console.log(`Already sent this issue (local log): ${sentLog.size}`);
console.log(`Queued to send: ${queue.length}${LIMIT ? ` (capped by --limit ${LIMIT})` : ""}`);
if (queue.length) {
  console.log(`First few:   ${queue.slice(0, 5).map((c) => c.email).join(", ")}`);
}

if (!SEND) {
  console.log(`\n[DRY-RUN] Pass --send to actually fire. Re-runs are idempotent per ${SENT_LOG_FILE}.`);
  process.exit(0);
}

if (queue.length === 0) {
  console.log(`Nothing to send.`);
  process.exit(0);
}

// --- broadcast ---
let okCount = 0;
let errCount = 0;

for (const contact of queue) {
  try {
    const result = await resend.emails.send({
      from: FROM,
      to: contact.email,
      bcc: ["sales@sipiteno.com"],
      subject,
      html,
      tags: [{ name: "email_key", value: EMAIL_KEY }],
      headers: unsubHeaders(contact.email),
    });
    if (result.error) throw new Error(result.error.message || String(result.error));

    // Persist after every success so a crash mid-broadcast stays idempotent.
    sentLog.add(String(contact.email).toLowerCase());
    saveSentLog(sentLog);

    okCount++;
    if (okCount % 10 === 0) console.log(`  sent ${okCount}/${queue.length}`);
    // Gentle throttle — Resend free-tier is 10/s, stay well under
    await new Promise((r) => setTimeout(r, 150));
  } catch (err) {
    errCount++;
    console.error(`  FAILED ${contact.email}: ${err.message}`);
  }
}

console.log(`\nDone. sent=${okCount} failed=${errCount} previously_sent=${sentLog.size - okCount} total_active=${active.length}`);
