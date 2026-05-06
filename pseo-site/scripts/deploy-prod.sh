#!/usr/bin/env bash
#
# deploy-prod.sh — production deploy wrapper
#
# Why this script exists:
#   Vanilla `vercel deploy --prebuilt --prod` fails with HTTP 400
#   "missing_archive" because the prebuilt artifact contains 25,000+
#   files (one per pSEO slug × ~80 files each: .func bundles,
#   .rsc.func bundles, .prerender-config.json, .prerender-fallback.html,
#   etc.). Vercel's plain-upload path caps at 15,000 files; anything
#   above that requires `--archive=tgz` so the artifact is tarred
#   before upload.
#
#   Memory entry "[Brunson Secret 18 — Cart Funnel V8 ship 2026-05-06]"
#   documents this; this script bakes the flag in so contributors don't
#   re-discover it the hard way every prod deploy.
#
# Root cause (long-form): docs/build-bloat-diagnosis-2026-05-06.md
#
# Usage:
#   pnpm deploy:prod          # via package.json shorthand
#   bash scripts/deploy-prod.sh
#
#   # or the manual long form, equivalent:
#   npx vercel build --prod
#   npx vercel deploy --prebuilt --prod --archive=tgz

set -euo pipefail

# Step 1 — build production artifacts (.vercel/output)
echo "▶ Building production artifact..."
npx vercel build --prod

# Step 2 — count files in the artifact for visibility
file_count=$(find .vercel/output -type f 2>/dev/null | wc -l | tr -d ' ')
echo "ℹ Artifact contains $file_count files"

if [ "$file_count" -gt 15000 ]; then
  echo "ℹ File count exceeds 15k — --archive=tgz is required (already passed below)"
fi

# Step 3 — deploy with archive flag (always; cheap on small artifacts, mandatory on large)
echo "▶ Deploying to production with --archive=tgz..."
npx vercel deploy --prebuilt --prod --archive=tgz

echo "✔ Production deploy complete. Verify with: curl -I https://signals.gitdealflow.com/"
