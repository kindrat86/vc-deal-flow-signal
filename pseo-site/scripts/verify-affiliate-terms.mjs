#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pseoAffiliate = readFileSync(join(root, "app/affiliates/page.tsx"), "utf8");
const apexAffiliate = readFileSync(join(root, "..", "landing/affiliates.html"), "utf8");
const jointVentures = readFileSync(join(root, "..", "landing/jv.html"), "utf8");

const forbiddenCommissionClaims = /(?:30%\s*(?:recurring|commission)|35%\s*(?:recurring|of subscriptions)|40%\s*recurring|35-40%)/i;

for (const [name, source] of [
  ["signals affiliate page", pseoAffiliate],
  ["apex affiliate page", apexAffiliate],
  ["joint-venture page", jointVentures],
]) {
  assert.doesNotMatch(source, forbiddenCommissionClaims, `${name} contains a commission claim that contradicts the verified 20% Refgrow offer`);
}

assert.match(pseoAffiliate, /20% recurring commission/i, "signals affiliate page must state the verified 20% recurring offer");
assert.match(apexAffiliate, /https:\/\/signals\.gitdealflow\.com\/affiliates/, "apex affiliate page must point to the canonical terms page");
assert.match(jointVentures, /Commission terms are agreed in writing for each co-marketing project\./, "JV page must not publish unverified revenue-share tiers");

console.log("[verify-affiliate-terms] PASS");
