#!/usr/bin/env bash
# Fired by ~/Library/LaunchAgents/com.gitdealflow.dream-customers-discovery.plist
# once per day. Runs discover.mjs (Playwright + saved x.com session).
# No Claude CLI, no Anthropic API key — uses the headless browser directly.
#
# All stdout/stderr → cron.discovery.run.log / cron.discovery.run.err.
# Per-run summary line is written by discover.mjs to cron.discovery.log.

set -u
set -o pipefail

cd "$(dirname "$0")"

ISO="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "[${ISO}] dream-customers DISCOVERY cron starting"

# Locate node. Use the user-installed path so launchd's stripped PATH doesn't
# end up running a homebrew shadow.
NODE_BIN="${NODE_BIN:-/opt/homebrew/bin/node}"
if ! [ -x "${NODE_BIN}" ]; then
  if command -v node > /dev/null; then
    NODE_BIN="$(command -v node)"
  else
    echo "[${ISO}] FATAL: node not found" >&2
    exit 1
  fi
fi

"${NODE_BIN}" discover.mjs >> cron.discovery.run.log 2>> cron.discovery.run.err
EXIT=$?

echo "[${ISO}] dream-customers DISCOVERY cron finished exit=${EXIT}"
exit ${EXIT}
