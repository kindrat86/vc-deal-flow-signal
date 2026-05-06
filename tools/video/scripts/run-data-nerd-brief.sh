#!/usr/bin/env bash
# run-data-nerd-brief.sh — orchestrates the weekly Data Nerd Brief Short.
# Brunson Expert Secrets Ch 3 (Charismatic Leader): the recurring character
# moment, on a different beat from the Monday data show. Wed 14:07 UTC.
set -euo pipefail

cd "$(dirname "$0")/.."

# Remotion's Root.tsx imports script-meta.json + captions.json for every
# composition at bundle time. The Wednesday cron only renders DataNerdBrief,
# but the bundler still walks the imports for the other three. Seed inert
# stubs for any that aren't already present.
mkdir -p out/predicted-90s out/vsl-3min out/short-magic-bullet out/data-nerd-brief
for d in predicted-90s vsl-3min short-magic-bullet data-nerd-brief; do
  if [[ ! -f "out/$d/script-meta.json" ]]; then
    printf '%s' "{\"id\":\"$d\",\"fps\":30,\"width\":1080,\"height\":1920,\"scenes\":[{\"id\":\"stub\",\"kind\":\"title\",\"durationSec\":2,\"voDurationSec\":0,\"audioPath\":null,\"data\":{}}],\"totalDurationSec\":2,\"totalDurationFrames\":60,\"voice\":{\"id\":\"stub\",\"name\":\"stub\",\"model\":\"stub\"}}" > "out/$d/script-meta.json"
  fi
  [[ -f "out/$d/captions.json" ]] || printf '%s' '{}' > "out/$d/captions.json"
done

echo "▸ generating fresh persona content from /api/v1/signals.json"
node scripts/00-generate-data-nerd-brief.mjs

echo "▸ Cartesia TTS for each scene (data-nerd-brief)"
node scripts/01-tts.mjs data-nerd-brief

# Captions + music are nice-to-have. Skip with SKIP_CAPTIONS=1 in CI.
if [[ "${SKIP_CAPTIONS:-0}" != "1" ]]; then
  echo "▸ whisper captions"
  node scripts/02-captions.mjs data-nerd-brief || echo "  (captions failed, continuing without)"
fi

echo "▸ background music"
node scripts/03-music.mjs data-nerd-brief || echo "  (music failed, continuing without)"

echo "▸ Remotion render"
npx remotion render src/index.ts DataNerdBrief out/data-nerd-brief/data-nerd-brief.mp4

# Optional thumbnail — the Short auto-thumbnails on YouTube, but a custom
# JPG keeps the channel grid coherent. Reuse the ShortMagicBullet pattern
# only if you've added a ThumbnailDataNerdBrief composition; otherwise
# skip and let YouTube pick a frame.

echo "▸ upload to YouTube"
UPLOAD_LOG=$(mktemp)
node scripts/05-youtube-upload.mjs data-nerd-brief | tee "$UPLOAD_LOG"
VIDEO_ID=$(grep -oE 'youtube\.com/watch\?v=[A-Za-z0-9_-]+' "$UPLOAD_LOG" | head -1 | sed 's|.*v=||')
rm -f "$UPLOAD_LOG"

if [[ -z "${VIDEO_ID:-}" ]]; then
  echo "✗ failed to capture video ID from upload"
  exit 1
fi

echo "▸ post-upload SEO + playlist add"
node scripts/07-post-upload-optimize.mjs "$VIDEO_ID" data-nerd-brief

echo "✓ done — https://youtube.com/watch?v=$VIDEO_ID"
