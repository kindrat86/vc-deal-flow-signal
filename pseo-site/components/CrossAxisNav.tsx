import Link from "next/link";
import {
  SIGNAL_TYPES,
  getAllStageSlugs,
  getAllPeriods,
  type Sector,
  type Period,
  type SectorSnapshot,
} from "@/lib/data";

const STAGE_NAMES: Record<string, string> = {
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a-b": "Series A/B",
};

interface CrossAxisNavProps {
  sector: Sector;
  period: Period;
  snapshot: SectorSnapshot;
}

/**
 * Cross-axis internal nav for a {sector × period} page.
 *
 * Yandex's 2026-05-02 recheck flagged sector pages as "low-value" because
 * they only linked along the sector axis (other periods, related sectors,
 * geo). This block adds links along the *other* axes that exist for the
 * same data: best-of, stage breakdowns, signal-type breakdowns, trends.
 *
 * Every link goes to a real generated page (verified against
 * generateStaticParams in each [slug]/page.tsx).
 */
export default function CrossAxisNav({ sector, period, snapshot }: CrossAxisNavProps) {
  const year = period.name.match(/\d{4}/)?.[0] ?? "2026";
  const bestSlug = `${sector.slug}-${year}`;

  // Trend slug is `{sector}-{periodA}-vs-{periodB}` where A, B are adjacent in
  // data.periods (most-recent-first). Fall back to no link if no prior period.
  const allPeriods = getAllPeriods();
  const idx = allPeriods.findIndex((p) => p.slug === period.slug);
  const prevPeriod = idx >= 0 && idx + 1 < allPeriods.length ? allPeriods[idx + 1] : null;
  const trendSlug =
    prevPeriod && sector.periods[prevPeriod.slug]
      ? `${sector.slug}-${period.slug}-vs-${prevPeriod.slug}`
      : null;

  // Top 3 signal types by count in this sector × period
  const signalCounts: Record<string, number> = {};
  for (const s of snapshot.startups) {
    signalCounts[s.signalType] = (signalCounts[s.signalType] || 0) + 1;
  }
  const topSignals = SIGNAL_TYPES
    .filter((s) => signalCounts[s.match] && signalCounts[s.match] > 0)
    .sort((a, b) => (signalCounts[b.match] || 0) - (signalCounts[a.match] || 0))
    .slice(0, 4);

  // Stage links: only stages that actually have startups in this snapshot
  const stageSlugs = getAllStageSlugs();
  const stageHits = stageSlugs.filter((stage) =>
    snapshot.startups.some((s) => {
      const m = s.stage.toLowerCase();
      if (stage === "pre-seed") return m.includes("pre-seed") || m.includes("preseed");
      if (stage === "seed") return m === "seed" || m.includes("seed-stage") || m === "seed";
      if (stage === "series-a-b") return m.includes("series");
      return false;
    }),
  );

  return (
    <section className="mb-12" aria-label="Explore by axis">
      <h2 className="text-lg font-semibold text-gray-100 mb-3">
        More views of {sector.name}, {period.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href={`/best/${bestSlug}`}
          className="block rounded-md border border-slate-800 bg-slate-900 p-3 hover:border-sky-700 hover:bg-slate-900/80 transition-colors"
        >
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-1">
            Best of {year}
          </p>
          <p className="text-sm text-gray-300">
            Top {sector.name} startups ranked across all {year} quarters &rarr;
          </p>
        </Link>
        {trendSlug && (
          <Link
            href={`/trends/${trendSlug}`}
            className="block rounded-md border border-slate-800 bg-slate-900 p-3 hover:border-sky-700 hover:bg-slate-900/80 transition-colors"
          >
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-1">
              {period.name} vs {prevPeriod?.name}
            </p>
            <p className="text-sm text-gray-300">
              How {sector.name} commit velocity has shifted quarter-over-quarter &rarr;
            </p>
          </Link>
        )}
      </div>

      {topSignals.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
            By signal type in this sector
          </p>
          <div className="flex flex-wrap gap-2">
            {topSignals.map((sig) => (
              <Link
                key={sig.slug}
                href={`/signals/${sig.slug}`}
                className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
                title={sig.description}
              >
                {sig.name}{" "}
                <span className="text-gray-600">
                  ({signalCounts[sig.match] || 0})
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {stageHits.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
            By stage
          </p>
          <div className="flex flex-wrap gap-2">
            {stageHits.map((stage) => (
              <Link
                key={stage}
                href={`/stage/${stage}`}
                className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
              >
                {STAGE_NAMES[stage] || stage}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
