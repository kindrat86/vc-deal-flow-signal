import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  DREAM_100_GROUPS,
  DREAM_100_TOTAL,
  STATUS_META,
  dream100StatusCounts,
  type Dream100Status,
} from "@/content/dream-100";
import {
  ICP_SCORES,
  TIER_CHIP_CLASS,
  TIER_LABEL,
  TIER_RING_CLASS,
  assertCoverage,
  score,
  tier,
} from "@/content/dream-100-icp";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Dream 100 — literal roster of 100 voices, ICP-scored with engagement status",
  description:
    "100 named publications, communities, GitHub orgs, podcasts, datasets, and LinkedIn Company Pages where the developer-investor's audience already lives. Each entry carries an engagement status flag (engage / watch / hold / read / blocked) and a Match × Reach × Engage ICP score (0-100), so the roster reads as a working board with explicit priority — not a wishlist.",
  alternates: { canonical: "/dream-100" },
  openGraph: {
    title: "Dream 100 — voices we read, ICP-scored, with engagement status",
    description:
      "Numbered roster of 100 named entities, ICP-scored on Match × Reach × Engage, status-flagged for engagement. The Brunson Dream 100 applied to the developer-investor.",
    url: "https://signals.gitdealflow.com/dream-100",
    type: "article",
  },
};

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
 */
const ALL_NAMES = DREAM_100_GROUPS.flatMap((g) => g.items.map((v) => v.name));
assertCoverage(ALL_NAMES);

/**
 * Flat roster (1-indexed position, computed score, source group).
 * Drives both the Top-25 quick-pick and the per-row chip rendering.
 */
const ROSTER = DREAM_100_GROUPS.flatMap((g, gi) =>
  g.items.map((v, vi) => {
    const inputs = ICP_SCORES[v.name];
    const s = score(inputs);
    return {
      voice: v,
      group: g,
      position: gi * 10 + vi + 1,
      inputs,
      score: s,
      tier: tier(s),
    };
  }),
);

const TOP_25 = [...ROSTER].sort((a, b) => b.score - a.score).slice(0, 25);

const SCORE_AVG = Math.round(
  ROSTER.reduce((sum, r) => sum + r.score, 0) / ROSTER.length,
);
const TIER_COUNTS = ROSTER.reduce<Record<"T1" | "T2" | "T3", number>>(
  (acc, r) => {
    acc[r.tier]++;
    return acc;
  },
  { T1: 0, T2: 0, T3: 0 },
);

