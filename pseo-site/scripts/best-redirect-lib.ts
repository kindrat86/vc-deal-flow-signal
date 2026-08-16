/**
 * Shared derivation for historical /best/ redirects (2026-08-19, quarterly
 * freshness fix).
 *
 * WHY THIS EXISTS
 * ---------------
 * /best/<sector>-<year> pages generate ONLY for sectors that carry a snapshot
 * of the CURRENT data period (app/best/[slug]/page.tsx uses dynamicParams =
 * false + getAllBestSectorSlugs()). When a sector freezes at a quarter
 * rollover, or when the calendar year advances, those URLs stop generating and
 * 404 while still holding GSC equity. The first freeze (Q2-2026 -> Q3-2026)
 * was patched with five HARDCODED 308s that, once the data caught up, started
 * SHADOWING five live Q3 pages (they kept serving stale Q2 snapshots).
 *
 * Redirects are now derived from data/startups.json: every /best/ URL that no
 * longer generates 308s to the intent-matched quarter snapshot on
 * /startups-to-watch/. Nothing to hand-maintain at quarter boundaries.
 *
 * Consumers:
 *   - scripts/generate-best-redirects.ts  writes data/best-redirects.json (prebuild)
 *   - next.config.ts                      spreads data/best-redirects.json into redirects()
 *   - scripts/verify-no-regressions.ts    re-derives and fails a tree that drifts
 */

import startupsData from "../data/startups.json";

export interface BestRedirect {
  source: string;
  destination: string;
}

interface Period {
  slug: string;
  name: string;
  current: boolean;
}

interface SectorSnapshot {
  startups: unknown[];
}

interface Sector {
  slug: string;
  name: string;
  periods: Record<string, SectorSnapshot>;
}

export interface StartupsData {
  sectors: Sector[];
  periods: Period[];
}

const YEAR_RE = /\d{4}/;

export function loadStartupsData(): StartupsData {
  return startupsData as unknown as StartupsData;
}

export function deriveBestRedirects(data: StartupsData): BestRedirect[] {
  const current = data.periods.find((p) => p.current) ?? data.periods[0];
  if (!current) return [];
  const currentYear = current.name.match(YEAR_RE)?.[0] ?? "";
  const out: BestRedirect[] = [];
  const seen = new Set<string>();
  // data.periods is ordered newest-first, so the FIRST period hit for a given
  // source slug is the sector's latest snapshot of that year. That makes a
  // frozen sector's /best/<sector>-<year> point at its most recent data.
  for (const sector of data.sectors) {
    const hasCurrent = Boolean(sector.periods[current.slug]);
    for (const period of data.periods) {
      if (period.current) continue;
      const snapshot = sector.periods[period.slug];
      if (!snapshot) continue; // no URL ever generated for this sector+period
      const year = period.name.match(YEAR_RE)?.[0] ?? "";
      const source = `/best/${sector.slug}-${year}`;
      // Still generating today: the current period covers this sector AND the
      // slug year equals the current year. Never shadow a live page.
      if (hasCurrent && year === currentYear) continue;
      if (seen.has(source)) continue;
      seen.add(source);
      out.push({
        source,
        destination: `/startups-to-watch/${sector.slug}-${period.slug}`,
      });
    }
  }
  return out.sort((a, b) => a.source.localeCompare(b.source));
}
