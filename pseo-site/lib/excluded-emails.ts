/**
 * Excluded email addresses, never send subscriber-facing mail to these.
 *
 * Two buckets, merged for the check:
 *   TESTER_EMAILS, founder + team accounts used for smoke-testing
 *   BOT_EMAILS   , disposable-inbox addresses (mailinator, etc.) verified by
 *                   crawlers rather than humans; wastes Resend credits and
 *                   pollutes open/click metrics
 *
 * Keep in sync with:
 *   - email-api/excluded-emails.mjs
 *   - monitoring/build-dashboard.py (TESTER_EMAILS + BOT_EMAILS)
 */

// sales@sipiteno.com intentionally NOT excluded, kept as a live QA inbox so the
// founder receives every production send and can spot regressions in real time.
export const TESTER_EMAILS: ReadonlySet<string> = new Set([
  "test@example.com",
  "mkondratyuk86@gmail.com",
  "maryan.kondratyuk@quickstarter.ai",
  "signals@gitdealflow.com",
  // Pre-swap sender identity (renamed signal@ → signals@ 2026-07). The old
  // self-address still exists on legacy contacts/forwards, keep BOTH excluded.
  "signal@gitdealflow.com",
  "escape@invisibleexit.com",
]);

export const BOT_EMAILS: ReadonlySet<string> = new Set([
  "jakub@mailinator.com",
  "probe1777473122350@deltajohnsons.com",
  "shannon-pool-1777015174929-94zulc@deltajohnsons.com",
]);

export const EXCLUDED_EMAILS: ReadonlySet<string> = new Set([
  ...TESTER_EMAILS,
  ...BOT_EMAILS,
]);

export function isExcluded(email: string | null | undefined): boolean {
  if (!email) return false;
  return EXCLUDED_EMAILS.has(String(email).trim().toLowerCase());
}
