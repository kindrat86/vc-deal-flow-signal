import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { WELCOME_2026_11_EMAILS } from "../lib/emails";

const DAY = 24 * 60 * 60 * 1000;
const THIRTY_MIN = 30 * 60 * 1000;

assert.equal(WELCOME_2026_11_EMAILS.length, 5, "approved welcome has exactly five emails");
assert.deepEqual(
  WELCOME_2026_11_EMAILS.map((e) => e.delayMs),
  [0, 1, 3, 5, 7].map((d) => THIRTY_MIN + d * DAY),
  "welcome cadence must be Day 0, 1, 3, 5, 7 after verification",
);
assert.deepEqual(
  WELCOME_2026_11_EMAILS.map((e) => e.subject),
  [
    "Why you get five names, not fifty",
    "The spreadsheet that started this",
    "0 out of 20",
    "The part nobody asks about",
    "Five a week, 25 a month, or all of them",
  ],
  "subjects are the approved text",
);

for (const [i, e] of WELCOME_2026_11_EMAILS.entries()) {
  assert.match(e.html, /href="mailto:signals@gitdealflow\.com"[^>]*>Reply to unsubscribe</, `email ${i + 1} lost the unsubscribe anchor injectUnsubscribeLink rewrites`);
  assert.match(e.html, /utm_campaign=soap-2026-11&amp;utm_content=e\d/, `email ${i + 1} lost its sequence UTM`);
  assert.doesNotMatch(e.html, /utm_source=email/, `email ${i + 1} got double UTM tagging`);
}

// The default cohort (every quiz tier) schedules ONLY the five welcome
// emails: nothing after Day 7, so nothing lands in the deferred drip plan.
assert.ok(
  WELCOME_2026_11_EMAILS.every((e) => e.delayMs <= THIRTY_MIN + 7 * DAY),
  "no welcome email may fall past Day 7",
);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const verifyRoute = readFileSync(join(root, "app/api/verify/route.ts"), "utf8");
const sequenceExpr = verifyRoute.slice(
  verifyRoute.indexOf("const sequence ="),
  verifyRoute.indexOf("const MAX_SCHEDULE_MS"),
);
assert.match(sequenceExpr, /\? LAUNCH_EMAILS\s*:[\s\S]*WELCOME_2026_11_EMAILS;/, "default cohort must resolve to the welcome sequence");
assert.doesNotMatch(sequenceExpr, /SOAP_OPERA/, "no old Soap Opera sequence may be scheduled for new default signups");
assert.match(sequenceExpr, /LEAD_MAGNET_WELCOME_EMAILS/, "gitdealflow.com Velocity Verdict cohort is untouched");

console.log("welcome-2026-11: ok");
