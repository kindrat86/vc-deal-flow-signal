/**
 * VC Deal Flow Signal — popup controller.
 *
 * Handles:
 *  - Popup-open counting for upsell timing, persisted in chrome.storage.local.
 *  - Review prompt (5th successful tracked-company lookup, once per 30 days,
 *    max 3 dismissals — then never again).
 *  - Upsell banner (from 3rd use, deterministic A/B/C variant, cooldowns).
 *  - Power-user soft mention (10+ uses).
 *
 * Priority rule: the review prompt and the upsell NEVER render in the same
 * session. Review prompt wins; the upsell is suppressed that session.
 *
 * SECURITY NOTE: render functions set innerHTML, but ALL interpolated values
 * come from the hardcoded VARIANTS/REVIEW constants below (trusted constants
 * authored by us) and are additionally passed through escapeHtml()/escapeAttr().
 * No untrusted or user-supplied data ever reaches innerHTML. Safe by construction.
 */

(function () {
  const STATE_KEY = "gdf_popup_state_v1";

  // Cooldowns in milliseconds.
  const COOLDOWN = {
    dismissed: 14 * 24 * 60 * 60 * 1000, // 14 days
    cta_clicked: 30 * 24 * 60 * 60 * 1000, // 30 days
    ignored: 7 * 24 * 60 * 60 * 1000, // 7 days
    paused: 30 * 24 * 60 * 60 * 1000, // 30 days after 6 no-interaction impressions
    review: 30 * 24 * 60 * 60 * 1000, // 30 days between review prompts
  };

  const POWER_USER_THRESHOLD = 10;

  const REVIEW = {
    minUse: 5,
    maxDismissals: 3,
    headline: "Is the badge useful?",
    body:
      "An honest review — five stars or one — helps other investors find this. Takes 30 seconds.",
    cta: "Leave an honest review",
    ctaUrl:
      "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn/reviews",
    dismiss: "Not now",
  };

  // A/B/C upsell variants. Deterministic per install.
  const VARIANTS = [
    {
      id: "A",
      headline: "You're seeing one signal. The full panel tracks 350+ startups.",
      body:
        "This badge is the free layer. The Dashboard tracks every accelerating startup org on the panel — ranked weekly, filtered to your sectors.",
      cta: "See the Dashboard",
      ctaUrl:
        "https://signals.gitdealflow.com/dashboard?utm_source=extension&utm_medium=popup_upsell&utm_campaign=variant_a_dashboard",
      dismiss: "Maybe later",
    },
    {
      id: "B",
      headline: "The fundraise is announced in 3\u20136 weeks. You're early.",
      body:
        "Engineering acceleration precedes raises by three to six weeks. The free Sunday digest puts that lead time in your inbox every week.",
      cta: "Get the free Sunday digest",
      ctaUrl:
        "https://gitdealflow.com/?utm_source=extension&utm_medium=popup_upsell&utm_campaign=variant_b_digest#signup",
      dismiss: "No thanks",
    },
    {
      id: "C",
      headline: "Test the full signal for \u20AC7.",
      body:
        "The First Look unlocks a full sector sweep \u2014 every accelerating org in a sector you pick \u2014 one-time, with a 30-day guarantee.",
      cta: "Try a First Look",
      ctaUrl:
        "https://signals.gitdealflow.com/first-look?utm_source=extension&utm_medium=popup_upsell&utm_campaign=variant_c_firstlook",
      dismiss: "Maybe later",
    },
  ];

  // === Storage helpers ===
  function getState() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STATE_KEY], (res) => {
        resolve(res[STATE_KEY] || {});
      });
    });
  }
  function setState(state) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STATE_KEY]: state }, resolve);
    });
  }

  // === HTML escaping (defense in depth) ===
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  /** Deterministic variant from install ID: same install => same variant. */
  function pickVariant(installId) {
    let h = 0;
    const s = String(installId);
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return VARIANTS[Math.abs(h) % VARIANTS.length];
  }

  function renderCard(container, kind, copy, onCta, onDismiss) {
    container.innerHTML =
      '<div id="gdf-card" class="upsell-banner" role="complementary" aria-label="GitDealFlow">' +
      '<button class="upsell-close" id="gdf-close" aria-label="Dismiss">&times;</button>' +
      '<div class="upsell-headline">' +
      escapeHtml(copy.headline) +
      "</div>" +
      '<div class="upsell-body">' +
      escapeHtml(copy.body) +
      "</div>" +
      '<div class="upsell-cta-row">' +
      '<a class="upsell-cta" id="gdf-cta" href="' +
      escapeAttr(copy.ctaUrl) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(copy.cta) +
      "</a>" +
      '<button class="upsell-dismiss" id="gdf-dismiss">' +
      escapeHtml(copy.dismiss) +
      "</button>" +
      "</div>" +
      "</div>";
    document.getElementById("gdf-close").addEventListener("click", onDismiss);
    document.getElementById("gdf-dismiss").addEventListener("click", onDismiss);
    document.getElementById("gdf-cta").addEventListener("click", onCta);
  }

  function renderSoftMention(container) {
    container.innerHTML =
      '<div class="upsell-soft">Tracking 350+ startups. ' +
      '<a href="https://gitdealflow.com/?utm_source=extension&utm_medium=popup_soft&utm_campaign=power_user#signup" ' +
      'target="_blank" rel="noopener noreferrer">See the week\u2019s biggest accelerators \u2192</a></div>';
  }

  function removeCard(state) {
    const el = document.getElementById("gdf-card");
    if (el) el.remove();
    return setState(state);
  }

  async function main() {
    const container = document.getElementById("upsell-container");
    if (!container) return;

    const state = await getState();
    const now = Date.now();

    // Popup opens control upsell timing only. Review eligibility is driven by
    // successful lookup records written by content.js.
    state.popupOpenCount = (state.popupOpenCount || 0) + 1;
    await setState(state);
    const useCount = state.popupOpenCount;

    // --- Review prompt (priority over upsell) ---
    if (
      GDFReviewEligibility.shouldShowReviewPrompt(
        state,
        now,
        COOLDOWN.review
      )
    ) {
      state.lastReviewPromptAt = now;
      await setState(state);
      renderCard(
        container,
        "review",
        REVIEW,
        async () => {
          state.reviewCtaClickedAt = Date.now();
          await setState(state);
        },
        async () => {
          state.reviewDismissals = (state.reviewDismissals || 0) + 1;
          await removeCard(state);
        }
      );
      return; // never show review prompt AND upsell in one session
    }

    // --- Upsell banner ---
    if (useCount < 3) return;
    if (state.pausedUntil && now < state.pausedUntil) return;

    const lastDismiss = state.lastDismissedAt || 0;
    const lastCta = state.lastCtaClickedAt || 0;
    const lastIgnore = state.lastIgnoredAt || 0;
    const effectiveLast = Math.max(lastDismiss, lastCta, lastIgnore);
    const cooldown =
      effectiveLast === lastCta && lastCta
        ? COOLDOWN.cta_clicked
        : effectiveLast === lastDismiss && lastDismiss
          ? COOLDOWN.dismissed
          : COOLDOWN.ignored;
    if (effectiveLast && now - effectiveLast < cooldown) return;

    // Power users get the quiet soft mention.
    if (useCount >= POWER_USER_THRESHOLD) {
      renderSoftMention(container);
      return;
    }

    // Pick variant; rotate away from one dismissed 3+ times.
    let variant = pickVariant(String(state.installId || "gdf"));
    const seen = state.variantDismissCount || {};
    if ((seen[variant.id] || 0) >= 3) {
      variant = VARIANTS.find((v) => (seen[v.id] || 0) < 3) || variant;
    }

    let interacted = false;
    renderCard(
      container,
      "upsell",
      variant,
      async () => {
        interacted = true;
        state.lastCtaClickedAt = Date.now();
        state.totalNoInteraction = 0;
        await setState(state);
      },
      async () => {
        interacted = true;
        state.lastDismissedAt = Date.now();
        state.variantDismissCount = state.variantDismissCount || {};
        state.variantDismissCount[variant.id] =
          (state.variantDismissCount[variant.id] || 0) + 1;
        state.totalNoInteraction = (state.totalNoInteraction || 0) + 1;
        if (state.totalNoInteraction >= 6) {
          state.pausedUntil = Date.now() + COOLDOWN.paused;
          state.totalNoInteraction = 0;
        }
        await removeCard(state);
      }
    );

    // Popup closed without touching the banner => "ignore".
    window.addEventListener("unload", () => {
      if (!interacted && document.getElementById("gdf-card")) {
        const s = Object.assign({}, state);
        s.lastIgnoredAt = Date.now();
        s.totalNoInteraction = (s.totalNoInteraction || 0) + 1;
        if (s.totalNoInteraction >= 6) {
          s.pausedUntil = Date.now() + COOLDOWN.paused;
          s.totalNoInteraction = 0;
        }
        // Synchronous-ish best effort; chrome.storage.local.set is allowed in unload.
        chrome.storage.local.set({ [STATE_KEY]: s });
      }
    });
  }

  // Ensure a stable install ID exists, then run.
  getState().then(async (state) => {
    if (!state.installId) {
      state.installId =
        "gdf-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      await setState(state);
    }
    main();
  });
})();
