import type { Metadata } from "next";
import Link from "next/link";
import { listLeaderboard, type Scout } from "@/lib/pocketbase";
import { makeShareIntents } from "@/lib/share-url";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

// Token must be minted at request time with the RUNTIME SHARE_TOKEN_SECRET,
// not at build time with the local-machine secret, or /share/[token] and
// /api/og/share/[token] verifications will fail. force-dynamic guarantees
// per-request rendering; revalidate alone served the build-time prerender
// until the first revalidation tick, leaving stale tokens visible to early
// visitors.
export const dynamic = "force-dynamic";

const RANK_COLOR: Record<string, string> = {
  curious: "text-emerald-400",
  scout: "text-sky-400",
  sharp: "text-purple-400",
  elite: "text-amber-400",
  oracle: "text-rose-400",
};

const RANK_LABEL: Record<string, string> = {
  curious: "Curious",
  scout: "Scout",
  sharp: "Sharp",
  elite: "Elite",
  oracle: "Oracle",
};

export const metadata: Metadata = {
  title: "Scout Leaderboard — Top 100 VC Deal Flow Scouts",
  description:
    "Live leaderboard of the top 100 scouts calling startup fundraises from public GitHub engineering signals. Points come from correct calls — wrong calls subtract. Top 1% earn an Oracle badge.",
  alternates: { canonical: "/leaderboard" },
  openGraph: {
    title: "Scout Leaderboard — Top 100 VC Deal Flow Scouts",
    description:
      "Live ranking of scouts calling startup fundraises from GitHub signals. Oracle, Elite, Sharp, Scout, Curious.",
    url: "https://signals.gitdealflow.com/leaderboard",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scout Leaderboard — Top 100 VC Deal Flow Scouts",
    description:
      "Live ranking of scouts calling startup fundraises from GitHub signals.",
    images: ["/opengraph-image"],
  },
};

