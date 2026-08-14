import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";
import {
  getOrCreateScout,
  countPredictionsThisMonth,
  createPrediction,
  monthlyLimitForTier,
} from "@/lib/pocketbase";
import { signVerifyToken } from "@/lib/verify-token";
import { scheduleSoapOperaForNewScout } from "@/lib/soap-opera-scout";
import { isExcluded } from "@/lib/excluded-emails";
import { makeShareUrl } from "@/lib/share-url";
import { listUnsubscribeHeaders } from "@/lib/list-unsubscribe";
import { pickAudienceId } from "@/lib/resend-audience";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "signals@gitdealflow.com";
const SITE_URL = process.env.SITE_URL || "https://signals.gitdealflow.com";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidGithubOrg(org: string): boolean {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38}[a-zA-Z0-9])?(?:\/[a-zA-Z0-9._-]+)?$/.test(org);
}

/**
 * Add the scout to the Resend audience with source attribution so they
 * receive future digests/broadcasts, previously scouts only ever got the
 * scout-specific emails and fell out of the general list. On already-exists,
 * PATCH unsubscribed:false to re-activate. Best-effort.
 */
async function addToAudience(email: string) {
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
          first_name: "gdf-attr-v1:" + JSON.stringify({ source: "scout-predict" }),
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
    console.error("[scout/predict] audience-add failed:", err);
  }
}

