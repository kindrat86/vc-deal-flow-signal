import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import {
  LEADERBOARD,
  LEADERBOARD_SNAPSHOT_DATE,
  PROGRAM_STATS,
  TIER_META,
  ARCHETYPE_LABEL,
} from "@/content/affiliate-leaderboard";

export const dynamic = "force-static";

const PORTAL_URL = "https://gitdealflow.refgrow.com";

export const metadata: Metadata = {
  title:
    "Affiliate Leaderboard — Top 10 Earners (May 2026) | GitDealFlow",
  description:
    "Public, anonymized leaderboard of GitDealFlow's top affiliates. €5,000+ earned by Platinum tier; 11.3% top conversion rate from an Agent integration; ~140 affiliates active. Updated monthly.",
  alternates: { canonical: "/affiliates/leaderboard" },
  openGraph: {
    title: "Affiliate Leaderboard — Top 10 Earners",
    description:
      "Anonymized monthly snapshot. €5,000+ Platinum, 11.3% top CVR, ~140 affiliates active.",
    url: "https://signals.gitdealflow.com/affiliates/leaderboard",
    type: "article",
  },
};

const SORTED_LEADERBOARD = [...LEADERBOARD].sort((a, b) => {
  const tierOrder: Record<string, number> = {
    platinum: 0,
    gold: 1,
    silver: 2,
    bronze: 3,
  };
  return tierOrder[a.tier] - tierOrder[b.tier];
});

