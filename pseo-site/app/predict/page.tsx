import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  getDataLastModified,
  type Startup,
} from "@/lib/data";
import { Suspense } from "react";
import SignalBadge from "@/components/SignalBadge";
import PredictFormUrlPrefill from "./PredictFormUrlPrefill";
import ScoutCallFormUrlPrefill from "./ScoutCallFormUrlPrefill";
import { AgentSummary } from "@/components/AgentSummary";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const metadata: Metadata = {
  title: "Predict Startup Breakouts, Free GitHub Signal + Scout Game",
  description:
    "Paste any startup GitHub org. Get a breakout signal in 2 seconds, then make your own call: raise in 6 months? Earn scout rank from Curious to Oracle. Top 1% get featured.",
  alternates: { canonical: "/predict" },
  openGraph: {
    title: "Predict Startup Breakouts, Free GitHub Signal + Scout Game",
    description:
      "See the signal, make the call, climb the scout ladder. Top 1% earn an Oracle badge.",
    url: "https://signals.gitdealflow.com/predict",
    type: "website",
    images: [
      {
        url: "https://signals.gitdealflow.com/api/og/signal-card",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sipiteno",
    title: "Predict Startup Breakouts, Free GitHub Signal + Scout Game",
    description:
      "See the signal, make the call, climb the scout ladder. Top 1% earn an Oracle badge.",
    images: ["https://signals.gitdealflow.com/api/og/signal-card"],
  },
};

// Static route: the ?org= prefill now reads the URL client-side via
// PredictFormUrlPrefill (inside Suspense). Awaiting searchParams here
// forced dynamic rendering (private, no-store) on every crawl of this
// sitemap'd page, ~0.85s TTFB function invocation per request.
export default function PredictPage() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();

  const all: Startup[] = [];
  for (const sector of sectors) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot) continue;
    for (const s of snapshot.startups) all.push(s);
  }
  const top = getSortedStartups(all).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "GitDealFlow Predict, Startup Breakout Signal",
        url: "https://signals.gitdealflow.com/predict",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
          "Free tool that returns a startup's GitHub commit-velocity signal, contributor growth, and breakout-probability classification in seconds.",
      },
      {
        "@type": "HowTo",
        name: "How to make a startup breakout prediction",
        description:
          "Forward-looking prediction game: pick a GitHub org, call whether they raise a Series A in 6 months. Auto-resolved at the 6-month window.",
        totalTime: "PT30S",
        supply: [{ "@type": "HowToSupply", name: "Public GitHub organization name" }],
        tool: [{ "@type": "HowToTool", name: "VC Deal Flow Signal Predict" }],
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter a GitHub organization",
            text: "Type any startup's public GitHub org slug. We pull live commit velocity, contributor growth, and signal classification from the weekly index.",
            url: "https://signals.gitdealflow.com/predict#input",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Call the prediction (50-99% confidence)",
            text: "State whether the org will raise a Series A within 6 months and pick your confidence (50-99%). Higher confidence = higher reward and higher penalty if wrong.",
            url: "https://signals.gitdealflow.com/predict#predict",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Auto-resolution at 6 months",
            text: "We auto-resolve at the 6-month window from public funding announcements. Correct call = +confidence/10 points. Wrong call = -confidence/20 points. Climb the rank ladder Curious → Scout → Sharp → Elite → Oracle.",
            url: "https://signals.gitdealflow.com/predict#resolve",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Predict", item: "https://signals.gitdealflow.com/predict" },
        ],
      },
      {
        "@type": "WebPage",
        name: "GitDealFlow Predict, Startup Breakout Signal",
        url: "https://signals.gitdealflow.com/predict",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
      },
      {
        "@type": "Game",
        name: "GitDealFlow Scout Game",
        url: "https://signals.gitdealflow.com/predict",
        description:
          "A free public prediction game where players call whether a GitHub-based technical startup will raise a Series A or later round in the next 6 months. Auto-resolved from public funding data. Public global leaderboard. Accuracy-based rank ladder Curious → Scout → Sharp → Elite → Oracle.",
        applicationCategory: "Game",
        gameLocation: "https://signals.gitdealflow.com/predict",
        gameItem: {
          "@type": "Thing",
          name: "Startup fundraise prediction",
          description: "A prediction tied to a specific GitHub organization with an attached confidence level (Low / Medium / High / Very High).",
        },
        numberOfPlayers: { "@type": "QuantitativeValue", minValue: 1 },
        playMode: "SinglePlayer",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        about: { "@type": "Thing", name: "Venture capital scouting and prediction" },
        audience: {
          "@type": "Audience",
          audienceType: "Aspiring scouts, working investors, technical founders, anyone curious about startup signals",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Do I need to be an accredited investor to play the Scout Game?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The Scout Game is a public prediction game with no money involved, no securities transactions, and no accreditation requirement. Anyone with an email address can play.",
            },
          },
          {
            "@type": "Question",
            name: "How are predictions resolved?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Auto-resolved 6 months after submission against public funding announcements. If the org announced a Series A or later round during the window, the prediction is correct and points are awarded based on confidence; otherwise the prediction is incorrect and points are deducted at half rate.",
            },
          },
          {
            "@type": "Question",
            name: "Can I delete a prediction after submitting it?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Predictions are immutable once submitted, that is the point. The track record is meaningful precisely because past calls cannot be edited after the fact.",
            },
          },
          {
            "@type": "Question",
            name: "How many predictions can I make per month?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Free tier: 3 predictions per month. First 100 scouts to make a prediction receive a permanent Founder Scout badge. The Insider Circle (EUR 197/month) adds the 24-hour-early Acceleration Watch and the private member briefing.",
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/markets/series-a-race-2026"
          className="block mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 px-4 py-3 transition-colors group"
        >
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            New · Open prediction market
          </p>
          <p className="text-gray-200 text-sm">
            Series A Race 2026, which 5 GitHub-flagged startups raises first by EOY?{" "}
            <span className="text-emerald-400 group-hover:underline">
              gitdealflow.com/markets/series-a-race-2026
            </span>
          </p>
        </Link>
        <Link
          href="/receipts"
          className="block mb-6 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 px-4 py-3 transition-colors group"
        >
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Receipts
          </p>
          <p className="text-gray-200 text-sm">
            See every unicorn you starred <em>before</em> the news broke →{" "}
            <span className="text-amber-400 group-hover:underline">
              gitdealflow.com/receipts
            </span>
          </p>
        </Link>
        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Free tool, no signup
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Get a Startup&rsquo;s Breakout Signal in 2 Seconds
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            Paste any startup&rsquo;s GitHub organization name. We pull live
            commit velocity, contributor growth, and signal classification from
            our weekly index of {period.name} acceleration data. Same engine VCs
            use to spot seed-stage breakouts before the round closes.
          </p>
        </header>

        <AgentSummary
          tldr={`Predict is the forward-looking counterpart to GitHub Receipts: pick any GitHub org, call whether they raise a Series A in 6 months with a 50-99% confidence value, and we auto-resolve at the 6-month window. Free tier: 3 predictions / month. Same engine reads our ${period.name} dataset of 400+ venture-backed startups across 15 sectors. Public scout profile at /s/{handle}, leaderboard at /leaderboard.`}
          pageUrl="https://signals.gitdealflow.com/predict"
          asOf={getDataLastModified().toISOString().slice(0, 10)}
          citeAs={`VC Deal Flow Signal, Predict (signals.gitdealflow.com/predict), ${period.name}.`}
          facts={[
            {
              claim:
                "Resolution is automatic at the 6-month window. Correct calls = +confidence/10 pts; wrong calls = −confidence/20 pts.",
              sourceUrl: "https://signals.gitdealflow.com/llms-full.txt",
              sourceLabel: "Methodology",
            },
            {
              claim:
                "Same five-rank ladder as Receipts: Curious → Scout → Sharp → Elite → Oracle.",
              sourceUrl: "https://signals.gitdealflow.com/leaderboard",
              sourceLabel: "Leaderboard",
            },
            {
              claim:
                "Underlying signal data is exposed via MCP (get_startup_signal), JSON (/api/signal?name=...), and the function-calling API.",
              sourceUrl: "https://signals.gitdealflow.com/agents.md",
              sourceLabel: "agents.md",
            },
          ]}
        />

        <section className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            What you get the moment you play, free
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-300 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono pt-0.5">01</span>
              <span>
                <span className="text-gray-100 font-medium">
                  Live breakout signal
                </span>{" "}
                for any GitHub org, scored against 15 sectors.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono pt-0.5">02</span>
              <span>
                <span className="text-gray-100 font-medium">
                  Free Weekly Signal Report
                </span>{" "}
                mailed every Monday, 10 breakout-tagged startups with raw GitHub metrics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono pt-0.5">03</span>
              <span>
                <span className="text-gray-100 font-medium">
                  Public scout profile
                </span>{" "}
                at <code className="text-sky-400">/s/[handle]</code>: shareable track record, auto-resolved calls, reputation ladder.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono pt-0.5">04</span>
              <span>
                <span className="text-gray-100 font-medium">
                  MCP + Chrome extension
                </span>{" "}
                for Claude / Cursor / any IDE plus Crunchbase + AngelList badges.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono pt-0.5">05</span>
              <span>
                <span className="text-gray-100 font-medium">
                  First-100 Founder Scout badge
                </span>{" "}
                on your profile, permanent, non-transferable. Seeding <span className="text-amber-400">in progress</span>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono pt-0.5">06</span>
              <span>
                <span className="text-gray-100 font-medium">
                  SSRN-indexed methodology
                </span>{" "}
peer-reviewable paper at{" "}
                <a
                  href="https://ssrn.com/abstract=6606558"
                  className="text-sky-400 hover:text-sky-300 underline underline"
                  target="_blank"
                  rel="noopener"
                >
                  ssrn.com/abstract=6606558
                </a>
                . Citeable in any LP update.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-gray-400">
            All of it free, no card. Paste an org below to see its live breakout
            signal, then make your own call.
          </p>
        </section>

        <Suspense
          fallback={
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-gray-400 text-sm">
              Loading predictor…
            </div>
          }
        >
          <PredictFormUrlPrefill />
        </Suspense>

        <section className="mt-14">
          <div className="mb-6">
            <p className="text-amber-400 text-sm font-medium mb-2 uppercase tracking-wider">
              Scout game · Free to play
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-3 leading-tight">
              Now make your own call.
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              The signal tells you what the data says. The scout game tracks
              what <em>you</em> see. Call it: does this team raise in the next
              6 months? We resolve every prediction automatically. Right calls
              move you up the rank ladder.
            </p>
          </div>

          <Suspense fallback={null}>
            <ScoutCallFormUrlPrefill />
          </Suspense>
        </section>

        <section className="mt-12 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Scout rank ladder
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="inline-block w-20 font-mono text-xs text-emerald-400 uppercase tracking-wider pt-1">
                Curious
              </span>
              <span className="flex-1 text-sm">
                You made your first call. Welcome to the game.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-20 font-mono text-xs text-sky-400 uppercase tracking-wider pt-1">
                Scout
              </span>
              <span className="flex-1 text-sm">
                10+ predictions, 40% accuracy. Free-tier cap. Public profile unlocks.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-20 font-mono text-xs text-purple-400 uppercase tracking-wider pt-1">
                Sharp
              </span>
              <span className="flex-1 text-sm">
                25+ predictions, 55% accuracy. Paid only. Unlimited calls + private mode.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-20 font-mono text-xs text-amber-400 uppercase tracking-wider pt-1">
                Elite
              </span>
              <span className="flex-1 text-sm">
                50+ predictions, 65% accuracy. Featured in weekly &ldquo;Top 10 Scouts&rdquo; email.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-20 font-mono text-xs text-rose-400 uppercase tracking-wider pt-1">
                Oracle
              </span>
              <span className="flex-1 text-sm">
                100+ predictions, 70% accuracy, top 1% globally. Inner-circle Telegram + lifetime founder badge.
              </span>
            </li>
          </ul>
          <p className="mt-5 text-xs text-gray-400">
            First 100 scouts to submit a prediction earn a permanent{" "}
            <strong className="text-emerald-400">Founder Scout</strong> badge on
            their public profile. Seeding in progress, be in the first 100.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Top 6 accelerating right now ({period.name})
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            Click any to test the tool with that org pre-filled.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {top.map((s) => (
              <Link
                key={s.name}
                href={`/predict?org=${encodeURIComponent(s.name)}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-gray-100 font-semibold text-sm">
                    {s.name}
                  </span>
                  <span className="text-emerald-400 text-xs font-mono">
                    {s.commitVelocityChange}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                  <span>{s.contributors} contributors</span>
                  <span>·</span>
                  <span>{s.commitVelocity14d} commits/14d</span>
                </div>
                <SignalBadge type={s.signalType} />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-gray-100 font-semibold text-lg mb-3">
            How the signal is computed
          </h2>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>We crawl public GitHub for the org&rsquo;s most active repository.</li>
            <li>
              Compute commits, unique contributors, and new repos over a rolling
              14-day window.
            </li>
            <li>
              Compare to the prior 14 days. {">"}50% velocity change ={" "}
              <span className="text-emerald-400">accelerating</span>.
            </li>
            <li>
              Acceleration patterns have preceded fundraise announcements by 3-6
              weeks in our data.
            </li>
          </ul>
          <p className="mt-4 text-xs text-gray-400">
            Full methodology:{" "}
            <Link
              href="/methodology"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              /methodology
            </Link>
          </p>
        </section>

        <section className="mt-12 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Want all 10 startups we predict will raise in Q3 2026?
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Public watchlist. Bookmark and verify in 6 months.
          </p>
          <Link
            href="/predicted"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
          >
            See the watchlist &rarr;
          </Link>
        </section>

        <section className="mt-12 rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8">
          <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Free bonus &middot; README badge
          </p>
          <h2 className="text-gray-100 font-bold text-xl mb-3">
            Show your scout rank on your GitHub profile
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-2xl">
            Once you have a public scout profile, drop the live Scout Score
            badge into your GitHub README. Auto-updates from your starring
            history, no signup, no telemetry. Same look as Codecov or WakaTime.
          </p>
          <Link
            href="/badge-builder"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-medium transition-colors"
          >
            Open badge builder &rarr;
          </Link>
        </section>

        <DataNerdSignoff variant="compact" className="mt-12" />
      </div>
    </>
  );
}
