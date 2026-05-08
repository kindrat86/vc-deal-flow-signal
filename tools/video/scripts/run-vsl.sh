#!/usr/bin/env bash
# run-vsl.sh — orchestrates the evergreen Perfect VSL render.
# Brunson Expert Secrets §3 Ch 12 (Perfect Webinar) applied to the VSL form.
# One-shot — fired by `.github/workflows/youtube-vsl.yml` on workflow_dispatch.
# Re-run only when `pseo-site/content/vsl-script.json` changes.
#
# Re-uses the Vsl3min Remotion composition + ThumbnailVsl still — the VSL
# is a long-form (~10-min) ship at 1920x1080. Only the source script changes.
#
# Anonymity rule: synthetic voice (Cartesia "Theo") only. No founder face,
# voice, or name. Per memory: synthetic TTS is explicitly allowed
# (feedback_anonymity_no_podcasts.md, updated 2026-05-05).
set -euo pipefail

cd "$(dirname "$0")/.."

# Remotion's Root.tsx imports script-meta.json + captions.json for every
# composition at bundle time. The VSL reuses the vsl-3min folder, but the
# bundler still walks Predicted90s, ShortMagicBullet, and DataNerdBrief
# imports — seed inert stubs for the others (mirrors run-stadium-pitch.sh).
mkdir -p out/predicted-90s out/vsl-3min out/short-magic-bullet out/data-nerd-brief
for d in predicted-90s short-magic-bullet data-nerd-brief; do
  if [[ ! -f "out/$d/script-meta.json" ]]; then
    printf '%s' "{\"id\":\"$d\",\"fps\":30,\"width\":1080,\"height\":1920,\"scenes\":[{\"id\":\"stub\",\"kind\":\"title\",\"durationSec\":2,\"voDurationSec\":0,\"audioPath\":null,\"data\":{}}],\"totalDurationSec\":2,\"totalDurationFrames\":60,\"voice\":{\"id\":\"stub\",\"name\":\"stub\",\"model\":\"stub\"}}" > "out/$d/script-meta.json"
  fi
done
for d in predicted-90s vsl-3min short-magic-bullet data-nerd-brief; do
  [[ -f "out/$d/captions.json" ]] || printf '%s' '{}' > "out/$d/captions.json"
done

echo "▸ pulling canonical VSL script from pseo-site/content/vsl-script.json"
SOURCE="../../pseo-site/content/vsl-script.json"
if [[ ! -f "$SOURCE" ]]; then
  echo "✗ source script missing at $SOURCE"
  exit 1
fi
cp "$SOURCE" content/vsl-3min.json

echo "▸ Cartesia TTS for each scene"
node scripts/01-tts.mjs vsl-3min

if [[ "${SKIP_CAPTIONS:-0}" != "1" ]]; then
  echo "▸ whisper captions"
  node scripts/02-captions.mjs vsl-3min || echo "  (captions failed, continuing without)"
fi

echo "▸ background music"
node scripts/03-music.mjs vsl-3min || echo "  (music failed, continuing without)"

echo "▸ Remotion render (long VSL — expect ~8–14 min on a runner)"
# 05-youtube-upload.mjs reads out/${slug}/${slug}.mp4 — name accordingly.
npx remotion render src/index.ts Vsl3min out/vsl-3min/vsl-3min.mp4

echo "▸ thumbnail render"
# 05-youtube-upload.mjs prefers out/thumbnail-${slug}.jpg.
npx remotion still src/index.ts ThumbnailVsl out/thumbnail-vsl-3min.jpg \
  --image-format=jpeg --jpeg-quality=92

echo "▸ upload to YouTube (unlisted by default — flip to public after review)"
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
echo ""
echo "  Update pseo-site/app/vsl/page.tsx — set VIDEO_ID const to:"
echo "    const VIDEO_ID: string | null = \"$VIDEO_ID\";"
echo ""
echo "  Then commit + redeploy. After review, flip privacy to public via"
echo "    YouTube Studio or by re-running with VIDEO_PRIVACY=public."
