import type { Metadata } from "next";
import Link from "next/link";
import { useCases } from "@/content/use-cases";

export const metadata: Metadata = {
  title: "Use Cases — Angels, VC Analysts, Fund of Funds",
  description:
    "How VC Deal Flow Signal is used by different investor personas — angel investors, VC analysts, fund of funds and LPs. Workflows, metrics, and persona-specific integrations.",
  alternates: {
    canonical: "/use-cases",
  },
};

export default function UseCasesIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "VC Deal Flow Signal Use Cases",
        description:
          "Persona-specific workflows for angel investors, VC analysts, and fund of funds / LPs.",
        url: "https://signals.gitdealflow.com/use-cases",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListElement: useCases.map((u, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://signals.gitdealflow.com/use-cases/${u.slug}`,
          name: u.h1,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Who is VC Deal Flow Signal designed for?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Three investor personas: (1) Angel investors and solo capitalists who want a defensible signal layer to compete with larger funds without an analyst team; (2) VC analysts at seed and Series A funds who use it as a sourcing pre-filter before warm intros and database scans; (3) Fund-of-funds and LPs who use it as a portfolio-monitoring proxy across managers' GitHub-active portfolio companies. Developer-investors (the dual-identity persona) sit across all three.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need engineering or quant skills to use this?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The dashboard and weekly digest deliver ranked output: company name, sector, stage, acceleration percentage, contributor count, signal type. The analysis is done before the report hits your inbox. If you can read a Crunchbase company page, you can read this. The MCP server, OpenAPI spec, and CSV export are there for users who want deeper integration into their own tools — but they're optional, not required.",
            },
          },
          {
            "@type": "Question",
            name: "Can I integrate signals into my CRM (Affinity, Attio, Salesforce)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The JSON API (signals.json), CSV export (signals.csv), OpenAPI 3.1 spec, and MCP server make CRM integration straightforward. Common patterns: nightly sync into Affinity custom fields, Attio webhook on signal-tier change, Zapier/Make.com flows that update Salesforce records on acceleration alerts. The Insider Circle tier (EUR 97/mo) includes API access for higher-rate-limit programmatic use.",
            },
          },
          {
            "@type": "Question",
            name: "How does the workflow look weekly?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Mondays: data refreshes 06:00 UTC; the Signal Digest email goes out with this week's top 5 breakouts. Tuesday–Thursday: investors triage the digest plus full Dashboard, mark companies of interest, queue cold outreach. Friday: optional weekly briefing for Insider Circle members covering the strongest acceleration patterns and which sectors to watch. The cycle is intentionally weekly to match how investors review deal flow — not minute-by-minute alert fatigue.",
            },
          },
          {
            "@type": "Question",
            name: "Is this useful for non-investors (founders, operators, recruiters)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, indirectly. Founders track competitor engineering velocity. Recruiters use the contributor-growth signal to identify hiring-burst companies. Operators at portfolio companies use it as a benchmark against peers. The free MCP server and Chrome extension make these adjacent use cases easy without a paid tier.",
            },
          },
        ],
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
            name: "Use Cases",
            item: "https://signals.gitdealflow.com/use-cases",
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Use Cases</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Use Cases
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Different investors use VC Deal Flow Signal differently. Pick the
          persona closest to your workflow for a detailed breakdown of the
          problem, the solution, and the weekly workflow.
        </p>

        <div className="space-y-6">
          {useCases.map((uc) => (
            <Link
              key={uc.slug}
              href={`/use-cases/${uc.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-2">
                For {uc.persona}s
              </p>
              <h2 className="text-gray-100 font-semibold text-lg mb-2 group-hover:text-sky-400 transition-colors">
                {uc.h1}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {uc.tagline}
              </p>
              <span className="mt-3 inline-block text-sky-500 text-xs font-medium group-hover:text-sky-400 transition-colors">
                Read workflow &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
