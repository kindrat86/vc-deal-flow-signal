import type { Metadata } from "next";
import Link from "next/link";
import { alternatives } from "@/content/alternatives";

export const metadata: Metadata = {
  title: "Best VC Deal Flow Tools 2026 — Alternatives Compared (PitchBook, CB Insights, Harmonic, Affinity, Specter & more)",
  description:
    "Best VC deal flow tools for 2026 compared head-to-head: PitchBook, CB Insights, Harmonic.ai, Affinity, Specter, Crunchbase, Dealroom, Forager.ai, Tracxn. Leading-signal alternatives that surface engineering acceleration 21-47 days before the fundraise announcement.",
  alternates: {
    canonical: "/alternatives",
  },
};

export default function AlternativesIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Best VC Deal Flow Tools 2026 — Alternatives Compared",
        description:
          "Side-by-side comparisons of the most-used VC deal flow tools (PitchBook, CB Insights, Harmonic.ai, Affinity, Specter, Crunchbase, Dealroom, Forager.ai, Tracxn) against VC Deal Flow Signal's GitHub-engineering leading-indicator approach. Updated for 2026.",
        url: "https://signals.gitdealflow.com/alternatives",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListElement: alternatives.map((alt, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://signals.gitdealflow.com/alternatives/${alt.slug}`,
          name: alt.h1,
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
            name: "Alternatives",
            item: "https://signals.gitdealflow.com/alternatives",
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
          <span className="text-gray-400">Alternatives</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Best VC Deal Flow Tools 2026 — Alternatives Compared
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-6">
          Side-by-side comparisons of the most-used deal flow tools investors evaluate in 2026.
          Each page covers signal philosophy, lead time, coverage, pricing, and when each tool
          is the better fit, against VC Deal Flow Signal&rsquo;s GitHub-engineering leading-indicator
          approach (which precedes fundraise announcements by 21 to 47 days across 219 confirmed rounds).
        </p>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 mb-10 text-sm text-gray-300">
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
            How the categories break down
          </p>
          <ul className="space-y-2 leading-relaxed">
            <li>
              <strong className="text-gray-100">Leading-signal sourcing engines</strong> &mdash; Harmonic.ai (team patterns),
              Forager.ai (web/social), Specter (web/hiring/product), and VC Deal Flow Signal (GitHub engineering acceleration).
              These surface candidates before the round.
            </li>
            <li>
              <strong className="text-gray-100">Curated reference databases</strong> &mdash; PitchBook, CB Insights, Crunchbase,
              Dealroom, Tracxn. Comprehensive funding context after the round closes; lagging by definition.
            </li>
            <li>
              <strong className="text-gray-100">Relationship-CRM workflow</strong> &mdash; Affinity. Manages the deals already
              on your team&rsquo;s radar; not a discovery tool.
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          {alternatives.map((alt) => (
            <Link
              key={alt.slug}
              href={`/alternatives/${alt.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-2">
                vs {alt.competitor}
              </p>
              <h2 className="text-gray-100 font-semibold text-lg mb-2 group-hover:text-sky-400 transition-colors">
                {alt.h1}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {alt.tagline}
              </p>
              <span className="mt-3 inline-block text-sky-500 text-xs font-medium group-hover:text-sky-400 transition-colors">
                Read comparison &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
