import type { Metadata } from "next";
import Link from "next/link";
import { companies } from "@/content/companies";
import { getAllShowdownSlugs, splitPairSlug } from "@/content/showdowns";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Showdowns — Company Engineering Signal Comparisons | VC Deal Flow Signal",
  description:
    "Side-by-side engineering-signal comparisons between curated companies tracked in the VC Deal Flow Signal index. Same-sector pairs only — independent, no affiliation.",
  alternates: { canonical: "/showdown" },
  openGraph: {
    title: "Showdowns — VC Deal Flow Signal",
    description:
      "Independent side-by-side engineering-signal comparisons between curated tracked companies.",
    type: "website",
    url: "/showdown",
  },
  twitter: {
    card: "summary_large_image",
    title: "Showdowns — VC Deal Flow Signal",
    description:
      "Side-by-side engineering-signal comparisons between curated tracked companies.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/showdown";

export default function ShowdownHubPage() {
  const allSlugs = getAllShowdownSlugs();
  // group by the sector of the first company in each pair
  const bySector = new Map<string, { slug: string; aName: string; bName: string }[]>();
  for (const slug of allSlugs) {
    const parts = splitPairSlug(slug);
    if (!parts) continue;
    const [aSlug, bSlug] = parts;
    const a = companies.find((c) => c.slug === aSlug);
    const b = companies.find((c) => c.slug === bSlug);
    if (!a || !b) continue;
    const arr = bySector.get(a.sector) ?? [];
    arr.push({ slug, aName: a.name, bName: b.name });
    bySector.set(a.sector, arr);
  }

  const sectorEntries = Array.from(bySector.entries()).sort((x, y) =>
    x[0].localeCompare(y[0]),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Showdowns — Company Engineering Signal Comparisons",
        description:
          "Index of side-by-side engineering-signal comparisons between curated tracked companies. Same-sector pairs only.",
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListOrder: "Unordered",
        numberOfItems: allSlugs.length,
        itemListElement: allSlugs.map((slug, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${PAGE_URL}/${slug}`,
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
            name: "Showdowns",
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
          <span className="text-gray-400">Showdowns</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Showdowns
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {allSlugs.length} side-by-side engineering-signal comparisons across{" "}
          {sectorEntries.length} sectors.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each showdown compares two tracked companies in the same sector on stage,
          momentum, public repos, language bias, and contributor activity. Independent —
          no affiliation with either org. For one-company-deep views, see{" "}
          <Link href="/signal" className="text-sky-400 hover:text-sky-300 underline">
            /signal
          </Link>
          . For sector hubs, see{" "}
          <Link href="/sector" className="text-sky-400 hover:text-sky-300 underline">
            /sector
          </Link>
          .
        </p>

        {sectorEntries.map(([sector, pairs]) => (
          <section key={sector} className="mb-10" id={sector}>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              <Link
                href={`/sector/${sector}`}
                className="hover:text-sky-400 transition-colors"
              >
                {sector.replace("-", " ")}
              </Link>{" "}
              <span className="text-gray-500 text-sm font-normal">
                ({pairs.length} showdowns)
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pairs.map((p) => (
                <Link
                  key={p.slug}
                  href={`/showdown/${p.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors">
                    {p.aName} vs {p.bName}
                  </h3>
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
