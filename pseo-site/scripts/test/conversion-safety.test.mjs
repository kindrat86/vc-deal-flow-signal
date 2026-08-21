import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const firstLookIntent = readFileSync(
  resolve(root, "app/api/firstlook/intent/route.ts"),
  "utf8",
);
const landingPixels = readFileSync(resolve(root, "../landing/pixels.js"), "utf8");
const pseoPixels = readFileSync(resolve(root, "components/PixelManager.tsx"), "utf8");
const landingCsp = readFileSync(resolve(root, "../landing/vercel.json"), "utf8");
const pseoCsp = readFileSync(resolve(root, "next.config.ts"), "utf8");
const dashboardPage = readFileSync(resolve(root, "../landing/dashboard.html"), "utf8");

test("First Look intent never reactivates or audience-adds a contact before explicit permission", () => {
  assert.doesNotMatch(firstLookIntent, /unsubscribed:\s*false/);
  assert.doesNotMatch(firstLookIntent, /await addToAudience\(/);
});

test("GitDealFlow ships no Meta or LinkedIn tracker or CSP allowance by default", () => {
  for (const source of [landingPixels, pseoPixels, landingCsp, pseoCsp]) {
    assert.doesNotMatch(source, /connect\.facebook\.net|snap\.licdn\.com/);
  }
});

test("Dashboard checkout sends the browser PostHog ID to the server-side purchase join", () => {
  assert.match(dashboardPage, /function gdfDistinctId\(\)/);
  assert.match(dashboardPage, /ph_distinct_id:\s*gdfDistinctId\(\)/);
});
