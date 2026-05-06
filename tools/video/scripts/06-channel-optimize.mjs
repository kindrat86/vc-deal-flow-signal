#!/usr/bin/env node
/**
 * 06-channel-optimize.mjs — autonomous YouTube channel SEO + organization pass.
 *
 * Uses the existing .yt-credentials.json + .yt-token.json (refresh token has
 * youtube.force-ssl, so we can update metadata, playlists, and channel
 * branding — anything except renaming the channel handle and uploading to
 * shorts shelf, both of which require Studio UI).
 *
 * Idempotent: re-running re-applies the same metadata. Safe to run multiple
 * times. Every change is reversible via YouTube Studio.
 *
 * What it does:
 *   1. Updates the 3 published videos with optimized title/description/tags.
 *   2. Creates 2 playlists ("Engineering Acceleration Watch" + "Shorts") if
 *      they don't exist, and adds the right videos to each.
 *   3. Updates channel branding (description + keywords + unsubscribed-trailer
 *      pointing at the VSL).
 *
 * Run:  node tools/video/scripts/06-channel-optimize.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CREDS = path.join(ROOT, ".yt-credentials.json");
const TOKEN = path.join(ROOT, ".yt-token.json");

if (!existsSync(CREDS) || !existsSync(TOKEN)) {
  throw new Error("OAuth creds missing. Run 04-youtube-auth.mjs first.");
}

const cfg =
  JSON.parse(readFileSync(CREDS, "utf8")).installed ??
  JSON.parse(readFileSync(CREDS, "utf8")).web;
const tokens = JSON.parse(readFileSync(TOKEN, "utf8"));

const oauth2Client = new google.auth.OAuth2(
  cfg.client_id,
  cfg.client_secret,
  cfg.redirect_uris?.[0],
);
oauth2Client.setCredentials(tokens);
const yt = google.youtube({ version: "v3", auth: oauth2Client });

// ─────────────────────────────────────────────────────────────────────────
// Source-of-truth metadata. All copy lives here so re-running is idempotent.
// ─────────────────────────────────────────────────────────────────────────

const APEX = "https://gitdealflow.com";
const SIGNALS = "https://signals.gitdealflow.com";
const SSRN = "https://ssrn.com/abstract=6606558";

const VIDEOS = {
  // Long-form Acceleration Watch explainer (90s)
  predicted: {
    id: "sXFZHCKkROA",
    title:
      "GitHub Commit Velocity Predicts Series A 30 Days Early — Engineering Acceleration Watch",
    description: [
      "By the time a startup hits Crunchbase, every other VC sees it the same morning you do. Engineering Acceleration Watch ships every Monday with the venture-backed startups whose GitHub commit velocity is accelerating sharpest — typically 21 to 47 days before the Series A announcement, based on a longitudinal panel of 219 confirmed fundraises (SSRN-indexed methodology, CC BY 4.0).",
      "",
      "🔗 Free Sunday digest:           " + APEX + "/predicted",
      "🔗 SSRN methodology paper:       " + SSRN,
      "🔗 Live ranked dashboard:         " + SIGNALS + "/trending",
      "🔗 12-minute Perfect Webinar:    " + SIGNALS + "/perfect-webinar",
      "🔗 Free MCP server (Claude/Cursor): https://www.npmjs.com/package/@gitdealflow/mcp-signal",
      "🔗 Public dataset (Hugging Face): https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
      "",
      "⏱  Chapters",
      "00:00  Hook — Crunchbase tells you the day they raised",
      "00:13  The leading-indicator gap",
      "00:30  How engineering acceleration is computed",
      "00:55  219-startup panel: 21–47 day median lead time",
      "01:15  Free vs paid tiers, what to do next",
      "",
      "Engineering Acceleration ≠ accelerator program. This is a quantitative GitHub signal computed from public commit-velocity data, contributor-influx patterns, and dependents-graph activity. Distinct from Y Combinator / Techstars references.",
      "",
      "Built by The Data Nerd (anonymous founder, ORCID 0009-0002-2222-4112). Narration is a Cartesia synthetic voice — same voice across the website's page narrations and the Sunday email audio companion. Methodology open and reproducible at " + SIGNALS + "/methodology.",
      "",
      "#VentureCapital #DealFlow #GitHub #AlternativeData #SeriesA #StartupSignals #VCTools #Engineering #SSRN #OpenData",
    ].join("\n"),
    tags: [
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
      "deal flow software",
      "github vc",
      "harmonic alternative",
      "tracxn alternative",
      "affinity alternative",
      "crunchbase alternative",
      "open source signals",
      "ssrn venture capital",
      "engineering velocity",
      "startup discovery",
      "gitdealflow",
      "vc deal flow signal",
      "the data nerd",
      "deal flow ai",
      "agent vc tools",
      "model context protocol",
      "MCP server",
      "vc data product",
      "code-side momentum",
    ],
    categoryId: "28",
    privacyStatus: "public",
  },

  // VSL — 3-minute Perfect Webinar
  vsl: {
    id: "6wgrWtR6eZg",
    title:
      "How To Spot a Series A 47 Days Before the Deck — 3-Minute VSL (GitDealFlow)",
    description: [
      "The 3-minute version of the Perfect Webinar at " + SIGNALS + "/perfect-webinar — the long version takes 12 minutes, this one cuts to the single belief.",
      "",
      "If commit-velocity acceleration is the most leading public signal in venture capital, then every other deal-flow source — pitch decks, AngelList, Crunchbase, warm intros — is a lagging indicator. That's the big-domino claim, and the SSRN-indexed panel of 219 confirmed Series A and Series B fundraises is the empirical basis.",
      "",
      "🔗 Full Perfect Webinar (12 min):  " + SIGNALS + "/perfect-webinar",
      "🔗 €9.97/mo Dashboard founding:    " + APEX + "/#pricing",
      "🔗 €7 First Look Pass:             " + APEX + "/firstlook",
      "🔗 SSRN methodology paper:         " + SSRN,
      "🔗 90-second pitch (text):         " + SIGNALS + "/pitch",
      "🔗 Funnel hub (every door):        " + SIGNALS + "/funnels",
      "",
      "⏱  Chapters",
      "00:00  Hook — the 47-day window",
      "00:25  The big-domino belief",
      "01:00  Three objections (vehicle, internal, external)",
      "02:00  The stack — what's inside the founding tier",
      "02:35  Close + guarantee",
      "",
      "30-day Signal-or-It's-Free guarantee. €9.97/mo founding-member price locked forever for buyers in the founding cohort. Free Sunday digest at " + APEX + " if the dashboard isn't your speed.",
      "",
      "Narrated by The Data Nerd — Cartesia synthetic voice, the same voice on " + SIGNALS + "/perfect-webinar/5min and in the Sunday email audio companions. The face stays anonymous; the voice is consistent on purpose.",
      "",
      "#VentureCapital #DealFlow #GitHub #SeriesA #VCTools #StartupSignals #PerfectWebinar #AlternativeData #SSRN",
    ].join("\n"),
    tags: [
      "perfect webinar",
      "venture capital",
      "vc deal flow",
      "series a 47 days",
      "github commit velocity",
      "engineering acceleration",
      "vsl",
      "video sales letter",
      "vc tools",
      "deal flow software",
      "alternative data vc",
      "harmonic alternative",
      "tracxn alternative",
      "crunchbase alternative",
      "ssrn venture capital",
      "github momentum",
      "deal sourcing",
      "startup signals",
      "vc data product",
      "the data nerd",
      "gitdealflow",
      "vc deal flow signal",
      "founding member price",
      "9.97 month",
      "russell brunson perfect webinar",
      "big domino",
      "stack slide",
      "epiphany bridge",
    ],
    categoryId: "28",
    privacyStatus: "public",
  },

  // Short — Magic Bullet
  short: {
    id: "mBEMytrYZ1I",
    title:
      "We named this startup 31 days before their $4M Series A. #VentureCapital #GitHub",
    description: [
      "Day -31: quiet fintech repo, 3 contributors. Day 0: $4M Series A.",
      "",
      "Engineering Acceleration Watch ships every Monday at " + APEX + "/predicted. Free.",
      "",
      "SSRN methodology paper: " + SSRN,
      "Full dashboard: " + SIGNALS + "/trending",
      "",
      "#shorts #VentureCapital #GitHub #SeriesA #DealFlow #VCTools #StartupSignals #AlternativeData",
    ].join("\n"),
    tags: [
      "shorts",
      "venture capital",
      "github",
      "series a",
      "deal flow",
      "startup",
      "fintech series a",
      "engineering acceleration",
      "github momentum",
      "vc shorts",
      "startup signals",
      "alternative data",
      "gitdealflow",
      "vc deal flow signal",
      "magic bullet",
      "predicted series a",
    ],
    categoryId: "28",
    privacyStatus: "public",
  },
};

// Playlists to create + populate. Order in `videoIds` is the play order.
const PLAYLISTS = [
  {
    title: "Engineering Acceleration Watch",
    description:
      "How GitHub commit-velocity acceleration predicts Series A and Series B fundraises 21 to 47 days early. Methodology open at " +
      SIGNALS +
      "/methodology, SSRN-indexed at " +
      SSRN +
      ".",
    privacyStatus: "public",
    videoIds: [VIDEOS.predicted.id, VIDEOS.vsl.id],
  },
  {
    title: "VC Deal Flow Signal — Shorts",
    description:
      "60-second cuts of the Engineering Acceleration Watch. The data product behind these shorts ships free every Monday at " +
      APEX +
      "/predicted.",
    privacyStatus: "public",
    videoIds: [VIDEOS.short.id],
  },
];

// Channel branding (description + keywords + unsubscribed-trailer)
const CHANNEL_BRANDING = {
  description: [
    "VC Deal Flow Signal (GitDealFlow) — engineering acceleration tracking for venture capital.",
    "",
    "We rank 4,200+ venture-backed startup GitHub orgs every week by commit velocity, contributor influx, and infrastructure buildout. The pattern has historically preceded Series A and Series B fundraise announcements by 21 to 47 days across a longitudinal panel of 219 confirmed rounds (SSRN-indexed, CC BY 4.0).",
    "",
    "🔗 " + APEX + "                  — apex + free Sunday digest",
    "🔗 " + SIGNALS + "/predicted       — Engineering Acceleration Watch",
    "🔗 " + SIGNALS + "/methodology     — open methodology",
    "🔗 " + SIGNALS + "/funnels         — every product door (free → €1,997)",
    "🔗 " + SSRN + "  — SSRN paper",
    "",
    "Founder: The Data Nerd (anonymous, ORCID 0009-0002-2222-4112). Email: signal@gitdealflow.com.",
    "",
    "Every video on this channel is narrated by The Data Nerd — a single Cartesia synthetic voice that you'll also hear on the website's page narrations (" + SIGNALS + "/about/founder, /story, /origin, /perfect-webinar) and in the audio companion at the top of every Sunday email. Same voice, every surface. The face stays anonymous; the voice is consistent on purpose.",
    "",
    "Engineering Acceleration is a quantitative GitHub signal — distinct from accelerator programs (Y Combinator, Techstars).",
  ].join("\n"),
  keywords:
    '"venture capital" "deal flow" "github" "series a" "alternative data" "vc tools" "engineering acceleration" "startup signals" "github momentum" "ssrn" "harmonic alternative" "crunchbase alternative" "agent vc tools" "model context protocol" "gitdealflow"',
  unsubscribedTrailer: VIDEOS.vsl.id,
};

// ─────────────────────────────────────────────────────────────────────────
// Apply
// ─────────────────────────────────────────────────────────────────────────

async function getMyChannel() {
  const res = await yt.channels.list({
    part: ["id", "snippet", "brandingSettings", "contentDetails"],
    mine: true,
  });
  const ch = res.data.items?.[0];
  if (!ch) throw new Error("no channel found for this OAuth user");
  return ch;
}

async function updateVideo(meta) {
  const before = await yt.videos.list({
    part: ["snippet", "status"],
    id: [meta.id],
  });
  const v = before.data.items?.[0];
  if (!v) {
    console.log(`  ✗ video ${meta.id} not found (skipped)`);
    return;
  }
  const tagsTrimmed = trimTags(meta.tags);
  await yt.videos.update({
    part: ["snippet", "status"],
    requestBody: {
      id: meta.id,
      snippet: {
        title: meta.title.slice(0, 100),
        description: meta.description.slice(0, 5000),
        tags: tagsTrimmed,
        categoryId: meta.categoryId,
        defaultLanguage: "en",
        defaultAudioLanguage: "en",
      },
      status: {
        privacyStatus: meta.privacyStatus,
        selfDeclaredMadeForKids: false,
        embeddable: true,
        license: "youtube",
      },
    },
  });
  console.log(`  ✓ updated ${meta.id} — "${meta.title.slice(0, 60)}…"`);
}

// YouTube limit: total tag length (post-quoting) <= 500 chars. Trim until it fits.
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

async function ensurePlaylist(spec) {
  const list = await yt.playlists.list({
    part: ["snippet", "status"],
    mine: true,
    maxResults: 50,
  });
  const existing = (list.data.items ?? []).find(
    (p) => p.snippet?.title === spec.title,
  );
  let playlistId;
  let justCreated = false;
  if (existing) {
    playlistId = existing.id;
    await yt.playlists.update({
      part: ["snippet", "status"],
      requestBody: {
        id: playlistId,
        snippet: {
          title: spec.title,
          description: spec.description.slice(0, 5000),
        },
        status: { privacyStatus: spec.privacyStatus },
      },
    });
    console.log(`  ✓ playlist exists: "${spec.title}" (updated)`);
  } else {
    const ins = await yt.playlists.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: spec.title,
          description: spec.description.slice(0, 5000),
          defaultLanguage: "en",
        },
        status: { privacyStatus: spec.privacyStatus },
      },
    });
    playlistId = ins.data.id;
    justCreated = true;
    console.log(`  ✓ playlist created: "${spec.title}" (${playlistId})`);
  }

  // Diff current items vs desired; add missing. Don't remove anything we
  // didn't add — playlist may carry user-curated additions.
  // Just-created playlists hit a brief propagation lag where playlistItems.list
  // 404s before the playlist becomes index-visible; for those we skip the
  // diff and treat the playlist as empty.
  const present = new Set();
  if (!justCreated) {
    const items = await yt.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId,
      maxResults: 50,
    });
    for (const i of items.data.items ?? []) {
      if (i.contentDetails?.videoId) present.add(i.contentDetails.videoId);
    }
  }
  for (const vid of spec.videoIds) {
    if (present.has(vid)) {
      console.log(`     • ${vid} already in playlist`);
      continue;
    }
    await yt.playlistItems.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          playlistId,
          resourceId: { kind: "youtube#video", videoId: vid },
        },
      },
    });
    console.log(`     + added ${vid}`);
  }
  return playlistId;
}

async function updateChannelBranding(channel) {
  const channelId = channel.id;
  const current = channel.brandingSettings ?? {};
  await yt.channels.update({
    part: ["brandingSettings"],
    requestBody: {
      id: channelId,
      brandingSettings: {
        channel: {
          ...(current.channel ?? {}),
          description: CHANNEL_BRANDING.description.slice(0, 1000),
          keywords: CHANNEL_BRANDING.keywords.slice(0, 500),
          unsubscribedTrailer: CHANNEL_BRANDING.unsubscribedTrailer,
          defaultLanguage: "en",
        },
      },
    },
  });
  console.log(`  ✓ channel branding updated (${channelId})`);
}

async function main() {
  console.log("YouTube channel optimization pass\n");

  const channel = await getMyChannel();
  console.log(`Channel: ${channel.snippet.title} (${channel.id})`);
  console.log(
    `Subscribers: ${channel.statistics?.subscriberCount ?? "(hidden)"}\n`,
  );

  console.log("1. Updating video metadata");
  for (const meta of Object.values(VIDEOS)) {
    await updateVideo(meta);
  }

  console.log("\n2. Ensuring playlists");
  for (const spec of PLAYLISTS) {
    await ensurePlaylist(spec);
  }

  console.log("\n3. Updating channel branding");
  await updateChannelBranding(channel);

  console.log("\nDone. Verify in YouTube Studio:");
  console.log(`  https://studio.youtube.com/channel/${channel.id}`);
  for (const meta of Object.values(VIDEOS)) {
    console.log(`  https://studio.youtube.com/video/${meta.id}/edit`);
  }
}

main().catch((e) => {
  console.error("FATAL:", e?.errors ?? e?.message ?? e);
  process.exit(1);
});
