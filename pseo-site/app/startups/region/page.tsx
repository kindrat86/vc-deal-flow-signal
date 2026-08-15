import type { Metadata } from "next";
import Link from "next/link";
import { getAllDirectoryRegions } from "@/lib/directory";
import { FRESH_YEAR_STR } from "@/lib/freshness-year";

export const metadata: Metadata = {
  title: `Startup Directory by Geography (${FRESH_YEAR_STR})`,
  description:
    "Browse every tracked startup by region. Paginated directories of GitHub engineering-acceleration signals for the US, Europe, APAC, UK, and Latin America.",
  alternates: { canonical: "/startups/region" },
  openGraph: {
    title: "Startup Directory by Geography",
    description: "Browse every tracked startup by region.",
    type: "website",
    url: "/startups/region",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Directory by Geography",
    description: "Browse every tracked startup by region.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/startups/region";

export default function RegionDirectoryIndexPage() {
  const regions = getAllDirectoryRegions();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Startup Directory by Geography",
        description: "Index of region directories for tracked startups.",
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        name: "Region directories",
        itemListOrder: "Unordered",
        numberOfItems: regions.length,
        itemListElement: regions.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: r.geoName,
          url: `${PAGE_URL}/${r.geoSlug}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/startups" className="hover:text-gray-300 transition-colors">
            Startup Directory
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">By Geography</span>
        </nav>

        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Startup Directory by Geography
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Browse tracked startups by region. Each region opens a paginated
            directory covering every tracked company in that geography, each
            linking to its live signal profile.
          </p>
        </header>

        <section aria-label="Browse by geography">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {regions.map((r) => (
              <Link
                key={r.geoSlug}
                href={`/startups/region/${r.geoSlug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h2 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {r.geoName}
                </h2>
                <p className="text-gray-400 text-xs">
                  {r.startupCount} startup{r.startupCount === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
