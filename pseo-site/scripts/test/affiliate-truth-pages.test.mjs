import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

test("retired affiliate leaderboard redirects and is noindex", () => {
  const source = read("app/affiliates/leaderboard/page.tsx");
  assert.ok(source.includes('redirect("/affiliates")'));
  assert.ok(source.includes("robots: { index: false, follow: false }"));
  assert.ok(source.includes('alternates: { canonical: "/affiliates" }'));
});

test("affiliate program page explains verified terms without invented proof", () => {
  const source = read("app/affiliates/page.tsx");
  const normalized = source.replace(/\s+/g, " ");
  for (const needle of [
    "What is verified today",
    "What affiliates can say",
    "What is not published yet",
    "No affiliate earnings, conversion rates, partner counts, or rankings are published yet",
    "350+ startup organizations across 15 sectors",
  ]) {
    assert.ok(normalized.includes(needle), `affiliate page missing ${needle}`);
  }
  for (const banned of ["average affiliate earns", "top 10 earners", "top conversion rate"]) {
    assert.ok(!source.toLowerCase().includes(banned), `affiliate page reintroduced ${banned}`);
  }
});
