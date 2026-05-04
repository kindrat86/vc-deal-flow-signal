import type { Metadata } from "next";
import Link from "next/link";
import { comparisons } from "@/content/comparisons";
import PSEOFooterNav from "@/components/PSEOFooterNav";

export const metadata: Metadata = {
  title: "Compare Deal Flow Tools — VC Deal Flow Signal",
  description:
    "Compare the best deal flow tools for investors: GitHub engineering signals, AI-powered sourcing, and startup databases. Find the right tool for your investment stage and strategy.",
  alternates: {
    canonical: "/compare",
  },
};

export default function CompareIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://signals.gitdealflow.com/compare#page",
        name: "Compare Deal Flow Tools",
        description:
          "Side-by-side comparisons of deal flow and startup sourcing tools for investors.",
        url: "https://signals.gitdealflow.com/compare",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
        hasPart: comparisons.map((comp) => ({
          "@type": "WebPage",
          name: comp.h1,
          url: `https://signals.gitdealflow.com/compare/${comp.slug}`,
          description: comp.description,
        })),
      },
      {
        "@type": "ItemList",
        name: "Deal flow tool comparisons",
        numberOfItems: comparisons.length,
        itemListElement: comparisons.map((comp, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: comp.h1,
          url: `https://signals.gitdealflow.com/compare/${comp.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What's the difference between VC Deal Flow Signal and traditional databases like Crunchbase or PitchBook?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Crunchbase and PitchBook are lagging indicators — they show what's already known: announced rounds, hires, headlines. VC Deal Flow Signal is a leading indicator that watches public GitHub activity (commit velocity, contributor growth, repository expansion) and flags acceleration patterns 3–6 weeks before fundraise announcements typically appear in those databases. The two are complementary: use VC Deal Flow Signal to spot momentum early, then use Crunchbase/PitchBook to enrich the company profile.",
            },
          },
          {
            "@type": "Question",
            name: "How do I choose between Harmonic, SignalFire, and VC Deal Flow Signal?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Harmonic and SignalFire are full-stack proprietary platforms with broad data coverage (founders, funding, products, social) and enterprise-tier pricing — they fit GP-led firms with platform budgets. VC Deal Flow Signal is the focused, free-tier alternative for GitHub engineering signals specifically: a single high-signal data source, machine-readable APIs, MCP server, and a free Chrome extension. If you already have a deal-flow platform and want a code-side signal layer on top, VC Deal Flow Signal slots in via API or Chrome.",
            },
          },
          {
            "@type": "Question",
            name: "Is the comparison data on these pages accurate and unbiased?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Comparisons are written by the VC Deal Flow Signal team, so naturally we know our own product best. We aim for factual accuracy — pricing, feature matrices, integrations are sourced from public marketing pages and product docs at the time of writing. If you spot an inaccuracy, email signal@gitdealflow.com and we'll correct it. Pricing and feature sets change; comparison pages list a refresh date in the footer.",
            },
          },
          {
            "@type": "Question",
            name: "Can I use VC Deal Flow Signal alongside another deal-flow tool?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes — VC Deal Flow Signal is designed as a complementary layer. The free MCP server, JSON API, CSV export, OpenAPI spec, and RSS feed make it trivial to integrate signal data into existing workflows: enrich Affinity/Attio CRM records with momentum tier, trigger Slack alerts on acceleration spikes, pre-screen warm intros against signal data, or power custom dashboards. No proprietary lock-in.",
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
            name: "Compare",
            item: "https://signals.gitdealflow.com/compare",
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
        <span className="text-gray-400">Compare</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
        Compare Deal Flow Tools
      </h1>
      <p className="text-gray-400 text-base leading-relaxed mb-10">
        Side-by-side comparisons of deal flow and startup sourcing tools for
        investors. Which tools give you the earliest signal? Which fit your
        stage and budget?
      </p>

      <div className="space-y-6">
        {comparisons.map((comp) => (
          <Link
            key={comp.slug}
            href={`/compare/${comp.slug}`}
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
          >
            <h2 className="text-gray-100 font-semibold text-lg mb-2 group-hover:text-sky-400 transition-colors">
              {comp.h1}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {comp.description}
            </p>
            <span className="mt-3 inline-block text-sky-500 text-xs font-medium group-hover:text-sky-400 transition-colors">
              Read comparison &rarr;
            </span>
          </Link>
        ))}
      </div>

      <PSEOFooterNav excludeHrefs={["/compare"]} />
    </div>
    </>
  );
}
