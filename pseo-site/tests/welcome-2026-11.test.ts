import assert from "node:assert/strict";

import {
  SOAP_OPERA_EMAILS,
  SOAP_OPERA_F,
  SOAP_OPERA_I,
  WELCOME_2026_11_EMAILS,
  withWelcome2026_11,
} from "../lib/emails";

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

for (const tier of [SOAP_OPERA_EMAILS, SOAP_OPERA_F, SOAP_OPERA_I]) {
  const seq = withWelcome2026_11(tier);
  assert.deepEqual(seq.slice(0, 5), WELCOME_2026_11_EMAILS, "welcome leads the default cohort");
  const rest = seq.slice(5);
  assert.ok(rest.length > 0, "Day 8+ emails are kept");
  assert.ok(rest.every((e) => e.delayMs > THIRTY_MIN + 7 * DAY), "no old Day 0-7 email survives");
}

console.log("welcome-2026-11: ok");
