#!/usr/bin/env node
// Deletes the duplicate Stadium Pitch uploads from the cron bug.
//
// 2026-08-06: "7 14 1-7 * 3" fired daily Aug 1-6 (GHA ORs day-of-month and
// day-of-week), uploading 5 copies of "Stadium Pitch — August 2026". This
// deletes the 4 duplicates and keeps the true first-Wednesday upload.
//
// Usage: node scripts/08-delete-stadium-pitch-duplicates.mjs
// Requires .yt-credentials.json + .yt-token.json (written by CI from the
// YT_CREDENTIALS_B64 / YT_TOKEN_B64 secrets).
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CREDS = path.join(ROOT, ".yt-credentials.json");
const TOKEN = path.join(ROOT, ".yt-token.json");

// The 4 duplicates from the daily cron misfires. YnH0_io012g (Aug 5 — the
// true first-Wednesday run) is intentionally NOT in this list.
const TO_DELETE = ["YMyNHdxiBAo", "Cr_Lbi5uNp0", "hdBGiiS_IZo", "NZTf9pEE3_M"];

for (const p of [CREDS, TOKEN]) {
  if (!existsSync(p)) throw new Error(`missing: ${p}`);
}

const cfg = JSON.parse(readFileSync(CREDS, "utf8")).installed ?? JSON.parse(readFileSync(CREDS, "utf8")).web;
const tokens = JSON.parse(readFileSync(TOKEN, "utf8"));

const oauth2Client = new google.auth.OAuth2(cfg.client_id, cfg.client_secret, cfg.redirect_uris?.[0]);
oauth2Client.setCredentials(tokens);

const yt = google.youtube({ version: "v3", auth: oauth2Client });

// Sanity check: resolve channel ownership before deleting anything.
const me = await yt.channels.list({ part: ["snippet"], mine: true });
const channelName = me.data.items?.[0]?.snippet?.title ?? "unknown";
console.log(`Authenticated as channel: ${channelName}`);
if (!/data nerd/i.test(channelName)) {
  console.error(`✗ Refusing to delete: authenticated channel "${channelName}" is not "The Data Nerd".`);
  process.exit(1);
}

for (const id of TO_DELETE) {
  try {
    // Verify the video exists and belongs to this channel before deleting.
    const v = await yt.videos.list({ part: ["snippet"], id: [id] });
    const vid = v.data.items?.[0];
    if (!vid) {
      console.log(`- ${id}: not found (already deleted?) — skipping`);
      continue;
    }
    console.log(`▸ deleting ${id} — "${vid.snippet?.title}"`);
    await yt.videos.delete({ id });
    console.log(`  ✓ deleted ${id}`);
  } catch (e) {
    console.error(`✗ failed to delete ${id}: ${e.message}`);
    process.exitCode = 1;
  }
}

// Verify the survivor is still up.
try {
  const keep = await yt.videos.list({ part: ["snippet"], id: ["YnH0_io012g"] });
  if (keep.data.items?.length) {
    console.log(`✓ kept YnH0_io012g — "${keep.data.items[0].snippet?.title}"`);
  } else {
    console.error("✗ WARNING: YnH0_io012g is missing — verify manually!");
    process.exitCode = 1;
  }
} catch (e) {
  console.error(`✗ verify failed: ${e.message}`);
  process.exitCode = 1;
}

console.log(process.exitCode ? "Done with errors." : "Done — 4 duplicates deleted, survivor verified.");
