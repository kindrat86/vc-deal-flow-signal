#!/usr/bin/env node
// Auto-bump for tracks with a `keepalive` config — guards against
// auto-stale loops on PRs (specifically Raycast's `raycastbot` which
// auto-stales after 7 days inactivity and auto-closes after another 7).
//
// Designed to run AFTER check.mjs as the second stage of the daily cron.
// Idempotent: tracks lastBumpAt in state.json per track, refuses to bump
// inside minBumpGapDays.
//
// Track config (in tracks.json):
//   "keepalive": {
//     "afterDays": 6,         // days of inactivity before bumping
//     "minBumpGapDays": 6,    // refuse to re-bump within this window
//     "comment": "<bump body>"
//   }
//
// Usage:
//   node tools/llm-marketplaces-watcher/keepalive.mjs [--dry-run]

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const ENV_PATH = resolve(REPO_ROOT, "tools", ".env");
const TRACKS_PATH = resolve(__dirname, "tracks.json");
const STATE_PATH = resolve(__dirname, "state.json");

try {
  const envFile = readFileSync(ENV_PATH, "utf-8");
  for (const line of envFile.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (k && !process.env[k]) process.env[k] = v;
  }
} catch {}

const DRY_RUN = process.argv.includes("--dry-run");
const NOW = new Date();
const NOW_ISO = NOW.toISOString();

const tracks = JSON.parse(readFileSync(TRACKS_PATH, "utf-8")).tracks;
const state = existsSync(STATE_PATH)
  ? JSON.parse(readFileSync(STATE_PATH, "utf-8"))
  : { version: 1, trackStates: {}, processedEmailUids: {}, lastCheckedAt: null };

const actions = [];
const errors = [];

function ghJson(cmd) {
  try {
    return JSON.parse(execSync(cmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }));
  } catch (err) {
    return { error: err.message };
  }
}

function daysBetween(aIso, bIso) {
  return (new Date(bIso).getTime() - new Date(aIso).getTime()) / 86400000;
}

for (const track of tracks) {
  if (!track.keepalive) continue;
  if (track.type !== "github_issue") continue;
  if (track.status === "accepted" || track.status === "rejected" || track.status === "closed_moratorium") {
    continue;
  }

  const k = track.keepalive;
  const afterDays = k.afterDays ?? 6;
  const minGap = k.minBumpGapDays ?? afterDays;
  const comment = k.comment;
  if (!comment) {
    errors.push({ track: track.id, error: "keepalive.comment missing" });
    continue;
  }

  // Last activity on the PR
  const view = ghJson(
    `gh pr view ${track.issueNumber} -R ${track.repo} --json updatedAt,state,comments,reviews,title 2>&1`
  );
  if (view.error) {
    errors.push({ track: track.id, error: view.error });
    continue;
  }
  if (view.state !== "OPEN") {
    actions.push({ track: track.id, action: "skip", reason: `PR state is ${view.state}` });
    continue;
  }

  const allEvents = [view.updatedAt];
  for (const c of view.comments || []) allEvents.push(c.createdAt || c.updatedAt);
  for (const r of view.reviews || []) allEvents.push(r.submittedAt);
  const lastActivity = allEvents.filter(Boolean).sort().pop() || view.updatedAt;
  const daysSince = daysBetween(lastActivity, NOW_ISO);

  const trackState = state.trackStates[track.id] || {};
  const lastBumpAt = trackState.lastKeepaliveBumpAt;
  const sinceLastBump = lastBumpAt ? daysBetween(lastBumpAt, NOW_ISO) : Infinity;

  if (daysSince < afterDays) {
    actions.push({
      track: track.id,
      action: "skip",
      reason: `last activity ${daysSince.toFixed(1)}d ago < afterDays=${afterDays}`,
    });
    continue;
  }
  if (sinceLastBump < minGap) {
    actions.push({
      track: track.id,
      action: "skip",
      reason: `last bump ${sinceLastBump.toFixed(1)}d ago < minBumpGapDays=${minGap}`,
    });
    continue;
  }

  // Bump
  if (DRY_RUN) {
    actions.push({
      track: track.id,
      action: "would-bump",
      lastActivityDaysAgo: +daysSince.toFixed(1),
      sinceLastBumpDays: sinceLastBump === Infinity ? null : +sinceLastBump.toFixed(1),
      comment,
    });
  } else {
    try {
      const out = execSync(
        `gh pr comment ${track.issueNumber} -R ${track.repo} --body ${JSON.stringify(comment)}`,
        { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
      ).trim();
      state.trackStates[track.id] = {
        ...(state.trackStates[track.id] || {}),
        lastKeepaliveBumpAt: NOW_ISO,
        lastKeepaliveBumpUrl: out,
      };
      actions.push({
        track: track.id,
        action: "bumped",
        lastActivityDaysAgo: +daysSince.toFixed(1),
        url: out,
      });
    } catch (err) {
      errors.push({ track: track.id, error: err.message });
    }
  }
}

if (!DRY_RUN && actions.some((a) => a.action === "bumped")) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

console.log(
  JSON.stringify(
    {
      ranAt: NOW_ISO,
      tracksWithKeepalive: tracks.filter((t) => t.keepalive).length,
      actions,
      errors,
      dryRun: DRY_RUN,
    },
    null,
    2
  )
);
process.exit(0);
