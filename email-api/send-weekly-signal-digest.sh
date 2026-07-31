#!/bin/bash
#
# send-weekly-signal-digest.sh
#
# Sends the latest Signal Digest email to all active GitDealFlow subscribers
# via the Resend API. Idempotent: tracks sends per-issue in a sent-log so
# re-runs on the same day (or cron re-fire) never double-sends.
#
# Always BCCs sales@sipiteno.com (portfolio-wide convention).
#
# Flow:
#   1. Regenerate the digest HTML from current data/startups.json (fresh stats)
#   2. Determine today's issue date
#   3. Load active subscribers from Resend audience (PRO team)
#   4. Skip any already in the sent-log for this issue
#   5. Send via curl (proven working), BCC sales@sipiteno.com on every send
#
# Usage:
#   ./send-weekly-signal-digest.sh           # live send
#   ./send-weekly-signal-digest.sh --dry     # dry run (no sends)
#
set -euo pipefail

DRY_RUN="--dry"
[ $# -eq 0 ] && DRY_RUN=""

PSEO_DIR="/Users/sipi/Downloads/vc-deal-flow-signal/pseo-site"
EMAILS_DIR="/Users/sipi/Downloads/vc-deal-flow-signal/emails"
SENT_LOG_DIR="/Users/sipi/Downloads/vc-deal-flow-signal/email-api/sent-log"

PRO_KEY="re_3K9Eht1E_DbtLMaPBviJCMk7UpMGF4rc6"
FROM="The Data Nerd <signal@gitdealflow.com>"
BCC="sales@sipiteno.com"
AUDIENCE_ID="1ddf358e-2416-4481-a0f5-538fd12f6e73"  # GitDealFlow on PRO team

TODAY=$(date "+%Y-%m-%d")
ISSUE_KEY="digest-${TODAY}"
SENT_LOG_FILE="${SENT_LOG_DIR}/${ISSUE_KEY}.json"

echo "=== Weekly Signal Digest — ${TODAY} ==="
echo "Mode: ${DRY_RUN:-LIVE}"
echo ""

# ─── 1. Regenerate the digest HTML from fresh data ──────────────────
echo "[1/4] Regenerating digest from fresh data..."
cd "$PSEO_DIR"
npx tsx scripts/generate-signal-digest-email.ts 2>&1 | tail -3
echo ""

DIGEST_FILE="${EMAILS_DIR}/signal-digest-${TODAY}.html"
LATEST_FILE="${EMAILS_DIR}/signal-digest-latest.html"

if [ ! -f "$DIGEST_FILE" ]; then
  # Generator might not produce today's if data hasn't changed — fall back to latest
  DIGEST_FILE="$LATEST_FILE"
  echo "  (No issue for today — using latest)"
fi

if [ ! -f "$DIGEST_FILE" ]; then
  echo "ERROR: No digest HTML found. Exiting."
  exit 1
fi

echo "Using: $DIGEST_FILE ($(wc -c < "$DIGEST_FILE") bytes)"
echo ""

# ─── 2. Extract subject from <title> tag ────────────────────────────
SUBJECT=$(python3 -c "
import re
with open('$DIGEST_FILE') as f:
    html = f.read()
m = re.search(r'<title>([^<]+)</title>', html)
print(m.group(1).strip() if m else 'Signal Digest — Week of $TODAY')
")
echo "Subject: $SUBJECT"
echo ""

# ─── 3. Load active subscribers from Resend ─────────────────────────
echo "[2/4] Loading active subscribers..."
CONTACTS_JSON=$(curl -s "https://api.resend.com/audiences/${AUDIENCE_ID}/contacts" \
  -H "Authorization: Bearer ${PRO_KEY}")

# Parse: extract active emails as JSON array
ACTIVE=$(echo "$CONTACTS_JSON" | python3 -c "
import json, sys
d = json.load(sys.stdin)
data = d.get('data', []) or []
active = [c['email'] for c in data if not c.get('unsubscribed')]
print('\n'.join(active))
")

ACTIVE_COUNT=$(echo "$ACTIVE" | grep -c . || echo 0)
echo "  $ACTIVE_COUNT active subscribers"
echo ""

# ─── 4. Load sent-log (idempotency) ─────────────────────────────────
mkdir -p "$SENT_LOG_DIR"
touch "$SENT_LOG_FILE"

ALREADY_SENT=$(cat "$SENT_LOG_FILE" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('\n'.join(data))
except:
    pass
" 2>/dev/null || echo "")

# ─── 5. Read HTML for payload ───────────────────────────────────────
HTML_ESCAPED=$(python3 -c "
import json
with open('$DIGEST_FILE') as f:
    print(json.dumps(f.read()))
")

echo "[3/4] Sending (BCC: $BCC on every send)..."
echo ""

SENT=0
FAILED=0
SKIPPED=0

while IFS= read -r EMAIL; do
  [ -z "$EMAIL" ] && continue

  # Skip if already sent this issue
  if echo "$ALREADY_SENT" | grep -qF "$EMAIL"; then
    echo "  ⊘ $EMAIL (already sent)"
    SKIPPED=$((SKIPPED+1))
    continue
  fi

  if [ -n "$DRY_RUN" ]; then
    echo "  [DRY] → $EMAIL"
    SENT=$((SENT+1))
    continue
  fi

  RESULT=$(curl -s -X POST https://api.resend.com/emails \
    -H "Authorization: Bearer $PRO_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"from\": \"$FROM\",
      \"to\": \"$EMAIL\",
      \"bcc\": \"$BCC\",
      \"subject\": \"$SUBJECT\",
      \"html\": $HTML_ESCAPED,
      \"headers\": {
        \"List-Unsubscribe\": \"<mailto:signal@gitdealflow.com?subject=unsubscribe>\",
        \"List-Unsubscribe-Post\": \"List-Unsubscribe=One-Click\"
      },
      \"tags\": [{\"name\": \"email_key\", \"value\": \"$ISSUE_KEY\"}]
    }" 2>&1)

  if echo "$RESULT" | grep -q '"id"'; then
    RESEND_ID=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('id','?'))" 2>/dev/null || echo "?")
    echo "  ✅ $EMAIL → $RESEND_ID"
    SENT=$((SENT+1))
    # Record in sent-log immediately (crash-safe)
    python3 -c "
import json
sent = []
try:
    with open('$SENT_LOG_FILE') as f:
        sent = json.load(f)
except: pass
sent.append('$EMAIL')
with open('$SENT_LOG_FILE', 'w') as f:
    json.dump(sorted(set(sent)), f, indent=2)
"
  else
    echo "  ❌ $EMAIL: $(echo "$RESULT" | head -c 120)"
    FAILED=$((FAILED+1))
  fi

  sleep 0.4  # gentle throttle

done <<< "$ACTIVE"

echo ""
echo "[4/4] Done."
echo "  sent=$SENT  failed=$FAILED  skipped=$SKIPPED"
echo "  BCC sales@sipiteno.com was on every send."
echo ""
echo "Sent log: $SENT_LOG_FILE"
