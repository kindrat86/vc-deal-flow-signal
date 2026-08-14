import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

export const dynamic = "force-static";

// AEO 2026-07-18: canonical /scout-score page.
//   Scout Score is VC Deal Flow Signal's proprietary taste metric, on par
//   with how DR is Ahrefs's proprietary authority metric. Without this page
//   the term "scout score" was referenced on /receipts and
//   /answers/what-is-a-github-scout-score but had no canonical / DefinedTerm
//   surface, so AI had no single authoritative definition to cite. This
//   page closes that gap: it brands the metric, defines it, publishes the
//   scoring algorithm in plain English, and emits DefinedTerm + TechArticle
//   + FAQPage JSON-LD so LLMs and search engines have one canonical node.

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title:
    "Scout Score, the proprietary GitHub taste metric VC Deal Flow Signal invented",
  description:
    "Scout Score is a 0-100 measure of investment taste computed from a developer's public GitHub starring history against ~75 validated unicorns. The metric, the formal definition, the scoring algorithm, and how it differs from authority metrics like Ahrefs DR.",
  alternates: { canonical: "/scout-score" },
  openGraph: {
    title: "Scout Score, a 0-100 GitHub taste metric",
    description:
      "Public GitHub starring history graded against ~75 validated unicorns. Definition, algorithm, rank ladder, methodology.",
    url: `${SITE}/scout-score`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scout Score, the GitHub taste metric",
    description:
      "0-100 taste score from public starring history vs ~75 validated unicorns. Free at /receipts.",
  },
};

const SHORT_DEFINITION =
  "Scout Score is a 0-100 measure of investment taste computed from a developer's public GitHub starring history, specifically, how many validated unicorns, big-funding, and acquisition events they starred before the event happened.";

const FORMAL_DEFINITION = [
  "Scout Score is a proprietary metric defined by VC Deal Flow Signal (GitDealFlow) that grades a GitHub user's backwards-looking investment taste from their public starring activity. The input is the user's starred-repo timeline; the benchmark is a curated panel of ~75 validated unicorns, large funding rounds, and acquisitions. The output is a single 0-100 score plus a ranked list of the user's earliest correct calls.",
  "The metric is defined by four properties: (1) input data is fully public and reproducible from the GitHub stars API, (2) the benchmark panel is published and versioned, (3) the scoring algorithm is open-source and deterministic, no AI judgement, no proprietary weighting, (4) the score is backwards-looking only. Scout Score measures whether you *saw it coming*, not whether you will see the next one coming.",
  "Scout Score is not a credit score, a reputation score, or a contributor score. It measures one narrow thing: taste in identifying venture-stage companies before the market did, as evidenced by the only public timestamped trail most developers leave, their GitHub stars.",
];

const RANK_LADDER = [
  {
    score: "0-19",
    rank: "Curious",
    body: "No validated wins in our benchmark, yet. Either a fresh GitHub account, a star history that predates the modern OSS-VC wave, or a taste profile that hasn't aligned with venture-stage outcomes so far. Everyone starts here.",
  },
  {
    score: "20-39",
    rank: "Scout",
    body: "At least one early call landed. The user starred a company that went on to a unicorn round, acquisition, or $1B+ valuation, and they starred it before the event. A real but thin track record.",
  },
  {
    score: "40-59",
    rank: "Sharp",
    body: "Multiple early calls across two or more orgs. The pattern is no longer luck. This is the threshold where the score starts to be useful as a signal of repeatable taste.",
  },
  {
    score: "60-79",
    rank: "Elite",
    body: "A consistent record of starring winners before they were obvious. At this tier the starred-repos feed is itself a leading indicator, high-Elite scouts tend to surface the next wave 6-12 months before the broader market notices.",
  },
  {
    score: "80-100",
    rank: "Oracle",
    body: "Near-perfect taste across five or more validated wins, with significant lead time on most. The top of the ladder. An Oracle scout's new stars are worth tracking as a sourcing channel in their own right.",
  },
] as const;

