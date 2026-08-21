import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isAllowedOrigin, isValidEmail } from "@/lib/validation";
import { isNonceUsed, markNonceUsed } from "@/lib/runtime-cache";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const TO_EMAIL = "signals@gitdealflow.com";
const INTAKE_NAMESPACE = "signal-desk-pilot-intake";
const INTAKE_TTL_SECONDS = 90 * 86_400;
const SESSION_RX = /^cs_(test_|live_)?[a-zA-Z0-9]+$/;
const INVESTOR_TYPES = new Set(["solo_gp", "scout", "seed_fund", "angel", "other"]);
const ALLOWED_SECTORS = new Set([
  "AI/ML", "AI infrastructure", "Climate tech", "Cybersecurity", "Data infrastructure",
  "Developer tools", "Fintech", "Healthtech", "Robotics", "SaaS infrastructure", "Vertical AI",
]);

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max).trim() : "";
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function intakeEmailHtml(fields: { name: string; email: string; investorType: string; sectors: string[]; deliveryEmail: string; note: string; sessionId: string }) {
  const f = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value.map(escapeHtml).join(", ") : escapeHtml(value)]));
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.6"><h1>Signal Desk pilot intake</h1><p><strong>Paid status:</strong> verified server-side with Stripe</p><p><strong>Name:</strong> ${f.name}</p><p><strong>Email:</strong> <a href="mailto:${f.email}">${f.email}</a></p><p><strong>Investor type:</strong> ${f.investorType}</p><p><strong>Sectors:</strong> ${f.sectors}</p><p><strong>Monday delivery email:</strong> <a href="mailto:${f.deliveryEmail}">${f.deliveryEmail}</a></p><p><strong>Workflow note:</strong><br>${f.note || "none"}</p><p><strong>Stripe checkout:</strong> ${f.sessionId}</p><p><strong>Manual fulfillment:</strong> prepare the first Monday issue after review. Pilot runs 30 days. €250 credit applies toward €490 annual Dashboard if the buyer continues.</p></body></html>`;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`signal-desk-intake:${ip}`, 3, 3_600_000);
  if (!rateLimit.allowed) return NextResponse.json({ error: "Too many intake attempts. Please email signals@gitdealflow.com." }, { status: 429, headers: rateLimitHeaders(rateLimit) });

  try {
    const raw = await request.json() as Record<string, unknown>;
    const checkoutSessionId = clip(raw.checkout_session_id, 200);
    const name = clip(raw.name, 120);
    const email = clip(raw.email, 200).toLowerCase();
    const investorType = clip(raw.investor_type, 40);
    const sectors = Array.isArray(raw.sectors) ? raw.sectors.map((value) => clip(value, 80)).filter(Boolean).slice(0, 11) : [];
    const preferredDeliveryEmail = clip(raw.preferred_delivery_email, 200).toLowerCase();
    const note = clip(raw.note, 1000);

    if (!checkoutSessionId || !SESSION_RX.test(checkoutSessionId)) return NextResponse.json({ error: "Invalid checkout reference." }, { status: 400 });
    if (!name || !isValidEmail(email) || !isValidEmail(preferredDeliveryEmail)) return NextResponse.json({ error: "Enter a name and valid email addresses." }, { status: 400 });
    if (!INVESTOR_TYPES.has(investorType)) return NextResponse.json({ error: "Choose an investor type." }, { status: 400 });
    if (sectors.length === 0 || sectors.some((sector) => !ALLOWED_SECTORS.has(sector))) return NextResponse.json({ error: "Choose at least one sector." }, { status: 400 });
    if (!RESEND_API_KEY) return NextResponse.json({ error: "Intake email is not configured." }, { status: 500 });
    if (await isNonceUsed(INTAKE_NAMESPACE, checkoutSessionId)) return NextResponse.json({ error: "This pilot intake was already received." }, { status: 409 });

    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    if (session.payment_status !== "paid") return NextResponse.json({ error: "Stripe has not confirmed payment for this checkout." }, { status: 403 });
    if (session.metadata?.offer !== "signal_desk_pilot") return NextResponse.json({ error: "This checkout is not a Signal Desk pilot." }, { status: 403 });
    if (session.amount_total !== 25000 || session.currency !== "eur") return NextResponse.json({ error: "The checkout amount does not match the Signal Desk pilot." }, { status: 403 });

    const html = intakeEmailHtml({ name, email, investorType, sectors, deliveryEmail: preferredDeliveryEmail, note, sessionId: session.id });
    const internal = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to: TO_EMAIL, bcc: "sales@sipiteno.com", reply_to: preferredDeliveryEmail, subject: `[Signal Desk Pilot] ${name}, ${investorType}`, html }),
    });
    if (!internal.ok) return NextResponse.json({ error: "We could not deliver your intake. Please try again." }, { status: 502 });

    const receipt = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to: preferredDeliveryEmail, bcc: "sales@sipiteno.com", reply_to: TO_EMAIL, subject: "Signal Desk pilot intake received", html: `<p>Your Signal Desk intake is received.</p><p>Your first issue is prepared manually and sent on the next Monday after review.</p><p>The pilot runs for 30 days. If you continue to the annual Dashboard, the €250 is credited toward the €490 annual Dashboard.</p><p>The Data Nerd</p>` }),
    });
    if (!receipt.ok) return NextResponse.json({ error: "We could not send your confirmation. Please try again." }, { status: 502 });

    await markNonceUsed(INTAKE_NAMESPACE, checkoutSessionId, INTAKE_TTL_SECONDS);
    return NextResponse.json({ ok: true, message: "Intake received." }, { headers: rateLimitHeaders(rateLimit) });
  } catch (error) {
    console.error("signal desk intake failed", error);
    return NextResponse.json({ error: "We could not save your intake. Please try again." }, { status: 500 });
  }
}
