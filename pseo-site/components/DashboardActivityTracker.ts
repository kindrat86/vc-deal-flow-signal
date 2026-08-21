"use client";

type ActivityProperties = Record<string, string | number | boolean | null | undefined>;

/** Best-effort product activity capture. It must never block dashboard use. */
export function trackCustomerActivity(event: string, properties: ActivityProperties = {}) {
  if (typeof window === "undefined") return;
  const posthog = (window as Window & {
    posthog?: { capture?: (name: string, props: ActivityProperties) => void };
  }).posthog;
  if (typeof posthog?.capture !== "function") return;
  try {
    posthog.capture(event, properties);
  } catch {
    // Analytics is optional. Product actions must still complete.
  }
}
