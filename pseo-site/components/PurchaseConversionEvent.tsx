"use client";

import { useEffect } from "react";

/**
 * PurchaseConversionEvent: fires a GA4/Google Ads `purchase` event once the
 * gtag loader (PixelManager, mounted in the root layout) has initialized.
 *
 * The server component that renders the thank-you page already holds the
 * verified Stripe session (id + amount_total in cents), so we pass those in
 * as props. A short poll waits for `window.gtag` to appear, because the
 * loader is `afterInteractive` and its ready moment is not guaranteed to
 * precede this component's first effect.
 *
 * transaction_id = Stripe Checkout Session id (cs_...), so GA4 dedupes on
 * reload and Google Ads can match the conversion without double-counting.
 */
export default function PurchaseConversionEvent({
  valueCents,
  currency = "EUR",
  transactionId,
}: {
  valueCents: number;
  currency?: string;
  transactionId: string;
}) {
  useEffect(() => {
    let tries = 0;
    const fire = () => {
      try {
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "purchase", {
            currency,
            value: Math.round(valueCents) / 100,
            transaction_id: transactionId,
          });
          return;
        }
        if (++tries > 50) return; // ~5s timeout; give up rather than spin forever
        setTimeout(fire, 100);
      } catch {
        // never let an analytics call break the thank-you render
      }
    };
    fire();
  }, [valueCents, currency, transactionId]);

  return null;
}
