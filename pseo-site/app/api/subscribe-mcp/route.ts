import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { isValidEmail, isAllowedOrigin } from "@/lib/validation";
import { SOAP_OPERA_EMAILS } from "@/lib/emails";
import { isExcluded } from "@/lib/excluded-emails";
import { isNonceUsed, markNonceUsed } from "@/lib/runtime-cache";
import { listUnsubscribeHeaders } from "@/lib/list-unsubscribe";
import { pickAudienceId } from "@/lib/resend-audience";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";

// Shared per-email Soap Opera enrollment dedup (same namespace as
// /api/verify and /api/book/download) so an MCP-guide requester who also
// subscribed elsewhere isn't double-enrolled.
const SOS_ENROLLED_NAMESPACE = "sos-enrolled";
const SOS_ENROLLED_TTL_SECONDS = 180 * 86_400;

// Resend rejects scheduled_at >30 days out (422) — mirror verify's split.
const MAX_SCHEDULE_MS = 29 * 24 * 60 * 60 * 1000;

// ---------- MCP Installation Guide Email ----------
const MCP_SUBJECT = "Your MCP setup guide — talk to your deal flow in 2 minutes";
const MCP_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">

<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>

<div style="font-size:16px;line-height:1.7;color:#1e293b;">

<p>You just unlocked something most investors don't even know exists.</p>

<p>In 2 minutes, you'll be able to ask your AI assistant questions like <em>"which fintech startups are accelerating right now?"</em> and get live signal data back. No dashboard, no bookmarks, no tabs.</p>

<p>Here's exactly how to set it up.</p>

<!-- ============ CLAUDE DESKTOP ============ -->
<div style="margin:28px 0;padding:24px;background:#f1f5f9;border-radius:12px;border-left:4px solid #0ea5e9;">
<h2 style="margin:0 0 16px 0;font-size:18px;color:#0f172a;">Option A: Claude Desktop App</h2>

<p style="margin:0 0 8px 0;font-weight:600;color:#0f172a;">Step 1 — Open your config file</p>
<ul style="margin:0 0 16px 0;padding-left:20px;color:#334155;">
<li><strong>Mac:</strong> Open Claude &rarr; Settings &rarr; Developer &rarr; Edit Config<br>
<span style="font-size:14px;color:#64748b;">Or open: <code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;font-size:13px;">~/Library/Application Support/Claude/claude_desktop_config.json</code></span></li>
<li style="margin-top:8px;"><strong>Windows:</strong> Open Claude &rarr; Settings &rarr; Developer &rarr; Edit Config<br>
<span style="font-size:14px;color:#64748b;">Or open: <code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;font-size:13px;">%APPDATA%\\Claude\\claude_desktop_config.json</code></span></li>
</ul>

<p style="margin:0 0 8px 0;font-weight:600;color:#0f172a;">Step 2 — Paste this config</p>
<div style="background:#0f172a;border-radius:8px;padding:16px;margin:0 0 16px 0;">
<code style="color:#e2e8f0;font-size:13px;line-height:1.6;white-space:pre;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "command": "npx",
      "args": ["-y", "@gitdealflow/mcp-signal"]
    }
  }
}</code>
</div>
<p style="font-size:14px;color:#64748b;margin:0 0 16px 0;">If you already have other MCP servers configured, add <code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;font-size:13px;">"vc-deal-flow-signal": { ... }</code> inside the existing <code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;font-size:13px;">mcpServers</code> object.</p>

