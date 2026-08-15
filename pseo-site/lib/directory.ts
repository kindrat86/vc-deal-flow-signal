import "server-only";
import {
  getAllSectors,
  getAllRegionGeos,
  getSortedStartups,
  getSectorLatestPeriod,
  getRegionLatestPeriod,
  parseRegionPageSlug,
  type Startup,
  type Period,
} from "@/lib/data";

/**
 * Paginated startup directory (audit "Pagination 60" fix, 2026-08-17).
 *
 * The ~495 live /startup/[slug] profiles were reachable only from the
 * un-paginated ranked-list tables (the startups-to-watch and stage families)
 * and cross-links. There was no paginated hub with rel=next/prev, so the long
 * tail (everything past the top of a sector or region table) had no bounded
 * crawl path and the sector and city hubs pointed at the curated /signal
 * corpus instead of the live profiles.
 *
 * These helpers power the /startups/[sector]/[page] and
 * /startups/region/[geo]/[page] directory routes. Each directory is keyed to
 * its LATEST available period (getSectorLatestPeriod / getRegionLatestPeriod),
 * matching the quarter-canonicalization convention already used by the
 * ranked-list templates, so frozen sectors (ai-ml, fintech, climate-tech,
 * developer-tools, cybersecurity) still surface their last snapshot rather
 * than dropping out of the directory.
 */

export const DIRECTORY_PAGE_SIZE = 24;

/** Match the site's MIN_PSEO_CELL_SIZE convention: skip near-empty hubs. */
export const MIN_DIRECTORY_SIZE = 3;

export interface SectorDirectory {
  slug: string;
  name: string;
  period: Period;
  startups: Startup[];
}

export interface RegionDirectory {
  geoSlug: string;
  geoName: string;
  period: Period;
  startups: (Startup & { sectorName: string; sectorSlug: string })[];
}

export function paginate<T>(list: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return list.slice(start, start + perPage);
}

export function totalPagesFor(count: number, perPage = DIRECTORY_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(count / perPage));
}

export function getSectorDirectory(slug: string): SectorDirectory | null {
  const sector = getAllSectors().find((s) => s.slug === slug);
  if (!sector) return null;
  const latest = getSectorLatestPeriod(slug);
  if (!latest) return null;
  const snapshot = sector.periods[latest.slug];
  if (!snapshot) return null;
  const startups = getSortedStartups(snapshot.startups);
  if (startups.length < MIN_DIRECTORY_SIZE) return null;
  return { slug, name: sector.name, period: latest, startups };
}

export function getRegionDirectory(geoSlug: string): RegionDirectory | null {
  const latest = getRegionLatestPeriod(geoSlug);
  if (!latest) return null;
  const parsed = parseRegionPageSlug(`${geoSlug}-${latest.slug}`);
  if (!parsed || parsed.startups.length < MIN_DIRECTORY_SIZE) return null;
  const startups = [...parsed.startups].sort((a, b) => {
    const av = parseInt(a.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
    const bv = parseInt(b.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
    return bv - av;
  });
  return {
    geoSlug,
    geoName: parsed.geoName,
    period: parsed.period,
    startups,
  };
}

export interface DirectorySectorSummary {
  slug: string;
  name: string;
  startupCount: number;
}

export function getAllDirectorySectors(): DirectorySectorSummary[] {
  const out: DirectorySectorSummary[] = [];
  for (const sector of getAllSectors()) {
    const d = getSectorDirectory(sector.slug);
    if (d) out.push({ slug: d.slug, name: d.name, startupCount: d.startups.length });
  }
  return out;
}

export interface DirectoryRegionSummary {
  geoSlug: string;
  geoName: string;
  startupCount: number;
}

export function getAllDirectoryRegions(): DirectoryRegionSummary[] {
  const out: DirectoryRegionSummary[] = [];
  for (const geo of getAllRegionGeos()) {
    const d = getRegionDirectory(geo.slug);
    if (d) out.push({ geoSlug: d.geoSlug, geoName: d.geoName, startupCount: d.startups.length });
  }
  return out;
}

/** All (slug, page) pairs for static generation of the sector directory. */
export function getAllSectorDirectoryPages(): { slug: string; page: number }[] {
  const pairs: { slug: string; page: number }[] = [];
  for (const s of getAllDirectorySectors()) {
    const d = getSectorDirectory(s.slug);
    if (!d) continue;
    const total = totalPagesFor(d.startups.length);
    for (let page = 2; page <= total; page++) {
      pairs.push({ slug: s.slug, page });
    }
  }
  return pairs;
}

/** All (geo, page) pairs for static generation of the region directory. */
export function getAllRegionDirectoryPages(): { geo: string; page: number }[] {
  const pairs: { geo: string; page: number }[] = [];
  for (const r of getAllDirectoryRegions()) {
    const d = getRegionDirectory(r.geoSlug);
    if (!d) continue;
    const total = totalPagesFor(d.startups.length);
    for (let page = 2; page <= total; page++) {
      pairs.push({ geo: r.geoSlug, page });
    }
  }
  return pairs;
}
