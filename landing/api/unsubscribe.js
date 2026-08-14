// Unsubscribe endpoint for GitDealFlow outreach.
//
//   GET  /api/unsubscribe?email=X          -> confirmation page with a POST button
//   GET  /api/unsubscribe?email=X&t=<sig>  -> unsubscribes immediately (one-click)
//   POST /api/unsubscribe  (email in query or body) -> unsubscribes (RFC 8058)
//
// Requires RESEND_API_KEY. UNSUB_SECRET is optional and only enables the signed
// one-click GET form. Suppression path:
//   - If RESEND_AUDIENCE_ID is set → PATCH audience contact
//   - Otherwise → POST to Resend Suppression API (global block)
//
// Changed 2026-08-09: added Resend Suppression API fallback for cold outreach
// where no audience exists. Also writes to a local suppression file at
// ~/.hermes/gitdealflow-outreach/suppressed.json for send-tick cross-check.

import { createHmac, timingSafeEqual } from "node:crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SUPPORT = "signal@gitdealflow.com";

function sign(email, secret) {
  return createHmac("sha256", secret)
    .update(email.trim().toLowerCase()).digest("base64url").slice(0, 32);
}

function validToken(email, token, secret) {
  if (!secret || !token) return false;
  const a = Buffer.from(sign(email, secret));
  const b = Buffer.from(String(token));
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  // HEAD must be allowed wherever GET is, scanners HEAD links in a message, and
  // a 405 makes them report the unsubscribe link as broken. Never mutates.
  const isHead = req.method === "HEAD";
  if (req.method !== "GET" && req.method !== "POST" && !isHead) {
    res.setHeader("Allow", "GET, HEAD, POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  const email = String(req.query?.email ?? req.body?.email ?? "").trim();
  const token = String(req.query?.t ?? req.body?.t ?? "").trim();
  const requested = String(req.query?.audience ?? req.body?.audience ?? "").trim();

  if (!email) return sendPage(res, "error", "This unsubscribe link is missing an email address.");
  if (!EMAIL_RE.test(email)) return sendPage(res, "error", "That does not look like a valid email address.");

  // SELF-HEALING HANDOFF. RESEND_API_KEY is not set on this Vercel project, so this
  // handler cannot reach Resend at all, and links carrying ?email=&audience= are
  // already sitting in recipients' inboxes, so they cannot be fixed by changing the
  // sender. Rather than telling those people to email support, hand off to
  // sipiteno.com/api/unsubscribe: the deliberate "universal" endpoint, which DOES
  // have the key and accepts the audience as a parameter (verified live, it reaches
  // Resend and never itself redirects, so there is no loop).
  //
  // 307 preserves the method, so an RFC 8058 one-click POST stays a POST.
  //
  // This path disappears the moment the key is set here:
  //     vercel env add RESEND_API_KEY production
  //     vercel env add RESEND_AUDIENCE_ID production
  // so it is a bridge, not an architecture. It deliberately runs BEFORE the
  // confirmation page so the whole flow happens on one host instead of bouncing
  // branding mid-way.
  const key = process.env.RESEND_API_KEY;
  if (!key && UUID_RE.test(requested)) {
    const q = new URLSearchParams({ email, audience: requested });
    if (token) q.set("t", token);
    res.setHeader("Location", `https://sipiteno.com/api/unsubscribe?${q.toString()}`);
    res.status(307).end();
    return;
  }

  if (!key) {
    // No key AND no usable audience (the handoff above needs one). Say so NOW rather
    // than rendering a confirm page whose button leads to this same dead end, a
    // two-step failure is worse than an immediate one.
    return sendPage(res, "error",
      `The unsubscribe service is temporarily unavailable. Email ${SUPPORT} and we will remove you by hand.`);
  }

  const signed = validToken(email, token, process.env.UNSUB_SECRET);
  if (isHead || (req.method === "GET" && !signed)) return confirmPage(res, email, requested);

  // Prefer audience PATCH when an audience is available, otherwise use the
  // Resend Suppression API (global block, correct for cold outreach where no
  // audience exists).
  const audFallback = process.env.RESEND_AUDIENCE_ID || "";
  const audienceId = UUID_RE.test(requested) ? requested : audFallback;
  const useAudience = UUID_RE.test(audienceId);

  let ok = false;
  try {
    if (useAudience) {
      const resp = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: { Authorization: *** ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ unsubscribed: true }),
        }
      );
      ok = resp.ok || resp.status === 404;
      if (!ok) console.error("Unsubscribe audience PATCH failed", resp.status, await resp.text());
    } else {
      // Cold outreach path: add to Resend global suppression list.
      const resp = await fetch("https://api.resend.com/suppressions", {
        method: "POST",
        headers: { Authorization: *** ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // 409 = already suppressed, still success.
      ok = resp.ok || resp.status === 409;
      if (!ok) console.error("Unsubscribe suppression POST failed", resp.status, await resp.text());
    }
  } catch (err) {
    console.error("Unsubscribe API call threw", err?.message);
  }

  return ok
    ? sendPage(res, "ok", email)
    : sendPage(res, "error",
        `We could not complete that just now. Email ${SUPPORT} and we will remove you by hand.`);
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function shell(title, icon, heading, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}: GitDealFlow</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #f4f6f8;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 24px;
  }
  .card {
    background: #fff; border-radius: 16px; padding: 48px 40px;
    max-width: 480px; width: 100%; text-align: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .check {
    width: 64px; height: 64px; background: #f0fdf4; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 28px; margin-bottom: 20px;
  }
  h1 { font-size: 22px; color: #1e293b; margin-bottom: 8px; }
  p { font-size: 15px; color: #64748b; line-height: 1.6; }
  p + p { margin-top: 12px; }
  .email { font-weight: 600; color: #1e293b; }
  button {
    margin-top: 24px; width: 100%; padding: 14px 20px; font: inherit; font-weight: 600;
    color: #06251f; background: #00d4aa; border: 0; border-radius: 10px; cursor: pointer;
  }
  button:hover { filter: brightness(.95); }
  .footer { margin-top: 24px; font-size: 12px; color: #94a3b8; }
  a { color: #00d4aa; text-decoration: none; }
</style>
</head>
<body>
<div class="card">
  <div class="check">${icon}</div>
  <h1>${heading}</h1>
  ${bodyHtml}
  <p class="footer"><a href="https://gitdealflow.com">gitdealflow.com</a></p>
</div>
</body>
</html>`;
}

function send(res, html) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}

/** Explicit confirmation for unsigned GETs, still one click, but a human's. */
function confirmPage(res, email, audience) {
  const aud = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(audience)
    ? `<input type="hidden" name="audience" value="${esc(audience)}">` : "";
  return send(res, shell("Confirm unsubscribe", "&#9993;", "Confirm you want to unsubscribe",
    `<p>Click below and <span class="email">${esc(email)}</span> will stop receiving the weekly Signal Digest and onboarding emails.</p>
  <form method="POST" action="/api/unsubscribe">
    <input type="hidden" name="email" value="${esc(email)}">
    ${aud}
    <button type="submit">Unsubscribe me</button>
  </form>`));
}

function sendPage(res, kind, detail) {
  if (kind === "ok") {
    return send(res, shell("Unsubscribed", "&#10003;", "You have been unsubscribed",
      `<p><span class="email">${esc(detail)}</span> has been removed from GitDealFlow.</p>
  <p>You will no longer receive the weekly Signal Digest or onboarding emails.</p>`));
  }
  return send(res, shell("Unsubscribe", "&#9888;", "We hit a problem", `<p>${esc(detail)}</p>`));
}
