/**
 * Stadium Pitch, drop schedule + phase computation.
 *
 * Brunson Expert Secrets §1 Ch 20 (Stadium Pitch / Mass Movement). The 2026-05-09
 * Russell-Brunson V11 audit scored this chapter 88/100 with the note: "the
 * monthly written address has the content but lacks the event." The fix is to
 * wrap the existing /state-of-github page in moment mechanics, countdown to
 * next drop, RSVP for the email at drop time, .ics calendar invite, and a
 * 48-hour live window after each drop.
 *
 * Pure functions (no I/O). Used by the (server-component) page to compute the
 * fallback phase, and by the (client-component) StadiumPitchHero to do the
 * realtime ticker.
 */

/** First Wednesday of every month at 09:00 UTC. The Brunson cadence. */
export const DROP_HOUR_UTC = 9;
export const DROP_DAY_OF_WEEK = 3; // 0=Sun, 1=Mon, 2=Tue, 3=Wed

/**
 * 48-hour live window after each drop. During this window the just-published
 * address reads as "LIVE NOW". After the window the page enters "REPLAY"
 * mode and the countdown re-anchors to the next month's drop.
 */
export const LIVE_WINDOW_MS = 48 * 60 * 60 * 1000;

/** ISO offset constants, not exported; only used internally. */
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Returns the first Wednesday of the given (year, monthZeroIdx) at 09:00 UTC.
 * Internal helper.
 */
function firstWednesdayOfMonth(year: number, monthZeroIdx: number): Date {
  // Day 1 at 09:00 UTC.
  const firstOfMonth = new Date(
    Date.UTC(year, monthZeroIdx, 1, DROP_HOUR_UTC, 0, 0, 0),
  );
  const dow = firstOfMonth.getUTCDay();
  // Days to add to reach Wednesday. (3 - dow + 7) % 7. If already Wed, 0.
  const offset = (DROP_DAY_OF_WEEK - dow + 7) % 7;
  return new Date(firstOfMonth.getTime() + offset * ONE_DAY_MS);
}

/**
 * Returns the next Stadium Pitch drop time strictly after `from`.
 *
 * If `from` is before this month's first Wednesday at 09:00 UTC, returns
 * this month's drop. Otherwise returns next month's drop.
 */
export function getNextDropTime(from: Date = new Date()): Date {
  const year = from.getUTCFullYear();
  const month = from.getUTCMonth();
  const thisMonthDrop = firstWednesdayOfMonth(year, month);
  if (thisMonthDrop.getTime() > from.getTime()) {
    return thisMonthDrop;
  }
  // This month's drop already passed. Next month.
  return firstWednesdayOfMonth(year, month + 1);
}

/**
 * Returns the most recent past Stadium Pitch drop time (i.e. the
 * "current" published address's nominal drop). If `from` is before this
 * month's first Wednesday, this returns last month's drop. Otherwise this
 * month's. Used to compute whether we're inside the 48h live window.
 */
export function getMostRecentDropTime(from: Date = new Date()): Date {
  const year = from.getUTCFullYear();
  const month = from.getUTCMonth();
  const thisMonthDrop = firstWednesdayOfMonth(year, month);
  if (thisMonthDrop.getTime() <= from.getTime()) {
    return thisMonthDrop;
  }
  // This month's drop hasn't happened yet. Most recent is last month.
  return firstWednesdayOfMonth(year, month - 1);
}

export type StadiumPhase = "live" | "replay";

/**
 * Drop-window phase relative to the most recent address.
 *
 * - "live"  , within LIVE_WINDOW_MS of the most recent published drop.
 *              The page should banner "JUST DROPPED" with a countdown to
 *              the end of the live window.
 * - "replay", outside the live window. The page should banner "REPLAY"
 *              and re-anchor the countdown to the next drop.
 *
 * Returns the phase plus the next "transition" time (end of live window
 * for "live", next drop for "replay") so the caller can render a single
 * countdown.
 */
