"use client";

import { useCallback, type ReactNode } from "react";

/**
 * WalkthroughCtaLink, fires the `walkthrough-cta` CustomEvent that
 * <WalkthroughVariantTracker /> listens for, then lets the browser handle
 * the navigation normally.
 *
 * This is split out so the variant pages can keep their CTA buttons
 * declarative (one element per close, no per-page event-handler boilerplate)
 * while the tracker component stays decoupled, adding a new CTA on either
 * page just requires using this wrapper.
 *
 * Brunson Expert Secrets §4 Ch 19, Test, Test, Test. Every CTA on the
 * variant pages emits a click event with `kind` so we can segment by close
 * type (primary buy, signup fallback) inside PostHog.
 */

type CtaKind = "primary" | "signup";

interface Props {
  href: string;
  kind: CtaKind;
  className?: string;
  children: ReactNode;
}

export default function WalkthroughCtaLink({
  href,
  kind,
  className,
  children,
}: Props) {
  // Memoise so an inline arrow doesn't re-create the handler each render.
  // This component renders once per page in practice, but cheap insurance.
  const onClick = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      window.dispatchEvent(
        new CustomEvent("walkthrough-cta", {
          detail: { kind, href },
        })
      );
    } catch {
      // Non-fatal, click should still navigate.
    }
  }, [href, kind]);

  // External Stripe + apex signup URLs need to leave SPA, using <a>, not
  // <Link>. The CTA destinations on these pages are all cross-origin.
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
