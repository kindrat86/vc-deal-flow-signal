#!/usr/bin/env bash
# Publish the VC Deal Flow Signal Gradio demo to a HF Space.
#
# Idempotent: if the Space exists, this just force-pushes new file contents.
# Reads HF_TOKEN from ../../tools/.env (gitignored).
#
# Usage: bash publish.sh
set -euo pipefail

OWNER="the-data-nerd"
NAME="vc-deal-flow-signal"
REPO_ID="${OWNER}/${NAME}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Load HF_TOKEN.
if [[ -z "${HF_TOKEN:-}" ]]; then
  if [[ -f "${ROOT_DIR}/tools/.env" ]]; then
    HF_TOKEN="$(grep -E '^HF_TOKEN=' "${ROOT_DIR}/tools/.env" | head -1 | cut -d= -f2-)"
    export HF_TOKEN
  fi
fi
if [[ -z "${HF_TOKEN:-}" ]]; then
  echo "ERROR: HF_TOKEN not set and not found in tools/.env" >&2
  exit 1
fi

echo "==> Creating Space (idempotent)..."
# Create the Space. If it already exists, HF returns 409 — which we treat as OK.
CREATE_RESP=$(curl -sS -w "\n%{http_code}" -X POST \
  "https://huggingface.co/api/repos/create" \
  -H "Authorization: Bearer ${HF_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"${NAME}\",
    \"organization\": \"${OWNER}\",
    \"type\": \"space\",
    \"private\": false,
    \"sdk\": \"gradio\"
  }")
CREATE_BODY="${CREATE_RESP%$'\n'*}"
CREATE_CODE="${CREATE_RESP##*$'\n'}"
echo "Create response: HTTP ${CREATE_CODE}"
echo "${CREATE_BODY}" | head -c 500
echo

if [[ "${CREATE_CODE}" != "200" && "${CREATE_CODE}" != "201" && "${CREATE_CODE}" != "409" ]]; then
  echo "ERROR: Space create failed (HTTP ${CREATE_CODE})" >&2
  exit 1
fi

echo
echo "==> Cloning Space repo to temp dir..."
TMPDIR=$(mktemp -d)
trap 'rm -rf "${TMPDIR}"' EXIT

cd "${TMPDIR}"
git clone "https://oauth:${HF_TOKEN}@huggingface.co/spaces/${REPO_ID}" space
cd space
git config user.email "signal@gitdealflow.com"
git config user.name "The Data Nerd"

echo "==> Copying Space files..."
cp "${SCRIPT_DIR}/README.md" ./README.md
cp "${SCRIPT_DIR}/requirements.txt" ./requirements.txt
cp "${SCRIPT_DIR}/app.py" ./app.py

echo "==> Committing + pushing..."
git add README.md requirements.txt app.py
if git diff --cached --quiet; then
  echo "No changes to publish — Space is already up to date."
  exit 0
fi
git commit -m "Ship VC Deal Flow Signal Gradio demo

- Live signals tab: top startups by 14-day commit-velocity acceleration
- Glossary search: 84-term controlled vocabulary
- Citation generator: BibTeX, RIS, APA, Wikipedia for paper + dataset

Backed by signals.gitdealflow.com/api/v1/* (public, no-auth, CC BY 4.0)."

git push origin main

echo
echo "==> Done."
echo "Space: https://huggingface.co/spaces/${REPO_ID}"
