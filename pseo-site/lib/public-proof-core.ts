export type PublicProofPick = { outcome: string | null };
export type PublicProofWeek = { publishedAt: string; picks: PublicProofPick[] };

export interface PublicProof {
  asOf: string;
  scorecard: {
    published: number;
    graded: number;
    hits: number;
    misses: number;
    pending: number;
    source: "/scorecard";
  };
}

const GRADED = new Set([
  "raised",
  "acquired",
  "ipo",
  "other_milestone",
  "no_event",
  "shutdown",
]);
const HITS = new Set(["raised", "acquired", "ipo"]);
const MISSES = new Set(["no_event", "shutdown"]);

/** Derives public proof from dated prediction rows, never page copy. */
export function buildPublicProof(weeks: PublicProofWeek[]): PublicProof {
  let published = 0;
  let graded = 0;
  let hits = 0;
  let misses = 0;
  let pending = 0;
  let latestPublishedAt = "";

  for (const week of weeks) {
    if (week.publishedAt > latestPublishedAt) latestPublishedAt = week.publishedAt;
    for (const pick of week.picks) {
      published++;
      if (pick.outcome === null) {
        pending++;
        continue;
      }
      if (GRADED.has(pick.outcome)) graded++;
      if (HITS.has(pick.outcome)) hits++;
      if (MISSES.has(pick.outcome)) misses++;
    }
  }

  return {
    asOf: latestPublishedAt.slice(0, 10),
    scorecard: { published, graded, hits, misses, pending, source: "/scorecard" },
  };
}
