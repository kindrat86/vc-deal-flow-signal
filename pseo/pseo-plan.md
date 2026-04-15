# pSEO Plan: vc-deal-flow-signal
## Date: 2026-04-13

## Stack Decisions

| Layer | Tool | Cost |
|---|---|---|
| Scraping | Firecrawl (MCP connected) | Free tier |
| Content generation | Claude | Included |
| Framework | Next.js on Vercel | Free (hobby) |
| SEO indexation | Google Search Console | Free |
| Page analytics | PostHog (already embedded) | Free |
| AEO monitoring | HubSpot AEO Grader | Free |

## Keyword Patterns

| # | Pattern | Example | Volume | Competition |
|---|---|---|---|---|
| 1 | [Sector] startups to watch [period] | "AI startups to watch Q2 2026" | High | Low (long-tail) |
| 2 | GitHub activity signals [sector] | "GitHub activity signals fintech" | Medium | Very low |
| 3 | Best deal flow tools for [investor type] | "Best deal flow tools for angel investors" | Medium | Medium |

## Page Template Structure

```
URL: /startups-to-watch/[sector]-[period]

H1: [Sector] Startups to Watch, [Period]
Intro: 2-3 sentences (Claude-generated, Data Nerd voice)
Table: Top 10 startups ranked by GitHub acceleration
  - Company name, one-line description
  - Commit velocity trend (14d)
  - Contributor growth
  - Signal type (hiring burst, infra buildout, framework migration)
Schema: FAQ + Article structured data
CTA: "See the full ranked list. Join the Signal Digest (free) or unlock the Dashboard."
Internal links: related sectors, previous periods
```

## Scaling Plan

| Phase | Pages | Timeline | What |
|---|---|---|---|
| MVP | 20 | Week 1 | Top 20 sectors x current quarter |
| Scale | 100 | Week 2-3 | 20 sectors x 5 time periods |
| Full | 500+ | Month 2 | Sectors x periods x geographies |

## Data Pipeline

1. Firecrawl: scrape startup lists from Crunchbase, AngelList, YC alumni
2. GitHub API: pull activity data (commits, contributors, repos) for each org
3. Claude: generate sector intros + analysis paragraphs
4. Next.js: SSG pages from data at build time
5. Vercel Cron: rebuild weekly with fresh GitHub data

## Distribution Strategies (Priority Order)

1. **pSEO** (primary, long-term compounder): 500+ pages targeting investor search queries
2. **Content Repurposing** (immediate, weekly): Data Nerd voice on Twitter/X, LinkedIn. One analysis post becomes 10+ pieces.
3. **AEO** (passive, builds over time): Structured FAQ content so AI assistants cite us when investors ask deal flow questions
