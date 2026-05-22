/**
 * Live-signals join for the /startup-ideas/[slug] pages.
 *
 * Each StartupIdea declares a `matchSignal` shape. This module resolves it
 * against the current-period startup dataset and returns the top-N matching
 * orgs ranked by commit-velocity acceleration.
 *
 * The join is intentionally pure — it reads from the same in-memory snapshot
 * used everywhere else, so prebuild-time data refreshes (fetch-github-data.ts)
 * propagate without a content change.
 */

import "server-only";
import { getAllSectors, getCurrentPeriod, type Startup } from "@/lib/data";
import type { StartupIdea } from "@/content/startup-ideas";

export interface MatchedStartup extends Startup {
  sectorName: string;
  sectorSlug: string;
  velocityChangePct: number;
}

/**
 * Resolve an idea's `matchSignal` to the top-N matching startups in the
 * current period. Falls back to an empty list when nothing matches so the
 * page renders the rest of the framing cleanly.
 */
export function getStartupsForIdea(
  idea: StartupIdea,
  limit = 3,
): MatchedStartup[] {
  const period = getCurrentPeriod();
  const minCommits = idea.matchSignal.minCommits14d ?? 10;
  const keywordsLower = (idea.matchSignal.keywords ?? []).map((k) =>
    k.toLowerCase(),
  );
  const signalTypesLower = (idea.matchSignal.signalTypes ?? []).map((t) =>
    t.toLowerCase(),
  );

  const matched: MatchedStartup[] = [];
  for (const sector of getAllSectors()) {
    if (!idea.matchSignal.sectorSlugs.includes(sector.slug)) continue;
    const snap = sector.periods[period.slug];
    if (!snap) continue;

    for (const startup of snap.startups) {
      if (startup.commitVelocity14d < minCommits) continue;

      // Optional signal-type filter.
      if (
        signalTypesLower.length > 0 &&
        !signalTypesLower.some((t) =>
          (startup.signalType ?? "").toLowerCase().includes(t),
        )
      ) {
        continue;
      }

      // Optional keyword filter — match against name OR description.
      if (keywordsLower.length > 0) {
        const haystack = `${startup.name} ${startup.description ?? ""}`.toLowerCase();
        const hit = keywordsLower.some((kw) => haystack.includes(kw));
        if (!hit) continue;
      }

      const pct =
        parseInt(
          (startup.commitVelocityChange ?? "0").replace(/[^0-9-]/g, ""),
          10,
        ) || 0;

      matched.push({
        ...startup,
        sectorName: sector.name,
        sectorSlug: sector.slug,
        velocityChangePct: pct,
      });
    }
  }

  // De-dup by name in case a startup lives under two of the included sectors.
  const seen = new Set<string>();
  const deduped: MatchedStartup[] = [];
  for (const m of matched) {
    if (seen.has(m.name)) continue;
    seen.add(m.name);
    deduped.push(m);
  }

  return deduped
    .sort((a, b) => b.velocityChangePct - a.velocityChangePct)
    .slice(0, limit);
}

/**
 * Count how many ideas currently have at least one live-signal match.
 * Surfaced on the hub page as a credibility chip.
 */
export function countIdeasWithLiveMatches(ideas: StartupIdea[]): number {
  let n = 0;
  for (const idea of ideas) {
    if (getStartupsForIdea(idea, 1).length > 0) n++;
  }
  return n;
}
