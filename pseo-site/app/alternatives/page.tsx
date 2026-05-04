import type { Metadata } from "next";
import Link from "next/link";
import { alternatives } from "@/content/alternatives";

export const metadata: Metadata = {
  title: "Deal Flow Tool Alternatives — Harmonic, PitchBook, CB Insights, Affinity & 5 more",
  description:
    "Compare VC Deal Flow Signal head-to-head against Harmonic.ai, PitchBook, CB Insights, Affinity, Crunchbase, Dealroom, Forager.ai, Tracxn, and Specter. Engineering-signal alternatives for early VC deal flow — 6-12 weeks before fundraise announcements.",
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
        name: "Deal Flow Tool Alternatives",
        description:
          "Head-to-head alternatives comparing VC Deal Flow Signal to Harmonic.ai, Dealroom, Crunchbase, and Forager.ai.",
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
          VC Deal Flow Signal Alternatives
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Head-to-head alternatives to the most common deal flow tools investors
          already use. Each comparison covers signal philosophy, lead time,
          coverage, pricing, and when each tool is the better fit.
        </p>

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
