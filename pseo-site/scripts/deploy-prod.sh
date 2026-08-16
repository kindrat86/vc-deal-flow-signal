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

# Deploy lock — serialize against concurrent deploys to the same alias-pinned
# Vercel project (multiple agents deploy this site; last-wins silently reverts
# fixes). The lock helper lives in the shared growth-loop framework so both
# deploy paths (this one and deploy_from_commit.sh) acquire the same mutex.
LOCK_HELPER="${GITDEALFLOW_LOCK_HELPER:-$HOME/growth-loop/lib/deploy-lock.sh}"
if [ -f "$LOCK_HELPER" ]; then
  # shellcheck disable=SC1090
  source "$LOCK_HELPER"
  # Lock key must match deploy_from_commit.sh: derive the Vercel projectId so
  # BOTH deploy paths serialize against the same mutex (the domain alone would
  # let a deploy_from_commit.sh run race a deploy-prod.sh run).
  LOCK_KEY="signals.gitdealflow.com"
  if [ -f ".vercel/project.json" ]; then
    _pj_id="$(sed -n 's/.*"projectId": *"\([^"]*\)".*/\1/p' .vercel/project.json | head -1)"
    [ -n "$_pj_id" ] && LOCK_KEY="$_pj_id"
  fi
  deploy_lock_acquire "$LOCK_KEY" 600 || exit 1
  trap deploy_lock_release EXIT
else
  echo "⚠ deploy-lock.sh not found at $LOCK_HELPER — proceeding WITHOUT the deploy lock."
fi

# Step 1 — build production artifacts (.vercel/output)
echo "▶ Building production artifact..."
npx vercel build --prod

# Step 2 — count files in the artifact for visibility
file_count=$(find .vercel/output -type f 2>/dev/null | wc -l | tr -d ' ')
echo "ℹ Artifact contains $file_count files"

if [ "$file_count" -gt 15000 ]; then
  echo "ℹ File count exceeds 15k — --archive=tgz is required (already passed below)"
fi

# Step 3 — gate the artifact's structured data before it is uploaded.
# A --prebuilt deploy runs no build, so the gate wired into postbuild does not
# fire here: it ships .vercel/output exactly as it sits on disk. Step 1 above
# normally refreshes it, but if that is ever skipped, reordered, or the artifact
# is reused from an earlier run, this is the only thing standing between a stale
# artifact and production. Not hypothetical — on 2026-07-25 carshake's
# .vercel/output still held 11 pages of unparsable JSON-LD (unescaped " inside
# FAQ answer strings) long after the source was fixed.
# Scans .vercel/output, not .next, because that is what actually gets uploaded.
echo "▶ Verifying structured data in the artifact..."
node scripts/verify-jsonld.mjs .vercel/output

# Step 4 — deploy with archive flag (always; cheap on small artifacts, mandatory on large)
echo "▶ Deploying to production with --archive=tgz..."
npx vercel deploy --prebuilt --prod --archive=tgz

# Step 5 - post-deploy content-marker verification (2026-08-19).
# A deploy returning 0 does not prove the site is live and rendered: an
# empty/blank 200 still exits 0 (CSP trusted-types blank shell, stale empty
# artifact). Curl the live homepage and assert HTTP 200 + a brand needle + a
# minimum body size so a blank deploy fails loudly instead of "succeeding".
# This replaces the old status-only `curl -I` hint, which missed empty pages.
VERIFY_HELPER="${GITDEALFLOW_VERIFY_HELPER:-$HOME/growth-loop/lib/verify-live-deploy.sh}"
if [ -f "$VERIFY_HELPER" ]; then
  # shellcheck disable=SC1090
  source "$VERIFY_HELPER"
  verify_live_deploy "https://signals.gitdealflow.com/" "VC Deal Flow Signal" 20000
else
  echo "⚠ verify-live-deploy.sh not found at $VERIFY_HELPER, skipping live verification."
fi

