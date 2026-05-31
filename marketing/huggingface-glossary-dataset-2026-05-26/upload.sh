#!/usr/bin/env bash
# One-shot helper to publish the VC Deal Flow Signal Glossary to
# HuggingFace Datasets.
#
# Prerequisites (user-only — Claude cannot do these autonomously):
#   1. Free HF account at https://huggingface.co/join
#   2. Access token at https://huggingface.co/settings/tokens (Write scope)
#   3. `pip install --upgrade huggingface_hub` (or `pipx install huggingface_hub`)
#   4. `huggingface-cli login` (paste the token from step 2)
#
# Then run this script from anywhere:
#   bash marketing/huggingface-glossary-dataset-2026-05-26/upload.sh
#
# It will:
#   - Fetch the live NDJSON from production (so the dataset is in sync
#     with what's actually serving — no local build needed).
#   - Create the HF dataset repo if it does not exist.
#   - Upload glossary.jsonl + README.md.
#   - Print the dataset URL.

set -euo pipefail

# CONFIGURATION — adjust if you want a different HF dataset slug.
HF_USER="${HF_USER:-$(huggingface-cli whoami 2>/dev/null | head -1)}"
HF_REPO="${HF_REPO:-vc-deal-flow-signal-glossary}"
GLOSSARY_URL="${GLOSSARY_URL:-https://signals.gitdealflow.com/api/v1/glossary.jsonl}"

if [ -z "$HF_USER" ]; then
  echo "ERROR: not logged in to HuggingFace. Run: huggingface-cli login"
  exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

echo "==> Fetching live glossary from $GLOSSARY_URL"
curl -sSfL -H "Accept: application/x-ndjson" "$GLOSSARY_URL" \
  -o "$WORK_DIR/glossary.jsonl"

LINE_COUNT=$(wc -l < "$WORK_DIR/glossary.jsonl")
echo "==> Got $LINE_COUNT terms"

if [ "$LINE_COUNT" -lt 50 ]; then
  echo "ERROR: only $LINE_COUNT lines — expected ~62. Aborting."
  exit 1
fi

echo "==> Copying README.md (HF dataset card)"
cp "$SCRIPT_DIR/README.md" "$WORK_DIR/README.md"

REPO_ID="$HF_USER/$HF_REPO"
echo "==> Target repo: $REPO_ID"

# Create the repo if missing (idempotent — exit 0 if it already exists).
huggingface-cli repo create "$HF_REPO" --type dataset -y 2>&1 | grep -v "already exists" || true

echo "==> Uploading glossary.jsonl + README.md"
huggingface-cli upload "$REPO_ID" "$WORK_DIR/glossary.jsonl" glossary.jsonl --repo-type dataset
huggingface-cli upload "$REPO_ID" "$WORK_DIR/README.md" README.md --repo-type dataset

echo ""
echo "==> Done. Dataset URL:"
echo "    https://huggingface.co/datasets/$REPO_ID"
echo ""
echo "==> Verify with:"
echo "    curl -sL https://huggingface.co/datasets/$REPO_ID/resolve/main/glossary.jsonl | head -1 | jq ."
