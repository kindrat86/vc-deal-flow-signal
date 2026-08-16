"use client";

/**
 * Field TTFB beacon (rewritten 2026-08-17).
 *
 * WHY THIS EXISTS: the 2026-08-16 "single-source CWV" refactor made this
 * component a no-op because posthog-js 1.417 natively captures
 * $web_vitals for LCP/FCP/CLS/INP. That was correct for those four
 * metrics but ORPHANED TTFB: the native SDK does not capture TTFB at all
 * (verified in PostHog project 143861: zero native-shape TTFB values
 * across 10+ hosts in 28 days). The field TTFB stream went dark on
 * 2026-08-16 and nothing noticed for days.
 *
 * So this beacon reports TTFB ONLY, via window.posthog.capture with
 * metric_name='TTFB' (the "named" event shape cwv_field.py already
 * reads). No double-count risk: the native SDK never emits TTFB, and
 * this component sends no other metric. Do NOT re-add LCP/FCP/CLS/INP
 * capture here; that genuinely double-counts against the native SDK
 * (see the 2026-08-16 CWV audit note in git history).
 *
 * MEASUREMENT VALIDITY: the web-vitals library reports TTFB of ~0 for
 * prerendered pages (responseStart precedes activationStart) and stale
 * values for back-forward (bfcache) restores. Both pollute a field p75
 * with meaningless zeros; the pre-08-16 stream showed p75 of 23-52ms
 * for exactly that reason. This beacon therefore reports ONLY
 * navigate/reload/restore navigations with value > 0: real
 * server-response waits. That is the stream the field TTFB regression
 * check consumes.
 *
 * Consumed by: gitdealflow-rank-tracker/field_ttfb_check.py (the
 * n >= 500/week gated regression check feeding the daily north-star
 * digest and the weekly rank board).
 * Guarded by: scripts/verify-no-regressions.ts section 39.
 */
import { useReportWebVitals } from "next/web-vitals";

// Structural type only (no `declare global`): PostHogPageView.tsx reads
// window.posthog the same way; a global augmentation would clash with
// other declarations of the same window property.
type PostHogLike = {
  capture?: (event: string, props?: Record<string, unknown>) => void;
};

const SKIP_NAV = new Set(["prerender", "back-forward"]);
const CAPTURE_TRIES = 30; // ~15s max wait for lazyOnload posthog to be ready

function captureTtfb(props: Record<string, unknown>, attempt = 0) {
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
      window.setTimeout(() => captureTtfb(props, attempt + 1), 500);
    }
  } catch {
    /* the beacon must never throw */
  }
}

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    try {
      if (metric.name !== "TTFB") return;
      const navType =
        (metric as { navigationType?: string }).navigationType ?? "navigate";
      if (SKIP_NAV.has(navType)) return;
      const v = Number(metric.value);
      if (!isFinite(v) || v <= 0) return;
      captureTtfb({
        $pathname: window.location.pathname,
        $current_url: window.location.href,
        metric_name: "TTFB",
        metric_value: v,
        metric_rating: metric.rating ?? (v <= 800 ? "good" : v <= 1800 ? "needs-improvement" : "poor"),
        metric_id: metric.id,
        navigation_type: navType,
        beacon: "ttfb-v2",
      });
    } catch {
      /* the beacon must never throw */
    }
  });
  return null;
}
