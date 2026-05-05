/**
 * One-off recovery: re-schedule soap-opera emails that failed during /api/verify.
 *
 * Run: `RESEND_API_KEY=... VERIFY_ANCHOR_UTC=2026-04-20T16:30:28.55Z \
 *        RECIPIENT=user@example.com INDICES=3,4 \
 *        npx tsx scripts/recover-missing-soap-opera.ts`
 *
 * INDICES is a comma-separated list of SOAP_OPERA_EMAILS indices (0-based)
 * to re-schedule. Each email's scheduled_at is derived from the anchor + its
 * own delayMs, so re-runs are idempotent per index.
 */
import { SOAP_OPERA_EMAILS } from "../lib/emails";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const RECIPIENT = process.env.RECIPIENT;
const ANCHOR = process.env.VERIFY_ANCHOR_UTC;
const INDICES = (process.env.INDICES || "")
  .split(",")
  .map((s) => Number.parseInt(s.trim(), 10))
  .filter((n) => Number.isInteger(n));

if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY required");
if (!RECIPIENT) throw new Error("RECIPIENT required");
if (!ANCHOR) throw new Error("VERIFY_ANCHOR_UTC required (ISO string)");
if (INDICES.length === 0) throw new Error("INDICES required (e.g. 3,4)");

async function main() {
  const anchorMs = new Date(ANCHOR!).getTime();
  if (!Number.isFinite(anchorMs)) throw new Error(`Bad anchor: ${ANCHOR}`);

  for (const idx of INDICES) {
    const email = SOAP_OPERA_EMAILS[idx];
    if (!email) {
      console.error(`skip: no email at index ${idx}`);
      continue;
    }
    const scheduledAt = new Date(anchorMs + email.delayMs).toISOString();
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: RECIPIENT,
        subject: email.subject,
        html: email.html,
        scheduled_at: scheduledAt,
        headers: {
          "List-Unsubscribe": `<mailto:${FROM_EMAIL}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });
    const body = await res.text();
    console.log(
      `[idx=${idx}] scheduled_at=${scheduledAt} status=${res.status} body=${body.slice(0, 200)}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
