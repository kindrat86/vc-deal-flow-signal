import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBestSectorSlugs,
  parseBestSectorSlug,
  getSortedStartups,
  getKeyTakeaway,
  getDataLastModified,
  getRelatedSectors,
} from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import SeoCta from "@/components/SeoCta";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBestSectorSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseBestSectorSlug(slug);
  if (!parsed) return {};

  const { sector, year } = parsed;
  const sectorLower = sector.name.toLowerCase();
  const title = `Best ${sector.name} Startups ${year} — Top Engineering Momentum`;
  const description = `The best ${sectorLower} startups in ${year} ranked by GitHub commit-velocity acceleration. Commit velocity, contributor growth, and breakout signals for investors looking at ${sectorLower}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `/best/${slug}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/best/${slug}` },
  };
}

export default async function BestSectorPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseBestSectorSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { sector, period, snapshot, year } = parsed;
  const sorted = getSortedStartups(snapshot.startups);
  const takeaway = getKeyTakeaway(sector.name, period.name, snapshot);
  const lastModified = getDataLastModified();
  const relatedSectors = getRelatedSectors(sector, period.slug);
  const sectorLower = sector.name.toLowerCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `Best ${sector.name} Startups ${year}`,
        description: `The best ${sectorLower} startups in ${year} ranked by engineering acceleration.`,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        dateModified: lastModified.toISOString().slice(0, 10),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[aria-label='Key takeaway']", "h1"],
        },
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
            name: `Best ${sector.name} Startups ${year}`,
            item: `https://signals.gitdealflow.com/best/${slug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `Best ${sector.name} Startups ${year}`,
        numberOfItems: Math.min(sorted.length, 10),
        itemListElement: sorted.slice(0, 10).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          description: `${s.description} — ${s.commitVelocityChange} commit velocity change`,
          url: s.githubUrl,
        })),
      },
      {
        "@type": "Dataset",
        name: `Best ${sector.name} Startups ${year} — Engineering Acceleration Dataset`,
        description: `Ranked dataset of ${sorted.length} ${sectorLower} startups in ${year}, scored by GitHub commit velocity change, contributor growth, new repository count, and signal classification. Sourced from public GitHub API data.`,
        url: `https://signals.gitdealflow.com/best/${slug}`,
        identifier: `gitdealflow:best:${slug}`,
        keywords: [
          sector.name,
          "startup rankings",
          "engineering acceleration",
          "commit velocity",
          "deal flow",
          "venture capital",
          "GitHub signals",
          `${year} startups`,
        ],
        dateModified: lastModified.toISOString().slice(0, 10),
        temporalCoverage: period.name,
        isAccessibleForFree: true,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        variableMeasured: [
          { "@type": "PropertyValue", name: "Commit Velocity Change", description: "Percentage change in 14-day commit volume vs. prior period" },
          { "@type": "PropertyValue", name: "Contributors", description: "Unique contributors to the most active public repository" },
          { "@type": "PropertyValue", name: "New Repositories (30d)", description: "Public repositories created in the last 30 days" },
          { "@type": "PropertyValue", name: "Signal Type", description: "Engineering hiring burst, infrastructure buildout, deploy frequency spike, or framework migration" },
        ],
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: "https://signals.gitdealflow.com/api/signals.json",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What are the best ${sectorLower} startups in ${year}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The best ${sectorLower} startups in ${year}, ranked by engineering acceleration: ${sorted.slice(0, 5).map((s, i) => `${i + 1}. ${s.name} (${s.commitVelocityChange} commit velocity change)`).join(", ")}. Rankings based on public GitHub engineering activity data from VC Deal Flow Signal.`,
            },
          },
          {
            "@type": "Question",
            name: `How are the best ${sectorLower} startups ranked?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Startups are ranked by commit velocity change — the percentage change in 14-day commit counts versus the previous period. This measures engineering acceleration, which has historically preceded fundraise announcements by three to six weeks. Data sourced from public GitHub activity.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/best/${slug}`} qaCategory="sector" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">
            Best {sector.name} Startups {year}
          </span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {year} Rankings
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Best {sector.name} Startups {year}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            The top {sectorLower} startups in {year}, ranked by GitHub
            engineering acceleration. These are the companies whose engineering
            teams are shipping the fastest — a signal that has historically
            preceded fundraise announcements by three to six weeks.
          </p>
        </header>

        {takeaway && (
          <section className="mb-8" aria-label="Key takeaway">
            <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5">
              <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
                Key Takeaway
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {takeaway}
              </p>
            </div>
          </section>
        )}

        <section className="mb-10" aria-label="Startup rankings">
          <StartupTable startups={sorted} tableName={`Best ${sector.name} Startups ${year}`} />
          <p className="mt-3 text-gray-400 text-xs">
            Ranked by commit velocity change (14-day window). Data: {period.name}.
          </p>
        </section>

        <section className="mb-12" aria-label="Call to action">
          <SeoCta secondary={{ label: "Unlock the Dashboard", href: "https://gitdealflow.com/dashboard" }} />
        </section>

        {/* FAQ */}
        <section className="mb-12 max-w-3xl" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-gray-100 font-medium mb-2">
                What are the best {sectorLower} startups in {year}?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Based on GitHub engineering acceleration data, the top{" "}
                {sectorLower} startups in {year} are{" "}
                {sorted
                  .slice(0, 5)
                  .map((s) => s.name)
                  .join(", ")}
                . Rankings are based on commit velocity change — the rate at
                which engineering output is accelerating.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-gray-100 font-medium mb-2">
                How are these rankings determined?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Startups are ranked by commit velocity change — the percentage
                change in 14-day commit counts versus the prior period. This
                measures engineering acceleration, not absolute size.{" "}
                <Link
                  href="/methodology"
                  className="text-sky-500 hover:text-sky-400 underline transition-colors"
                >
                  Read the full methodology
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* See detailed rankings */}
        <section className="mb-12">
          <Link
            href={`/startups-to-watch/${sector.slug}-${period.slug}`}
            className="inline-flex items-center gap-2 text-sky-500 text-sm font-medium hover:text-sky-400 transition-colors"
          >
            View detailed {sector.name} rankings for {period.name} &rarr;
          </Link>
        </section>

        {relatedSectors.length > 0 && (
          <section aria-label="Related sectors">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Best Startups in Related Sectors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedSectors.map((r) => {
                const relYear = r.slug.match(/q\d-(\d{4})/)?.[1] ?? year;
                const relSectorSlug = r.slug.replace(/-q\d-\d{4}$/, "");
                return (
                  <Link
                    key={r.slug}
                    href={`/best/${relSectorSlug}-${relYear}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                  >
                    <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                      Best {r.name} Startups {relYear}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {r.startupCount} startups ranked &rarr;
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
