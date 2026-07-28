#!/bin/bash
# Post-deploy verification + IndexNow + WebSub for GitDealFlow Live Ticker
SITE="https://signals.gitdealflow.com"
KEY="8f9aa4b92419466f9787"

NEW_URLS=(
  "$SITE/ticker"
  "$SITE/ticker/embed/"
  "$SITE/ticker.js"
  "$SITE/api/v1/signals/feed.json"
)

echo "=== VERIFY NEW URLS ==="
for url in "${NEW_URLS[@]}"; do
  code=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 10 "$url")
  echo "  $url → $code"
done

echo ""
echo "=== CSP ON EMBED ==="
curl -sIL --max-time 10 "$SITE/ticker/embed/" 2>&1 | grep -i 'content-security-policy\|frame-ancestors\|x-frame' | head -5

echo ""
echo "=== INDEXNOW (Yandex) ==="
KEY_LOC="$SITE/$KEY.txt"
for url in "${NEW_URLS[@]}"; do
  resp=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 10 "https://yandex.com/indexnow?url=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$url'))")&key=$KEY")
  echo "  $url → $resp"
done

echo ""
echo "=== WEBSUB PINGS ==="
for hub in "https://pubsubhubbub.appspot.com/" "https://websub.superfeedr.com/"; do
  resp=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 10 -X POST "$hub" -d "hub.mode=publish&hub.url=$SITE/feed.xml")
  echo "  $hub → $resp"
done

echo ""
echo "=== DONE ==="
