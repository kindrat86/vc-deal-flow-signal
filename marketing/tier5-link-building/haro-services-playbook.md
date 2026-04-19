# HARO / Journalist Query Services — Playbook

**Last verified:** 2026-04-19. **Execution window:** Post-warmup (~May 2026) since most pitches are sent from signal@gitdealflow.com.

## Canonical founder bio (reuse across all services)

**Short (60 words):**
> Founder of GitDealFlow — an alternative-data signal product that ranks early-stage startups by GitHub stars-per-day, hiring velocity, and PyPI/npm pull-through instead of LinkedIn scraping. Previously built data infrastructure at [fill]. GitDealFlow ships a signal report, a Chrome extension that overlays scores on Crunchbase/AngelList/PitchBook, and an MCP server used by VCs running Claude workflows.

**One-liner (for Qwoted/Featured headline field):**
> Alternative-data founder covering VC deal flow, GitHub signal scoring, and MCP-server product strategy.

**Expertise tags (tick these when asked):**
- Venture Capital / deal flow
- Alternative data / data analytics
- Startup scouting
- GitHub / open-source metrics
- MCP / AI tooling
- Product analytics
- Data engineering
- B2B SaaS go-to-market

## Service-by-service breakdown

### 1. Help a B2B Writer  ⭐ PRIORITY 1
- **URL:** https://helpab2bwriter.com/
- **Cost:** Free for sources (acquired by Superpath Dec 2022)
- **Signup:** https://helpab2bwriter.com/how-to-submit → source registration → tick expertise tags
- **Cadence:** Daily email with queries filtered by your tags
- **Fit:** HIGHEST — writers are B2B SaaS / martech / dev-tools specialists; direct ICP overlap
- **Pitch length:** 80-150 words
- **Relevant tags to tick:** SaaS, Marketing Analytics, Product, Data, Developer Tools, Startups

### 2. Qwoted  ⭐ PRIORITY 2
- **URL:** https://www.qwoted.com/
- **Signup:** https://app.qwoted.com/users/sign_in → sign up → approval (usually <24h)
- **Cost:** Free = 5 pitches/month + 2-hour delay; Pro $149/mo = real-time + unlimited
- **Cadence:** Daily digest + real-time alerts (live feed after 2h delay on free)
- **Fit:** HIGH — journalists from Forbes/TechCrunch/Bloomberg actively post VC and alt-data queries
- **Strategy:** Use all 5 free pitches on highest-DA queries only (skip low-tier blogs)
- **Relevant filters:** Venture Capital, Fintech, AI, SaaS, Data

### 3. Featured.com (ex-Terkel)  ⭐ PRIORITY 3
- **URL:** https://featured.com/
- **Signup:** featured.com/experts → create profile → build out expertise
- **Cost:** Free tier + PAYG credits (1 credit = 1 submission); paid plans for unlimited
- **Cadence:** Curated Q&A article model — your quote gets assembled into a roundup piece
- **Fit:** MEDIUM-HIGH — great for brand mentions in roundup articles; lower per-placement control
- **Note:** Featured acquired HARO April 2025 → also watch helpareporter.com post-revival

### 4. Source of Sources (SOS)  ⭐ PRIORITY 4
- **URL:** https://www.sourceofsources.com/
- **Signup:** sourceofsources.com → subscribe to expert list (free, no account needed)
- **Cost:** Free (honor-system platform by Peter Shankman, original HARO founder)
- **Cadence:** 3x daily email with journalist queries
- **Fit:** MEDIUM-HIGH — Shankman still commands trust; outlets skew mid-to-high DA
- **Strategy:** Filter heavily — only respond to queries where VC/alt-data/MCP expertise is a 1:1 match

### 5. SourceBottle
- **URL:** https://www.sourcebottle.com/
- **Signup:** sourcebottle.com → Create Expert Profile (free)
- **Cost:** Free profile; optional paid pitch-amplification
- **Cadence:** Email alerts by category
- **Fit:** MEDIUM — strong AU/UK tilt, more lifestyle-skewed; finance category exists
- **Strategy:** Low-effort "fire and forget" profile — let inbound queries route; skip outbound pitching

