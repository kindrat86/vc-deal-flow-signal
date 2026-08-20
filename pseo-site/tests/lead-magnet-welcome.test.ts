import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { LEAD_MAGNET_WELCOME_EMAILS } from "../lib/emails";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(root, "..");
const subscribeRoute = readFileSync(join(root, "app/api/subscribe/route.ts"), "utf8");
const verifyRoute = readFileSync(join(root, "app/api/verify/route.ts"), "utf8");
const homepage = readFileSync(join(repoRoot, "landing/index.html"), "utf8");

assert.equal(
  LEAD_MAGNET_WELCOME_EMAILS.length,
  5,
  "lead-magnet subscribers must receive exactly five welcome emails",
);

assert.deepEqual(
  LEAD_MAGNET_WELCOME_EMAILS.map((email) => email.delayMs),
  [0, 1, 3, 5, 7].map((days) => days * 24 * 60 * 60 * 1000),
  "welcome cadence must be immediate, day 1, day 3, day 5, and day 7",
);

const subjects = LEAD_MAGNET_WELCOME_EMAILS.map((email) => email.subject);
assert.equal(new Set(subjects).size, 5, "every welcome email needs a distinct subject");

for (const [index, email] of LEAD_MAGNET_WELCOME_EMAILS.entries()) {
  assert.match(email.html, /Unsubscribe/i, `email ${index + 1} lost its unsubscribe footer`);
  assert.match(email.html, /The Data Nerd/, `email ${index + 1} lost the product sender sign-off`);
}

assert.match(
  LEAD_MAGNET_WELCOME_EMAILS[0].html,
  /https:\/\/gitdealflow\.com\/downloads\/velocity-verdict-cheat-sheet\.pdf/,
  "email 1 must deliver the promised PDF",
);
assert.match(
  LEAD_MAGNET_WELCOME_EMAILS[4].html,
  /https:\/\/buy\.stripe\.com\//,
  "email 5 must close on a direct Stripe payment link",
);

assert.match(subscribeRoute, /"lead-magnet"/, "subscribe route must preserve the lead-magnet cohort");
assert.match(verifyRoute, /LEAD_MAGNET_WELCOME_EMAILS/, "verify route must dispatch the lead-magnet sequence");
assert.match(homepage, /data-source="velocity-verdict"/, "homepage must include the dedicated lead-magnet form");
assert.match(homepage, /cohort:\s*'lead-magnet'/, "homepage must enroll the form in the lead-magnet cohort");
assert.match(homepage, /lead_magnet_verify_sent/, "homepage must track the lead-magnet capture separately");

console.log("lead-magnet welcome contract passed");
