import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../../components/GuidedConcierge.tsx", import.meta.url),
  "utf8",
);

test("GuidedConcierge renders a route-aware conversion control", () => {
  assert.match(source, /export default function GuidedConcierge\(\)/);
  assert.match(source, /<aside/);
  assert.match(source, /Not sure where to start\?/);
  assert.match(source, /concierge_opened/);
  assert.match(source, /concierge_option_clicked/);
  assert.match(source, /concierge_dismissed/);
  assert.match(source, /weekly_shortlist/);
  assert.match(source, /methodology/);
  assert.match(source, /scout_score/);
});

test("GuidedConcierge protects app, mirror, and privacy-opt-out surfaces", () => {
  assert.match(source, /\/account/);
  assert.match(source, /\/dashboard/);
  assert.match(source, /\/md\//);
  assert.match(source, /doNotTrack/);
  assert.match(source, /globalPrivacyControl/);
  assert.match(source, /bottom-40[^\n"]*sm:bottom-6/);
});
