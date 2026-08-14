import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";
import { isExcluded } from "@/lib/excluded-emails";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { signVerifyToken } from "@/lib/verify-token";
import { SOAP_OPERA_EMAILS } from "@/lib/emails";
import { isNonceUsed, markNonceUsed } from "@/lib/runtime-cache";
import { listUnsubscribeHeaders } from "@/lib/list-unsubscribe";
import { pickAudienceId } from "@/lib/resend-audience";

/**
 * Book download endpoint. Accepts a POST with `email` (form-encoded or JSON),
 * captures the email as a free-tier subscriber, sends the download links
 * immediately, and queues the soap-opera drip via Resend's `scheduled_at`.
 *
 * Unlike /api/subscribe (which uses double-opt-in to gate the report behind a
 * verification click), the book endpoint sends the downloads on the first
 * request, the book IS the lead magnet, friction here would defeat the
 * purpose. We still tag the contact + queue verification follow-ups so the
 * audience build matches every other capture surface.
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const SITE_URL =
  process.env.SITE_URL || "https://signals.gitdealflow.com";

// Shared with /api/verify: per-EMAIL Soap Opera enrollment dedup. A repeat
// download (or a book download after a landing-page subscribe) must re-send
// the download links but must NOT re-queue the drip sequence. Same
// namespace/key as verify so the two capture surfaces dedup against each
// other, not just themselves.
const SOS_ENROLLED_NAMESPACE = "sos-enrolled";
const SOS_ENROLLED_TTL_SECONDS = 180 * 86_400;

// Resend rejects scheduled_at more than 30 days out (422). Mirror verify's
// split: ≤29d scheduled now, the rest stored as a drip_plan the
// /api/cron/drip-sender daily cron delivers.
const MAX_SCHEDULE_MS = 29 * 24 * 60 * 60 * 1000;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function downloadEmailHtml(email: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Your copy of <strong>The 7 GitHub Signals That Predict Series A Rounds</strong> is below.</p>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;margin:24px 0;">
<tr><td style="padding-bottom:10px;">
<a href="${SITE_URL}/downloads/seven-signals.pdf" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">Download PDF</a>
</td></tr>
<tr><td style="padding-bottom:10px;">
<a href="${SITE_URL}/downloads/seven-signals.epub" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">Download EPUB</a>
</td></tr>
<tr><td style="padding-bottom:10px;">
<a href="${SITE_URL}/downloads/seven-signals.md" style="display:block;width:100%;box-sizing:border-box;background:#475569;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(71,85,105,0.35);">Markdown</a>
</td></tr>
<tr><td>
<a href="${SITE_URL}/downloads/seven-signals.txt" style="display:block;width:100%;box-sizing:border-box;background:#475569;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(71,85,105,0.35);">Plain text</a>
</td></tr>
</table>

<p>Or read the full book on the open web at <a href="${SITE_URL}/book/read" style="color:#0ea5e9;">${SITE_URL}/book/read</a>.</p>

<p>The book is ${"~"}104 pages, about four hours straight through. The seven signal chapters are roughly thirty minutes each. The replication appendix takes ninety minutes if you do the exercises with a terminal open.</p>

<p>If you only have one evening, the recommended path is the Introduction + Methodology + Replication Appendix, about ninety minutes total, which gives you the full computational toolkit. The seven signal chapters can wait for a longer sitting.</p>

<p>Tomorrow morning at nine, I&rsquo;ll send a short follow-up, the most recent Series A announcement that the methodology would have caught, walked signal-by-signal. After that you&rsquo;ll be on the regular Monday-morning Signal Digest with the top five firings of the week.</p>

<p>If anything in the book breaks for you, a threshold that doesn&rsquo;t reproduce, a script that errors, a chapter that contradicts itself, reply to this email. I read every message and the next edition will fold in your correction.</p>

<p>${FROM_NAME}</p>

<p style="color:#64748b;font-size:14px;">P.S. The €0.99 Kindle copy at <a href="${SITE_URL}/book" style="color:#0ea5e9;">${SITE_URL}/book</a> includes three bonus emails the free copy doesn&rsquo;t, a worked walkthrough of the most recent Series A catch, a private link to the unedited investor interviews, and a direct line to me for thirty days. Same content, different bonus stack.</p>

<p style="color:#64748b;font-size:14px;">P.P.S. If you want the methodology run for you on a 250+ org universe every Monday, the Dashboard locks in <a href="${SITE_URL}/pricing#dashboard-beta" style="color:#0ea5e9;">€9.97/mo founding-member rate</a>. The methodology is in the book; the Dashboard is the methodology executed.</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You requested this download at <a href="${SITE_URL}/book" style="color:#0ea5e9;">${SITE_URL}/book</a> with the email ${escapeHtml(email)}.</p>
<p>Reply &ldquo;unsubscribe&rdquo; to stop the Monday-morning Signal Digest.</p>
</div>
</div>
</body>
</html>`;
}

async function sendImmediate(
  email: string,
  subject: string,
  html: string,
  utmCampaign: string,
): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      bcc: "sales@sipiteno.com",
      to: email,
      subject,
      html,
      tags: [
        { name: "campaign", value: utmCampaign },
      ],
      headers: listUnsubscribeHeaders(email),
    }),
  });
  return res.ok;
}

/**
 * Queue the Soap Opera drip with the same 29-day split as /api/verify:
 * emails inside Resend's scheduling horizon go out via `scheduled_at`;
 * everything beyond it is stored as `drip_plan`/`drip_sent` contact
 * properties that /api/cron/drip-sender reads daily. Before the split,
 * every email past Day 29 was silently rejected by Resend (422).
 */
