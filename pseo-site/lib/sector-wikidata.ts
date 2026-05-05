/**
 * Wikidata QID lookup for sector slugs used by the GitHub-momentum
 * taxonomy. Drives `sameAs` enrichment in the `mentions` arrays of
 * blog post and topic JSON-LD — gives AI engines and Knowledge Graph
 * consumers a canonical entity URI instead of just a name string.
 *
 * Source: hand-mapped from Wikidata 2026-05-03. When adding a new sector,
 * search wikidata.org for the most specific entity and prefer the QID for
 * the field of study (Qxxx) over the company-cluster QID.
 */

export const SECTOR_WIKIDATA: Record<string, string> = {
  "ai-ml": "https://www.wikidata.org/wiki/Q2539", // Machine learning
  "fintech": "https://www.wikidata.org/wiki/Q1063015", // Financial technology
  "climate-tech": "https://www.wikidata.org/wiki/Q1419048", // Clean technology
  "developer-tools": "https://www.wikidata.org/wiki/Q1130645", // Programming tool
  "cybersecurity": "https://www.wikidata.org/wiki/Q3510521", // Computer security
  "healthcare": "https://www.wikidata.org/wiki/Q31207", // Health care
  "enterprise-saas": "https://www.wikidata.org/wiki/Q1254596", // Software as a service
  "data-infrastructure": "https://www.wikidata.org/wiki/Q166231", // Database
  "web3": "https://www.wikidata.org/wiki/Q107317579", // Web3
  "robotics": "https://www.wikidata.org/wiki/Q170978", // Robotics
  "hr-tech": "https://www.wikidata.org/wiki/Q3496101", // Human resources
  "proptech": "https://www.wikidata.org/wiki/Q11473894", // Real estate technology
  "logistics": "https://www.wikidata.org/wiki/Q179124", // Logistics
  "edtech": "https://www.wikidata.org/wiki/Q5334121", // Educational technology
  "marketing": "https://www.wikidata.org/wiki/Q39809", // Marketing
  "biotech": "https://www.wikidata.org/wiki/Q7162", // Biotechnology
  "media": "https://www.wikidata.org/wiki/Q11030", // Mass media
  "gaming": "https://www.wikidata.org/wiki/Q41298", // Video game
  "energy": "https://www.wikidata.org/wiki/Q11451", // Energy industry
  "consumer": "https://www.wikidata.org/wiki/Q56116", // Consumer goods
};

/**
 * Returns the Wikidata canonical URI for a sector slug, or undefined.
 * Use as `sameAs: SECTOR_WIKIDATA[slug] ? [SECTOR_WIKIDATA[slug]] : undefined`.
 */
export function getSectorWikidata(slug: string): string | undefined {
  return SECTOR_WIKIDATA[slug];
}