<p style="margin:0 0 8px 0;font-weight:600;color:#0f172a;">Step 3 — Restart Claude</p>
<p style="margin:0;color:#334155;">Quit the app completely and reopen it. You should see a hammer icon (&#x1F528;) in the chat input area &mdash; that means MCP tools are loaded.</p>
</div>

<!-- ============ CLAUDE CODE (CLI) ============ -->
<div style="margin:28px 0;padding:24px;background:#f1f5f9;border-radius:12px;border-left:4px solid #0ea5e9;">
<h2 style="margin:0 0 16px 0;font-size:18px;color:#0f172a;">Option B: Claude Code (Terminal)</h2>

<p style="margin:0 0 12px 0;color:#334155;">Run this single command:</p>
<div style="background:#0f172a;border-radius:8px;padding:16px;margin:0 0 16px 0;">
<code style="color:#e2e8f0;font-size:13px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">claude mcp add vc-deal-flow-signal -- npx -y @gitdealflow/mcp-signal</code>
</div>
<p style="margin:0;color:#334155;">That's it. The server is now available in every Claude Code session.</p>
</div>

<!-- ============ VERIFY ============ -->
<div style="margin:28px 0;padding:24px;background:#ecfdf5;border-radius:12px;border-left:4px solid #10b981;">
<h2 style="margin:0 0 16px 0;font-size:18px;color:#0f172a;">&#x2705; Verify it works</h2>
<p style="margin:0 0 12px 0;color:#334155;">Once installed, try asking Claude:</p>
<ul style="margin:0;padding-left:20px;color:#334155;">
<li><em>"Which startups are trending this week?"</em></li>
<li><em>"Search for AI/ML startups accelerating right now"</em></li>
<li><em>"Show me the signal profile for Ramp"</em></li>
<li><em>"What methodology does VC Deal Flow Signal use?"</em></li>
<li><em>"Give me a summary of the latest deal flow data"</em></li>
</ul>
<p style="margin:12px 0 0 0;font-size:14px;color:#64748b;">Each query triggers a live API call &mdash; the data updates weekly.</p>
</div>

<!-- ============ 6 TOOLS ============ -->
<div style="margin:28px 0;">
<h2 style="margin:0 0 12px 0;font-size:18px;color:#0f172a;">What you just installed</h2>
<p style="margin:0 0 16px 0;color:#334155;">The MCP server gives Claude 6 tools it can call on your behalf:</p>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
<tr style="border-bottom:1px solid #e2e8f0;">
<td style="padding:10px 12px;font-weight:600;color:#0f172a;white-space:nowrap;">Trending Startups</td>
<td style="padding:10px 12px;color:#64748b;">This week's top startups by commit velocity and contributor growth</td>
</tr>
<tr style="border-bottom:1px solid #e2e8f0;">
<td style="padding:10px 12px;font-weight:600;color:#0f172a;white-space:nowrap;">Sector Search</td>
<td style="padding:10px 12px;color:#64748b;">Filter by sector &mdash; fintech, AI/ML, climate tech, cybersecurity, and 16 more</td>
</tr>
<tr style="border-bottom:1px solid #e2e8f0;">
<td style="padding:10px 12px;font-weight:600;color:#0f172a;white-space:nowrap;">Startup Profiles</td>
<td style="padding:10px 12px;color:#64748b;">Deep-dive signal data for any individual startup</td>
</tr>
<tr style="border-bottom:1px solid #e2e8f0;">
<td style="padding:10px 12px;font-weight:600;color:#0f172a;white-space:nowrap;">Data Summary</td>
<td style="padding:10px 12px;color:#64748b;">Aggregate stats and coverage across all tracked startups</td>
</tr>
<tr style="border-bottom:1px solid #e2e8f0;">
<td style="padding:10px 12px;font-weight:600;color:#0f172a;white-space:nowrap;">Scout Receipts</td>
<td style="padding:10px 12px;color:#64748b;">Compute a Scout Score (0-100) for any GitHub user from their starring history</td>
</tr>
<tr>
<td style="padding:10px 12px;font-weight:600;color:#0f172a;white-space:nowrap;">Methodology</td>
<td style="padding:10px 12px;color:#64748b;">How we score and rank engineering acceleration signals</td>
</tr>
</table>
</div>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">

<p>That's it. You now have live deal flow intelligence inside the tool you already use every day.</p>

<p>Tomorrow I'll share the story of how one commit graph spike predicted a $4M Series A three weeks early. The signal was public the whole time.</p>

<p>Talk soon,<br>The Data Nerd</p>

<p style="color:#64748b;font-size:14px;">P.S. If anything doesn't work, just reply to this email. I read every one.</p>

</div>

<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You're receiving this because you requested the MCP setup guide at <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
<p><a href="https://gitdealflow.com/dashboard" style="color:#0ea5e9;">Visit Dashboard</a> &middot; <a href="https://www.npmjs.com/package/@gitdealflow/mcp-signal" style="color:#0ea5e9;">npm Package</a> &middot; <a href="mailto:signals@gitdealflow.com" style="color:#0ea5e9;">Reply to unsubscribe</a></p>
</div>

</div>
</body>
</html>`;

// ---------- Route Handler ----------
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
  const rl = checkRateLimit(`subscribe-mcp:${ip}`, 5, 60_000);
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

    // Tester / bot suppression — same policy as /api/verify.
    if (isExcluded(email)) {
      console.log(`[subscribe-mcp] suppressed excluded address: ${email}`);
      return NextResponse.json({ ok: true, message: "Guide sent" }, { headers });
    }

    // 1. Add to Resend audience with source attribution. NOTE: the audience
    //    add alone does NOT start any sequence — the Soap Opera drip is
    //    explicitly scheduled in step 3 below.
    const audienceRes = await fetch("https://api.resend.com/audiences", {
      method: "GET",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (!audienceRes.ok) {
      console.error("Failed to fetch audiences:", await audienceRes.text());
      return NextResponse.json({ error: "Email service error" }, { status: 500, headers });
    }
    const audiences = await audienceRes.json();
    let audienceId = pickAudienceId(audiences);

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

    const contactRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        // gdf-attr-v1 attribution bridge (same as /api/verify) — the
        // laptop-side sync decodes this; a bare display name would break it.
        first_name: "gdf-attr-v1:" + JSON.stringify({ source: "subscribe-mcp" }),
        unsubscribed: false,
      }),
    });
    if (!contactRes.ok) {
      // Already a contact — re-activate so a previously-unsubscribed
      // requester actually receives the guide follow-ups again.
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

    // 2. Send MCP installation guide email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        bcc: "sales@sipiteno.com",
        to: email,
        subject: MCP_SUBJECT,
        html: MCP_HTML,
        headers: listUnsubscribeHeaders(email),
      }),
    });
    if (!emailRes.ok) {
      console.error("Failed to send MCP guide email:", await emailRes.text());
    }

    // 3. Actually enroll the Soap Opera Sequence (the guide email promises
    //    "Tomorrow I'll share the story…" — before this block existed nothing
    //    ever followed). Same pattern as /api/verify: Day-0 is skipped (the
    //    guide fills that slot), ≤29d scheduled via scheduled_at, the rest
    //    stored as drip_plan for /api/cron/drip-sender. Per-email nonce so
    //    repeat requests / prior subscribes don't double-enroll.
    if (await isNonceUsed(SOS_ENROLLED_NAMESPACE, email)) {
      console.log(`[subscribe-mcp] ${email} already enrolled — skipping drip`);
    } else {
      await markNonceUsed(SOS_ENROLLED_NAMESPACE, email, SOS_ENROLLED_TTL_SECONDS);
      const now = Date.now();
      const sequence = SOAP_OPERA_EMAILS.slice(1);
      const immediate = sequence.filter((e) => e.delayMs <= MAX_SCHEDULE_MS);
      const deferred = sequence.filter((e) => e.delayMs > MAX_SCHEDULE_MS);

      for (const soapEmail of immediate) {
        const sendAt = new Date(now + soapEmail.delayMs).toISOString();
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
              subject: soapEmail.subject,
              html: soapEmail.html,
              scheduled_at: sendAt,
              headers: listUnsubscribeHeaders(email),
            }),
          });
          if (!res.ok) {
            console.error(
              `[subscribe-mcp] failed to schedule "${soapEmail.subject}" for ${email}:`,
              await res.text(),
            );
          }
        } catch (err) {
          console.error(
            `[subscribe-mcp] error scheduling "${soapEmail.subject}" for ${email}:`,
            err,
          );
        }
      }

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
            `[subscribe-mcp] stored ${deferred.length} deferred drip emails for ${email}`,
          );
        } catch (err) {
          console.error("[subscribe-mcp] failed to store deferred drip plan:", err);
        }
      }
    }

    return NextResponse.json({ ok: true, message: "Guide sent" }, { headers });
  } catch (err) {
    console.error("Subscribe-mcp error:", err);
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
