/**
 * Manual pause switches (Maryan 2026-11-03 11:08 Athens): the soap-2026-11
 * welcome sequence and Pre-Round Report sales stay paused until the signal
 * data is actually refreshed. Undo: set both to false, deploy, then run
 * GET /api/cron/soap-pause-sweep?resume=1 (re-times held scheduled emails).
 * The data-freshness gates stay on independently of these flags.
 */
export const SOAP_2026_11_PAUSED = false; // unpaused 2026-11-03 12:01 (Maryan так)
export const PRE_ROUND_PAUSED = false; // unpaused 2026-11-03 12:01 (Maryan так)

/**
 * Release plan for emails the sweep parked (+29 d) during the pause.
 * "off": nothing; "dry": the daily/manual sweep only logs the plan;
 * "apply": re-time / replace them per the plan in soap-pause-sweep.
 * Triggered with `vercel crons run /api/cron/soap-pause-sweep` (no secret in hand).
 */
export const SOAP_RESUME_MODE: "off" | "dry" | "apply" = "apply"; // idempotent: only touches emails parked > 20 d out

/**
 * Re-enroll queue shift (days) per subscriber, keyed by sha256(lowercase email)
 * so no address enters git. A re-enroll step parked during the pause is
 * cancelled and the subscriber's whole schedule moves later by this many
 * days, so /api/cron/welcome-reenroll re-sends that step (corrected text) and
 * every later step keeps its spacing: no lost steps, max one per day.
 */
export const REENROLL_SHIFT_DAYS: Record<string, number> = {};
