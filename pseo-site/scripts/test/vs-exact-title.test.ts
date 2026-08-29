import assert from "node:assert/strict";
import test from "node:test";

import * as competitorVs from "../../content/competitor-vs";

test("curated comparison hooks render verbatim without destructive year truncation", () => {
  const buildTitle = (competitorVs as Record<string, unknown>).buildVsMetadataTitle;

  assert.equal(typeof buildTitle, "function", "buildVsMetadataTitle must be exported");
  if (typeof buildTitle !== "function") return;

  assert.equal(
    buildTitle("harmonic-ai-vs-dealroom", "unused fallback", 2026),
    "Harmonic.ai vs Dealroom: Which Is Better for Sourcing?",
  );
});
