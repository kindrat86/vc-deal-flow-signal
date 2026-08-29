import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { parseCustomerVoice, posthogProperties, voiceEmailHtml, voiceSubject } from "@/lib/customer-voice";
import { isAllowedOrigin } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX";

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const limit = checkRateLimit(`customer-voice:${getClientIp(request)}`, 6, 3_600_000);
  if (!limit.allowed) return NextResponse.json({ error: "Please try again later." }, { status: 429, headers: rateLimitHeaders(limit) });

  const raw = await request.json().catch(() => null) as Record<string, unknown> | null;
  const parsed = parseCustomerVoice(raw?.kind, raw);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  if ("spam" in parsed) return NextResponse.json({ ok: true });

  const record = parsed.value;
  const properties = posthogProperties(record);
  const analytics = fetch("https://eu.i.posthog.com/capture/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: POSTHOG_KEY, event: "customer_voice_submitted", distinct_id: `anonymous-${crypto.randomUUID()}`, properties: { $host: "signals.gitdealflow.com", ...properties } }),
  });

  const alert = RESEND_API_KEY ? fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: "signals@gitdealflow.com",
      bcc: "sales@sipiteno.com",
      ...(record.email ? { reply_to: record.email } : {}),
      subject: voiceSubject(record),
      html: voiceEmailHtml(record),
    }),
  }) : Promise.resolve(null);

  const [analyticsResult, alertResult] = await Promise.allSettled([analytics, alert]);
  const analyticsOk = analyticsResult.status === "fulfilled" && analyticsResult.value.ok;
  const alertOk = alertResult.status === "fulfilled" && alertResult.value !== null && alertResult.value.ok;
  if (!analyticsOk && !alertOk) return NextResponse.json({ error: "Feedback service is temporarily unavailable." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
