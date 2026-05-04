import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

export const metadata: Metadata = {
  title: "Glossary — VC Deal Flow Signal Terms & Definitions",
  description:
    "Definitions of key terms used in startup deal flow signal analysis: commit velocity, engineering acceleration, contributor growth, signal types, and more. A reference for investors using GitHub data for deal sourcing.",
  alternates: {
    canonical: "/glossary",
  },
};

interface Term {
  term: string;
  id: string;
  definition: string;
}

const terms: Term[] = [
  {
    term: "Commit Velocity",
    id: "commit-velocity",
    definition:
      "The total number of commits to a startup's most active public GitHub repository over a rolling 14-day window. Commit velocity measures the raw volume of engineering output, not the quality or significance of individual commits. At VC Deal Flow Signal, we track commit velocity as a baseline metric — what matters most for investors is the rate of change (see: Commit Velocity Change).",
  },
  {
    term: "Commit Velocity Change",
    id: "commit-velocity-change",
    definition:
      "The percentage change in commit velocity compared to the preceding 14-day window. This is the primary ranking signal at VC Deal Flow Signal. A startup with 40 commits this period and 20 commits last period shows +100% velocity change. Commit velocity change measures engineering acceleration — whether a team is speeding up, maintaining pace, or slowing down. Sustained acceleration has historically preceded fundraise announcements by three to six weeks.",
  },
  {
    term: "Engineering Acceleration",
    id: "engineering-acceleration",
    definition:
      "A sustained increase in a startup's engineering output relative to its own historical baseline. Engineering acceleration is the core concept behind VC Deal Flow Signal: startups that are accelerating their engineering work are likely approaching a product milestone, scaling the team, or preparing for a fundraise. Unlike absolute engineering volume, acceleration captures the rate of change — making it useful across startups of different sizes.",
  },
  {
    term: "Deal Flow Signal",
    id: "deal-flow-signal",
    definition:
      "Any data-driven indicator that helps an investor identify a promising startup before traditional deal sourcing channels surface it. Traditional deal flow relies on warm introductions, pitch decks, and press coverage. Deal flow signal supplements this with quantitative data from sources like GitHub engineering activity, hiring patterns, and web traffic. The key advantage of signal-based deal sourcing is timing: signals typically appear weeks or months before a startup enters the mainstream investor pipeline.",
  },
  {
    term: "Contributor Growth",
    id: "contributor-growth",
    definition:
      "The change in the number of unique contributors to a startup's GitHub repository over time. Contributor growth is estimated by comparing recent six-week commit volume to the prior six-week period. A rising contributor count often signals team expansion — either through new hires, contractors, or open-source community adoption. For investors, contributor growth is a proxy for whether a startup is scaling its engineering team, which often follows a funding round.",
  },
  {
    term: "Engineering Hiring Burst",
    id: "engineering-hiring-burst",
    definition:
      "A signal type indicating that a startup's contributor growth rate exceeds 50% in a short window. Engineering hiring bursts typically mean the company has recently closed a funding round and is rapidly scaling the team. For investors, this signal may indicate you are too late for the current round but perfectly timed for the next one. It is one of four signal types tracked by VC Deal Flow Signal.",
  },
  {
    term: "Infrastructure Buildout",
    id: "infrastructure-buildout",
    definition:
      "A signal type indicating that a startup has created three or more new public repositories in 30 days. Infrastructure buildouts suggest the company is expanding its technical surface area — building new microservices, internal tools, SDKs, or platform components. This pattern is classic Series A behavior: the core product works, and now the team is building the platform around it.",
  },
  {
    term: "Deploy Frequency Spike",
    id: "deploy-frequency-spike",
    definition:
      "A signal type indicating that a startup's commit velocity has increased 150% or more versus its baseline. Deploy frequency spikes mean the team is shipping code at an unusually high rate. This can indicate a product launch, a pivot, iteration on early customer feedback, or a response to sudden demand. All of these are interesting to investors as potential indicators of product-market fit.",
  },
  {
    term: "Framework Migration",
    id: "framework-migration",
    definition:
      "A signal type indicating general engineering acceleration that does not fit the hiring burst, infrastructure buildout, or deploy spike categories. Framework migrations often indicate a technology stack transition — moving from a prototype stack to a production stack, or adopting new infrastructure. This is the subtlest signal type but can indicate the shift from exploration to exploitation, a key milestone in startup development.",
  },
  {
    term: "pSEO (Programmatic SEO)",
    id: "pseo",
    definition:
      "A content strategy that generates hundreds or thousands of search-optimized pages from structured data using templates. In the context of VC Deal Flow Signal, pSEO is used to create sector-specific startup ranking pages (e.g., 'AI Startups to Watch, Q2 2026') at scale. Each page targets a long-tail search query that investors might use when researching deal flow in specific sectors.",
  },
  {
    term: "GEO (Generative Engine Optimization)",
    id: "geo",
    definition:
      "The practice of structuring website content so that AI assistants and large language models (LLMs) can accurately cite it when answering user questions. GEO involves using structured data (JSON-LD), self-contained summary paragraphs, FAQ schema, and clear methodology documentation. Unlike traditional SEO which targets human search behavior, GEO targets the information retrieval patterns of AI systems like ChatGPT, Perplexity, and Claude.",
  },
  {
    term: "IndexNow",
    id: "indexnow",
    definition:
      "An open protocol that allows websites to notify search engines (Bing, Yandex, Seznam, Naver, and others) about new or updated content in real time. Instead of waiting for search engine crawlers to discover changes, IndexNow pushes URLs directly to participating engines. VC Deal Flow Signal uses IndexNow to ensure new sector rankings and blog posts are indexed within hours of publication.",
  },
];

export default function GlossaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        name: "VC Deal Flow Signal Glossary",
        description:
          "Definitions of key terms used in startup deal flow signal analysis.",
        hasDefinedTerm: terms.map((t) => ({
          "@type": "DefinedTerm",
          name: `What is ${t.term}?`,
          description: t.definition,
          url: `https://signals.gitdealflow.com/glossary#${t.id}`,
          inDefinedTermSet: "https://signals.gitdealflow.com/glossary",
        })),
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
            name: "Glossary",
            item: "https://signals.gitdealflow.com/glossary",
          },
        ],
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/glossary" qaCategory="general" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Glossary</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Glossary of Deal Flow Signal Terms
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Key terms used in startup engineering signal analysis. Each
          definition is self-contained — useful for investors evaluating
          GitHub-based deal flow data for the first time.
        </p>

        {/* Quick navigation */}
        <div className="mb-10 flex flex-wrap gap-2">
          {terms.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              {t.term}
            </a>
          ))}
        </div>

        {/* Definitions */}
        <div className="space-y-6">
          {terms.map((t) => (
            <div
              key={t.id}
              id={t.id}
              className="rounded-lg border border-slate-800 bg-slate-900 p-6 scroll-mt-20"
            >
              <h2 className="text-gray-100 font-semibold text-lg mb-3">
                What is {t.term}?
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t.definition}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            See these signals in action
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Browse startup rankings across 20 sectors, or read our
            methodology for the full technical breakdown.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Browse Sectors
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              Read Methodology
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
