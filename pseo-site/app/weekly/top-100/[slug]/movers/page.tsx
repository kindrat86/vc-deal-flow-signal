import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTop100MoverSlugs,
  getTop100Movers,
  type Top100Mover,
} from "@/lib/top-100";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTop100MoverSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getTop100Movers(slug);
  if (!data) return {};

  const { weekLabel, previousWeekLabel, climbers, fallers, newEntrants } = data;
  const title = `Top 100 Movers — ${weekLabel} vs ${previousWeekLabel}`;
  const description = `${climbers.length} climbers, ${fallers.length} fallers, and ${newEntrants.length} new entrants in the GitHub-signal Top 100 rankings, ${weekLabel} vs ${previousWeekLabel}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `${SITE}/weekly/top-100/${slug}/movers` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/weekly/top-100/${slug}/movers` },
  };
}

function MoverRow({ m, direction }: { m: Top100Mover; direction: "up" | "down" }) {
  return (
    <li className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 text-right">
          <p className="text-gray-400 text-xs">rank</p>
          <p className="text-gray-100 font-bold text-lg leading-none">
            {m.previousRank} <span className="text-gray-500">→</span> {m.rank}
          </p>
        </div>
        <div className="flex-shrink-0 w-14 text-right">
          <p className="text-gray-400 text-xs">delta</p>
          <p className={`font-bold text-lg leading-none ${direction === "up" ? "text-emerald-400" : "text-rose-400"}`}>
            {direction === "up" ? "+" : ""}
            {m.rankDelta}
          </p>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <Link
              href={`/startup/${m.name}`}
              className="text-gray-100 font-semibold text-base hover:text-sky-400 transition-colors"
            >
              {m.name}
            </Link>
            <span className="text-xs text-gray-400">{m.sectorName}</span>
          </div>
          {m.description && (
            <p className="text-gray-400 text-sm mt-1 leading-snug">{m.description}</p>
          )}
          <p className="text-gray-400 text-xs mt-2">
            {m.commitVelocityChange} commits · {m.contributorGrowth} team ·{" "}
            {m.commitVelocity14d} c/14d · {m.signalType}
          </p>
        </div>
      </div>
    </li>
  );
}

