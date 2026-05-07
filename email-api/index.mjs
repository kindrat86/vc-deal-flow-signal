import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { isExcluded } from "./excluded-emails.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env
try {
  const envFile = readFileSync(join(__dirname, ".env"), "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (key) process.env[key] = value;
  }
} catch (e) {
  console.error("Warning: Could not load .env file:", e.message);
}

// Sanitize values used in PocketBase filter strings to prevent injection
function sanitizeForPbFilter(value) {
  return value.replace(/[^a-zA-Z0-9.@+_\-]/g, '');
}

// Escape HTML to prevent XSS in email templates
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const {
  RESEND_API_KEY,
  PB_URL,
  PB_EMAIL,
  PB_PASSWORD,
  FROM_EMAIL,
  FROM_NAME,
  API_SECRET,
} = process.env;

const resend = new Resend(RESEND_API_KEY);
const app = new Hono();

// CORS for landing page
app.use(
  "*",
  cors({
    origin: [
      "https://gitdealflow.com",
      "https://www.gitdealflow.com",
      "https://signals.gitdealflow.com",
      ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:8080'] : []),
    ],
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// --- Pocketbase helpers ---

let pbToken = null;
let pbTokenExpiry = 0;

async function pbAuth() {
  if (pbToken && Date.now() < pbTokenExpiry) return pbToken;
  const res = await fetch(
    `${PB_URL}/api/collections/_superusers/auth-with-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: PB_EMAIL, password: PB_PASSWORD }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PocketBase auth failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  pbToken = data.token;
  pbTokenExpiry = Date.now() + 3600_000; // 1 hour
  return pbToken;
}

async function pbFetch(path, options = {}) {
  const token = await pbAuth();
  const res = await fetch(`${PB_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PocketBase API error ${res.status}: ${text}`);
  }
  return res.json();
}

// --- Rate limiting ---

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.start > RATE_LIMIT_WINDOW * 2) rateLimitMap.delete(ip);
  }
}, 300000);

// --- Routes ---

// Health check
app.get("/health", (c) => c.json({ ok: true }));

// Subscribe endpoint
app.post("/subscribe", async (c) => {
  const clientIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return c.json({ error: 'Too many requests' }, 429);
  }

  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body" }, 400);
  }
  const email = (body.email || "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: "Invalid email" }, 400);
  }

  const name = String(body.name || "").slice(0, 200).replace(/[\x00-\x1f]/g, "");
  const subscriberSource = String(body.source || "landing-page").slice(0, 100).replace(/[\x00-\x1f]/g, "");

  // Check if already exists — sanitize email for PocketBase filter
  const safeEmail = sanitizeForPbFilter(email);
  const existing = await pbFetch(
    `/api/collections/subscribers/records?filter=(email='${safeEmail}')&perPage=1`
  );

  if (existing.items && existing.items.length > 0) {
    const sub = existing.items[0];
    if (sub.status === "active") {
      return c.json({ ok: true, message: "Already subscribed" });
    }
    // Reactivate
    await pbFetch(`/api/collections/subscribers/records/${sub.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "active" }),
    });
    return c.json({ ok: true, message: "Reactivated" });
  }
  await pbFetch("/api/collections/subscribers/records", {
    method: "POST",
    body: JSON.stringify({
      email,
      name,
      tier: "free",
      status: "active",
      source: subscriberSource,
    }),
  });

  // Notify admin of new subscriber (fire and forget)
  resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: "signal@gitdealflow.com",
    subject: `New subscriber: ${email}`,
    html: `<p><strong>New signup on gitdealflow.com</strong></p>
<p>Email: ${escapeHtml(email)}</p>
<p>Name: ${escapeHtml(name) || "(none)"}</p>
<p>Source: ${escapeHtml(subscriberSource)}</p>
<p>Time: ${new Date().toISOString()}</p>`,
  }).catch((err) => console.error("Admin notification failed:", err.message));

  // Send welcome email immediately (soap-opera-1) — skip excluded addresses
  const seq = isExcluded(email)
    ? { items: [] }
    : await pbFetch(
        `/api/collections/email_sequences/records?filter=(key='soap-opera-1')&perPage=1`
      );
  if (seq.items && seq.items.length > 0) {
    const welcomeEmail = seq.items[0];
    try {
      const sent = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject: welcomeEmail.subject,
        html: wrapEmailHtml(welcomeEmail.body_html),
        headers: {
          "List-Unsubscribe": "<mailto:signal@gitdealflow.com?subject=Unsubscribe>",
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      // Log it
      const newSub = await pbFetch(
        `/api/collections/subscribers/records?filter=(email='${safeEmail}')&perPage=1`
      );
      if (newSub.items && newSub.items.length > 0) {
        await pbFetch("/api/collections/email_log/records", {
          method: "POST",
          body: JSON.stringify({
            subscriber: newSub.items[0].id,
            email_key: "soap-opera-1",
            subject: welcomeEmail.subject,
            resend_id: sent.data?.id || "",
            status: "sent",
            sent_at: new Date().toISOString(),
          }),
        });
      }
    } catch (err) {
      console.error("Failed to send welcome email:", err.message);
    }
  }

  return c.json({ ok: true, message: "Subscribed" });
});

