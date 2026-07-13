import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { isNonceUsed, markNonceUsed } from "@/lib/runtime-cache";
import { isExcluded } from "@/lib/excluded-emails";
import { pickAudienceId } from "@/lib/resend-audience";

// Sector pre-capture endpoint — Brunson DotCom Secrets Ch 13 ("Best Bait")
// reactivation lever. The /firstlook page asks "which sector?" *before*
// checkout. Capturing it here:
//   1. fills a list segmented by sector even when the visitor doesn't pay,
//      so we can warm them up with sector-specific content later;
//   2. lets the founder pre-build the panel cache when a visitor commits
//      to a sector (engine warms, 24h SLA holds even on Friday);
//   3. routes Stripe checkout with the sector pre-filled in metadata, so
//      the buyer doesn't re-enter on the next page.
//
// Runtime: Node.js Fluid Compute (default). Uses next/server `after()` to
// fire the admin notification post-response so the visitor's POST returns
// in <100ms regardless of Resend latency.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const ADMIN_EMAIL = "signals@gitdealflow.com";

// 19 tracked sectors as of 2026-05. Match the firstlook welcome email
// (lib emails.ts firstLookWelcomeEmail) so the sector key is shared.
const VALID_SECTORS = new Set([
  "ai-ml",
  "ai-infra",
  "ai-safety",
  "climate-tech",
  "crypto-web3",
  "cybersecurity",
  "data-infra",
  "dev-tools",
  "edtech",
  "fintech-rails",
  "future-of-work",
  "gaming",
  "healthtech",
  "identity",
  "observability",
  "open-source-tooling",
  "robotics",
  "saas-infra",
  "vertical-ai",
]);

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SECTOR_RX = /^[a-z0-9-]{2,40}$/;

const INTENT_NAMESPACE = "firstlook-intent";
const INTENT_TTL_SECONDS = 7 * 86_400;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function notifyAdmin(email: string, sector: string, source: string) {
  if (!RESEND_API_KEY) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `First Look intent — ${sector} (${email})`,
        html: `<p><strong>New First Look sector intent</strong></p>
<p>Email: ${escapeHtml(email)}</p>
<p>Sector: ${escapeHtml(sector)}</p>
<p>Source: ${escapeHtml(source)}</p>
<p>Time: ${new Date().toISOString()}</p>
<p>Pre-warm the panel for this sector — the visitor may convert at checkout in the next 30 minutes.</p>`,
      }),
    });
  } catch (err) {
    console.error("[firstlook-intent] admin notify failed:", err);
  }
}

/**
 * Add the intent-capture email to the Resend audience with source
 * attribution (packed into first_name, gdf-attr-v1 bridge) so non-buyers
 * still receive future digests/broadcasts. On already-exists, PATCH
 * unsubscribed:false to re-activate. Best-effort.
 */
async function addToAudience(email: string, sector: string) {
  if (!RESEND_API_KEY || isExcluded(email)) return;
  try {
    const audRes = await fetch("https://api.resend.com/audiences", {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (!audRes.ok) return;
    const audiences = await audRes.json();
    const audienceId: string | undefined = pickAudienceId(audiences);
    if (!audienceId) return;
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          first_name:
            "gdf-attr-v1:" +
            JSON.stringify({ source: "firstlook-intent", utm_campaign: sector }),
          unsubscribed: false,
        }),
      },
    );
    if (!res.ok) {
      await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ unsubscribed: false }),
        },
      );
    }
  } catch (err) {
    console.error("[firstlook-intent] audience-add failed:", err);
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const { email, sector, source } = (body || {}) as {
    email?: unknown;
    sector?: unknown;
    source?: unknown;
  };

  if (typeof email !== "string" || !EMAIL_RX.test(email) || email.length > 200) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }
  if (
    typeof sector !== "string" ||
    !SECTOR_RX.test(sector) ||
    !VALID_SECTORS.has(sector)
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_sector" },
      { status: 400 },
    );
  }

  const sourceStr =
    typeof source === "string" && source.length > 0 && source.length < 80
      ? source
      : "firstlook-page";

  // De-dup: same email × sector inside 7 days = single intent record. Keeps
  // the admin inbox quiet when a visitor reloads or double-submits while
  // weighing the cart. Cache miss = fresh intent → notify; hit = silently
  // ack with replay flag.
  const nonce = `${email.toLowerCase()}::${sector}`;
  if (await isNonceUsed(INTENT_NAMESPACE, nonce)) {
    return NextResponse.json({ ok: true, replay: true });
  }
  await markNonceUsed(INTENT_NAMESPACE, nonce, INTENT_TTL_SECONDS);

  // Defer the admin notification + audience-add so the response returns
  // immediately. The visitor sees "captured" inside one round-trip; Resend
  // can take its time. `after()` runs post-response on Vercel Fluid Compute.
  after(async () => {
    await notifyAdmin(email, sector, sourceStr);
    await addToAudience(email.toLowerCase(), sector);
  });

  return NextResponse.json({
    ok: true,
    sector,
    next: "/firstlook#cart",
    message:
      "Sector locked. Continue to checkout — your sector is pre-tagged on the order.",
  });
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/firstlook/intent",
    method: "POST",
    body: {
      email: "string (valid email)",
      sector: `one of ${Array.from(VALID_SECTORS).join(", ")}`,
      source: "string (optional, ≤80 chars)",
    },
    description:
      "Pre-capture a sector intent before checkout. De-duped per email × sector for 7 days.",
  });
}
