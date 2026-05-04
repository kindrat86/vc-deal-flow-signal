# Launch Plan: VC Deal Flow Signal
## Date: 2026-04-15 | Framework: Greg Isenberg (distribution-first launch) + Russell Brunson value ladder

## Embedded distribution layers (Isenberg Strategy #1: piggyback on existing platforms)

Two free entry rungs on the Brunson value ladder. Mention BOTH in every launch asset alongside the core site, not as afterthoughts. Each attracts a distinct persona:

1. **Chrome extension** — injects a green "Accelerating" badge on Crunchbase, AngelList, and PitchBook startup profiles. Install: https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn. Audience: traditional VCs doing deal research in the browser.
2. **Claude MCP server** — serves signals inside Claude Desktop, Claude Code, Cursor, and any MCP-compatible AI assistant. Install: `npx @gitdealflow/mcp-signal`. Audience: dev-investors and AI-native workflows.

Both are free, both drive signups to the weekly digest, which feeds the EUR 9.97/mo dashboard and EUR 97/mo Insider Circle conversions.

## Launch Strategy: Consolidated single-day launch (Sunday April 26)

Original plan was staggered 3-wave over 7 days. Reality: PH slot is locked for Apr 26 (can't be moved without losing the reserved slot and re-submitting), and fragmenting IH + HN + Reddit across the preceding week diluted momentum in seeding data. New plan: **all three waves fire on Sunday April 26**, separated by hours (not days), so cross-channel traffic compounds in the same 24-hour window.

---

## Pre-launch checklist (do before Wave 1)

- [ ] Twitter/X account live with 5-10 Data Nerd posts already up (establishes credibility)
- [ ] Landing page social proof strip live (done: 2026-04-15)
- [ ] At least 1 real signal digest email sent to existing subscribers (proof the product works)
- [ ] Prepare 3 "signal examples" as standalone images/screenshots (commit velocity chart, sector ranking table, sample startup card)
- [ ] Write a 2-paragraph founder story for bios (Data Nerd origin story, keep it authentic)
- [ ] Open Graph image for landing page (for link previews on social)
- [ ] Have 5-10 people ready to upvote/comment on launch day (friends, early subscribers)

---

## Wave 1: Indie Hackers + Reddit (Sunday April 26, 10:01 EEST — consolidated launch day)

### Why first
Lower stakes, forgiving audience, good for refining messaging before Product Hunt.

### Indie Hackers
- **Post type:** "Build in public" milestone post
- **Title:** "I built a tool that reads GitHub to find breakout startups before VCs do"
- **Body structure:**
  1. The problem (VCs see the same deals)
  2. The insight (GitHub activity predicts fundraises)
  3. What I built (briefly: pSEO data pipeline + landing page + email drip, mention the tech stack)
  4. Early numbers (sectors tracked, startups analyzed, subscriber count if any)
  5. What's next (dashboard beta)
  6. Ask: "Would you use this? What sectors would you want to track?"
- **Link:** gitdealflow.com

### Reddit
- **r/startups** — "I'm building a deal flow tool for VCs using GitHub data. Here's what I've learned."
- **r/venturecapital** — "Interesting pattern: startups that show a 2x commit velocity spike tend to raise within 6 weeks. Has anyone else noticed this?"
- **r/SideProject** — Cross-post the build story

### Key rule
Don't pitch. Share the insight, share the data, let people come to the product. Reddit kills overt self-promotion.

---

## Wave 2: Hacker News "Show HN" (Sunday April 26, 15:00 EEST / 8am ET — same launch day, US-morning slot)

### Why HN
Technical audience that angel invests. HN respects novel data approaches. The GitHub angle is native to this audience.

### Post
- **Title:** "Show HN: VC Deal Flow Signal, GitHub engineering momentum as a leading indicator for investors"
- **URL:** gitdealflow.com (or signals.gitdealflow.com for the data-rich pSEO site)
- **First comment (by you, immediately after posting):**
  "Hey HN. I noticed that startups showing commit velocity spikes on GitHub tend to announce raises or product launches 3 to 6 weeks later. So I built a system that monitors thousands of GitHub orgs and ranks them by engineering acceleration for investors.

  The data pipeline scrapes GitHub activity weekly, enriches with funding stage and team size, and publishes sector-by-sector rankings.

  Free weekly digest or a EUR 9.97/mo dashboard beta. Would love feedback on the methodology. Is commit velocity a real signal, or am I overfitting?"

### HN best practices
- Post between 8am and 10am ET (highest traffic)
- Don't ask for upvotes
- Respond to every comment, especially critics
- The self-deprecating "am I overfitting?" angle plays well on HN

---

## Wave 3: Product Hunt (Sunday April 26, 10:01 EEST / 12:01 AM PT — auto-publishes via `ph-launch-day-apr26` scheduled task)

### Why last
Product Hunt gives you one shot at a clean launch. Use learnings from Wave 1 and 2 to refine the pitch.

### Prep (do 3 days before)
- [ ] Create a Product Hunt maker profile
- [ ] Prepare 5 images: hero screenshot, sector ranking table, sample signal card, pricing comparison, Data Nerd character intro
- [ ] Write tagline (under 60 chars): "Spot breakout startups 3 weeks early via GitHub"
- [ ] Write description (under 260 chars): "We monitor GitHub engineering activity across thousands of startup orgs and surface the ones showing unusual acceleration. Free weekly digest or a EUR 9.97/mo dashboard. Built for seed/Series A investors."
- [ ] Prepare a "first comment" as maker (your story, what you learned from HN and IH)
- [ ] Line up 5-10 supporters to comment and upvote in the first hour
- [ ] DM Ryan Hoover (@rrhoover) with a heads-up if you've built any engagement with him

### Launch day
- Post at 12:01 AM PT (Product Hunt resets daily)
- Share the PH link on Twitter, LinkedIn, Indie Hackers immediately
- Respond to every comment within 30 min
- Post a Twitter thread: "Today I launched [product] on Product Hunt. Here's the backstory..."
- Send an email to your subscriber list: "We're live on Product Hunt, here's the link"

---

## Wave 2.5: MCP Distribution Blitz (Day 5-10, concurrent with Wave 2+3)

### Why a dedicated MCP wave
The MCP server is the product for developer-investors. It needs its own distribution push, not just a mention in the main launch.

### Actions (see `distribution/mcp-distribution-strategy.md` for full details)

- [ ] Post Twitter thread sharing dev.to article (`distribution/twitter-devto-article-thread.md`)
- [~] ~~Cross-post to Hashnode~~ — Hashnode RETIRED 2026-05-02. Substack mirror at https://gitdealflow.substack.com replaces it.
- [ ] Discord blitz: 5 servers in 5 days (`distribution/discord-mcp-posts.md`)
- [ ] Record 30-second demo GIF of MCP server in Claude
- [ ] Add demo GIF to: GitHub README, dev.to article, Twitter, Discord posts
- [ ] Follow up on awesome-mcp-servers PR #4933
- [ ] Check all directory listing statuses (Glama, mcp.so, MCP Market, Cline, PulseMCP)
- [ ] Post MCP query screenshot on Twitter (standalone tweet, not part of thread)

### Ongoing MCP noise (post-launch)
- Weekly: 1 MCP screenshot tweet + 1 MCP ecosystem reply
- Bi-weekly: Discord engagement in MCP communities
- Monthly: New dev.to article with MCP angle
- See `marketing/content-repurposing-pipeline.md` (Thursday MCP slot)

---

## Post-launch (Day 8 to 14)

- Write a "launch retrospective" on Indie Hackers with real numbers (traffic, signups, conversion)
- Post the retrospective on Twitter as a thread
- Pitch the launch story to 2 newsletters from Dream 100 list: "We launched on PH and got X upvotes, here's what we learned about using GitHub data for deal flow"
- Start weekly cadence from Dream 100 (see dream-100.md)

---

## Timing recommendation

| Wave | Platform | Best day | Why |
|------|----------|----------|-----|
| 1 | Indie Hackers + Reddit | Sunday April 26, 10:01 EEST | Consolidated launch — same slot as PH going live |
| 2 | Show HN | Sunday April 26, 15:00 EEST (8am ET) | US-morning HN peak traffic, same day as rest |
| 3 | Product Hunt | Sunday April 26, 10:01 EEST (12:01 AM PT) | PH listing locked; auto-publishes via `ph-launch-day-apr26` scheduled task |

**Timeline:** Unified launch Sunday April 26 at 10:01 EEST (`ph-launch-day-apr26` auto-publishes PH + posts to IH, Reddit, Telegram, LinkedIn, Twitter). HN delayed to 15:00 EEST same day for US-morning peak traffic. Pre-launch Twitter/IH/Reddit seeding continues through Apr 25; supporter email fires Apr 25 18:00 EEST via `ph-supporter-email-apr25` task.