function ScoreChip({ s }: { s: number }) {
  const t = tier(s);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border tabular-nums ${TIER_CHIP_CLASS[t]}`}
      title={`${TIER_LABEL[t]} - ICP score ${s}/100`}
      aria-label={`${TIER_LABEL[t]}, ICP score ${s} out of 100`}
    >
      <span>{TIER_LABEL[t]}</span>
      <span className="text-slate-400">·</span>
      <span>{s}</span>
    </span>
  );
}

function MREChip({
  match,
  reach,
  engage,
}: {
  match: number;
  reach: number;
  engage: number;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800 tabular-nums"
      title={`Match ${match}/10  ·  Reach ${reach}/10  ·  Engage ${engage}/10`}
      aria-label={`Match ${match} out of 10, Reach ${reach} out of 10, Engage ${engage} out of 10`}
    >
      <span>
        <span className="text-slate-500">M</span> {match}
      </span>
      <span>
        <span className="text-slate-500">R</span> {reach}
      </span>
      <span>
        <span className="text-slate-500">E</span> {engage}
      </span>
    </span>
  );
}

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
        "@id": "https://signals.gitdealflow.com/dream-100",
        name: "Dream 100 — literal roster, ICP-scored, with engagement status",
        description:
          "100 named publications, communities, GitHub orgs, podcasts, datasets, and LinkedIn Company Pages where the developer-investor's audience already lives. Each entry carries an engagement status flag and a Match × Reach × Engage ICP score (0-100).",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Dream 100", item: "https://signals.gitdealflow.com/dream-100" },
        ],
      },
      {
        "@type": "ItemList",
        name: "Dream 100 — voices we read",
        numberOfItems: DREAM_100_TOTAL,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: ROSTER.map((r) => ({
          "@type": "ListItem",
          position: r.position,
          name: r.voice.name,
          item: {
            "@type": "Thing",
            name: r.voice.name,
            description: `${r.voice.what} [status: ${STATUS_META[r.voice.status].short} · ICP ${r.score}/100 (${TIER_LABEL[r.tier]})]`,
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
        canonical="https://signals.gitdealflow.com/dream-100"
        languages={getHreflangLanguages("/dream-100")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/dream-100" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Dream 100</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Traffic Secrets, Section 1, Chapter 5 · Applied · ICP-scored
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            The Dream 100 — the{" "}
            <span className="text-sky-400">literal roster</span> of 100 voices,
            ICP-scored, with engagement status.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            Brunson&rsquo;s rule: pick the 100 publications, communities, and
            orgs whose audience already contains your dream customer.
            Don&rsquo;t pitch — show up where they are, contribute, let the
            signal compound.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Most pages that quote the Dream 100 stop at the framework. We list
            the actual 100 names, numbered 1 to 100, with two layers:{" "}
            <strong className="text-gray-100">engagement status</strong> (what
            we&rsquo;re doing about it now) and{" "}
            <strong className="text-gray-100">ICP score</strong> (how worth
            doing it is — Match × Reach × Engage, max 100). Together they turn
            the roster into a 2-axis working board.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            Anonymity rule: every voice on this list is a public publication,
            org, or community. We don&rsquo;t name the individual founders we
            track inside our paid product — that&rsquo;s the buyer&rsquo;s
            edge, not ours to publish.
          </p>
        </header>

        {/* Status summary — existing axis. */}
        <section
          aria-label="Status summary"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4"
        >
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">
            Engagement status · {DREAM_100_TOTAL} entries
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

        {/* ICP scoring rubric — new second axis. */}
        <section
          aria-label="ICP scoring methodology"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold text-gray-100">
              ICP score: Match × Reach × Engage
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">
              Avg {SCORE_AVG}/100 · {TIER_COUNTS.T1} T1 · {TIER_COUNTS.T2} T2 · {TIER_COUNTS.T3} T3
            </span>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <dt className="font-semibold text-sky-300">
                Match <span className="text-slate-500 font-mono">×4</span>
              </dt>
              <dd className="text-gray-400 leading-relaxed text-[13px]">
                How concentrated this voice&rsquo;s audience is with the
                developer-investor avatar (1–10). Weighted highest because a
                wide-reach voice with low Match wastes the cycle.
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-semibold text-sky-300">
                Reach <span className="text-slate-500 font-mono">×3</span>
              </dt>
              <dd className="text-gray-400 leading-relaxed text-[13px]">
                Audience scale, log-ish (1 ≈ &lt;1k, 5 ≈ ~50k, 8 ≈ 500k,
                10 ≈ &gt;5M). Multiplier is 3 — Brunson&rsquo;s rule: Match
                before Reach.
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-semibold text-sky-300">
                Engage <span className="text-slate-500 font-mono">×3</span>
              </dt>
              <dd className="text-gray-400 leading-relaxed text-[13px]">
                How realistic it is for us to be present given (a) anonymity
                rule, (b) agent-native footprint, (c) channel bans / auto-mod
                limits. Caps low for podcasts, high for MCP.
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-wider pt-2">
            <span className={`px-2 py-0.5 rounded-md border ${TIER_CHIP_CLASS.T1}`}>
              Tier 1 ≥ 85 — lean in this quarter
            </span>
            <span className={`px-2 py-0.5 rounded-md border ${TIER_CHIP_CLASS.T2}`}>
              Tier 2 70–84 — sustaining cadence
            </span>
            <span className={`px-2 py-0.5 rounded-md border ${TIER_CHIP_CLASS.T3}`}>
              Tier 3 &lt; 70 — read-only / mental-model only
            </span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Score = Match × 4 + Reach × 3 + Engage × 3. Max 100. Re-scored
            quarterly; last pass 2026-05-06.
          </p>
        </section>

        {/* Top 25 by ICP score — the actionable artefact. */}
        <section
          aria-label="Top 25 by ICP score"
          className="rounded-xl border border-amber-700/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-5 sm:p-6 space-y-4"
        >
          <div className="space-y-1">
            <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
              The actionable artefact
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
              Top 25 voices by ICP score — where the next 90 days of work goes.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sorted by Match × Reach × Engage. If a voice is in the top 25,
              we already have a Brunson-style monthly action against it (PR,
              comment, integration ship, Substack Note quote-thread, LinkedIn
              Company-Page reply).
            </p>
          </div>
          <ol className="space-y-1.5 text-sm">
            {TOP_25.map((r, i) => (
              <li
                key={`top-${r.position}`}
                className="flex items-baseline gap-3 py-1 border-b border-slate-800/60 last:border-b-0"
              >
                <span className="text-amber-400 font-bold tabular-nums shrink-0 w-8 text-right">
                  {i + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <a
                    href={`#${r.group.id}`}
                    className="text-gray-100 hover:text-sky-300 font-semibold underline decoration-dotted decoration-slate-700 underline-offset-4"
                  >
                    {r.voice.name}
                  </a>
                  <span className="text-slate-500 text-xs ml-2">
                    · {r.group.label.split(" ").slice(2).join(" ") || r.group.label}
                  </span>
                  <span
                    className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider ${STATUS_BADGE_CLASS[r.voice.status]}`}
                    title={STATUS_META[r.voice.status].long}
                  >
                    {STATUS_META[r.voice.status].short}
                  </span>
                </span>
                <ScoreChip s={r.score} />
              </li>
            ))}
          </ol>
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
          const groupRows = g.items.map((v, vi) => {
            const inputs = ICP_SCORES[v.name];
            const s = score(inputs);
            return {
              v,
              i: vi,
              globalPos: gi * 10 + vi + 1,
              inputs,
              s,
              t: tier(s),
            };
          });
          const groupAvg = Math.round(
            groupRows.reduce((sum, r) => sum + r.s, 0) / groupRows.length,
          );

          return (
            <section
              key={g.id}
              id={g.id}
              className="space-y-4 scroll-mt-20"
              aria-label={g.label}
            >
              <header className="space-y-2 border-l-4 border-sky-600 pl-5">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                    {g.label.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <span className="text-[10px] text-slate-500 tabular-nums">
                    Group avg {groupAvg}/100
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
                  {g.label}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {g.intro}
                </p>
              </header>
              <ol className="space-y-3" start={1}>
                {groupRows.map(({ v, i, globalPos, inputs, s, t }) => (
                  <li
                    key={`${g.id}-${i}`}
                    className={`flex gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4 ${TIER_RING_CLASS[t]}`}
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
                        <ScoreChip s={s} />
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {v.what}
                      </p>
                      {v.note && (
                        <p className="text-gray-400 text-xs leading-relaxed italic border-l border-slate-700 pl-3">
                          {v.note}
                        </p>
                      )}
                      <div className="pt-1">
                        <MREChip
                          match={inputs.match}
                          reach={inputs.reach}
                          engage={inputs.engage}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}

        <section
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="How we engage"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            How we engage — the cadence behind the roster
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            One contact per surface, twice a week, ceiling of four.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The Dream 100 is not a contact-list to email. It&rsquo;s a board
            we work in public. Every Tuesday and Friday at 14:00 EEST, the
            company page replies on one or two posts inside the{" "}
            <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded text-xs">
              engage
            </code>
            -tagged Company Pages, prioritised top-down by ICP score. Hard
            ceiling of 4 replies/week — LinkedIn throttles company pages
            above that.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            On the Reddit side: comment-only on{" "}
            <code className="text-sky-300 bg-slate-900 px-1 py-0.5 rounded text-xs">
              r/venturecapital
            </code>{" "}
            (auto-mod removes main posts that name a product), 40-55 words,
            Twitter-tight, no em-dashes. Hacker News is currently on{" "}
            <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded text-xs">
              hold
            </code>{" "}
            — the account is blocked from submitting / commenting; we publish
            here transparently rather than hide the gap.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Federated triple-mirror — Bluesky / Mastodon / Farcaster — runs
            on the same Tue / Fri pulse. Each post lives at its native URL,
            cross-quoted on Substack Notes, never astroturfed.
          </p>
        </section>

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            How to use this list
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            If three of these voices pattern-match to you, you&rsquo;re our
            dream customer.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            We didn&rsquo;t make this page for SEO. We made it because every
            week one developer-investor emails us asking which substacks we
            read, which podcasts we listen to, which datasets we trust. This
            is the answer in one place. If you read three of these regularly,
            the{" "}
            <Link
              href="https://gitdealflow.com/#signup"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
            >
              free Acceleration Watch
            </Link>{" "}
            is built around your reading habits — same density, same priors,
            same Monday rhythm.
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
          The Dream 100 is a teaching from{" "}
          <em>Traffic Secrets</em> by Russell Brunson (2020). Used here under
          fair-use commentary. Not affiliated with ClickFunnels or Russell.
          The full audit of how this site reverse-engineers the trilogy is on{" "}
          <Link
            href="/funnels"
            className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
          >
            /funnels
          </Link>
          .
        </p>
      </div>
    </>
  );
}