export default function AffiliateLeaderboardPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://signals.gitdealflow.com/affiliates/leaderboard#webpage",
        url: "https://signals.gitdealflow.com/affiliates/leaderboard",
        name: "GitDealFlow Affiliate Leaderboard",
        description:
          "Public, anonymized monthly snapshot of GitDealFlow's top affiliates by lifetime commission earned, conversion rate, and tier.",
        inLanguage: "en-US",
        isPartOf: {
          "@id": "https://signals.gitdealflow.com/#website",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Affiliates",
            item: "https://signals.gitdealflow.com/affiliates",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Leaderboard",
            item: "https://signals.gitdealflow.com/affiliates/leaderboard",
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Top affiliates by lifetime commission earned",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: SORTED_LEADERBOARD.length,
        itemListElement: SORTED_LEADERBOARD.map((row, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: row.pseudonym,
          description: `${ARCHETYPE_LABEL[row.archetype]} · ${row.audience} · ${row.commissionRange} commission · ${row.conversionRate} conversion rate`,
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks
        path="/affiliates/leaderboard"
        qaCategory="business-model"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/affiliates"
            className="hover:text-gray-300 transition-colors"
          >
            Affiliates
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Leaderboard</span>
        </nav>

        <header className="mb-10">
          <p className="text-amber-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Public · Anonymized · Updated monthly
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Affiliate Leaderboard
          </h1>
          <p
            className="text-gray-300 text-base leading-relaxed mb-3 max-w-2xl"
            data-agent-summary
          >
            Public snapshot of GitDealFlow&rsquo;s top 10 affiliates by lifetime
            commission earned. Pseudonyms are stable — the same affiliate keeps
            the same handle across snapshots so returning visitors can track
            their own row. Real names and addresses never leave the Refgrow
            dashboard.
          </p>
          <p className="text-gray-500 text-sm">
            Snapshot:{" "}
            <span className="text-gray-300 font-mono">
              {LEADERBOARD_SNAPSHOT_DATE}
            </span>{" "}
            · Next update: 2026-06-09
          </p>
        </header>

        {/* Program-level stats. Letterman / Affiliate Army social-proof. */}
        <section
          className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
          aria-label="Program stats"
        >
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Affiliates total
            </p>
            <p className="text-gray-100 font-mono text-lg">
              {PROGRAM_STATS.totalAffiliates}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Active 30d
            </p>
            <p className="text-gray-100 font-mono text-lg">
              {PROGRAM_STATS.activeAffiliates30d}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Top CVR
            </p>
            <p className="text-emerald-300 font-mono text-lg">
              {PROGRAM_STATS.topConversionRate}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Lifetime paid
            </p>
            <p className="text-gray-100 font-mono text-base">
              {PROGRAM_STATS.totalCommissionsLifetimeRange}
            </p>
          </div>
        </section>

        {/* The leaderboard. */}
        <section className="mb-12" aria-label="Top 10 affiliates">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Top 10 by lifetime commission
          </h2>
          <ol className="space-y-2">
            {SORTED_LEADERBOARD.map((row, i) => {
              const tone = TIER_META[row.tier];
              return (
                <li
                  key={row.pseudonym}
                  className={`rounded-lg border ${tone.classes.split(" ").filter((c) => c.startsWith("border")).join(" ")} bg-slate-900/60 p-4`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-gray-300 font-mono text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <p className="text-gray-100 font-semibold text-sm">
                          {row.pseudonym}
                        </p>
                        <span className="text-gray-500 text-xs">
                          · {ARCHETYPE_LABEL[row.archetype]} · joined{" "}
                          {row.joinedMonth}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tone.classes}`}
                        >
                          {tone.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed mb-2">
                        {row.audience}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Commission:</span>{" "}
                          <span className="text-emerald-300 font-mono">
                            {row.commissionRange}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">CVR:</span>{" "}
                          <span className="text-sky-300 font-mono">
                            {row.conversionRate}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Top product:</span>{" "}
                          <span className="text-gray-300">
                            {row.topProductReferred}
                          </span>
                        </div>
                      </div>
                      {row.badges.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {row.badges.map((b) => (
                            <span
                              key={b}
                              className="text-[10px] px-1.5 py-0.5 rounded border border-slate-700 bg-slate-950/60 text-gray-400 font-mono"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Tier ladder — invitation to climb. */}
        <section
          className="mb-12 rounded-xl border border-amber-700/40 bg-amber-950/20 p-6 sm:p-8"
          aria-label="Tier ladder"
        >
          <h2 className="text-amber-300 text-sm font-medium mb-3 uppercase tracking-wider">
            Tier ladder
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Tiers are unlocked by lifetime commission earned, not by sign-up
            agreements. New affiliates start at Bronze on first conversion and
            climb on every payout cycle.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {(["platinum", "gold", "silver", "bronze"] as const).map((t) => {
              const meta = TIER_META[t];
              return (
                <div
                  key={t}
                  className={`rounded-lg border p-3 ${meta.classes}`}
                >
                  <p className="text-xs uppercase tracking-wider mb-1 font-semibold">
                    {meta.label}
                  </p>
                  <p className="text-xs font-mono">{meta.range}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA — affiliate signup. */}
        <section className="mb-10 rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-6 sm:p-8 text-center">
          <h2 className="text-emerald-300 text-sm font-medium mb-2 uppercase tracking-wider">
            Want to be on this list?
          </h2>
          <p className="text-gray-200 text-base leading-relaxed mb-5">
            20% lifetime commission. €399 on each Sector Sweep. €19.40/mo on
            each Insider Circle subscription. 60-day cookie. No approval queue.
          </p>
          <a
            href={PORTAL_URL}
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors"
          >
            Join the program →
          </a>
          <p className="text-gray-500 text-xs mt-3">
            Average affiliate earns{" "}
            <span className="text-gray-300 font-mono">
              {PROGRAM_STATS.averageEarningsPerActiveAffiliate}
            </span>{" "}
            · Median time to first conversion:{" "}
            <span className="text-gray-300 font-mono">
              {PROGRAM_STATS.averageDaysToFirstConversion} days
            </span>
          </p>
        </section>

        <p className="text-xs text-gray-400 text-center">
          See also:{" "}
          <Link
            href="/affiliates"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /affiliates
          </Link>{" "}
          (program overview) ·{" "}
          <Link
            href="/affiliates/funnel-hack"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /affiliates/funnel-hack
          </Link>{" "}
          (clone-ready swipe kit) ·{" "}
          <Link
            href="/affiliates/top-partners"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /affiliates/top-partners
          </Link>{" "}
          (50 publishers we&rsquo;d like to partner with)
        </p>
      </div>
    </>
  );
}
