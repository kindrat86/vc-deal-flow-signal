import type { Metadata } from "next";
import Link from "next/link";
import { pillars, getPostsInPillar } from "@/content/pillars";

export const metadata: Metadata = {
  title: "Topics — VC Deal Flow Signal",
  description:
    "Browse VC Deal Flow Signal articles by topical series — GitHub signals methodology, deal sourcing workflows, alternative data for VC, sector deep dives, and operator notes.",
  alternates: { canonical: "/topics" },
};

export default function TopicsIndexPage() {
  const entries = Object.values(pillars).map((p) => ({
    pillar: p,
    count: getPostsInPillar(p.slug).length,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
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
          <span className="text-gray-400">Topics</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Topics
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Articles organized by topical series. Each series covers one pillar
            of how investors use public GitHub data to source and evaluate
            startups.
          </p>
        </header>

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
      </div>
    </>
  );
}
