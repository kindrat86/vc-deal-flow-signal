import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllDirectorySectors,
  getAllDirectoryRegions,
} from "@/lib/directory";
import { FRESH_YEAR_STR } from "@/lib/freshness-year";

export const metadata: Metadata = {
  title: `Startup Directory (${FRESH_YEAR_STR})`,
  description:
    "Browse every tracked startup by sector and geography. Paginated directory of GitHub engineering-acceleration signals, every company links to its live signal profile. Free, no signup.",
  alternates: { canonical: "/startups" },
  openGraph: {
    title: "Startup Directory",
    description:
      "Browse every tracked startup by sector and geography, ranked by GitHub engineering acceleration.",
    type: "website",
    url: "/startups",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Directory",
    description: "Every tracked startup, browse by sector and geography.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/startups";

export default function StartupDirectoryIndexPage() {
  const sectors = getAllDirectorySectors();
  const regions = getAllDirectoryRegions();
  const totalStartups = sectors.reduce((n, s) => n + s.startupCount, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Startup Directory",
        description:
          "Index of every tracked startup, browseable by sector and geography.",
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        name: "Sector directories",
        itemListOrder: "Unordered",
        numberOfItems: sectors.length,
        itemListElement: sectors.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          url: `${PAGE_URL}/${s.slug}`,
        })),
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
          url: `${PAGE_URL}/region/${r.geoSlug}`,
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
          <span className="text-gray-400">Startup Directory</span>
        </nav>

        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Startup Directory
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Every tracked startup across {sectors.length} sectors, browseable by
            sector and geography. Each sector and region opens a paginated
            directory so the full corpus is reachable without a search box.
          </p>
          <p className="text-gray-500 text-sm mt-3">
            {totalStartups} startup entries link out to their live signal
            profiles. Data refreshes weekly from public GitHub activity.
          </p>
        </header>

        <section className="mb-12" aria-label="Browse by sector">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Browse by sector
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sectors.map((s) => (
              <Link
                key={s.slug}
                href={`/startups/${s.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {s.name}
                </h3>
                <p className="text-gray-400 text-xs">
                  {s.startupCount} startup{s.startupCount === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section aria-label="Browse by geography">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Browse by geography
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {regions.map((r) => (
              <Link
                key={r.geoSlug}
                href={`/startups/region/${r.geoSlug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {r.geoName}
                </h3>
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
