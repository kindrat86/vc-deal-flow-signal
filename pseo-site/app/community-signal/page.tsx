import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  COMMUNITY_GROUPS,
  COMMUNITY_STATUS_META,
  YIELD_META,
  communityStatusCounts,
  communityYieldCounts,
  totalCommunityCount,
  assertCommunityCounts,
  type CommunityStatus,
  type YieldTier,
} from "@/content/community-signal";

export const dynamic = "force-static";

// Build-time sanity check — every group's roster must match its declared
// `expected` count. If a future edit drifts a group off, the build catches
// it here rather than letting a malformed list ship.
assertCommunityCounts();

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title:
    "Community Signal — communities ranked by deal-flow yield, indexed by type",
  description:
    "/voices indexes rooms by platform (Reddit-100, HN-100, X-100). Community Signal indexes them by community type — indie founder forums, AI builder rooms, devtools maker rooms, VC and angel forums, OSS maintainer spaces, infra and platform-eng circles — each ranked by deal-flow yield.",
  alternates: { canonical: "/community-signal" },
  openGraph: {
    title:
      "Community Signal — communities ranked by deal-flow yield, indexed by type",
    description:
      "Ten community types, each a ranked roster of the rooms where developer-investors and stealth-stage builders first show up.",
    url: `${SITE}/community-signal`,
    type: "article",
  },
};

