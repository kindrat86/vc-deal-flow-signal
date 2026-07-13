/**
 * Which page paths have a working Markdown mirror at /md/<path>?
 *
 * Mirrors the dispatch in app/md/[...path]/route.ts EXACTLY — that route
 * only implements the families below and 404s everything else. Components
 * that advertise a <link rel="alternate" type="text/markdown"> (e.g.
 * components/AgentMirrorLinks.tsx) must check this first so we never
 * advertise a 404 to crawlers.
 *
 * Keep this in sync with app/md/[...path]/route.ts when adding families.
 */

/** Families where /md/<first-segment> alone (or any depth) renders. */
const ANY_DEPTH_FAMILIES = new Set([
  "methodology",
  "badge-builder",
  "answers",
  "alternatives",
  "research",
  "faq",
  "glossary",
  "agents",
]);

/** Families that require at least one sub-segment (/md/<family>/<slug>). */
const CHILD_ONLY_FAMILIES = new Set([
  "stage",
  "signals",
  "startup",
  "startups-to-watch",
]);

export function supportsMdMirror(path: string): boolean {
  const segments = path
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);

  // "" → renderHome()
  if (segments.length === 0) return true;

  const [family] = segments;

  if (ANY_DEPTH_FAMILIES.has(family)) return true;
  if (CHILD_ONLY_FAMILIES.has(family)) return segments.length >= 2;

  // citations only renders as the exact one-segment path
  if (family === "citations") return segments.length === 1;

  // niche-down renders index, sector, and leaf — nothing deeper
  if (family === "niche-down") return segments.length <= 3;

  return false;
}
