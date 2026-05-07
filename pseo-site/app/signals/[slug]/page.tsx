import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SIGNAL_TYPES,
  getSignalTypeData,
  getCurrentPeriod,
  getDataLastModified,
} from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import CTABanner from "@/components/CTABanner";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SIGNAL_TYPES.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const signalData = getSignalTypeData(slug);
  if (!signalData) return {};

  const period = getCurrentPeriod();
  const title = `${signalData.name} Signal — Startups Showing ${signalData.name}, ${period.name}`;
  const description = `${signalData.totalAcrossSectors} startups showing "${signalData.name.toLowerCase()}" signal across all sectors in ${period.name}. ${signalData.description}`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `/signals/${slug}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/signals/${slug}` },
  };
}

export default async function SignalTypePage({ params }: PageProps) {
  const { slug } = await params;
  const signalData = getSignalTypeData(slug);

  if (!signalData || signalData.startups.length === 0) {
    notFound();
  }

  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();
  const otherSignals = SIGNAL_TYPES.filter((s) => s.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${signalData.name} Signal — ${period.name}`,
        description: signalData.description,
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
            name: signalData.name,
            item: `https://signals.gitdealflow.com/signals/${slug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `Startups Showing ${signalData.name}, ${period.name}`,
        numberOfItems: Math.min(signalData.startups.length, 10),
        itemListElement: signalData.startups.slice(0, 10).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          description: `${s.description} — ${s.commitVelocityChange} commit velocity change, ${s.contributors} contributors`,
          url: s.githubUrl,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is a "${signalData.name.toLowerCase()}" signal in startup investing?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: signalData.description,
            },
          },
          {
            "@type": "Question",
            name: `How many startups are showing ${signalData.name.toLowerCase()} signals in ${period.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `In ${period.name}, ${signalData.totalAcrossSectors} startups across all tracked sectors are showing "${signalData.name.toLowerCase()}" signals. The top sectors are ${signalData.topSectors.map((s) => `${s.name} (${s.count})`).join(", ")}.`,
            },
          },
          {
            "@type": "Question",
            name: `What does a "${signalData.name.toLowerCase()}" signal mean for investors?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: signalData.investorInsight,
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{signalData.name}</span>
        </nav>

        {/* Header */}
        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            Signal Type — {period.name}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Startups Showing {signalData.name}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            {signalData.description} In {period.name},{" "}
            {signalData.totalAcrossSectors} startups across all tracked sectors
            are classified with this signal pattern.
          </p>
        </header>

        {/* Key Takeaway */}
        <section className="mb-8" aria-label="Key takeaway">
          <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
              What This Means for Investors
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {signalData.investorInsight}
            </p>
          </div>
        </section>

        {/* Top sectors breakdown — clickable sector pages */}
        {signalData.topSectors.length > 0 && (() => {
          const sectorSlugByName: Record<string, string> = {};
          for (const s of signalData.startups) {
            sectorSlugByName[s.sectorName] = s.sectorSlug;
          }
          return (
            <section className="mb-8" aria-label="Sector breakdown">
              <h2 className="text-lg font-semibold text-gray-100 mb-3">
                Top Sectors with This Signal
              </h2>
              <div className="flex flex-wrap gap-2">
                {signalData.topSectors.map((s) => {
                  const slugForSector = sectorSlugByName[s.name];
                  if (!slugForSector) {
                    return (
                      <span
                        key={s.name}
                        className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400"
                      >
                        {s.name}{" "}
                        <span className="text-sky-400 font-medium">({s.count})</span>
                      </span>
                    );
                  }
                  return (
                    <Link
                      key={s.name}
                      href={`/startups-to-watch/${slugForSector}-${period.slug}`}
                      className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
                      title={`View ${s.name} startup rankings for ${period.name}`}
                    >
                      {s.name}{" "}
                      <span className="text-sky-400 font-medium">({s.count})</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* Table */}
        <section className="mb-10" aria-label="Startup rankings">
          <StartupTable startups={signalData.startups} tableName={`Startups Showing ${signalData.name}, ${period.name}`} />
          <p className="mt-3 text-gray-600 text-xs">
            Sorted by commit velocity change (14-day window, descending). Data
            last updated {period.name}.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-12" aria-label="Call to action">
          <CTABanner />
        </section>

        {/* FAQ */}
        <section
          className="mb-12 max-w-3xl"
          aria-label="Frequently asked questions"
        >
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-gray-100 font-medium mb-2">
                What is a &ldquo;{signalData.name.toLowerCase()}&rdquo; signal?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {signalData.description}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-gray-100 font-medium mb-2">
                How many startups show this signal in {period.name}?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {signalData.totalAcrossSectors} startups across all tracked
                sectors. The top sectors are{" "}
                {signalData.topSectors
                  .map((s) => `${s.name} (${s.count})`)
                  .join(", ")}
                .
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-gray-100 font-medium mb-2">
                What does this signal mean for investors?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {signalData.investorInsight}
              </p>
            </div>
          </div>
        </section>

        {/* Other signal types */}
        <section aria-label="Other signal types">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Other Signal Types
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherSignals.map((s) => (
              <Link
                key={s.slug}
                href={`/signals/${s.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {s.name}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2">
                  {s.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
