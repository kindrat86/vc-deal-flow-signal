#!/usr/bin/env bash
# Daily wrapper for the LLM marketplaces watcher.
# Runs check.mjs (state transitions) then keepalive.mjs (anti-stale bumps).
# Loaded via ~/Library/LaunchAgents/com.gitdealflow.llm-marketplaces-watcher.plist

set -u
cd /Users/sipi/launch-projects/vc-deal-flow-signal

# Use Homebrew-installed node + gh; PATH inherited from launchd is minimal.
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

LOG_DIR="/Users/sipi/launch-projects/vc-deal-flow-signal/tools/llm-marketplaces-watcher"
ts() { date -Iseconds; }

echo "[$(ts)] --- check.mjs start ---" >> "$LOG_DIR/run.log"
node tools/llm-marketplaces-watcher/check.mjs >> "$LOG_DIR/run.log" 2>&1
CHECK_RC=$?
echo "[$(ts)] check.mjs exit=$CHECK_RC" >> "$LOG_DIR/run.log"

echo "[$(ts)] --- keepalive.mjs start ---" >> "$LOG_DIR/run.log"
node tools/llm-marketplaces-watcher/keepalive.mjs >> "$LOG_DIR/run.log" 2>&1
KA_RC=$?
echo "[$(ts)] keepalive.mjs exit=$KA_RC" >> "$LOG_DIR/run.log"

# Trim log to last 2000 lines to prevent unbounded growth
if [ -f "$LOG_DIR/run.log" ]; then
  tail -2000 "$LOG_DIR/run.log" > "$LOG_DIR/run.log.tmp" && mv "$LOG_DIR/run.log.tmp" "$LOG_DIR/run.log"
fi

exit 0
