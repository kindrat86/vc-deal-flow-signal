#!/usr/bin/env node
/**
 * Sync tweet signals from data.json into PocketBase `contacts`.
 *
 * Previously this script regenerated dashboard.html from data.json. The
 * dashboard is now PB-backed (reads contacts + engagement_events live), so
 * the HTML no longer needs (or wants) to be rebuilt — doing so would clobber
 * the PB-aware version.
 *
 * What this script does now:
 *   - reads data.json (still the cron's tweet-scrape scratch)
 *   - upserts each contact's last_tweet_at / last_tweet_text / last_checked_at
 *     into the PB contacts collection, matched by x_handle
 *   - NEVER touches stage, dream_customer, notes, or other user state
 *
 * Idempotent. Safe to run on every cron tick.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = join(here, "data.json");
const repoRoot = resolve(here, "..", "..");

function parseEnv(text) {
  const env = {};
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [k, ...rest] = line.split("=");
    let v = rest.join("=").trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[k.trim()] = v;
  }
  return env;
}

function loadEnv() {
  if (process.env.PB_EMAIL && process.env.PB_PASSWORD) {
    return {
      url: process.env.PB_URL || "http://127.0.0.1:8090",
      email: process.env.PB_EMAIL,
      password: process.env.PB_PASSWORD,
    };
  }
  const candidates = [
    join(here, ".env.local"),
    join(repoRoot, "email-api", ".env"),
  ];
  for (const path of candidates) {
    if (existsSync(path)) {
      const env = parseEnv(readFileSync(path, "utf8"));
      if (env.PB_EMAIL && env.PB_PASSWORD) {
        return {
          url: env.PB_URL || "http://127.0.0.1:8090",
          email: env.PB_EMAIL,
          password: env.PB_PASSWORD,
        };
      }
    }
  }
  throw new Error(
    `No PB creds. Set PB_EMAIL+PB_PASSWORD env vars or populate one of: ${candidates.join(", ")}`,
  );
}

async function auth(url, email, password) {
  const res = await fetch(`${url}/api/collections/_superusers/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: email, password }),
  });
  if (!res.ok) throw new Error(`PB auth failed: ${res.status} ${await res.text()}`);
  return (await res.json()).token;
}

async function findByHandle(url, token, handle) {
  const filter = encodeURIComponent(`x_handle="${handle}"`);
  const res = await fetch(`${url}/api/collections/contacts/records?perPage=1&filter=${filter}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`find ${handle}: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.items?.[0] || null;
}

async function patchContact(url, token, id, body) {
  const res = await fetch(`${url}/api/collections/contacts/records/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`patch ${id}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const creds = loadEnv();
  const token = await auth(creds.url, creds.email, creds.password);

  if (!existsSync(dataPath)) {
    console.log(`no data.json at ${dataPath} — nothing to sync`);
    return;
  }
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  const contacts = data.contacts || [];

  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const c of contacts) {
    const handle = (c.handle || "").trim();
    if (!handle) {
      skipped++;
      continue;
    }
    const record = await findByHandle(creds.url, token, handle);
    if (!record) {
      // Contact in data.json but not in PB — run migrate-json-to-pb.py first.
      missing++;
      continue;
    }
    // Only push tweet-signal fields that are actually set in data.json.
    // Null/missing source values mean "cron hasn't observed anything" — leave
    // PB's existing values alone. Never touch stage/dream_customer/notes.
    const payload = {};
    if (c.last_tweet_at) payload.last_tweet_at = c.last_tweet_at;
    if (c.last_tweet_text) payload.last_tweet_text = String(c.last_tweet_text).slice(0, 1000);
    if (c.last_checked_at) payload.last_checked_at = c.last_checked_at;
    if (Object.keys(payload).length === 0) {
      skipped++;
      continue;
    }
    await patchContact(creds.url, token, record.id, payload);
    updated++;
  }

  console.log(`pb-sync: updated=${updated} skipped=${skipped} missing=${missing} total=${contacts.length}`);
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
});
