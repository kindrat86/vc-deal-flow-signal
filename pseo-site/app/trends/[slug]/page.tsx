import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTrendSlugs,
  parseTrendSlug,
  getSortedStartups,
  getDataLastModified,
} from "@/lib/data";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import SeoCta from "@/components/SeoCta";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTrendSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseTrendSlug(slug);
  if (!parsed) return {};

  const { sector, periodA, periodB } = parsed;
  const title = `${sector.name} Trend: ${periodA.name} vs ${periodB.name}`;
  const description = `Compare ${sector.name.toLowerCase()} startup GitHub commit-velocity acceleration between ${periodA.name} and ${periodB.name}. Period-over-period commit velocity, contributor growth, and signal trends, code-side momentum metrics, not accelerator-program data.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `/trends/${slug}` },
    alternates: { canonical: `/trends/${slug}` },
  };
}

export default async function TrendPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseTrendSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { sector, periodA, periodB, snapshotA, snapshotB } = parsed;
  const sortedA = getSortedStartups(snapshotA.startups);
  const sortedB = getSortedStartups(snapshotB.startups);
  const lastModified = getDataLastModified();

  const avgVelA = Math.round(
    snapshotA.startups.reduce((s, x) => s + x.commitVelocity14d, 0) /
      (snapshotA.startups.length || 1)
  );
  const avgVelB = Math.round(
    snapshotB.startups.reduce((s, x) => s + x.commitVelocity14d, 0) /
      (snapshotB.startups.length || 1)
  );
  const velChange =
    avgVelB > 0 ? Math.round(((avgVelA - avgVelB) / avgVelB) * 100) : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://signals.gitdealflow.com/trends/${slug}#webpage`,
        url: `https://signals.gitdealflow.com/trends/${slug}`,
        name: `${sector.name} Trend: ${periodA.name} vs ${periodB.name}`,
        description: `Period-over-period engineering acceleration trend for ${sector.name.toLowerCase()} startups.`,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "Article",
        headline: `${sector.name}: ${periodA.name} vs ${periodB.name}`,
        description: `Period-over-period engineering acceleration trend for ${sector.name.toLowerCase()} startups.`,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
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
            name: `${sector.name} Trend`,
            item: `https://signals.gitdealflow.com/trends/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`https://signals.gitdealflow.com/trends/${slug}`}
        languages={getHreflangLanguages(`/trends/${slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">
            {sector.name} Trend
          </span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {sector.name}: {periodA.name} vs {periodB.name}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Period-over-period comparison of {sector.name.toLowerCase()}{" "}
            startup engineering acceleration. How has the sector&apos;s
            engineering momentum changed between {periodB.name} and{" "}
            {periodA.name}?
          </p>
        </header>

        {/* Summary stats */}
        <section className="mb-10" aria-label="Trend summary">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">
                Startups ({periodA.name})
              </p>
              <p className="text-gray-100 text-xl font-bold">
                {snapshotA.startups.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">
                Startups ({periodB.name})
              </p>
              <p className="text-gray-100 text-xl font-bold">
                {snapshotB.startups.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">Avg Velocity (now)</p>
              <p className="text-gray-100 text-xl font-bold">{avgVelA}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">Velocity Trend</p>
              <p
                className={`text-xl font-bold ${
                  velChange > 0
                    ? "text-emerald-400"
                    : velChange < 0
                      ? "text-red-400"
                      : "text-gray-100"
                }`}
              >
                {velChange > 0 ? "+" : ""}
                {velChange}%
              </p>
            </div>
          </div>
        </section>

        {/* Side-by-side top 5 */}
        <section className="mb-10" aria-label="Top movers comparison">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Top 5 by Period
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-sky-400 mb-3">
                {periodA.name}
              </h3>
              <div className="space-y-2">
                {sortedA.slice(0, 5).map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900 px-3 py-2"
                  >
                    <span className="text-gray-300 text-sm">
                      <span className="text-gray-400 font-mono mr-2">
                        {i + 1}.
                      </span>
                      {s.name}
                    </span>
                    <span className="text-emerald-400 text-xs font-mono font-semibold">
                      {s.commitVelocityChange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                {periodB.name}
              </h3>
              <div className="space-y-2">
                {sortedB.slice(0, 5).map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900 px-3 py-2"
                  >
                    <span className="text-gray-400 text-sm">
                      <span className="text-gray-400 font-mono mr-2">
                        {i + 1}.
                      </span>
                      {s.name}
                    </span>
                    <span className="text-gray-400 text-xs font-mono">
                      {s.commitVelocityChange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SeoCta className="mb-10" />

        {/* Links to full rankings */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Full Rankings
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/startups-to-watch/${sector.slug}-${periodA.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
            >
              {sector.name}, {periodA.name} &rarr;
            </Link>
            <Link
              href={`/startups-to-watch/${sector.slug}-${periodB.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              {sector.name}, {periodB.name} &rarr;
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
