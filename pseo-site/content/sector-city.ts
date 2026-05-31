/**
 * /sector/[slug]/in/[city] cross-pages — sector × city composition pages.
 *
 * Each leaf is an editorial composition of one sector hub × one city
 * hub: relevant signal patterns when scouting that sector in that city,
 * local VC anchors, cross-sector context. Targets long-tail queries
 * like "AI infrastructure in Berlin" or "fintech in London".
 *
 * Matching: city.notableSectors is free-text editorial strings; sector
 * slugs are kebab-case. We use a keyword map to bridge the two
 * taxonomies. Only generates pages where the city's notableSectors
 * contain at least one keyword for the sector — keeps pages high-signal.
 */

import { sectors, getSector, type Sector } from "@/content/sectors";
import { CITIES, type City, getCityBySlug } from "@/content/cities";
import { getCompaniesInSectorAndCity } from "@/content/company-locations";

const SECTOR_KEYWORDS: Record<string, string[]> = {
  "ai-infra": ["ai infra", "frontier ai", "applied ai"],
  "ai-ml": ["ai", "machine learning", "ml", "applied ai", "frontier ai"],
  "developer-tools": ["developer tools", "dev tools", "devtools"],
  "infrastructure": ["infrastructure", "cloud", "edge"],
  "database": ["database", "data infra"],
  "observability": ["observability", "monitoring", "devops"],
  "analytics": ["analytics", "data analytics", "data"],
  "fintech": ["fintech", "payments", "banking"],
  "productivity": ["productivity", "collaboration"],
};

function citySectorMatches(citySectors: string[], sectorSlug: string): boolean {
  const keywords = SECTOR_KEYWORDS[sectorSlug] ?? [];
  if (keywords.length === 0) return false;
  return citySectors.some((cs) => {
    const lower = cs.toLowerCase();
    return keywords.some((kw) => lower.includes(kw.toLowerCase()));
  });
}

export interface SectorCityPair {
  sector: string;
  city: string;
}

export function getAllSectorCityPairs(): SectorCityPair[] {
  const pairs: SectorCityPair[] = [];
  for (const sector of sectors) {
    for (const city of CITIES) {
      const editorialMatch = citySectorMatches(city.notableSectors, sector.slug);
      const hqMatch =
        getCompaniesInSectorAndCity(sector.slug, city.slug).length > 0;
      if (editorialMatch || hqMatch) {
        pairs.push({ sector: sector.slug, city: city.slug });
      }
    }
  }
  return pairs;
}

export interface SectorCityData {
  sector: Sector;
  city: City;
}

export function getSectorCity(sectorSlug: string, citySlug: string): SectorCityData | null {
  const sector = getSector(sectorSlug);
  const city = getCityBySlug(citySlug);
  if (!sector || !city) return null;
  const editorialMatch = citySectorMatches(city.notableSectors, sector.slug);
  const hqMatch = getCompaniesInSectorAndCity(sector.slug, city.slug).length > 0;
  if (!editorialMatch && !hqMatch) return null;
  return { sector, city };
}

/**
 * True when this cell has ≥1 HQ-mapped company in the curated corpus, i.e.
 * it carries proprietary local-intersection data rather than a purely
 * templated editorial composition (city signal pattern × sector thesis).
 */
export function sectorCityHasLocalCompanies(
  sectorSlug: string,
  citySlug: string,
): boolean {
  return getCompaniesInSectorAndCity(sectorSlug, citySlug).length > 0;
}

/**
 * Index-eligible sector × city pairs: only the HQ-backed cells.
 *
 * Editorial-only cells (keyword match but no HQ-mapped company) are the
 * thin "made-for-search intersection" tail — their own copy admits "we do
 * not currently document a {city}-HQ'd company in {sector}". On a
 * low-authority domain those dilute crawl budget and site-quality without
 * a realistic shot at indexation. They remain statically generated and
 * internally linked (`noindex, follow`, see app/sector/[slug]/in/[city]/
 * page.tsx) so they keep passing equity to /signal, /sector, /city and the
 * region panels, and stay reachable for agents/MCP — they are just omitted
 * from the sitemap and the index. Mirrors the /showdown near-duplicate
 * treatment (see app/sitemap/[id]/route.ts). Fully reversible: swap this
 * back to getAllSectorCityPairs() in the sitemap to re-list every cell.
 */
export function getIndexableSectorCityPairs(): SectorCityPair[] {
  return getAllSectorCityPairs().filter(({ sector, city }) =>
    sectorCityHasLocalCompanies(sector, city),
  );
}