export default async function LeaderboardPage() {
  const scouts = await listLeaderboard(100).catch(() => [] as Scout[]);
  const topHandle = scouts[0]?.handle ?? "anon";
  const topScore = scouts[0] ? Math.round(scouts[0].points) : 0;
  const shareText = topScore > 0
    ? `Top scout right now: @${topHandle} with ${topScore} points calling startup fundraises from GitHub signals. The recipient gets a 7-day preview:`
    : `Live leaderboard of devs predicting startup fundraises from GitHub signals. Recipient gets a 7-day extended preview:`;
  const { twitterIntent: shareLeaderboardX } = makeShareIntents({
    sharer: "leaderboard",
    kind: "signal-card",
    text: shareText,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/leaderboard#webpage",
        url: "https://signals.gitdealflow.com/leaderboard",
        name: "Scout Leaderboard — Top 100 VC Deal Flow Scouts",
        description:
          "Live leaderboard of the top 100 scouts calling startup fundraises from public GitHub engineering signals. Points come from correct calls — wrong calls subtract. Top 1% earn an Oracle badge.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
      },
      {
        "@type": "ItemList",
        name: "Top 100 Scouts by Points",
        numberOfItems: scouts.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: scouts.slice(0, 25).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `@${s.handle}`,
          url: `https://signals.gitdealflow.com/s/${s.handle}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Leaderboard", item: "https://signals.gitdealflow.com/leaderboard" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://signals.gitdealflow.com/leaderboard#faq",
        url: "https://signals.gitdealflow.com/leaderboard",
        inLanguage: "en-US",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do points work in the Scout Game?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Correct calls earn floor(confidence / 10) points: a 99% correct call earns 9 points, a 50% correct call earns 5. Wrong calls deduct floor(confidence / 20), so high-confidence misses hurt more than cautious ones. Three or more consecutive correct calls trigger a streak bonus (+1 per additional correct). Expired predictions (no event in 6 months) award 0 and do not penalise.",
              url: "https://signals.gitdealflow.com/predict",
            },
          },
          {
            "@type": "Question",
            name: "What are the rank tiers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Curious (any resolved call), Scout (10 resolved calls at 40% accuracy), Sharp (25 at 55%, paid tier), Elite (50 at 65%, paid), Oracle (100 at 70% — top 1% globally). Ranks are recalculated on every resolution. The first 100 scouts to register receive a permanent Founder Scout badge regardless of accuracy.",
            },
          },
          {
            "@type": "Question",
            name: "Is the Scout Game free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Free tier: 3 predictions per month, all rank tiers eligible up to Scout. Paid tier (€9.97/mo): 10 predictions per month plus eligibility for Sharp, Elite, and Oracle ranks. Scout Receipts (backwards-looking proof of taste) are free for everyone at /receipts.",
              url: "https://signals.gitdealflow.com/predict",
            },
          },
          {
            "@type": "Question",
            name: "How are predictions resolved?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Each prediction has a six-month auto-resolution window. The system polls Crunchbase, public press releases, and SEC filings for fundraise events on the predicted GitHub org. If a Series A or larger round closes within the window, the prediction resolves correct. If no event closes within six months, the prediction expires (0 points, no penalty). Manual review handles edge cases (rebrands, acquisitions, debt rounds).",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/leaderboard" />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <p className="text-amber-400 text-sm font-medium uppercase tracking-wider">
            Live leaderboard · Top 100
          </p>
          <a
            href={shareLeaderboardX}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-gray-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
          >
            Share leaderboard →
          </a>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
          Who called it before anyone else?
        </h1>
        <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
          Ranked by points. Correct calls earn points proportional to
          confidence. Wrong calls lose points (soft penalty). Streaks of 3+
          bonus. Top 1% globally earn an Oracle badge.
        </p>
      </header>

      {scouts.length === 0 ? (
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-10 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Leaderboard is seeding. The first 100 scouts to submit a prediction
            earn a permanent <strong>Founder Scout</strong> badge.
          </p>
          <Link
            href="/predict"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
          >
            Make the first call →
          </Link>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 text-[10px] uppercase tracking-wider text-gray-400 border-b border-slate-800">
            <div className="col-span-1">#</div>
            <div className="col-span-4 sm:col-span-3">Scout</div>
            <div className="col-span-3 sm:col-span-2">Rank</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right hidden sm:block">
              Accuracy
            </div>
            <div className="col-span-2 text-right">Calls</div>
          </div>
          <ul className="divide-y divide-slate-800">
            {scouts.map((s, i) => {
              const accuracy =
                s.correct_count + s.wrong_count > 0
                  ? Math.round(
                      (1000 * s.correct_count) /
                        (s.correct_count + s.wrong_count),
                    ) / 10
                  : null;
              return (
                <li
                  key={s.id}
                  className="grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-slate-900/60 transition"
                >
                  <div className="col-span-1 text-gray-400 font-mono">
                    {i + 1}
                  </div>
                  <div className="col-span-4 sm:col-span-3 truncate">
                    <Link
                      href={`/s/${s.handle}`}
                      className="text-sky-400 hover:text-sky-300 underline font-medium"
                    >
                      @{s.handle}
                    </Link>
                    {s.founder_scout ? (
                      <span className="ml-2 text-emerald-400" title="Founder Scout">
                        🏆
                      </span>
                    ) : null}
                  </div>
                  <div
                    className={`col-span-3 sm:col-span-2 text-xs font-semibold uppercase tracking-wider ${RANK_COLOR[s.rank]}`}
                  >
                    {RANK_LABEL[s.rank]}
                  </div>
                  <div className="col-span-2 text-right text-gray-100 font-mono">
                    {Math.round(s.points)}
                  </div>
                  <div className="col-span-2 text-right text-gray-400 font-mono hidden sm:block">
                    {accuracy !== null ? `${accuracy}%` : "—"}
                  </div>
                  <div className="col-span-2 text-right text-gray-400 font-mono">
                    {s.correct_count + s.wrong_count}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-sm font-semibold text-gray-200 mb-2 uppercase tracking-wider">
            How points work
          </h2>
          <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
            <li>Correct call: floor(confidence / 10) points (5–9)</li>
            <li>Wrong call: floor(confidence / 20) lost (2–4)</li>
            <li>3+ correct streak: +1 bonus per call</li>
            <li>Expired (6mo, no event): 0</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-sm font-semibold text-gray-200 mb-2 uppercase tracking-wider">
            How rank works
          </h2>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>
              <span className="text-emerald-400 font-semibold">Curious</span> — first call
            </li>
            <li>
              <span className="text-sky-400 font-semibold">Scout</span> — 10+ calls, 40% accuracy
            </li>
            <li>
              <span className="text-purple-400 font-semibold">Sharp</span> — paid, 25+ calls, 55%
            </li>
            <li>
              <span className="text-amber-400 font-semibold">Elite</span> — paid, 50+ calls, 65%
            </li>
            <li>
              <span className="text-rose-400 font-semibold">Oracle</span> — 100+ calls, 70%, top 1%
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 text-center">
        <h2 className="text-xl font-bold text-gray-100 mb-2">
          Your turn.
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Paste a GitHub org. Make a call. Climb the board.
        </p>
        <Link
          href="/predict"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
        >
          Start predicting →
        </Link>
      </section>
    </div>
    </>
  );
}
