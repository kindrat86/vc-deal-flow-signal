#!/usr/bin/env bash
# Fired by ~/Library/LaunchAgents/com.gitdealflow.engagement.plist once per day.
# Invokes a non-interactive Claude Code session pointed at
# engagement-cron-prompt.md, with the Dream Customers directory as working dir.
#
# This is the INBOUND-ENGAGEMENT scrape (who replied/liked/reposted @data_nerd),
# distinct from run-daily.sh (what the VC targets posted). Both can share the
# day; this one is offset to 09:00 so two Claude sessions don't fight over
# Chrome MCP at the same minute.
#
# All stdout/stderr is captured by launchd → engagement.run.log / .err.
# The session's own one-line summary goes to cron.log.

set -u
set -o pipefail

cd "$(dirname "$0")"

# --- Unattended auth ---------------------------------------------------------
# launchd background agents can't reliably unlock the macOS login Keychain, and
# the interactive OAuth login token isn't persisted for headless runs, so the
# claude CLI 401s without an explicit token. Load CLAUDE_CODE_OAUTH_TOKEN from
# cron-auth.env (gitignored; see cron-auth.env.example — generate the value with
# `claude setup-token`). `set -a` exports everything sourced so the token
# reaches the claude subprocess.
if [ -f cron-auth.env ]; then
  set -a
  . ./cron-auth.env
  set +a
fi
ISO="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
if [ -z "${CLAUDE_CODE_OAUTH_TOKEN:-}" ]; then
  echo "[${ISO}] WARN: CLAUDE_CODE_OAUTH_TOKEN not set (missing/empty cron-auth.env)." \
       "Headless claude will 401. Run 'claude setup-token' and populate cron-auth.env." >&2
fi
# ----------------------------------------------------------------------------

echo "[${ISO}] engagement cron starting"

CLAUDE_BIN="${CLAUDE_BIN:-$HOME/.local/bin/claude}"
if ! [ -x "${CLAUDE_BIN}" ]; then
  echo "[${ISO}] FATAL: claude CLI not found at ${CLAUDE_BIN}" >&2
  exit 1
fi

PROMPT_FILE="$(pwd)/engagement-cron-prompt.md"

"${CLAUDE_BIN}" \
  -p "$(cat "${PROMPT_FILE}")" \
  --output-format text \
  >> engagement.run.log \
  2>> engagement.run.err

EXIT=$?
echo "[${ISO}] engagement cron finished exit=${EXIT}"
exit ${EXIT}
