#!/usr/bin/env node
/**
 * Sync inbound engagement events (replies / likes / reposts / quotes on the
 * owner's posts) into the PocketBase `engagement_events` collection.
 *
 * This is the "v2 scraper" writer that the PB-backed dashboard was built to
 * consume (see dashboard.html: scoreOf / scoreBreakdown / EVENTS_BY_CONTACT).
 * The READING half — pulling notification events off x.com — is done by a
 * Claude task driving Chrome MCP (see engagement-cron-prompt.md), which dumps
 * a flat JSON array into `engagement-scratch.json`. This script is the pure,
 * headless WRITE half: scratch JSON -> PB, with dedupe and scoring.
 *
 * Scratch shape (engagement-scratch.json): a JSON array of events
 *   [
 *     {
 *       "handle": "nikunj",            // engager's x handle, no @ (required)
 *       "type": "reply",              // like | reply | repost | quote (required)
 *       "tweet_id": "1788...",        // id of YOUR post they engaged with (required)
 *       "tweet_url": "https://x.com/data_nerd/status/1788...",  // optional
 *       "tweet_excerpt": "first words of your post...",         // optional, <=300
 *       "occurred_at": "2026-05-29T14:03:00Z"                   // optional ISO8601
 *     },
 *     ...
 *   ]
 *
 * Idempotent. Dedupe key is (contact, type, tweet_id) — one like / one repost /
 * one reply per person per post counts once, no matter how many times we
 * re-scrape. Re-running the same scratch is a no-op.
 *
 * Contact matching: events are matched to an existing PB contact by x_handle
 * (case-insensitive). Unmatched handles are LOGGED, not inserted — the
 * dashboard scores per existing contact, and silently spawning contacts would
 * pollute the kanban. Pass --create-missing to instead create a lightweight
 * contact (discovered_via="engagement-scrape") so new engagers surface.
 *
 * Usage:
 *   node sync-engagement.mjs [path-to-scratch.json] [--create-missing] [--dry-run]
 * Creds: PB_EMAIL + PB_PASSWORD env vars, else monitoring/dream-customers/.env.local,
 * else email-api/.env (same resolution order as build.mjs / launch.py).
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

// Weighting: higher-effort, higher-intent signals score more. A reply or a
// quote is someone spending words on you; a repost is a public endorsement; a
// like is the cheapest ambient signal. Tune here — the dashboard just sums.
const SCORE_WEIGHTS = { reply: 3, quote: 3, repost: 2, like: 1 };
const VALID_TYPES = new Set(Object.keys(SCORE_WEIGHTS));

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));
const scratchPath = positional[0] || join(here, "engagement-scratch.json");
const CREATE_MISSING = flags.has("--create-missing");
const DRY_RUN = flags.has("--dry-run");

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
  const candidates = [join(here, ".env.local"), join(repoRoot, "email-api", ".env")];
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

async function pb(url, token, path, opts = {}) {
  const res = await fetch(`${url}${path}`, {
    method: opts.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(opts.body ? { "Content-Type": "application/json" } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(`${opts.method || "GET"} ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

// Build a handle -> contact map once (cheaper than N filtered lookups).
async function loadContactsByHandle(url, token) {
  const map = new Map();
  let page = 1;
  for (;;) {
    const data = await pb(url, token, `/api/collections/contacts/records?perPage=500&page=${page}`);
    for (const c of data.items) map.set((c.x_handle || "").toLowerCase(), c);
    if (page >= data.totalPages) break;
    page++;
  }
  return map;
}

// Existing dedupe keys so re-runs don't double-insert.
async function loadExistingKeys(url, token) {
  const keys = new Set();
  let page = 1;
  for (;;) {
    const data = await pb(
      url,
      token,
      `/api/collections/engagement_events/records?perPage=500&page=${page}&fields=contact,type,tweet_id`,
    );
    for (const e of data.items) keys.add(`${e.contact}|${e.type}|${e.tweet_id}`);
    if (page >= data.totalPages) break;
    page++;
  }
  return keys;
}

async function createContact(url, token, handle) {
  return pb(url, token, "/api/collections/contacts/records", {
    method: "POST",
    body: {
      x_handle: handle,
      display_name: handle,
      discovered_via: "engagement-scrape",
      segment: "",
      confidence: "",
      stage: "",
      dream_customer: false,
    },
  });
}

function normalizeEvent(raw, i) {
  const handle = String(raw.handle || "").trim().replace(/^@/, "");
  const type = String(raw.type || "").trim().toLowerCase();
  const tweetId = String(raw.tweet_id || "").trim();
  const errs = [];
  if (!handle) errs.push("missing handle");
  if (!VALID_TYPES.has(type)) errs.push(`bad type "${raw.type}" (want ${[...VALID_TYPES].join("/")})`);
  if (!tweetId) errs.push("missing tweet_id");
  return {
    ok: errs.length === 0,
    errs,
    index: i,
    handle,
    type,
    tweetId,
    tweetUrl: raw.tweet_url ? String(raw.tweet_url).slice(0, 500) : "",
    excerpt: raw.tweet_excerpt ? String(raw.tweet_excerpt).slice(0, 300) : "",
    occurredAt: raw.occurred_at || "",
  };
}

async function main() {
  if (!existsSync(scratchPath)) {
    console.log(`no scratch at ${scratchPath} — nothing to sync`);
    return;
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(scratchPath, "utf8"));
  } catch (e) {
    throw new Error(`scratch JSON is not parseable (${e.message}). Did the scrape write a half file?`);
  }
  const events = Array.isArray(parsed) ? parsed : parsed.events;
  if (!Array.isArray(events)) {
    throw new Error("scratch must be a JSON array of events, or {events:[...]}");
  }

  const creds = loadEnv();
  const token = await auth(creds.url, creds.email, creds.password);
  const byHandle = await loadContactsByHandle(creds.url, token);
  const existing = await loadExistingKeys(creds.url, token);

  let inserted = 0;
  let dupes = 0;
  let createdContacts = 0;
  const unmatched = new Set();
  const invalid = [];

  for (let i = 0; i < events.length; i++) {
    const ev = normalizeEvent(events[i], i);
    if (!ev.ok) {
      invalid.push(`#${i}: ${ev.errs.join(", ")}`);
      continue;
    }

    let contact = byHandle.get(ev.handle.toLowerCase());
    if (!contact) {
      if (CREATE_MISSING) {
        if (DRY_RUN) {
          createdContacts++;
        } else {
          contact = await createContact(creds.url, token, ev.handle);
          byHandle.set(ev.handle.toLowerCase(), contact);
          createdContacts++;
        }
      } else {
        unmatched.add(ev.handle);
        continue;
      }
    }
    if (!contact) continue; // dry-run create-missing: can't dedupe a phantom id

    const key = `${contact.id}|${ev.type}|${ev.tweetId}`;
    if (existing.has(key)) {
      dupes++;
      continue;
    }

    const body = {
      contact: contact.id,
      direction: "inbound",
      type: ev.type,
      tweet_id: ev.tweetId,
      tweet_url: ev.tweetUrl,
      tweet_excerpt: ev.excerpt,
      score_weight: SCORE_WEIGHTS[ev.type],
    };
    if (ev.occurredAt) body.occurred_at = ev.occurredAt;

    if (DRY_RUN) {
      console.log(`[dry] would insert: @${ev.handle} ${ev.type} on ${ev.tweetId} (+${body.score_weight})`);
    } else {
      await pb(creds.url, token, "/api/collections/engagement_events/records", {
        method: "POST",
        body,
      });
    }
    existing.add(key);
    inserted++;
  }

  const tag = DRY_RUN ? "engagement-sync [DRY RUN]" : "engagement-sync";
  console.log(
    `${tag}: inserted=${inserted} dupes=${dupes} createdContacts=${createdContacts} ` +
      `unmatched=${unmatched.size} invalid=${invalid.length} total=${events.length}`,
  );
  if (unmatched.size) {
    console.log(`  unmatched handles (not in CRM, skipped): ${[...unmatched].map((h) => "@" + h).join(", ")}`);
    console.log(`  -> re-run with --create-missing to surface these as new contacts`);
  }
  if (invalid.length) {
    console.log(`  invalid events:\n    ${invalid.join("\n    ")}`);
  }
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
});
