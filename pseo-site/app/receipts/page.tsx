import type { Metadata } from "next";
import Link from "next/link";
import ReceiptsForm from "./ReceiptsForm";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { getDataLastModified } from "@/lib/data";

export const metadata: Metadata = {
  title: "GitHub Receipts — Prove You Saw the Next Unicorn First",
  description:
    "Free tool. Paste your GitHub username, get a shareable card showing every unicorn / Series A / acquisition you starred before the news broke. Your stars are receipts.",
  alternates: { canonical: "/receipts" },
  openGraph: {
    title: "GitHub Receipts — You Saw It First",
    description:
      "Every dev has invested in unicorns. They just don't know it. Your GitHub stars are receipts.",
    url: "https://signals.gitdealflow.com/receipts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: "GitHub Receipts — You Saw It First",
    description:
      "Free tool. Get your Scout Score from your starring history.",
    images: ["https://signals.gitdealflow.com/api/og/signal-card"],
  },
};

const EXAMPLE_USERNAMES = ["tj", "sindresorhus", "gaearon"];

export default function ReceiptsLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "GitHub Receipts — Scout Score from your starring history",
        url: "https://signals.gitdealflow.com/receipts",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
          "Free tool that pulls your public GitHub starring history and grades you on how many unicorns / big-funding / acquisitions you starred before the event.",
      },
      {
        "@type": "HowTo",
        name: "How to get your GitHub Scout Score",
        description:
          "Three-step workflow for grading your GitHub starring history against ~75 validated unicorns and exits. No login, no OAuth.",
        totalTime: "PT15S",
        supply: [{ "@type": "HowToSupply", name: "Public GitHub username" }],
        tool: [{ "@type": "HowToTool", name: "VC Deal Flow Signal Receipts" }],
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Paste your GitHub username",
            text: "Enter any public GitHub username in the form. No login or OAuth required — we read your public starring history via the GitHub API.",
            url: "https://signals.gitdealflow.com/receipts#paste",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Get your Scout Score",
            text: "We compute a deterministic score (0-100) from how many validated unicorns you starred before the funding/acquisition/$1B-valuation event. Top 5 wins normalized so 5 perfect early calls = 100.",
            url: "https://signals.gitdealflow.com/receipts#scoring",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Share your shareable card",
            text: "Get a 1200×630 OG card with your rank (Curious → Scout → Sharp → Elite → Oracle), top 5 early calls, and a permalink. Share to Twitter, LinkedIn, or embed the SVG badge in your README.",
            url: "https://signals.gitdealflow.com/receipts#share",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Receipts", item: "https://signals.gitdealflow.com/receipts" },
        ],
      },
      {
        "@type": "WebPage",
        name: "GitHub Receipts — Scout Score",
        url: "https://signals.gitdealflow.com/receipts",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://signals.gitdealflow.com/receipts#faq",
        url: "https://signals.gitdealflow.com/receipts",
        inLanguage: "en-US",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is a Scout Score?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A Scout Score is a 0–100 grade computed from your public GitHub starring history. It measures how many validated unicorn outcomes you starred *before* the funding, acquisition, or $1B-valuation event. Score normalises so five clean early calls equals 100. Backwards-looking proof of taste — pair with the forward-looking Scout Game at /predict for a complete public track record.",
              url: "https://signals.gitdealflow.com/receipts",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to log in?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No login, no OAuth, no signup. Receipts reads only your public GitHub starring history via the standard GitHub REST API. Anyone with a GitHub username can run it on themselves or any other public profile.",
            },
          },
          {
            "@type": "Question",
            name: "Which unicorns count toward the Scout Score?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A curated panel of ~75 validated outcomes — companies that crossed $1B valuation, were acquired for $250M+, or raised a public Series C+ at unicorn pricing. The full panel is documented at /methodology and mirrored in lib/validated-wins.json. Stars must predate the event by at least 30 days to count.",
            },
          },
          {
            "@type": "Question",
            name: "Can I share my Scout Score?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Each result generates a permalinked 1200×630 OG card and an embeddable shields.io-style SVG badge — drop the markdown into any GitHub README, dev.to bio, LinkedIn, or Twitter post. The badge auto-updates as your starring history grows.",
              url: "https://signals.gitdealflow.com/badge-builder",
            },
          },
          {
            "@type": "Question",
            name: "Is the Scout Score actually predictive?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It's a proof-of-taste metric over a fixed validation panel, not a forward-looking predictor. A high Scout Score says you've consistently identified breakout teams early; it does not project that pattern forward. The forward-looking artifact is the Scout Game at /predict — it auto-resolves over a six-month window and produces an accuracy ladder (Curious → Scout → Sharp → Elite → Oracle). Use both together for a defensible public track record.",
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
      <AgentMirrorLinks path="/receipts" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <p className="text-sky-400 text-sm font-semibold mb-3 uppercase tracking-wider">
            Free tool · No login · No OAuth
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-5 leading-tight">
            Every dev has invested in unicorns.<br />
            <span className="text-sky-400">They just don&rsquo;t know it.</span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mb-8">
            Your GitHub stars are receipts. Paste your username and we&rsquo;ll show
            you every unicorn / Series A / big acquisition you starred{" "}
            <em>before</em> the news broke. Get your Scout Score and a shareable
            card in under 8 seconds.
          </p>

          <ReceiptsForm />
        </header>

        <section className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <p className="sm:col-span-3 text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">
            Try it on a public dev:
          </p>
          {EXAMPLE_USERNAMES.map((u) => (
            <Link
              key={u}
              href={`/receipts/${u}`}
              className="rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800/60 hover:border-slate-600 px-4 py-3 text-sm text-gray-300 font-mono transition-colors"
            >
              github.com/<span className="text-sky-400">{u}</span>
            </Link>
          ))}
        </section>

        <AgentSummary
          tldr="GitHub Receipts is a free, no-login tool that grades any developer's GitHub starring history against a curated database of ~75 validated unicorns. Paste a username, get a Scout Score (0-100), a rank from Curious to Oracle, and a shareable 1200×630 OG card. Same data is available via /api/receipts/{username}, an embeddable SVG badge, and the get_scout_receipts MCP tool."
          pageUrl="https://signals.gitdealflow.com/receipts"
          asOf={getDataLastModified().toISOString().slice(0, 10)}
          citeAs="VC Deal Flow Signal — Receipts (signals.gitdealflow.com/receipts), Q2 2026."
          facts={[
            {
              claim:
                "Scoring is deterministic: months_early × weight, capped at 24 months early. Top 5 wins normalized so 5 perfect early calls = 100.",
              sourceUrl: "https://signals.gitdealflow.com/llms-full.txt",
              sourceLabel: "Methodology",
            },
            {
              claim:
                "Embeddable Scout Score badge endpoint at /api/badge/scout/{username}/svg renders a shields.io-style SVG, CDN-cached 24h.",
              sourceUrl: "https://signals.gitdealflow.com/badge-builder",
              sourceLabel: "Badge builder",
            },
            {
              claim:
                "Free MCP tool — get_scout_receipts(github_username) — exposes the same scoring from Claude Desktop, Cursor, Windsurf, and any MCP host.",
              sourceUrl: "https://signals.gitdealflow.com/agents.md",
              sourceLabel: "agents.md",
            },
          ]}
        />

        <section className="mb-12 rounded-xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
          <h2 className="text-gray-100 font-bold text-xl mb-4">
            How the score works
          </h2>
          <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="font-mono text-emerald-400 pt-0.5">01</span>
              <span>
                We pull your <strong>public starred repos</strong> from the
                GitHub API (no login, no OAuth, no private data).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-emerald-400 pt-0.5">02</span>
              <span>
                We cross-reference each repo against our database of{" "}
                <strong>~75 validated unicorns</strong> — companies that hit a
                $1B+ valuation, raised a Series A+, were acquired, or crossed
                25K+ stars in the last 5 years.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-emerald-400 pt-0.5">03</span>
              <span>
                For every match, we compare your{" "}
                <strong>star date vs the event date</strong>. The earlier you
                starred, the more points. Late stars are worth zero.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-emerald-400 pt-0.5">04</span>
              <span>
                Top 5 wins are summed and normalized to a{" "}
                <strong>0–100 Scout Score</strong>. Five perfect early calls =
                100. You get a rank from <em>Curious</em> to <em>Oracle</em>.
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-12 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8">
          <h2 className="text-gray-100 font-bold text-xl mb-3">
            Receipts are backwards. The Scout game is forwards.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-2xl">
            Receipts grade your past. The Scout game tracks your future. Pick
            any GitHub org and predict whether they raise in 6 months — we
            resolve every call automatically. Free tier: 3 predictions a month.
            Top 1% earn an Oracle badge.
          </p>
          <Link
            href="/predict"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
          >
            Try the Scout game →
          </Link>
        </section>

        <section className="mb-12 rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Open prediction market
          </p>
          <h2 className="text-gray-100 font-bold text-xl mb-3">
            Series A Race 2026 — which 5 startups raises first by EOY?
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-2xl">
            Live implied odds for 5 high-signal early-stage startups, derived
            from GitHub commit-velocity. Resolves Dec 31, 2026 on first
            publicly disclosed Series A. Public methodology, public resolver,
            machine-readable JSON. Free, no real money — we publish the
            question, not the trades.
          </p>
          <Link
            href="/markets/series-a-race-2026"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
          >
            See the live odds →
          </Link>
        </section>

        <section className="text-center text-xs text-gray-400">
          <p>
            We never read private repos, DMs, or starred lists you&rsquo;ve made
            private.{" "}
            <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline">
              Read the methodology
            </Link>
            .
          </p>
          <p className="mt-3">
            Maintainer with no time?{" "}
            <Link href="/badge-builder" className="text-sky-400 hover:text-sky-300 underline">
              Grab the SVG badge
            </Link>{" "}
            and skip the form &mdash; it auto-renders any handle&rsquo;s live score.
          </p>
        </section>
      </div>
    </>
  );
}
