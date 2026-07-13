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

/** Tokenized one-click unsubscribe URL for a recipient, or null without VERIFY_SECRET. */
export function unsubscribeUrl(email: string): string | null {
  try {
    const { token } = signVerifyToken({
      email,
      purpose: "unsubscribe",
      ttlSeconds: UNSUBSCRIBE_TTL_SECONDS,
    });
    return `${SITE_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`;
  } catch {
    return null;
  }
}

// Matches the footer anchor every template carries: a mailto to the sender
// whose text mentions unsubscribe (e.g. "Reply to unsubscribe").
const MAILTO_UNSUB_ANCHOR =
  /<a\s+href="mailto:signals?@gitdealflow\.com[^"]*"([^>]*)>([^<]*nsubscribe[^<]*)<\/a>/gi;

/**
 * Replace the visible "Reply to unsubscribe" mailto anchor with a
 * per-recipient one-click link (keeping the original inline style). If the
 * template has no such anchor, append a minimal footer line. Degrades to
 * the original html when VERIFY_SECRET is missing.
 */
export function injectUnsubscribeLink(html: string, email: string): string {
  const url = unsubscribeUrl(email);
  if (!url) return html;
  let replaced = false;
  const out = html.replace(MAILTO_UNSUB_ANCHOR, (_m, attrs: string) => {
    replaced = true;
    return `<a href="${url}"${attrs}>Unsubscribe in one click</a>`;
  });
  if (replaced) return out;
  const footer = `<p style="font-size:12px;color:#94a3b8;margin-top:24px;"><a href="${url}" style="color:#94a3b8;">Unsubscribe in one click</a></p>`;
  return out.includes("</body>")
    ? out.replace("</body>", `${footer}</body>`)
    : out + footer;
}

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
