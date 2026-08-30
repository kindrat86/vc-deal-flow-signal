#!/bin/bash
# run-weekly-digest.sh — Weekly Signal Digest automation.
#
# 1) Refreshes GitHub data (fetch-github-data.ts — best-effort; uses `gh auth token`).
# 2) Regenerates emails/signal-digest-<UTC-date>.html + signal-digest-latest.html
#    from the refreshed pseo-site/data/startups.json.
# 3) Generates channel-ready drafts from the same rendered issue. This step
#    never publishes or sends them.
# 4) Broadcasts that issue to ALL ACTIVE subscribers via Resend. Idempotent per
#    digest-<date> in the local sent log, so a re-run the same day is a no-op.
#
# Scheduled by com.gitdealflow.weekly-digest (Sundays 16:00 Europe/Athens ≈ 09:00 US Eastern).
# Pass --dry-run to refresh + regenerate + COUNT recipients without sending anything.
#
# A fetch failure may use the last-good data only when the last completed
# refresh is no more than eight days old. Older or unproven data blocks sends.
set -euo pipefail

# launchd runs with a minimal environment — set these explicitly.
# Prefer node@22 (the project's pinned version) over the unversioned homebrew node.
export HOME="/Users/sipi"
export PATH="/Users/sipi/.local/bin:/Users/sipi/.hermes/node/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# Self-locating: PROJECT_DIR = repo root (parent of this script's monitoring/ dir),
# so the cron operates on whatever checkout this wrapper lives in (e.g. the dedicated
# gdf-main worktree pinned to origin/main) rather than a hardcoded path.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG="$PROJECT_DIR/monitoring/weekly-digest.log"

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1
GITHUB_REFRESH_TIMEOUT_SECONDS="${GITHUB_REFRESH_TIMEOUT_SECONDS:-1800}"

log() { echo "$(date '+%Y-%m-%d %H:%M:%S %Z') | $*" | tee -a "$LOG"; }

# Auto-sync this dedicated worktree to latest origin/main before any work, so the
# Sunday run always uses current code (no manual edits live here — safe to reset).
# Best-effort: a fetch failure just proceeds with the current checkout. The whole
# unit is a brace-group followed by exec, so bash fully parses it before `git reset`
# can rewrite this file mid-run; we then re-exec the updated wrapper exactly once
# (WEEKLY_DIGEST_SYNCED guards against an infinite loop).
{
  if [[ "${WEEKLY_DIGEST_SYNCED:-}" != "1" ]]; then
    if git -C "$PROJECT_DIR" fetch origin --quiet \
       && git -C "$PROJECT_DIR" reset --hard origin/main >/dev/null 2>&1; then
      log "sync: $PROJECT_DIR @ origin/main ($(git -C "$PROJECT_DIR" rev-parse --short HEAD))"
    else
      log "sync: FAILED — proceeding with current checkout"
    fi
    export WEEKLY_DIGEST_SYNCED=1
    exec /bin/bash "$SCRIPT_DIR/run-weekly-digest.sh" "$@"
  fi
}

log "=== weekly digest start (dry_run=$DRY_RUN) ==="

cd "$PROJECT_DIR/pseo-site"

# 1) Refresh GitHub data first. If GitHub is slow, a recent completed snapshot
#    may be used, but missing or stale refresh evidence blocks the send.
# Bound the refresh so the job cannot hang forever.
# macOS lacks GNU timeout; Perl alarm is available in the base system.
if /usr/bin/perl -e 'alarm shift; exec @ARGV' "$GITHUB_REFRESH_TIMEOUT_SECONDS" npx --yes tsx scripts/fetch-github-data.ts >>"$LOG" 2>&1; then
  log "fetch: OK (data refreshed)"
else
  log "fetch: FAILED - checking last completed refresh before proceeding"
fi

FRESHNESS_CHECKER="$PROJECT_DIR/monitoring/check-refresh-freshness.py"
FRESHNESS_METADATA="$PROJECT_DIR/pseo-site/data/github-refresh-metadata.json"
if /Users/sipi/.local/bin/python3.11 "$FRESHNESS_CHECKER" "$FRESHNESS_METADATA" --max-age-days 8 --min-sector-count 5 >>"$LOG" 2>&1; then
  log "freshness: OK"
else
  log "freshness: FAILED - aborting before generation or send"
  exit 1
fi

# 2) Regenerate the digest HTML (npx tsx — same invocation as pseo-site prebuild).
#    Must succeed; otherwise abort before any send.
if npx --yes tsx scripts/generate-signal-digest-email.ts >>"$LOG" 2>&1; then
  log "generate: OK"
else
  log "generate: FAILED — aborting before any send"
  exit 1
fi

DATE_UTC="$(date -u +%F)"

# 3) Repurpose the exact rendered issue into review-only channel drafts. A
#    parser failure is logged loudly but must not block the paid delivery path.
#    Nothing in repurpose-digest.mjs calls a network or platform API.
cd "$PROJECT_DIR"
if node tools/repurposing/repurpose-digest.mjs \
  --campaign="gdf-weekly-$DATE_UTC" >>"$LOG" 2>&1; then
  log "repurpose: OK (review-only drafts; nothing published)"
else
  log "repurpose: FAILED - continuing with digest delivery"
fi

# 4) Broadcast (or dry-run count). DATE_UTC matches the generator's UTC-dated file.
cd "$PROJECT_DIR/email-api"
if [[ "$DRY_RUN" == "1" ]]; then
  if node send-weekly-digest.mjs --date "$DATE_UTC" >>"$LOG" 2>&1; then
    log "dry-run: OK (nothing sent)"
  else
    log "dry-run: FAILED"; exit 1
  fi
else
  if node send-weekly-digest.mjs --date "$DATE_UTC" --send >>"$LOG" 2>&1; then
    log "send: OK"
  else
    log "send: FAILED"; exit 1
  fi
fi

log "=== weekly digest done ==="