// Cron: send pending drip emails
app.post("/cron/send-emails", async (c) => {
  const secret = c.req.header("Authorization");
  if (secret !== `Bearer ${API_SECRET}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get all active subscribers
  let page = 1;
  let allSubscribers = [];
  while (true) {
    const res = await pbFetch(
      `/api/collections/subscribers/records?filter=(status='active')&perPage=100&page=${page}`
    );
    allSubscribers = allSubscribers.concat(res.items || []);
    if (!res.items || res.items.length < 100) break;
    page++;
  }

  // Get all email sequences sorted by day
  const sequences = await pbFetch(
    `/api/collections/email_sequences/records?sort=day&perPage=100`
  );
  const allSequences = sequences.items || [];

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const sub of allSubscribers) {
    if (isExcluded(sub.email)) {
      skipped++;
      continue;
    }
    const daysSinceSignup = Math.floor(
      (Date.now() - new Date(sub.created).getTime()) / 86400_000
    );

    // Get emails already sent to this subscriber
    const safeSubId = sanitizeForPbFilter(sub.id);
    const sentEmails = await pbFetch(
      `/api/collections/email_log/records?filter=(subscriber='${safeSubId}' %26%26 (status='sent' || status='failed'))&perPage=100`
    );
    const sentKeys = new Set(
      (sentEmails.items || []).map((e) => e.email_key)
    );

    // Find the next email to send (matching tier, day <= daysSinceSignup, not yet sent)
    const eligible = allSequences.filter(
      (seq) =>
        (seq.tier === sub.tier || seq.tier === "free") &&
        seq.day <= daysSinceSignup &&
        !sentKeys.has(seq.key)
    );

    // Send only the first eligible (one email per cron run per subscriber)
    if (eligible.length === 0) {
      skipped++;
      continue;
    }

    const nextEmail = eligible[0];

    try {
      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: sub.email,
        subject: nextEmail.subject,
        html: wrapEmailHtml(nextEmail.body_html),
        headers: {
          "List-Unsubscribe": "<mailto:signal@gitdealflow.com?subject=Unsubscribe>",
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      await pbFetch("/api/collections/email_log/records", {
        method: "POST",
        body: JSON.stringify({
          subscriber: sub.id,
          email_key: nextEmail.key,
          subject: nextEmail.subject,
          resend_id: result.data?.id || "",
          status: "sent",
          sent_at: new Date().toISOString(),
        }),
      });

      sent++;
    } catch (err) {
      console.error(`Failed to send ${nextEmail.key} to ${sub.email}:`, err.message);

      await pbFetch("/api/collections/email_log/records", {
        method: "POST",
        body: JSON.stringify({
          subscriber: sub.id,
          email_key: nextEmail.key,
          subject: nextEmail.subject,
          status: "failed",
        }),
      });

      errors++;
    }
  }

  return c.json({
    ok: true,
    subscribers: allSubscribers.length,
    sent,
    skipped,
    errors,
  });
});

// Email HTML wrapper
function wrapEmailHtml(bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f8fafc; color:#1e293b; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px; margin:0 auto; padding:32px 24px;">
    <div style="margin-bottom:24px;">
      <strong style="color:#0ea5e9; font-size:14px; letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong>
    </div>
    <div style="font-size:16px; line-height:1.7; color:#1e293b;">
      ${bodyHtml}
    </div>
    <div style="margin-top:40px; padding-top:20px; border-top:1px solid #e2e8f0; font-size:12px; color:#94a3b8;">
      <p>You're receiving this because you signed up at <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
      <p><a href="https://gitdealflow.com" style="color:#0ea5e9;">Visit Dashboard</a> · To unsubscribe, reply to this email with "unsubscribe" or <a href="mailto:signal@gitdealflow.com?subject=Unsubscribe" style="color:#0ea5e9;">click here</a>.</p>
    </div>
  </div>
</body>
</html>`;
}

// Unsubscribe endpoint
app.get("/unsubscribe", async (c) => {
  const email = c.req.query("email");
  if (!email) return c.html("<h1>Invalid unsubscribe link</h1>", 400);

  const safeEmail = sanitizeForPbFilter(email);
  try {
    const existing = await pbFetch(
      `/api/collections/subscribers/records?filter=(email='${safeEmail}')&perPage=1`
    );
    if (existing.items && existing.items.length > 0) {
      await pbFetch(`/api/collections/subscribers/records/${existing.items[0].id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "unsubscribed" }),
      });
    }
  } catch (err) {
    console.error("Unsubscribe error:", err.message);
  }

  return c.html(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Unsubscribed</title></head><body style="font-family:sans-serif;max-width:500px;margin:80px auto;text-align:center;"><h1>You've been unsubscribed</h1><p>You will no longer receive emails from VC Deal Flow Signal.</p><p><a href="https://gitdealflow.com">Back to gitdealflow.com</a></p></body></html>`);
});

// Start server
serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`Email API running on http://127.0.0.1:${info.port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});
