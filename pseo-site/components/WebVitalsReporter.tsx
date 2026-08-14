"use client";

/**
 * Core Web Vitals beacon, ships LCP / INP / CLS / FCP / TTFB / FID
 * to the existing PostHog EU instance as custom events.
 *
 * Closes the audit gap "no CWV measurement; only $pageview captured" from
 * the SEO/pSEO/GEO/AIO/AEO scorecard (Performance: 75/100). Without this
 * beacon, INP / LCP regressions are invisible until they show up in CrUX
 * 28 days later.
 *
 * Implementation notes:
 * - Uses Next 16's bundled `next/web-vitals` (no new dependency).
 * - Forwards every metric to `window.posthog.capture("$web_vitals", …)`
 *   with the standard property names PostHog's CWV dashboard expects
 *   (`$web_vitals_<NAME>_value`, `$web_vitals_<NAME>_rating`,
 *   `$web_vitals_<NAME>_id`). Uses a single combined event so PostHog's
 *   "Web Vitals" insight aggregates correctly.
 * - Honors Global Privacy Control (Sec-GPC: 1) and DNT, silently no-ops.
 * - Self-referrer normalization is delegated to PostHog's `before_send`
 *   hook in layout.tsx; this component does not touch referrer state.
 */

import { useReportWebVitals } from "next/web-vitals";

type PostHog = {
  capture: (event: string, props?: Record<string, unknown>) => void;
  __loaded?: boolean;
};

declare global {
  interface Window {
    posthog?: PostHog;
  }
}

// Derive the metric shape from the hook itself instead of importing from
// `next/dist/compiled/web-vitals` (no `.d.ts` ships there). This stays
// correct across Next minor upgrades without us pinning to a private path.
type WebVitalsMetric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

// Web Vitals "good / needs-improvement / poor" thresholds (Google CrUX
// 75th-percentile). Hoisted to module scope so the rating function does
// not re-allocate per render and so the report handler below can be
// module-stable.
const THRESHOLDS: Record<string, { good: number; ni: number }> = {
  LCP: { good: 2500, ni: 4000 },
  INP: { good: 200, ni: 500 },
  CLS: { good: 0.1, ni: 0.25 },
  FCP: { good: 1800, ni: 3000 },
  TTFB: { good: 800, ni: 1800 },
  FID: { good: 100, ni: 300 },
};

function rate(
  name: string,
  value: number,
): "good" | "needs-improvement" | "poor" {
  const t = THRESHOLDS[name];
  if (!t) return "good";
  if (value <= t.good) return "good";
  if (value <= t.ni) return "needs-improvement";
  return "poor";
}

// Stable, module-scoped report handler. `useReportWebVitals` re-registers
// six PerformanceObservers whenever the callback identity changes (its
// internal `useEffect` is keyed on `[reportWebVitalsFn]`). Defining the
// handler outside the component guarantees a single registration for the
// lifetime of the page.
function report(metric: WebVitalsMetric) {
  if (typeof window === "undefined") return;

  // Honor opt-out signals. PostHog has its own DNT handling, but layering
  // GPC here ensures we never even build the event payload when the user
  // has signaled opt-out.
  try {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.globalPrivacyControl === true || nav.doNotTrack === "1") return;
  } catch {
    // navigator unavailable in odd embedding contexts; fail open.
  }

  const ph = window.posthog;
  if (!ph?.capture || !ph.__loaded) return;

  const { name, value, id, delta } = metric;
  const rating = rate(name, value);

  try {
    ph.capture("$web_vitals", {
      // PostHog Web Vitals insight schema (per-metric properties).
      [`$web_vitals_${name}_value`]: value,
      [`$web_vitals_${name}_rating`]: rating,
      [`$web_vitals_${name}_event_id`]: id,
      // Flat fields for ad-hoc analysis, segmentation, and CSV exports.
      metric_name: name,
      metric_value: value,
      metric_rating: rating,
      metric_id: id,
      metric_delta: delta,
      $pathname: window.location.pathname,
    });
  } catch {
    // Capturing must never throw into the render path.
  }
}

export default function WebVitalsReporter() {
  useReportWebVitals(report);
  return null;
}
