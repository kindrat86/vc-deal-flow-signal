import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPageSlugs,
  getAllPeriods,
  parsePageSlug,
  getSortedStartups,
  getRelatedSectors,
  getDataLastModified,
  getKeyTakeaway,
  getAllGeoPageSlugs,
  getSectorLatestPeriod,
  countLead,
} from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import CuriosityGate from "@/components/CuriosityGate";
import SeoCta from "@/components/SeoCta";
import ShareBar from "@/components/ShareBar";
import VelocityBar from "@/components/charts/VelocityBar";
import SignalDistribution from "@/components/charts/SignalDistribution";
import CrossAxisNav from "@/components/CrossAxisNav";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPageSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parsePageSlug(slug);
  if (!parsed) return {};

  const { sector, period, snapshot } = parsed;
  // CTR: lead with the real tracked count (computed from the snapshot, never
  // hardcoded) + bracketed quarter; counts in titles lift SERP CTR and stay
  // truthful because they render from the same data as the table below.
  // countLead drops the number on thin snapshots (<5) so no page ships
  // "1 Fintech Startups" as its SERP headline.
  const title = `${countLead(snapshot.startups.length, `${sector.name} Startups`)} Accelerating on GitHub (${period.name})`;
  const description = `${sector.name} startups ranked by GitHub engineering acceleration, ${period.name}: commit velocity, contributor growth, and breakout signals. No signup required, every number links to public GitHub data.`;

  // Cannibalization guard: every quarter a sector ships, the older quarters
  // would compete with it for the same "X startups to watch" head keyword.
  // Old quarters canonicalize to the sector's LATEST quarter (same ranked-list
  // content, fresher data); the latest stays self-canonical. Self-maintaining:
  // getSectorLatestPeriod resolves from data.periods (newest-first), so the
  // moment a new quarter ships, all older quarters re-point to it automatically.
  const latest = getSectorLatestPeriod(sector.slug);
  const canonicalTarget =
    latest && latest.slug !== period.slug
      ? `/startups-to-watch/${sector.slug}-${latest.slug}`
      : `/startups-to-watch/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/startups-to-watch/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalTarget,
    },
  };
}

export default async function SectorPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parsePageSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { sector, period, snapshot } = parsed;
  const sortedStartups = getSortedStartups(snapshot.startups);
  const relatedSectors = getRelatedSectors(sector, period.slug);
  const keyTakeaway = getKeyTakeaway(sector.name, period.name, snapshot);
  const lastModified = getDataLastModified();
  const allPeriods = getAllPeriods();
  const otherPeriods = allPeriods.filter(
    (p) => p.slug !== period.slug && sector.periods[p.slug]
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${countLead(snapshot.startups.length, `${sector.name} Startups`)} Accelerating on GitHub, ${period.name}`,
        description: sector.description,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        datePublished: lastModified.toISOString().slice(0, 10),
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
            name: `${sector.name}, ${period.name}`,
            item: `https://signals.gitdealflow.com/startups-to-watch/${slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: snapshot.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "ItemList",
        name: `Top ${sector.name} Startups by Engineering Acceleration, ${period.name}`,
        numberOfItems: sortedStartups.length,
        itemListElement: sortedStartups.slice(0, 10).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          description: `${s.description}, ${s.commitVelocityChange} commit velocity change, ${s.contributors} contributors, signal: ${s.signalType}`,
          url: s.githubUrl,
        })),
      },
      {
        "@type": "Dataset",
        name: `${sector.name} Startups, Engineering Acceleration Dataset, ${period.name}`,
        description: `Ranked dataset of ${sortedStartups.length} ${sector.name.toLowerCase()} startups in ${period.name}, scored by GitHub commit velocity change, contributor growth, new repository count, and signal classification. Sourced from public GitHub API data.`,
        url: `https://signals.gitdealflow.com/startups-to-watch/${slug}`,
        identifier: `gitdealflow:startups-to-watch:${slug}`,
        keywords: [
          sector.name,
          "startup rankings",
          "engineering acceleration",
          "commit velocity",
          "deal flow",
          "venture capital",
          "GitHub signals",
          period.name,
        ],
        datePublished: lastModified.toISOString().slice(0, 10),
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
          { "@type": "PropertyValue", name: "Stage Estimate", description: "Pre-seed, Seed, Series A/B, or Growth, estimated from contributor count" },
        ],
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: "https://signals.gitdealflow.com/api/signals.json",
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">
            {sector.name}, {period.name}
          </span>
        </nav>

        {/* Page header */}
        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {period.name} Rankings
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {sector.name} Startups to Watch, {period.name}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            {snapshot.intro}
          </p>
        </header>

        {/* Share */}
        <div className="mb-8">
          <ShareBar
            title={`${sector.name} Startups to Watch, ${period.name}`}
            url={`/startups-to-watch/${slug}`}
          />
        </div>

        {/* Key Takeaway, self-contained summary for AI citation */}
        {keyTakeaway && (
          <section className="mb-8" aria-label="Key takeaway">
            <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5">
              <h2 className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
                Key takeaways, at a glance
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {keyTakeaway}
              </p>
              <p className="mt-3 text-gray-400 text-xs">
                Data sourced from public GitHub activity.{" "}
                <Link
                  href="/methodology"
                  className="text-sky-500 hover:text-sky-400 underline transition-colors"
                >
                  Read our methodology
                </Link>
              </p>
            </div>
          </section>
        )}

        {/* Data visualization */}
        <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6" aria-label="Engineering signal charts">
          <VelocityBar
            startups={sortedStartups}
            title={`${sector.name}, Velocity Change`}
          />
          <SignalDistribution
            startups={sortedStartups}
            sectorName={sector.name}
          />
        </section>

        {/* Table */}
        <section className="mb-10" aria-label="Startup rankings">
          <StartupTable startups={sortedStartups} tableName={`${sector.name} Startups Ranked by Engineering Acceleration, ${period.name}`} />
          <p className="mt-3 text-gray-400 text-xs">
            Sorted by commit velocity change (14-day window, descending). Top 3
            highlighted. Data last updated {period.name}.
          </p>
        </section>

        {sortedStartups[0] && (
          <section className="mb-10" aria-label="Projected signal preview">
            <CuriosityGate
              change={sortedStartups[0].commitVelocityChange}
              signalType={sortedStartups[0].signalType}
              entityName={sortedStartups[0].name}
              otherCount={sortedStartups.length - 1}
              contextLabel={`${sector.name} startups this period`}
            />
          </section>
        )}

        {/* CTA */}
        <section className="mb-12" aria-label="Call to action">
          <SeoCta
            heading={`The full ranked ${sector.name} list updates every week, get it free`}
            secondary={{ label: "Unlock the Dashboard", href: "https://gitdealflow.com/dashboard" }}
          />
        </section>

        {/* Cross-axis exploration (best/trends/signals/stage) */}
        <CrossAxisNav sector={sector} period={period} snapshot={snapshot} />

        {/* Other periods for this sector */}
        {otherPeriods.length > 0 && (
          <section className="mb-12" aria-label="Other time periods">
            <h2 className="text-lg font-semibold text-gray-100 mb-3">
              Other Quarters
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherPeriods.map((p) => (
                <Link
                  key={p.slug}
                  href={`/startups-to-watch/${sector.slug}-${p.slug}`}
                  className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ section */}
        {snapshot.faqs.length > 0 && (
          <section className="mb-12 max-w-3xl" aria-label="Frequently asked questions">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {snapshot.faqs.map((faq) => (
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
        )}

        {/* Geography filter links */}
        {(() => {
          const geoSlugs = getAllGeoPageSlugs();
          const prefix = `${sector.slug}-`;
          const suffix = `-${period.slug}`;
          const geoLinks = geoSlugs
            .filter((s) => s.startsWith(prefix) && s.endsWith(suffix))
            .map((s) => {
              const mid = s.slice(prefix.length, s.length - suffix.length);
              const geoNames: Record<string, string> = {
                us: "United States",
                uk: "United Kingdom",
                europe: "Europe",
                apac: "Asia-Pacific",
                canada: "Canada",
              };
              return { slug: s, name: geoNames[mid] || mid };
            });
          if (geoLinks.length === 0) return null;
          return (
            <section className="mb-12" aria-label="Filter by geography">
              <h2 className="text-lg font-semibold text-gray-100 mb-3">
                Filter by Geography
              </h2>
              <div className="flex flex-wrap gap-2">
                {geoLinks.map((geo) => (
                  <Link
                    key={geo.slug}
                    href={`/startups-to-watch/geo/${geo.slug}`}
                    className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
                  >
                    {geo.name}
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

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
                  <p className="text-gray-400 text-xs">
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
