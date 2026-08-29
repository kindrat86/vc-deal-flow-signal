"use client";

type ActivityProperties = Record<string, string | number | boolean | null | undefined>;

/**
 * Best-effort product activity capture. It must never block dashboard use.
 * Dual-writes: PostHog (analytics) AND /api/customer-activity (durable
 * customer-health state in the Resend contact, used by the retention
 * dispatcher for pre-churn and idle detection).
 */
export function trackCustomerActivity(event: string, properties: ActivityProperties = {}) {
  if (typeof window === "undefined") return;
  const posthog = (window as Window & {
    posthog?: { capture?: (name: string, props: ActivityProperties) => void };
  }).posthog;
  if (typeof posthog?.capture === "function") {
    try {
      posthog.capture(event, properties);
    } catch {
      // Analytics is optional. Product actions must still complete.
    }
  }
  try {
    void fetch("/api/customer-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, properties }),
    }).catch(() => undefined);
  } catch {
    // Health tracking is optional too.
  }
}
