import assert from "node:assert/strict";
import test from "node:test";

import { isWinback90Due, WINBACK90_MIN_DAYS } from "./retention-policy";

const NOW = new Date("2026-11-01T12:00:00.000Z");

function state(overrides: Record<string, unknown> = {}) {
  return {
    cancelledAt: "2026-08-01T12:00:00.000Z",
    cancellationReason: "too_expensive",
    ...overrides,
  } as Parameters<typeof isWinback90Due>[0];
}

test("day-90 winback is due 92 days after cancellation with no send yet", () => {
  assert.equal(isWinback90Due(state(), NOW), true);
});

test("not due before the minimum age", () => {
  assert.equal(isWinback90Due(state({ cancelledAt: "2026-10-15T12:00:00.000Z" }), NOW), false);
});

test("never due twice", () => {
  assert.equal(
    isWinback90Due(state({ winback90SentAt: "2026-10-30T00:00:00.000Z" }), NOW),
    false,
  );
});

test("requires a cancellation reason", () => {
  assert.equal(isWinback90Due(state({ cancellationReason: undefined }), NOW), false);
});

test("requires cancellation state at all", () => {
  assert.equal(isWinback90Due(null, NOW), false);
  assert.equal(isWinback90Due({}, NOW), false);
});

test("rejects unparseable timestamps", () => {
  assert.equal(isWinback90Due(state({ cancelledAt: "not-a-date" }), NOW), false);
});

test("minimum age is 85 days so the note lands near day 90", () => {
  assert.equal(WINBACK90_MIN_DAYS, 85);
});
