#!/usr/bin/env node
// Uploads out/predicted-90s.mp4 to YouTube with metadata pulled from
// content/predicted-90s.json. Sets out/thumbnail-predicted.jpg as the custom
// thumbnail. Idempotent re-runs create a new video each time — there is no
// "update existing" mode; that's a v2 feature.
import { readFileSync, existsSync, createReadStream, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// First positional arg = video slug. Defaults to predicted-90s.
const slug = process.argv[2] ?? "predicted-90s";
const CREDS = path.join(ROOT, ".yt-credentials.json");
const TOKEN = path.join(ROOT, ".yt-token.json");
const VIDEO = path.join(ROOT, `out/${slug}/${slug}.mp4`);
// Slug-specific thumbnail; falls back to predicted thumbnail or none.
const SLUG_THUMB = path.join(ROOT, `out/thumbnail-${slug}.jpg`);
const FALLBACK_THUMB = path.join(ROOT, "out/thumbnail-predicted.jpg");
const THUMB = existsSync(SLUG_THUMB) ? SLUG_THUMB : FALLBACK_THUMB;
const SCRIPT = path.join(ROOT, `content/${slug}.json`);

for (const p of [CREDS, TOKEN, VIDEO, SCRIPT]) {
  if (!existsSync(p)) throw new Error(`missing: ${p}`);
}

const cfg = JSON.parse(readFileSync(CREDS, "utf8")).installed ?? JSON.parse(readFileSync(CREDS, "utf8")).web;
const tokens = JSON.parse(readFileSync(TOKEN, "utf8"));
const meta = JSON.parse(readFileSync(SCRIPT, "utf8"));

const oauth2Client = new google.auth.OAuth2(cfg.client_id, cfg.client_secret, cfg.redirect_uris?.[0]);
oauth2Client.setCredentials(tokens);

const yt = google.youtube({ version: "v3", auth: oauth2Client });

const sizeMB = (statSync(VIDEO).size / 1024 / 1024).toFixed(1);
console.log(`Uploading ${path.basename(VIDEO)} (${sizeMB}MB)`);
console.log(`Title: ${meta.title}`);

const insertRes = await yt.videos.insert(
  {
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: meta.title,
        description: meta.description,
        tags: ["VC", "venture capital", "GitHub", "deal sourcing", "engineering signals", "Series A", "AI agents"],
        categoryId: "28", // Science & Technology
        defaultLanguage: "en",
        defaultAudioLanguage: "en",
      },
      status: {
        privacyStatus: "unlisted", // safer default; flip to "public" by hand or via flag
        selfDeclaredMadeForKids: false,
        license: "youtube",
        embeddable: true,
      },
    },
    media: {
      body: createReadStream(VIDEO),
    },
  },
  {
    onUploadProgress: (e) => {
      const pct = ((e.bytesRead / statSync(VIDEO).size) * 100).toFixed(1);
      process.stdout.write(`\r  upload: ${pct}%`);
    },
  },
);
console.log("");

const videoId = insertRes.data.id;
const url = `https://youtube.com/watch?v=${videoId}`;
console.log(`Inserted: ${url}`);

if (existsSync(THUMB)) {
  console.log(`  thumbnail: ${path.basename(THUMB)}`);
  try {
    await yt.thumbnails.set({
      videoId,
      media: { body: createReadStream(THUMB) },
    });
    console.log("  thumbnail attached ✓");
  } catch (e) {
    // Custom thumbnails require channel verification (SMS) at youtube.com/verify.
    // Treat as soft failure — the video upload itself succeeded.
    const msg = e?.message ?? String(e);
    if (msg.includes("permissions to upload and set custom video thumbnails")) {
      console.log("  thumbnail SKIPPED — channel not yet verified for custom thumbnails.");
      console.log("  Verify once at https://www.youtube.com/verify, then re-run upload.");
    } else {
      console.log(`  thumbnail FAILED: ${msg}`);
    }
  }
}

console.log(`\nLive at ${url}`);
console.log("(currently UNLISTED — open YouTube Studio to flip to Public when ready)");
