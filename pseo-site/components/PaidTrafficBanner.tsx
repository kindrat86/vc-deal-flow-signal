"use client";

import { useEffect, useState } from "react";

/**
 * PaidTrafficBanner — UTM-aware top banner that customizes the headline
 * for paid traffic without breaking the static rendering of the host page.
 *
 * Mounts on /firstlook (the €7 tripwire landing).  When `?utm_source` is
 * present in the URL, the banner shows a channel-specific opening line
 * that matches the ad copy, so the visitor sees continuity from creative
 * to landing — Brunson's "scent" rule.
 *
 * Returns null on first paint (no UTMs detected yet) so we never paint
 * a blank banner above-the-fold for organic traffic.  The check runs
 * client-side after hydration; flicker is acceptable because it's
 * additive (organic users see nothing extra; paid users see a banner
 * appear within ~50ms).
 */

type ChannelCopy = {
  /** Tag shown in the badge ("From Reddit", "From TLDR", etc.) */
  badge: string;
  /** The headline override. */
  headline: string;
  /** Sub-line — keep <120 chars. */
  sub: string;
};

const CHANNEL_COPY: Record<string, ChannelCopy> = {
  reddit: {
    badge: "From Reddit",
    headline:
      "You came from a thread about deal flow. Here's the €7 way to test the signal on your own thesis.",
    sub: "Pick a sector at checkout. Full deep-dive PDF + raw CSV in your inbox within 24 hours. Refunded if we don't surface 3 names you didn't already know.",
  },
  google: {
    badge: "From Search",
    headline:
      "Looking for a Harmonic / Tracxn alternative? Here's the €7 way to test the data side-by-side.",
    sub: "Same engineering-acceleration data, no enterprise contract, 24-hour deliverable. Credited toward Dashboard if you upgrade in 14 days.",
  },
  tldr: {
    badge: "From TLDR",
    headline:
      "Saw us in TLDR? Here's the GitHub-momentum signal we couldn't fit in 200 characters.",
    sub: "Pay €7, pick a sector, get the full deep-dive in 24h. Built on the SSRN-published 219-startup panel.",
  },
  thegeneralist: {
    badge: "From The Generalist",
    headline:
      "From The Generalist. The deep-dive version of the lead-time chart, applied to your thesis.",
    sub: "€7 once. One sector. Top 25 ranked orgs + 3 pre-Crunchbase breakouts + raw CSV. Refundable if we don't beat your current sourcing motion.",
  },
  newsletter: {
    badge: "From Newsletter",
    headline:
      "From the newsletter sponsorship — here's the GitHub-momentum signal in full.",
    sub: "Pay €7, pick a sector, get the deep-dive in 24h. Credited toward Dashboard upgrade for 14 days.",
  },
  devto: {
    badge: "From dev.to",
    headline:
      "From dev.to. The engineering-side version of why VCs miss the best devtools companies.",
    sub: "Same data the founder reads on Sunday — applied to your thesis sector for €7, delivered in 24h.",
  },
};

export default function PaidTrafficBanner() {
  const [copy, setCopy] = useState<ChannelCopy | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source")?.toLowerCase();
    if (!source) return;
    const matched = CHANNEL_COPY[source];
    if (matched) setCopy(matched);
  }, []);

  if (!copy) return null;

  return (
    <div
      role="region"
      aria-label="Paid traffic welcome banner"
      className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl px-5 py-4 mb-6 text-slate-800"
      // Hydration-safety: this content is client-only by design.
      // Server renders an empty fragment; client mounts after URL parse.
      suppressHydrationWarning
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 mb-1">
        {copy.badge}
      </div>
      <h2 className="text-lg sm:text-xl font-semibold leading-snug text-slate-900 m-0">
        {copy.headline}
      </h2>
      <p className="text-sm text-slate-700 mt-2 leading-relaxed">{copy.sub}</p>
    </div>
  );
}
