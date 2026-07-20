#!/usr/bin/env node
/**
 * Scheduled outreach email sender.
 * Runs daily via launchd. Checks today's date against outreach-schedule.json,
 * sends any due emails via Resend, and logs sent IDs to outreach-sent.json
 * to prevent duplicates.
 *
 * Usage: node send-outreach.mjs [--dry-run]
 */

import { Resend } from "resend";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolveMx } from "dns/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes("--dry-run");

// Load .env
try {
  const envFile = readFileSync(resolve(__dirname, ".env"), "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (key) process.env[key] = value;
  }
} catch (e) {
  console.error("Warning: Could not load .env file:", e.message);
}

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`;
const QA_BCC = "sales@sipiteno.com"; // Live QA inbox — receives every production send

// Paths
const SCHEDULE_PATH = resolve(__dirname, "outreach-schedule.json");
const SENT_PATH = resolve(__dirname, "outreach-sent.json");

// Today in YYYY-MM-DD (local timezone)
const today = new Date().toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD

// Load schedule
const schedule = JSON.parse(readFileSync(SCHEDULE_PATH, "utf-8"));

// Load sent log (or create empty)
let sentLog = {};
if (existsSync(SENT_PATH)) {
  sentLog = JSON.parse(readFileSync(SENT_PATH, "utf-8"));
}

// Load validation cache (from validate-emails.mjs)
const VALIDATED_PATH = resolve(__dirname, "outreach-validated.json");
let validated = {};
if (existsSync(VALIDATED_PATH)) {
  validated = JSON.parse(readFileSync(VALIDATED_PATH, "utf-8"));
}

// MX check cache (in-memory for this run)
const mxCache = {};

async function checkMx(domain) {
  if (mxCache[domain] !== undefined) return mxCache[domain];
  try {
    await resolveMx(domain);
    mxCache[domain] = true;
  } catch {
    mxCache[domain] = false;
  }
  return mxCache[domain];
}

console.log(`[outreach] ${today} | ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
console.log(`[outreach] ${schedule.length} emails in schedule, ${Object.keys(sentLog).length} already sent`);

let sentCount = 0;
let dryRunCount = 0;
let skippedCount = 0;
let invalidCount = 0;

for (const email of schedule) {
  // Skip if already sent
  if (sentLog[email.id]) {
    skippedCount++;
    continue;
  }

  // Skip if not due yet
  if (email.sendDate > today) {
    continue;
  }

  // Skip if validation file says INVALID
  if (validated[email.to] && validated[email.to].status === "INVALID") {
    console.log(`[outreach] SKIP "${email.id}" — email ${email.to} marked INVALID (${validated[email.to].reason})`);
    sentLog[email.id] = {
      skippedAt: new Date().toISOString(),
      reason: "invalid_email",
      detail: validated[email.to].reason,
      to: email.to,
    };
    invalidCount++;
    continue;
  }

  // Live MX check as final guard
  const domain = email.to.split("@")[1];
  const hasMx = await checkMx(domain);
  if (!hasMx) {
    console.log(`[outreach] SKIP "${email.id}" — no MX records for ${domain}`);
    sentLog[email.id] = {
      skippedAt: new Date().toISOString(),
      reason: "no_mx_records",
      to: email.to,
    };
    invalidCount++;
    continue;
  }

  console.log(`[outreach] Sending "${email.id}" to ${email.to}...`);

  if (DRY_RUN) {
    console.log(`[outreach] DRY RUN — would send:`);
    console.log(`  From: ${FROM}`);
    console.log(`  To: ${email.to}`);
    console.log(`  Subject: ${email.subject}`);
    console.log(`  Body: ${email.body.slice(0, 100)}...`);
    dryRunCount++;
    continue;
  }

  try {
    // Send as plain text (better deliverability for cold outreach)
    const result = await resend.emails.send({
      from: FROM,
      bcc: QA_BCC,
      to: email.to,
      subject: email.subject,
      text: email.body + "\n\n---\nIf you'd prefer not to hear from me, just reply and I'll remove you immediately.",
      headers: {
        "List-Unsubscribe": `<mailto:${process.env.FROM_EMAIL}?subject=unsubscribe>`,
      },
    });

    const resendId = result.data?.id || "unknown";
    console.log(`[outreach] Sent "${email.id}" -> Resend ID: ${resendId}`);

    // Record in sent log
    sentLog[email.id] = {
      sentAt: new Date().toISOString(),
      resendId,
      to: email.to,
      subject: email.subject,
    };

    sentCount++;
  } catch (err) {
    console.error(`[outreach] FAILED "${email.id}" to ${email.to}: ${err.message}`);

    // Record failure so we can investigate (but allow retry — don't block)
    sentLog[email.id + "_failed_" + today] = {
      failedAt: new Date().toISOString(),
      error: err.message,
      to: email.to,
    };
  }
}

// Save sent log
writeFileSync(SENT_PATH, JSON.stringify(sentLog, null, 2));

if (DRY_RUN) {
  console.log(`[outreach] Done (DRY RUN). Would send: ${dryRunCount}, Skipped (already sent): ${skippedCount}, Invalid: ${invalidCount}`);
} else {
  console.log(`[outreach] Done. Sent: ${sentCount}, Skipped (already sent): ${skippedCount}, Invalid: ${invalidCount}`);
}
