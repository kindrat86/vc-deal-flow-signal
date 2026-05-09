/**
 * /api/v1/members.json — programmatic Charter Cohort endpoint.
 *
 * Brunson DotCom Secrets Ch 13 (Best Bait) + Traffic Secrets Ch 9 (Publishing)
 * — agent-side bait. The /members hub serves the Charter Cohort to humans;
 * this endpoint serves the same data to agents (Claude, Cursor, MCP hosts,
 * RAG pipelines, custom crawlers) as JSON with stable v1 versioning.
 *
 * Brunson Expert Secrets §1 Ch 4 (Mass Movement Vehicle) — visible momentum
 * through every crawler that reads JSON. The Charter Cohort surface compounds
 * automatically as members claim seats and publish picks.
 *
 * Response shape mirrors the typed `CharterMember` content with derived
 * leaderboard stats appended so a single fetch resolves both the roster
 * and the ranking. Cached at the edge for 1 hour with revalidation.
 */

import { NextResponse } from "next/server";
import {
  CHARTER_COHORT,
  CHARTER_COHORT_TOTAL_SEATS,
  CHECK_SIZE_LABELS,
  SECTOR_LABELS,
  getClaimedCount,
  getRemainingSeats,
  type CharterMember,
} from "@/content/charter-cohort";

export const dynamic = "force-static";
export const revalidate = 3600;

const SITE = "https://signals.gitdealflow.com";

interface MemberStats {
  picks: number;
  hits: number;
  misses: number;
  pending: number;
  hit_rate_pct: number | null;
}

function statsFor(member: CharterMember): MemberStats {
  const picks = member.picks.length;
  const hits = member.scorecard.filter((s) => s.status === "hit").length;
  const misses = member.scorecard.filter((s) => s.status === "miss").length;
  const pending = member.scorecard.filter((s) => s.status === "pending").length;
  const closed = hits + misses;
  return {
    picks,
    hits,
    misses,
    pending,
    hit_rate_pct: closed > 0 ? Math.round((hits / closed) * 100) : null,
  };
}

export async function GET() {
  const claimed = getClaimedCount();
  const remaining = getRemainingSeats();

  const members = CHARTER_COHORT.map((m) => {
    const stats = statsFor(m);
    return {
      handle: m.handle,
      claimed: m.claimed,
      archetype: m.archetype,
      tagline: m.tagline,
      thesis: m.thesis,
      check_size_band: m.checkSize,
      check_size_label: CHECK_SIZE_LABELS[m.checkSize],
      sectors: m.sectors,
      sector_labels: m.sectors.map((s) => SECTOR_LABELS[s]),
      seat_opened_at: m.seatOpenedAt,
      claimed_by: m.claimedBy ?? null,
      profile_url: `${SITE}/members/${m.handle}`,
      stats,
      picks: m.picks.map((p) => ({
        org: p.org,
        why: p.why,
        flagged_at: p.flaggedAt,
        github_url: `https://github.com/${p.org}`,
      })),
      scorecard: m.scorecard,
    };
  });

  // Same ranking semantics as /members/leaderboard so agents and humans
  // agree on the order: hits → closed windows → picks → handle.
  const leaderboard = [...members]
    .sort((a, b) => {
      if (b.stats.hits !== a.stats.hits) return b.stats.hits - a.stats.hits;
      const aClosed = a.stats.hits + a.stats.misses;
      const bClosed = b.stats.hits + b.stats.misses;
      if (bClosed !== aClosed) return bClosed - aClosed;
      if (b.stats.picks !== a.stats.picks) return b.stats.picks - a.stats.picks;
      return a.handle.localeCompare(b.handle);
    })
    .map((m, i) => ({
      rank: i + 1,
      handle: m.handle,
      archetype: m.archetype,
      hits: m.stats.hits,
      pending: m.stats.pending,
      hit_rate_pct: m.stats.hit_rate_pct,
      profile_url: m.profile_url,
    }));

  const totalPicks = members.reduce((s, m) => s + m.stats.picks, 0);
  const totalHits = members.reduce((s, m) => s + m.stats.hits, 0);
  const totalClosed = members.reduce(
    (s, m) => s + m.stats.hits + m.stats.misses,
    0,
  );

  const body = {
    schema: "https://signals.gitdealflow.com/api/v1/members.json",
    version: "1.0.0",
    license: "https://creativecommons.org/licenses/by/4.0/",
    cohort: {
      name: "Charter Cohort 2026",
      total_seats: CHARTER_COHORT_TOTAL_SEATS,
      seats_claimed: claimed,
      seats_open: remaining,
      hub_url: `${SITE}/members`,
      leaderboard_url: `${SITE}/members/leaderboard`,
      apply_url: `${SITE}/members/join`,
      anonymity_rule:
        "Pseudonymous handles welcome under the same rule as @thedatanerd. Real name never required.",
    },
    aggregate: {
      total_picks: totalPicks,
      total_hits: totalHits,
      total_closed_windows: totalClosed,
      cohort_hit_rate_pct:
        totalClosed > 0 ? Math.round((totalHits / totalClosed) * 100) : null,
    },
    members,
    leaderboard,
    grading_rules: {
      hit:
        "Public fundraise OR 4× sustained commit-velocity vs baseline within 60 or 90 days of pick.",
      miss:
        "No fundraise AND velocity reverted to baseline by the 90-day window close.",
      pending:
        "Both windows still open. We never adjust a Hit retroactively after the 60d mark.",
    },
    last_modified: new Date().toISOString().slice(0, 10),
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
      Link: `<${SITE}/members>; rel="canonical"`,
    },
  });
}