const YIELD_BADGE_CLASS: Record<YieldTier, string> = {
  primary: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  secondary: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  ambient: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

const STATUS_BADGE_CLASS: Record<CommunityStatus, string> = {
  engage: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  watch: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  hold: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  read: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  blocked: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const ORDERED_YIELDS: YieldTier[] = ["primary", "secondary", "ambient"];
const ORDERED_STATUSES: CommunityStatus[] = [
  "engage",
  "watch",
  "hold",
  "read",
  "blocked",
];

export default function CommunitySignalIndexPage() {
  const total = totalCommunityCount();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/community-signal`,
        name: "Community Signal — communities ranked by deal-flow yield, indexed by type",
        description:
          "Ten community-type rosters, each ranked by deal-flow yield. Cousin of /voices but indexed by purpose, not by platform.",
        url: `${SITE}/community-signal`,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Community Signal",
            item: `${SITE}/community-signal`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Community-type rosters ranked by deal-flow yield",
        numberOfItems: COMMUNITY_GROUPS.length,
        itemListElement: COMMUNITY_GROUPS.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.label,
          item: {
            "@type": "WebPage",
            "@id": `${SITE}/community-signal/${g.slug}`,
            name: `${g.label} — deal-flow yield roster`,
            description: g.tagline,
          },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/community-signal`}
        languages={getHreflangLanguages("/community-signal")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/community-signal" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Community Signal</span>
          </nav>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Indexed by community type · Ranked by deal-flow yield · {total} rooms
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Community Signal —{" "}
            <span className="text-emerald-400">communities ranked</span>{" "}
            by deal-flow yield.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            /voices indexes rooms by platform — 100 subreddits, 100 X accounts,
            100 HN attention slots. Community Signal indexes the same audience
            by community <em>type</em> instead — the indie-founder forum, the
            AI-builder Discord, the OSS-maintainer Slack, the platform-eng
            circle. Same map, different cross-section.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Each entry is a public surface — a subreddit, a Discord invite, a
            Slack landing page, a Discourse forum, a newsletter homepage. Each
            community is ranked by its deal-flow yield tier (
            <span className="text-emerald-300">primary</span> /{" "}
            <span className="text-sky-300">secondary</span> /{" "}
            <span className="text-slate-400">ambient</span>) and tagged with
            our engagement status (engage / watch / hold / read / blocked).
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            Anonymity rule, restated: we name <em>communities</em>, not
            individuals. Listing a Discord ≠ listing its members. The
            individual founders and contributors we surface live inside the
            paid product — that&rsquo;s the buyer&rsquo;s edge.
          </p>
        </header>

        <section
          aria-label="Yield-tier legend"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
        >
          <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
            How the yield tiers read
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {ORDERED_YIELDS.map((y) => (
              <li
                key={y}
                className={`rounded-lg border px-3 py-2.5 ${YIELD_BADGE_CLASS[y]}`}
              >
                <p className="text-[11px] uppercase tracking-wider font-semibold">
                  {YIELD_META[y].short}
                </p>
                <p className="text-[11px] opacity-90 leading-snug pt-1">
                  {YIELD_META[y].long}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="grid gap-5"
          aria-label="Community-type rosters"
        >
          {COMMUNITY_GROUPS.map((g) => {
            const ycounts = communityYieldCounts(g.slug);
            const scounts = communityStatusCounts(g.slug);
            return (
              <Link
                key={g.slug}
                href={`/community-signal/${g.slug}`}
                className="block rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-700/50 transition-colors p-5 sm:p-6 space-y-3 group"
              >
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                    /community-signal/{g.slug}
                  </p>
                  <span className="text-[10px] text-slate-500 tabular-nums">
                    {g.items.length} rooms
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug group-hover:text-emerald-200 transition-colors">
                  {g.label}.
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {g.tagline}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {g.archetype}
                </p>
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {ORDERED_YIELDS.map((y) =>
                    ycounts[y] === 0 ? null : (
                      <li
                        key={y}
                        className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${YIELD_BADGE_CLASS[y]}`}
                        title={YIELD_META[y].long}
                      >
                        <span className="tabular-nums">{ycounts[y]}</span>
                        <span className="ml-1.5">{YIELD_META[y].short}</span>
                      </li>
                    ),
                  )}
                  {ORDERED_STATUSES.map((s) =>
                    scounts[s] === 0 ? null : (
                      <li
                        key={`s-${s}`}
                        className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${STATUS_BADGE_CLASS[s]}`}
                        title={COMMUNITY_STATUS_META[s].long}
                      >
                        <span className="tabular-nums">{scounts[s]}</span>
                        <span className="ml-1.5">
                          {COMMUNITY_STATUS_META[s].short}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
                <p className="text-emerald-400 text-sm font-semibold pt-1 group-hover:text-emerald-300">
                  Open the roster →
                </p>
              </Link>
            );
          })}
        </section>

        <section
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
          aria-label="Why the type-cross-section"
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            Why a type-cross-section, not just a platform one
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Same audience, different attention shape.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The platform map at{" "}
            <Link
              href="/voices"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /voices
            </Link>{" "}
            answers <em>where</em> the developer-investor reads. The type map
            here answers <em>which room are they reading inside that
            platform</em>. The same Discord user is one of half a dozen
            archetypes depending on which server they&rsquo;re in — a Cursor
            user with a maintained repo is a different signal than the same
            user in a CNCF channel.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The two maps don&rsquo;t replace each other. They overlay. The
            company-side weekly working board uses both: platform map for
            cadence, type map for sectoring.
          </p>
        </section>

        <section
          className="rounded-xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="How to use this list"
        >
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            How to use this list
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Pick three rooms per group. Read weekly. Comment monthly. Source
            never.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            We don&rsquo;t source deals out of any of these rooms — the rooms
            tell us <em>where to look</em>, not <em>what to fund</em>. The
            actual deal-flow signal comes from the GitHub-side telemetry that
            powers{" "}
            <Link
              href="/predicted"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              /predicted
            </Link>{" "}
            and{" "}
            <Link
              href="/firstlook"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              /firstlook
            </Link>
            . The rooms above are the second derivative — they reveal which
            sectors the dev-side audience is bending toward, weeks before the
            telemetry confirms it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/voices"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors"
            >
              See the platform map →
            </Link>
            <Link
              href="/target-list"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Master ICP-scored list →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Refreshed 2026-05-22. Each type roster is regenerated quarterly.
          Status flags update weekly when engagement state changes. Companion
          platform map at{" "}
          <Link
            href="/voices"
            className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
          >
            /voices
          </Link>
          .
        </p>
      </div>
    </>
  );
}
