import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const PB_WEBHOOK_SECRET = process.env.PB_WEBHOOK_SECRET || "";

// Welcome email HTML (Soap Opera #1)
const WELCOME_SUBJECT = "The deal flow signal hiding in plain sight";
const WELCOME_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Welcome to VC Deal Flow Signal.</p>
<p>I want to tell you why I built this, because it starts with a mistake I kept making.</p>
<p>I was tracking a small fintech startup. Nothing special on the surface. No press, no AngelList buzz, no warm intros circulating. But their GitHub told a different story.</p>
<p>In two weeks, their commit velocity tripled. Four new contributors joined. They spun up three new infrastructure repos.</p>
<p>I flagged it in my notes.</p>
<p>Three weeks later, they announced a $4M Series A led by a top-tier fund.</p>
<p>The investors who got in had seen something I missed. Or maybe they just knew someone. That's when it clicked: the signal was right there in the commit graph the whole time. Public. Free. Updating in real time.</p>
<p>Nobody was reading it.</p>
<p>So I built a system that does.</p>
<p>Every month, I'll send you the top startups showing unusual engineering acceleration. Commit velocity spikes, contributor surges, new infrastructure repos. The patterns that precede fundraises, product launches, and breakout moments.</p>
<p>Tomorrow, I want to challenge something you probably believe about your current deal flow.</p>
<p>Talk soon,<br>The Data Nerd</p>
<p style="color:#64748b;font-size:14px;">P.S. If you want the full picture (50+ startups, filters, enrichment), the Pro dashboard is EUR 9.97/mo. But the free digest is a great place to start.</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You're receiving this because you signed up at <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
<p><a href="https://gitdealflow.com" style="color:#0ea5e9;">Visit Dashboard</a> · <a href="mailto:signal@gitdealflow.com" style="color:#0ea5e9;">Reply to unsubscribe</a></p>
</div>
</div>
</body>
</html>`;

export async function POST(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowed = [
    "https://gitdealflow.com",
    "https://www.gitdealflow.com",
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:8080"] : []),
  ];

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }

  // CSRF: reject requests from disallowed origins
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });
  }

  // Rate limit: 5 requests per minute per IP
  const ip = getClientIp(request);
  const rl = checkRateLimit(`subscribe:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { ...headers, ...rateLimitHeaders(rl) } }
    );
  }

  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400, headers });
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500, headers });
    }

    // 1. Add to Resend audience
    const audienceRes = await fetch("https://api.resend.com/audiences", {
      method: "GET",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (!audienceRes.ok) {
      console.error("Failed to fetch audiences:", await audienceRes.text());
      return NextResponse.json({ error: "Email service error" }, { status: 500, headers });
    }
    const audiences = await audienceRes.json();
    let audienceId = audiences.data?.[0]?.id;

    // Create audience if none exists
    if (!audienceId) {
      const createRes = await fetch("https://api.resend.com/audiences", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "VC Deal Flow Signal" }),
      });
      const created = await createRes.json();
      audienceId = created.id;
    }

    // Add contact
    const contactRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name: body.name || "",
        unsubscribed: false,
      }),
    });
    if (!contactRes.ok) {
      console.error("Failed to add contact:", await contactRes.text());
    }

    // 2. Send welcome email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject: WELCOME_SUBJECT,
        html: WELCOME_HTML,
        headers: {
          "List-Unsubscribe": `<mailto:${FROM_EMAIL}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });
    if (!emailRes.ok) {
      console.error("Failed to send welcome email:", await emailRes.text());
    }

    // 3. Notify local Pocketbase (fire and forget, won't fail if unreachable)
    if (PB_WEBHOOK_SECRET) {
      fetch(process.env.PB_WEBHOOK_URL || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PB_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify({ email, source: "landing-page", tier: "free" }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, message: "Subscribed" }, { headers });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowed = [
    "https://gitdealflow.com",
    "https://www.gitdealflow.com",
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:8080"] : []),
  ];

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : "",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
