import type { Metadata } from "next";
import Link from "next/link";
import { founders } from "@/content/founders";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Founders & Public Engineering Profiles",
  description:
    "Public engineering profiles of well-known founders, OSS maintainers, and technical executives — restricted to people who self-publish their GitHub handle on their own surface.",
  alternates: { canonical: "/founder" },
  openGraph: {
    title: "Founders & Public Engineering Profiles",
    description:
      "Public engineering profiles restricted to self-published, public-figure-threshold identities.",
    type: "website",
    url: "/founder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Founders & Public Engineering Profiles",
    description:
      "Public engineering profiles restricted to self-published, public-figure-threshold identities.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/founder";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      url: PAGE_URL,
      name: "Founder & Public Engineering Profiles",
      description:
        "Index of public-figure-threshold engineering profiles — founders, OSS maintainers, and technical executives who self-publish their GitHub handle on their own surface.",
      isPartOf: {
        "@type": "WebSite",
        name: "VC Deal Flow Signal",
        url: "https://signals.gitdealflow.com",
      },
    },
    {
      "@type": "ItemList",
      itemListOrder: "Unordered",
      numberOfItems: founders.length,
      itemListElement: founders.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${PAGE_URL}/${p.handle}`,
        name: p.name,
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
          name: "Founders",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function FounderHubPage() {
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
          <span className="text-gray-400">Founders</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Founder &amp; Public Engineering Profiles
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {founders.length} self-published public-figure engineering identities — founders, OSS maintainers, technical executives.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Strict inclusion criteria: every profile on this index covers a public figure who self-publishes their GitHub handle on their own company website or primary social profile. No inferred-from-LinkedIn data. No private contact details. Every page carries an opt-out path at{" "}
          <Link href="/founder/opt-out" className="text-sky-400 hover:text-sky-300">
            /founder/opt-out
          </Link>
          .
        </p>

        <div className="mb-10 rounded-lg border border-amber-700/30 bg-amber-950/10 p-4 text-sm leading-relaxed text-gray-300">
          Looking for the person behind{" "}
          <strong className="text-gray-100">The Data Nerd</strong>? That story — the
          origin, the parables, the audio — lives at{" "}
          <Link
            href="/about/founder"
            className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
          >
            /about/founder
          </Link>
          . This page is something else: the public engineering profiles we track,
          read for you in plain English.
        </div>

        <section className="mb-12" aria-label="Profiles">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {founders.map((p) => (
              <Link
                key={p.handle}
                href={`/founder/${p.handle}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {p.name}
                </h3>
                <p className="text-gray-400 text-xs font-mono mb-1">@{p.handle}</p>
                <p className="text-gray-400 text-xs">
                  {p.role} at {p.affiliation}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <SeoCta
          heading="Track engineering acceleration weekly — without reading a line of code"
          blurb="Five breakout startups every Sunday, ranked by the engineering signal and translated into plain English — 21 to 47 days before the deck circulates. Free, no card."
          secondary={{ label: "Or test one sector — First Look €7 →", href: "/firstlook?ref=founder-hub" }}
        />
      </div>
    </>
  );
}
