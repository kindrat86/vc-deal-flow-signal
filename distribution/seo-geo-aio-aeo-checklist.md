# SEO / GEO / AIO / AEO Registration Checklist

Status key: [ ] todo, [x] done (automated), [~] done (manual)

---

## Automated (deployed with this commit)

- [x] **robots.txt** — AI crawler allow rules for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Amazonbot, Applebot-Extended
- [x] **llms.txt** — Structured markdown at /llms.txt for AI crawlers
- [x] **JSON-LD: SoftwareApplication** — applicationCategory, featureList, offers with availability
- [x] **JSON-LD: SpeakableSpecification** — Marks hero content for voice assistants
- [x] **JSON-LD: FAQPage expanded** — 6 Q&As (was 3) covering "what is", "how does", "sectors", "pricing"
- [x] **IndexNow key** — `22dfd6f8f816469b8c216bc7eaf8b936` deployed at root
- [x] **Sitemap updated** — llms.txt added to sitemap-pages.xml

---

## Manual — High Priority (do this week)

### 1. IndexNow: Ping to index all pages instantly
After deploying, run this curl to submit all URLs at once:
```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "gitdealflow.com",
    "key": "22dfd6f8f816469b8c216bc7eaf8b936",
    "keyLocation": "https://gitdealflow.com/22dfd6f8f816469b8c216bc7eaf8b936.txt",
    "urlList": [
      "https://gitdealflow.com/",
      "https://gitdealflow.com/insider",
      "https://gitdealflow.com/llms.txt",
      "https://gitdealflow.com/privacy",
      "https://gitdealflow.com/terms"
    ]
  }'
```
This pings Bing, Yandex, Perplexity, Seznam, Naver, and Yep simultaneously.

### 2. Wikidata Entity  ✅ DONE (2026-04-16)
- [x] Entity live at https://www.wikidata.org/wiki/Q139376302
- [x] All claims referenced, P154 logo on Commons, P1813 short name set
- [x] Added to sameAs in landing + pSEO JSON-LD
- Pending: Wikipedia article (draft in distribution/wikipedia-article-draft.md) + GitDealFlow organisation entity

### 3. Crunchbase Profile  ✅ DONE (2026-04-16)
- [x] Company profile created at https://www.crunchbase.com/organization/gitdealflow
- [x] Filled: website, description, founding date, category (Financial Services > Alternative Data)
- [x] Added URL to sameAs in landing + pSEO JSON-LD

