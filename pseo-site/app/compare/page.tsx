import type { Metadata } from "next";
import Link from "next/link";
import { comparisons } from "@/content/comparisons";

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
        name: "Compare Deal Flow Tools",
        description:
          "Side-by-side comparisons of deal flow and startup sourcing tools for investors.",
        url: "https://signals.gitdealflow.com/compare",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
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
    </div>
    </>
  );
}
