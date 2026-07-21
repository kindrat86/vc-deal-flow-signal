// One-click unsubscribe endpoint for GitDealFlow subscribers.
// GET /api/unsubscribe?email=X&audience=Y
// Requires RESEND_API_KEY in Vercel project env (vc-deal-flow-signal-landing).

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return sendPage(res, "Unsubscribe service not configured");
  }

  const email = (req.query.email || "").trim();
  const audienceId = (req.query.audience || "").trim();

  if (!email || !audienceId) {
    return sendPage(res, "Missing email or audience parameter");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendPage(res, "Invalid email address");
  }

  const encodedEmail = encodeURIComponent(email);

  try {
    await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts/${encodedEmail}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unsubscribed: true }),
      }
    );
  } catch (err) {
    console.error("Unsubscribe PATCH failed", err);
  }

  return sendPage(res, email);
}

function sendPage(res, email) {
  const esc = String(email || "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unsubscribed — GitDealFlow</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #f4f6f8;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 24px;
  }
  .card {
    background: #fff;
    border-radius: 16px;
    padding: 48px 40px;
    max-width: 480px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .check {
    width: 64px; height: 64px;
    background: #f0fdf4;
    border-radius: 50%;
    display: inline-flex;
    align-items: center; justify-content: center;
    font-size: 28px;
    margin-bottom: 20px;
  }
  h1 { font-size: 22px; color: #1e293b; margin-bottom: 8px; }
  p { font-size: 15px; color: #64748b; line-height: 1.6; }
  .email { font-weight: 600; color: #1e293b; }
  .footer { margin-top: 24px; font-size: 12px; color: #94a3b8; }
  a { color: #00d4aa; text-decoration: none; }
</style>
</head>
<body>
<div class="card">
  <div class="check">&#10003;</div>
  <h1>You have been unsubscribed</h1>
  <p><span class="email">${esc}</span> has been removed from GitDealFlow.</p>
  <p>You will no longer receive the weekly Signal Digest or onboarding emails.</p>
  <p class="footer"><a href="https://gitdealflow.com">gitdealflow.com</a></p>
</div>
</body>
</html>`);
}
