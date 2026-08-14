/**
 * Signal of the Week, Telegram channel post builder.
 *
 * Renders the weekly broadcast post for the free Telegram channel from the
 * current #1 mover. Mirrors the manual template in
 * `marketing/telegram-community.md`, written in the Data Nerd voice and
 * grounded entirely in the real numbers (no hand-written hype).
 *
 * Pure + side-effect-free so it can be exercised via the cron route's
 * `?dry=1` surface. Emits Telegram `parse_mode: "HTML"`, so all interpolated
 * text is HTML-escaped at build time.
 */

import type { TopMover } from "@/lib/data";

const SITE = "https://signals.gitdealflow.com";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function clamp(s: string, max: number): string {
  const clean = s.trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export interface SignalOfTheWeekPost {
  /** Telegram-ready HTML body (parse_mode: "HTML"). */
  text: string;
  /** Org name, surfaced in logs / the route's JSON response. */
  org: string;
  sectorName: string;
  sectorSlug: string;
}

/**
 * @param mover         the week's top mover from getTopMoversThisWeek(1)
 * @param totalSectors  getAllSectors().length, keeps the "N other sectors"
 *                      count honest instead of hardcoding it.
 */
export function buildSignalOfTheWeek(
  mover: TopMover,
  totalSectors: number,
): SignalOfTheWeekPost {
  const name = escapeHtml(mover.name);
  const sectorName = escapeHtml(mover.sectorName);
  const stage = escapeHtml(mover.stage);
  const signalType = escapeHtml(mover.signalType);
  const change = escapeHtml(mover.commitVelocityChange);
  const contributorGrowth = escapeHtml(mover.contributorGrowth);
  const desc = escapeHtml(clamp(mover.description, 180));
  const otherSectors = Math.max(totalSectors - 1, 0);

  const rankingsLine =
    otherSectors > 0
      ? `Full ${sectorName} rankings and ${otherSectors} other sectors: ${SITE}/sector/${mover.sectorSlug}`
      : `Full ${sectorName} rankings: ${SITE}/sector/${mover.sectorSlug}`;

  const text = [
    `<b>📈 Signal of the Week: ${name}</b>`,
    ``,
    `<b>Sector:</b> ${sectorName}`,
    `<b>Stage:</b> ${stage}`,
    `<b>Commit velocity (14d):</b> ${mover.commitVelocity14d} (${change})`,
    `<b>Contributor growth:</b> ${mover.contributors} (${contributorGrowth})`,
    `<b>Signal type:</b> ${signalType}`,
    ``,
    `<b>What caught my eye:</b> ${desc}`,
    ``,
    // The "real base, not a small-number spike" framing reflects the
    // 30-commit floor getTopMoversThisWeek applies; the 3-6 week framing
    // matches the house copy in lib/data.ts's weekly summary.
    `The "${signalType}" pattern is firing on a real base, ${mover.commitVelocity14d} commits in 14 days, not a small-number spike. Engineering acceleration like this has historically preceded fundraise announcements by 3-6 weeks.`,
    ``,
    `🔗 GitHub: ${escapeHtml(mover.githubUrl)}`,
    ``,
    rankingsLine,
  ].join("\n");

  return {
    text,
    org: mover.name,
    sectorName: mover.sectorName,
    sectorSlug: mover.sectorSlug,
  };
}
