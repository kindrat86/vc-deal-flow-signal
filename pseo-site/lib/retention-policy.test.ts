import assert from "node:assert/strict";
import test from "node:test";
import {
  saveActionForReason,
  winbackSequenceForReason,
} from "./retention-policy";

test("maps every stated cancellation reason to its promised save step", () => {
  assert.equal(saveActionForReason("not_using"), "pause_30d");
  assert.equal(saveActionForReason("too_expensive"), "one_month_37");
  assert.equal(saveActionForReason("too_complex"), "tailored_starting_point");
  assert.equal(saveActionForReason("missing_features"), "tailored_starting_point");
  assert.equal(saveActionForReason("switched_service"), "clean_cancel");
  assert.equal(saveActionForReason("low_quality"), "clean_cancel");
  assert.equal(saveActionForReason("other"), "clean_cancel");
});

test("win-back sequence has the stated three recovery moments", () => {
  const sequence = winbackSequenceForReason("too_expensive");
  assert.deepEqual(sequence.map((step) => step.day), [7, 30, 90]);
  assert.match(sequence[0].subject, /useful/i);
  assert.match(sequence[2].subject, /resume/i);
});

test("normalizes Stripe feedback without inventing a reason", async () => {
  const { cancellationReasonFromStripe } = await import("./retention-policy");
  assert.equal(cancellationReasonFromStripe("too_expensive"), "too_expensive");
  assert.equal(cancellationReasonFromStripe("not_a_real_reason"), "other");
});
