import type { Metadata } from "next";
import Link from "next/link";
import { ACQUIRERS } from "@/content/acquirers";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Acquirers, Public M&A Patterns",
  description:
    "Independent M&A pattern pages for 20 well-known public-company tech acquirers, Microsoft, Google, Salesforce, Adobe, Apple, Amazon/AWS, Cisco, IBM, Oracle, Nvidia, Atlassian, ServiceNow, Stripe, Cloudflare, Shopify, Snowflake, Databricks, GitHub, HubSpot, Intel. For Corp Dev, PE operating partners, and competitive analysts.",
  alternates: { canonical: "/acquirer" },
  openGraph: {
    title: "Acquirers",
    description:
      "Public-company M&A pattern pages for 20 well-known tech acquirers.",
    type: "website",
    url: "/acquirer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acquirers",
    description:
      "Independent M&A pattern pages for 20 public-company tech acquirers.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/acquirer";

export default function AcquirerHubPage() {
  const totalDeals = ACQUIRERS.reduce(
    (sum, a) => sum + a.notableAcquisitions.length,
    0,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Acquirers, Public M&A Patterns",
        description:
          "Index of independent M&A pattern pages for 20 well-known public-company tech acquirers, with focus-sector mapping against the engineering-signal panel.",
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListOrder: "Unordered",
        numberOfItems: ACQUIRERS.length,
        itemListElement: ACQUIRERS.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${PAGE_URL}/${a.slug}`,
          name: a.name,
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
            name: "Acquirers",
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
          <span className="text-gray-400">Acquirers</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Acquirers
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {ACQUIRERS.length} well-known public-company tech acquirers, {totalDeals}{" "}
          documented public acquisitions. Built for Corp Dev, PE operating partners, and
          competitive analysts.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each leaf maps an acquirer's M&A focus to the engineering-signal panel we
          publish. Every deal listed was announced via press release, SEC filing, or both.
          We do not publish private deals, rumored acquisitions, or speculation about
          future targets, only documented public history and stated focus.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACQUIRERS.map((a) => (
            <Link
              key={a.slug}
              href={`/acquirer/${a.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <h2 className="text-gray-100 font-semibold text-base group-hover:text-sky-400 transition-colors mb-1">
                {a.name}
              </h2>
              <p className="text-gray-500 text-xs mb-3">{a.hq}</p>
              <div className="flex gap-3 text-xs text-gray-500">
                <span>
                  <span className="text-sky-400 font-medium">
                    {a.notableAcquisitions.length}
                  </span>{" "}
                  deals
                </span>
                <span>
                  <span className="text-sky-400 font-medium">
                    {a.focusSectors.length}
                  </span>{" "}
                  sectors
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
