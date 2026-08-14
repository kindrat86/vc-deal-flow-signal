import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  PLATFORM_LISTS,
  PLATFORM_STATUS_META,
  platformStatusCounts,
  type VoiceStatus,
} from "@/content/voices-platforms";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Where the buyer reads, per platform, the X, Reddit, and Hacker News rosters",
  description:
    "Three platform rosters pointed at the corp-dev / PE / operator buyer: 100 business-of-tech, SaaS-metrics, PE/M&A and deals-media accounts on X, ~30 business communities on Reddit, and a thin read-only awareness map on Hacker News. Each entry status-flagged. Sized to where the buyer actually is, no padding.",
  alternates: { canonical: "/voices" },
  openGraph: {
    title:
      "Where the buyer reads, X, Reddit, and Hacker News voice rosters",
    description:
      "100 X accounts (analysts, SaaS-metrics, PE/M&A, deals-media, market-map), ~30 Reddit business communities, and a thin read-only HN map. Each entry status-flagged.",
    url: "https://signals.gitdealflow.com/voices",
    type: "article",
  },
};

const STATUS_BADGE_CLASS: Record<VoiceStatus, string> = {
  engage: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  watch: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  hold: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  read: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  blocked: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function VoicesHubPage() {
  const totalEntries = PLATFORM_LISTS.reduce((n, p) => n + p.items.length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/voices",
        name: "Where the buyer reads, X, Reddit, and Hacker News rosters",
        description: `Three platform rosters pointed at the corp-dev / PE / operator buyer. ${totalEntries} entries total, each with an engagement-status flag and a public href.`,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Voices (per-platform rosters)",
            item: "https://signals.gitdealflow.com/voices",
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Per-platform voice rosters",
        numberOfItems: PLATFORM_LISTS.length,
        itemListElement: PLATFORM_LISTS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${p.label} roster`,
          item: {
            "@type": "WebPage",
            "@id": `https://signals.gitdealflow.com/voices/${p.slug}`,
            name: `${p.label}, ${p.items.length} voices for the buyer`,
            description: p.tagline,
          },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/voices"
        languages={getHreflangLanguages("/voices")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/voices" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Voices (per-platform rosters)</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            One roster per platform · Sized to the buyer · {totalEntries} entries
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Where the buyer actually reads,{" "}
            <span className="text-sky-400">per platform</span>.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            One mixed list isn&rsquo;t enough, and neither is forcing a round
            100 onto every platform. The buyer here is a corp-dev / PE /
            operator who reads business surfaces, not dev channels. So each
            roster is sized to where he actually is: a deep <em>100 on X</em>{" "}
            (analysts, SaaS-metrics, PE/M&amp;A, deals-media, market-map), a
            focused <em>~30 on Reddit</em>, and a deliberately thin,
            read-only <em>awareness map on Hacker News</em>: because HN is a
            builder surface, not his.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            These extend the master list at{" "}
            <Link
              href="/target-list"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /target-list
            </Link>{" "}
            into platform-specific rosters. Each entry is status-flagged with
            the same scheme used everywhere else, engage, watch, hold, read,
            blocked, so the page reads as a working attention map, not a
            wishlist. We don&rsquo;t pad a roster to a round number; honest
            audience-fit beats a tidy 100.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            Anonymity rule, restated: every entry is a public surface, a
            subreddit, a category page, a public account. We don&rsquo;t name
            individuals we track inside the paid product. That&rsquo;s the
            buyer&rsquo;s edge, not ours to publish.
          </p>
        </header>

        <section className="rounded-xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Use voices when you want the platform-specific attention map. But if your real question is proof, workflow, or buyer-side clarity, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/from-stars-to-seed" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 text-slate-950 text-sm font-semibold hover:bg-signal-600 transition-colors">
              Proof before the round →
            </Link>
            <Link href="/use-cases" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              See investor workflows →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the buyer's guide →
            </Link>
          </div>
        </section>

        <section
          className="grid gap-5 sm:grid-cols-1"
          aria-label="Per-platform rosters"
        >
          {PLATFORM_LISTS.map((p) => {
            const counts = platformStatusCounts(p.slug);
            return (
              <Link
                key={p.slug}
                href={`/voices/${p.slug}`}
                className="block rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-sky-700/50 transition-colors p-5 sm:p-6 space-y-3 group"
              >
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                    /voices/{p.slug}
                  </p>
                  <span className="text-[10px] text-slate-500 tabular-nums">
                    {p.items.length} entries
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug group-hover:text-sky-200 transition-colors">
                  {p.label}, {p.items.length} voices.
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {p.tagline}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {p.intro}
                </p>
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {(
                    ["engage", "watch", "hold", "read", "blocked"] as const
                  ).map((s) =>
                    counts[s] === 0 ? null : (
                      <li
                        key={s}
                        className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${STATUS_BADGE_CLASS[s]}`}
                        title={PLATFORM_STATUS_META[s].long}
                      >
                        <span className="tabular-nums">{counts[s]}</span>
                        <span className="ml-1.5">
                          {PLATFORM_STATUS_META[s].short}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
                <p className="text-sky-400 text-sm font-semibold pt-1 group-hover:text-sky-300">
                  Open the roster →
                </p>
              </Link>
            );
          })}
        </section>

        <section
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
          aria-label="Why split the master list"
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            Why split the master list
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Same audience, different rules.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The same reader may use X in the morning, Reddit at lunch, and HN
            before bed. But the platforms reward and punish very
            different posting shapes. Reddit auto-mods anything that names a
            product on the venture-side subs. HN front-page mechanics don&rsquo;t
            tolerate self-promotion at all. X rewards consistency more than
            quality. Each surface needs its own list, its own cadence, and its
            own honest engagement status, which is why one big mixed roster
            misses the point.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The companion list at{" "}
            <Link
              href="/target-list"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /target-list
            </Link>{" "}
            stays as the ICP-scored master roster across publication formats
            (substacks, podcasts, newsletters, GitHub orgs, conferences,
            books, frameworks, communities, LinkedIn pages, datasets). The
            three rosters here are platform-shape-specific extensions of that
            map, ready for the engagement layer.
          </p>
        </section>

        <section
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="How this list compounds"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            How this list compounds
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Three platforms, {totalEntries} entries, one weekly working board.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Every Tuesday and Friday at 14:00 EEST, the company-side surfaces
            cycle through the engage-tagged entries on each platform, Reddit
            comments first, X queue second, HN read-only third. The hard
            ceilings (4 LinkedIn replies / week, 2 Reddit comments / week, 0
            HN posts during the account-block window) come from each
            platform&rsquo;s rules, not ours.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            We publish the rosters because every dispatch is reproducible from
            this page. If you want to mirror the cadence,
            three Tuesday-and-Friday hours per week is the entire workload.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
            <Link
              href="/distribution"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-bold text-sm transition-colors"
            >
              See the distribution map →
            </Link>
            <Link
              href="/community-signal"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-emerald-700/50 bg-emerald-950/30 hover:bg-emerald-900/30 text-emerald-200 font-semibold text-sm transition-colors"
            >
              Type-indexed cousin: /community-signal →
            </Link>
            <Link
              href="/target-list"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Master list (ICP-scored, mixed) →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Refreshed 2026-05-09. Each roster is regenerated quarterly. Status
          flags update weekly when engagement state changes (e.g. account
          block resolves, auto-mod rule changes, a sub goes private).
        </p>
      </div>
    </>
  );
}
