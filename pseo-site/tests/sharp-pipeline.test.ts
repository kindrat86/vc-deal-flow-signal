import assert from "node:assert/strict";
import test from "node:test";

import {
  computeSharpReplyDeadline,
  normalizeSharpApplication,
} from "../lib/sharp-pipeline";

test("computes a 48-hour SLA and displays it in Athens time", () => {
  const submittedAt = new Date("2026-08-19T14:00:00.000Z");
  const deadline = computeSharpReplyDeadline(submittedAt);

  assert.equal(deadline.iso, "2026-08-21T14:00:00.000Z");
  assert.match(deadline.display, /Friday/);
  assert.match(deadline.display, /17:00/);
  assert.match(deadline.display, /EEST/);
});

test("normalizes a Sharp application into an Applied pipeline record", () => {
  const record = normalizeSharpApplication(
    {
      fund_name: "  Atlas Seed  ",
      contact_name: "  Jane Investor ",
      email: "JANE@ATLAS.EXAMPLE ",
      aum_or_deal_count: "€25M AUM, 12 deals/year",
      thesis: "Developer tools at seed.",
      sectors: "Developer tools, infrastructure",
      team_size: "4 investors",
      intended_use: "Build a pre-IC sourcing list.",
      budget_range: "sharp_tier",
      buyer_type: "fund",
      requested_tier: "sharp_tier",
      urgency: "IC review on 1 September",
      source: "sharp-apply",
    },
    new Date("2026-08-19T14:00:00.000Z"),
  );

  assert.equal(record.status, "applied");
  assert.equal(record.decision, "unclear");
  assert.equal(record.owner, "Maryan K.");
  assert.equal(record.email, "jane@atlas.example");
  assert.equal(record.fund_name, "Atlas Seed");
  assert.equal(record.budget_range, "sharp_tier");
  assert.equal(record.requested_tier, "sharp_tier");
  assert.equal(record.buyer_type, "fund");
  assert.equal(record.submitted_at, "2026-08-19T14:00:00.000Z");
  assert.equal(record.replied_at, null);
  assert.equal(record.next_step, "Review application and send a written decision.");
  assert.equal(record.next_step_date, "2026-08-21T14:00:00.000Z");
  assert.match(record.intent_note, /Build a pre-IC sourcing list/);
});

test("rejects an invalid buyer type instead of creating an untrackable record", () => {
  assert.throws(
    () =>
      normalizeSharpApplication(
        {
          fund_name: "Atlas",
          contact_name: "Jane",
          email: "jane@atlas.example",
          aum_or_deal_count: "12 deals/year",
          thesis: "Devtools",
          sectors: "Devtools",
          team_size: "4",
          intended_use: "Source deals",
          budget_range: "sharp_tier",
          buyer_type: "random" as never,
          requested_tier: "sharp_tier",
        },
        new Date("2026-08-19T14:00:00.000Z"),
      ),
    /buyer_type/,
  );
});