export function getStadiumPhase(
  now: Date = new Date(),
  latestPublishDate?: string,
): {
  phase: StadiumPhase;
  /** Milliseconds until the next phase transition. Always >= 0. */
  msToTransition: number;
  /** ISO of the most recent drop the latest address represents. */
  recentDropIso: string;
  /** ISO of the next drop. */
  nextDropIso: string;
} {
  const nowMs = now.getTime();

  // Anchor "most recent drop" on the page-supplied publishDate when present
  //, this matches the address actually rendered in the article body, even
  // if the in-content drop date drifts slightly off the canonical first-Wed
  // schedule for a given month.
  const recentDrop = latestPublishDate
    ? new Date(`${latestPublishDate}T${pad2(DROP_HOUR_UTC)}:00:00.000Z`)
    : getMostRecentDropTime(now);
  const recentDropMs = recentDrop.getTime();
  const liveWindowEndMs = recentDropMs + LIVE_WINDOW_MS;

  const nextDrop = getNextDropTime(now);

  if (nowMs >= recentDropMs && nowMs < liveWindowEndMs) {
    return {
      phase: "live",
      msToTransition: liveWindowEndMs - nowMs,
      recentDropIso: recentDrop.toISOString(),
      nextDropIso: nextDrop.toISOString(),
    };
  }
  return {
    phase: "replay",
    msToTransition: Math.max(0, nextDrop.getTime() - nowMs),
    recentDropIso: recentDrop.toISOString(),
    nextDropIso: nextDrop.toISOString(),
  };
}

/** Format an ISO date string into a "Month YYYY" label, e.g. "June 2026". */
export function formatMonthLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Format a duration (ms) as a deconstructed { days, hours, minutes, seconds }. */
export function deconstructDuration(ms: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds };
}

/** zero-pad to 2 digits. */
function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Reminder schedule relative to a drop time. Each entry is a "lead time
 * before the drop" plus the kind (which the email-builder uses to pick the
 * right copy). Order is irrelevant, caller skips any whose computed sendAt
 * is in the past.
 */
export interface ReminderSlot {
  kind: "save-the-date" | "one-hour" | "live";
  /** Milliseconds before drop. 0 = at drop time. */
  leadMs: number;
  /** Human-friendly label, included in the API response for transparency. */
  label: string;
}

export const REMINDER_SLOTS: readonly ReminderSlot[] = [
  { kind: "save-the-date", leadMs: 24 * 60 * 60 * 1000, label: "T-24 hours" },
  { kind: "one-hour", leadMs: 60 * 60 * 1000, label: "T-1 hour" },
  { kind: "live", leadMs: 0, label: "T-0 (drop)" },
] as const;

/**
 * For a given drop time and "now", returns the reminders that are still in
 * the future (with a 5-minute buffer so we don't try to schedule something
 * that's about to land before Resend processes it).
 */
export function getActiveReminders(
  dropTime: Date,
  now: Date = new Date(),
): { sendAtIso: string; kind: ReminderSlot["kind"]; label: string }[] {
  const dropMs = dropTime.getTime();
  const nowMs = now.getTime();
  const BUFFER_MS = 5 * 60 * 1000;

  return REMINDER_SLOTS.flatMap((slot) => {
    const sendAt = dropMs - slot.leadMs;
    if (sendAt < nowMs + BUFFER_MS) return [];
    return [
      {
        sendAtIso: new Date(sendAt).toISOString(),
        kind: slot.kind,
        label: slot.label,
      },
    ];
  });
}

/**
 * Format a drop time for human display, UTC. e.g. "Wed 03 Jun 2026 · 09:00 UTC".
 */
export function formatDropTimeUtc(d: Date): string {
  const dow = d.toLocaleString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
  const day = d.toLocaleString("en-US", { day: "2-digit", timeZone: "UTC" });
  const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const year = d.getUTCFullYear();
  return `${dow} ${day} ${mon} ${year} · ${pad2(d.getUTCHours())}:${pad2(
    d.getUTCMinutes(),
  )} UTC`;
}
