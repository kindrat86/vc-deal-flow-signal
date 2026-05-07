/**
 * Excluded email addresses — never send subscriber-facing mail to these.
 *
 * Mirror of pseo-site/lib/excluded-emails.ts. Keep both in sync.
 *
 * sales@sipiteno.com intentionally NOT excluded — kept as a live QA inbox so the
 * founder receives every production send and can spot regressions in real time.
 */

export const TESTER_EMAILS = new Set([
  "test@example.com",
  "mkondratyuk86@gmail.com",
  "maryan.kondratyuk@quickstarter.ai",
  "signal@gitdealflow.com",
  "escape@invisibleexit.com",
]);

export const BOT_EMAILS = new Set([
  "jakub@mailinator.com",
  "probe1777473122350@deltajohnsons.com",
  "shannon-pool-1777015174929-94zulc@deltajohnsons.com",
]);

export const EXCLUDED_EMAILS = new Set([...TESTER_EMAILS, ...BOT_EMAILS]);

export function isExcluded(email) {
  if (!email) return false;
  return EXCLUDED_EMAILS.has(String(email).trim().toLowerCase());
}
