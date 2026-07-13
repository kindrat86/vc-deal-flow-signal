import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";
import { isExcluded } from "@/lib/excluded-emails";
import { pickAudienceId } from "@/lib/resend-audience";
import {
  computeReplyDeadline,
  scheduleSetterSequence,
} from "@/lib/sector-sweep-setter";

/**
 * /api/apply — Sector Sweep application intake (Brunson DotCom Ch 23,
 * Application Funnel).
 *
 * landing/apply.html (gitdealflow.com/apply) POSTs the 3-step €1,997
 * application here as JSON: { name, email, role, sector, geography,
 * question, check_size }. Before this route existed the fetch 404'd and the
 * page silently fell back to a mailto: link — most applications were lost.
 *
 * On success (the page only checks `res.ok`):
 *   1. Emails the full application to signals@gitdealflow.com with
 *      reply_to set to the applicant, so the 24h human reply is one
 *      keystroke away.
 *   2. Adds the applicant to the Resend audience with
 *      source:"sector-sweep-apply" attribution (packed into first_name,
 *      same gdf-attr-v1 bridge as /api/verify).
 *   3. Enrolls the applicant in the 4-step Setter heat-build drip from
 *      lib/sector-sweep-setter.ts — same sequence /api/sector-sweep-brief
 *      uses, so the "async-only loses heat" gap stays closed on this
 *      funnel too.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const TO_EMAIL = "signals@gitdealflow.com";

const ROLE_LABELS: Record<string, string> = {
  angel: "Angel investor",
  scout: "Scout / venture partner",
  fund: "Fund manager / GP",
  corpdev: "Corp dev / PE / strategy",
  family: "Family office",
};

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
  role: string;
  sector: string;
  geography: string;
  question: string;
  check_size: string;
  ip: string;
  ua: string;
}): string {
  const f = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, escapeHtml(v)]),
  );
  const blank = "<em style='color:#94a3b8;'>blank</em>";
  const roleLabel = ROLE_LABELS[fields.role]
    ? escapeHtml(ROLE_LABELS[fields.role])
    : f.role || blank;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;background:#f8fafc;margin:0;padding:0;">
<div style="max-width:640px;margin:0 auto;padding:24px;">
<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;margin-bottom:24px;">
<strong style="color:#78350f;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Sector Sweep Application</strong>
<p style="margin:4px 0 0;font-size:14px;color:#92400e;">&euro;1,997 one-time &middot; review-before-pay &middot; 24-hour reply promised on /apply</p>
</div>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:8px 0;font-weight:600;width:160px;color:#475569;">Name</td><td style="padding:8px 0;">${f.name}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Email</td><td style="padding:8px 0;"><a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a></td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Role</td><td style="padding:8px 0;">${roleLabel}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Sector</td><td style="padding:8px 0;">${f.sector}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Geography</td><td style="padding:8px 0;">${f.geography || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;">Check size</td><td style="padding:8px 0;">${f.check_size || blank}</td></tr>
<tr><td style="padding:8px 0;font-weight:600;color:#475569;vertical-align:top;">The one question</td><td style="padding:8px 0;white-space:pre-wrap;">${f.question}</td></tr>
</table>
<div style="background:#ecfdf5;border-left:4px solid #10b981;padding:14px 18px;margin:20px 0;">
<strong style="color:#065f46;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Reply checklist (24-hour promise on the page)</strong>
<ol style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#064e3b;line-height:1.6;">
<li>Signal confirmed &rarr; private Stripe link</li>
<li>Partial signal &rarr; data first, buyer decides</li>
<li>No signal &rarr; honest pass, offer First Look (&euro;7) instead</li>
</ol>
</div>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
<p style="color:#94a3b8;font-size:12px;line-height:1.5;">Submitted from ${f.ip} (${f.ua})<br>Form: https://gitdealflow.com/apply</p>
<p style="color:#94a3b8;font-size:12px;">Reply directly to <a href="mailto:${f.email}" style="color:#0ea5e9;">${f.email}</a> &mdash; that's the applicant.</p>
</div>
</body>
</html>`;
}

async function addToAudience(email: string, source: string): Promise<void> {
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
          first_name: "gdf-attr-v1:" + JSON.stringify({ source }),
          unsubscribed: false,
        }),
      },
    );
    if (!res.ok) {
      // Contact already exists (re-applicant / prior subscriber) — make sure
      // they're re-activated so future sends reach them.
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
    console.error("[apply] addToAudience failed:", err);
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowed = [
    "https://gitdealflow.com",
    "https://www.gitdealflow.com",
    "https://signals.gitdealflow.com",
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
  // Same tight limit as /api/sector-sweep-brief — this is a €1,997 rung.
  const rl = checkRateLimit(`apply:${ip}`, 2, 3600_000);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "Too many applications. Please email signals@gitdealflow.com directly with the same answers.",
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

    const name = clip(raw.name, 120);
    const email = clip(raw.email, 200).toLowerCase();
    const role = clip(raw.role, 40);
    const sector = clip(raw.sector, 100);
    const geography = clip(raw.geography, 200);
    const question = clip(raw.question, 2000);
    const check_size = clip(raw.check_size, 40);

    // Reject empty applications server-side — the client-side step validation
    // is trivially bypassed and an empty brief is unanswerable.
    if (!name || !email || !sector || !question) {
      return NextResponse.json(
        { error: "name, email, sector, and question are required" },
        { status: 400, headers },
      );
    }
    if (!isValidEmail(email)) {
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

    const ua = clip(request.headers.get("user-agent") || "", 200);

    const html = applicationEmailHtml({
      name,
      email,
      role,
      sector,
      geography,
      question,
      check_size,
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
        to: TO_EMAIL,
        reply_to: email,
        subject: `[Sector Sweep Application] ${name} — ${sector.slice(0, 60)}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Failed to send Sector Sweep application email:", errText);
      // Non-ok → the page falls back to its mailto: link, which still lands
      // the application. Don't fake success.
      return NextResponse.json(
        {
          error:
            "Failed to deliver application — please email signals@gitdealflow.com directly",
        },
        { status: 500, headers },
      );
    }

    // Audience-add + Setter heat-build drip — both best-effort, both skipped
    // for excluded (tester/bot) addresses so smoke tests don't pollute the
    // list or burn Resend credits.
    if (!isExcluded(email)) {
      await addToAudience(email, "sector-sweep-apply");

      const deadline = computeReplyDeadline();
      const setterResult = await scheduleSetterSequence(
        {
          contact_name: name,
          email,
          fund_or_role: ROLE_LABELS[role] || role,
          sector: geography ? `${sector} (${geography})` : sector,
          thesis: question,
          three_orgs: "",
          decision_window: "",
          why_sweep: check_size ? `Typical check size: ${check_size}` : "",
          deadline,
        },
        RESEND_API_KEY,
      );
      if (setterResult.failed > 0) {
        console.error(
          `[apply] heat-build sequence partial-failure: ${setterResult.failed}/4 emails errored`,
          setterResult.errors,
        );
      } else {
        console.log(
          `[apply] heat-build sequence scheduled: ${setterResult.scheduled}/4 emails queued for ${email}`,
        );
      }
    } else {
      console.log(`[apply] suppressed drip for excluded address: ${email}`);
    }

    // apply.html only checks `res.ok` — keep the body informative for
    // programmatic callers anyway.
    return NextResponse.json(
      {
        ok: true,
        message:
          "Application received. You'll hear back within 24 hours with one of three answers: signal confirmed, partial signal, or honestly, no signal.",
      },
      { status: 200, headers: { ...headers, ...rateLimitHeaders(rl) } },
    );
  } catch (err) {
    console.error("Sector Sweep application handler error:", err);
    return NextResponse.json(
      {
        error:
          "Server error — please email signals@gitdealflow.com directly with the same answers",
      },
      { status: 500, headers },
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
  return new NextResponse(null, { status: 204, headers });
}
