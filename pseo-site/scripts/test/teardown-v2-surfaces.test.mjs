import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const pseoRoot = path.resolve(import.meta.dirname, "../..");
const repoRoot = path.resolve(pseoRoot, "..");
const read = (root, relative) => fs.readFileSync(path.join(root, relative), "utf8");

const pseoContractFiles = [
  "app/teardown/page.tsx",
  "app/thanks/teardown/page.tsx",
  "app/pricing/page.tsx",
  "app/api/v1/pricing.json/route.ts",
  "app/llms.txt/route.ts",
  "app/llms-full.txt/route.ts",
  "app/llms-search.json/route.ts",
];

const landingContractFiles = [
  "landing/index.html",
  "landing/subscribe-thanks.html",
  "landing/pricing.html",
  "landing/de/pricing.html",
  "landing/es/pricing.html",
  "landing/md/pricing.md",
  "landing/llms-full.src.txt",
];

const contractClauses = [
  "enter one startup at checkout",
  "work starts when payment succeeds",
  "within 24 hours",
  "verified public-github activity teardown",
  "coverage verdict plus one replacement startup",
  "no reply is required",
];

const forbiddenClaims = [
  /hand-written by the founder/i,
  /founder writes every teardown personally/i,
  /within 24h on weekdays/i,
  /within 24 hours on weekdays/i,
  /refund the €1 inside the same hour/i,
  /immediate\s+€1 refund/i,
  /tweet teardown auto-refunds/i,
  /manual reply within 4 hours/i,
  /within four business hours/i,
  /next-business-morning/i,
  /reply with the startup name/i,
  /reply with the startup/i,
  /clock starts when the tweet arrives/i,
  /no public commit data means no signal/i,
  /every open paid offer carries the 30-day/i,
  /every paid tier ships with a 30-day/i,
  /tweet teardown[\s\S]{0,200}30-day refund guarantee/i,
  /30-day signal-or-it's-free on every paid rung/i,
];

for (const relative of pseoContractFiles) {
  test(`${relative} carries teardown_v2 without legacy claims`, () => {
    const source = read(pseoRoot, relative);
    const normalized = source.toLowerCase();
    for (const clause of contractClauses) {
      assert.ok(normalized.includes(clause), `${relative} missing v2 clause: ${clause}`);
    }
    for (const pattern of forbiddenClaims) {
      assert.doesNotMatch(source, pattern, `${relative} revived ${pattern}`);
    }
  });
}

for (const relative of landingContractFiles) {
  test(`${relative} carries teardown_v2 without legacy claims`, () => {
    const source = read(repoRoot, relative);
    const normalized = source.toLowerCase();
    for (const clause of contractClauses) {
      assert.ok(normalized.includes(clause), `${relative} missing v2 clause: ${clause}`);
    }
    for (const pattern of forbiddenClaims) {
      assert.doesNotMatch(source, pattern, `${relative} revived ${pattern}`);
    }
  });
}

test("the stale teardown thank-you route permanently redirects to the canonical route", () => {
  const source = read(pseoRoot, "app/tweet-teardown/thanks/page.tsx");
  assert.ok(source.includes('permanentRedirect("/thanks/teardown")'));
  for (const pattern of forbiddenClaims) assert.doesNotMatch(source, pattern);
});

test("general terms exclude Tweet Teardown from broad refund promises", () => {
  const source = read(repoRoot, "landing/terms.html");
  assert.match(source, /Tweet Teardown/i);
  assert.match(source, /refund requests are reviewed manually/i);
  assert.doesNotMatch(source, /full refund within 30 days of purchase, no questions asked/i);
});

test("the teardown v2 surface contract runs in prebuild", () => {
  const pkg = read(pseoRoot, "package.json");
  assert.ok(pkg.includes("node --test scripts/test/teardown-v2-surfaces.test.mjs"));
});
