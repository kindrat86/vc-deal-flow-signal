import type { Metadata } from "next";
import Link from "next/link";
import ReceiptsForm from "./ReceiptsForm";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { TrustConversionBlock } from "@/components/TrustConversionBlock";
import { getDataLastModified } from "@/lib/data";

export const metadata: Metadata = {
  title:
    "GitHub Scout Score (Free) — Grade Your Investment Taste from GitHub Stars",
  description:
    "Check your GitHub Scout Score for free and see how your stars map to startup taste, validated signals, and public engineering momentum.",
  alternates: { canonical: "/receipts" },
  keywords: [
    "github scout score",
    "scout score",
    "github stars investment receipts",
    "github starring history grader",
    "investment track record from github",
    "unicorn-spotting taste validation",
    "free github tool no login",
  ],
  openGraph: {
    title: "GitHub Scout Score — Grade Your Investment Taste",
    description:
      "Every dev has invested in unicorns. They just don't know it. Your GitHub stars are the receipts. Free Scout Score from your public starring history.",
    url: "https://signals.gitdealflow.com/receipts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: "GitHub Scout Score (free) — You Saw It First",
    description:
      "Free GitHub Scout Score from your starring history. No login. 8 seconds.",
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
        name: "GitHub Scout Score — taste-grading from public GitHub starring history",
        alternateName: ["GitHub Receipts", "GitDealFlow Scout Score"],
        url: "https://signals.gitdealflow.com/receipts",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
          "Free tool that pulls your public GitHub starring history and grades you on how many unicorns / big-funding / acquisitions you starred before the event.",
      },
      {
        "@type": "Service",
        "@id": "https://signals.gitdealflow.com/receipts#service",
        name: "GitHub Scout Score Service",
        serviceType: "Investment-taste validation",
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        areaServed: "Worldwide",
        audience: {
          "@type": "Audience",
          audienceType:
            "Developer-investors, scout angels, emerging-fund LPs, GP recruiters",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        termsOfService: "https://signals.gitdealflow.com/legal/terms",
        url: "https://signals.gitdealflow.com/receipts",
        description:
          "Backwards-looking investment-taste validation: grade any public GitHub user's starring history against a curated panel of ~75 validated unicorn / big-funding / acquisition outcomes. Returns a 0–100 Scout Score, a five-tier rank (Curious → Oracle), and a shareable OG card. Same data exposed via /api/receipts/{username}, /api/badge/scout/{username}/svg, and the get_scout_receipts MCP tool.",
        subjectOf: { "@id": "https://signals.gitdealflow.com/wins#dataset" },
        isBasedOn: {
          "@type": "CreativeWork",
          "@id": "https://ssrn.com/abstract=6606558",
          name: "SSRN preprint on GitHub engineering-acceleration signals as a leading indicator of venture-stage outcomes",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Scout Score outputs",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Web grade page",
                url: "https://signals.gitdealflow.com/receipts",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Scout Score JSON API",
                url: "https://signals.gitdealflow.com/api/receipts/sindresorhus",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Embeddable SVG badge",
                url: "https://signals.gitdealflow.com/api/badge/scout/sindresorhus/svg",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "MCP tool: get_scout_receipts",
                url: "https://signals.gitdealflow.com/.well-known/agent-card.json",
              },
            },
          ],
        },
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
            Get your <span className="text-sky-400">GitHub Scout Score</span>.<br />
            Every dev has invested in unicorns. They just don&rsquo;t know it.
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mb-8">
            Your GitHub stars are receipts. Paste your username and we&rsquo;ll
            grade your public starring history against ~75 validated unicorns /
            Series A / acquisitions — counting only the ones you starred{" "}
            <em>before</em> the news broke. Free <strong>Scout Score</strong>{" "}
            (0–100) and a shareable card in under 8 seconds.
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

        <section className="mb-12 rounded-xl border border-amber-700/40 bg-amber-950/10 p-6 sm:p-8">
          <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
            No personal GitHub starring history to score? That&rsquo;s fine
            &mdash; you don&rsquo;t need one to use the product. The Scout Score
            is a side door for developers who already star repos. The product
            itself reads the signal for you, in plain business English. You
            never open GitHub.
          </p>
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
            If you want to verify the claim
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-2xl">
            The scoring logic is public. Read the definition page, inspect the methodology, and place Scout Score inside the broader startup-signal stack before you decide how much weight to give it.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/answers/what-is-a-github-scout-score" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">
              What a GitHub Scout Score tells you
            </Link>
            <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">
              Read the methodology
            </Link>
            <Link href="/compare/best-startup-signal-tools-for-investors" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">
              Best startup signal tools for investors
            </Link>
          </div>
        </section>

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

        <div className="mt-12">
          <TrustConversionBlock
            dominant="digest"
            context="No GitHub stars to score? You don't need them — we read the signal for you."
          />
        </div>

        <section className="mt-12">
          <h2 className="text-base font-semibold text-gray-300 mb-4">
            What to read next
          </h2>
          <ul className="space-y-2">
            <li>
              <Link href="/answers/what-is-a-github-scout-score" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">
                What a GitHub Scout Score tells you
              </Link>
            </li>
            <li>
              <Link href="/answers/what-is-startup-engineering-momentum" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">
                What startup engineering momentum means
              </Link>
            </li>
            <li>
              <Link href="https://gitdealflow.com/report" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">
                Read a sample Sunday watchlist
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
