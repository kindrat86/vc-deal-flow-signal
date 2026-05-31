#!/usr/bin/env node
/**
 * suppress-unsubscribes.mjs — move manual email opt-outs into the real
 * suppression store(s), and OUT of the flat file pseo-site/data/unsubscribed-emails.json.
 *
 * WHY THIS EXISTS
 * ---------------
 * Opt-out (unsubscribe) state is compliance-sensitive PII (CAN-SPAM / GDPR
 * suppression list). It must live in the systems that actually gate sends —
 * never in a flat JSON file in the repo.
 *
 * Source of truth = Resend audience (`unsubscribed: true`). The hourly
 * Resend→PocketBase sync (monitoring/sync-resend-to-pb.py) then mirrors that
 * into the PB `subscribers` collection, which the weekly digest sender
 * (email-api/send-weekly-digest.mjs, `filter=(status='active')`) reads.
 *
 * The legacy flat file pseo-site/data/unsubscribed-emails.json only fed the
 * stats dashboard (monitoring/build-dashboard.py) — it NEVER suppressed an
 * actual send. So anyone who only landed in that file may still be receiving
 * the digest. This script closes that gap.
 *
 * USAGE
 * -----
 *   # Dry run (default) — reads the local flat file, shows what it WOULD do:
 *   node pseo-site/scripts/suppress-unsubscribes.mjs
 *
 *   # Specific addresses instead of the file:
 *   node pseo-site/scripts/suppress-unsubscribes.mjs --email a@x.com --email b@y.com
 *
 *   # Apply for real (Resend + PB mirror if PB creds present):
 *   node pseo-site/scripts/suppress-unsubscribes.mjs --send
 *
 *   # Resend only (skip the PB mirror write — relies on the hourly sync):
 *   node pseo-site/scripts/suppress-unsubscribes.mjs --send --no-pb
 *
 * ENV
 * ---
 *   RESEND_API_KEY        (required)
 *   RESEND_AUDIENCE_ID    (optional — else the first audience is used)
 *   POCKETBASE_URL        (optional — enables the PB `subscribers` mirror write)
 *   POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD  (PB superuser auth)
 *
 * SAFETY
 * ------
 *   - Dry run unless --send is passed.
 *   - Idempotent: marking an already-unsubscribed contact is a no-op.
 *   - Never prints full addresses to shared logs — emails are masked.
 *   - No email addresses are hardcoded in this file.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const FLAT_FILE = join(REPO_ROOT, "pseo-site", "data", "unsubscribed-emails.json");

const argv = process.argv.slice(2);
const SEND = argv.includes("--send");
const NO_PB = argv.includes("--no-pb");
const emailArgs = argv.reduce((acc, a, i) => {
  if (a === "--email" && argv[i + 1]) acc.push(argv[i + 1].trim().toLowerCase());
  return acc;
}, []);

const { RESEND_API_KEY, RESEND_AUDIENCE_ID, POCKETBASE_URL } = process.env;
const PB_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PB_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

function mask(email) {
  const [u, d] = String(email).split("@");
  if (!d) return "***";
  return `${u.slice(0, 2)}***@${d}`;
}
function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

/** Collect the target emails: CLI args win, else the local flat file. */
function loadEmails() {
  if (emailArgs.length) return [...new Set(emailArgs)];
  if (!existsSync(FLAT_FILE)) {
    die(
      `No --email args and no flat file at ${FLAT_FILE}.\n` +
        `  Pass addresses explicitly or run from a checkout that still has the (gitignored) file.`
    );
  }
  const parsed = JSON.parse(readFileSync(FLAT_FILE, "utf-8"));
  const list = (parsed.emails || parsed || [])
    .map((e) => (typeof e === "string" ? e : e.email))
    .filter(Boolean)
    .map((e) => e.trim().toLowerCase());
  return [...new Set(list)];
}

async function resend(path, init = {}) {
  const res = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  return { ok: res.ok, status: res.status, body };
}

async function resolveAudienceId() {
  if (RESEND_AUDIENCE_ID) return RESEND_AUDIENCE_ID;
  const { ok, body } = await resend("/audiences");
  if (!ok || !body.data?.[0]?.id) die("Could not resolve a Resend audience id.");
  return body.data[0].id;
}

/** PocketBase superuser auth → returns a bearer token, or null if not configured. */
async function pbAuth() {
  if (NO_PB || !POCKETBASE_URL || !PB_EMAIL || !PB_PASSWORD) return null;
  const res = await fetch(
    `${POCKETBASE_URL}/api/collections/_superusers/auth-with-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: PB_EMAIL, password: PB_PASSWORD }),
    }
  );
  if (!res.ok) {
    console.warn("⚠ PB auth failed — skipping the PB mirror write (Resend→PB hourly sync will catch up).");
    return null;
  }
  return (await res.json()).token;
}

async function pbMarkUnsubscribed(token, email) {
  const f = encodeURIComponent(`email='${email.replace(/'/g, "")}'`);
  const found = await fetch(
    `${POCKETBASE_URL}/api/collections/subscribers/records?filter=(${f})&perPage=1`,
    { headers: { Authorization: token } }
  ).then((r) => (r.ok ? r.json() : { items: [] }));
  const rec = found.items?.[0];
  if (!rec) return "not-in-pb";
  if (rec.status === "unsubscribed") return "already";
  const res = await fetch(
    `${POCKETBASE_URL}/api/collections/subscribers/records/${rec.id}`,
    {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "unsubscribed" }),
    }
  );
  return res.ok ? "updated" : `pb-error-${res.status}`;
}

async function main() {
  if (!RESEND_API_KEY) die("RESEND_API_KEY is required.");
  const emails = loadEmails();
  if (!emails.length) die("No emails to process.");

  const audienceId = await resolveAudienceId();
  const pbToken = await pbAuth();
  console.log(
    `${SEND ? "APPLYING" : "DRY RUN"} — ${emails.length} address(es) · audience ${audienceId}` +
      `${pbToken ? " · PB mirror ON" : " · PB mirror off"}\n`
  );

  for (const email of emails) {
    if (!SEND) {
      console.log(`  would suppress  ${mask(email)}  (Resend unsubscribed:true${pbToken ? " + PB status:unsubscribed" : ""})`);
      continue;
    }
    // Resend: update the contact by email → unsubscribed:true (idempotent).
    const upd = await resend(`/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`, {
      method: "PATCH",
      body: JSON.stringify({ unsubscribed: true }),
    });
    let resendState = upd.ok ? "resend:unsubscribed" : `resend:err-${upd.status}`;
    // 404 → contact not in the audience; nothing to suppress there.
    if (!upd.ok && upd.status === 404) resendState = "resend:not-in-audience";

    let pbState = pbToken ? await pbMarkUnsubscribed(pbToken, email) : "pb:skipped";
    console.log(`  ${mask(email).padEnd(22)} ${resendState.padEnd(26)} pb:${pbState}`);
  }

  if (!SEND) {
    console.log(`\nNothing changed. Re-run with --send to apply.`);
  } else {
    console.log(`\nDone. Verify in Resend (audience → contacts) and, if mirrored, PB subscribers.`);
    console.log(`Then delete pseo-site/data/unsubscribed-emails.json (it is gitignored) — it no longer drives anything.`);
  }
}

main().catch((e) => die(e.stack || e.message));
