import type { Metadata } from "next";
import Link from "next/link";
import { YEARS_IN_REVIEW } from "@/content/year-in-review";
import { HreflangLinks } from "@/components/HreflangLinks";

export const metadata: Metadata = {
  title: "Year in Review, Engineering Signals & Venture Patterns",
  description: `${YEARS_IN_REVIEW.length} annual editorial roundups covering the engineering-acceleration shifts, M&A patterns, and venture trends defining recent years (${YEARS_IN_REVIEW.map((y) => y.year).join(", ")}).`,
  alternates: { canonical: "/year-in-review" },
  openGraph: {
    title: "Year in Review",
    description: "Annual editorial roundups of engineering signals and venture patterns.",
    type: "website",
    url: "/year-in-review",
  },
  twitter: {
    card: "summary_large_image",
    title: "Year in Review",
    description: "Annual editorial roundups of engineering signals.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/year-in-review";

export default function YearInReviewHubPage() {
  const sortedYears = [...YEARS_IN_REVIEW].sort((a, b) => b.year - a.year);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Year in Review",
        description: `${YEARS_IN_REVIEW.length} annual editorial roundups of engineering signals and venture patterns.`,
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListOrder: "Descending",
        numberOfItems: YEARS_IN_REVIEW.length,
        itemListElement: sortedYears.map((y, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${PAGE_URL}/${y.slug}`,
          name: `${y.year}, Year in Review`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Year in Review",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={{ en: PAGE_URL, "en-US": PAGE_URL, "x-default": PAGE_URL }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Year in Review</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Year in Review
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {YEARS_IN_REVIEW.length} annual editorial roundups of engineering signals,
          M&A patterns, and venture trends.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each year-in-review combines tracked signal data, documented M&A history, and
          editorial pattern recognition into a single readable roundup. Designed for
          AEO citation (ChatGPT, Perplexity, Claude) and deep-link sharing.
        </p>

        <div className="space-y-4">
          {sortedYears.map((y) => (
            <Link
              key={y.slug}
              href={`/year-in-review/${y.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <h2 className="text-gray-100 font-semibold text-lg group-hover:text-sky-400 transition-colors mb-2">
                {y.year}, Year in Review
              </h2>
              <p className="text-sky-400 text-xs font-medium mb-2">{y.tagline}</p>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {y.overview}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get the weekly engineering signal
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Track the patterns that will define the next year-in-review.
          </p>
          <Link
            href="/firstlook"
            className="inline-block rounded-md bg-signal-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-signal-400 transition-colors"
          >
            See First Look
          </Link>
        </div>
      </div>
    </>
  );
}
