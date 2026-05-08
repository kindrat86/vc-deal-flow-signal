import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSignalSectorData,
  getAllSignalSectorPairs,
  getDataLastModified,
} from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import CTABanner from "@/components/CTABanner";
import FreshnessWatermark from "@/components/FreshnessWatermark";

interface PageProps {
  params: Promise<{ slug: string; sector: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateStaticParams() {
  return getAllSignalSectorPairs().map(({ signal, sector }) => ({
    slug: signal,
    sector,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, sector } = await params;
  const data = getSignalSectorData(slug, sector);
  if (!data) return {};

  const title = `${data.sector.name} Startups Showing ${data.signalName} — ${data.period.name}`;
  const description = `${data.startups.length} ${data.sector.name.toLowerCase()} startups currently showing ${data.signalName.toLowerCase()} signal in ${data.period.name}. ${data.signalDescription}`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `/signals/${slug}/${sector}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `/signals/${slug}/${sector}`,
      types: {
        "text/markdown": `/md/signals/${slug}/${sector}`,
        "application/ld+json": `/jsonld/signals/${slug}/${sector}`,
      },
    },
  };
}

export default async function SignalSectorPage({ params }: PageProps) {
  const { slug, sector } = await params;
  const data = getSignalSectorData(slug, sector);

  if (!data) notFound();

  const {
    signalName,
    signalDescription,
    signalInvestorInsight,
    sector: sectorInfo,
    period,
    startups,
  } = data;
  const lastModified = getDataLastModified();
  const top = startups[0];

  const faqs = [
    {
      question: `Which ${sectorInfo.name.toLowerCase()} startups are showing ${signalName.toLowerCase()} in ${period.name}?`,
      answer: `${startups.length} ${sectorInfo.name.toLowerCase()} startups currently classify under the ${signalName.toLowerCase()} signal in ${period.name}. ${top.name} leads with ${top.commitVelocity14d} commits over 14 days (${top.commitVelocityChange} change) and ${top.contributors} active contributors.`,
    },
    {
      question: `What does ${signalName.toLowerCase()} mean for ${sectorInfo.name.toLowerCase()} investors?`,
      answer: signalInvestorInsight,
    },
    {
      question: `How is ${signalName.toLowerCase()} detected?`,
      answer: signalDescription,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${sectorInfo.name} Startups Showing ${signalName} — ${period.name}`,
        description: signalDescription,
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
            name: signalName,
            item: `https://signals.gitdealflow.com/signals/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: sectorInfo.name,
            item: `https://signals.gitdealflow.com/signals/${slug}/${sector}`,
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
        name: `${sectorInfo.name} startups showing ${signalName}`,
        numberOfItems: startups.length,
        itemListElement: startups.slice(0, 20).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
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
        <nav
          className="mb-6 text-sm text-gray-400"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/signals/${slug}`}
            className="hover:text-gray-300 transition-colors"
          >
            {signalName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{sectorInfo.name}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {period.name} · {signalName} · {sectorInfo.name}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {sectorInfo.name} Startups Showing {signalName}
          </h1>
          <p
            className="text-gray-400 text-base leading-relaxed"
            aria-label="Summary"
          >
            {startups.length} {sectorInfo.name.toLowerCase()} startups currently
            classify under the {signalName.toLowerCase()} signal in{" "}
            {period.name}. {top.name} leads with {top.commitVelocity14d} commits
            over 14 days ({top.commitVelocityChange}). {signalDescription}
          </p>
          <FreshnessWatermark
            date={lastModified}
            surface={`${sectorInfo.name} × ${signalName} data`}
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
            {signalInvestorInsight}
          </p>
        </section>

        <section className="mb-10" aria-label="Startup rankings">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            {sectorInfo.name} startups with {signalName.toLowerCase()} signal —{" "}
            {period.name}
          </h2>
          <StartupTable startups={startups} />
          <p className="mt-3 text-gray-400 text-xs">
            Sorted by commit velocity change (14-day window). Last updated{" "}
            {period.name}.
          </p>
          <FreshnessWatermark
            date={lastModified}
            surface="Ranking data"
            variant="full"
          />
        </section>

        <section className="mb-12" aria-label="Call to action">
          <CTABanner />
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
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            See Also
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/signals/${slug}`}
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              All {signalName} startups
            </Link>
            <Link
              href={`/startups-to-watch/${sector}-${period.slug}`}
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              All {sectorInfo.name} startups
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
