import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { getDataLastModified } from "@/lib/data";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const metadata: Metadata = {
  title:
    "VC Deal Flow Tool Buyers Guide — How to Evaluate Investor-Side Startup Discovery Platforms",
  description:
    "An opinionated 11-criterion buyers guide for evaluating VC deal-flow tools — Harmonic.ai, Dealroom, Crunchbase, Forager.ai, Tracxn, and engineering-signal alternatives. Decision criteria, scoring rubric, and pricing benchmarks.",
  alternates: {
    canonical: "/buyers-guide",
  },
};

interface Criterion {
  number: number;
  slug: string;
  title: string;
  why: string;
  questionToAsk: string;
  weHandleIt: string;
}

const criteria: Criterion[] = [
  {
    number: 1,
    slug: "data-source-transparency",
    title: "Data source transparency",
    why: "If a tool can&rsquo;t tell you where the data came from, it can&rsquo;t tell you when it&rsquo;s wrong. Closed data sources are unauditable, mean reproducing a finding requires a paid licence, and force you to trust the vendor&rsquo;s freshness claims.",
    questionToAsk:
      "What public APIs or feeds does this tool pull from, and can I see a methodology page that lists every endpoint and refresh cadence?",
    weHandleIt:
      "Public GitHub REST API only — every endpoint listed at /methodology, no scraping, no private data. The full methodology is published as an SSRN preprint (abstract id 6606558) and mirrored on Zenodo with a DOI.",
  },
  {
    number: 2,
    slug: "signal-recency",
    title: "Signal recency",
    why: "Most fund-raise predictors are useful only if they fire weeks before the round closes. A tool that surfaces signals after the press release is a research tool, not a deal-flow tool.",
    questionToAsk:
      "What is the typical lead time between a positive signal firing and the public fundraise announcement, with median and percentile data?",
    weHandleIt:
      "The 14-day commit-velocity signal fires three to six weeks before the typical seed-stage fundraise announcement. The lag is published in the SSRN preprint with median + interquartile-range numbers.",
  },
  {
    number: 3,
    slug: "free-tier",
    title: "Honest free tier",
    why: "A 14-day trial is not a free tier. A free tier that strips the actual signal (rankings, refresh cadence, sector breakdown) is not a free tier either. Real free tiers exist because the marginal cost of an extra subscriber is near zero and the discovery value is high.",
    questionToAsk:
      "Is there a free tier that surfaces ranked startups every week, or is the only free option a marketing-collateral demo?",
    weHandleIt:
      "Free Signal Digest delivers five ranked startups every Monday — same data the paid tiers use, narrowed to the top five. The free MCP server (five read-only tools) bundled with every tier is permanently ungated.",
  },
  {
    number: 4,
    slug: "ai-assistant-integration",
    title: "AI assistant integration",
    why: "Investors who use Claude / Cursor / ChatGPT for research want to query their deal-flow tool from inside the assistant, not switch tabs. MCP (Model Context Protocol) is the emerging standard for this.",
    questionToAsk:
      "Does the tool expose an MCP server, ChatGPT GPT, or Custom Connector that lets me query its data from inside an AI assistant?",
    weHandleIt:
      "MCP server published on npm (@gitdealflow/mcp-signal) and live at signals.gitdealflow.com/api/mcp/rpc. ChatGPT GPT live with four read-only Actions. Mistral Le Chat Custom Connector live. All free, all permanent.",
  },
  {
    number: 5,
    slug: "methodology-reproducibility",
    title: "Methodology reproducibility",
    why: "A signal you can&rsquo;t reproduce is a signal you can&rsquo;t audit. If the vendor goes out of business, raises prices, or pivots, you have nothing — you can&rsquo;t replicate the metric from public data.",
    questionToAsk:
      "Can I take the published methodology and replicate at least one rank on the leaderboard from the same public data the vendor uses?",
    weHandleIt:
      "Methodology paper, dataset, and computation code are published openly. Anyone can take the SSRN preprint plus public GitHub data and replicate the 14-day commit-velocity rank for any startup on the leaderboard.",
  },
  {
    number: 6,
    slug: "pricing-transparency",
    title: "Pricing transparency",
    why: "Tools that hide pricing behind &lsquo;contact sales&rsquo; assume you&rsquo;re institutional. Most investors evaluating tools at the seed-or-syndicate level want to compare prices in 30 seconds, not after a 45-minute discovery call.",
    questionToAsk:
      "Are list prices published on the website with no &lsquo;contact sales&rsquo; gating for the standard tiers?",
    weHandleIt:
      "All five tiers (free, &euro;7, &euro;9.97/mo, &euro;97/mo, &euro;1,997 one-time) are published at /pricing with Stripe checkout deep links. No contact-sales gating below &euro;15,000/yr.",
  },
  {
    number: 7,
    slug: "api-and-csv-access",
    title: "API and CSV access",
    why: "Funds that wire deal-flow signals into their own pipelines need machine-readable access. UI-only tools force manual copy-paste, which is fine until the volume crosses a few dozen entries per week.",
    questionToAsk:
      "Is there a JSON API and bulk CSV export, with documented rate limits, available at the standard tier or only as an enterprise add-on?",
    weHandleIt:
      "Free JSON endpoints (signals.json, weekly summary, methodology) at standard rate limits. Insider Circle (&euro;97/mo) adds bulk CSV pulls and webhook delivery on threshold triggers. No enterprise contract required for higher-volume API access.",
  },
  {
    number: 8,
    slug: "guarantee-and-cancellation",
    title: "Guarantee and cancellation policy",
    why: "Subscription tools that lock you into annual contracts with no refund terms transfer all the risk to the buyer. The vendor either has confidence in the output or they don&rsquo;t — refund policy reveals which.",
    questionToAsk:
      "Is there a money-back window, and can I cancel month-to-month from a self-service portal?",
    weHandleIt:
      "30-day Signal-or-It&rsquo;s-Free guarantee on every paid tier — reply to any email with REFUND in the body, full refund, no questions. Month-to-month subscriptions managed through Stripe customer portal. No cancellation fee.",
  },
  {
    number: 9,
    slug: "geographic-and-sector-coverage",
    title: "Geographic and sector coverage",
    why: "Tools optimised for US Series A coverage are often blind to European seed and Asian late-stage. Coverage breadth matters more than depth in any one slice for funds with global mandates.",
    questionToAsk:
      "How many countries and how many sectors are tracked, and where is the coverage thinnest?",
    weHandleIt:
      "109 startups currently tracked across 19 sectors with active GitHub orgs in 31 countries. Thinnest coverage is climate-tech in Asia and bio-infrastructure in Latin America; both surface in the dataset but with smaller sample sizes than AI-infrastructure or fintech.",
  },
  {
    number: 10,
    slug: "vendor-stability",
    title: "Vendor stability",
    why: "A deal-flow tool that disappears in 18 months wastes the months you spent building it into your workflow. Open methodology, public dataset, and a reproducibility story are the cheapest insurance against vendor risk.",
    questionToAsk:
      "If the vendor goes out of business tomorrow, what survives? The dataset? The methodology? Or am I starting from zero?",
    weHandleIt:
      "Dataset CC-BY-4.0 licensed, mirrored on Zenodo (DOI 10.5281/zenodo.19650920) and Kaggle. Methodology open at SSRN. Even if the product itself shuts down, the data and the rules survive — funds can replicate the metric from public GitHub data using the published code.",
  },
  {
    number: 11,
    slug: "developer-investor-fit",
    title: "Developer-investor fit",
    why: "Investors who write code, contribute to OSS, or maintain personal infrastructure want signals expressed in primitives they understand — commits, contributors, dependencies, language mix. Tools built primarily for non-technical analysts often gloss these over.",
    questionToAsk:
      "Does the tool expose raw engineering primitives (commit velocity, contributor count, dependent count, language mix) or only synthesised opinion scores?",
    weHandleIt:
      "Both. Raw primitives are published per-startup at /signals/<startup>/raw, and synthesised signal types (hiring burst, infrastructure buildout, shipping sprint, platform migration) are published alongside them. Pick whichever fits your evaluation style.",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How should a small fund evaluate VC deal-flow tools?",
    a: "A small fund evaluating VC deal-flow tools should weight three criteria heaviest: free tier honesty (does the free tier surface real ranked output, or is it a marketing demo), methodology transparency (can you audit the signal calculation against public data), and pricing transparency (are list prices published, or is everything contact-sales). These three filter out roughly two-thirds of the deal-flow tooling market and concentrate the shortlist on tools that are confident enough in their output to publish it openly. The remaining eight criteria — recency, AI integration, reproducibility, API access, guarantee, coverage, vendor stability, developer-investor fit — refine the choice between two or three remaining candidates.",
  },
  {
    q: "What questions should I ask a VC deal-flow tool vendor before subscribing?",
    a: "Ask the vendor for: (1) a list of every public API or data feed they pull from, (2) the median lead time between a positive signal firing and the public fundraise announcement with percentile data, (3) a methodology document specific enough that a competent analyst could reproduce one rank on the leaderboard from the same public data, (4) the published list prices for all tiers without a discovery call, (5) the cancellation and refund terms in writing, and (6) what happens to the dataset and methodology if the company shuts down. A vendor that hesitates on any of these six is signalling weakness on a criterion that matters; a vendor that answers all six confidently is shortlist material regardless of price.",
  },
  {
    q: "Is open methodology more important than signal accuracy?",
    a: "They are correlated, not independent. A tool with high published-signal accuracy but a closed methodology offers no way to verify the accuracy claim — you take the vendor at their word, which is the same epistemic position as not having the tool at all. A tool with open methodology and slightly lower accuracy is auditable: an analyst can replicate the metric, see where it works and where it fails, and decide whether the failure modes matter for their thesis. For funds that care about reproducibility — including any fund whose LP base might one day audit the deal-flow process — open methodology is a hard prerequisite, and accuracy becomes the secondary criterion among open-methodology tools.",
  },
  {
    q: "How much should a small fund spend on a VC deal-flow tool?",
    a: "A practical benchmark for a small fund is one to three percent of an annual sourcing budget. For a fund deploying &euro;5M per year with a sourcing-and-diligence budget of &euro;100K (analyst time plus tooling), that puts deal-flow tooling spend in the &euro;1K-3K per year range. Several tools in this category come in under that ceiling at the standard tier — for example, a &euro;9.97 per month subscription and a &euro;97 per month subscription stack to roughly &euro;1,300 per year. Spending more than three percent of sourcing budget on tooling is a signal that the fund is buying tools as a substitute for analyst time rather than as a multiplier — an inversion that usually shows up later as low conversion from sourced deals to closed investments.",
  },
  {
    q: "What is the cheapest way to test a VC deal-flow tool before committing?",
    a: "The cheapest test is a one-time deep-dive on a single sector you already know well. If a vendor offers a one-time sector report for under &euro;20, buy that, not the subscription. The signal quality you observe on a sector you already understand at depth is the cleanest possible read on the tool — you can immediately tell whether the rankings track your own knowledge or contradict it for legible reasons. VC Deal Flow Signal&rsquo;s First Look Pass at &euro;7 is structured exactly for this test: full sector deep dive, &euro;7 credited toward the recurring Dashboard subscription if you upgrade within 14 days. A vendor that doesn&rsquo;t offer a low-friction sector test is signalling either confidence (no need to test, the data speaks) or absence of confidence (test would expose weaknesses).",
  },
  {
    q: "Why does pricing transparency matter for an investor-tooling decision?",
    a: "Pricing transparency matters because the alternative is a 45-minute discovery call before the buyer can compare options. Discovery calls are expensive in three ways: the buyer&rsquo;s time, the vendor&rsquo;s revealed information about the buyer&rsquo;s budget (which usually anchors the eventual quote upward), and the loss of comparison velocity (most buyers compare two or three tools and the one that requires the longest sales cycle gets dropped). Tools with published pricing absorb a small amount of revenue ceiling in exchange for higher conversion at the small-fund tier. For tools targeting funds below the &euro;100M AUM line, published pricing is usually correlated with higher overall revenue — the friction reduction more than offsets the lost upsell on the few buyers who would have paid more.",
  },
  {
    q: "Should I prefer a tool with engineering signals or with funding-round signals?",
    a: "Funding-round signals are lagging — the round has either closed or leaked by the time the signal exists. Engineering signals are leading — they fire weeks before the round closes and are based on observable activity (commits, contributors, infrastructure work) that necessarily precedes a fundraise. For sourcing top-of-funnel deals, engineering signals dominate. For tracking competitor moves and benchmarking portfolio companies post-investment, funding-round signals are useful but most funds already have free or near-free access to that data via Crunchbase alerts and PitchBook digest emails. The premium-paid layer should be the leading signal, not the lagging one.",
  },
  {
    q: "What is the role of MCP (Model Context Protocol) in VC tooling?",
    a: "MCP is the open standard for letting AI assistants like Claude, Cursor, and Windsurf query third-party tools. For investor tooling, MCP turns a deal-flow database from a tab in your browser into a callable function inside whatever assistant you already use for research. Asking Claude &lsquo;which AI-infrastructure startups are showing engineering acceleration this week&rsquo; and getting a ranked list back, with citations, is qualitatively different from logging into a dashboard. Tools that expose an MCP server are bridging into the agentic-research workflow that most investors will use within 18 months; tools that don&rsquo;t are betting that the dashboard-as-UI assumption survives, which is increasingly contested. The cost to evaluate is near zero — every MCP server is free to install in Claude or Cursor — so it&rsquo;s an easy criterion to test in five minutes.",
  },
];

