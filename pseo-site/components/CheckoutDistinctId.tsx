"use client";

import { useEffect, useState } from "react";

/**
 * Adds an anonymous PostHog id to checkout forms so the server can join a
 * completed checkout to the visitor's pre-checkout journey. Never send an
 * identified id or an email to Stripe metadata.
 */
export default function CheckoutDistinctId() {
  const [distinctId, setDistinctId] = useState("");

  useEffect(() => {
    const posthog = (window as Window & {
      posthog?: { get_distinct_id?: () => unknown };
    }).posthog;
    const value = posthog?.get_distinct_id?.();
    if (typeof value !== "string") return;
    const trimmed = value.trim();
    if (!trimmed || trimmed.includes("@") || trimmed.length > 64) return;
    setDistinctId(trimmed);
  }, []);

  return distinctId ? (
    <input type="hidden" name="ph_distinct_id" value={distinctId} />
  ) : null;
}