async function scheduleSoapOpera(
  email: string,
  audienceId: string | null,
): Promise<void> {
  const now = Date.now();
  // Skip Day-0 (we just sent the download email which serves the same role)
  // and start from Day-1 onward.
  const sequence = SOAP_OPERA_EMAILS.slice(1);
  const immediate: typeof sequence = [];
  const deferred: typeof sequence = [];
  for (const e of sequence) {
    if (e.delayMs <= MAX_SCHEDULE_MS) immediate.push(e);
    else deferred.push(e);
  }

  for (const e of immediate) {
    const scheduledAt = new Date(now + e.delayMs).toISOString();
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          bcc: "sales@sipiteno.com",
          to: email,
          subject: e.subject,
          html: e.html,
          scheduled_at: scheduledAt,
          tags: [{ name: "campaign", value: "book-funnel-drip" }],
          headers: listUnsubscribeHeaders(email),
        }),
      });
      if (!res.ok) {
        console.error(
          `Failed to schedule drip "${e.subject}" for ${email}:`,
          await res.text(),
        );
      }
    } catch (err) {
      console.error("Failed to schedule drip:", err);
    }
  }

  // Store the deferred remainder on the contact, same shape drip-sender
  // reads ({d: days, s: subject, h: html}). Needs the audience contact to
  // exist (addToAudience runs first in the POST handler).
  if (deferred.length > 0 && audienceId) {
    const dripPlan = deferred.map((e) => ({
      d: Math.round(e.delayMs / (24 * 60 * 60 * 1000)),
      s: e.subject,
      h: e.html,
    }));
    try {
      await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: {
              drip_plan: JSON.stringify(dripPlan),
              drip_sent: "",
            },
          }),
        },
      );
      console.log(
        `[book-download] stored ${deferred.length} deferred drip emails for ${email}`,
      );
    } catch (err) {
      console.error("[book-download] failed to store deferred drip plan:", err);
    }
  } else if (deferred.length > 0) {
    console.error(
      `[book-download] no audience id, ${deferred.length} deferred drip emails NOT stored for ${email}`,
    );
  }
}

