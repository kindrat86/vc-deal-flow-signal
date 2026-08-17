import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllStageSlugs,
  getStagePageData,
  getDataLastModified,
  countLead,
} from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import SeoCta from "@/components/SeoCta";
import FreshnessWatermark from "@/components/FreshnessWatermark";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { withEditorialOverride } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllStageSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getStagePageData(slug);
  if (!data) return {};

  // CTR: lead with the real cohort size + "Accelerating on GitHub" hook;
  // count renders from the same data as the table, so it stays truthful.
  const title = `${countLead(data.startups.length, `${data.name} Startups`)} Accelerating on GitHub (${data.period.name})`;
  const description = `${data.startups.length} ${data.name.toLowerCase()} startups ranked by GitHub engineering acceleration in ${data.period.name}. See who ships fastest before the round is obvious. Free, no signup.`;

  return withEditorialOverride({
    title,
    description,
    openGraph: { title, description, type: "article", url: `/stage/${slug}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `/stage/${slug}`,
    },
  });
}

export default async function StagePage({ params }: PageProps) {
  const { slug } = await params;
  const data = getStagePageData(slug);

  if (!data) notFound();

  const { name, description, investorInsight, startups, sectorBreakdown, period } = data;
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
      question: `Which ${name.toLowerCase()} startups are showing the strongest engineering signals in ${period.name}?`,
      answer: `In ${period.name}, ${top.name} (${top.sectorName}) leads ${name.toLowerCase()} startups with ${top.commitVelocity14d} commits over a rolling 14-day window (${top.commitVelocityChange} change) and ${top.contributors} active contributors. Across all ${startups.length} tracked ${name.toLowerCase()} startups, the average 14-day commit velocity is ${avgVelocity} commits. The dominant engineering signal pattern is "${topSignal[0]}".`,
    },
    {
      question: `What should investors look for in ${name.toLowerCase()} engineering signals?`,
      answer: investorInsight,
    },
    {
      question: `Which sectors have the most ${name.toLowerCase()} activity?`,
      answer: `In ${period.name}, the top sectors by ${name.toLowerCase()} startup count are ${sectorBreakdown.slice(0, 5).map((s) => `${s.name} (${s.count})`).join(", ")}. Each sector page has its own ranked list and sector-specific context.`,
    },
    {
      question: `How is stage determined in these rankings?`,
      answer: `Stage is derived from contributor count, team-size enrichment data, and funding history where publicly available. Stage classifications use broad buckets (Pre-Seed, Seed, Series A/B, Growth) to provide meaningful sample sizes. These are estimates, always verify independently before any investment action.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${name} Startups Showing Engineering Acceleration, ${period.name}`,
        description,
        author: DATA_NERD_AUTHOR_REF,
        publisher: { "@type": "Organization", name: "VC Deal Flow Signal", url: "https://gitdealflow.com" },
        datePublished: lastModified.toISOString().slice(0, 10),
        dateModified: lastModified.toISOString().slice(0, 10),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[aria-label='Stage summary']"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: name, item: `https://signals.gitdealflow.com/stage/${slug}` },
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
        name: `${name} startups by engineering acceleration`,
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
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{name}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {period.name} · {name}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {name} Startups Showing Engineering Acceleration
          </h1>
          <p
            className="text-gray-400 text-base leading-relaxed"
            aria-label="Stage summary"
          >
            {description} Currently tracking {startups.length} {name.toLowerCase()}{" "}
            startups across {sectorBreakdown.length} sectors. {top.name} leads
            with {top.commitVelocity14d} commits over 14 days ({top.commitVelocityChange}).
          </p>

          <div
            className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-4"
            aria-label="TL;DR"
          >
            <h2 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
              How fast are {name.toLowerCase()} startups shipping in {period.name}?
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              We rank {startups.length} {name.toLowerCase()} startups by GitHub
              engineering acceleration for {period.name}. {top.name} tops the list
              at {top.commitVelocity14d} commits per 14-day window ({top.commitVelocityChange}),
              against a cohort average of {avgVelocity} commits. The most common
              breakout pattern this period is &ldquo;{topSignal[0]}&rdquo;. Rankings
              refresh weekly and every number links back to a public GitHub source.
            </p>
          </div>

          <p className="mt-4 text-gray-400 text-sm leading-relaxed" aria-label="Definition">
            <strong className="text-gray-200">Commit velocity</strong> is the number of
            commits a startup&rsquo;s public repositories receive over a rolling 14-day
            window, used here as a proxy for engineering throughput. A rising
            velocity paired with contributor growth is the earliest public signal
            that a {name.toLowerCase()} team is scaling ahead of a fundraise.
          </p>
        </header>

        <section className="mb-10 rounded-lg border border-sky-900/50 bg-sky-950/30 p-5 max-w-3xl" aria-label="Investor insight">
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
            Investor insight
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {investorInsight}
          </p>
        </section>

        <section className="mb-10" aria-label="Sector breakdown">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Which sectors have the most {name.toLowerCase()} startups?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {sectorBreakdown.map((s) => (
              <Link
                key={s.slug}
                href={`/startups-to-watch/${s.slug}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-3 hover:border-slate-600 transition-colors"
              >
                <p className="text-gray-200 text-sm font-medium">{s.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {s.count} {name.toLowerCase()} startup{s.count === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="Startup rankings">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Which {name.toLowerCase()} startups are accelerating fastest on
            GitHub in {period.name}?
          </h2>
          <StartupTable startups={startups} />
          <p className="mt-3 text-gray-600 text-xs">
            Sorted by commit velocity change (14-day window). Stage from
            contributor count + enrichment data. Last updated {period.name}.
          </p>
          <FreshnessWatermark
            date={lastModified}
            surface={`${name} stage data`}
            variant="full"
          />
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

        <section className="mb-10" aria-label="Other stages">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Other stages
          </h2>
          <div className="flex flex-wrap gap-2">
            {getAllStageSlugs()
              .filter((s) => s !== slug)
              .map((s) => (
                <Link
                  key={s}
                  href={`/stage/${s}`}
                  className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
                >
                  {s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
