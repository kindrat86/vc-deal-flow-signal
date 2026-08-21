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
    const readDistinctId = () => {
      const posthog = (window as Window & {
        posthog?: { get_distinct_id?: () => unknown };
      }).posthog;
      const value = posthog?.get_distinct_id?.();
      if (typeof value !== "string") return false;
      const trimmed = value.trim();
      if (!trimmed || trimmed.includes("@") || trimmed.length > 64) return false;
      setDistinctId(trimmed);
      return true;
    };

    // The site tracker is lazy-loaded. On a clean profile this client component
    // can mount first, so retry briefly instead of permanently dropping the
    // checkout-to-purchase attribution ID.
    if (readDistinctId()) return;
    const retryTimer = window.setInterval(() => {
      if (readDistinctId()) window.clearInterval(retryTimer);
    }, 100);
    const timeoutTimer = window.setTimeout(() => window.clearInterval(retryTimer), 5_000);
    return () => {
      window.clearInterval(retryTimer);
      window.clearTimeout(timeoutTimer);
    };
  }, []);

  return distinctId ? (
    <input type="hidden" name="ph_distinct_id" value={distinctId} />
  ) : null;
}