### 4. Yandex Webmaster  ✅ DONE (2026-04-18)
Both properties verified via meta-tag method (`f3f5891cbff0b50f`). All high-leverage features configured.
- [x] Deploy `yandex-verification` meta tag to gitdealflow.com — [landing/index.html:8](../landing/index.html:8)
- [x] Deploy `yandex-verification` meta tag to signals.gitdealflow.com — via `verification.yandex` in [pseo-site/app/layout.tsx:39](../pseo-site/app/layout.tsx:39)
- [x] Verify gitdealflow.com as Owner
- [x] Verify signals.gitdealflow.com as Owner
- [x] Submit sitemap: https://gitdealflow.com/sitemap.xml
- [x] Submit signals subdomain sitemap: https://signals.gitdealflow.com/sitemap.xml
- [x] Submit RSS feed as additional sitemap: https://signals.gitdealflow.com/feed.xml
- [x] Reindex: 4 landing URLs + 15 signals URLs submitted for priority crawl (daily limit 150)
- [x] URL tracker: 2 landing + 10 signals URLs monitored (100-URL limit, alerts on indexing changes)
- [x] Validated structured data via Microtest — Organization + WebSite + Twitter + OG schemas all parse cleanly
- [x] Validated robots.txt — 0 errors on both domains
- [x] Regional targeting: correctly left **unset** (site is global English-language per Yandex's own guidance)
- [x] 2-week recheck completed 2026-05-02 — findings below:
  - **gitdealflow.com**: Still 2 recommendations (sitemap not used by bot + favicon stale) — same as Apr 18, none new, none cleared. Sitemap still in "Processing queue". Crawl stats "Data will appear soon". URL tracker: both `/` + `/insider` not yet accessed by bot.
  - **signals.gitdealflow.com**: ✅ **"No errors or recommendations"** — clean bill of health. Sitemaps still in processing queue. All 10 tracked URLs not yet crawled.
  - **Reindex**: 18/19 "Request processed"; 1/19 (/compare on signals) still "In queue".
  - **Verdict**: Normal for a brand-new zero-backlink site — Yandex crawls by authority/inbound links; setup is correct, just waiting for first crawl.
- [ ] Next check ~2026-06-01: confirm sitemaps moved from queue → processed; check if any URLs graduated to "indexed"
- [ ] Favicon warning on gitdealflow.com — still stale (favicon returns 200) — will auto-clear on first actual Yandex crawl; no action needed

### 5. Perplexity Publishers Program  ✅ APPLICATION FORM SUBMITTED (2026-04-18)
- [x] First attempt: sent via Resend, ID `08e580d4-9d51-44c8-9b83-1200b7cdc2da` → **bounced**
- [x] Resent from Zoho webmail as `signal@gitdealflow.com` — Perplexity replied with intake form
- [x] Filled Google Form (`1FAIpQLScnNwm5iWLHraI_R--ixnlG66ZhO4Y9cMf9e4voOtnzrY1t5A`) — GitDealFlow / The Data Nerd / Founder / signal@gitdealflow.com / Global (English) / full pitch in additional info
- [ ] Await "next steps" email from Perplexity team — follow up ~2026-05-09 if no reply

### 6. LinkedIn Company Page  ✅ DONE
- [x] Page live at https://www.linkedin.com/company/gitdealflow
- [x] Added URL to sameAs in landing + pSEO JSON-LD
- [x] Links added sitewide

### 7. GitHub org (MCP server repo)  ✅ DONE
- [x] https://github.com/kindrat86/mcp-deal-flow-signal is the canonical MCP repo
- [x] Referenced from llms.txt + pSEO footer + Chrome extension

---

## Manual — Medium Priority (this month)

### B2B SaaS Review Directories (free listings)
- [x] **G2** ✅ approved 2026-04-16 — profile live (free tier, pending category assignment)
- [ ] **Capterra** — https://www.capterra.com/ (Gartner-owned, also populates GetApp + Software Advice)
- [ ] **TrustRadius** — https://www.trustradius.com/
- [ ] **SaaSworthy** — https://www.saasworthy.com/
- [ ] **SoftwareSuggest** — https://www.softwaresuggest.com/

### Alternatives Sites (dofollow backlinks, competitor positioning)
- [~] **AlternativeTo** ⏳ account created 2026-04-16 — 7-day wait ends Apr 22, submission scheduled Apr 24 via `alternativeto-submit-reminder` task
- [x] **SaaSHub** ✅ approved 2026-04-16 — profile live (pending verify badge + premium listing)
- [x] **StackShare** ✅ submitted 2026-04-19 — passive brand listing live

### Startup / Product Directories
- [x] **SideProjectors** ⏳ submitted 2026-04-18 (mod queue ~Apr 21-23) — SKIP paid fast-approval
- [x] **StartupRanking** ✅ claimed + ownership-verified 2026-04-19 (free approval queue is 80+ days)
- [x] **Indie Hackers Products** ✅ listed 2026-04-18 (nofollow — brand/referral value only)
- [~] **10words** ⏳ submitted 2026-04-19 (~5yr queue — passive brand listing only)
- [ ] **BetaList** — https://betalist.com/
- [ ] **Uneed** — https://www.uneed.best/ (dofollow backlinks)
- [ ] **Microlaunch** — https://microlaunch.net/
- [ ] **Launching Next** — https://www.launchingnext.com/
- [ ] **Startup Stash** — https://startupstash.com/
- [ ] **BetaPage** — https://betapage.co/
- [ ] **OpenHunts** — https://openhunts.com/
- [ ] **Peerlist Launchpad** — https://peerlist.io/

### VC-Adjacent Directories
- [~] **Wellfound** (ex-AngelList) — submission guide ready at marketing/directory-wellfound.md; not yet submitted
- [x] **VentureRadar** ⏳ submitted 2026-04-19 via free tier (~21-day review)
- [x] **OpenVC** ✅ signed up 2026-04-19 (outbound channel for fundraising; not passive directory)
- [x] **Crunchbase** ✅ live (see §3)
- [x] **Dealroom for Builders** ⏳ applied 2026-04-19 (5-biz-day review; follow-up May 1 via `dealroom-followup-may1` task)
- [ ] **F6S** — https://www.f6s.com/ (dofollow backlinks)

### AI Tool Directories
- [x] **FutureTools** ✅ submitted 2026-04-19 — live
- [x] **AItoolslist.io** ✅ submitted 2026-04-19 — live
- [ ] **Futurepedia** — https://www.futurepedia.io/submit-tool
- ~~**There's An AI For That**~~ — SKIP (paid only $49 min, product-fit risk)
- [ ] **ListMyAI** — https://listmyai.net/
- [ ] **ToolFinder** — https://toolfinder.co/
- See marketing/ai-directory-submissions.md for full log (2/13 live + blockers)

---

## Manual — Lower Priority (next month)

### Answer Engine Presence (AEO) — Tier 3 drafts ready in [tier-3-aeo-geo/](./tier-3-aeo-geo/00-README.md)
- [x] **Dev.to** ✅ MCP article published ([dev.to/data_nerd/...-c5h](https://dev.to/data_nerd/i-stopped-building-dashboards-ai-assistants-are-the-new-ui-c5h))
- [x] **Hashnode** ✅ cross-posted with canonical to dev.to
- [x] **Medium** ✅ account live as @signal_41476; Post 1 published + 2 more queued
- [x] **HackerNoon** ⏳ first story in editorial queue (submitted 2026-04-19, check Apr 22)
- [~] **Quora** ⏳ Q1+Q2 posted 2026-04-19; Q3-Q15 running daily via `quora-daily-runner` task (target: all 15 by Apr 28)
- [~] **Substack Notes** ⏳ Notes 1-3 posted 2026-04-19; Notes 4-15 running daily via `substack-notes-daily-runner` task
- [ ] **HackerNoon** — 1,600-word submission article ready → [tier-3-aeo-geo/06-hackernoon-article.md](./tier-3-aeo-geo/06-hackernoon-article.md)
- [ ] **Substack Notes** — 15 notes + 3 linked variants, 7-day schedule → [tier-3-aeo-geo/07-substack-notes.md](./tier-3-aeo-geo/07-substack-notes.md)
- [ ] **Stack Exchange** (Quant Finance, Open Data, Data Science) — 5 draft answers → [tier-3-aeo-geo/04-stackexchange-answers.md](./tier-3-aeo-geo/04-stackexchange-answers.md)
- [ ] **Wikipedia** (Deal flow + Alternative data articles) — COI playbook + edit drafts → [tier-3-aeo-geo/01-wikipedia-references.md](./tier-3-aeo-geo/01-wikipedia-references.md)
- [ ] **Reddit wikis** (r/venturecapital, r/startups) — modmail + fallback posts → [tier-3-aeo-geo/03-reddit-wiki-contributions.md](./tier-3-aeo-geo/03-reddit-wiki-contributions.md)
- [ ] **LinkedIn Articles** — Publish via company page (future)

### General Directories
- [ ] **Curlie** — https://curlie.org/ (DMOZ successor)

### Monitoring
- [ ] **Otterly.AI** — https://otterly.ai/ (track AI citation performance — you may already have this)

---

## After sameAs URLs are collected

Once you have Wikidata, Crunchbase, LinkedIn, and optionally GitHub URLs, update the Organization sameAs in index.html:
```json
"sameAs": [
  "https://t.me/gitdealflow",
  "https://www.wikidata.org/wiki/Q_______",
  "https://www.crunchbase.com/organization/vc-deal-flow-signal",
  "https://www.linkedin.com/company/______",
  "https://github.com/______"
]
```
