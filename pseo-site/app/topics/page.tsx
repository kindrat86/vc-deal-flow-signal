import type { Metadata } from "next";
import Link from "next/link";
import { pillars, getPostsInPillar } from "@/content/pillars";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Topics — VC Deal Flow Signal",
  description:
    "Browse VC Deal Flow Signal articles by topical series — GitHub signals methodology, deal sourcing workflows, alternative data for VC, sector deep dives, and operator notes.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: { canonical: "/topics" },
};

export default function TopicsIndexPage() {
  const entries = Object.values(pillars).map((p) => ({
    pillar: p,
    count: getPostsInPillar(p.slug).length,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/topics#webpage",
        url: "https://signals.gitdealflow.com/topics",
        name: "Topics — VC Deal Flow Signal",
        description:
          "Browse articles by topical series across GitHub signals methodology, deal sourcing, alternative data, sector deep dives, and operator notes.",
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "CollectionPage",
        name: "Topics — VC Deal Flow Signal",
        description:
          "Browse articles by topical series across GitHub signals methodology, deal sourcing, alternative data, sector deep dives, and operator notes.",
        url: "https://signals.gitdealflow.com/topics",
        hasPart: entries.map(({ pillar }) => ({
          "@type": "CreativeWorkSeries",
          name: pillar.name,
          description: pillar.description,
          url: `https://signals.gitdealflow.com/topics/${pillar.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/topics"
        languages={getHreflangLanguages("/topics")}
      />
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
          <span className="text-gray-400">Topics</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Topics
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Articles organized by topical series. Each series covers one pillar
            of how investors use public GitHub data to source and evaluate
            startups. If you already know your question, start with the sharper
            routes below instead of browsing the whole topic map.
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Use the topic map when you want to explore. But if your real question is proof, comparison, or buyer-side clarity, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 transition-colors">
              Read the research panel →
            </Link>
            <Link href="/compare/crunchbase-alternative-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Compare timing vs verification →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the buyer's guide →
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map(({ pillar, count }) => (
            <Link
              key={pillar.slug}
              href={`/topics/${pillar.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <h2 className="text-gray-100 font-medium text-lg group-hover:text-sky-400 transition-colors mb-2">
                {pillar.name}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-3">
                {pillar.description}
              </p>
              <p className="text-xs text-sky-500">
                {count} {count === 1 ? "article" : "articles"} →
              </p>
            </Link>
          ))}
        </div>

        <SeoCta signoffIndex={2} className="mt-12" />
      </div>
    </>
  );
}
