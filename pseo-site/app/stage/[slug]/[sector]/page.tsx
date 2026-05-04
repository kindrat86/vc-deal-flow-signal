import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStageSectorData,
  getAllStageSectorPairs,
  getDataLastModified,
  STAGE_DEFINITIONS,
} from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import CTABanner from "@/components/CTABanner";
import { HreflangLinks } from "@/components/HreflangLinks";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DEFAULT_HREFLANG_LANGUAGES } from "@/lib/hreflang";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ slug: string; sector: string }>;
}

export async function generateStaticParams() {
  return getAllStageSectorPairs().map(({ stage, sector }) => ({
    slug: stage,
    sector,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, sector } = await params;
  const d = getStageSectorData(slug, sector);
  if (!d) return {};

  const title = `${d.stageName} ${d.sector.name} Startups Showing Engineering Acceleration — ${d.period.name}`;
  const description = `${d.startups.length} ${d.stageName.toLowerCase()} ${d.sector.name.toLowerCase()} startups with breakout GitHub commit-velocity signals in ${d.period.name}. ${d.stageInvestorInsight}`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/stage/${slug}/${sector}` },
  };
}

export default async function StageSectorPage({ params }: PageProps) {
  const { slug, sector } = await params;
  const d = getStageSectorData(slug, sector);

  if (!d) {
    notFound();
  }

  const lastModified = getDataLastModified();
  const dateModified = lastModified.toISOString().slice(0, 10);
  const otherStages = STAGE_DEFINITIONS.filter((s) => s.slug !== slug);
  const canonical = `${SITE}/stage/${slug}/${sector}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${d.stageName} ${d.sector.name} Startups — ${d.period.name}`,
        description: `${d.startups.length} ${d.stageName.toLowerCase()} ${d.sector.name.toLowerCase()} startups with breakout GitHub engineering signals in ${d.period.name}.`,
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
        dateModified,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[aria-label='Key takeaway']"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: d.stageName,
            item: `${SITE}/stage/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: d.sector.name,
            item: canonical,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `${d.stageName} ${d.sector.name} startups, ${d.period.name}`,
        numberOfItems: Math.min(d.startups.length, 10),
        itemListElement: d.startups.slice(0, 10).map((s, i) => ({
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
            name: `Which ${d.stageName.toLowerCase()} ${d.sector.name.toLowerCase()} startups are accelerating in ${d.period.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${d.startups.length} ${d.stageName.toLowerCase()} ${d.sector.name.toLowerCase()} startups currently show breakout engineering-acceleration signals in ${d.period.name}: ${d.startups
                .slice(0, 5)
                .map((s) => s.name)
                .join(", ")}${d.startups.length > 5 ? ", and more." : "."}`,
            },
          },
          {
            "@type": "Question",
            name: `What signals do ${d.stageName.toLowerCase()} investors track in ${d.sector.name.toLowerCase()}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: d.stageInvestorInsight,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks canonical={canonical} languages={DEFAULT_HREFLANG_LANGUAGES} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/stage/${slug}/${sector}`} qaCategory="stage" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/stage/${slug}`} className="hover:text-gray-300 transition-colors">
            {d.stageName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{d.sector.name}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {d.stageName} × {d.sector.name} — {d.period.name}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {d.stageName} {d.sector.name} Startups Showing Engineering Acceleration
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            {d.startups.length} {d.stageName.toLowerCase()} {d.sector.name.toLowerCase()}{" "}
            startups with breakout GitHub commit-velocity signals in {d.period.name}.{" "}
            {d.stageDescription}
          </p>
        </header>

        <section className="mb-8" aria-label="Key takeaway">
          <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
              What This Means for {d.stageName} Investors
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {d.stageInvestorInsight}
            </p>
          </div>
        </section>

        <section className="mb-10" aria-label="Startup rankings">
          <StartupTable
            startups={d.startups}
            tableName={`${d.stageName} ${d.sector.name} startups, ${d.period.name}`}
          />
          <p className="mt-3 text-gray-600 text-xs">
            Sorted by commit velocity change (14-day window, descending). Data
            last updated {d.period.name}.
          </p>
        </section>

        <section className="mb-12" aria-label="Call to action">
          <CTABanner />
        </section>

        <section aria-label="Related links">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Related Views
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Link
              href={`/stage/${slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
            >
              <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                All {d.stageName} startups
              </h3>
              <p className="text-gray-500 text-xs">
                Across every tracked sector, {d.period.name}.
              </p>
            </Link>
            <Link
              href={`/startups-to-watch/${d.sector.slug}-${d.period.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
            >
              <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                All {d.sector.name} startups
              </h3>
              <p className="text-gray-500 text-xs">
                Full {d.sector.name.toLowerCase()} ranking for {d.period.name}.
              </p>
            </Link>
          </div>

          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Other Stages in {d.sector.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherStages.map((s) => (
              <Link
                key={s.slug}
                href={`/stage/${s.slug}/${sector}`}
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
