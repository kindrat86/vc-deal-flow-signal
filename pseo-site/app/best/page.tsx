import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSectors,
  getCurrentPeriod,
  getAllBestSectorSlugs,
  parseBestSectorSlug,
  getDataLastModified,
} from "@/lib/data";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Best Startups by Sector — Engineering Acceleration Rankings (2026)",
  description:
    "The best startups in every sector ranked by GitHub commit-velocity acceleration in 2026. AI/ML, fintech, devtools, robotics, climate, and 15 more sectors. Updated weekly.",
  alternates: {
    canonical: "/best",
  },
};

export default function BestIndex() {
  const period = getCurrentPeriod();
  const sectors = getAllSectors();
  const slugs = getAllBestSectorSlugs();
  const lastModified = getDataLastModified();

  const items = slugs
    .map((slug) => {
      const parsed = parseBestSectorSlug(slug);
      if (!parsed) return null;
      const startupCount = parsed.snapshot.startups.length;
      return {
        slug,
        sector: parsed.sector,
        year: parsed.year,
        count: startupCount,
      };
    })
    .filter(<T,>(x: T | null): x is T => x !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Best Startups by Sector — Engineering Acceleration Rankings",
        description:
          "Top startups by sector ranked on GitHub commit-velocity acceleration. Updated weekly.",
        url: "https://signals.gitdealflow.com/best",
        dateModified: lastModified,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
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
            name: "Best by Sector",
            item: "https://signals.gitdealflow.com/best",
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: items.map((it, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: `Best ${it.sector.name} Startups ${it.year}`,
          url: `https://signals.gitdealflow.com/best/${it.slug}`,
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Best by Sector</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Best Startups by Sector ({items[0]?.year ?? "2026"})
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-3">
          Every sector we cover, ranked by GitHub commit-velocity acceleration
          in {period.name}. Each list is the breakout cohort our methodology
          identifies for that sector — the startups showing engineering
          acceleration that historically precedes a fundraise by 6-12 weeks.
          If you already know you care about timing, proof, or what to do with
          the shortlist, start with the sharper routes below first.
        </p>
        <p className="text-gray-400 text-sm mb-10">
          {sectors.length} sectors · {items.length} ranked lists · last
          refreshed{" "}
          {new Date(lastModified).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          .
        </p>

        <section className="mb-10 rounded-2xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Use the sector lists when you want breadth. But if your real question is proof, timing, or how to use the shortlist once you find a name, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 transition-colors">
              Read the research panel →
            </Link>
            <Link href="/compare/crunchbase-alternative-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Compare timing vs verification →
            </Link>
            <Link href="/answers/how-to-turn-a-signal-into-a-watchlist" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Turn a signal into a watchlist →
            </Link>
          </div>
        </section>

        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((it) => (
            <Link
              key={it.slug}
              href={`/best/${it.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <h2 className="text-gray-100 font-semibold text-sm mb-1 group-hover:text-sky-400 transition-colors">
                Best {it.sector.name} Startups {it.year}
              </h2>
              <p className="text-gray-400 text-xs">
                {it.count} ranked startup{it.count === 1 ? "" : "s"} · GitHub
                acceleration
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Cross-sector views
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            For all-sector cuts of the same data, see the trending feed and the
            startups-to-watch by region.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/trending"
              className="text-sm text-sky-400 hover:text-sky-300 underline"
            >
              Top 20 trending all sectors
            </Link>
            <Link
              href="/startups-to-watch"
              className="text-sm text-sky-400 hover:text-sky-300 underline"
            >
              Startups to watch
            </Link>
            <Link
              href="/weekly"
              className="text-sm text-sky-400 hover:text-sky-300 underline"
            >
              This week's signal report
            </Link>
          </div>
        </div>

        <SeoCta signoffIndex={1} className="mt-12" />
      </div>
    </>
  );
}