async function addToAudience(email: string): Promise<string | null> {
  if (!RESEND_API_KEY) return null;
  try {
    const audRes = await fetch("https://api.resend.com/audiences", {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (!audRes.ok) return null;
    const audiences = await audRes.json();
    let audienceId: string | undefined = pickAudienceId(audiences);
    if (!audienceId) {
      const createRes = await fetch("https://api.resend.com/audiences", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "VC Deal Flow Subscribers" }),
      });
      if (!createRes.ok) return null;
      const created = await createRes.json();
      audienceId = created.id || created.data?.id;
    }
    if (!audienceId) return null;
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
          first_name: "gdf-attr-v1:" + JSON.stringify({ source: "book-page" }),
          unsubscribed: false,
        }),
      },
    );
    if (!res.ok) {
      // Already a contact (re-download / prior subscriber), re-activate so
      // a previously-unsubscribed reader who asks for the book again gets it.
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
    return audienceId;
  } catch (err) {
    console.error("addToAudience failed:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`book-download:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(rl) },
    );
  }

  // Accept either form-encoded (HTML form post) or JSON.
  let email = "";
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      email = (body.email || "").trim().toLowerCase();
    } catch {
      // ignore
    }
  } else {
    try {
      const form = await req.formData();
      email = String(form.get("email") || "").trim().toLowerCase();
    } catch {
      // ignore
    }
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.redirect(
      `${SITE_URL}/book?error=invalid_email#download`,
      303,
    );
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return NextResponse.redirect(`${SITE_URL}/book/thanks`, 303);
  }

  // Mint a verify token (stored on the contact's first_name field via attribution
  //, same pattern as /api/subscribe). We don't gate the download on a verify
  // click, but we issue the token so the standard verify path works for any
  // follow-up flow.
  signVerifyToken({
    email,
    purpose: "verify-subscribe",
    ttlSeconds: 30 * 86_400,
  });

  // Send the download email and start the drip, but only if the address
  // isn't on the testers/bots exclusion list (memory feedback rule).
  if (!isExcluded(email)) {
    await sendImmediate(
      email,
      "Your book, 7 GitHub Signals (PDF + EPUB inside)",
      downloadEmailHtml(email),
      "book-funnel-download",
    );
    // Audience-add + drip schedule are best-effort; failures shouldn't block
    // the user-facing redirect. The audience add must run BEFORE the drip
    // schedule so the deferred drip_plan has a contact to attach to.
    try {
      const audienceId = await addToAudience(email);
      // Per-email dedup: repeat downloads re-send the links above but must
      // not re-queue the drip. Mark before scheduling to close the
      // double-submit race. Shared namespace with /api/verify so a reader
      // who already got the sequence via the landing page isn't re-enrolled.
      if (await isNonceUsed(SOS_ENROLLED_NAMESPACE, email)) {
        console.log(
          `book-download: ${email} already enrolled in drip, skipping re-queue`,
        );
      } else {
        await markNonceUsed(
          SOS_ENROLLED_NAMESPACE,
          email,
          SOS_ENROLLED_TTL_SECONDS,
        );
        await scheduleSoapOpera(email, audienceId);
      }
    } catch (err) {
      console.error("book-download: audience/drip enrollment failed:", err);
    }
  } else {
    console.log(`book-download: ${email} is excluded, skipping send`);
  }

  // 303 redirect coerces the form POST into a GET on the thanks page. This is
  // the standard Post/Redirect/Get pattern; required so a refresh on the
  // thanks page doesn't re-submit.
  return NextResponse.redirect(`${SITE_URL}/book/thanks?from=book`, 303);
}

// Allow JSON probes from MCP / API explorers without redirect: they hit GET
// for documentation purposes.
export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/book/download",
    accepts: ["application/x-www-form-urlencoded", "application/json"],
    fields: ["email"],
    behavior:
      "Captures email, sends instant download links + queues soap-opera drip, redirects to /book/thanks.",
    direct_downloads: {
      pdf: `${SITE_URL}/downloads/seven-signals.pdf`,
      epub: `${SITE_URL}/downloads/seven-signals.epub`,
      markdown: `${SITE_URL}/downloads/seven-signals.md`,
      text: `${SITE_URL}/downloads/seven-signals.txt`,
    },
    web_reader: `${SITE_URL}/book/read`,
  });
}
