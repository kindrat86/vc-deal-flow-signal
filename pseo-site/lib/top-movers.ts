import "server-only";
import { getAllSectors, getCurrentPeriod, type TopMover } from "@/lib/data";
import { FRESH_DAYS, isNonStartup, isTinyBase } from "@/lib/digest-builder";

/**
 * Site-side "this week's top movers", ranked by the SAME rules as the Sunday
 * Signal Digest (lib/digest-builder.ts), so the homepage and the digest never
 * disagree about who leads (2026-11-03 honesty pass: the homepage led with
 * "heymegabyte +20250%", a jump off a near-zero prior window, while the
 * digest led with a measured mover):
 *   - orgs failing the digest startup rule (isNonStartup) are left out;
 *   - only orgs re-measured within FRESH_DAYS rank (when >= 5 exist);
 *   - tiny-base / no-baseline jumps (prior window < 5 commits, or >= +999%)
 *     are shown as "New" and rank after every measured jump.
 * The email code is not touched; this only reads its exported rules.
 */
export interface RankedMover extends TopMover {
  /** True when the change is off a zero or near-zero prior window ("New"). */
  noBaseline: boolean;
}

function pctOf(change: string): number {
  return parseInt(change.replace(/[^0-9-]/g, ""), 10) || 0;
}

export function getDigestTopMovers(limit = 3, minCommits14d = 0): RankedMover[] {
  const period = getCurrentPeriod();
  const all: RankedMover[] = [];
  for (const sector of getAllSectors()) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    for (const s of snap.startups) {
      if (s.commitVelocity14d < minCommits14d) continue;
      if (isNonStartup(s)) continue;
      const tiny = isTinyBase(s);
      all.push({
        ...s,
        sectorName: sector.name,
        sectorSlug: sector.slug,
        commitVelocityChange: tiny ? "New" : s.commitVelocityChange,
        velocityChangePct: tiny ? 0 : pctOf(s.commitVelocityChange),
        noBaseline: tiny,
      });
    }
  }
  const now = Date.now();
  const fresh = all.filter((s) => {
    const seen = (s as { lastSeen?: string }).lastSeen;
    return seen && now - Date.parse(`${seen}T00:00:00Z`) <= FRESH_DAYS * 86_400_000;
  });
  const pool = fresh.length >= 5 ? fresh : all;
  return pool
    .sort((a, b) => {
      if (a.noBaseline !== b.noBaseline) return a.noBaseline ? 1 : -1;
      return b.velocityChangePct - a.velocityChangePct;
    })
    .slice(0, limit);
}
