/**
 * Manual pause switches (Maryan 2026-11-03 11:08 Athens): the soap-2026-11
 * welcome sequence and Pre-Round Report sales stay paused until the signal
 * data is actually refreshed. Undo: set both to false, deploy, then run
 * GET /api/cron/soap-pause-sweep?resume=1 (re-times held scheduled emails).
 * The data-freshness gates stay on independently of these flags.
 */
export const SOAP_2026_11_PAUSED = true;
export const PRE_ROUND_PAUSED = true;
