import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllGeoPageSlugs,
  parseGeoPageSlug,
  getSortedStartups,
  getDataLastModified,
  getRelatedSectors,
} from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import CTABanner from "@/components/CTABanner";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGeoPageSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseGeoPageSlug(slug);
  if (!parsed) return {};

  const { geoName, sector, period } = parsed;
  const title = `${sector.name} Startups in ${geoName} to Watch, ${period.name}`;
  const description = `Ranked list of ${sector.name} startups in ${geoName} showing the highest GitHub engineering acceleration in ${period.name}. Commit velocity, contributor growth, and breakout signals for investors.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/startups-to-watch/geo/${slug}`,
    },
  };
}

export default async function GeoSectorPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseGeoPageSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { geoSlug, geoName, sector, period, startups } = parsed;
  const sortedStartups = getSortedStartups(startups);
  const relatedSectors = getRelatedSectors(sector, period.slug);
  const lastModified = getDataLastModified();
  const top = sortedStartups[0];
  const avgVelocity = Math.round(
    sortedStartups.reduce((s, x) => s + x.commitVelocity14d, 0) /
      sortedStartups.length
  );
  const signalCounts: Record<string, number> = {};
  for (const s of sortedStartups)
    signalCounts[s.signalType] = (signalCounts[s.signalType] || 0) + 1;
  const topSignal = Object.entries(signalCounts).sort(
    ([, a], [, b]) => b - a
  )[0];

  const geoFaqs = [
    {
      question: `Which ${sector.name.toLowerCase()} startups in ${geoName} are showing the strongest engineering signals in ${period.name}?`,
      answer: `In ${period.name}, ${top.name} leads ${sector.name.toLowerCase()} startups in ${geoName} with ${top.commitVelocity14d} commits over a 14-day window (${top.commitVelocityChange} change) and ${top.contributors} active contributors. Across all ${sortedStartups.length} tracked ${geoName}-based startups in this sector, the average 14-day commit velocity is ${avgVelocity} commits. The dominant signal pattern is "${topSignal[0]}", which typically indicates ${topSignal[0] === "Engineering hiring burst" ? "rapid team expansion ahead of a product launch or fundraise" : topSignal[0] === "Infrastructure buildout" ? "significant new infrastructure investment, often preceding a major product milestone" : topSignal[0] === "Deploy frequency spike" ? "accelerated shipping cadence, often seen before a public launch or major release" : "significant technical migration, which often precedes a pivot or platform upgrade"}.`,
    },
    {
      question: `How does the ${geoName} ${sector.name.toLowerCase()} startup ecosystem compare to other regions?`,
      answer: `${geoName} accounts for ${sortedStartups.length} of the ${sector.name.toLowerCase()} startups in our tracking dataset for ${period.name}. This geographic view filters the broader sector rankings to help investors focused on ${geoName}-based deal flow identify engineering acceleration patterns within their target geography. Regional concentrations often reflect local regulatory environments, talent pools, and investor networks that shape startup trajectories differently from global averages.`,
    },
    {
      question: `How is startup geography determined in these rankings?`,
      answer: `We derive startup geography primarily from the GitHub organization profile location field, supplemented by a manually curated enrichment database of known startup headquarters. This means startups without a public GitHub location may appear in our global sector rankings but not in geographic filters. The geographic classification uses broad regions (${geoName}, etc.) rather than city-level granularity to provide meaningful sample sizes for comparison.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${sector.name} Startups in ${geoName} to Watch, ${period.name}`,
        description: `${sector.name} startups in ${geoName} ranked by engineering acceleration.`,
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        datePublished: lastModified.toISOString().slice(0, 10),
        dateModified: lastModified.toISOString().slice(0, 10),
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
            name: `${sector.name} — ${period.name}`,
            item: `https://signals.gitdealflow.com/startups-to-watch/${sector.slug}-${period.slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: geoName,
            item: `https://signals.gitdealflow.com/startups-to-watch/geo/${slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: geoFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/startups-to-watch/${sector.slug}-${period.slug}`}
            className="hover:text-gray-300 transition-colors"
          >
            {sector.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{geoName}</span>
        </nav>

        {/* Header */}
        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {period.name} · {geoName}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {sector.name} Startups in {geoName} to Watch, {period.name}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            {sortedStartups.length} {sector.name.toLowerCase()} startups based
            in {geoName} ranked by GitHub engineering acceleration. Filtered
            from our broader{" "}
            <Link
              href={`/startups-to-watch/${sector.slug}-${period.slug}`}
              className="text-sky-500 hover:text-sky-400 transition-colors"
            >
              {sector.name} sector rankings
            </Link>
            .
          </p>
        </header>

        {/* Table */}
        <section className="mb-10" aria-label="Startup rankings">
          <StartupTable startups={sortedStartups} />
          <p className="mt-3 text-gray-600 text-xs">
            Sorted by commit velocity change (14-day window, descending). Data
            last updated {period.name}. Geography from GitHub org profiles.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-12" aria-label="Call to action">
          <CTABanner />
        </section>

        {/* FAQ section */}
        <section className="mb-12 max-w-3xl" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {geoFaqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="text-gray-100 font-medium mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related sectors */}
        {relatedSectors.length > 0 && (
          <section aria-label="Related sectors">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Related Sectors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedSectors.map((related) => (
                <Link
                  key={related.slug}
                  href={`/startups-to-watch/${related.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {related.name}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {related.startupCount} startups tracked &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
