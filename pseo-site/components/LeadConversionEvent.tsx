"use client";

import { useEffect } from "react";

/**
 * LeadConversionEvent: fires a GA4/Google Ads `generate_lead` event once the
 * gtag loader (PixelManager, mounted in the root layout) has initialized.
 *
 * Mounted on the lead-capture success states:
 *   - SqueezeSuccess (free Sunday digest signup, home + /squeeze)
 *   - SectorIntent (/firstlook pre-checkout email + sector capture)
 *
 * A short poll waits for `window.gtag` to appear, because the loader is
 * `afterInteractive` and its ready moment is not guaranteed to precede this
 * component's first effect. Without this event, Google Ads has no "lead"
 * conversion to import and Quality Score / CPA are unmeasurable for the
 * Reddit -> /firstlook and Google -> /alternatives campaigns.
 */
export default function LeadConversionEvent() {
  useEffect(() => {
    let tries = 0;
    const fire = () => {
      try {
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "generate_lead");
          return;
        }
        if (++tries > 50) return; // ~5s timeout; give up rather than spin forever
        setTimeout(fire, 100);
      } catch {
        // never let an analytics call break the success render
      }
    };
    fire();
  }, []);

  return null;
}
