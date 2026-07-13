import "server-only";

import { signVerifyToken } from "@/lib/verify-token";

/**
 * RFC 8058 List-Unsubscribe headers — shared helper.
 *
 * Every subscriber-facing send should carry BOTH forms:
 *   1. HTTPS one-click:  <https://signals.gitdealflow.com/api/unsubscribe?token=...>
 *      — a v2 signed token (purpose "unsubscribe", ~10y TTL) that
 *      /api/unsubscribe verifies before flipping the Resend contact to
 *      unsubscribed:true. Gmail/Apple Mail POST to this URL on the
 *      "Unsubscribe" button, per List-Unsubscribe-Post: One-Click.
 *   2. mailto: fallback for clients that don't do one-click.
 *
 * Mirrors the header shape already emitted by email-api/send-weekly-digest.mjs
 * (`unsubHeaders`). If VERIFY_SECRET is missing, degrades to mailto-only so a
 * misconfigured env never blocks a send.
 */

const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const SITE_URL = process.env.SITE_URL || "https://signals.gitdealflow.com";

// ~10 years — an unsubscribe link must not expire in any practical timeframe.
const UNSUBSCRIBE_TTL_SECONDS = 10 * 365 * 86_400;

export function listUnsubscribeHeaders(email: string): Record<string, string> {
  const mailto = `<mailto:${FROM_EMAIL}?subject=unsubscribe>`;
  let listUnsubscribe = mailto;
  try {
    const { token } = signVerifyToken({
      email,
      purpose: "unsubscribe",
      ttlSeconds: UNSUBSCRIBE_TTL_SECONDS,
    });
    listUnsubscribe = `<${SITE_URL}/api/unsubscribe?token=${encodeURIComponent(token)}>, ${mailto}`;
  } catch {
    // VERIFY_SECRET not set — degrade to mailto-only rather than fail the send.
  }
  return {
    "List-Unsubscribe": listUnsubscribe,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
