"use client";

/**
 * CWV instrumentation architecture note (updated 2026-08-16).
 *
 * posthog-js 1.417 (loaded via layout.tsx, strategy=lazyOnload)
 * auto-captures $web_vitals natively: that is the SINGLE source of CWV
 * truth for signals.gitdealflow.com in PostHog project 143861. It has
 * been streaming since deployment (2,276 events in the 14d before this
 * note, metric_ids intact, p75 FCP 229ms / LCP median 903ms).
 *
 * This component is intentionally a NO-OP. The earlier custom capture
 * path here double-reported metrics: next/web-vitals + this capture()
 * ran IN ADDITION to the SDK's native collection, polluting PostHog's
 * CWV insight with duplicate $web_vitals events under different ids.
 * Verified in PostHog before this change (see 2026-08-16 CWV audit:
 * native events present on every portfolio host running posthog-js
 * 1.417, custom beacon contributed 0 until a same-day endpoint fix).
 *
 * The apex beacon (landing/pixels.js) forwards CWV to GA4 only;
 * PostHog there is likewise served by the native SDK.
 *
 * Do not re-add a capture() here without first checking for native
 * $web_vitals events in PostHog, or you will double-count again.
 */

import { useReportWebVitals } from "next/web-vitals";

export default function WebVitalsReporter() {
  // Intentionally not reporting: see architecture note above.
  useReportWebVitals(() => {});
  return null;
}
