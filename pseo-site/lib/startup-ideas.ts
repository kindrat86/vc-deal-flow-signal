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
import {
  getAllSectors,
  getCurrentPeriod,
  MIN_PSEO_CELL_SIZE,
  type Startup,
} from "@/lib/data";
import { startupIdeas, type StartupIdea } from "@/content/startup-ideas";

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

  // Pool every sector-matched, volume-passed startup, plus a flag for
  // whether it ALSO passed the keyword/signal-type narrowing. Surfacing
  // both buckets lets the resolver prefer narrow matches but supplement
  // with sector-leader rankings when the narrow filter is sparse —
  // important because the dataset's org names don't repeat product
  // marketing keywords verbatim.
  interface Pool {
    startup: MatchedStartup;
    narrow: boolean;
  }
  const pool: Pool[] = [];
  const seen = new Set<string>();

  for (const sector of getAllSectors()) {
    if (!idea.matchSignal.sectorSlugs.includes(sector.slug)) continue;
    const snap = sector.periods[period.slug];
    if (!snap) continue;

    for (const startup of snap.startups) {
      if (startup.commitVelocity14d < minCommits) continue;
      if (seen.has(startup.name)) continue;

      const signalTypeOk =
        signalTypesLower.length === 0 ||
        signalTypesLower.some((t) =>
          (startup.signalType ?? "").toLowerCase().includes(t),
        );
      if (!signalTypeOk) continue;

      let narrow = true;
      if (keywordsLower.length > 0) {
        const haystack = `${startup.name} ${startup.description ?? ""}`.toLowerCase();
        narrow = keywordsLower.some((kw) => haystack.includes(kw));
      }

      const pct =
        parseInt(
          (startup.commitVelocityChange ?? "0").replace(/[^0-9-]/g, ""),
          10,
        ) || 0;

      seen.add(startup.name);
      pool.push({
        startup: {
          ...startup,
          sectorName: sector.name,
          sectorSlug: sector.slug,
          velocityChangePct: pct,
        },
        narrow,
      });
    }
  }

  // Rank narrow matches first (true keyword hit), then sector-leaders,
  // then by velocity-change desc within each group. This preserves the
  // editorial promise — when keywords match, those repos win; when they
  // don't, the page still surfaces credible sector-level signal.
  pool.sort((a, b) => {
    if (a.narrow !== b.narrow) return a.narrow ? -1 : 1;
    return b.startup.velocityChangePct - a.startup.velocityChangePct;
  });

  return pool.slice(0, limit).map((p) => p.startup);
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

// ---------------------------------------------------------------------------
// Sector rollups (/startup-ideas/sector/{sector})
// ---------------------------------------------------------------------------
//
// The hub at /startup-ideas already groups ideas by editorial `category`
// (AI-Native SaaS, Dev Tools, ...). This is a different, data-grounded cut:
// group by the sector(s) each idea's `matchSignal.sectorSlugs` targets, so
// "web3 startup ideas" / "ai startup ideas" head-term searches land on a
// dedicated page instead of only the flat hub. An idea can appear under
// more than one sector when matchSignal declares more than one — that's
// intentional (the idea genuinely spans both), not duplication of a single
// canonical concept. Each listing here is an excerpt (oneLiner only) that
// links to the single canonical /startup-ideas/[slug] page — the full
// build-today / seed-pattern / FAQ content lives there exactly once.

/** Ideas whose matchSignal targets the given sector, stable-sorted by slug
 * so page output doesn't reorder between builds. */
export function getIdeasBySector(sectorSlug: string): StartupIdea[] {
  return startupIdeas
    .filter((idea) => idea.matchSignal.sectorSlugs.includes(sectorSlug))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Sector slugs with enough authored ideas to clear the thin-content floor
 * (same MIN_PSEO_CELL_SIZE threshold used by every other Cartesian pSEO
 * surface on the site). */
export function getAllIdeaSectorSlugs(): string[] {
  const slugs: string[] = [];
  for (const sector of getAllSectors()) {
    if (getIdeasBySector(sector.slug).length >= MIN_PSEO_CELL_SIZE) {
      slugs.push(sector.slug);
    }
  }
  return slugs;
}
