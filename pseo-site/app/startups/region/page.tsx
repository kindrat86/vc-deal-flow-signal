import type { Metadata } from "next";
import Link from "next/link";
import { getAllDirectoryRegions } from "@/lib/directory";
import { PANEL_CLAIM } from "@/lib/canonical-claims";
import DirectoryAbout from "@/components/DirectoryAbout";
import { FRESH_YEAR_STR } from "@/lib/freshness-year";

export const metadata: Metadata = {
  title: `Startup Directory by Geography (${FRESH_YEAR_STR})`,
  description:
    "Browse every tracked startup by region. Paginated directories of GitHub engineering-acceleration signals for the US, Europe, APAC, UK, Canada, and Latin America.",
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
  const totalStartups = regions.reduce((n, r) => n + r.startupCount, 0);

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

        <header className="mb-6 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">
            Startup Directory by Geography
          </h1>
        </header>

        <section className="mb-8 max-w-3xl" aria-label="About this directory">
          <p className="text-gray-400 text-base leading-relaxed">
            VC Deal Flow Signal tracks {PANEL_CLAIM} startups across{" "}
            {regions.length} regions in the current quarter, resolved from each
            company&apos;s GitHub organization location and a curated headquarters
            enrichment layer. Pick a region below to open a paginated directory
            of every tracked company in that geography, ranked by GitHub
            engineering acceleration, with each card linking to the company&apos;s
            live signal profile.
          </p>
        </section>

        <section className="mb-10" aria-label="Browse by geography">
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

        <section className="mb-8 max-w-3xl" aria-label="How geography is resolved">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            How geography is resolved
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Startup geography is derived from each company&apos;s public GitHub
            organization profile location field, supplemented by a curated
            headquarters enrichment database. Regions use broad classifications
            (United States, Europe, Asia-Pacific, and so on) rather than
            city-level granularity, so every region has a meaningful sample
            size. When a company does not publish a location, it is excluded
            from the regional directories rather than guessed.
          </p>
        </section>

        <section className="mb-10 max-w-3xl" aria-label="Data source and methodology">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Data source and methodology
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every ranking is computed from public GitHub activity and refreshes
            weekly. The primary signal is commit velocity change over a rolling
            14-day window, measured against each company&apos;s own baseline;
            contributor influx, repository creation pulse, and language bias
            drift are surfaced as supporting primitives. A sustained acceleration
            has historically preceded fundraise announcements by three to six
            weeks, and no single metric is a buy signal. The full methodology,
            the six-signal panel, and its empirical tie to fundraise probability
            are documented on the{" "}
            <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline">
              methodology page
            </Link>
            , with an SSRN preprint (6606558) and a CC BY 4.0 dataset available
            for independent verification.
          </p>
        </section>

        <DirectoryAbout />
      </div>
    </>
  );
}
