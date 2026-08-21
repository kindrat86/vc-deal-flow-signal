const test = require('node:test');
const assert = require('node:assert/strict');
const {
  isSuccessfulSignalLookup,
  shouldShowReviewPrompt,
} = require('../review-eligibility.js');

test('counts a returned tracked-company signal as a successful lookup', () => {
  assert.equal(
    isSuccessfulSignalLookup({ status: 'accelerating', commitVelocity14d: 42 }),
    true,
  );
});

test('does not count an untracked company as a successful lookup', () => {
  assert.equal(isSuccessfulSignalLookup({ status: 'no_data' }), false);
});

test('does not show a review prompt before five successful lookups', () => {
  assert.equal(
    shouldShowReviewPrompt(
      { successfulLookupCount: 4, reviewDismissals: 0, lastReviewPromptAt: 0 },
      1000,
      30,
    ),
    false,
  );
});

test('shows a review prompt after the fifth successful lookup when cooldown allows', () => {
  assert.equal(
    shouldShowReviewPrompt(
      { successfulLookupCount: 5, reviewDismissals: 0, lastReviewPromptAt: 0 },
      1000,
      30,
    ),
    true,
  );
});
