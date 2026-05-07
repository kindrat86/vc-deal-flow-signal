import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  getDataLastModified,
} from "@/lib/data";
import type { Startup } from "@/lib/data";
import StartupTable from "@/components/StartupTable";
import VelocityBar from "@/components/charts/VelocityBar";
import SignalDistribution from "@/components/charts/SignalDistribution";
import PSEOFooterNav from "@/components/PSEOFooterNav";

export const metadata: Metadata = {
  title: "Trending Startups — Top Engineering Acceleration Across All Sectors",
  description:
    "The top 20 trending startups ranked by GitHub engineering acceleration across all sectors. Commit velocity spikes, contributor growth, and breakout signals — updated weekly.",
  openGraph: {
    title: "Trending Startups — Top Engineering Acceleration",
    description:
      "Top 20 startups ranked by GitHub engineering acceleration across all sectors. Updated weekly.",
    type: "article",
    url: "/trending",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending Startups — Top Engineering Acceleration",
    description:
      "Top 20 startups ranked by GitHub engineering acceleration across all sectors.",
  },
  alternates: {
    canonical: "/trending",
  },
};

export default function TrendingPage() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();

  // Collect all startups from current period with their sector info
  const allStartups: Array<Startup & { sectorName: string; sectorSlug: string }> = [];
  const sectorCounts: Record<string, number> = {};

  for (const sector of sectors) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot) continue;
    for (const startup of snapshot.startups) {
      allStartups.push({
        ...startup,
        sectorName: sector.name,
        sectorSlug: sector.slug,
      });
    }
    sectorCounts[sector.name] = snapshot.startups.length;
  }

  const sorted = getSortedStartups(allStartups);
  const top20 = sorted.slice(0, 20);

  // Signal distribution
  const signals: Record<string, number> = {};
  for (const s of allStartups) {
    signals[s.signalType] = (signals[s.signalType] || 0) + 1;
  }
  const topSignal = Object.entries(signals).sort(([, a], [, b]) => b - a)[0];

  // Sector leaderboard (by avg velocity)
  const sectorLeaders = sectors
    .map((sector) => {
      const snapshot = sector.periods[period.slug];
      if (!snapshot || !snapshot.startups.length) return null;
      const avg = Math.round(
        snapshot.startups.reduce((s, x) => s + x.commitVelocity14d, 0) /
          snapshot.startups.length
      );
      const topStartup = getSortedStartups(snapshot.startups)[0];
      return {
        name: sector.name,
        slug: `${sector.slug}-${period.slug}`,
        count: snapshot.startups.length,
        avgVelocity: avg,
        topName: topStartup.name,
        topChange: topStartup.commitVelocityChange,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .sort((a, b) => b.avgVelocity - a.avgVelocity)
    .slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `Trending Startups — Top Engineering Acceleration, ${period.name}`,
        description: `Top 20 startups across all sectors ranked by GitHub engineering acceleration in ${period.name}.`,
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        dateModified: lastModified.toISOString().slice(0, 10),
      },
      {
        "@type": "ItemList",
        name: `Top 20 Trending Startups by Engineering Acceleration, ${period.name}`,
        numberOfItems: top20.length,
        itemListElement: top20.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          description: `${s.description} — ${s.commitVelocityChange} commit velocity, ${s.contributors} contributors`,
          url: s.githubUrl,
        })),
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
            name: "Trending",
            item: "https://signals.gitdealflow.com/trending",
          },
        ],
      },
      {
        "@type": "Dataset",
        name: `Trending Startup Engineering Signals, ${period.name}`,
        description: `Top 20 startups across ${Object.keys(sectorCounts).length} sectors ranked by GitHub engineering acceleration in ${period.name}. Commit velocity, contributor growth, and signal classification from public GitHub data.`,
        url: "https://signals.gitdealflow.com/trending",
        license: "https://signals.gitdealflow.com/terms",
        creator: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        distribution: {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: "https://signals.gitdealflow.com/api/signals.json",
        },
        temporalCoverage: period.name,
        measurementTechnique:
          "Automated collection from GitHub API v3: commit activity, contributor counts, and repository metadata.",
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
          <span className="text-gray-400">Trending</span>
        </nav>

        {/* Header */}
        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {period.name} — Cross-Sector
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Trending Startups by Engineering Acceleration
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            The top 20 startups across all {Object.keys(sectorCounts).length}{" "}
            sectors showing the highest GitHub engineering acceleration this
            period. Ranked by commit velocity change — the rate at which
            engineering activity is accelerating relative to baseline. These
            patterns have historically preceded fundraise announcements by six
            to twelve weeks.
          </p>
        </header>

        {/* Key Takeaway */}
        <section className="mb-8" aria-label="Key takeaway">
          <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
              Key Takeaway
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              In {period.name}, {allStartups.length} startups across{" "}
              {Object.keys(sectorCounts).length} sectors show measurable
              engineering signals. {top20[0]?.name} leads across all sectors
              with {top20[0]?.commitVelocityChange} commit velocity change. The
              most common signal type is &quot;{topSignal?.[0]}&quot; ({topSignal?.[1]}{" "}
              startups). Engineering acceleration at this scale has historically
              preceded fundraise announcements by three to six weeks.
            </p>
            <p className="mt-3 text-gray-600 text-xs">
              Data sourced from public GitHub activity.{" "}
              <Link
                href="/methodology"
                className="text-sky-500 hover:text-sky-400 transition-colors"
              >
                Read our methodology
              </Link>
            </p>
          </div>
        </section>

        {/* Charts */}
        <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6" aria-label="Trending signal charts">
          <VelocityBar startups={top20} title="Top Trending — Velocity Change" />
          <SignalDistribution startups={top20} sectorName="trending" />
        </section>

        {/* Top 20 Table */}
        <section className="mb-10" aria-label="Trending startup rankings">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Top 20 Across All Sectors
          </h2>
          <StartupTable startups={top20} tableName={`Top 20 Trending Startups by Engineering Acceleration, ${period.name}`} />
          <p className="mt-3 text-gray-600 text-xs">
            Sorted by commit velocity change (14-day window, descending). Data
            last updated {period.name}.
          </p>
        </section>

        {/* Sector Leaderboard */}
        <section className="mb-12" aria-label="Sector leaderboard">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Hottest Sectors by Average Velocity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorLeaders.map((s, i) => (
              <Link
                key={s.slug}
                href={`/startups-to-watch/${s.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sky-400 text-xs font-bold">
                    #{i + 1}
                  </span>
                  <h3 className="text-gray-100 font-semibold text-sm group-hover:text-sky-400 transition-colors">
                    {s.name}
                  </h3>
                </div>
                <p className="text-gray-500 text-xs mb-1">
                  {s.count} startups · avg {s.avgVelocity} commits/14d
                </p>
                <p className="text-gray-400 text-xs">
                  Top mover: {s.topName} ({s.topChange})
                </p>
              </Link>
            ))}
          </div>
        </section>

        <PSEOFooterNav excludeHrefs={["/trending"]} />

        {/* CTA */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get these signals weekly
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Get the top breakout startups across all sectors delivered to
            your inbox every week. Free, no spam.
          </p>
          <Link
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Get the Report
          </Link>
        </div>
      </div>
    </>
  );
}
