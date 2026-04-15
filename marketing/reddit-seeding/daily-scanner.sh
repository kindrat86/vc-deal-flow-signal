#!/bin/bash
# Reddit Daily Scanner for The Data Nerd seeding campaign
# Fetches fresh posts from target subreddits via Reddit JSON API
# Run daily at 09:00 EEST

OUTDIR="$HOME/launch-projects/vc-deal-flow-signal/marketing/reddit-seeding"
DATE=$(date +%Y-%m-%d)
DAY_NUM=$((( $(date +%s) - $(date -j -f "%Y-%m-%d" "2026-04-15" +%s) ) / 86400 + 1))
OUTFILE="${OUTDIR}/day-$(printf '%02d' $DAY_NUM)-${DATE}.md"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"

# Subreddits to scan
SUBS=("venturecapital" "startups" "SideProject" "dataisbeautiful" "Entrepreneur")

echo "# Reddit Seeding: Day ${DAY_NUM} (${DATE})" > "$OUTFILE"
echo "" >> "$OUTFILE"
echo "**Account to use:** 696-karma account" >> "$OUTFILE"
echo "**Rule:** ZERO product mentions in Phase 1. See strategy.md for current phase." >> "$OUTFILE"
echo "" >> "$OUTFILE"
echo "---" >> "$OUTFILE"
echo "" >> "$OUTFILE"

for SUB in "${SUBS[@]}"; do
  echo "## r/${SUB}" >> "$OUTFILE"
  echo "" >> "$OUTFILE"

  # Fetch hot posts (higher engagement potential)
  curl -s -H "User-Agent: ${UA}" "https://www.reddit.com/r/${SUB}/hot.json?limit=15" 2>/dev/null | \
  python3 -c "
import json, sys, time
try:
    data = json.load(sys.stdin)
    posts = data['data']['children']
    now = time.time()
    count = 0
    for p in posts:
        d = p['data']
        age_days = (now - d['created_utc']) / 86400
        if age_days <= 3 and d['num_comments'] >= 3 and not d.get('stickied', False):
            count += 1
            print(f'**{count}. [{d[\"score\"]} pts, {d[\"num_comments\"]} comments, {age_days:.1f}d ago]** {d[\"title\"]}')
            print(f'  - Link: https://www.reddit.com{d[\"permalink\"]}')
            print(f'  - by u/{d[\"author\"]}')
            body = d.get('selftext', '')[:200]
            if body:
                print(f'  - Preview: {body}...')
            print()
    if count == 0:
        print('No recent high-engagement posts found. Check /new instead.')
        print()
except Exception as e:
    print(f'Error fetching: {e}')
    print()
" >> "$OUTFILE" 2>&1

  echo "---" >> "$OUTFILE"
  echo "" >> "$OUTFILE"

  # Rate limit: be nice to Reddit API
  sleep 2
done

echo "" >> "$OUTFILE"
echo "## Comment Templates" >> "$OUTFILE"
echo "" >> "$OUTFILE"
echo "Use these as starting points. Customize based on the actual post content." >> "$OUTFILE"
echo "See strategy.md for voice guidelines and phase rules." >> "$OUTFILE"
echo "" >> "$OUTFILE"
echo "**NOTE:** This file contains raw post data. Ask Claude to generate custom comments for the best targets." >> "$OUTFILE"

echo "Daily scan complete: ${OUTFILE}"
