#!/bin/bash
KEY="22f462164f53aacbb1d0b771d018bcf1"
HOST="gitdealflow.com"
URLS=$(curl -s https://gitdealflow.com/sitemap-pages.xml | grep -oE '<loc>[^<]+' | sed 's/<loc>//' | head -100 | sed 's/^/"/;s/$/",/' | tr -d '\n' | sed 's/,$//')
curl -s -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" \
  -d "{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":[$URLS]}"
