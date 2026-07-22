#!/bin/bash
# IndexNow ping script for signals.gitdealflow.com
# Reads up to 200 URLs from live sitemap index children and submits to IndexNow.
# Key file at public/22dfd6f8f816469b8c216bc7eaf8b936.txt is already deployed.
#
# Usage: bash scripts/indexnow-ping.sh
set -euo pipefail

HOST="signals.gitdealflow.com"
KEY="22dfd6f8f816469b8c216bc7eaf8b936"
BASE_URL="https://${HOST}"
INDEXNOW_URL="https://api.indexnow.org/indexnow"

echo "=== IndexNow ping for ${HOST} ==="

# Collect URLs from live sitemap children
URLS=$(mktemp)
trap 'rm -f "$URLS"' EXIT

SITEMAP_INDEX="${BASE_URL}/sitemap.xml"
echo "→ Fetching sitemap index: ${SITEMAP_INDEX}"

# Extract child sitemap URLs from sitemap index
CHILD_SITEMAPS=$(curl -sf "${SITEMAP_INDEX}" | grep -oP '<loc>[^<]+</loc>' | sed 's/<loc>//;s/<\/loc>//' | head -6)

for child in $CHILD_SITEMAPS; do
  echo "→ Fetching child sitemap: ${child}"
  curl -sf "$child" | grep -oP '<loc>[^<]+</loc>' | sed 's/<loc>//;s/<\/loc>//' >> "$URLS" || true
done

TOTAL=$(wc -l < "$URLS" | tr -d ' ')
echo "→ Collected ${TOTAL} URLs"

# IndexNow batch limit: 10,000 URLs per call, but we submit max 200
head -n 200 "$URLS" > "${URLS}.200"
SUBMIT_COUNT=$(wc -l < "${URLS}.200" | tr -d ' ')

echo "→ Submitting ${SUBMIT_COUNT} URLs to IndexNow..."

# Build JSON payload
URL_LIST=$(head -n 200 "$URLS" | jq -R -s 'split("\n") | map(select(length > 0))')

PAYLOAD=$(jq -n \
  --arg host "$HOST" \
  --arg key "$KEY" \
  --argjson urlList "$URL_LIST" \
  '{host: $host, key: $key, keyLocation: "https://\($host)/\($key).txt", urlList: $urlList}')

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${INDEXNOW_URL}" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "→ Response HTTP ${HTTP_CODE}"
echo "→ Body: ${BODY}"

if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "202" ]]; then
  echo "✓ IndexNow ping successful"
else
  echo "✗ IndexNow ping returned ${HTTP_CODE}"
  exit 1
fi
