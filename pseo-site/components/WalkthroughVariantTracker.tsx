"use client";

import { useEffect } from "react";

/**
 * WalkthroughVariantTracker — pixel-light PostHog event emitter for the
 * /walkthrough length A/B (Brunson Expert Secrets §3 Ch 15 — Webinar Variations).
 *
 * Two surfaces are head-to-head on the same argument:
 *   • /walkthrough/5min — 800 words, ~5-minute read
 *   • /walkthrough/90s  —  ~250 words, ~90-second read
 *
 * The /walkthrough/quick router does the bucket assignment (sticky in
 * localStorage so the same visitor always lands on the same variant).
 * This tracker fires on every variant page render so retention,
 * scroll-depth, and CTA-click data lands in PostHog under matching event
 * names regardless of how the visitor arrived.
 *
 * Events emitted:
 *   walkthrough_variant_view          — fires once on mount per variant
 *   walkthrough_variant_cta_click     — wired via window-event listener;
 *                                       the CTA <a>/<button> dispatches
 *                                       a CustomEvent("walkthrough-cta",
 *                                       {detail:{kind:"primary"|"signup"}}).
 *
 * Anonymity-safe: no PII, only variant + path. Brunson canon (Expert Ch 19
 * "Test, Test, Test") — every change should leave a measurable trace, and
 * conversion deltas should drive the next ship.
 */

type Variant = "5min" | "90s";

interface Props {
  /** Which variant this page is. */
  variant: Variant;
  /** Word count, for descriptive analytics. */
  wordCount: number;
  /** Read-time in seconds (rough — used for engagement-rate denominator). */
  readSeconds: number;
}

declare global {
  interface Window {
    __walkthroughVariantViewed?: Record<Variant, boolean>;
  }
}

export default function WalkthroughVariantTracker({
  variant,
  wordCount,
  readSeconds,
}: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dedupe: a soft-nav back to the page within the same SPA session
    // shouldn't double-count.
    if (!window.__walkthroughVariantViewed) {
      window.__walkthroughVariantViewed = { "5min": false, "90s": false };
    }
    if (window.__walkthroughVariantViewed[variant]) return;
    window.__walkthroughVariantViewed[variant] = true;

    // Read the bucket the /walkthrough/quick router stamped (if any).
    // If the visitor came in via a direct link to /walkthrough/5min or
    // /walkthrough/90s, there's no router stamp — that's fine, we still
    // log the view event with `assignment_source: "direct"`.
    let assignmentSource: "router" | "direct" = "direct";
    let assignedVariant: Variant | null = null;
    try {
      const stored = window.localStorage.getItem("walkthrough_variant");
      if (stored === "5min" || stored === "90s") {
        assignedVariant = stored;
        assignmentSource = "router";
      }
    } catch {
      // localStorage blocked / private mode — degrade gracefully.
    }

    const ph = window.posthog;
    if (ph?.capture && ph.__loaded) {
      try {
        ph.capture("walkthrough_variant_view", {
          variant,
          word_count: wordCount,
          read_seconds: readSeconds,
          assignment_source: assignmentSource,
          assigned_variant: assignedVariant,
          path: window.location.pathname,
        });
      } catch {
        // Non-fatal — analytics shouldn't break rendering.
      }
    }

    // CTA listener — the variant pages dispatch a CustomEvent on click so
    // we can keep the tracker decoupled from individual CTA components.
    function onCtaClick(e: Event) {
      const detail = (e as CustomEvent<{ kind?: string; href?: string }>)
        .detail;
      const ph2 = window.posthog;
      if (!ph2?.capture || !ph2.__loaded) return;
      try {
        ph2.capture("walkthrough_variant_cta_click", {
          variant,
          word_count: wordCount,
          cta_kind: detail?.kind ?? "unknown",
          cta_href: detail?.href ?? null,
          path: window.location.pathname,
        });
      } catch {
        // Non-fatal.
      }
    }

    window.addEventListener("walkthrough-cta", onCtaClick);
    return () => window.removeEventListener("walkthrough-cta", onCtaClick);
  }, [variant, wordCount, readSeconds]);

  return null;
}
