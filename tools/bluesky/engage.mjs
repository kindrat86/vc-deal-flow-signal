#!/usr/bin/env node
/**
 * Bluesky daily post — pops oldest unused post from post-queue.json,
 * posts via AT Protocol, marks used, updates state.
 *
 * Usage:
 *   node tools/bluesky/engage.mjs            # live post
 *   node tools/bluesky/engage.mjs --dry-run  # show what would post
 *
 * Env (from tools/.env):
 *   BSKY_HANDLE          e.g. thedatanerd.bsky.social
 *   BSKY_APP_PASSWORD    from bsky.app/settings/app-passwords
 *
 * Honors:
 *   tools/campaign/HOLD     hard halt
 *   queue._rules.max_per_day, .min_gap_minutes
 *   Bluesky 300-grapheme cap (Intl.Segmenter)
 */

import { BskyAgent, RichText } from "@atproto/api";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const ENV_FILE = resolve(REPO_ROOT, "tools/.env");
const QUEUE_FILE = resolve(__dirname, "post-queue.json");
const STATE_FILE = resolve(__dirname, "state/state.json");
const HOLD_FILE = resolve(REPO_ROOT, "tools/campaign/HOLD");

const DRY_RUN = process.argv.includes("--dry-run");

function loadEnv() {
  // Headless/CI: no tools/.env — rely on process.env (e.g. GitHub Actions secrets).
  if (!existsSync(ENV_FILE)) return;
  for (const line of readFileSync(ENV_FILE, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const k = trimmed.slice(0, i).trim();
    const v = trimmed.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (k && !process.env[k]) process.env[k] = v;
  }
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function loadJson(path, def) {
  if (!existsSync(path)) return def;
  return JSON.parse(readFileSync(path, "utf-8"));
}

function saveJson(path, data) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

function graphemeLen(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const seg = new Intl.Segmenter("en", { granularity: "grapheme" });
    return [...seg.segment(text)].length;
  }
  return [...text].length;
}

async function main() {
  if (existsSync(HOLD_FILE)) {
    console.log(`[bsky] HOLD file exists at ${HOLD_FILE} — aborting.`);
    process.exit(0);
  }

  loadEnv();
  const handle = process.env.BSKY_HANDLE;
  const password = process.env.BSKY_APP_PASSWORD;
  if (!handle || !password) {
    throw new Error("BSKY_HANDLE / BSKY_APP_PASSWORD not set (tools/.env or environment)");
  }

  const queue = loadJson(QUEUE_FILE, null);
  if (!queue || !Array.isArray(queue.posts)) {
    throw new Error(`Invalid queue file: ${QUEUE_FILE}`);
  }

  const state = loadJson(STATE_FILE, {
    posted_today: 0,
    last_post_iso: null,
    day_iso: todayUtc(),
    posted_ids: [],
  });

  const today = todayUtc();
  if (state.day_iso !== today) {
    state.day_iso = today;
    state.posted_today = 0;
  }

  const maxPerDay = queue._rules?.max_per_day ?? 2;
  if (state.posted_today >= maxPerDay) {
    console.log(`[bsky] Already posted ${state.posted_today}/${maxPerDay} today. Skip.`);
    return;
  }

  const minGapMin = queue._rules?.min_gap_minutes ?? 240;
  if (state.last_post_iso) {
    const gapMs = Date.now() - new Date(state.last_post_iso).getTime();
    if (gapMs < minGapMin * 60_000) {
      const wait = Math.ceil((minGapMin * 60_000 - gapMs) / 60_000);
      console.log(`[bsky] Min gap not met. ${wait}min until next eligible.`);
      return;
    }
  }

  const candidate = queue.posts.find((p) => (p.use_count ?? 0) === 0);
  if (!candidate) {
    console.log("[bsky] No unused posts in queue. Refill needed.");
    return;
  }

  const len = graphemeLen(candidate.text);
  if (len > 300) {
    console.log(`[bsky] Post "${candidate.id}" exceeds 300 graphemes (${len}). Marking skip.`);
    candidate.use_count = -1;
    candidate.skip_reason = `grapheme_overflow_${len}`;
    saveJson(QUEUE_FILE, queue);
    return;
  }

  console.log(`[bsky] Picked "${candidate.id}" (${len} graphemes).`);

  if (DRY_RUN) {
    console.log("[bsky] DRY RUN — would post:");
    console.log("---");
    console.log(candidate.text);
    console.log("---");
    return;
  }

  const agent = new BskyAgent({ service: "https://bsky.social" });
  await agent.login({ identifier: handle, password });

  const rt = new RichText({ text: candidate.text });
  await rt.detectFacets(agent);

  const result = await agent.post({
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString(),
  });

  const did = agent.session?.did;
  const rkey = result.uri.split("/").pop();
  const webUrl = did ? `https://bsky.app/profile/${did}/post/${rkey}` : null;
  console.log(`[bsky] Posted. URI: ${result.uri}`);
  if (webUrl) console.log(`[bsky] Web URL: ${webUrl}`);

  candidate.use_count = (candidate.use_count ?? 0) + 1;
  candidate.last_used = new Date().toISOString();
  saveJson(QUEUE_FILE, queue);

  state.posted_today += 1;
  state.last_post_iso = new Date().toISOString();
  state.posted_ids.push({
    id: candidate.id,
    uri: result.uri,
    web_url: webUrl,
    at: state.last_post_iso,
  });
  saveJson(STATE_FILE, state);
}

main().catch((e) => {
  console.error("[bsky] FAIL:", e?.message || e);
  process.exit(1);
});
