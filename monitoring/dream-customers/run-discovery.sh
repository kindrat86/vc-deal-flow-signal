#!/usr/bin/env bash
# Fired by ~/Library/LaunchAgents/com.gitdealflow.dream-customers-discovery.plist
# once per day. Invokes a non-interactive Claude Code session pointed at
# cron-prompt-discovery.md to find new Marcus-fit VC handles on X and append
# them to data.json as Sourced contacts.
#
# All stdout/stderr is captured by launchd → cron.discovery.run.log /
# cron.discovery.run.err. Per-session Claude logs are written by the session
# itself to cron.discovery.log.

set -u  # don't set -e: we want the script to keep going if claude exits non-zero
set -o pipefail

cd "$(dirname "$0")"

ISO="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "[${ISO}] dream-customers DISCOVERY cron starting"

CLAUDE_BIN="${CLAUDE_BIN:-$HOME/.local/bin/claude}"
if ! [ -x "${CLAUDE_BIN}" ]; then
  echo "[${ISO}] FATAL: claude CLI not found at ${CLAUDE_BIN}" >&2
  exit 1
fi

PROMPT_FILE="$(pwd)/cron-prompt-discovery.md"

"${CLAUDE_BIN}" \
  -p "$(cat "${PROMPT_FILE}")" \
  --output-format text \
  >> cron.discovery.run.log \
  2>> cron.discovery.run.err

EXIT=$?
echo "[${ISO}] dream-customers DISCOVERY cron finished exit=${EXIT}"
exit ${EXIT}
