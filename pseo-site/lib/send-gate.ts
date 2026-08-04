/**
 * Shared cross-system send gate — at most ONE marketing email per recipient
 * per calendar day, across every independent sender in the portfolio.
 *
 * Why this exists: this app's drip crons, the Hermes drip engine on the Mac
 * Mini, the Node sequence sender and sanctionsai all mail the same people but
 * each only tracks its own state. A 14-day audit found real subscribers
 * receiving 3-4 emails in a day. The gate is the one place that sees them all.
 *
 * Backed by a UNIQUE index on `<email>|<YYYY-MM-DD>` in the `send_gate`
 * PocketBase collection, so the claim is atomic — two systems racing cannot
 * both win. Served by email-engine's /api/gate.
 *
 * TRANSACTIONAL MAIL MUST NOT CALL THIS. Signup/confirm, password resets,
 * receipts and lead notifications are exempt and always send.
 */

const GATE_URL = process.env.GATE_URL;
const GATE_SECRET = process.env.GATE_SECRET;

/**
 * Claim `email`'s single marketing slot for `day` (default: today UTC).
 *
 * Fails CLOSED when a gate is configured but unreachable — a skipped marketing
 * send is recoverable, a duplicate blast is not. When no gate is configured the
 * caller keeps its previous behaviour so local/dry runs still work.
 */
export async function gateAllows(
  email: string,
  sender: string,
  day?: string,
): Promise<boolean> {
  if (!GATE_URL || !GATE_SECRET) return true;
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
    return data?.allowed === true;
  } catch (err) {
    console.warn(`[send-gate] unreachable for ${email} — skipping (fail-closed)`, err);
    return false;
  }
}