export default async function Top100MoversPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getTop100Movers(slug);
  if (!data) notFound();

  const { weekLabel, previousSlug, previousWeekLabel, climbers, fallers, newEntrants, droppedOut } = data;
  const pageUrl = `${SITE}/weekly/top-100/${slug}/movers`;
  const topClimber = climbers[0];
  const topFaller = fallers[0];

  const faqs = [
    {
      question: `Who climbed the most in the Top 100, ${weekLabel} vs ${previousWeekLabel}?`,
      answer: topClimber
        ? `${topClimber.name} climbed ${topClimber.rankDelta} places, from rank ${topClimber.previousRank} to rank ${topClimber.rank}, with ${topClimber.commitVelocityChange} commit-velocity change over the trailing 14 days.`
        : `No startup climbed enough places to register this week.`,
    },
    {
      question: `Who fell the most?`,
      answer: topFaller
        ? `${topFaller.name} fell ${Math.abs(topFaller.rankDelta)} places, from rank ${topFaller.previousRank} to rank ${topFaller.rank}.`
        : `No startup fell enough places to register this week.`,
    },
    {
      question: `How many new entrants appeared in the Top 100 this week?`,
      answer: `${newEntrants.length} startups entered the Top 100 for the first time in ${weekLabel}${newEntrants.length > 0 ? `, led by ${newEntrants[0].name} at rank ${newEntrants[0].rank}` : ""}. ${droppedOut.length} startups from ${previousWeekLabel} dropped out of the rankings entirely.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: `Top 100 Movers — ${weekLabel} vs ${previousWeekLabel}`,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        url: pageUrl,
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: "Weekly Reports", item: `${SITE}/weekly` },
          { "@type": "ListItem", position: 3, name: "Top 100 Index", item: `${SITE}/weekly/top-100` },
          { "@type": "ListItem", position: 4, name: weekLabel, item: `${SITE}/weekly/top-100/${slug}` },
          { "@type": "ListItem", position: 5, name: "Movers", item: pageUrl },
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
        "@id": `${pageUrl}#climbers`,
        name: `Top 100 climbers — ${weekLabel}`,
        numberOfItems: climbers.length,
        itemListElement: climbers.slice(0, 20).map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: m.name,
          url: m.githubUrl || `${SITE}/startup/${m.name}`,
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href="/weekly/top-100" className="hover:text-gray-300 transition-colors">
            Top 100 Index
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/weekly/top-100/${slug}`} className="hover:text-gray-300 transition-colors">
            {weekLabel}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Movers</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Top 100 Movers — {weekLabel}
        </h1>
        <p
          className="text-gray-400 text-base leading-relaxed mb-8 speakable"
          data-agent-summary={`${climbers.length} climbers, ${fallers.length} fallers, and ${newEntrants.length} new entrants in the GitHub-signal Top 100, comparing ${weekLabel} against ${previousWeekLabel}. Top climber: ${topClimber?.name ?? "none"} (+${topClimber?.rankDelta ?? 0} ranks). Top faller: ${topFaller?.name ?? "none"} (${topFaller?.rankDelta ?? 0} ranks).`}
        >
          Rank changes vs <span className="text-gray-200 font-medium">{previousWeekLabel}</span>:{" "}
          <span className="text-emerald-400 font-medium">{climbers.length} climbers</span>,{" "}
          <span className="text-rose-400 font-medium">{fallers.length} fallers</span>,{" "}
          <span className="text-gray-200 font-medium">{newEntrants.length} new entrants</span>.
        </p>

        {climbers.length > 0 && (
          <section className="mb-10" aria-label="Biggest climbers">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Biggest climbers
            </h2>
            <ul className="space-y-3">
              {climbers.slice(0, 25).map((m) => (
                <MoverRow key={`up-${m.name}`} m={m} direction="up" />
              ))}
            </ul>
          </section>
        )}

        {fallers.length > 0 && (
          <section className="mb-10" aria-label="Biggest fallers">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Biggest fallers
            </h2>
            <ul className="space-y-3">
              {fallers.slice(0, 25).map((m) => (
                <MoverRow key={`down-${m.name}`} m={m} direction="down" />
              ))}
            </ul>
          </section>
        )}

        {newEntrants.length > 0 && (
          <section className="mb-10" aria-label="New entrants">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              New entrants
            </h2>
            <ul className="space-y-3">
              {newEntrants.map((r) => (
                <li
                  key={`new-${r.name}`}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 text-right">
                      <p className="text-gray-400 text-xs">rank</p>
                      <p className="text-gray-100 font-bold text-lg leading-none">{r.rank}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3 flex-wrap">
                        <Link
                          href={`/startup/${r.name}`}
                          className="text-gray-100 font-semibold text-base hover:text-sky-400 transition-colors"
                        >
                          {r.name}
                        </Link>
                        <span className="text-xs text-gray-400">{r.sectorName}</span>
                      </div>
                      {r.description && (
                        <p className="text-gray-400 text-sm mt-1 leading-snug">{r.description}</p>
                      )}
                      <p className="text-gray-400 text-xs mt-2">
                        {r.commitVelocityChange} commits · {r.contributorGrowth} team ·{" "}
                        {r.commitVelocity14d} c/14d · {r.signalType}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

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
              href={`/weekly/top-100/${slug}`}
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              Full {weekLabel} leaderboard
            </Link>
            <Link
              href={`/weekly/top-100/${previousSlug}`}
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              {previousWeekLabel} leaderboard
            </Link>
            <Link
              href="/weekly/top-100"
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              Top 100 Index
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