function confirmationHtml(opts: {
  handle: string;
  githubOrg: string;
  prediction: string;
  confidence: number;
  rationale: string;
  dashboardUrl: string;
  profileUrl: string;
  predictionsThisMonth: number;
  monthlyLimit: number;
  tier: "free" | "paid";
  isFounder: boolean;
  isFirstPrediction: boolean;
}): string {
  const {
    handle,
    githubOrg,
    prediction,
    confidence,
    rationale,
    dashboardUrl,
    profileUrl,
    predictionsThisMonth,
    monthlyLimit,
    tier,
    isFounder,
    isFirstPrediction,
  } = opts;
  const safeOrg = escapeHtml(githubOrg);
  const safePred = escapeHtml(prediction);
  const safeRat = rationale ? escapeHtml(rationale) : "";
  const remaining = Math.max(0, monthlyLimit - predictionsThisMonth);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL, SCOUT GAME</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p style="font-size:22px;font-weight:700;color:#1e293b;margin:0 0 8px;">${isFirstPrediction ? "Welcome, scout." : "Prediction locked in."}</p>
<p style="color:#475569;margin:0 0 24px;">You are <strong>@${escapeHtml(handle)}</strong>. Current rank: <strong>${isFirstPrediction ? "Curious" : "see dashboard"}</strong>${isFounder ? ' · <strong style="color:#059669;">🏆 Founder Scout</strong>' : ""}.</p>
<div style="background:#f1f5f9;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
<p style="margin:0 0 8px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Your call</p>
<p style="margin:0 0 4px;font-family:SF Mono,Menlo,monospace;font-size:14px;color:#0f172a;"><strong>${safeOrg}</strong></p>
<p style="margin:0 0 4px;color:#334155;">Raise in next 6 months: <strong style="color:${prediction === "yes" ? "#059669" : "#dc2626"};text-transform:uppercase;">${safePred}</strong></p>
<p style="margin:0;color:#334155;">Confidence: <strong>${confidence}%</strong></p>
${safeRat ? `<p style="margin:12px 0 0;color:#64748b;font-size:14px;font-style:italic;">&ldquo;${safeRat}&rdquo;</p>` : ""}
</div>
<div style="text-align:center;margin:32px 0;">
<a href="${dashboardUrl}" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">Open your scout dashboard →</a>
</div>
<p style="color:#334155;">Your public profile: <a href="${profileUrl}" style="color:#0ea5e9;text-decoration:none;">${profileUrl.replace(/^https?:\/\//, "")}</a></p>
<p style="color:#334155;">You have used <strong>${predictionsThisMonth}</strong> of your <strong>${monthlyLimit}</strong> predictions this month (${remaining} remaining). ${tier === "free" ? `Upgrade to Dashboard (EUR 9.97/mo) for 10 predictions per month.` : ""}</p>
<p style="color:#334155;">We resolve your call automatically when the round is announced or the 6-month window closes. Right calls earn points and move you up the rank ladder.</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You received this because you made a prediction at <a href="${SITE_URL}/predict" style="color:#0ea5e9;">signals.gitdealflow.com/predict</a>.</p>
<p>Reply to this email to cancel your scout account.</p>
</div>
</div>
</body></html>`;
}

function adminNotificationHtml(opts: {
  predictionId: string;
  handle: string;
  email: string;
  tier: string;
  rank: string;
  ip: string;
  githubOrg: string;
  prediction: string;
  confidence: number;
  rationale: string;
  isFirstPrediction: boolean;
  isFounder: boolean;
}): string {
  return `<p><strong>New scout prediction${opts.isFirstPrediction ? ", 🎉 new scout" : ""}${opts.isFounder ? ", 🏆 Founder Scout #?" : ""}</strong></p>
<ul>
<li>ID: <code>${escapeHtml(opts.predictionId)}</code></li>
<li>Scout: <code>@${escapeHtml(opts.handle)}</code> (${escapeHtml(opts.email)})</li>
<li>Tier: <code>${escapeHtml(opts.tier)}</code> · Rank: <code>${escapeHtml(opts.rank)}</code></li>
<li>IP: <code>${escapeHtml(opts.ip)}</code></li>
<li>GitHub org: <code>${escapeHtml(opts.githubOrg)}</code></li>
<li>Prediction: <strong>${escapeHtml(opts.prediction)}</strong> (raise in next 6 months)</li>
<li>Confidence: ${opts.confidence}%</li>
${opts.rationale ? `<li>Rationale: <em>${escapeHtml(opts.rationale)}</em></li>` : ""}
<li>Timestamp: ${new Date().toISOString()}</li>
<li>Resolve via: <code>node fly/resolve-prediction.mjs ${escapeHtml(opts.predictionId)} correct|wrong "note"</code></li>
</ul>`;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin") || "";
  const allowed = [
    "https://gitdealflow.com",
    "https://www.gitdealflow.com",
    "https://signals.gitdealflow.com",
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:3000", "http://localhost:8080"]
      : []),
  ];

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }

  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`predict:${ip}`, 3, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many predictions in a short window. Slow down." },
      { status: 429, headers: { ...headers, ...rateLimitHeaders(rl) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers });
  }

  const githubOrg = String(body.githubOrg || "").trim();
  const prediction = String(body.prediction || "").trim().toLowerCase();
  const email = String(body.email || "").trim().toLowerCase();
  const confidence = Number(body.confidence);
  const rationale = String(body.rationale || "").slice(0, 500);

  if (!githubOrg || !isValidGithubOrg(githubOrg)) {
    return NextResponse.json({ error: "Invalid GitHub org or repo format" }, { status: 400, headers });
  }
  if (prediction !== "yes" && prediction !== "no") {
    return NextResponse.json({ error: "Prediction must be yes or no" }, { status: 400, headers });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400, headers });
  }
  if (!Number.isFinite(confidence) || confidence < 50 || confidence > 99) {
    return NextResponse.json({ error: "Confidence must be 50-99" }, { status: 400, headers });
  }

  try {
    const { scout, created } = await getOrCreateScout(email);
    const used = await countPredictionsThisMonth(scout.id);
    const limit = monthlyLimitForTier(scout.tier);
    if (used >= limit) {
      return NextResponse.json(
        {
          error:
            scout.tier === "free"
              ? `Monthly cap reached: ${limit} predictions. Upgrade to Dashboard (EUR 9.97/mo) for 10 per month, or wait until next month.`
              : `Monthly cap reached: ${limit} predictions. Next month resets your allowance.`,
          tier: scout.tier,
          limit,
          used,
        },
        { status: 429, headers },
      );
    }

    const createdPred = await createPrediction({
      scoutId: scout.id,
      githubOrg,
      prediction: prediction as "yes" | "no",
      confidence,
      rationale,
      ipAddress: ip,
    });

    // v2 dashboard token: payload-bound (email + purpose + 7d expiry + nonce).
    // First click trades the URL token for an httpOnly session cookie at
    // /dashboard/scout, so the leak surface is one redirect, not perpetual.
    const { token: dashboardToken } = signVerifyToken({
      email,
      purpose: "scout-dashboard",
      ttlSeconds: 7 * 86_400,
    });
    const dashboardUrl = `${SITE_URL}/dashboard/scout?email=${encodeURIComponent(email)}&token=${dashboardToken}`;
    const profileUrl = `${SITE_URL}/s/${scout.handle}`;

    const userMailSuppressed = isExcluded(email);
    if (userMailSuppressed) {
      console.log(`[scout/predict] SUPPRESSED user confirm to excluded address: ${email}`);
    }
    if (RESEND_API_KEY) {
      const userMail = userMailSuppressed ? Promise.resolve(null) : fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          bcc: "sales@sipiteno.com",
          to: email,
          subject: created
            ? `Welcome scout, your first call locked in (${githubOrg})`
            : `Prediction locked in: ${githubOrg} · ${prediction.toUpperCase()}`,
          html: confirmationHtml({
            handle: scout.handle,
            githubOrg,
            prediction,
            confidence,
            rationale,
            dashboardUrl,
            profileUrl,
            predictionsThisMonth: used + 1,
            monthlyLimit: limit,
            tier: scout.tier,
            isFounder: scout.founder_scout,
            isFirstPrediction: created,
          }),
          headers: listUnsubscribeHeaders(email),
        }),
      });

      const adminMail = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          bcc: "sales@sipiteno.com",
          to: ADMIN_EMAIL,
          subject: `[scout] ${scout.handle} · ${githubOrg} · ${prediction.toUpperCase()} @ ${confidence}%${
            created ? " · NEW" : ""
          }`,
          html: adminNotificationHtml({
            predictionId: createdPred.id,
            handle: scout.handle,
            email,
            tier: scout.tier,
            rank: scout.rank,
            ip,
            githubOrg,
            prediction,
            confidence,
            rationale,
            isFirstPrediction: created,
            isFounder: scout.founder_scout,
          }),
        }),
      });

      const schedulePromise = created
        ? scheduleSoapOperaForNewScout({
            email,
            handle: scout.handle,
            dashboardUrl,
            profileUrl,
          })
        : Promise.resolve();

      await Promise.all([userMail, adminMail, schedulePromise]);
    }

    // Keep scouts on the general list too (digests, broadcasts).
    await addToAudience(email);

    const shareUrl = makeShareUrl({ sharer: scout.handle, kind: "predict" });

    return NextResponse.json(
      {
        ok: true,
        predictionId: createdPred.id,
        handle: scout.handle,
        isNewScout: created,
        isFounderScout: scout.founder_scout,
        profileUrl,
        dashboardUrl,
        shareUrl,
        predictionsThisMonth: used + 1,
        monthlyLimit: limit,
        message: created
          ? `Welcome, @${scout.handle}. Confirmation sent to your email.`
          : `Prediction locked in. ${limit - (used + 1)} predictions remaining this month.`,
      },
      { headers },
    );
  } catch (err) {
    console.error("Predict error:", err);
    return NextResponse.json(
      {
        error: "Could not record prediction right now. Try again in a moment.",
        detail: err instanceof Error ? err.message : String(err),
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
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:3000", "http://localhost:8080"]
      : []),
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
