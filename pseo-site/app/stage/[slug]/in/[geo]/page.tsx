import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStageGeoData,
  getAllStageGeoPairs,
  getDataLastModified,
} from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import SeoCta from "@/components/SeoCta";
import FreshnessWatermark from "@/components/FreshnessWatermark";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

interface PageProps {
  params: Promise<{ slug: string; geo: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateStaticParams() {
  return getAllStageGeoPairs().map(({ stage, geo }) => ({
    slug: stage,
    geo,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, geo } = await params;
  const data = getStageGeoData(slug, geo);
  if (!data) return {};

  const title = `${data.stageName} Startups in ${data.geoName} — Engineering Signal (${data.period.name})`;
  const description = `${data.startups.length} ${data.geoName}-based startups at ${data.stageName.toLowerCase()} stage ranked by GitHub engineering acceleration in ${data.period.name}, across ${data.sectorBreakdown.length} sectors.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/stage/${slug}/in/${geo}`,
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/stage/${slug}/in/${geo}` },
  };
}

export default async function StageGeoPage({ params }: PageProps) {
  const { slug, geo } = await params;
  const data = getStageGeoData(slug, geo);

  if (!data) notFound();

  const {
    stageName,
    stageDescription,
    stageInvestorInsight,
    geoName,
    period,
    startups,
    sectorBreakdown,
  } = data;
  const lastModified = getDataLastModified();
  const top = startups[0];
  const avgVelocity = Math.round(
    startups.reduce((s, x) => s + x.commitVelocity14d, 0) / startups.length
  );
  const leadSector = sectorBreakdown[0];

  const faqs = [
    {
      question: `Which ${geoName}-based startups at ${stageName.toLowerCase()} stage show the strongest engineering signals in ${period.name}?`,
      answer: `${top.name} leads ${stageName.toLowerCase()}-stage ${geoName} startups in ${period.name} with ${top.commitVelocity14d} commits over a rolling 14-day window (${top.commitVelocityChange} change) and ${top.contributors} active contributors. Across all ${startups.length} ${stageName.toLowerCase()}-stage startups tracked in ${geoName}, the average 14-day commit velocity is ${avgVelocity} commits.`,
    },
    {
      question: `Which sectors are most active among ${stageName.toLowerCase()}-stage ${geoName} startups?`,
      answer: `${leadSector.name} leads with ${leadSector.count} ${leadSector.count === 1 ? "startup" : "startups"} at this stage in ${geoName}, out of ${sectorBreakdown.length} sectors represented: ${sectorBreakdown
        .slice(0, 6)
        .map((s) => `${s.name} (${s.count})`)
        .join(", ")}.`,
    },
    {
      question: `How is geography determined in these rankings?`,
      answer:
        "Geography is a coarse region classification (United States, Europe, Asia-Pacific, UK, Canada, Latin America, MENA) derived from public GitHub organization metadata, not a city or country-level HQ record. Startups whose region cannot be determined from public data are excluded from these pages entirely rather than guessed. Always verify location independently before any investment action.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${stageName} Startups in ${geoName} — Engineering Signal (${period.name})`,
        description: stageDescription,
        author: DATA_NERD_AUTHOR_REF,
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
            name: stageName,
            item: `https://signals.gitdealflow.com/stage/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: geoName,
            item: `https://signals.gitdealflow.com/stage/${slug}/in/${geo}`,
          },
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
        name: `${stageName} ${geoName} startups by engineering acceleration`,
        numberOfItems: startups.length,
        itemListElement: startups.slice(0, 20).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          url: `https://signals.gitdealflow.com/startup/${encodeURIComponent(
            s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          )}`,
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
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/stage/${slug}`}
            className="hover:text-gray-300 transition-colors"
          >
            {stageName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{geoName}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {period.name} · {stageName} · {geoName}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {stageName} Startups in {geoName} Showing Engineering Acceleration
          </h1>
          <p
            className="text-gray-400 text-base leading-relaxed"
            aria-label="Summary"
          >
            {startups.length} {geoName}-based startups at{" "}
            {stageName.toLowerCase()} stage ranked by GitHub engineering
            acceleration in {period.name}, spanning {sectorBreakdown.length}{" "}
            {sectorBreakdown.length === 1 ? "sector" : "sectors"}. {top.name}{" "}
            leads with {top.commitVelocity14d} commits over 14 days (
            {top.commitVelocityChange}).
          </p>
          <FreshnessWatermark
            date={lastModified}
            surface={`${geoName} ${stageName.toLowerCase()} data`}
            variant="compact"
            className="mt-3"
          />
        </header>

        <section
          className="mb-10 rounded-lg border border-sky-900/50 bg-sky-950/30 p-5 max-w-3xl"
          aria-label="Investor insight"
        >
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
            Investor insight
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {stageInvestorInsight}
          </p>
        </section>

        <section className="mb-10" aria-label="Sector breakdown">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Sector mix — {stageName.toLowerCase()} stage in {geoName}
          </h2>
          <div className="flex flex-wrap gap-2">
            {sectorBreakdown.map((s) => (
              <Link
                key={s.slug}
                href={`/startups-to-watch/${s.slug}`}
                className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
              >
                {s.name} ({s.count})
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="Startup rankings">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Ranked {stageName.toLowerCase()} startups in {geoName} —{" "}
            {period.name}
          </h2>
          <StartupTable startups={startups} />
          <p className="mt-3 text-gray-400 text-xs">
            Sorted by commit velocity change (14-day window). Region from public
            GitHub organization metadata; startups with undetermined region are
            excluded. Last updated {period.name}.
          </p>
          <FreshnessWatermark
            date={lastModified}
            surface="Ranking data"
            variant="full"
          />
        </section>

        <section className="mb-12" aria-label="Call to action">
          <SeoCta
            secondary={{
              label: "Unlock the Dashboard",
              href: "https://gitdealflow.com/dashboard",
            }}
          />
        </section>

        <section
          className="mb-12 max-w-3xl"
          aria-label="Frequently asked questions"
        >
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
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="Related views">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">See Also</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/stage/${slug}`}
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              All {stageName} startups
            </Link>
            <Link
              href={`/startups-to-watch/region/${geo}-${period.slug}`}
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              All {geoName} startups
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