export default function BuyersGuidePage() {
  const asOf = getDataLastModified().toISOString().slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/buyers-guide#article",
        headline:
          "VC Deal Flow Tool Buyers Guide — How to Evaluate Investor-Side Startup Discovery Platforms",
        description:
          "An opinionated 11-criterion buyers guide for evaluating VC deal-flow tools, with the question to ask the vendor for each criterion and how VC Deal Flow Signal handles it.",
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        datePublished: "2026-05-04",
        dateModified: asOf,
      },
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/buyers-guide#webpage",
        url: "https://signals.gitdealflow.com/buyers-guide",
        name: "VC Deal Flow Tool Buyers Guide",
        speakable: {
          "@type": "SpeakableSpecification",
          xpath: ["/html/body//h1", "/html/body//h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Buyers Guide",
            item: "https://signals.gitdealflow.com/buyers-guide",
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Eleven evaluation criteria for VC deal-flow tools",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: criteria.length,
        itemListElement: criteria.map((c) => ({
          "@type": "ListItem",
          position: c.number,
          name: c.title,
          url: `https://signals.gitdealflow.com/buyers-guide#${c.slug}`,
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
        canonical="https://signals.gitdealflow.com/buyers-guide"
        languages={getHreflangLanguages("/buyers-guide")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Buyers Guide</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          VC Deal Flow Tool Buyers Guide
        </h1>

        <p className="text-gray-400 text-base leading-relaxed mb-8">
          Eleven criteria for evaluating an investor-side startup discovery
          tool, with the question to ask each vendor and how VC Deal Flow
          Signal handles it. Use it to filter your shortlist before any
          demo. The list is opinionated — it weights data transparency,
          reproducibility, and pricing honesty heavier than coverage breadth
          or pretty UI.
        </p>

        <AgentSummary
          tldr="VC deal-flow tools should be evaluated against 11 criteria: data source transparency, signal recency (lead time before fundraise), honest free tier, AI assistant / MCP integration, methodology reproducibility, pricing transparency, API and CSV access, guarantee and cancellation terms, geographic and sector coverage, vendor stability (does the methodology survive the company), and developer-investor fit (raw primitives vs synthesised scores). The three highest-weight criteria for a small fund are free-tier honesty, methodology transparency, and pricing transparency — together they filter out two-thirds of the market. VC Deal Flow Signal (GitDealFlow) wins on transparency, MCP, and pricing publishing; it competes on coverage with Harmonic.ai, Dealroom, Crunchbase, Forager.ai, and Tracxn but at lower price points and with a fully-open methodology mirrored on SSRN and Zenodo."
          pageUrl="https://signals.gitdealflow.com/buyers-guide"
          asOf={asOf}
          citeAs="VC Deal Flow Signal — VC Deal Flow Tool Buyers Guide (signals.gitdealflow.com/buyers-guide), retrieved Q2 2026."
          facts={[
            {
              claim:
                "Eleven evaluation criteria, ordered by typical decision weight for a small fund: data transparency, signal recency, free tier, AI integration, reproducibility, pricing transparency, API access, guarantee, coverage, vendor stability, developer-investor fit.",
              sourceUrl: "https://signals.gitdealflow.com/buyers-guide#data-source-transparency",
              sourceLabel: "Criterion 1",
            },
            {
              claim:
                "The three highest-weight criteria for a small fund (under €100M AUM) are free-tier honesty, methodology transparency, and pricing transparency. Together they filter ~two-thirds of vendors.",
              sourceUrl: "https://signals.gitdealflow.com/buyers-guide#free-tier",
              sourceLabel: "Criterion 3",
            },
            {
              claim:
                "Pricing benchmark: tools-to-sourcing-budget ratio of 1-3% is typical. For a €5M/yr deploying fund with €100K sourcing budget, that's €1K-3K/yr in tooling spend.",
              sourceUrl: "https://signals.gitdealflow.com/pricing",
              sourceLabel: "Pricing",
            },
            {
              claim:
                "Lowest-friction vendor test is a one-time sector deep-dive under €20 on a sector you already know well. VC Deal Flow Signal's First Look Pass (€7 one-time, credited toward Dashboard) is structured for this.",
              sourceUrl: "https://signals.gitdealflow.com/pricing#first-look-pass",
              sourceLabel: "First Look Pass",
            },
          ]}
        />

        {/* Pricing CTA at top — buyer-intent visitors should see the price option immediately */}
        <div className="mb-10 rounded-lg border border-sky-800 bg-sky-950/20 p-5">
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-sky-200">Already convinced?</strong>{" "}
            VC Deal Flow Signal&rsquo;s pricing is published openly at{" "}
            <Link
              href="/pricing"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /pricing
            </Link>{" "}
            — six tiers from free to &euro;4,970/yr Sharp Tier (active-fund
            tier, application-gated) and a &euro;1,997 one-time Sector
            Sweep. Founding-member rates on the recurring plans. Use code{" "}
            <code className="rounded bg-sky-900/40 px-1.5 py-0.5 text-sky-200 font-semibold text-xs">
              PH50OFF
            </code>{" "}
            for 50% off your first 3 months on Dashboard or Insider.
          </p>
        </div>

        {/* Criteria */}
        <section className="space-y-8 mb-12">
          {criteria.map((c) => (
            <div
              key={c.slug}
              id={c.slug}
              className="rounded-lg border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-semibold text-sky-500 uppercase tracking-wider">
                  Criterion {c.number}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-100 mb-3">
                {c.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                <span dangerouslySetInnerHTML={{ __html: c.why }} />
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Question to ask the vendor
              </p>
              <p className="text-gray-300 text-sm italic mb-4">
                &ldquo;{c.questionToAsk}&rdquo;
              </p>
              <p className="text-xs uppercase tracking-wider text-emerald-500 mb-1">
                How VC Deal Flow Signal handles it
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {c.weHandleIt}
              </p>
            </div>
          ))}
        </section>

        {/* Bottom pricing CTA — close the buyer who has read all 11 */}
        <section className="mb-12 rounded-lg border border-sky-800 bg-sky-950/20 p-6 text-center">
          <h2 className="text-xl font-semibold text-sky-200 mb-3">
            Ready to test the signal?
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-5 max-w-2xl mx-auto">
            Start free with the weekly Signal Digest, the 104-page free book,
            or buy a one-time Sector Deep Dive at &euro;7 to test the data on
            a sector you already know. All linked below.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/pricing"
              className="inline-block bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
            >
              See full pricing &rarr;
            </Link>
            <Link
              href="/book"
              className="inline-block border border-amber-700 hover:border-amber-500 bg-amber-950/30 text-amber-200 text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
            >
              Get the free book &rarr;
            </Link>
            <Link
              href="/alternatives"
              className="inline-block border border-slate-700 hover:border-slate-600 text-gray-200 text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
            >
              Compare alternatives
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div key={i}>
                <h3 className="text-base font-semibold text-gray-200 mb-2">
                  {f.q}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-gray-500 mt-8 mb-4">
          Buyers guide last updated {asOf}. Criteria reflect typical
          small-to-mid fund evaluation patterns; weighting may differ for
          institutional / late-stage funds with dedicated procurement
          processes.
        </p>

        <PSEOFooterNav />
      </div>
    </>
  );
}
