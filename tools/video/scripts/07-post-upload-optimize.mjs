#!/usr/bin/env node
/**
 * 07-post-upload-optimize.mjs — apply rich metadata + playlist add to a
 * single just-uploaded video. Used by the autonomous weekly cron after
 * 05-youtube-upload prints "Inserted: https://youtube.com/watch?v=...".
 *
 * Pulls the title / description from content/predicted-90s.json, applies
 * the canonical SEO tag list, sets defaultLanguage + embeddable + public
 * status, and inserts into the "Engineering Acceleration Watch" playlist.
 *
 * Usage:
 *   node 07-post-upload-optimize.mjs <videoId> [slug=predicted-90s]
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CREDS = path.join(ROOT, ".yt-credentials.json");
const TOKEN = path.join(ROOT, ".yt-token.json");
const videoId = process.argv[2];
const slug = process.argv[3] ?? "predicted-90s";
if (!videoId) throw new Error("Usage: 07-post-upload-optimize.mjs <videoId> [slug]");

for (const p of [CREDS, TOKEN]) {
  if (!existsSync(p)) throw new Error(`missing: ${p}`);
}

const cfg =
  JSON.parse(readFileSync(CREDS, "utf8")).installed ??
  JSON.parse(readFileSync(CREDS, "utf8")).web;
const tokens = JSON.parse(readFileSync(TOKEN, "utf8"));
const oauth = new google.auth.OAuth2(cfg.client_id, cfg.client_secret, cfg.redirect_uris?.[0]);
oauth.setCredentials(tokens);
const yt = google.youtube({ version: "v3", auth: oauth });

const content = JSON.parse(
  readFileSync(path.join(ROOT, `content/${slug}.json`), "utf8"),
);

// SEO tags. Per-slug list — most overlap, but Shorts get a tighter tag set
// optimised for Shorts shelf discovery rather than Watch-page search.
// Trimmed to <= 480 chars at runtime.
const TAGS_DEFAULT = [
  "venture capital",
  "vc deal flow",
  "deal sourcing",
  "github commit velocity",
  "engineering acceleration",
  "alternative data vc",
  "series a prediction",
  "startup signals",
  "vc tools",
  "github momentum",
  "weekly watch",
  "acceleration watch",
  "harmonic alternative",
  "tracxn alternative",
  "crunchbase alternative",
  "ssrn venture capital",
  "engineering velocity",
  "open source signals",
  "gitdealflow",
  "vc deal flow signal",
  "the data nerd",
  "agent vc tools",
  "model context protocol",
  "mcp server",
  "code-side momentum",
];

const TAGS_DATA_NERD_BRIEF = [
  "the data nerd",
  "data nerd brief",
  "vc deal flow",
  "github signals",
  "engineering acceleration",
  "venture capital",
  "deal sourcing",
  "startup signals",
  "alternative data vc",
  "ssrn venture capital",
  "github momentum",
  "vc shorts",
  "investor shorts",
  "open source signals",
  "gitdealflow",
];

const TAGS = slug === "data-nerd-brief" ? TAGS_DATA_NERD_BRIEF : TAGS_DEFAULT;

// Each upload slug routes to its primary playlist on the channel. The
// playlists themselves are created by 06-channel-optimize.mjs.
const PLAYLIST_FOR_SLUG = {
  "predicted-90s": "engineering acceleration watch",
  "short-magic-bullet": "shorts",
  "data-nerd-brief": "shorts",
};
const targetPlaylistName = PLAYLIST_FOR_SLUG[slug] ?? "engineering acceleration watch";

function trimTags(tags) {
  const out = [];
  let total = 0;
  for (const t of tags) {
    const cost = t.includes(" ") ? t.length + 2 : t.length;
    if (total + cost + (out.length ? 1 : 0) > 480) break;
    out.push(t);
    total += cost + (out.length ? 1 : 0);
  }
  return out;
}

await yt.videos.update({
  part: ["snippet", "status"],
  requestBody: {
    id: videoId,
    snippet: {
      title: content.title.slice(0, 100),
      description: content.description.slice(0, 5000),
      tags: trimTags(TAGS),
      categoryId: "28",
      defaultLanguage: "en",
      defaultAudioLanguage: "en",
    },
    status: {
      privacyStatus: "public",
      selfDeclaredMadeForKids: false,
      embeddable: true,
      license: "youtube",
    },
  },
});
console.log(`✓ metadata applied to ${videoId}`);

// Route to the slug's primary playlist (case-insensitive match).
const playlists = await yt.playlists.list({
  part: ["snippet"],
  mine: true,
  maxResults: 50,
});
const target = (playlists.data.items ?? []).find(
  (p) => p.snippet?.title?.toLowerCase() === targetPlaylistName,
);
if (target) {
  await yt.playlistItems.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        playlistId: target.id,
        resourceId: { kind: "youtube#video", videoId },
      },
    },
  });
  console.log(`✓ added to playlist "${target.snippet.title}" (${target.id})`);
} else {
  console.log(`⚠ playlist "${targetPlaylistName}" not found — run 06-channel-optimize first`);
}

console.log(`\nLive: https://youtube.com/watch?v=${videoId}`);
