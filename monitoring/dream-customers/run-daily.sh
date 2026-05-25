#!/usr/bin/env bash
# Fired by ~/Library/LaunchAgents/com.gitdealflow.dream-customers.plist once
# per day. Invokes a non-interactive Claude Code session pointed at
# cron-prompt.md, with the Dream Customers directory as the working dir.
#
# All stdout/stderr is captured by launchd → cron.run.log / cron.run.err.
# Per-session Claude logs are written by the session itself to cron.log.

set -u  # don't set -e: we want the script to keep going if claude exits non-zero
set -o pipefail

cd "$(dirname "$0")"

ISO="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "[${ISO}] dream-customers cron starting"

# Locate the Claude CLI. Use the user-installed path explicitly so launchd's
# stripped PATH doesn't end up running a homebrew shadow.
CLAUDE_BIN="${CLAUDE_BIN:-$HOME/.local/bin/claude}"
if ! [ -x "${CLAUDE_BIN}" ]; then
  echo "[${ISO}] FATAL: claude CLI not found at ${CLAUDE_BIN}" >&2
  exit 1
fi

# Path the prompt body. cron-prompt.md is self-contained; the session
# inherits the user's global Chrome MCP via ~/.claude/settings.json.
PROMPT_FILE="$(pwd)/cron-prompt.md"

# Fire the session. --dangerously-skip-permissions only if launchd can't
# show the permission prompt anyway — uncomment if your settings.json gates
# tool calls behind interactive approval.
"${CLAUDE_BIN}" \
  -p "$(cat "${PROMPT_FILE}")" \
  --output-format text \
  >> cron.run.log \
  2>> cron.run.err

EXIT=$?
echo "[${ISO}] dream-customers cron finished exit=${EXIT}"
exit ${EXIT}