const HOW_IT_WORKS = [
  {
    n: 1,
    title: "Pull the user's public starred-repo timeline",
    body: "Via the GitHub stars API, a fully public endpoint that returns every public repo the user has starred with a timestamp. No authentication on the user's side, no private data read, no scopes granted. The data was always public; Scout Score just grades it.",
  },
  {
    n: 2,
    title: "Match against the validated-wins panel",
    body: "We maintain a curated, versioned list of ~75 companies that hit a venture-stage event (unicorn valuation, large primary round, acquisition) between 2020 and now. Each entry carries an event date and a weight (25-100) reflecting the event's significance, a $100M Series D weights higher than a $10M Series A.",
  },
  {
    n: 3,
    title: "Compute lead time for every match",
    body: "For each star that lands on a validated-win repo, we compute months between the star timestamp and the event date. If the star predates the event, it's an early call and earns points. If it postdates, it's a late star, counted as a match but worth zero points. Half the signal is the timing, not the pick.",
  },
  {
    n: 4,
    title: "Dedupe by org, rank by points",
    body: "A user can star multiple repos from the same company (the monorepo, the SDK, the docs site). We keep only the earliest star per organisation so one company can't inflate the score. The top 5 wins by points form the headline number.",
  },
  {
    n: 5,
    title: "Normalise to 0-100",
    body: "Five perfect wins (5 × 100 max-weight points) normalise to score 100. The formula is transparent: top5_points_sum ÷ 500 × 100, capped at 100. No curve, no cohort adjustment, no hidden prior. Anyone can reproduce the number from the public star timeline and the published panel.",
  },
] as const;

const WHAT_ITS_NOT = [
  {
    name: "Not a reputation score",
    body: "A high Scout Score does not mean the user is influential, respected, or followed. It means their starring history aligned with venture-stage outcomes. A quiet developer with 50 followers can outscore a celebrity with 50,000.",
  },
  {
    name: "Not a contributor score",
    body: "Scout Score ignores commits, PRs, and issues entirely. It reads only stars, the lightest-weight signal GitHub exposes. The metric measures taste in identifying code worth bookmarking, not engineering output.",
  },
  {
    name: "Not a forward-looking prediction",
    body: "Scout Score is strictly backwards-looking. A high score says 'this person saw the last wave early', it does not say they will see the next wave. The forward-looking product is the weekly Acceleration Watch, not the Scout Score.",
  },
  {
    name: "Not an AOE rank or credit score",
    body: "It has no bearing on hiring, lending, insurance, or any decision outside venture sourcing. The only legitimate use is as a sourcing input: high-scout feeds are worth watching because their new stars correlate with later venture-stage events.",
  },
] as const;

const FAQS = [
  {
    q: "Is Scout Score free?",
    a: "Yes. The tool at /receipts is free, requires no login, no email, and no GitHub OAuth scope beyond public read. Paste a username, get a score in under 10 seconds. The MCP tool get_scout_receipts is also free and never gated.",
  },
  {
    q: "Does Scout Score read my private data?",
    a: "No. Scout Score reads only your public starred-repo timeline, the same data anyone can see by visiting your GitHub profile and clicking the Stars tab. No private repos, no commit content, no email, no OAuth scopes beyond public read.",
  },
  {
    q: "What's a good Scout Score?",
    a: "The median active developer scores in the 5-25 range, most stars predate the modern OSS-VC wave or land on repos outside the validated panel. A score of 40+ (Sharp tier) is genuinely rare and indicates repeatable early-call behaviour. Scores above 60 (Elite) are uncommon enough that the starred-repos feed itself becomes a sourcing signal worth tracking.",
  },
  {
    q: "How is Scout Score different from Ahrefs DR or Domain Rating?",
    a: "DR measures the backlink-based authority of a domain. Scout Score measures the starring-taste of a GitHub user. DR is about citation weight; Scout Score is about call timing. The two metrics operate on completely different surfaces (web link graph vs GitHub star graph) and answer different questions. The structural similarity is that both are proprietary 0-100 metrics owned by a single vendor that publishes the methodology, DR is to backlinks what Scout Score is to GitHub stars.",
  },
  {
    q: "Can I improve my Scout Score?",
    a: "Not by gaming it. Starring more repos won't help, the score rewards early calls on the right repos, not star volume. The only honest way to raise a Scout Score is to develop taste for engineering-led companies before their breakout, which is the skill the metric is measuring. The cleanest side benefit: if you star a company early and it later validates, your score goes up retroactively.",
  },
  {
    q: "Where does the validated-wins panel come from?",
    a: "The panel is curated from Crunchbase funding announcements, acquisition records, and public valuation disclosures between 2020 and now. We publish the list of ~75 companies (with event dates and weights) as part of the open dataset. The curation is human-reviewed; additions and removals are versioned.",
  },
] as const;

