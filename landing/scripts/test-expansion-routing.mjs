import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const confirmed = readFileSync(new URL("../confirmed.html", import.meta.url), "utf8");
const confirmedMirrors = [
  confirmed,
  readFileSync(new URL("../de/confirmed.html", import.meta.url), "utf8"),
  readFileSync(new URL("../es/confirmed.html", import.meta.url), "utf8"),
];

test("Dashboard-qualified confirmation route presents Dashboard as the primary offer", () => {
  assert.match(confirmed, /D:\s*\{[\s\S]*?tier:\s*["']dashboard["']/);
  assert.match(confirmed, /D:\s*\{[\s\S]*?primaryHref:\s*["']\/dashboard["']/);
  assert.match(confirmed, /D:\s*\{[\s\S]*?offerPrice:\s*["']€49["']/);
  assert.match(confirmed, /D:\s*\{[\s\S]*?offerCadence:\s*["']\/mo["']/);
});

test("confirmation card exposes all fields needed to replace the First Look offer", () => {
  for (const id of [
    "member-perk-copy",
    "benefit-copy-1",
    "benefit-copy-2",
    "benefit-copy-3",
    "benefit-copy-4",
    "offer-price",
    "offer-cadence",
    "offer-price-note",
  ]) {
    assert.match(confirmed, new RegExp(`id=["']${id}["']`), `missing #${id}`);
  }
});

test("upsell click analytics use the selected offer tier instead of hardcoded firstlook", () => {
  assert.match(confirmed, /tier:\s*offerTier/);
  assert.doesNotMatch(
    confirmed,
    /confirmed_upsell_clicked[^\n]+tier:\s*["']firstlook["']/,
  );
});

test("all confirmation mirrors use the locked observation claim, never fundraises", () => {
  for (const page of confirmedMirrors) {
    assert.doesNotMatch(page, /219 documented fundraises/i);
    assert.doesNotMatch(page, /weeks before 219 startup-period observations/i);
    assert.match(page, /219 startup-period observations across 55 startups/i);
    assert.match(page, /no linked funding-event labels/i);
  }
});
