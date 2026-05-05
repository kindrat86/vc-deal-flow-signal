#!/usr/bin/env bash
# run-weekly-watch.sh — orchestrates the weekly Acceleration Watch ship.
# Called by both the GitHub Actions cron and manual local runs.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "▸ generating fresh content from /api/v1/signals.json"
node scripts/00-generate-weekly-watch.mjs

echo "▸ Cartesia TTS for each scene"
node scripts/01-tts.mjs predicted-90s

# Captions + music are nice-to-have. Skip with SKIP_CAPTIONS=1 to keep CI fast.
if [[ "${SKIP_CAPTIONS:-0}" != "1" ]]; then
  echo "▸ whisper captions"
  node scripts/02-captions.mjs predicted-90s || echo "  (captions failed, continuing without)"
fi

echo "▸ background music"
node scripts/03-music.mjs predicted-90s || echo "  (music failed, continuing without)"

echo "▸ Remotion render"
npx remotion render src/index.ts Predicted90s out/predicted-90s.mp4

echo "▸ thumbnail render"
npx remotion still src/index.ts ThumbnailPredicted out/thumbnail-predicted.jpg \
  --image-format=jpeg --jpeg-quality=92

echo "▸ upload to YouTube"
UPLOAD_LOG=$(mktemp)
node scripts/05-youtube-upload.mjs predicted-90s | tee "$UPLOAD_LOG"
VIDEO_ID=$(grep -oE 'youtube\.com/watch\?v=[A-Za-z0-9_-]+' "$UPLOAD_LOG" | head -1 | sed 's|.*v=||')
rm -f "$UPLOAD_LOG"

if [[ -z "${VIDEO_ID:-}" ]]; then
  echo "✗ failed to capture video ID from upload"
  exit 1
fi

echo "▸ post-upload SEO + playlist add"
node scripts/07-post-upload-optimize.mjs "$VIDEO_ID" predicted-90s

echo "✓ done — https://youtube.com/watch?v=$VIDEO_ID"
