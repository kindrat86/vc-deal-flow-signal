import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";
import { generateToken } from "@/lib/verify-token";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";

const VERIFY_BASE_URL =
  process.env.VERIFY_BASE_URL || "https://signals.gitdealflow.com";

function verificationEmailHtml(verifyUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Your report is ready.</p>
<p>Click the button below to confirm your email and get instant access to <strong>This Week's Top 5 Breakout Startups</strong> — with real GitHub acceleration data on the fastest-moving companies right now.</p>
<div style="text-align:center;margin:32px 0;">
<a href="${verifyUrl}" style="display:inline-block;background:#0284c7;color:#ffffff;font-weight:600;font-size:16px;padding:14px 32px;border-radius:8px;text-decoration:none;">Get the Report</a>
</div>
<p style="color:#64748b;font-size:14px;">After you confirm, you'll also start receiving weekly signal updates — the top startups showing unusual engineering acceleration. No spam, unsubscribe anytime.</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You're receiving this because you entered your email at <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
<p>If you didn't sign up, you can safely ignore this email.</p>
</div>
</div>
</body>
</html>`;
}

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

  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`subscribe:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { ...headers, ...rateLimitHeaders(rl) } },
    );
  }

  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400, headers },
      );
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500, headers },
      );
    }

    // Build verification URL
    const token = generateToken(email);
    const verifyUrl = `${VERIFY_BASE_URL}/api/verify?email=${encodeURIComponent(email)}&token=${token}`;

    // Send verification email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject: "Confirm your email — your report is ready",
        html: verificationEmailHtml(verifyUrl),
        headers: {
          "List-Unsubscribe": `<mailto:${FROM_EMAIL}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Failed to send verification email:", errText);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500, headers },
      );
    }

    return NextResponse.json(
      { ok: true, verify: true, message: "Check your email" },
      { headers },
    );
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500, headers },
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
