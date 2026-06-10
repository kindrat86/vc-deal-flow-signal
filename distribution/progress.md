# Distribution Progress — 2026-04-15

## Completed Today

### SEO/pSEO/GEO (all live at signals.gitdealflow.com)
- [x] 20 sectors filled with GitHub data (was 12)
- [x] 65 sector-period pages
- [x] 10+ geography pages (US, UK, Europe, APAC, Canada)
- [x] /trending page — cross-sector top 20 leaderboard
- [x] /methodology page — full data source + metrics explanation
- [x] /glossary page — 12 defined terms with DefinedTermSet schema
- [x] /blog — 5 posts total:
  - "How to Read GitHub Signals for Startup Investing" (evergreen)
  - "What Is Deal Flow Signal?" (definition, GEO bait)
  - "How VCs Use GitHub for Technical Due Diligence" (mid-funnel)
  - "5 GitHub Patterns That Predict Fundraises" (high-intent)
  - Weekly Signal Report (auto-generated from data)
- [x] /compare — 3 comparison pages:
  - "Best Deal Flow Tools for Angel Investors"
  - "GitHub Signals vs Crunchbase Alerts"
  - "Best Deal Flow Tools for Seed-Stage Investors"
- [x] Dynamic OG images per sector page
- [x] RSS feed at /feed.xml
- [x] Custom 404 page with sector links
- [x] ItemList schema on sector pages
- [x] Key Takeaway blocks on every sector page (GEO)
- [x] FAQ schema on every sector page
- [x] Article + BreadcrumbList schema everywhere

### Landing Page (gitdealflow.com)
- [x] JSON-LD structured data (Organization, Product, FAQPage)
- [x] OG tags + Twitter cards
- [x] Canonical URL
- [x] sitemap.xml + robots.txt
- [x] "Browse Sector Signals" cross-link section (12 sectors)
- [x] Social proof strip (2000+ orgs, 20 sectors, weekly updates)

### Automated Pipeline
- [x] Weekly cron: fetch-github-data.ts (20 sectors)
- [x] Auto-generated weekly signal report blog post
- [x] Auto-IndexNow submission on every Vercel deploy (postbuild)
- [x] IndexNow key file deployed on both domains
- [x] Prebuild skips data fetch on Vercel (uses uploaded data)

### Indexing
- [x] Google Search Console — gitdealflow.com sitemap submitted
- [x] Google Search Console — signals.gitdealflow.com sitemap submitted (82+ pages discovered, Status: Success)
- [x] IndexNow — 86 URLs submitted (HTTP 200), covers Bing/Yandex/Seznam/Naver
- [x] Auto-IndexNow fires on every production deploy

### Lighthouse Scores
- SEO: 100/100
- Best Practices: 96/100
- Accessibility: 95/100
- Performance: 81/100

## Social Distribution — Status

### Twitter @data_nerd
- [x] Account created
- [x] Profile pic + banner set
- [x] Launch thread posted (7 tweets)
- [ ] Pin the launch thread
- [ ] Post founder comment style intro tweet
- [ ] Follow 20-30 VC/startup accounts (started)
- [ ] Daily data-driven tweets (not yet generated)

### Hacker News
- [x] Show HN posted: https://news.ycombinator.com/item?id=47775439
- [x] ~~Founder comment~~ DROPPED 2026-06-10 — the April thread is dead; commenting now does nothing.
- [ ] NEW Show HN (different angle: the open dataset / MCP server), 2+ weeks after deploys are automated. HN allows re-submissions with a new angle.

### LinkedIn
- [x] Decision unblocked 2026-06-10 — see distribution/linkedin-decision-brief.md.
  Recommendation: no personal LinkedIn (anonymity policy); company page only after first paying customer.

### Reddit
- [x] Drafts ready 2026-06-10: distribution/reddit-community-posts.md (r/SaaS → r/startups → r/venturecapital order)
- [ ] Post them (1 sub per day, not in the same week as MCP posts)

### Product Hunt
- [ ] Save for 2-3 weeks when more traction
- [ ] Prep PH listing (tagline, description, screenshots)

## Files Reference

| File | Purpose |
|---|---|
| distribution/twitter-thread.md | Launch thread (posted) |
| distribution/hackernews-post.md | HN post + prepped comment replies |
| distribution/linkedin-post.md | LinkedIn launch post (ready to post) |
| distribution/profile-pic.svg | Profile pic (SVG source) |
| distribution/profile-pic.png | Profile pic (PNG, 800px) |
| distribution/progress.md | This file |

## Next Actions (refreshed 2026-06-10)
1. Restore site freshness: Vercel login on the Mac mini → redeploy → automate deploys via GitHub Actions (data is fresh in git, prod is stuck at Jun 2)
2. Post the week's tweets: distribution/daily-tweets-2026-06-w2.md (one/day, generated from Jun 9 data)
3. Post Reddit drafts: distribution/reddit-community-posts.md (r/SaaS day 1 → r/startups day 3 → r/venturecapital day 5)
4. Pin Twitter launch thread (still unpinned)
5. Engage with VC accounts on Twitter daily (Dream-100 radar already surfaces mentions 4×/day — act on them)
6. New Show HN (dataset/MCP angle) after deploys automated
7. Product Hunt prep — only after a week of nonzero traffic
