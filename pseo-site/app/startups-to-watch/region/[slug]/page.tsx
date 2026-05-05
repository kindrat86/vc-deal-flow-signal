import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllRegionPageSlugs,
  parseRegionPageSlug,
  getDataLastModified,
} from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import CTABanner from "@/components/CTABanner";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllRegionPageSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseRegionPageSlug(slug);
  if (!parsed) return {};

  const { geoName, period } = parsed;
  const title = `${geoName} Startups to Watch — ${period.name} Engineering Signals`;
  const description = `All tracked startups in ${geoName} ranked by GitHub engineering acceleration across every sector. ${parsed.startups.length} startups, ${parsed.sectorBreakdown.length} sectors, updated weekly.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `/startups-to-watch/region/${slug}`,
    },
  };
}

export default async function RegionPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseRegionPageSlug(slug);
  if (!parsed) notFound();

  const { geoSlug, geoName, period, startups, sectorBreakdown } = parsed;
  const lastModified = getDataLastModified();
  const top = startups[0];
  const avgVelocity = Math.round(
    startups.reduce((s, x) => s + x.commitVelocity14d, 0) / startups.length
  );
  const signalCounts: Record<string, number> = {};
  for (const s of startups)
    signalCounts[s.signalType] = (signalCounts[s.signalType] || 0) + 1;
  const topSignal = Object.entries(signalCounts).sort(([, a], [, b]) => b - a)[0];

  const faqs = [
    {
      question: `How many startups are tracked in ${geoName} in ${period.name}?`,
      answer: `${startups.length} ${geoName}-based startups are tracked across ${sectorBreakdown.length} sectors in ${period.name}. ${top.name} (${top.sectorName}) leads with ${top.commitVelocity14d} commits over a rolling 14-day window (${top.commitVelocityChange} change). Average 14-day commit velocity across the region is ${avgVelocity} commits.`,
    },
    {
      question: `Which sectors have the most startup activity in ${geoName}?`,
      answer: `In ${period.name}, the top sectors by active startup count in ${geoName} are ${sectorBreakdown.slice(0, 5).map((s) => `${s.name} (${s.count})`).join(", ")}. The dominant engineering signal pattern across the region is "${topSignal[0]}".`,
    },
    {
      question: `How is startup geography determined?`,
      answer: `Geography is derived from each startup's GitHub organization profile location field, supplemented by a curated enrichment database of known startup headquarters. Regions use broad classifications (${geoName}, etc.) rather than city-level granularity to provide meaningful sample sizes.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${geoName} Startups to Watch — ${period.name}`,
        description: `All tracked startups in ${geoName} ranked by engineering acceleration.`,
        author: { "@type": "Organization", name: "VC Deal Flow Signal", url: "https://gitdealflow.com" },
        publisher: { "@type": "Organization", name: "VC Deal Flow Signal", url: "https://gitdealflow.com" },
        datePublished: lastModified.toISOString().slice(0, 10),
        dateModified: lastModified.toISOString().slice(0, 10),
        spatialCoverage: { "@type": "Place", name: geoName },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[aria-label='Regional summary']"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: `${geoName} — ${period.name}`, item: `https://signals.gitdealflow.com/startups-to-watch/region/${slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      {
        "@type": "ItemList",
        name: `${geoName} startups by engineering acceleration`,
        numberOfItems: startups.length,
        itemListElement: startups.slice(0, 20).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          url: `https://signals.gitdealflow.com/startups-to-watch/${s.sectorSlug}-${period.slug}`,
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
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{geoName} — {period.name}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {period.name} · {geoName}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {geoName} Startups to Watch — {period.name} Engineering Signals
          </h1>
          <p
            className="text-gray-400 text-base leading-relaxed"
            aria-label="Regional summary"
          >
            {startups.length} {geoName}-based startups across{" "}
            {sectorBreakdown.length} sectors, ranked by GitHub engineering
            acceleration. {top.name} ({top.sectorName}) leads with{" "}
            {top.commitVelocity14d} commits over 14 days ({top.commitVelocityChange}{" "}
            change). Dominant regional signal pattern: {topSignal[0]}.
          </p>
        </header>

        <section className="mb-10" aria-label="Sector breakdown">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Sector activity in {geoName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {sectorBreakdown.map((s) => (
              <Link
                key={s.slug}
                href={`/startups-to-watch/${s.slug}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-3 hover:border-slate-600 transition-colors"
              >
                <p className="text-gray-200 text-sm font-medium">{s.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {s.count} startup{s.count === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="Startup rankings">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Ranked startups — {geoName}, {period.name}
          </h2>
          <StartupTable startups={startups} />
          <p className="mt-3 text-gray-600 text-xs">
            Sorted by commit velocity change (14-day window). Geography from
            GitHub org profiles. Last updated {period.name}.
          </p>
        </section>

        <section className="mb-12" aria-label="Call to action">
          <CTABanner />
        </section>

        <section className="mb-12 max-w-3xl" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div
                key={f.question}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="text-gray-100 font-medium mb-2">{f.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
