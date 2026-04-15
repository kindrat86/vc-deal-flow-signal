#!/bin/bash
# Wrapper script for email cron — reads API_SECRET from .env instead of hardcoding in plist
PROJECT_DIR="/Users/sipi/launch-projects/vc-deal-flow-signal"
ENV_FILE="$PROJECT_DIR/email-api/.env"

API_SECRET=$(grep '^API_SECRET=' "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'")

if [ -z "$API_SECRET" ]; then
  echo "$(date '+%Y-%m-%d %H:%M') | ERROR: API_SECRET not found in $ENV_FILE"
  exit 1
fi

curl -s -X POST \
  -H "Authorization: Bearer $API_SECRET" \
  http://127.0.0.1:3001/cron/send-emails
