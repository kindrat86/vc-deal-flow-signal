import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchUserStars, isValidGithubUsername } from "@/lib/github-stars";
import {
  computeScoutScore,
  generateTastePersonality,
  type ScoutScoreResult,
  type ScoredWin,
} from "@/lib/scout-score";
import { makeShareIntents } from "@/lib/share-url";
import ShareGate from "./ShareGate";
import { withEditorialOverride } from "@/lib/metadata";

interface Params {
  username: string;
}

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

const SITE = "https://signals.gitdealflow.com";

async function getReceipts(username: string): Promise<
  | { ok: true; result: ScoutScoreResult; personality: string }
  | { ok: false; reason: "not_found" | "rate_limit" | "error" }
> {
  if (!isValidGithubUsername(username)) {
    return { ok: false, reason: "not_found" };
  }
  try {
    const fetched = await fetchUserStars(username);
    const result = computeScoutScore(fetched.stars);
    const personality = generateTastePersonality(result);
    return { ok: true, result, personality };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("not found")) return { ok: false, reason: "not_found" };
    if (msg.includes("rate limit")) return { ok: false, reason: "rate_limit" };
    console.error("[receipts/[username]] error:", err);
    return { ok: false, reason: "error" };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { username } = await params;
  const data = await getReceipts(username);
  if (!data.ok) {
    return withEditorialOverride({
      title: `Receipts not found, GitDealFlow`,
      robots: { index: false, follow: false },
    });
  }
  const { result } = data;
  const title = `@${username}, Scout Score ${result.score} · ${RANK_LABEL[result.rank]}`;
  const description =
    result.early_count > 0
      ? `${result.early_count} unicorn${result.early_count === 1 ? "" : "s"} called early on GitHub. Top: ${result.top_wins[0]?.name ?? "-"}. Beat this score:`
      : `${username} has no early unicorn calls in our database, yet. Show off yours:`;
  return withEditorialOverride({
    title,
    description,
    alternates: { canonical: `/receipts/${username}` },
    openGraph: {
      title,
      description,
      url: `${SITE}/receipts/${username}`,
      type: "profile",
      images: [
        { url: `${SITE}/api/og/receipts/${username}`, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@sipiteno",
      title,
      description,
      images: [`${SITE}/api/og/receipts/${username}`],
    },
  });
}

export default async function ReceiptsResultPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { username } = await params;
  const data = await getReceipts(username);

  if (!data.ok && data.reason === "not_found") {
    notFound();
  }
  if (!data.ok) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold text-gray-100 mb-3">Could not pull receipts</h1>
        <p className="text-gray-400 mb-6">
          {data.reason === "rate_limit"
            ? "We hit GitHub's rate limit. Try again in a minute."
            : "Something went sideways. Try again, or pick a different username."}
        </p>
        <Link
          href="/receipts"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
        >
          ← Back to /receipts
        </Link>
      </div>
    );
  }

  const { result, personality } = data;
  const profileUrl = `${SITE}/receipts/${username}`;
  const shareText =
    result.score > 0
      ? `My GitHub Scout Score is ${result.score}/100 (${RANK_LABEL[result.rank]}). I called ${result.early_count} unicorn${result.early_count === 1 ? "" : "s"} early. Beat me:`
      : `I just got my GitHub starring receipts from gitdealflow. Get yours:`;
  const { twitterIntent: twitterShare, linkedinIntent: linkedinShare } = makeShareIntents({
    sharer: username,
    kind: "scout",
    text: shareText,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${profileUrl}#page`,
        url: profileUrl,
        name: `@${username}, GitHub Scout Receipts`,
        description: `GitHub starring history scored against validated unicorns. Score: ${result.score}/100. Rank: ${RANK_LABEL[result.rank]}.`,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE}/api/og/receipts/${username}`,
          width: 1200,
          height: 630,
        copyrightNotice: "\u00a9 VC Deal Flow Signal (GitDealFlow). Licensed under CC BY 4.0.",
        creator: { "@id": "https://signals.gitdealflow.com/about#person" },
        acquireLicensePage: "https://signals.gitdealflow.com/terms",
        },
        mainEntity: { "@id": `${profileUrl}#person` },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": `${profileUrl}#person`,
        name: `@${username}`,
        alternateName: username,
        identifier: username,
        url: profileUrl,
        sameAs: [`https://github.com/${username}`],
        knowsAbout: ["GitHub starring", "Open-source software", "Startup discovery"],
        award:
          result.early_count > 0
            ? `${result.early_count} early unicorn call${result.early_count === 1 ? "" : "s"} on GitHub`
            : undefined,
      },
      {
        "@type": "Rating",
        "@id": `${profileUrl}#rating`,
        ratingValue: result.score,
        bestRating: 100,
        worstRating: 0,
        ratingExplanation: `Scout Score, taste signal computed from ${result.total_stars} starred repos vs validated unicorn list. Rank: ${RANK_LABEL[result.rank]}.`,
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Receipts",
            item: `${SITE}/receipts`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `@${username}`,
            item: profileUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-10">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          GitHub Receipts · You saw it first
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-2">
              @{username}
            </h1>
            <p className="text-lg text-gray-400">
              Scored against {result.total_stars} starred repos
              {result.matched_count > 0 ? ` · ${result.matched_count} validated wins` : ""}
            </p>
          </div>
          <ShareGate
            username={username}
            twitterShare={twitterShare}
            linkedinShare={linkedinShare}
          />
        </div>
      </header>

      <section className="mb-10 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950 p-6 sm:p-8 md:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">
              Scout Score
            </p>
            <p className={`text-6xl sm:text-7xl md:text-8xl font-bold leading-none ${RANK_COLOR[result.rank]}`}>
              {result.score}
            </p>
          </div>
          <div className="pb-2">
            <p className={`text-xl sm:text-2xl font-bold uppercase tracking-widest ${RANK_COLOR[result.rank]}`}>
              {RANK_LABEL[result.rank]}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {result.early_count} early call{result.early_count === 1 ? "" : "s"} ·{" "}
              {result.matched_count - result.early_count} late star
              {result.matched_count - result.early_count === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <p className="text-gray-300 text-base leading-relaxed italic">
          &ldquo;{personality}&rdquo;
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-100 mb-4">Your top early calls</h2>
        {result.top_wins.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
            <p className="text-gray-400 mb-3">
              No matched unicorns in our database from your stars yet.
            </p>
            <p className="text-gray-400 text-sm mb-5">
              Either your starring history predates the modern OSS-VC wave, or
              the next unicorns you starred just haven&rsquo;t been validated yet. Make a
              forward-looking call below.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 divide-y divide-slate-800">
            {result.top_wins.map((win) => (
              <WinRow key={win.org} win={win} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-10 rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Show off your taste
        </p>
        <h2 className="text-xl font-bold text-gray-100 mb-3">
          Drop a live Scout Score badge in your README
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-4 max-w-2xl">
          Auto-updates as your starring history grows. Free, no signup. Same
          pattern as Codecov or WakaTime.
        </p>
        <div className="rounded-md bg-slate-950 border border-slate-800 p-3 mb-4 overflow-x-auto">
          <code className="text-xs text-sky-300 font-mono whitespace-nowrap">
            {`[![Scout Score](${SITE}/api/badge/scout/${username}/svg)](${SITE}/receipts/${username})`}
          </code>
        </div>
        <Link
          href={`/badge-builder?handle=${encodeURIComponent(username)}`}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
        >
          Open badge builder →
        </Link>
      </section>

      <section className="mb-10 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8">
        <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Now do it forward
        </p>
        <h2 className="text-2xl font-bold text-gray-100 mb-3">
          You proved your taste. Now prove your call.
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-5 max-w-2xl">
          Receipts show what you&rsquo;ve already starred. The Scout game tracks the
          calls you make from here. Pick any GitHub org, predict whether they
          raise in the next 6 months, and we resolve it automatically. Top scouts
          land in the weekly &ldquo;Top 10&rdquo; email.
        </p>
        <Link
          href={`/predict?from=receipts&handle=${encodeURIComponent(username)}`}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-sm transition-colors"
        >
          Make your first scout call →
        </Link>
      </section>

      <section className="mb-10 rounded-xl border border-orange-500/30 bg-orange-500/5 p-6 sm:p-8">
        <p className="text-orange-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Or get the data on one sector right now
        </p>
        <h2 className="text-2xl font-bold text-gray-100 mb-3">
          First Look Pass, €7 sector deep dive
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-5 max-w-2xl">
          Receipts show your past taste. /predict tracks your forward calls. The
          First Look Pass shows you the data on <em>one sector right now</em>
what&rsquo;s accelerating, who&rsquo;s quiet, who&rsquo;ll likely raise next.
          Ranked Markdown + CSV in your inbox within 24 hours. Pick the sector
          at checkout. Credit applies to Dashboard if you upgrade.
        </p>
        <a
          href="/api/checkout/session?tier=firstlook"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm transition-colors"
        >
          Get the First Look Pass, €7 →
        </a>
      </section>

      <section className="text-center">
        <p className="text-gray-400 text-sm mb-3">
          Want to compare with a friend? Send them this link:
        </p>
        <code className="inline-block bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sky-400 text-sm font-mono">
          {profileUrl}
        </code>
        <p className="text-gray-400 text-xs mt-6">
          Receipts are computed from your public GitHub starring history. We
          never see private repos or DMs.
        </p>
      </section>
    </div>
  );
}

function WinRow({ win }: { win: ScoredWin }) {
  const monthsLabel = win.months_early > 0
    ? `${win.months_early.toFixed(0)} months early`
    : `${Math.abs(win.months_early).toFixed(0)} months late`;
  const isLate = win.months_early <= 0;
  const starredDate = new Date(win.starred_at).toISOString().slice(0, 10);
  return (
    <div className="flex items-start sm:items-center justify-between px-5 py-4 gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-100 text-base">{win.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          You starred <code className="text-gray-400">{win.repo}</code> on {starredDate}
          {" · "}
          <span className={isLate ? "text-rose-400" : "text-emerald-400"}>{monthsLabel}</span>
          {" before "}
          <span className="text-gray-300">{win.event}</span>
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-mono text-lg font-bold ${win.points > 0 ? "text-emerald-400" : "text-gray-400"}`}>
          {win.points > 0 ? "+" : ""}
          {win.points.toFixed(0)}
        </p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">pts</p>
      </div>
    </div>
  );
}
