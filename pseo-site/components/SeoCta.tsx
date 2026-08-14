/**
 * SeoCta — the standard conversion block for cold programmatic-SEO traffic.
 *
 * Traffic Secrets: every content page is a funnel entry point and needs a
 * hook → offer. Most of our pSEO templates either dead-ended or leaked to
 * "more reading." This drops one consistent capture block (free Sunday
 * digest is the magnet — Brunson "front-end lead funnel") plus the
 * Attractive-Character signoff so the page doesn't read as a faceless SEO
 * surface.
 *
 * Defaults are Marcus-voiced (non-coding dealmaker): plain English, the
 * timing edge, "no code-reading." The primary CTA is the FREE digest — never
 * a paid page behind "free" copy (that bait/scent-mismatch is the bug this
 * replaces). Pass `secondary` for high-intent pages (e.g. €7 First Look on
 * comparison templates).
 */

import Link from "next/link";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

interface CTA {
  label: string;
  href: string;
}

interface Props {
  heading?: string;
  blurb?: string;
  primary?: CTA;
  secondary?: CTA;
  signoff?: boolean;
  signoffIndex?: number;
  className?: string;
}

const FREE_DIGEST = "https://gitdealflow.com/#signup";

export default function SeoCta({
  heading = "Five breakout startups, every Sunday, before the round gets crowded",
  blurb = "The free Acceleration Watch: five venture-backed teams accelerating on the engineering signal, translated into plain English, 21 to 47 days before the deck circulates. No code-reading, no card.",
  primary = { label: "Get the free Sunday issue →", href: FREE_DIGEST },
  secondary,
  signoff = true,
  signoffIndex = 0,
  className = "",
}: Props) {
  return (
    <section
      className={`rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 ${className}`}
      aria-label="Get the weekly engineering signal"
    >
      <h2 className="text-gray-100 font-semibold text-lg sm:text-xl mb-2 leading-snug">
        {heading}
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-2xl">
        {blurb}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={primary.href}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-white text-sm font-semibold transition-colors shadow-sm shadow-signal-500/30"
        >
          {primary.label}
        </Link>
        {secondary ? (
          <Link
            href={secondary.href}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 text-gray-200 hover:text-white text-sm font-medium transition-colors"
          >
            {secondary.label}
          </Link>
        ) : null}
      </div>
      {signoff ? (
        <DataNerdSignoff variant="compact" catchphraseIndex={signoffIndex} className="mt-5" />
      ) : null}
    </section>
  );
}
