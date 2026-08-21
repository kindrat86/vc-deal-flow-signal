import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "../..");
const read = (file) => readFileSync(resolve(root, file), "utf8");

const cohort = [
  "harmonic-ai-vs-pitchbook",
  "pitchbook-vs-cb-insights",
  "cb-insights-vs-crunchbase",
  "crunchbase-vs-tracxn",
  "specter-vs-harmonic-ai",
  "affinity-vs-crunchbase",
  "affinity-vs-harmonic-ai",
  "dealroom-vs-pitchbook",
  "harmonic-ai-vs-tracxn",
  "harmonic-ai-vs-dealroom",
];

test("the GSC-selected comparison cohort has specific CTR descriptions", () => {
  const content = read("content/competitor-vs.ts");
  const page = read("app/vs/[slug]/page.tsx");

  assert.match(content, /VS_CTR_COHORT_DESCRIPTIONS/);
  for (const slug of cohort) assert.match(content, new RegExp(`"${slug}"`));
  assert.match(page, /VS_CTR_COHORT_DESCRIPTIONS\[canonicalSlug\]/);
  assert.match(page, /Independent comparison, updated/);
});
