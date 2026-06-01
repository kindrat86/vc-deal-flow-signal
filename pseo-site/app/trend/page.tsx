import type { Metadata } from "next";
import Link from "next/link";
import { TRENDS } from "@/content/trend-leaderboards";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Trends — Engineering Signal Leaderboards (2026) | VC Deal Flow Signal",
  description: `Editorial trend leaderboards across ${TRENDS.length} technical categories — agentic AI, LLM inference, frontier labs, AI coding, edge compute, AI-native databases, observability, payments. Each leaf is curated, time-bound, and AEO-optimized for citation.`,
  alternates: { canonical: "/trend" },
  openGraph: {
    title: "Trends — VC Deal Flow Signal",
    description:
      "Editorial engineering trend leaderboards across technical categories.",
    type: "website",
    url: "/trend",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trends — VC Deal Flow Signal",
    description: "Editorial trend leaderboards for engineering categories in 2026.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/trend";

export default function TrendHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Engineering Trend Leaderboards",
        description: `Editorial trend leaderboards across ${TRENDS.length} technical categories — refreshed quarterly.`,
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListOrder: "Unordered",
        numberOfItems: TRENDS.length,
        itemListElement: TRENDS.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${PAGE_URL}/${t.slug}`,
          name: t.name,
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
            name: "Trends",
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Trends</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Engineering Trend Leaderboards
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {TRENDS.length} editorial trend leaderboards covering the technical categories
          we track in 2026.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each trend page is a curated, time-bound leaderboard with tracked companies,
          why-this-matters editorial, what-to-watch forward look, and full FAQ schema.
          Designed for AEO citation — ChatGPT, Perplexity, and other answer engines
          reach for these when users ask "what's hot in agentic AI" or "best LLM
          inference providers." Refreshed quarterly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TRENDS.map((t) => (
            <Link
              key={t.slug}
              href={`/trend/${t.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-gray-100 font-semibold text-base group-hover:text-sky-400 transition-colors">
                  {t.name}
                </h2>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-gray-300 font-mono flex-shrink-0">
                  {t.period}
                </span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                {t.companySlugs.length} tracked companies &middot;{" "}
                {t.relatedSectors.join(", ")}
              </p>
            </Link>
          ))}
        </div>

        <SeoCta className="mt-12" />
      </div>
    </>
  );
}