export default function ScoutScorePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${SITE}/scout-score#term`,
        name: "Scout Score",
        description: SHORT_DEFINITION,
        url: `${SITE}/scout-score`,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          "@id": `${SITE}/scout-score#termset`,
          name: "VC Deal Flow Signal, proprietary metrics",
          url: `${SITE}/scout-score`,
        },
        termCode: "scout-score",
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          alternateName: "GitDealFlow",
        },
      },
      {
        "@type": "TechArticle",
        "@id": `${SITE}/scout-score#article`,
        headline:
          "Scout Score, the proprietary GitHub taste metric VC Deal Flow Signal invented",
        description: SHORT_DEFINITION,
        url: `${SITE}/scout-score`,
        datePublished: "2026-07-18T00:00:00.000Z",
        dateModified: "2026-07-18T00:00:00.000Z",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
        },
        mainEntityOfPage: `${SITE}/scout-score`,
        about: {
          "@id": `${SITE}/scout-score#term`,
        },
        keywords: [
          "Scout Score",
          "GitHub taste metric",
          "GitHub stars investment receipts",
          "scout score rank ladder",
          "github starring history grader",
          "venture sourcing taste validation",
          "proprietary VC metric",
        ],
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Scout Score",
            item: `${SITE}/scout-score`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/scout-score#faq`,
        mainEntity: FAQS.map((f) => ({
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
        canonical={`${SITE}/scout-score`}
        languages={getHreflangLanguages("/scout-score")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/scout-score" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Scout Score</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            The proprietary metric
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            Scout Score, the GitHub taste metric we invented.
          </h1>
          <p data-speakable className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {SHORT_DEFINITION} The same way Ahrefs owns{" "}
            <strong className="text-gray-100">DR</strong> as the{" "}
            <Link href="/code-side-sourcing" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
              Code-Side Sourcing
            </Link>{" "}
            category&apos;s authority metric, VC Deal Flow Signal owns{" "}
            <strong className="text-gray-100">Scout Score</strong> as the
            backwards-looking taste metric for developer-investors. Free,
            public, reproducible from the GitHub stars API.
          </p>
        </header>

        <section className="rounded-2xl border border-sky-700/30 bg-gradient-to-br from-sky-950/15 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Try it free
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            Get your own Scout Score in under 10 seconds, no login, no email,
            no OAuth scope.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The live tool lives at{" "}
            <Link
              href="/receipts"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /receipts
            </Link>
            . Paste any GitHub username, get the score, the rank, the top 8
            early calls, and a shareable card. This page is the canonical
            definition; the tool is where you run the calculation.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
            <Link
              href="/receipts"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-semibold shadow-sm shadow-signal-500/30 transition-colors"
            >
              Compute my Scout Score →
            </Link>
            <Link
              href="#definition"
              className="text-sm font-medium text-gray-400 hover:text-gray-200 underline decoration-dotted"
            >
              Read the formal definition ↓
            </Link>
          </div>
        </section>

        <section id="definition" className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            The formal definition
          </h2>
          {FORMAL_DEFINITION.map((p, i) => (
            <p
              key={i}
              data-speakable
              className="text-gray-300 text-base leading-relaxed"
            >
              {p}
            </p>
          ))}
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            The rank ladder
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every Scout Score maps to one of five named tiers. The tiers are
            structural, not cohort-adjusted, the same thresholds apply to every
            user regardless of account age or star volume.
          </p>
          <div className="space-y-3">
            {RANK_LADDER.map((tier) => (
              <article
                key={tier.rank}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <span className="font-mono text-sm text-emerald-400">
                    {tier.score}
                  </span>
                  <h3 className="text-gray-100 text-lg font-semibold">
                    {tier.rank}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {tier.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            How the score is computed
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Five deterministic steps. No AI judgement, no proprietary weighting,
            no curve. The algorithm is published here in full, anyone can
            reproduce the number from the public GitHub stars API and the
            published validated-wins panel.
          </p>
          <ol className="space-y-4">
            {HOW_IT_WORKS.map((step) => (
              <li key={step.n} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 text-sm font-mono font-semibold shrink-0">
                    {step.n}
                  </span>
                  <h3 className="text-gray-100 text-lg font-semibold leading-snug">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed pl-10">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            What Scout Score is not
          </h2>
          <div className="grid gap-3">
            {WHAT_ITS_NOT.map((item) => (
              <article
                key={item.name}
                className="rounded-xl border border-amber-700/20 bg-amber-950/10 p-5"
              >
                <h3 className="text-amber-200 text-sm font-semibold uppercase tracking-wider mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            Frequently asked
          </h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <article
                key={f.q}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-2"
              >
                <h3 className="text-gray-100 text-base font-semibold leading-snug">
                  {f.q}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Best next step
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            Run the tool. See if your stars were the receipts.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
            The definition you just read is the canonical surface. The
            computation lives at{" "}
            <Link
              href="/receipts"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /receipts
            </Link>
            . Paste your GitHub username, get the score in under 10 seconds.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href="/receipts"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-signal-500 hover:bg-signal-400 text-white text-sm font-semibold shadow-sm shadow-signal-500/30 transition-colors"
            >
              Get my Scout Score →
            </Link>
            <Link
              href="/code-side-sourcing"
              className="text-sm font-medium text-gray-400 hover:text-gray-200 underline decoration-dotted"
            >
              Read the parent category →
            </Link>
          </div>
          <DataNerdSignoff variant="default" />
        </section>
      </div>
    </>
  );
}
