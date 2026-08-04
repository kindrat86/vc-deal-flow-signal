import type { Metadata } from "next";
import Link from "next/link";
import {
  sectors,
  getCompaniesInSector,
  getFundsInSector,
  getFoundersInSector,
} from "@/content/sectors";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Sector Hubs — Engineering Signals & VC Deal Flow",
  description:
    "Curated sector hubs aggregating tracked companies, active venture funds, engineering leaders, and metrics across AI infra, AI/ML, developer tools, cloud infrastructure, databases, observability, analytics, fintech, and productivity.",
  alternates: { canonical: "/sector" },
  openGraph: {
    title: "Sector Hubs",
    description:
      "Curated sector hubs for Corp Dev, PE operating partners, and emerging managers — companies, funds, founders, and metrics per sector.",
    type: "website",
    url: "/sector",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sector Hubs",
    description:
      "Curated sector hubs for Corp Dev, PE operating partners, and emerging managers.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/sector";

export default function SectorHubIndexPage() {
  const sectorRows = sectors.map((s) => ({
    sector: s,
    companies: getCompaniesInSector(s.slug).length,
    funds: getFundsInSector(s.slug).length,
    founders: getFoundersInSector(s.slug).length,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Sector Hubs",
        description:
          "Index of curated sector hubs aggregating companies, funds, founders, and metrics across the technical venture surface.",
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListOrder: "Unordered",
        numberOfItems: sectors.length,
        itemListElement: sectors.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${PAGE_URL}/${s.slug}`,
          name: s.name,
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
            name: "Sector Hubs",
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
        languages={{
          en: PAGE_URL,
          "en-US": PAGE_URL,
          "x-default": PAGE_URL,
        }}
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
          <span className="text-gray-400">Sector Hubs</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Sector Hubs
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          Companies, funds, and engineering leaders mapped per sector — for Corp Dev, PE operating
          partners, and emerging managers.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each sector hub aggregates the four curated entity corpora VC Deal Flow Signal
          maintains: tracked companies with public GitHub orgs, venture funds whose published
          thesis covers the sector, notable engineering leaders, and the metrics we use to read
          momentum. These are seeded for Marcus 100 reach — they are not a Crunchbase-scale
          inventory.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sectorRows.map(({ sector, companies, funds, founders }) => (
            <Link
              key={sector.slug}
              href={`/sector/${sector.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <h2 className="text-gray-100 font-semibold text-base group-hover:text-sky-400 transition-colors mb-2">
                {sector.name}
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">{sector.tagline}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>
                  <span className="text-sky-400 font-medium">{companies}</span> companies
                </span>
                <span>
                  <span className="text-sky-400 font-medium">{funds}</span> funds
                </span>
                <span>
                  <span className="text-sky-400 font-medium">{founders}</span> founders
                </span>
              </div>
            </Link>
          ))}
        </div>

        <SeoCta className="mt-12" />
      </div>
    </>
  );
}
