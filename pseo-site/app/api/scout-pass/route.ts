import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";

/**
 * /api/scout-pass, Scout Pass application intake.
 *
 * Distribution Play #4 (Scout Program Infiltration): verified VC scouts get
 * free Dashboard access (€49/mo value) in exchange for carrying signals into
 * their fund partner networks. Same async-only pattern as
 * /api/charter-application, no DB write, the email IS the record.
 *
 * landing/scout-pass.html (gitdealflow.com/scout-pass) POSTs the application
 * here as JSON: { name, email, linkedin, program, angel_profile, investments,
 * funds, note, source, website (honeypot) }.
 *
 * On success:
 *   1. Emails the full application to signals@gitdealflow.com with reply_to
 *      set to the applicant (24-48h manual verification promised on page).
 *   2. Sends the applicant a confirmation email ("application received").
 *
 * Anonymity rule: pseudonymous brand, sender is The Data Nerd.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const TO_EMAIL = "signals@gitdealflow.com";

const KNOWN_PROGRAMS = new Set([
  "sequoia-scouts",
  "on-deck-catalyst",
  "atomico-angels",
  "village-global",
  "hustle-fund-angel-squad",
  "contrary-venture-partners",
  "gc-venture-fellows",
  "julian-capital-deep-checks",
  "chapter-one-scouts",
  "spearhead",
  "behind-genius-ventures",
  "independent",
  "other",
]);

function clip(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max).trim() : "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function applicationEmailHtml(fields: {
  name: string;
  email: string;
  linkedin: string;
  program: string;
  angel_profile: string;
  investments: string;
  funds: string;
  note: string;
  source: string;
  ip: string;
  ua: string;
}): string {
  const f = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, escapeHtml(v)]),
  );
  const blank = "<em style='color:#94a3b8;'>blank</em>";
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;background:#f8fafc;margin:0;padding:0;">
<div style="max-width:640px;margin:0 auto;padding:24px;">
<div style="background:#dbeafe;border-left:4px solid #0ea5e9;padding:16px 20px;margin-bottom:24px;">
<strong style="color:#075985;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Scout Pass Application</strong>
<p style="margin:4px 0 0;font-size:14px;color:#0c4a6e;">Free Dashboard for verified scouts &middot; 24-48h verification promised</p>
</div>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:8px 0;font-weight:600;width:180px;color:#475569;">Name</td><td style="padding:8px 0;">${f.name}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Email</td><td style="padding:8px 0;"><a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a></td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">LinkedIn</td><td style="padding:8px 0;"><a href="${f.linkedin}" style="color:#0ea5e9;">${f.linkedin}</a></td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Program</td><td style="padding:8px 0;">${f.program || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">AngelList/Crunchbase</td><td style="padding:8px 0;">${f.angel_profile || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Investments (12mo)</td><td style="padding:8px 0;">${f.investments || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Scouts for</td><td style="padding:8px 0;">${f.funds || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">Use case note</td><td style="padding:8px 0;white-space:pre-wrap;">${f.note || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Heard via</td><td style="padding:8px 0;">${f.source || blank}</td></tr>
</table>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
<p style="color:#94a3b8;font-size:12px;line-height:1.5;">Submitted from ${f.ip} (${f.ua})<br>Form: https://gitdealflow.com/scout-pass</p>
<p style="color:#94a3b8;font-size:12px;">Verification checklist: (1) LinkedIn title shows scout / venture partner / angel / fellow, (2) program listing or 2+ disclosed investments in 12mo, (3) profile older than 3 months. Reply directly to <a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a> inside 48h with approval or a written no.</p>
</div>
</body>
</html>`;
}

function confirmationEmailHtml(name: string): string {
  const safeName = escapeHtml(name.split(" ")[0] || "there");
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;background:#f8fafc;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:24px;">
<div style="background:#ffffff;border-radius:14px;padding:32px 40px;box-shadow:0 1px 3px rgba(15,23,42,0.08);">
<span style="display:inline-block;color:#0ea5e9;font-size:13px;font-weight:700;letter-spacing:1.5px;">VC DEAL FLOW SIGNAL</span>
<h1 style="font-size:22px;margin:16px 0 12px;color:#0f172a;">Scout Pass application received</h1>
<p style="font-size:15px;line-height:1.6;">Hi ${safeName},</p>
<p style="font-size:15px;line-height:1.6;">Your Scout Pass application is in. I verify every application by hand, LinkedIn, program affiliation, investment history, so expect a reply within <strong>24-48 hours</strong>.</p>
<p style="font-size:15px;line-height:1.6;">If approved, you get the full Dashboard (&euro;49/mo value, free for verified scouts), the Sunday signal digest, and MCP server access for querying signals from Claude, ChatGPT, or Cursor.</p>
<p style="font-size:15px;line-height:1.6;">While you wait: the free weekly signal is at <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a> and the methodology is published openly on <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558" style="color:#0ea5e9;">SSRN</a>.</p>
<p style="font-size:15px;line-height:1.6;">The Data Nerd</p>
</div>
<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px;">GitDealFlow &middot; signals@gitdealflow.com &middot; You received this because you applied for Scout Pass.</p>
</div>
</body>
</html>`;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowed = [
    "https://gitdealflow.com",
    "https://www.gitdealflow.com",
    "https://signals.gitdealflow.com",
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:8080", "http://localhost:3000"]
      : []),
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
  // Anti-abuse: max 3 applications per IP per day (scout-pass-design.md §8).
  const rl = checkRateLimit(`scout-pass:${ip}`, 3, 86_400_000);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "Too many applications from this address. Please email signals@gitdealflow.com directly.",
      },
      { status: 429, headers: { ...headers, ...rateLimitHeaders(rl) } },
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let raw: Record<string, unknown>;
    if (contentType.includes("application/json")) {
      raw = await request.json();
    } else {
      const fd = await request.formData();
      raw = Object.fromEntries(fd.entries());
    }

    // Honeypot, bots fill every field; humans never see this one.
    if (clip(raw.website, 100)) {
      // Pretend success so bots don't adapt.
      return NextResponse.json({ ok: true }, { status: 200, headers });
    }

    const name = clip(raw.name, 120);
    const email = clip(raw.email, 200).toLowerCase();
    const linkedin = clip(raw.linkedin, 300);
    const programRaw = clip(raw.program, 60);
    const program = KNOWN_PROGRAMS.has(programRaw) ? programRaw : clip(raw.program_other, 120) || programRaw;
    const angel_profile = clip(raw.angel_profile, 300);
    const investments = clip(raw.investments, 20);
    const funds = clip(raw.funds, 200);
    const note = clip(raw.note, 600);
    const source = clip(raw.source, 60);

    if (!name || !email || !linkedin) {
      return NextResponse.json(
        { error: "name, email, and linkedin are required" },
        { status: 400, headers },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400, headers },
      );
    }
    if (!/^https?:\/\/([a-z0-9-]+\.)?linkedin\.com\//i.test(linkedin)) {
      return NextResponse.json(
        { error: "LinkedIn URL must be a linkedin.com profile link" },
        { status: 400, headers },
      );
    }
    // Eligibility floor: program affiliation OR independent angel evidence.
    if (!program && !angel_profile) {
      return NextResponse.json(
        {
          error:
            "Select a scout program, or provide an AngelList/Crunchbase profile if you're an independent angel",
        },
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

    const ua = clip(request.headers.get("user-agent") || "", 200);

    const html = applicationEmailHtml({
      name,
      email,
      linkedin,
      program,
      angel_profile,
      investments,
      funds,
      note,
      source,
      ip,
      ua,
    });

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        bcc: "sales@sipiteno.com",
        to: TO_EMAIL,
        reply_to: email,
        subject: `[Scout Pass] ${name}, ${program || "independent angel"}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Failed to send Scout Pass application email:", errText);
      return NextResponse.json(
        {
          error:
            "Failed to deliver application, please email signals@gitdealflow.com directly",
        },
        { status: 500, headers },
      );
    }

    // Confirmation to the applicant, best-effort, never fails the request.
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: email,
          subject: "Scout Pass application received, reply inside 48h",
          html: confirmationEmailHtml(name),
        }),
      });
    } catch (e) {
      console.error("Scout Pass confirmation email failed (non-fatal):", e);
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "Application received. You'll hear back within 24-48 hours.",
      },
      { status: 200, headers },
    );
  } catch (err) {
    console.error("Scout Pass application error:", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400, headers },
    );
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowed = [
    "https://gitdealflow.com",
    "https://www.gitdealflow.com",
    "https://signals.gitdealflow.com",
  ];
  const headers: Record<string, string> = {};
  if (allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(null, { status: 204, headers });
}
