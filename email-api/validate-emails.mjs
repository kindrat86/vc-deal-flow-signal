#!/usr/bin/env node
/**
 * Email validator for outreach schedule.
 * Checks MX records + SMTP RCPT TO for each unique address.
 * Saves results to outreach-validated.json.
 *
 * Usage: node validate-emails.mjs
 */

import { resolveMx } from "dns/promises";
import { createConnection } from "net";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEDULE_PATH = resolve(__dirname, "outreach-schedule.json");
const VALIDATED_PATH = resolve(__dirname, "outreach-validated.json");

// Load schedule
const schedule = JSON.parse(readFileSync(SCHEDULE_PATH, "utf-8"));
const uniqueEmails = [...new Set(schedule.map((e) => e.to))];

// Load prior results (skip already-validated)
let prior = {};
if (existsSync(VALIDATED_PATH)) {
  prior = JSON.parse(readFileSync(VALIDATED_PATH, "utf-8"));
}

console.log(
  `[validate] ${uniqueEmails.length} unique emails in schedule, ${Object.keys(prior).length} already validated\n`
);

const results = { ...prior };
let checked = 0;

for (const email of uniqueEmails) {
  if (prior[email]) {
    console.log(`[skip] ${email} — already validated: ${prior[email].status}`);
    continue;
  }

  const domain = email.split("@")[1];
  console.log(`[check] ${email}`);

  // Step 1: MX lookup
  let mxRecords;
  try {
    mxRecords = await resolveMx(domain);
    mxRecords.sort((a, b) => a.priority - b.priority);
  } catch {
    results[email] = {
      status: "INVALID",
      reason: `No MX records for ${domain}`,
      checkedAt: new Date().toISOString(),
    };
    console.log(`  INVALID — no MX records for ${domain}\n`);
    checked++;
    continue;
  }

  const mxHost = mxRecords[0].exchange;
  console.log(`  MX OK — ${mxHost}`);

  // Step 2: SMTP RCPT TO verification
  try {
    const smtp = await smtpVerify(email, mxHost);
    results[email] = {
      status: smtp.status,
      reason: smtp.reason,
      mxHost,
      checkedAt: new Date().toISOString(),
    };
    console.log(`  ${smtp.status} — ${smtp.reason}\n`);
  } catch (err) {
    // SMTP check failed (port blocked, timeout, etc.) — MX was valid though
    results[email] = {
      status: "MX_VALID",
      reason: `MX OK but SMTP check failed: ${err.message}`,
      mxHost,
      checkedAt: new Date().toISOString(),
    };
    console.log(`  MX_VALID — SMTP inconclusive: ${err.message}\n`);
  }

  checked++;

  // 2s delay between checks to be polite
  if (checked < uniqueEmails.length) {
    await new Promise((r) => setTimeout(r, 2000));
  }
}

// Save results
writeFileSync(VALIDATED_PATH, JSON.stringify(results, null, 2));

// Summary
const counts = { VALID: 0, MX_VALID: 0, CATCH_ALL: 0, INVALID: 0 };
for (const r of Object.values(results)) {
  counts[r.status] = (counts[r.status] || 0) + 1;
}

console.log("─".repeat(50));
console.log(`[validate] Done. Checked ${checked} new emails.`);
console.log(
  `  VALID: ${counts.VALID}  |  MX_VALID: ${counts.MX_VALID}  |  CATCH_ALL: ${counts.CATCH_ALL}  |  INVALID: ${counts.INVALID}`
);

if (counts.INVALID > 0) {
  console.log("\nINVALID emails (will be skipped by send-outreach):");
  for (const [email, r] of Object.entries(results)) {
    if (r.status === "INVALID") console.log(`  - ${email}: ${r.reason}`);
  }
}

// ────────────────────────────────────────────
// SMTP verification via RCPT TO
// ────────────────────────────────────────────

function smtpVerify(email, mxHost, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const socket = createConnection({ port: 25, host: mxHost });
    let step = 0;
    let buffer = "";

    const cleanup = () => {
      socket.removeAllListeners();
      socket.destroy();
    };

    socket.setTimeout(timeout);
    socket.on("timeout", () => {
      cleanup();
      reject(new Error("timeout"));
    });
    socket.on("error", (err) => {
      cleanup();
      reject(err);
    });

    socket.on("data", (data) => {
      buffer += data.toString();

      // Wait for complete response (ends with \r\n and has a space after code)
      if (!buffer.match(/^\d{3} /m)) return;

      const code = parseInt(buffer.slice(0, 3));
      const line = buffer.trim();
      buffer = "";

      switch (step) {
        case 0: // Server greeting
          if (code >= 200 && code < 300) {
            socket.write("EHLO gitdealflow.com\r\n");
            step = 1;
          } else {
            cleanup();
            reject(new Error(`greeting rejected: ${line}`));
          }
          break;

        case 1: // EHLO response
          if (code === 250) {
            socket.write("MAIL FROM:<signal@gitdealflow.com>\r\n");
            step = 2;
          } else {
            cleanup();
            reject(new Error(`EHLO rejected: ${line}`));
          }
          break;

        case 2: // MAIL FROM response
          if (code === 250) {
            socket.write(`RCPT TO:<${email}>\r\n`);
            step = 3;
          } else {
            cleanup();
            reject(new Error(`MAIL FROM rejected: ${line}`));
          }
          break;

        case 3: // RCPT TO response — this is the answer
          socket.write("QUIT\r\n");
          cleanup();

          if (code === 250) {
            // Check for catch-all by testing a random address
            resolve({
              status: "VALID",
              reason: `RCPT TO accepted (${code})`,
            });
          } else if (code === 550 || code === 551 || code === 553) {
            resolve({
              status: "INVALID",
              reason: `Mailbox does not exist (${code}: ${line})`,
            });
          } else if (code === 450 || code === 451 || code === 452) {
            resolve({
              status: "MX_VALID",
              reason: `Greylisted or temp error (${code})`,
            });
          } else {
            resolve({
              status: "MX_VALID",
              reason: `Unexpected response (${code}: ${line})`,
            });
          }
          break;
      }
    });
  });
}