### 6. HARO (revived under Featured ownership)
- **URL:** https://www.helpareporter.com/
- **Status:** Relaunched April 2025 post-Featured acquisition; stabilizing
- **Cost:** Free (expected — was free under Cision)
- **Fit:** TBD — revisit Q3 2026 once query volume/DA baseline stabilizes

---

## Pre-written pitch templates

### Template A: "VC tool recommendation" query
*(Use when journalist asks "what tools do VCs use" / "best alternative data platforms")*

> I run GitDealFlow, a signal product that ranks early-stage startups on GitHub stars-per-day, hiring velocity, and PyPI/npm adoption — so VCs can spot breakout projects 6-12 months before they hit Crunchbase trending.
>
> The main gap we hear from analysts is that LinkedIn-scraping alt-data (Harmonic, Forager) surfaces growth AFTER the team scaled. GitHub momentum surfaces it DURING the build phase. One GP told us they caught three Series-A-track companies using our Chrome extension overlay on AngelList.
>
> We also publish a free weekly signal report at gitdealflow.com/signals and ship an MCP server (@gitdealflow/mcp-signal on npm) so VCs running Claude can query the data directly in their chat.
>
> Happy to expand on any of those angles. Bio: [canonical short bio].

### Template B: "Alternative data trends" query
*(Use when query is about alt-data industry / hedge fund adoption)*

> Founder of GitDealFlow here. We sit in the VC-focused slice of the alt-data market — adjacent to ExtractAlpha/M Science on the hedge-fund side, but scoped to private-company signals.
>
> One trend worth highlighting: 2024's shift from "scrape more LinkedIn" to "mine open-source artifacts." GitHub stars, commit velocity, contributor graph density, and package-registry installs are all free-to-crawl, legally clean (public repos), and leading indicators — job postings lag hiring by 4-8 weeks.
>
> Our weekly signal report runs ~250 ranked startups; top decile tends to close a funding round within 90 days. Happy to share anonymized conversion data if useful.

### Template C: "MCP / AI agent tooling" query
*(Use when query is about MCP servers, AI agents, Claude tooling)*

> We ship one of the finance-category MCP servers — @gitdealflow/mcp-signal (v1.2.0 on npm + listed on MCP Registry and Glama). It exposes 5 tools: get_trending_startups, get_signals_summary, get_startup_signal, search_startups_by_sector, get_methodology.
>
> What's interesting from a product angle: MCP lowered the bar for data products dramatically. Building a dashboard takes weeks and users ignore it. Shipping the same data as an MCP tool took us three days, and VCs query it naturally in Claude because it's already where they're drafting memos.
>
> Live demo (72s): [screencast link]. Happy to discuss the "MCP as UI" pattern in more depth.

### Template D: "Startup scouting / deal flow" query
*(Use when query is about how VCs find companies / scouting methodologies)*

> GitDealFlow founder here. We built this because the best scouts I know were manually watching GitHub trending and star-count deltas — a workflow that doesn't scale past a few dozen companies.
>
> We automated it: ingest ~40k public repos matched to known early-stage companies, compute a daily score combining stars-per-day, hiring-adds-per-month, and npm/PyPI install growth, and publish a ranked list. A free Chrome extension overlays the score on Crunchbase/AngelList so analysts don't change tabs.
>
> The most-requested use case from VCs has been "alert me when a company's score crosses a threshold" — we ship that as a simple email alert or via our MCP server for Claude users.

---

## Query-response workflow (once live)

1. Scan daily digest email (AM slot, 15 min)
2. Flag queries where GitDealFlow is a 1:1 expertise match (usually 1-3/day across all services)
3. Customize the relevant template (A/B/C/D) with query-specific angle — never send raw template
4. Always include: one proprietary data point, one quote-ready sentence, short bio, link to gitdealflow.com
5. Log placement in tier5-log.md when published (URL, DA, anchor text)

## Red flags — decline these queries

- Pay-to-play requests ("$X for placement") — never
- Queries from link farms / content mills — check publication in Ahrefs/SEMrush first
- Generic "100 founders on [topic]" roundup from unknown domains — skip unless DA 50+
- Queries asking for exclusivity — not worth locking out other placements
