"use client";

import Link from "next/link";

/**
 * HeroCtaButton — primary CTA in the first viewport.
 *
 * Added 2026-07-22 as part of the conversion repair: the hero had no
 * reachable action above the fold despite 64% of portfolio traffic landing
 * here. Anchors to the HomeSqueeze email opt-in and fires a PostHog event.
 */
export default function HeroCtaButton() {
  const handleClick = () => {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { posthog?: { capture: (e: string) => void } })
        .posthog
    ) {
      (
        window as unknown as { posthog: { capture: (e: string) => void } }
      ).posthog.capture("hero_cta_clicked");
    }
  };

  return (
    <Link
      href="#home-squeeze-route"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/30 transition-colors"
    >
      Get this Sunday&apos;s 5 names — free{" "}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
