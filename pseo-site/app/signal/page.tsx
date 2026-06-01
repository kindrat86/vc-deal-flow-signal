import type { Metadata } from "next";
import Link from "next/link";
import { companies } from "@/content/companies";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Company GitHub Signals — VC Deal Flow Signal",
  description:
    "Per-company GitHub engineering signal reports. Commit velocity, contributor influx, repo creation pulse, and language bias across well-known public tech companies. Built for investors and operators.",
  alternates: { canonical: "/signal" },
  openGraph: {
    title: "Company GitHub Signals — VC Deal Flow Signal",
    description:
      "Per-company GitHub engineering signal reports for investors and operators.",
    type: "website",
    url: "/signal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Company GitHub Signals — VC Deal Flow Signal",
    description:
      "Per-company GitHub engineering signal reports for investors and operators.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/signal";

const sectors = Array.from(new Set(companies.map((c) => c.sector))).sort();

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      url: PAGE_URL,
      name: "Company GitHub Signals",
      description:
        "Index of per-company GitHub engineering signal pages — commit velocity, contributor influx, and repo activity for well-known public technical companies.",
      isPartOf: {
        "@type": "WebSite",
        name: "VC Deal Flow Signal",
        url: "https://signals.gitdealflow.com",
      },
    },
    {
      "@type": "ItemList",
      itemListOrder: "Unordered",
      numberOfItems: companies.length,
      itemListElement: companies.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${PAGE_URL}/${c.slug}`,
        name: c.name,
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
          name: "Company Signals",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function SignalHubPage() {
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
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Company Signals</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Company GitHub Signals
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          A quantitative view of engineering activity across {companies.length} well-known public technical companies.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each page summarizes publicly observable GitHub engineering signals — commit velocity, contributor influx, repo creation pulse — for one company. Built for investors benchmarking sector momentum and operators studying engineering trajectories. Updated weekly from public GitHub events.
        </p>

        {sectors.map((sector) => {
          const inSector = companies.filter((c) => c.sector === sector);
          if (inSector.length === 0) return null;
          return (
            <section key={sector} className="mb-10" aria-label={`${sector} companies`}>
              <h2 className="text-lg font-semibold text-gray-100 mb-4 capitalize">
                {sector.replace(/-/g, " ")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inSector.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/signal/${c.slug}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                  >
                    <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                      {c.name}
                    </h3>
                    <p className="text-gray-400 text-xs font-mono mb-1">
                      github.com/{c.githubOrg}
                    </p>
                    <p className="text-gray-400 text-xs">{c.publicSignal.languageBias} &middot; {c.stage}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <SeoCta className="mt-12" signoffIndex={2} />
      </div>
    </>
  );
}
