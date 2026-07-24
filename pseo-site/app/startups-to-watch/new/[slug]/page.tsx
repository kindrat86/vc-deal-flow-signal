import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getNewThisPeriodData,
  getAllNewThisPeriodSlugs,
  getDataLastModified,
} from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import SeoCta from "@/components/SeoCta";
import FreshnessWatermark from "@/components/FreshnessWatermark";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateStaticParams() {
  return getAllNewThisPeriodSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getNewThisPeriodData(slug);
  if (!data) return {};

  const { sector, currentPeriod, newStartups } = data;
  const title = `New ${sector.name} Startups Tracked This Quarter — ${currentPeriod.name}`;
  const description = `${newStartups.length} ${sector.name.toLowerCase()} startups newly entered our GitHub engineering-signal panel in ${currentPeriod.name} — ranked by commit velocity, contributor growth, and signal type.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `${SITE}/startups-to-watch/new/${slug}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/startups-to-watch/new/${slug}` },
  };
}

export default async function NewThisPeriodPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getNewThisPeriodData(slug);
  if (!data) notFound();

  const { sector, currentPeriod, previousPeriod, newStartups, returningCount } = data;
  const lastModified = getDataLastModified();
  const top = newStartups[0];
  const pageUrl = `${SITE}/startups-to-watch/new/${slug}`;

  const faqs = [
    {
      question: `How many new ${sector.name.toLowerCase()} startups entered the panel in ${currentPeriod.name}?`,
      answer: `${newStartups.length} ${sector.name.toLowerCase()} startups appear in our ${currentPeriod.name} tracking that were not present in ${previousPeriod.name}. "New" means newly tracked by our GitHub engineering-signal panel, not necessarily newly founded — some may have been incorporated earlier and simply crossed our commit-velocity threshold this quarter. ${top.name} leads the new cohort with ${top.commitVelocity14d} commits over a rolling 14-day window (${top.commitVelocityChange}).`,
    },
    {
      question: `How is "new this quarter" determined?`,
      answer: `We diff the set of tracked GitHub organizations in ${sector.name.toLowerCase()} between ${previousPeriod.name} and ${currentPeriod.name}. Any organization present in the current snapshot but absent from the prior one counts as new. ${returningCount} organizations from ${previousPeriod.name} remain on the panel this quarter.`,
    },
    {
      question: `What should investors do with a "new to the radar" signal?`,
      answer: `Treat it as a starting point, not a conclusion. A startup newly crossing our tracking threshold means its GitHub engineering activity became visible at scale — verify funding history, team background, and product traction independently before any investment action.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: `New ${sector.name} Startups Tracked This Quarter — ${currentPeriod.name}`,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        datePublished: lastModified.toISOString().slice(0, 10),
        dateModified: lastModified.toISOString().slice(0, 10),
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        url: pageUrl,
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Startups to Watch",
            item: `${SITE}/startups-to-watch`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `New ${sector.name} Startups`,
            item: pageUrl,
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
        name: `New ${sector.name} startups — ${currentPeriod.name}`,
        numberOfItems: newStartups.length,
        itemListElement: newStartups.slice(0, 20).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          url: `${SITE}/startup/${encodeURIComponent(s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`,
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
            href="/startups-to-watch"
            className="hover:text-gray-300 transition-colors"
          >
            Startups to Watch
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">New {sector.name}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {currentPeriod.name} · New to the Radar
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            New {sector.name} Startups Tracked This Quarter
          </h1>
          <p className="text-gray-400 text-base leading-relaxed" aria-label="Summary">
            {newStartups.length} {sector.name.toLowerCase()} startups entered our
            GitHub engineering-signal panel in {currentPeriod.name} — newly
            tracked, not necessarily newly founded. {top.name} leads with{" "}
            {top.commitVelocity14d} commits over 14 days ({top.commitVelocityChange}).
          </p>
          <FreshnessWatermark
            date={lastModified}
            surface={`${sector.name} sector data`}
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
            {returningCount} {sector.name.toLowerCase()} organizations from{" "}
            {previousPeriod.name} remain on the panel this quarter alongside these{" "}
            {newStartups.length} new entrants. A startup crossing our tracking
            threshold for the first time means its engineering activity became
            visible at scale — verify funding history and team background
            independently before treating this as a sourcing signal.
          </p>
        </section>

        <section className="mb-10" aria-label="New startups">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            New {sector.name.toLowerCase()} startups — {currentPeriod.name}
          </h2>
          <StartupTable startups={newStartups} />
          <p className="mt-3 text-gray-400 text-xs">
            Sorted by commit velocity change (14-day window). &quot;New&quot; = absent
            from the {previousPeriod.name} snapshot, present in {currentPeriod.name}.
          </p>
          <FreshnessWatermark date={lastModified} surface="Ranking data" variant="full" />
        </section>

        <section className="mb-12" aria-label="Call to action">
          <SeoCta secondary={{ label: "Unlock the Dashboard", href: "https://gitdealflow.com/dashboard" }} />
        </section>

        <section className="mb-12 max-w-3xl" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div key={f.question} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-gray-100 font-medium mb-2">{f.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="Related views">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">See Also</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/startups-to-watch/${sector.slug}-${currentPeriod.slug}`}
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              All {sector.name} startups
            </Link>
            <Link
              href="/startups-to-watch"
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              Startups to Watch hub
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
