#!/usr/bin/env node
/**
 * Send the dedicated First Look Pass offer email (EUR 7) to all active
 * GitDealFlow subscribers. MODELED on send-weekly-digest.mjs on purpose:
 * same .env, same audience resolution, same excluded-list, same RFC 8058
 * one-click unsubscribe mint, same sent-log idempotency, same Resend tag
 * pattern. Differences: plain-text body (no HTML), offer subject constant,
 * sent-log file firstlook-offer-<date>.json, tag email_key=firstlook-offer-<date>.
 *
 * PREFLIGHT (runs on EVERY invocation, dry-run included; aborts --send):
 *   1. ASCII-only subject + body (Maryan's encoding preflight; also blocks
 *      mojibake sequences and the euro glyph - copy says "EUR 7").
 *   2. Canonical-claims guard: banned strings 400+, 369, 411, 4,200+.
 *      (gdf_claims_guard.py was retired; this mirrors verify-claims.ts rules.)
 *   3. Exactly ONE buy link and it must be the First Look Stripe link
 *      (28E6oGdJh18YgV04nK0x203). Any other buy.stripe link aborts.
 *   4. Unsubscribe placeholder present in the body.
 *   5. No real names (anonymity policy): "Maryan" must never appear.
 *
 * Usage:
 *   node send-firstlook-offer.mjs                                  # dry-run + preflight
 *   node send-firstlook-offer.mjs --to you@example.com --send      # one test copy
 *   node send-firstlook-offer.mjs --send                           # broadcast (approval required upstream)
 *   node send-firstlook-offer.mjs --subject "..."                  # override subject
 *   node send-firstlook-offer.mjs --body-file ./body.txt           # override body
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

// --- env (same loader as the digest sender) ---
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

// --- args (same helpers as the digest sender) ---
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
const EMAIL_KEY = `firstlook-offer-${DATE}`;
const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;
const UNSUB_MAILTO = `<mailto:${FROM_EMAIL}?subject=Unsubscribe>`;

// --- approved copy (2026-08-31 package; page-matched per Decision B1) ---
const FIRSTLOOK_BUY_URL = "https://buy.stripe.com/28E6oGdJh18YgV04nK0x203";

const DEFAULT_SUBJECT = "One sector, read for you in 24 hours (EUR 7)";

const DEFAULT_BODY = `You read the free Sunday email: five accelerating startups, every week, no card.

This is the one paid step GitDealFlow sells below the Dashboard. It is called the First Look Pass, it is EUR 7 once, and it works like this:

- You pick one sector you are already sizing up.
- Within 24 hours you get back a ranked shortlist of the startups that are actually accelerating in that sector, in plain English, ready to take into a meeting.
- One follow-up question included: reply to your dive and a person answers, never a bot.
- 30-day Signal-or-It's-Free guarantee: any reason, one email, every cent back.
- Upgrade to the Dashboard within 14 days and the EUR 7 comes off your first month.

No subscription. EUR 7 one time, secure checkout via Stripe, you choose your sector there:

${FIRSTLOOK_BUY_URL}

For scale: borrowing an engineer for a sector read costs you half their day. The institutional tools start around $20k a year. This is EUR 7, once, and the methodology behind the rankings is published on SSRN, so you can check the work before you spend anything.

The free Sunday email keeps coming either way.

The Data Nerd
GitDealFlow

Unsubscribe: {UNSUB_URL}
`;

const SUBJECT = arg("subject", DEFAULT_SUBJECT);
const bodyFile = arg("body-file");
const BODY_TEMPLATE = bodyFile ? readFileSync(resolve(bodyFile), "utf-8") : DEFAULT_BODY;

// --- RFC 8058 one-click unsubscribe (same mint as the digest sender) ---
function b64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
function unsubscribeUrl(email) {
  // Signed one-click link only when VERIFY_SECRET is present locally.
  // Absent secret = the same mailto-only fallback the weekly digest has
  // always used, so a missing secret degrades instead of crashing.
  if (!VERIFY_SECRET) return null;
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

// --- preflight (always runs; --send aborts on any violation) ---
function preflight(subject, bodyTemplate) {
  const violations = [];
  const text = `SUBJECT: ${subject}\n${bodyTemplate}`;

  // 1. ASCII-only + mojibake scan (encoding preflight)
  const nonAscii = [...new Set([...text].filter((ch) => ch.charCodeAt(0) > 127))];
  if (nonAscii.length) {
    violations.push(
      `NON-ASCII characters present: ${nonAscii.map((c) => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")} '${c}'`).join(", ")}`,
    );
  }
  const mojibakeSequences = ["\u201A\u00C4", "\u00C3", "\u00C2", "\u00E2\u20AC", "\uFFFD"];
  const mojibake = mojibakeSequences.filter((s) => text.includes(s));
  if (mojibake.length) violations.push(`MOJIBAKE sequences detected: ${mojibake.map((s) => JSON.stringify(s)).join(", ")}`);

  // 2. Canonical claims guard (banned overclaims; see pseo-site/scripts/verify-claims.ts)
  const banned = text.match(/400\+|4,200\+|\b369\b|\b411\b/g);
  if (banned) violations.push(`BANNED CLAIM strings: ${banned.join(", ")}`);

  // 3. Exactly one buy link, and it is the First Look link
  const buyLinks = bodyTemplate.match(/buy\.stripe\.com\/[A-Za-z0-9]+/g) || [];
  if (buyLinks.length !== 1 || !buyLinks[0].endsWith("28E6oGdJh18YgV04nK0x203")) {
    violations.push(
      `BUY LINK check failed: found [${buyLinks.join(", ")}], expected exactly one ${FIRSTLOOK_BUY_URL}`,
    );
  }

  // 4. Unsubscribe placeholder present
  if (!bodyTemplate.includes("{UNSUB_URL}")) {
    violations.push("Unsubscribe placeholder {UNSUB_URL} missing from body");
  }

  // 5. Anonymity: real name must never appear in outbound copy
  if (/maryan|kondratyuk/i.test(text)) {
    violations.push("ANONYMITY: a real name appears in the copy");
  }

  return violations;
}

const violations = preflight(SUBJECT, BODY_TEMPLATE);
if (violations.length) {
  console.error("PREFLIGHT FAILED (send blocked):");
  for (const v of violations) console.error(`  - ${v}`);
  if (SEND) process.exit(2);
  console.error("(dry-run only; --send would abort)");
} else {
  console.log("PREFLIGHT OK: ascii-only, claims-clean, one First Look buy link, unsub placeholder present, anonymity clean");
}

const resend = new Resend(RESEND_API_KEY);

// --- test mode: send one copy to --to and exit ---
if (TEST_TO) {
  if (violations.length) {
    console.error("Cannot test-send with preflight violations. Fix the copy first.");
    process.exit(2);
  }
  if (!SEND) {
    console.log(`[DRY-RUN] Would send test offer to ${TEST_TO}`);
    console.log(`  subject:   ${SUBJECT}`);
    console.log(`  email_key: ${EMAIL_KEY}`);
    console.log(`\nPass --send to actually fire.`);
    process.exit(0);
  }
  const result = await resend.emails.send({
    from: FROM,
    to: TEST_TO,
    bcc: ["sales@sipiteno.com"],
    subject: SUBJECT,
    text: BODY_TEMPLATE.replace("{UNSUB_URL}", unsubscribeUrl(TEST_TO) || UNSUB_MAILTO.replace(/[<>]/g, "")),
    tags: [{ name: "email_key", value: EMAIL_KEY }],
    headers: unsubHeaders(TEST_TO),
  });
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// --- Resend audience: same resolution + excluded skip as the digest sender ---
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
  // Never data[0] blind: multiple product audiences share this account.
  const byName = body.data?.find((a) =>
    a.name?.toLowerCase().includes("gitdealflow"),
  );
  const id = byName?.id ?? body.data?.[0]?.id;
  if (!id) throw new Error("No GitDealFlow Resend audience found (and RESEND_AUDIENCE_ID not set).");
  return id;
}

async function fetchAllContacts(audienceId) {
  const body = await resendApi(`/audiences/${audienceId}/contacts`);
  return body.data ?? [];
}

// --- local sent-log: per-date idempotency ---
const SENT_LOG_DIR = join(__dirname, "sent-log");
const SENT_LOG_FILE = join(SENT_LOG_DIR, `${EMAIL_KEY}.json`);

function loadSentLog() {
  try {
    const raw = JSON.parse(readFileSync(SENT_LOG_FILE, "utf-8"));
    return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  } catch {
    return {};
  }
}
function saveSentLog(map) {
  mkdirSync(SENT_LOG_DIR, { recursive: true });
  writeFileSync(SENT_LOG_FILE, JSON.stringify(map, null, 2));
}

const audienceId = await resolveAudienceId();
const contacts = await fetchAllContacts(audienceId);
const sentLog = loadSentLog();

const active = contacts.filter((c) => !c.unsubscribed);
const excludedHits = active.filter((c) => isExcluded(c.email)).map((c) => c.email);
if (excludedHits.length) {
  console.log(`Skipping ${excludedHits.length} excluded address(es)`);
}
let queue = active.filter(
  (c) => !isExcluded(c.email) && !(String(c.email).toLowerCase() in sentLog),
);
if (LIMIT > 0) queue = queue.slice(0, LIMIT);

console.log(`Subject:     ${SUBJECT}`);
console.log(`Email key:   ${EMAIL_KEY}`);
console.log(`Audience:    ${audienceId}`);
console.log(`Contacts:    ${contacts.length} total, ${active.length} active (not unsubscribed)`);
console.log(`Already sent this issue (local log): ${Object.keys(sentLog).length}`);
console.log(`Queued to send: ${queue.length}${LIMIT ? ` (capped by --limit ${LIMIT})` : ""}`);

if (!SEND) {
  console.log(`\n[DRY-RUN] Pass --send to actually fire. Re-runs are idempotent per ${SENT_LOG_FILE}.`);
  process.exit(0);
}

if (violations.length) {
  console.error("ABORT: preflight violations (see above). Nothing was sent.");
  process.exit(2);
}

if (queue.length === 0) {
  console.log(`Nothing to send.`);
  process.exit(0);
}

// --- broadcast (plain text, single BCC mirror like the digest sender) ---
let okCount = 0;
let errCount = 0;

for (const contact of queue) {
  try {
    const result = await resend.emails.send({
      from: FROM,
      to: contact.email,
      bcc: ["sales@sipiteno.com"],
      subject: SUBJECT,
      text: BODY_TEMPLATE.replace("{UNSUB_URL}", unsubscribeUrl(contact.email) || UNSUB_MAILTO.replace(/[<>]/g, "")),
      tags: [{ name: "email_key", value: EMAIL_KEY }],
      headers: unsubHeaders(contact.email),
    });
    if (result.error) throw new Error(result.error.message || String(result.error));

    sentLog[String(contact.email).toLowerCase()] = result.data?.id || null;
    saveSentLog(sentLog);

    okCount++;
    if (okCount % 10 === 0) console.log(`  sent ${okCount}/${queue.length}`);
    await new Promise((r) => setTimeout(r, 150));
  } catch (err) {
    errCount++;
    console.error(`  FAILED ${contact.email}: ${err.message}`);
  }
}

console.log(`\nDone. sent=${okCount} failed=${errCount} previously_sent=${Object.keys(sentLog).length - okCount} total_active=${active.length}`);
console.log(`Sent-log: ${SENT_LOG_FILE}`);
