"use client";

import { useEffect, useRef } from "react";

/**
 * LeadCloseClient — analytics shim for the /walkthrough Lead Close A/B test
 * (Brunson Expert Secrets Ch 13 — Stack and Closes).
 *
 * The page renders all four lead-close variants stacked. CSS reveals only
 * the variant matching `html[data-lead-close]`. That attribute is set by the
 * inline blocking script in walkthrough/page.tsx before first paint, sourced
 * from the `gdf_close_variant` cookie that proxy.ts seeded at the edge.
 *
 * This component runs after hydration to:
 *   1. Resolve the variant the user actually saw (DOM is the source of truth
 *      — the inline script may have fallen back to the default if the cookie
 *      was missing for any reason, e.g. a crawler with cookies disabled).
 *   2. Fire `walkthrough_lead_close_view` to PostHog exactly once per page
 *      load, with the resolved variant + a short label, so we can compute
 *      conversion lift per variant against the existing Stripe checkout
 *      events.
 *   3. Wire click delegation on the lead-close section so any anchor inside
 *      it carries the variant tag on its `walkthrough_lead_close_cta_click`
 *      event — keeps attribution server-link-agnostic (works for both
 *      Stripe Checkout links and the free-tier signup link).
 *
 * No-op when window.posthog is not loaded yet (script defers until after
 * hydration on slow connections); we capture once posthog is ready via a
 * tiny retry loop. If the user navigates away before posthog loads we lose
 * the impression event — acceptable; the click event is the high-value
 * signal and that fires inside the user's own gesture which is always
 * after page load + script load.
 */

type Variant = "money" | "identity" | "pricing" | "urgency";

const VALID_VARIANTS: readonly Variant[] = ["money", "identity", "pricing", "urgency"];

// `window.posthog` is declared globally by PostHogPageView.tsx — we pull
// from the same loose surface here. Re-declaring would cause a TS2717
// clash across components that both extend Window with different shapes.
type WindowWithPostHog = Window & {
  posthog?: {
    capture?: (event: string, props?: Record<string, unknown>) => void;
  };
};

function getPostHog() {
  if (typeof window === "undefined") return undefined;
  return (window as WindowWithPostHog).posthog;
}

function readVariantFromDom(): Variant {
  if (typeof document === "undefined") return "money";
  const raw = document.documentElement.getAttribute("data-lead-close");
  if (raw && (VALID_VARIANTS as readonly string[]).includes(raw)) {
    return raw as Variant;
  }
  return "money";
}

function fireWhenReady(fn: () => void): void {
  if (typeof window === "undefined") return;
  if (getPostHog()?.capture) {
    fn();
    return;
  }
  // PostHog snippet may still be hydrating — retry briefly (max 6× over ~3s)
  // before giving up. This matches the warmup window for the script in the
  // layout's preconnect path.
  let tries = 0;
  const id = window.setInterval(() => {
    tries++;
    if (getPostHog()?.capture) {
      window.clearInterval(id);
      fn();
    } else if (tries >= 6) {
      window.clearInterval(id);
    }
  }, 500);
}

export default function LeadCloseClient() {
  const captured = useRef(false);

  useEffect(() => {
    if (captured.current) return;
    captured.current = true;

    const variant = readVariantFromDom();
    fireWhenReady(() => {
      getPostHog()?.capture?.("walkthrough_lead_close_view", {
        variant,
        page: "/walkthrough",
      });
    });

    // Click delegation — listen on the lead-close container so we don't have
    // to wire onClick on every anchor inside each of the four variant
    // blocks. addEventListener with `capture:true` so we beat any default
    // handlers that might preventDefault.
    const root = document.getElementById("lead-close-section");
    if (!root) return;

    function onClick(ev: MouseEvent) {
      const target = ev.target as Element | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const v = readVariantFromDom();
      const ctaLabel = anchor.getAttribute("data-cta-label") ?? anchor.textContent?.trim() ?? "";
      const href = anchor.getAttribute("href") ?? "";
      getPostHog()?.capture?.("walkthrough_lead_close_cta_click", {
        variant: v,
        cta_label: ctaLabel.slice(0, 80),
        href,
        page: "/walkthrough",
      });
    }

    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
