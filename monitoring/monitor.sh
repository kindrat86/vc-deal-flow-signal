#!/bin/bash
# Monitor all vc-deal-flow-signal services. Runs every 5 min via launchd.
# Alerts via Resend on state change (down / recovered).

DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(dirname "$DIR")"
STATE_FILE="$DIR/.state"
LOG_FILE="$DIR/monitor.log"

# Load Resend credentials from email-api .env (safe parsing, no eval)
RESEND_API_KEY=$(grep '^RESEND_API_KEY=' "$PROJECT/email-api/.env" | cut -d= -f2- | tr -d '"'"'"')
FROM_EMAIL=$(grep '^FROM_EMAIL=' "$PROJECT/email-api/.env" | cut -d= -f2- | tr -d '"'"'"')
ALERT_TO="${FROM_EMAIL:-signal@gitdealflow.com}"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
FAILURES=()

json_escape() {
  printf '%s' "$1" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'
}

check_url() {
  local name="$1" url="$2" expected="${3:-200}"
  local status
  status=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 10 --max-time 15 "$url")
  if [ "$status" != "$expected" ]; then
    FAILURES+=("$name: expected $expected, got $status")
  fi
}

check_launchd() {
  local name="$1" label="$2"
  if ! launchctl list 2>/dev/null | grep -q "$label"; then
    FAILURES+=("$name: launchd service not running")
  fi
}

# --- Checks ---
check_url "Landing (gitdealflow.com)" "https://gitdealflow.com"
check_url "pSEO (signals.gitdealflow.com)" "https://signals.gitdealflow.com"
check_url "Pocketbase" "http://127.0.0.1:8090/api/health"
check_url "Email API" "http://127.0.0.1:3001/health"
check_launchd "Pocketbase service" "com.gitdealflow.pocketbase"
check_launchd "Email API service" "com.gitdealflow.email-api"
check_launchd "Email cron" "com.gitdealflow.email-cron"

# --- Evaluate ---
if [ ${#FAILURES[@]} -eq 0 ]; then
  CURRENT_STATE="ok"
  echo "$TIMESTAMP | OK | all checks passed" >> "$LOG_FILE"
else
  CURRENT_STATE="fail"
  echo "$TIMESTAMP | FAIL | ${FAILURES[*]}" >> "$LOG_FILE"
fi

PREV_STATE=$(cat "$STATE_FILE" 2>/dev/null || echo "unknown")

# --- Alert on state change only ---
if [ "$CURRENT_STATE" != "$PREV_STATE" ]; then
  if [ "$CURRENT_STATE" = "fail" ]; then
    BODY="<p><strong>Monitor Alert</strong> &mdash; $TIMESTAMP</p><ul>"
    for f in "${FAILURES[@]}"; do
      BODY+="<li>$f</li>"
    done
    BODY+="</ul>"
    ESCAPED_BODY=$(json_escape "$BODY")

    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST 'https://api.resend.com/emails' \
      -H "Authorization: Bearer $RESEND_API_KEY" \
      -H 'Content-Type: application/json' \
      -d "$(cat <<ENDJSON
{
  "from": "Monitor <${FROM_EMAIL}>",
  "to": "${ALERT_TO}",
  "subject": "[DOWN] VC Deal Flow Signal - Service Alert",
  "html": $ESCAPED_BODY
}
ENDJSON
)")

    echo "$TIMESTAMP | Alert sent (HTTP $RESPONSE)" >> "$LOG_FILE"

  else
    ESCAPED_BODY=$(json_escape "<p>All services recovered as of $TIMESTAMP.</p>")

    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST 'https://api.resend.com/emails' \
      -H "Authorization: Bearer $RESEND_API_KEY" \
      -H 'Content-Type: application/json' \
      -d "$(cat <<ENDJSON
{
  "from": "Monitor <${FROM_EMAIL}>",
  "to": "${ALERT_TO}",
  "subject": "[RECOVERED] VC Deal Flow Signal - All Services Up",
  "html": $ESCAPED_BODY
}
ENDJSON
)")

    echo "$TIMESTAMP | Recovery sent (HTTP $RESPONSE)" >> "$LOG_FILE"
  fi
fi

echo "$CURRENT_STATE" > "$STATE_FILE"

# Keep log at 1000 lines
tail -n 1000 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
