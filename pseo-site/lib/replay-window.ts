/**
 * Brunson Live-Replay Pressure Mechanic, cohort-window calculator.
 *
 * Models the Perfect Webinar's open/close cycle as a recurring weekly cohort:
 *
 *   Mon 06:00 UTC  →  doors open. Live replay + fast-action bonuses available.
 *   Wed 23:59 UTC  →  fast-action bonuses expire. Founding rate still locked.
 *   Thu 23:59 UTC  →  cart closes. €9.97/mo founding link returns "doors closed".
 *   Fri - Sun      →  doors closed. Free Acceleration Watch signup still open.
 *   Mon 06:00 UTC  →  next cohort begins.
 *
 * Pure deterministic function, same `now` always returns the same window.
 * Server- and client-safe; no side effects, no timezone assumptions beyond UTC.
 *
 * Brunson Expert Secrets Ch 21 ("Test, Test, Test") + Ch 14 ("The Perfect
 * Webinar Hack"): the *replay window itself* is the urgency. Without a
 * deadline the Stack stops converting after the first read.
 */

export type ReplayPhase =
  | "fast-action" // Mon 06:00 UTC - Wed 23:59 UTC: bonuses + founding rate
  | "last-hours" //  Thu 00:00 UTC - Thu 23:59 UTC: bonuses gone, doors closing
  | "closed"; //     Fri 00:00 UTC - Mon 05:59 UTC: doors shut, free list only

export interface ReplayWindow {
  phase: ReplayPhase;
  /** When the current phase ends (next phase begins). */
  deadline: Date;
  /** Human-readable label for the deadline. */
  deadlineLabel: string;
  /** When the next cohort opens (Mon 06:00 UTC), same as deadline if currently closed. */
  nextOpens: Date;
  /** Stable ISO-week identifier for this cohort: e.g. "2026-W19". */
  replayId: string;
  /** Convenience flags. */
  isFastAction: boolean;
  isLastHours: boolean;
  isClosed: boolean;
}

// ISO weekday: 1=Monday … 7=Sunday.
function isoWeekday(d: Date): number {
  const day = d.getUTCDay();
  return day === 0 ? 7 : day;
}

function setUTCTime(d: Date, h: number, m: number, s: number): Date {
  const out = new Date(d);
  out.setUTCHours(h, m, s, 0);
  return out;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + n);
  return out;
}

// ISO 8601 week, used as the cohort identifier so each week is uniquely tagged.
function isoWeekId(d: Date): string {
  const date = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  // Thursday in current week decides the year.
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * Compute the replay window for a given moment. Defaults to "now" but takes
 * an explicit Date to keep the function pure and unit-testable.
 *
 * The Monday anchor is computed from the current date in UTC: we walk back
 * (weekday - 1) days from "now" to find the start of the cohort week, then
 * apply the four canonical anchor times.
 */
export function getReplayWindow(now: Date = new Date()): ReplayWindow {
  const dow = isoWeekday(now); // 1..7

  // Anchor to this week's Monday at 00:00 UTC.
  const mondayStart = setUTCTime(addDays(now, 1 - dow), 0, 0, 0);

  // Four canonical anchors of the cohort.
  const mondayOpen = setUTCTime(mondayStart, 6, 0, 0); // Mon 06:00 UTC
  const wedFastEnd = setUTCTime(addDays(mondayStart, 2), 23, 59, 0); // Wed 23:59
  const thuClose = setUTCTime(addDays(mondayStart, 3), 23, 59, 0); // Thu 23:59
  const nextMondayOpen = addDays(mondayOpen, 7);

  const t = now.getTime();
  const replayId = isoWeekId(now);

  let phase: ReplayPhase;
  let deadline: Date;
  let deadlineLabel: string;

  if (t < mondayOpen.getTime()) {
    // Sunday → Monday morning before doors open. Treated as "closed".
    phase = "closed";
    deadline = mondayOpen;
    deadlineLabel = "Doors open Monday 06:00 UTC";
  } else if (t <= wedFastEnd.getTime()) {
    phase = "fast-action";
    deadline = wedFastEnd;
    deadlineLabel = "Fast-action bonuses expire Wednesday 23:59 UTC";
  } else if (t <= thuClose.getTime()) {
    phase = "last-hours";
    deadline = thuClose;
    deadlineLabel = "Cart closes Thursday 23:59 UTC";
  } else {
    phase = "closed";
    deadline = nextMondayOpen;
    deadlineLabel = "Doors reopen Monday 06:00 UTC";
  }

  return {
    phase,
    deadline,
    deadlineLabel,
    nextOpens: phase === "closed" ? deadline : nextMondayOpen,
    replayId,
    isFastAction: phase === "fast-action",
    isLastHours: phase === "last-hours",
    isClosed: phase === "closed",
  };
}

/**
 * Server-component helper: returns a JSON-serializable snapshot suitable for
 * passing to a client component as `initialWindow`. Dates are ISO strings.
 */
export interface ReplayWindowSnapshot {
  phase: ReplayPhase;
  deadlineISO: string;
  deadlineLabel: string;
  nextOpensISO: string;
  replayId: string;
}

export function getReplayWindowSnapshot(
  now: Date = new Date(),
): ReplayWindowSnapshot {
  const w = getReplayWindow(now);
  return {
    phase: w.phase,
    deadlineISO: w.deadline.toISOString(),
    deadlineLabel: w.deadlineLabel,
    nextOpensISO: w.nextOpens.toISOString(),
    replayId: w.replayId,
  };
}
