import type { Metadata } from "next";
import Link from "next/link";
import { CITIES, CITIES_BY_REGION, REGION_LABELS, type CityRegion } from "@/content/cities";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Cities — Engineering & VC Signals",
  description:
    "Editorial city pages mapping engineering acceleration to local VC ecosystems across 41 hubs in Europe, North America, Asia-Pacific, Latin America, and MEA. Built for Corp Dev, PE operating partners, and emerging managers.",
  alternates: { canonical: "/city" },
  openGraph: {
    title: "Cities",
    description:
      "Editorial city pages for 41 venture hubs — engineering signals through a local lens.",
    type: "website",
    url: "/city",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cities",
    description:
      "41 venture hubs mapped to engineering acceleration signals through a local lens.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/city";

const REGION_ORDER: CityRegion[] = ["EU", "NA", "APAC", "LATAM", "MEA"];

export default function CityHubIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Cities — Engineering & VC Signals",
        description:
          "Index of 41 venture hub cities with editorial interpretation of engineering acceleration signals through a local lens.",
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListOrder: "Unordered",
        numberOfItems: CITIES.length,
        itemListElement: CITIES.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${PAGE_URL}/${c.slug}`,
          name: `${c.name}, ${c.country}`,
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
            name: "Cities",
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Cities</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Cities — Engineering & VC Signals
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {CITIES.length} venture hubs across {REGION_ORDER.length} regions, with editorial
          interpretation of how engineering acceleration reads through a local lens.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each city page is an interpretive surface — notable engineering orgs, active VC
          anchors, the local commit-cadence pattern, and where the engineering-acceleration
          signal carries the highest fidelity. The live data panel resolves to continents
          (US, EU, APAC, LATAM, Canada); these pages are the lens for reading it locally.
        </p>

        {REGION_ORDER.map((region) => (
          <section key={region} className="mb-10" id={region.toLowerCase()}>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              {REGION_LABELS[region]}{" "}
              <span className="text-gray-500 text-sm font-normal">
                ({CITIES_BY_REGION[region].length} cities)
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CITIES_BY_REGION[region].map((c) => (
                <Link
                  key={c.slug}
                  href={`/city/${c.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-400 transition-colors mb-1">
                    {c.name}
                  </h3>
                  <p className="text-gray-400 text-xs mb-2">{c.country}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {c.notableSectors.slice(0, 3).join(" · ")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <SeoCta className="mt-8" />
      </div>
    </>
  );
}
