/**
 * Canonical funnel slugs for the live-activity counter on /funnels.
 *
 * Mirrors the FUNNELS list in app/funnels/page.tsx but in machine-friendly
 * form (kebab-case keys, not display names). Both the API endpoint and the
 * client component reference this list so they can't drift apart.
 *
 * Add a new entry here AND in app/funnels/page.tsx FUNNELS[]. The page-level
 * list owns the display copy; this list owns the activity-tracking key.
 *
 * Slug naming rule: kebab-case, derives from the first-segment of the funnel's
 * primary URL (e.g. /firstlook → "firstlook"; /walkthrough/5min → "walkthrough-5min").
 */

export const FUNNEL_SLUGS = [
  "free-watch",
  "quiz",
  "pitch",
  "walkthrough",
  "walkthrough-5min",
  "walkthrough-90s",
  "walkthrough-quick",
  "firstlook",
  "dashboard",
  "insider",
  "sharp",
  "sector-sweep",
  "post-90",
] as const;

export type FunnelSlug = (typeof FUNNEL_SLUGS)[number];

const SLUG_SET: ReadonlySet<string> = new Set(FUNNEL_SLUGS);

export function isFunnelSlug(s: string): s is FunnelSlug {
  return SLUG_SET.has(s);
}
