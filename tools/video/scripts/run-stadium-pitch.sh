#!/usr/bin/env bash
# run-stadium-pitch.sh — orchestrates the monthly Stadium Pitch ship.
# Brunson Expert Secrets §1 Ch 20 (Stadium Pitch as event-shaped anchor).
# Called by both the GitHub Actions cron (first Wed of month, 14:07 UTC)
# and manual local runs.
#
# Re-uses the Vsl3min Remotion composition + ThumbnailVsl still — the
# stadium pitch is a 90-100 second long-form ship at 1920×1080, same
# canvas as the Perfect Webinar VSL. Only the content/stadium-pitch.json
# script changes month over month.
set -euo pipefail

cd "$(dirname "$0")/.."

# Remotion's Root.tsx imports script-meta.json + captions.json for every
# composition at bundle time. The stadium pitch reuses the vsl-3min
# folder, but the bundler still walks Predicted90s, ShortMagicBullet, and
# DataNerdBrief imports — seed inert stubs for the others.
mkdir -p out/predicted-90s out/vsl-3min out/short-magic-bullet out/data-nerd-brief
for d in predicted-90s short-magic-bullet data-nerd-brief; do
  if [[ ! -f "out/$d/script-meta.json" ]]; then
    printf '%s' "{\"id\":\"$d\",\"fps\":30,\"width\":1080,\"height\":1920,\"scenes\":[{\"id\":\"stub\",\"kind\":\"title\",\"durationSec\":2,\"voDurationSec\":0,\"audioPath\":null,\"data\":{}}],\"totalDurationSec\":2,\"totalDurationFrames\":60,\"voice\":{\"id\":\"stub\",\"name\":\"stub\",\"model\":\"stub\"}}" > "out/$d/script-meta.json"
  fi
done
for d in predicted-90s vsl-3min short-magic-bullet data-nerd-brief; do
  [[ -f "out/$d/captions.json" ]] || printf '%s' '{}' > "out/$d/captions.json"
done

echo "▸ generating fresh content from /api/v1/signals.json"
node scripts/00-generate-stadium-pitch.mjs

# Stadium pitch content writes to content/stadium-pitch.json with id="vsl-3min"
# so that the existing TTS + Remotion + upload pipeline picks it up under
# the vsl-3min folder. Symlink content/vsl-3min.json → content/stadium-pitch.json
# for the duration of this run so 01-tts.mjs vsl-3min finds the new script.
echo "▸ pointing vsl-3min.json at this month's stadium pitch"
cp content/stadium-pitch.json content/vsl-3min.json

echo "▸ Cartesia TTS for each scene"
node scripts/01-tts.mjs vsl-3min

if [[ "${SKIP_CAPTIONS:-0}" != "1" ]]; then
  echo "▸ whisper captions"
  node scripts/02-captions.mjs vsl-3min || echo "  (captions failed, continuing without)"
fi

echo "▸ background music"
node scripts/03-music.mjs vsl-3min || echo "  (music failed, continuing without)"

echo "▸ Remotion render"
# 05-youtube-upload.mjs reads out/${slug}/${slug}.mp4 — name accordingly.
npx remotion render src/index.ts Vsl3min out/vsl-3min/vsl-3min.mp4

echo "▸ thumbnail render"
# 05-youtube-upload.mjs prefers out/thumbnail-${slug}.jpg.
npx remotion still src/index.ts ThumbnailVsl out/thumbnail-vsl-3min.jpg \
  --image-format=jpeg --jpeg-quality=92

echo "▸ upload to YouTube"
UPLOAD_LOG=$(mktemp)
node scripts/05-youtube-upload.mjs vsl-3min | tee "$UPLOAD_LOG"
VIDEO_ID=$(grep -oE 'youtube\.com/watch\?v=[A-Za-z0-9_-]+' "$UPLOAD_LOG" | head -1 | sed 's|.*v=||')
rm -f "$UPLOAD_LOG"

if [[ -z "${VIDEO_ID:-}" ]]; then
  echo "✗ failed to capture video ID from upload"
  exit 1
fi

echo "▸ post-upload SEO + playlist add"
node scripts/07-post-upload-optimize.mjs "$VIDEO_ID" vsl-3min || echo "  (post-upload optimise failed; video is live)"

echo "✓ done — https://youtube.com/watch?v=$VIDEO_ID"
echo "  Update pseo-site/app/state-of-github/page.tsx STADIUM_PITCH_VIDEO_ID with this ID."
