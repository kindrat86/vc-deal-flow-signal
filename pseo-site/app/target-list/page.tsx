import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import {
  DREAM_100_GROUPS,
  DREAM_100_TOTAL,
  STATUS_META,
  dream100StatusCounts,
  type Dream100Status,
} from "@/content/target-list";
import { assertCoverage } from "@/content/target-list-icp";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = withEditorialOverride({
  title:
    "Top 100, the publications, communities, and research desks worth paying attention to",
  description:
    "100 named publications, communities, market-map desks, deal newsletters, research, podcasts, datasets, and company pages worth watching if you care about earlier startup signal, clearer timing, and less noise.",
  alternates: { canonical: "/target-list" },
  openGraph: {
    title: "Top 100, the voices worth paying attention to",
    description:
      "A practical roster of 100 publications, communities, and research desks worth watching when you care about earlier startup signal and clearer timing.",
    url: "https://signals.gitdealflow.com/target-list",
    type: "article",
  },
});

const STATUS_BADGE_CLASS: Record<Dream100Status, string> = {
  engage: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  watch: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  hold: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  read: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  blocked: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

/**
 * Build-time sanity check: every Dream-100 name must have a matching ICP
 * score entry, and vice versa. Throws during `next build` if drift exists.
 * (The internal ICP score itself is no longer rendered on the public page -
 * this list is reader-facing, but the coverage guard stays so the roster and
 * the scoring data file can never silently drift apart.)
 */
const ALL_NAMES = DREAM_100_GROUPS.flatMap((g) => g.items.map((v) => v.name));
assertCoverage(ALL_NAMES);

/**
 * Flat roster (1-indexed position, source group). Drives the JSON-LD ItemList.
 */
const ROSTER = DREAM_100_GROUPS.flatMap((g, gi) =>
  g.items.map((v, vi) => ({
    voice: v,
    group: g,
    position: gi * 10 + vi + 1,
  })),
);

export default function Dream100Page() {
  const counts = dream100StatusCounts();
  const orderedStatuses: Dream100Status[] = [
    "engage",
    "watch",
    "hold",
    "read",
    "blocked",
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/target-list",
        name: "Top 100, the voices worth paying attention to",
        description:
          "100 named publications, communities, market-map desks, deal newsletters, research, podcasts, datasets, and company pages worth watching when you care about earlier startup signal, clearer timing, and less noise.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Top 100", item: "https://signals.gitdealflow.com/target-list" },
        ],
      },
      {
        "@type": "ItemList",
        name: "Top 100, voices we read",
        numberOfItems: DREAM_100_TOTAL,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: ROSTER.map((r) => ({
          "@type": "ListItem",
          position: r.position,
          name: r.voice.name,
          item: {
            "@type": "Thing",
            name: r.voice.name,
            description: r.voice.what,
            ...(r.voice.href && r.voice.href.startsWith("http")
              ? { url: r.voice.href }
              : {}),
          },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/target-list"
        languages={getHreflangLanguages("/target-list")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/target-list" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Top 100</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Top 100 · the voices worth your attention
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            The Top 100, the <span className="text-sky-400">publications, communities, and research desks</span>
            worth paying attention to.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            This is the roster itself: 100 publications, communities, market-map
            desks, and research sources worth your attention if you care about
            earlier startup signal and clearer timing. It is the answer to a
            question we get every week, <em>what do you actually read?</em>
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            If you care about earlier signal, this roster shows you where the right attention already lives. Use it to decide where to read, where to show up, and where a thoughtful contribution is worth more than another broad post.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            Anonymity rule: every voice on this list is a public publication,
            org, or community. We don&rsquo;t name the individual founders we
            track inside our paid product, that&rsquo;s the buyer&rsquo;s
            edge, not ours to publish.
          </p>
        </header>

        <section className="rounded-xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Use the Top 100 when you want to know where attention already lives. But if your real question is proof, workflow, or buyer-side clarity, start with the sharper pages first.
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

        {/* Our read on each voice, a light reading signal, not an outreach board. */}
        <section
          aria-label="Our read on each voice"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4"
        >
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">
            Our read on each voice · {DREAM_100_TOTAL} entries
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
            {orderedStatuses.map((s) => (
              <li
                key={s}
                className={`rounded-lg border px-3 py-2.5 ${STATUS_BADGE_CLASS[s]}`}
              >
                <p className="text-2xl font-bold tabular-nums">{counts[s]}</p>
                <p className="text-[11px] uppercase tracking-wider font-semibold">
                  {STATUS_META[s].short}
                </p>
                <p className="text-[11px] opacity-75 leading-snug pt-1">
                  {STATUS_META[s].long}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <nav
          aria-label="Sections"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
        >
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            10 categories · 100 voices · jump to:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
            {DREAM_100_GROUPS.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="block px-3 py-1.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-sky-300 hover:text-sky-200 transition-colors"
                >
                  {g.label.split(" ").slice(2).join(" ") || g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {DREAM_100_GROUPS.map((g, gi) => {
          const groupRows = g.items.map((v, vi) => ({
            v,
            i: vi,
            globalPos: gi * 10 + vi + 1,
          }));

          return (
            <section
              key={g.id}
              id={g.id}
              className="space-y-4 scroll-mt-20"
              aria-label={g.label}
            >
              <header className="space-y-2 border-l-4 border-sky-600 pl-5">
                <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                  {g.label.split(" ").slice(0, 2).join(" ")}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
                  {g.label}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {g.intro}
                </p>
              </header>
              <ol className="space-y-3" start={1}>
                {groupRows.map(({ v, i, globalPos }) => (
                  <li
                    key={`${g.id}-${i}`}
                    className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4"
                  >
                    <span className="text-sky-500 font-bold tabular-nums shrink-0 w-8 text-right text-sm">
                      {globalPos}.
                    </span>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <p className="text-gray-100 font-semibold text-sm">
                          {v.href ? (
                            v.href.startsWith("/") ? (
                              <Link
                                href={v.href}
                                className="hover:text-sky-300 underline decoration-dotted"
                              >
                                {v.name}
                              </Link>
                            ) : (
                              <a
                                href={v.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-sky-300 underline decoration-dotted"
                              >
                                {v.name}
                              </a>
                            )
                          ) : (
                            v.name
                          )}
                        </p>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${STATUS_BADGE_CLASS[v.status]}`}
                          title={STATUS_META[v.status].long}
                        >
                          {STATUS_META[v.status].short}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {v.what}
                      </p>
                      {v.note && (
                        <p className="text-gray-400 text-xs leading-relaxed italic border-l border-slate-700 pl-3">
                          {v.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            How to use this list
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            If three of these voices already shape your week, this page is for
            you.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            We didn&rsquo;t make this page for SEO. We made it because every
            week someone asks which substacks we
            read, which podcasts we listen to, which datasets we trust. This
            is the answer in one place. If you read three of these regularly,
            the{" "}
            <Link
              href="https://gitdealflow.com/#signup"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
            >
              free Acceleration Watch
            </Link>{" "}
            is built around your reading habits, same density, same priors,
            same Monday rhythm. You read the room; we translate the engineering
            into &ldquo;who&rsquo;s accelerating, stalling, or worth a
            meeting&rdquo;, never raw commits, never quant jargon, and you
            never read a line of code.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the free Acceleration Watch →
            </a>
            <Link
              href="/distribution"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Where we publish (the other side of the map) →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Every voice here is public, and the list is curated by hand and
          re-checked quarterly. The other side of the map, where we publish -
          is on{" "}
          <Link
            href="/distribution"
            className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
          >
            /distribution
          </Link>
          .
        </p>

        <DataNerdSignoff variant="compact" />
      </div>
    </>
  );
}
