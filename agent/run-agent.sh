#!/bin/bash
# run-agent.sh — Signal Analyst Agent production wrapper
#
# Sources environment from .env, builds if needed, then starts the agent
# as a long-lived daemon. Scheduled by com.gitdealflow.signal-analyst-agent.plist.
#
# Logs: /tmp/gitdealflow-agent.log / /tmp/gitdealflow-agent.err.log
set -euo pipefail

# launchd runs with a minimal environment — set these explicitly.
export HOME="/Users/sipi"
export PATH="/Users/sipi/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# Self-locating
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# --- Load .env ---
if [ -f .env ]; then
  set -a
  source .env
  set +a
  echo "$(date '+%Y-%m-%d %H:%M:%S %Z') | agent: .env loaded" >> /tmp/gitdealflow-agent.log
else
  echo "$(date '+%Y-%m-%d %H:%M:%S %Z') | agent: WARNING — no .env file found" >> /tmp/gitdealflow-agent.log
fi

# --- Build if needed ---
if [ ! -f dist/index.js ] || [ src/index.ts -nt dist/index.js ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S %Z') | agent: rebuilding..." >> /tmp/gitdealflow-agent.log
  npx tsc 2>&1 | tee -a /tmp/gitdealflow-agent.log
fi

# --- Start agent ---
echo "$(date '+%Y-%m-%d %H:%M:%S %Z') | agent: starting Signal Analyst Agent v1.0" >> /tmp/gitdealflow-agent.log

exec node dist/index.js
