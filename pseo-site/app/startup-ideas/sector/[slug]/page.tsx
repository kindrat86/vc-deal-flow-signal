import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSectors, getCurrentPeriod, getDataLastModified } from "@/lib/data";
import {
  getIdeasBySector,
  getAllIdeaSectorSlugs,
  getStartupsForIdea,
} from "@/lib/startup-ideas";
import FreshnessWatermark from "@/components/FreshnessWatermark";
import SeoCta from "@/components/SeoCta";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateStaticParams() {
  return getAllIdeaSectorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ideas = getIdeasBySector(slug);
  const sector = getAllSectors().find((s) => s.slug === slug);
  if (!sector || ideas.length === 0) return {};

  const title = `${sector.name} Startup Ideas — Buildable Opportunities With Live Signal`;
  const description = `${ideas.length} ${sector.name.toLowerCase()} startup ideas, each paired with the repos already accelerating against it, pulled live from our GitHub engineering-signal panel.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `${SITE}/startup-ideas/sector/${slug}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/startup-ideas/sector/${slug}` },
  };
}

export default async function IdeasBySectorPage({ params }: PageProps) {
  const { slug } = await params;
  const ideas = getIdeasBySector(slug);
  const sector = getAllSectors().find((s) => s.slug === slug);
  if (!sector || ideas.length === 0) notFound();

  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();
  const pageUrl = `${SITE}/startup-ideas/sector/${slug}`;

  // Live-signal proof: pull the top matching repo for each idea (limit 1)
  // so the rollup page itself carries real, current data — not just a
  // list of links to the canonical idea pages.
  const ideaCards = ideas.map((idea) => ({
    idea,
    topMatch: getStartupsForIdea(idea, 1)[0] ?? null,
  }));
  const liveCount = ideaCards.filter((c) => c.topMatch).length;

  const faqs = [
    {
      question: `How many ${sector.name.toLowerCase()} startup ideas are on this list?`,
      answer: `${ideas.length} buildable ${sector.name.toLowerCase()} ideas, each with a live-signal join against our GitHub engineering panel. ${liveCount} of ${ideas.length} currently have at least one matching repo showing active commit velocity in ${period.name}.`,
    },
    {
      question: `Are these ideas grounded in real data?`,
      answer: `Each idea is paired against the current-period startup dataset by sector and keyword match. The "repos already trying" join is live — it re-resolves against the latest GitHub signal snapshot on every data refresh, not a one-time snapshot frozen at write time.`,
    },
    {
      question: `How is this different from the /startup-ideas hub?`,
      answer: `The hub groups all ideas by editorial category (AI-Native SaaS, Dev Tools, etc.). This page groups by data sector (${sector.name}) so you can browse ideas mapped to the same GitHub-tracked sector taxonomy used throughout the rest of the site.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: `${sector.name} Startup Ideas — Buildable Opportunities With Live Signal`,
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
            name: "Startup Ideas",
            item: `${SITE}/startup-ideas`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: sector.name,
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
        name: `${sector.name} startup ideas`,
        numberOfItems: ideas.length,
        itemListElement: ideas.map((idea, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: idea.title,
          url: `${SITE}/startup-ideas/${idea.slug}`,
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
          <Link href="/startup-ideas" className="hover:text-gray-300 transition-colors">
            Startup Ideas
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{sector.name}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {sector.name} · Buildable Opportunities
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {sector.name} Startup Ideas — With the Repos Already Trying
          </h1>
          <p className="text-gray-400 text-base leading-relaxed" aria-label="Summary">
            {ideas.length} buildable {sector.name.toLowerCase()} ideas, each paired
            with the repos already accelerating against it. {liveCount} of{" "}
            {ideas.length} have at least one live match in {period.name}.
          </p>
          <FreshnessWatermark
            date={lastModified}
            surface={`${sector.name} sector data`}
            variant="compact"
            className="mt-3"
          />
        </header>

        <section className="mb-10" aria-label="Startup ideas">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            {sector.name} ideas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ideaCards.map(({ idea, topMatch }) => (
              <Link
                key={idea.slug}
                href={`/startup-ideas/${idea.slug}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-sky-600/50 transition-colors"
              >
                <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
                  {idea.category}
                </p>
                <h3 className="text-gray-100 font-semibold mb-2 leading-snug">
                  {idea.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {idea.oneLiner}
                </p>
                {topMatch && (
                  <p className="text-xs text-gray-500">
                    Live match: <span className="text-gray-300">{topMatch.name}</span>{" "}
                    ({topMatch.commitVelocityChange} commits, {topMatch.contributors}{" "}
                    contributors)
                  </p>
                )}
              </Link>
            ))}
          </div>
          <FreshnessWatermark date={lastModified} surface="Idea-repo matches" variant="full" />
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
              href="/startup-ideas"
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              All startup ideas
            </Link>
            <Link
              href={`/startups-to-watch/${sector.slug}-${period.slug}`}
              className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
            >
              All {sector.name} startups
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
