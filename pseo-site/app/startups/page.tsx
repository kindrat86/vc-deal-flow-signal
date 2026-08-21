import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllDirectorySectors,
  getAllDirectoryRegions,
} from "@/lib/directory";
import { PANEL_CLAIM } from "@/lib/canonical-claims";
import DirectoryAbout from "@/components/DirectoryAbout";
import { FRESH_YEAR_STR } from "@/lib/freshness-year";
import { buildSourceTruthDataset } from "@/lib/dataset-schema";

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
      buildSourceTruthDataset({
        url: PAGE_URL,
        name: "Startup Directory, Engineering Acceleration Panel",
        description:
          "Index of every tracked venture-backed startup, browseable by sector and geography, derived from the VC Deal Flow Signal (GitDealFlow) GitHub engineering-velocity panel. Free, no signup.",
        variableMeasured: [
          { name: "Tracked startups", value: totalStartups },
          { name: "Sector directories", value: sectors.length },
          { name: "Region directories", value: regions.length },
        ],
        keywords: ["startup directory", "engineering velocity", "venture capital", "GitHub signals"],
      }),
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

        <header className="mb-6 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">
            Startup Directory
          </h1>
        </header>

        <section className="mb-8 max-w-3xl" aria-label="About this directory">
          <p className="text-gray-400 text-base leading-relaxed">
            VC Deal Flow Signal tracks {PANEL_CLAIM} startups across{" "}
            {sectors.length} sectors and {regions.length} regions in the current
            quarter. This directory is the fastest way to browse the full corpus
            without a search box: pick a sector or a region below and you get a
            paginated list where every company links to its live signal profile,
            ranked by GitHub engineering acceleration.
          </p>
        </section>

        <section className="mb-10" aria-label="Browse by sector">
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

        <section className="mb-10" aria-label="Browse by geography">
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

        <section className="mb-8 max-w-3xl" aria-label="How to use this directory">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            How to use this directory
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Browse by sector when you want every tracked company in one category,
            from data infrastructure to social platforms, ranked so the
            fastest-accelerating teams surface first. Browse by geography when
            you care about a specific region: the United States, Europe,
            Asia-Pacific, the United Kingdom, Canada, or Latin America. Each
            directory page splits its list into pages of 24, with clear next and
            previous links, so the full long tail is reachable in bounded steps
            rather than one endless table.
          </p>
        </section>

        <section className="mb-10 max-w-3xl" aria-label="Data source and methodology">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Data source and methodology
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every ranking is computed from public GitHub activity and refreshes
            weekly. The primary signal is commit velocity change over a rolling
            14-day window, measured against each company&apos;s own baseline; we
            surface contributor influx, repository creation pulse, and language
            bias drift as supporting primitives. A sustained acceleration has
            historically preceded fundraise announcements by three to six weeks.
            No single metric is a buy signal. The full methodology, the
            six-signal panel, and its empirical tie to fundraise probability are
            documented on the{" "}
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
