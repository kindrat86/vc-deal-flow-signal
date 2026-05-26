import type { Metadata } from "next";
import Link from "next/link";
import { funds } from "@/content/funds";
import { HreflangLinks } from "@/components/HreflangLinks";

export const metadata: Metadata = {
  title: "Venture Funds — Deal Flow Context & Engineering Signal Maps",
  description:
    "Independent profiles of well-known venture funds. Published thesis, stage focus, and how GitHub engineering-acceleration signals map to their sourcing. Built for emerging managers and operators.",
  alternates: { canonical: "/fund" },
  openGraph: {
    title: "Venture Funds — Deal Flow Context & Engineering Signal Maps",
    description:
      "Independent profiles of well-known venture funds with engineering-signal mapping.",
    type: "website",
    url: "/fund",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venture Funds — Deal Flow Context & Engineering Signal Maps",
    description:
      "Independent profiles of well-known venture funds with engineering-signal mapping.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/fund";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      url: PAGE_URL,
      name: "Venture Fund Profiles",
      description:
        "Independent profiles of well-known venture funds — published thesis, stage focus, and engineering-signal sourcing map.",
      isPartOf: {
        "@type": "WebSite",
        name: "VC Deal Flow Signal",
        url: "https://signals.gitdealflow.com",
      },
    },
    {
      "@type": "ItemList",
      itemListOrder: "Unordered",
      numberOfItems: funds.length,
      itemListElement: funds.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${PAGE_URL}/${f.slug}`,
        name: f.name,
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
          name: "Funds",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function FundHubPage() {
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
          <span className="text-gray-400">Funds</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Venture Fund Profiles
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          Independent profiles of {funds.length} well-known venture funds — published thesis, stage focus, engineering-signal sourcing map.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each page summarizes one fund's publicly stated thesis and maps it against the engineering-acceleration signal panel we publish at VC Deal Flow Signal. Useful for emerging managers studying peer thesis surfaces, operators researching co-investors, or LPs benchmarking sourcing approaches. All data is derived from each fund's own public website and partner-authored materials.
        </p>

        <section className="mb-12" aria-label="Funds">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {funds.map((f) => (
              <Link
                key={f.slug}
                href={`/fund/${f.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {f.name}
                </h3>
                <p className="text-gray-400 text-xs mb-1">{f.hq}</p>
                <p className="text-gray-400 text-xs">{f.stageFocus}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Build your own engineering-signal watchlist
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            See which startups in your sector are accelerating on GitHub before their next round. Free weekly report.
          </p>
          <Link
            href="https://gitdealflow.com/firstlook?ref=fund-hub"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
          >
            Get the Report
          </Link>
        </div>
      </div>
    </>
  );
}
