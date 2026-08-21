import assert from "node:assert/strict";
import predictionsData from "../data/predictions.json";
import { buildPublicProof } from "../lib/public-proof-core";

const proof = buildPublicProof(predictionsData.weeks);

assert.deepEqual(proof.scorecard, {
  published: 20,
  graded: 10,
  hits: 0,
  misses: 10,
  pending: 10,
  source: "/scorecard",
});
assert.equal(proof.asOf, "2026-08-13");

console.log("[verify-public-proof] proof values derive from predictions.json");
