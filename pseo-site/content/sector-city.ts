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
      if (citySectorMatches(city.notableSectors, sector.slug)) {
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
  if (!citySectorMatches(city.notableSectors, sector.slug)) return null;
  return { sector, city };
}
