/**
 * /showdown/[slug] entity pages — company-vs-company comparison.
 *
 * Distinct from /vs/[slug] which is the competitor-tool matrix (Harmonic
 * vs Affinity etc.). /showdown/[slug] compares two of our curated
 * /signal/ companies head-to-head — same-sector pairs only for relevance.
 *
 * Slug convention: lexicographically sorted "{a}-vs-{b}" so we never
 * generate both orderings.
 */

import { companies, type Company, getCompany } from "@/content/companies";

export interface ShowdownPair {
  a: Company;
  b: Company;
  slug: string;
}

/** Lex-sort the two slugs and join with "-vs-". Stable for any input order. */
export function pairSlug(slugA: string, slugB: string): string {
  return [slugA, slugB].sort().join("-vs-");
}

/** Parse "a-vs-b" back into the two slugs (handles slugs that themselves contain "-vs-" by splitting on the exact " -vs- " token — but neither company slug today contains "vs", so the naive split is safe). */
export function splitPairSlug(slug: string): [string, string] | null {
  const idx = slug.indexOf("-vs-");
  if (idx < 0) return null;
  return [slug.slice(0, idx), slug.slice(idx + "-vs-".length)];
}

export function getAllShowdownSlugs(): string[] {
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (let i = 0; i < companies.length; i++) {
    for (let j = i + 1; j < companies.length; j++) {
      const a = companies[i];
      const b = companies[j];
      // same-sector pairs only — keeps relevance high, page count tractable
      if (a.sector !== b.sector) continue;
      const slug = pairSlug(a.slug, b.slug);
      if (seen.has(slug)) continue;
      seen.add(slug);
      slugs.push(slug);
    }
  }
  return slugs;
}

export function getShowdownPair(slug: string): ShowdownPair | null {
  const parts = splitPairSlug(slug);
  if (!parts) return null;
  const [slugA, slugB] = parts;
  const a = getCompany(slugA);
  const b = getCompany(slugB);
  if (!a || !b) return null;
  if (a.slug === b.slug) return null;
  if (a.sector !== b.sector) return null;
  // canonical form: lex-sorted; reject any other ordering
  if (pairSlug(a.slug, b.slug) !== slug) return null;
  return { a, b, slug };
}
