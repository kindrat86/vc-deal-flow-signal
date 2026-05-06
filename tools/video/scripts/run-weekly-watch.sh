#!/usr/bin/env bash
# run-weekly-watch.sh — orchestrates the weekly Acceleration Watch ship.
# Called by both the GitHub Actions cron and manual local runs.
set -euo pipefail

cd "$(dirname "$0")/.."

# Remotion's Root.tsx imports script-meta.json for every composition at
# bundle time. The weekly cron only renders Predicted90s, but the bundler
# still walks Vsl3min, ShortMagicBullet, and DataNerdBrief imports — so
# seed inert stubs for the others if they aren't already present from a
# prior local render.
mkdir -p out/predicted-90s out/vsl-3min out/short-magic-bullet out/data-nerd-brief
for d in vsl-3min short-magic-bullet data-nerd-brief; do
  if [[ ! -f "out/$d/script-meta.json" ]]; then
    printf '%s' "{\"id\":\"$d\",\"fps\":30,\"width\":1080,\"height\":1920,\"scenes\":[{\"id\":\"stub\",\"kind\":\"title\",\"durationSec\":2,\"voDurationSec\":0,\"audioPath\":null,\"data\":{}}],\"totalDurationSec\":2,\"totalDurationFrames\":60,\"voice\":{\"id\":\"stub\",\"name\":\"stub\",\"model\":\"stub\"}}" > "out/$d/script-meta.json"
  fi
done
# Each composition imports its own captions.json statically; stub all four
# when missing. SKIP_CAPTIONS=1 is the CI default since whisper.cpp isn't
# installed on the runner. Shape: sceneId → [] (sceneId→Word[] map).
for d in predicted-90s vsl-3min short-magic-bullet data-nerd-brief; do
  [[ -f "out/$d/captions.json" ]] || printf '%s' '{}' > "out/$d/captions.json"
done

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
npx remotion render src/index.ts Predicted90s out/predicted-90s/predicted-90s.mp4

echo "▸ thumbnail render"
npx remotion still src/index.ts ThumbnailPredicted out/thumbnail-predicted-90s.jpg \
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
