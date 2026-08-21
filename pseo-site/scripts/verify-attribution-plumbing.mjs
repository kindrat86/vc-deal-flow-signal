#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const required = {
  "components/CheckoutDistinctId.tsx": ["ph_distinct_id", "get_distinct_id", "@"],
  "components/DashboardActivityTracker.ts": ["trackCustomerActivity", "posthog", "capture"],
  "lib/resend-consent.ts": ["getResendConsentStatus", "suppressions", "clear"],
  "lib/referral-core.ts": ["isReferralEligibleTier"],
  "lib/referrals.ts": ["getReferralAttribution"],
};

for (const [relativePath, tokens] of Object.entries(required)) {
  const absolutePath = join(root, relativePath);
  assert.ok(existsSync(absolutePath), `missing module: ${relativePath}`);
  const source = readFileSync(absolutePath, "utf8");
  for (const token of tokens) {
    assert.ok(source.includes(token), `${relativePath} is missing required token: ${token}`);
  }
}

console.log("[verify-attribution-plumbing] PASS");
