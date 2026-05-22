import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  COMMUNITY_GROUPS,
  COMMUNITY_STATUS_META,
  PLATFORM_META,
  YIELD_META,
  assertCommunityCounts,
  communityStatusCounts,
  communityYieldCounts,
  getAllCommunitySlugs,
  getCommunityGroup,
  type CommunityStatus,
  type YieldTier,
} from "@/content/community-signal";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 604800;

// Build-time sanity check (same call as the index page; safe to invoke
// twice because it's idempotent).
assertCommunityCounts();

export function generateStaticParams() {
  return getAllCommunitySlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE = "https://signals.gitdealflow.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const g = getCommunityGroup(slug);
  if (!g) {
    return {
      title: "Community roster not found",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${g.label} — communities ranked by deal-flow yield`,
    description: `${g.tagline} ${g.cadence}`,
    keywords: [
      g.label.toLowerCase(),
      "community signal",
      "deal flow",
      "developer investor",
      "vc",
      "github",
      ...g.items.slice(0, 8).map((c) => c.name.toLowerCase()),
    ].join(", "),
    alternates: { canonical: `/community-signal/${g.slug}` },
    openGraph: {
      title: `${g.label} — ranked by deal-flow yield`,
      description: g.tagline,
      url: `${SITE}/community-signal/${g.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${g.label} — ranked by deal-flow yield`,
      description: g.tagline,
    },
  };
}

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

const YIELD_RANK: Record<YieldTier, number> = {
  primary: 0,
  secondary: 1,
  ambient: 2,
};

export default async function CommunityGroupPage({ params }: PageProps) {
  const { slug } = await params;
  const g = getCommunityGroup(slug);
  if (!g) notFound();

  // Sort items by yield tier (primary → secondary → ambient), preserving the
  // hand-authored order within each tier.
  const orderedItems = [...g.items].sort(
    (a, b) => YIELD_RANK[a.yield] - YIELD_RANK[b.yield],
  );

  const ycounts = communityYieldCounts(g.slug);
  const scounts = communityStatusCounts(g.slug);

  const faqs = [
    {
      q: `What is the "deal-flow yield" of a community?`,
      a: `Yield is a three-tier rating — primary, secondary, ambient — describing how often a community has been the first public surface where a repo or founder we now surface inside the product appeared. Primary means multiple deals trace back to the room; ambient means the room is read for framing, not sourcing.`,
    },
    {
      q: `Why is ${g.label.toLowerCase()} indexed by type instead of by platform?`,
      a: `The platform map at /voices already covers per-platform rosters (Reddit-100, HN-100, X-100). Indexing by type cuts the same audience differently — a Cursor user in a Cursor Discord is a different deal-flow signal than the same user in a CNCF channel, even though both are on Discord.`,
    },
    {
      q: `Do we engage in every community on this page?`,
      a: `No. Each community is tagged with an engagement status (engage / watch / hold / read / blocked). The default for most rooms is "watch" or "read" — we listen but do not post. The "engage" tag is reserved for a small number of rooms where comment-only engagement on technical Q&A is allowed by both the room rules and our anonymity rule.`,
    },
    {
      q: `Are the individuals inside these communities listed anywhere?`,
      a: `No. The anonymity rule that governs the entire site applies here: we name communities, not individuals. The specific founders, maintainers, and contributors we surface live inside the paid product — that is the buyer's edge.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/community-signal/${g.slug}`,
        url: `${SITE}/community-signal/${g.slug}`,
        name: `${g.label} — communities ranked by deal-flow yield`,
        description: g.tagline,
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
          {
            "@type": "ListItem",
            position: 3,
            name: g.label,
            item: `${SITE}/community-signal/${g.slug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `${g.label} — communities ranked by deal-flow yield`,
        numberOfItems: orderedItems.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: orderedItems.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: {
            "@type": "Thing",
            name: c.name,
            description: `${c.what} [yield: ${YIELD_META[c.yield].short}; status: ${COMMUNITY_STATUS_META[c.status].short}]`,
            ...(c.url && c.url.startsWith("http") ? { url: c.url } : {}),
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/community-signal/${g.slug}`}
        languages={getHreflangLanguages(`/community-signal/${g.slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/community-signal/${g.slug}`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/community-signal"
              className="hover:text-gray-300"
            >
              Community Signal
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{g.label}</span>
          </nav>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            {g.archetype} · {g.items.length} rooms · ranked by yield
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {g.label}.{" "}
            <span className="text-emerald-400">Ranked by deal-flow yield.</span>
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            {g.tagline}
          </p>
          <p className="text-gray-300 text-base leading-relaxed">{g.intro}</p>
        </header>

        <section
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-3"
          aria-label="Why this group ranks here"
        >
          <div>
            <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider mb-1">
              Yield story
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {g.yieldStory}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider mb-1">
              Cadence
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {g.cadence}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider mb-1">
              Caveat
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{g.caveat}</p>
          </div>
        </section>

        <section
          aria-label="Yield + status summary"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-5"
        >
          <div>
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
              Yield breakdown · {g.items.length} rooms
            </p>
            <ul className="grid grid-cols-3 gap-3 text-sm">
              {ORDERED_YIELDS.map((y) => (
                <li
                  key={y}
                  className={`rounded-lg border px-3 py-2.5 ${YIELD_BADGE_CLASS[y]}`}
                >
                  <p className="text-2xl font-bold tabular-nums">
                    {ycounts[y]}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider font-semibold">
                    {YIELD_META[y].short}
                  </p>
                  <p className="text-[11px] opacity-75 leading-snug pt-1">
                    {YIELD_META[y].long}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4 border-t border-slate-800">
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
              Engagement status
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
              {ORDERED_STATUSES.map((s) => (
                <li
                  key={s}
                  className={`rounded-lg border px-3 py-2.5 ${STATUS_BADGE_CLASS[s]}`}
                >
                  <p className="text-2xl font-bold tabular-nums">
                    {scounts[s]}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider font-semibold">
                    {COMMUNITY_STATUS_META[s].short}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-label={`${g.label} ranked roster`}
          className="space-y-3"
        >
          <header className="space-y-2 border-l-4 border-emerald-600 pl-5">
            <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
              The ranked roster
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              {g.items.length} rooms — sorted by yield tier, numbered, linked.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Primary first, then secondary, then ambient. Hand-authored order
              within each tier — top of tier = highest attention density.
            </p>
          </header>
          <ol className="space-y-2">
            {orderedItems.map((c, i) => {
              const position = i + 1;
              return (
                <li
                  key={`${g.slug}-${position}`}
                  className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3.5"
                >
                  <span className="text-emerald-500 font-bold tabular-nums shrink-0 w-9 text-right text-sm pt-0.5">
                    {position}.
                  </span>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <p className="text-gray-100 font-semibold text-sm break-all sm:break-normal">
                        {c.url ? (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-300 underline decoration-dotted"
                          >
                            {c.name}
                          </a>
                        ) : (
                          c.name
                        )}
                      </p>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${YIELD_BADGE_CLASS[c.yield]}`}
                        title={YIELD_META[c.yield].long}
                      >
                        {YIELD_META[c.yield].short}
                      </span>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${STATUS_BADGE_CLASS[c.status]}`}
                        title={COMMUNITY_STATUS_META[c.status].long}
                      >
                        {COMMUNITY_STATUS_META[c.status].short}
                      </span>
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded border border-slate-700 text-slate-400 text-[10px] font-semibold uppercase tracking-wider"
                        title={PLATFORM_META[c.platform].long}
                      >
                        {PLATFORM_META[c.platform].short}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {c.what}
                    </p>
                    {c.note && (
                      <p className="text-gray-500 text-xs leading-relaxed italic border-l border-slate-700 pl-3">
                        {c.note}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <nav
          aria-label="Other community types"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
        >
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            Other community types
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {COMMUNITY_GROUPS.map((other) =>
              other.slug === g.slug ? (
                <li
                  key={other.slug}
                  className="px-3 py-2 rounded-md bg-slate-800 text-gray-500 text-xs cursor-default"
                  aria-current="page"
                >
                  {other.label} (current)
                </li>
              ) : (
                <li key={other.slug}>
                  <Link
                    href={`/community-signal/${other.slug}`}
                    className="block px-3 py-2 rounded-md bg-slate-800/60 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    {other.label} →
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <section
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-4"
          aria-label="Frequently asked"
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            Frequently asked
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Four questions about this list.
          </h2>
          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="space-y-1.5">
                <dt className="text-gray-100 font-semibold text-sm leading-snug">
                  {f.q}
                </dt>
                <dd className="text-gray-300 text-sm leading-relaxed">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Where the deal-flow signal actually lives
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Rooms tell us where to look. Telemetry tells us what to fund.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Reading {g.label.toLowerCase()} doesn&rsquo;t produce a deal. It
            sharpens the question we ask the GitHub-side telemetry. The actual
            deal-flow signal lives at{" "}
            <Link
              href="/predicted"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              /predicted
            </Link>
            ,{" "}
            <Link
              href="/firstlook"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              /firstlook
            </Link>
            , and the rest of the signal stack below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/predicted"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors"
            >
              See /predicted →
            </Link>
            <Link
              href="/voices"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              See the platform map →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          {g.label} roster regenerated quarterly. Status flags update weekly.
          Companion platform map at{" "}
          <Link
            href="/voices"
            className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
          >
            /voices
          </Link>
          . Master mixed list at{" "}
          <Link
            href="/target-list"
            className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
          >
            /target-list
          </Link>
          .
        </p>
      </div>
    </>
  );
}
