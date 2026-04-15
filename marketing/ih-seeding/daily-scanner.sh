#!/bin/bash
# IndieHackers Daily Scanner for The Data Nerd seeding campaign
# Fetches trending posts from IH to generate engagement briefs
# Run daily at 09:30 EEST (staggered 30min after Reddit scanner)

OUTDIR="$HOME/launch-projects/vc-deal-flow-signal/marketing/ih-seeding"
DATE=$(date +%Y-%m-%d)
DAY_NUM=$((( $(date +%s) - $(date -j -f "%Y-%m-%d" "2026-04-15" +%s) ) / 86400 + 1))
OUTFILE="${OUTDIR}/day-$(printf '%02d' $DAY_NUM)-${DATE}.md"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

echo "# IndieHackers Seeding: Day ${DAY_NUM} (${DATE})" > "$OUTFILE"
echo "" >> "$OUTFILE"

# Determine phase
if [ "$DAY_NUM" -le 5 ]; then
  PHASE="Phase 1: Pure Value"
  RULE="ZERO product mentions. Pure value comments only."
elif [ "$DAY_NUM" -le 10 ]; then
  PHASE="Phase 2: Soft Authority"
  RULE="Can hint at building something if asked. Consider posting a 'building in public' update."
else
  PHASE="Phase 3: Launch Ready"
  RULE="Can share product if natural. Launch post is green-lit."
fi

echo "**Phase:** ${PHASE}" >> "$OUTFILE"
echo "**Rule:** ${RULE}" >> "$OUTFILE"
echo "**Voice:** The Data Nerd. Enthusiastic, constructive, data-backed. Builder who celebrates other builders." >> "$OUTFILE"
echo "" >> "$OUTFILE"
echo "---" >> "$OUTFILE"
echo "" >> "$OUTFILE"

# Scan IH trending/popular pages
PAGES=("" "popular" "newest")
LABELS=("Trending" "Popular" "Newest")

for i in "${!PAGES[@]}"; do
  PAGE="${PAGES[$i]}"
  LABEL="${LABELS[$i]}"

  if [ -z "$PAGE" ]; then
    URL="https://www.indiehackers.com"
  else
    URL="https://www.indiehackers.com/${PAGE}"
  fi

  echo "## ${LABEL} Posts" >> "$OUTFILE"
  echo "" >> "$OUTFILE"
  echo "Source: ${URL}" >> "$OUTFILE"
  echo "" >> "$OUTFILE"

  # Fetch page, extract post URLs, then fetch og:title for each
  curl -s -L -H "User-Agent: ${UA}" "${URL}" 2>/dev/null | \
  python3 -c "
import sys, re

content = sys.stdin.read()

# Extract unique post paths from the page
paths = re.findall(r'href=\"(/post/[^\"]+)\"', content)
seen = set()
unique = []
for p in paths:
    if p not in seen:
        seen.add(p)
        unique.append(p)

if not unique:
    print('Could not parse posts. Check IH manually.')
else:
    for p in unique[:10]:
        print(p)
" > /tmp/ih_paths_${i}.txt 2>&1

  # Fetch og:title for each discovered post URL
  count=0
  while IFS= read -r path; do
    if [ -z "$path" ] || echo "$path" | grep -q "^Could not"; then
      echo "$path" >> "$OUTFILE"
      continue
    fi
    count=$((count + 1))
    TITLE=$(curl -s -L -H "User-Agent: ${UA}" "https://www.indiehackers.com${path}" 2>/dev/null | \
      python3 -c "
import sys, re, html
content = sys.stdin.read()
og = re.search(r'<meta[^>]*property=\"og:title\"[^>]*content=\"([^\"]+)\"', content)
title = re.search(r'<title>([^<]+)</title>', content)
if og: print(html.unescape(og.group(1)))
elif title: print(html.unescape(title.group(1)))
else: print('(title unavailable)')
" 2>/dev/null)
    echo "${count}. [${TITLE}](https://www.indiehackers.com${path})" >> "$OUTFILE"
    sleep 1
  done < /tmp/ih_paths_${i}.txt
  rm -f /tmp/ih_paths_${i}.txt

  echo "" >> "$OUTFILE"
  echo "---" >> "$OUTFILE"
  echo "" >> "$OUTFILE"

  sleep 2
done

# Add engagement guidance based on phase
echo "## Today's Engagement Plan" >> "$OUTFILE"
echo "" >> "$OUTFILE"

if [ "$DAY_NUM" -le 5 ]; then
  cat >> "$OUTFILE" << 'GUIDANCE'
**Target: 3-5 comments today**

Pick posts where The Data Nerd adds genuine value:
- Revenue milestones: share a data-backed observation about engineering patterns at that stage
- Launch posts: congratulate + ask a smart follow-up about their approach
- "How do I..." posts: share specific, actionable advice from the data/engineering angle
- Building in public: relate to their journey, share a parallel insight

**Comment template (customize every time):**
> [Genuine appreciation of their post/milestone]
>
> [One specific data-backed insight that adds to the conversation]
>
> [Follow-up question that shows you read the post carefully]

**Rules:**
- No product mentions
- No links to gitdealflow.com
- Upvote 10+ posts (IH is reciprocal)
- Reply to anyone who responds to your comments
GUIDANCE
elif [ "$DAY_NUM" -le 10 ]; then
  cat >> "$OUTFILE" << 'GUIDANCE'
**Target: 2-4 comments + consider 1 own post**

Continue value comments. Additionally:
- If someone asks about your project, share casually
- Consider posting a "building in public" update about tracking startup engineering data
- Engage with IH regulars who commented on your previous comments

**Own post idea for this phase:**
> "I've been tracking commit velocity across 2,000+ startup GitHub orgs. The pattern that keeps surprising me: [specific insight]. Anyone else using alternative data sources for startup analysis?"
GUIDANCE
else
  cat >> "$OUTFILE" << 'GUIDANCE'
**Target: 2-3 comments + launch post if ready**

Continue engagement. Launch post is green-lit:
- Adapt from marketing/launch-posts/indiehackers-launch.md
- Reference insights you've shared in previous comments
- Your comment history should validate you as a real builder
GUIDANCE
fi

echo "" >> "$OUTFILE"
echo "" >> "$OUTFILE"
echo "---" >> "$OUTFILE"
echo "" >> "$OUTFILE"
echo "**NOTE:** IH HTML parsing may miss some posts. If the lists above are empty, scan IH manually and ask Claude to generate comments for the best targets." >> "$OUTFILE"

echo "IH daily scan complete: ${OUTFILE}"
