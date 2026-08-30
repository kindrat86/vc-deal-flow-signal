/**
 * Shared cross-system send gate, at most ONE marketing email per recipient
 * per calendar day, across every independent sender in the portfolio.
 *
 * Why this exists: this app's drip crons, the Hermes drip engine on the Mac
 * Mini, the Node sequence sender and sanctionsai all mail the same people but
 * each only tracks its own state. A 14-day audit found real subscribers
 * receiving 3-4 emails in a day. The gate is the one place that sees them all.
 *
 * Backed by a UNIQUE index on `<email>|<YYYY-MM-DD>` in the `send_gate`
 * PocketBase collection, so the claim is atomic, two systems racing cannot
 * both win. Served by email-engine's /api/gate.
 *
 * TRANSACTIONAL MAIL MUST NOT CALL THIS. Signup/confirm, password resets,
 * receipts and lead notifications are exempt and always send.
 */

import { createHash } from "node:crypto";

const GATE_URL = process.env.GATE_URL;
const GATE_SECRET = process.env.GATE_SECRET;

export function recipientRef(email: string): string {
  const normalized = email.trim().toLowerCase();
  return createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}

/**
 * Claim `email`'s single marketing slot for `day` (default: today UTC).
 *
 * Fails CLOSED in production when the gate is missing or unreachable. A skipped
 * marketing send is recoverable, a duplicate blast is not. Local development
 * can still run without the remote gate.
 */
export async function gateAllows(
  email: string,
  sender: string,
  day?: string,
): Promise<boolean> {
  if (!GATE_URL || !GATE_SECRET) return process.env.NODE_ENV !== "production";
  try {
    const res = await fetch(GATE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GATE_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, sender, ...(day ? { day } : {}) }),
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    return res.ok && data?.allowed === true;
  } catch (err) {
    console.warn(
      `[send-gate] unreachable for recipient_ref=${recipientRef(email)}, skipping (fail-closed)`,
      err,
    );
    return false;
  }
}
