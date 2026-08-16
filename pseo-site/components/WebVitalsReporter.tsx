"use client";

/**
 * Field CWV beacon (rewritten 2026-08-17, extended 2026-08-19).
 *
 * Captures the three metrics the posthog-js native SDK does NOT capture
 * cleanly:
 *
 *   - TTFB: the SDK never emits it at all (verified in project 143861: zero
 *     native-shape TTFB values across 10+ hosts in 28 days). This beacon is
 *     the ONLY field TTFB source; field_ttfb_check.py keys on beacon='ttfb-v2'.
 *
 *   - LCP + FCP: the SDK DOES emit these, but its desktop samples carry
 *     background-tab dwell (email/X/HN links cmd-clicked open, so the paint
 *     fires only on tab focus and the metric includes unread-tab time;
 *     measured apex LCP p75 3016ms / FCP 3110ms vs true mobile ~489ms).
 *     useReportWebVitals routes through web-vitals v4, which applies the
 *     firstHiddenTime guard (entry.startTime < firstHiddenTime) and drops
 *     dwell-deferred paints, so beacon LCP/FCP desktop are TRUE paint.
 *     They carry beacon='dwell-filtered' + metric_name so the collector
 *     (cwv_field.py lcp_basis/fcp_basis) can quote them instead of the
 *     contaminated SDK blend.
 *
 * CLS + INP stay on the native SDK: they are not dwell-contaminated and a
 * second path would double-count.
 *
 * Consumed by: gitdealflow-rank-tracker/cwv_field.py + rank_board.py
 * Guarded by: scripts/verify-no-regressions.ts §0 + §39.
 */
import { useReportWebVitals } from "next/web-vitals";

// Structural type only (no `declare global`): PostHogPageView.tsx reads
// window.posthog the same way; a global augmentation would clash with
// other declarations of the same window property.
type PostHogLike = {
  capture?: (event: string, props?: Record<string, unknown>) => void;
};

// TTFB is meaningless on prerender/bfcache restores; LCP/FCP are valid there
// (web-vitals re-reports bfcache LCP with a fresh timer).
const SKIP_NAV = new Set(["prerender", "back-forward"]);
const CAPTURE_TRIES = 30; // ~15s max wait for lazyOnload posthog to be ready

// Google CWV rating thresholds, used only as a fallback when the library
// omits `rating` (it normally supplies one from its own thresholds).
const RATING: Record<string, [number, number]> = {
  LCP: [2500, 4000],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

function capture(props: Record<string, unknown>, attempt = 0) {
  try {
    const ph = (window as unknown as { posthog?: PostHogLike }).posthog;
    if (ph && typeof ph.capture === "function") {
      ph.capture("$web_vitals", props);
      return;
    }
    // posthog is strategy=lazyOnload but TTFB fires at hydration: the
    // value is already measured, so retrying late costs nothing and
    // closes the race that would otherwise drop early TTFB beacons.
    if (attempt < CAPTURE_TRIES) {
      window.setTimeout(() => capture(props, attempt + 1), 500);
    }
  } catch {
    /* the beacon must never throw */
  }
}

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    try {
      // LCP/FCP/TTFB only; CLS/INP stay on the native SDK (no double-count).
      if (metric.name !== "LCP" && metric.name !== "FCP" && metric.name !== "TTFB") return;
      const navType =
        (metric as { navigationType?: string }).navigationType ?? "navigate";
      if (metric.name === "TTFB" && SKIP_NAV.has(navType)) return;
      const v = Number(metric.value);
      if (!isFinite(v) || v <= 0) return;
      const [good, ni] = RATING[metric.name] ?? [0, 0];
      capture({
        $pathname: window.location.pathname,
        $current_url: window.location.href,
        metric_name: metric.name,
        metric_value: v,
        metric_rating:
          metric.rating ??
          (v <= good ? "good" : v <= ni ? "needs-improvement" : "poor"),
        metric_id: metric.id,
        navigation_type: navType,
        beacon: metric.name === "TTFB" ? "ttfb-v2" : "dwell-filtered",
      });
    } catch {
      /* the beacon must never throw */
    }
  });
  return null;
}
