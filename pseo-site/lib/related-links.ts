import graph from "@/data/internal-links.json";

export interface RelatedLink { href: string; label: string; subtitle?: string }
export interface RelatedGroup { title: string; links: RelatedLink[] }

const GRAPH = graph as Record<string, RelatedGroup[]>;

/** Related-link groups for a given pathname (no trailing slash). Safe on miss. */
export function getRelatedGroups(pathname: string): RelatedGroup[] {
  const key = pathname.replace(/\/$/, "") || "/";
  return GRAPH[key] ?? [];
}

/** Flat section index for hub pages: { section: pathnames[] }. */
export function getLinkSections(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const p of Object.keys(GRAPH)) {
    const section = p.split("/").filter(Boolean)[0] || "home";
    (out[section] ||= []).push(p);
  }
  return out;
}
