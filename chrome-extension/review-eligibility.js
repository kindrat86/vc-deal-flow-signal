(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.GDFReviewEligibility = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function isSuccessfulSignalLookup(data) {
    return !!(
      data &&
      typeof data === 'object' &&
      typeof data.status === 'string' &&
      data.status !== 'no_data'
    );
  }

  function shouldShowReviewPrompt(state, now, cooldownMs) {
    return !!(
      state &&
      (state.successfulLookupCount || 0) >= 5 &&
      !state.reviewCtaClickedAt &&
      (state.reviewDismissals || 0) < 3 &&
      now - (state.lastReviewPromptAt || 0) >= cooldownMs
    );
  }

  return { isSuccessfulSignalLookup, shouldShowReviewPrompt };
});
