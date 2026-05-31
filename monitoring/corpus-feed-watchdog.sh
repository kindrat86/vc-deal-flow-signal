#!/usr/bin/env bash
#
# corpus-feed-watchdog.sh — keep /api/corpus.json live in production.
#
# Why this exists: the 407-entity curated entity corpus feed (/api/corpus.json
# + /api/corpus.jsonl) and its declared machine surfaces (DCAT dataset.json,
# agents.txt, entities.json) currently live only on the unmerged PR #274
# branch. Production was shipped a surgical cherry-pick of just those 6 files.
# Because that ship is AHEAD of main, any plain main->prod redeploy would drop
# corpus and re-introduce a 404 on a surface that agents.txt/DCAT advertise.
#
# This watchdog detects that revert and re-ships corpus.
#
# IMPORTANT — it re-cherry-picks onto the LATEST origin/main every time, NOT a
# frozen snapshot. So re-shipping corpus never reverts newer main work; it
# always deploys (current main + corpus). Once PR #274 (or the corpus portion)
# merges to main, the probe stays 200 forever and this watchdog never acts —
# it self-retires with no edit needed.
#
# Schedule: com.gitdealflow.corpus-feed-watchdog.plist (every 15 min, RunAtLoad)
# Companion to vercel-watchdog.py (which only redeploys ERROR-state builds).
#
# Usage:
#   corpus-feed-watchdog.sh             # probe + re-ship if reverted
#   corpus-feed-watchdog.sh --dry-run   # probe + report only, no deploy
set -uo pipefail

REPO="/Users/sipi/launch-projects/vc-deal-flow-signal"
PSEO_DIR="$REPO/pseo-site"
URL="https://signals.gitdealflow.com/api/corpus.json"
JSONL_URL="https://signals.gitdealflow.com/api/corpus.jsonl"
CORPUS_BRANCH="origin/claude/corpus-feed-2026-05-30"  # cherry-pick source
CORPUS_FILES=(
  "pseo-site/lib/corpus.ts"
  "pseo-site/app/api/corpus.json/route.ts"
  "pseo-site/app/api/corpus.jsonl/route.ts"
  "pseo-site/app/.well-known/dataset.json/route.ts"
  "pseo-site/app/agents.txt/route.ts"
  "pseo-site/app/entities.json/route.ts"
)
LOCKDIR="/tmp/corpus-feed-watchdog.lock.d"
STATE="$REPO/monitoring/corpus-feed-watchdog.state.json"
COOLDOWN_S=1800          # don't re-attempt a deploy within 30 min (let it propagate)
AUTH_JSON="$HOME/Library/Application Support/com.vercel.cli/auth.json"

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
log() { echo "$(ts) $*"; }

# Single-flight: never let two watchdog runs deploy at once. mkdir is atomic
# on macOS (no flock dependency). Stale locks >1h old are reclaimed.
if ! mkdir "$LOCKDIR" 2>/dev/null; then
  if [ -d "$LOCKDIR" ]; then
    lock_age=$(( $(date -u +%s) - $(stat -f %m "$LOCKDIR" 2>/dev/null || echo 0) ))
    if [ "$lock_age" -gt 3600 ]; then
      log "LOCK stale (${lock_age}s) — reclaiming"
      rmdir "$LOCKDIR" 2>/dev/null
      mkdir "$LOCKDIR" 2>/dev/null || { log "LOCKED could not reclaim — skipping"; exit 0; }
    else
      log "LOCKED another run holds the lock (${lock_age}s) — skipping"
      exit 0
    fi
  fi
fi
WT=""  # set later; cleanup handles both lock + worktree
cleanup() {
  cd "$REPO" 2>/dev/null
  [ -n "$WT" ] && git worktree remove "$WT" --force 2>/dev/null
  rmdir "$LOCKDIR" 2>/dev/null
}
trap cleanup EXIT

code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$URL" || echo "000")
if [ "$code" = "200" ]; then
  log "OK corpus.json http=200 — nothing to do"
  exit 0
fi

log "DOWN corpus.json http=$code — corpus appears reverted"

if [ "$DRY_RUN" = "1" ]; then
  log "DRY-RUN would re-ship corpus (current origin/main + 6 corpus files)"
  exit 0
fi

# Cooldown: if we deployed recently, give it time to build+propagate before
# firing another deploy (avoids stacking builds every 15 min).
now=$(date -u +%s)
if [ -f "$STATE" ]; then
  last=$(python3 -c "import json,sys;print(json.load(open('$STATE')).get('last_attempt_epoch',0))" 2>/dev/null || echo 0)
  if [ "$last" -gt 0 ] 2>/dev/null; then
    age=$((now - last))
    if [ "$age" -lt "$COOLDOWN_S" ]; then
      log "COOLDOWN last deploy ${age}s ago (< ${COOLDOWN_S}s) — waiting for it to propagate"
      exit 0
    fi
  fi
fi

# Resolve Vercel token (same source the python watchdog uses).
TOKEN=$(python3 -c "import json,os;print(json.load(open(os.path.expanduser('$AUTH_JSON')))['token'])" 2>/dev/null)
if [ -z "${TOKEN:-}" ]; then
  log "ERROR could not read Vercel token from auth.json — aborting"
  exit 1
fi

# Record the attempt BEFORE deploying so a crash mid-deploy still trips cooldown.
python3 -c "import json;json.dump({'last_attempt_epoch':$now,'last_attempt_iso':'$(ts)','probe_http':'$code'},open('$STATE','w'),indent=2)" 2>/dev/null

cd "$REPO" || { log "ERROR cannot cd $REPO"; exit 1; }
git fetch origin --quiet 2>/dev/null

WT="/tmp/corpus-redeploy-$$"
git worktree remove "$WT" --force 2>/dev/null
if ! git worktree add --detach "$WT" origin/main 2>/dev/null; then
  log "ERROR could not create worktree off origin/main"
  WT=""
  exit 1
fi

if ! git -C "$WT" checkout "$CORPUS_BRANCH" -- "${CORPUS_FILES[@]}" 2>/dev/null; then
  log "ERROR could not cherry-pick corpus files from $CORPUS_BRANCH"
  exit 1
fi

# Carry the Vercel project link into the worktree (.vercel is gitignored).
cp -R "$PSEO_DIR/.vercel" "$WT/pseo-site/.vercel" 2>/dev/null

log "DEPLOY shipping (origin/main + corpus) to production…"
cd "$WT/pseo-site" || { log "ERROR cannot cd worktree pseo-site"; exit 1; }
out=$(vercel deploy --prod --archive=tgz --yes --token "$TOKEN" 2>&1)
rc=$?
echo "$out" | tail -8
if [ "$rc" -ne 0 ]; then
  log "ERROR vercel deploy exited $rc — corpus still down, will retry after cooldown"
  exit 1
fi

# Verify the public alias actually serves corpus again.
sleep 5
v1=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$URL" || echo "000")
v2=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$JSONL_URL" || echo "000")
if [ "$v1" = "200" ] && [ "$v2" = "200" ]; then
  log "RECOVERED corpus.json=$v1 corpus.jsonl=$v2 — re-ship succeeded"
else
  log "WARN post-deploy probe corpus.json=$v1 corpus.jsonl=$v2 (alias may still be propagating)"
fi
exit 0
