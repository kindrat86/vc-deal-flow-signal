# GitDealFlow Traffic and Discovery Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase qualified investor, scout, and operator discovery of GitDealFlow through truthful search, answer-engine, referral, community, and measurable organic traffic improvements.

**Architecture:** Treat GitDealFlow as one acquisition system with two public domains. `gitdealflow.com` is the static marketing and content site. `signals.gitdealflow.com` is the Next.js research, data, pSEO, API, MCP, A2A, and answer-engine site. First repair false or stale public claims that pollute search snippets and AI retrieval. Then establish current measurement, trim index bloat, improve high-intent hubs and templates, publish only evidence-backed content, and verify production with live source checks.

**Tech Stack:** Static HTML, Python sitemap tooling, Next.js App Router, TypeScript, Vercel, PostHog EU, GA4, Google Search Console, Bing Webmaster Tools, IndexNow, RSS/WebSub, JSON-LD, MCP, A2A, OpenAPI.

**Spec:** This document is the implementation spec. It was built from a live audit on 2026-08-21 of `https://gitdealflow.com` and `https://signals.gitdealflow.com`, plus the canonical repository at `/Users/sipi/signals-gitdealflow`.

## Global Constraints

- Judge success only by qualified visitors and discovery. Do not count post-arrival conversion, pricing, or retention work as an acquisition win.
- Preserve public anonymity. Use GitDealFlow, VC Deal Flow Signal, or The Data Nerd. Do not expose a maintainer identity.
- Public claim floor: `350+ startups` or `350+ organizations`. Never publish `400+`, `411`, `369`, `4,200+`, or another raw panel count as a marketing claim.
- Public sector claim: `15 sectors`.
- Research claim: `219 startup-period observations across 55 startups`, with the observed lead time stated as `21 to 47 days before the public fundraise announcement`.
- Do not turn the research panel into `219 fundraises`, do not call the SSRN preprint peer-reviewed, and do not promise that a signal predicts a raise.
- Do not revive personal LinkedIn activity or Hacker News publishing. HN activity is blocked until a moderator confirms recovery or an item is verified `dead:false`.
- Community work must disclose ownership, use unique UTM links, obey Reddit limits, and use the existing GitDealFlow profile workflow.
- Do not spend on paid acquisition until current source and qualified-visitor data are recovered. Existing evidence does not justify another paid test.
- Never print API keys, OAuth tokens, or personal analytics keys. Resolve them from the approved environment or vault only.
- Work in a clean isolated worktree. The audit began with unrelated local changes in `monitoring/subscriber-count.*`, `pseo-site/scripts/ancestry-ledger.json`, and `distribution/2026-08-21-distribution-audit-and-autonomous-execution.md`.
- Read `/Users/sipi/signals-gitdealflow/AGENTS.md`, `CLAIMS-LEDGER.md`, `landing/AGENTS.md`, and `pseo-site/AGENTS.md` before edits. The pSEO project has a canonical-lineage sentinel and must be changed only from `main` in `/Users/sipi/signals-gitdealflow/pseo-site`.
- Before a pSEO release, verify there is no concurrent Vercel build or deploy. Never deploy from a retired tree. Never weaken a regression guard merely to make an old tree build.

---

# 1. Audit Scope, Method, and Evidence

## 1.1 Properties audited

| Property | Role in acquisition | Live state checked | Evidence |
|---|---|---|---|
| `https://gitdealflow.com` | Marketing homepage, static content, comparison pages, research pages, lead magnets | HTTP 200, static Vercel edge delivery | Homepage: 4,238 visible words, 1 H1, canonical, 9 parsed JSON-LD types, 251 ms sampled response time |
| `https://signals.gitdealflow.com` | Data, research, pSEO, APIs, MCP, A2A, answer pages | HTTP 200, Next.js pre-rendered Vercel delivery | Homepage: 5,402 visible words, 1 H1, canonical, 16 parsed schema types, `x-nextjs-prerender: 1` |
| `https://gitdealflow.com/sitemap.xml` | Static content discovery | Strict XML valid, one child sitemap | 382 live URLs across 2 sitemap files |
| `https://signals.gitdealflow.com/sitemap.xml` | Research and pSEO discovery | Strict XML valid, 9 child sitemaps | 1,918 live URLs across 10 sitemap files |
| GSC snapshot | Search index evidence | Present locally but stale and partially failed | `pseo-site/data/audit/gsc-index-report.json` was generated 2026-05-30, sampled 770 URLs, 226 inspections failed 401 |

## 1.2 Important live observations

1. Both canonical HTTPS domains return 200 with HSTS preload, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and crawler-friendly `X-Robots-Tag` preview settings.
2. `http://gitdealflow.com/` 308 redirects to HTTPS. `www.gitdealflow.com` 308 redirects to the apex. This is correct.
3. The two live sitemap indexes are strict XML and recurse correctly. The current total is 2,300 URLs, not a guessed sitemap-index count.
4. The apex robots file explicitly allows major AI crawlers and links both sitemap roots. The signals robots file allows general crawling and blocks private/account/API paths.
5. The data site has a strong agent interface: live `mcp.json`, `agent-card.json`, `openapi.json`, `llms.txt`, `llms-full.txt`, MCP, A2A, NLWeb, JSON, and CSV surfaces all returned 200 in the audit.
6. Search results expose stale and false GitDealFlow claims. Examples indexed in live result snippets include `20 sectors`, `6-12 weeks`, `EUR 9.97`, `EUR 19`, `EUR 49`, and `219 fundraises`. These conflict with the locked claims ledger or require current price validation. This is the highest acquisition risk because search and AI engines can repeat false text before visitors ever reach the site.
7. The local static-site scan found 836 HTML files. It found 325 pages below 400 visible words and 449 pages at 400 to 999 words. These counts include valid verification, noindex, utility, and transactional pages, so they are a triage queue, not an instruction to bulk-delete pages.
8. The same scan found 94 static pages without hreflang, 21 without JSON-LD, 21 without a meta description, and 29 without a canonical. Several are verification or excluded pages. The next session must classify indexability before editing metadata.
9. The sampled research page `/research/github-velocity-correlation-study` is live with the description `A peer-reviewed study...` and body/schema language that claims `~1,200 fundraise events`. Both need correction. This is a live, concrete truth defect.
10. The current GSC snapshot is too old to rank, CTR, impression, or coverage health confidently. It contains 465 indexed URLs but 226 401 failures, 69 URLs unknown to Google, 7 crawled but not indexed, and 3 redirects in a 770 URL sample. It cannot represent the current 1,918-URL signals sitemap.

## 1.3 Audit limitations, explicitly not guessed

| Missing evidence | Why it matters | Required unlock |
|---|---|---|
| Current GSC Search Analytics | Needed for impressions, position, CTR, query cannibalization, and page-level winners | Refresh OAuth/service access, then run a last-28 and last-90-day export |
| Current PostHog acquisition query | Needed for human unique visitors, channels, landings, and UTM quality | Use approved vault/environment key without printing it; apply host and bot filters |
| Current GA4 acquisition report | Needed to compare GA4 and PostHog qualified visitor reporting | Pull GA4 source/medium and `qualified_visit` event reports |
| Bing Webmaster data | Needed for Bing coverage, queries, inbound-link reporting, and IndexNow effect | Read live Bing WMT property after authentication |
| Rank tracker | Needed to measure priority query movement rather than estimate it | Create a small query set and daily/weekly position snapshots |
| Actual AI-answer citation tests | Needed for citation share in ChatGPT, Perplexity, Gemini, and Claude | Run and log a fixed prompt matrix. Do not claim citations based on architecture alone. |
| Paid media account data | Needed for CPC, CPM, CPA, ROAS, and impression share | Do not restart spend. Recover current platform reports first. |

---

# 2. Weighted Acquisition Score

## 2.1 Composite score

**Current weighted acquisition score: 55/100.**

The technical and machine-readable base is unusually strong. The site is crawlable, HTTPS is correct, public data is accessible, and the pSEO estate is large. The score is held down by a worse problem than missing tags: live and indexed factual drift, stale measurement, unproven pSEO value density, weak brand disambiguation, no current rank data, and no evidence that paid traffic can buy qualified visitors efficiently.

### Acquisition-score weights

| Dimension | Weight | Score | Weighted contribution |
|---|---:|---:|---:|
| Core organic SEO | 16% | 57 | 9.1 |
| Programmatic and scaled content | 14% | 53 | 7.4 |
| AI and answer engines | 14% | 75 | 10.5 |
| Authority and trust signals | 12% | 42 | 5.0 |
| Crawl, index, and architecture | 13% | 76 | 9.9 |
| Structured data and markup | 8% | 70 | 5.6 |
| Speed and mobile | 7% | 78 | 5.5 |
| SERP performance | 7% | 28 | 2.0 |
| Other traffic channels | 5% | 39 | 2.0 |
| Measurement and tooling | 4% | 31 | 1.2 |

**Interpretation:** The fastest route to more qualified visitors is not another 1,000 pages. It is: make every existing public claim true, measure which existing pages and channels bring qualified investors, remove or noindex only proven low-value indexable templates, then strengthen the small set of high-intent research, comparison, answer, sector, and data pages that can earn citations and links.

---

# 3. Full Scorecard

Scores measure the ability to attract qualified visitors. A low score does not always mean the feature is technically absent. It can mean there is no current evidence that it delivers qualified discovery.

## 3.1 Core organic SEO

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| SEO | 58 | Both domains are crawlable and metadata-rich, but indexed snippets still show false claims such as 20 sectors and 6-12 weeks. | Run the truth sweep before adding new pages. |
| On-page SEO | 62 | Sampled pages have one H1, canonical, title, and description. Local static scan still reports 21 missing descriptions and 29 missing canonicals before exclusion classification. | Classify every exception and repair only indexable pages. |
| Off-page SEO | 44 | Search finds Crunchbase, InboxReads, GitHub, beforeVC, and UIComet mentions, but there is no current referring-domain, quality, or link-growth report. | Build a verified referring-domain baseline and earn research citations. |
| Technical SEO | 85 | HTTPS, HSTS preload, www redirect, robots, strict XML sitemaps, Vercel edge delivery, and pre-rendering all work in the live checks. | Add a weekly live technical smoke check so this base cannot drift. |
| Entity SEO | 68 | Organization, Brand, Dataset, Person, SoftwareApplication, WebSite, ScholarlyArticle, and other JSON-LD types are present on sampled pages. Brand search is still confused with GetDealFlow and generic DealFlow brands. | Tighten one canonical entity page and external identity references. |
| Topical authority | 66 | The estate covers methodology, data, answers, comparisons, sectors, startup pages, tools, and research. Content is broad but too many pages repeat the same old claim. | Consolidate around evidence-backed pillar clusters and link their leaves. |
| Keyword research | 36 | The repository shows many keyword-shaped pages, but no current query, volume, difficulty, or opportunity file was found. | Create a query map from GSC plus investor-language research. |
| Search-intent match | 58 | Strong informational and comparison coverage exists. Buyer intent is diluted by broad generic finance and startup pages. | Label each indexable family TOFU, MOFU, or BOFU and retain only a clear search job. |
| Keyword cannibalization | 30 | Similar `best`, `alternatives`, `vs`, `answers`, and locale pages create high overlap risk. No live query-to-URL report is available. | Use GSC query-by-page export to merge or differentiate overlapping winners. |
| Content freshness/decay | 52 | Sitemaps have current dates and weekly-data positioning, but live search surfaces old Q2, 20-sector, and old price text. | Add a quarterly claim-and-price freshness gate for every rendered route. |
| Content gaps | 48 | There are many pages, but no evidence-led gap analysis for investor query demand or competitor wins. | Produce a 50-query gap map before generating more content. |

## 3.2 Programmatic and scaled content

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| pSEO | 63 | Signals has 1,918 live sitemap URLs and apex has 382. The system has real data, not only templated prose. | Keep pSEO only where the template adds unique data, evidence, and navigation value. |
| Template/page quality at scale | 50 | Sampled signals pages are 1,257 to 5,402 words, but local apex scan has 774 of 836 HTML files below 1,000 words. | Run rendered word, unique-data, and internal-link audits by page family. |
| Index-bloat control | 55 | Sitemap generator excludes transaction, widget, verification, redirect, and known thin pages. The large live estate still lacks a current indexability decision ledger. | Create a route-family ledger: index, noindex-follow, redirect, or delete. |
| Thin-content risk | 42 | 325 apex HTML files are under 400 visible words. Some are valid utilities, but high-risk indexable leaves have not been separated from exclusions. | Sample every family, then noindex low-information indexable templates before expansion. |
| Duplicate-content handling | 60 | Canonicals and sitemap exclusions exist, and known duplicate best pages are excluded. Live old content and translation variants still risk repeated claims. | Add a rendered canonical, title, and body-similarity gate per page family. |

## 3.3 AI and answer engines

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| GEO | 78 | Public JSON, CSV, MCP, A2A, NLWeb, OpenAPI, data pages, research pages, and structured content are all present. | Correct every stale claim before prompting engines to cite the site. |
| AEO | 74 | Sampled homepage, methodology, answers, dataset, and comparison pages expose FAQPage, HowTo, BreadcrumbList, Question, Answer, and direct-answer structures. | Create a query-led direct-answer backlog from real GSC questions. |
| AIO / AI Overviews readiness | 76 | Dataset, ScholarlyArticle, API, sitemap, and direct answer surfaces are available. | Validate claims and add citations to every flagship factual answer. |
| LLMO | 88 | `llms.txt`, `llms-full.txt`, agents docs, agent card, MCP discovery, OpenAPI, and an API all return 200. | Add a generated consistency test so these files never disagree with the claim ledger. |
| RAG readiness | 83 | The structured API, MCP tools, CSV/JSON, NLWeb endpoint, long-form methods, and agent files are unusually good retrieval inputs. | Publish a concise canonical evidence dataset and update timestamp that RAG clients can quote. |
| Citation / mention share | 24 | Architecture supports citation, but no current ChatGPT, Perplexity, Gemini, or Claude prompt test was available. Search results already repeat bad facts, which is negative citation evidence. | Run a saved 20-prompt citation baseline after truth repair. |
| llms.txt | 86 | Both `llms.txt` and `llms-full.txt` returned 200. The long file is 5,391 words and exposes many discovery links. | Verify every linked claim and URL via an automated link-and-claim test. |
| Quotable / extractable content | 72 | The homepage and methodology use scannable claims, FAQs, data summaries, and multiple schema blocks. The factual language is not yet consistent across surfaces. | Create a canonical 21-47-day research evidence block reused everywhere. |

## 3.4 Authority, trust, and signals

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| E-E-A-T | 61 | Methodology, SSRN reference, dataset, open code, citations, pseudonymous author entity, and data-source content exist. False claims such as peer-reviewed erode trust. | Remove false academic and pricing claims and make the evidence chain explicit. |
| DA | 38 | External mentions exist, but no current authority tool or referring-domain report was available. | Build a link baseline, then focus on cited research distribution. |
| PA | 42 | Homepage, methodology, dataset, comparison, and answer pages have strong internal assets. No page-level link/equity data was available. | Use GSC landing and link reports to identify the 20 pages worth strengthening. |
| Backlink profile | 43 | Search surfaced Crunchbase, InboxReads, GitHub, beforeVC, and UIComet. Quality, follow status, and volume are unmeasured. | Export actual domains and separate editorial/data links from directory noise. |
| Referring domains | 40 | At least five third-party sources surfaced in search, but the count and relevance remain unverified. | Create a weekly referring-domain source table with first-seen date and target URL. |
| Anchor-text distribution | 20 | No anchor export was available. | Pull anchor text before new link-building, then target branded and methodology anchors. |
| Link velocity | 25 | No time-series link data was available. | Track new referring domains monthly, not raw backlinks. |
| Toxic / spam links | 35 | No audit found a confirmed toxic-link issue, but no link-risk export exists. | Review actual domains before considering a disavow file. |
| Brand search volume | 22 | Exact-brand search is confused by GetDealFlow and generic DealFlow brands. No GSC branded-query report exists. | Use the full phrase `GitDealFlow GitHub signals for investors` in entity pages and earn third-party citations. |

## 3.5 Crawl, index, and site architecture

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| Crawlability | 88 | Robots permit general crawl and major AI bots. Both strict XML sitemap systems work. | Monitor robots and sitemap output weekly. |
| Indexability | 72 | Canonicals and pre-rendering are present on samples. GSC snapshot is stale and contains unknown, redirect, and crawled-not-indexed states. | Refresh URL Inspection sample against the live 2,300-URL inventory. |
| Internal-link graph | 64 | Existing guards protect comparison and startup-peer internal links. No current whole-site graph or click-depth output exists. | Generate a graph from live HTML and repair only orphaned money/pillar pages. |
| Orphan pages | 50 | Prior guards show this has been a real risk, but no fresh orphan report was found. | Build a sitemap-vs-internal-link orphan report. |
| Crawl budget | 62 | Transactional and widget exclusions are handled in the apex sitemap script. The 2,300 live URLs still require family-level quality review. | Stop indexing low-value template leaves rather than adding new low-value leaves. |
| XML sitemap | 90 | Both roots strictly parse. Apex has 382 URLs, signals has 1,918 across core, sectors, crossings, startups, content, news, image, video, and i18n surfaces. | Add an automated strict XML and duplicate-URL check to the release gate. |
| robots.txt | 88 | Apex explicitly allows major AI crawlers and references both sitemap roots. Signals blocks private routes and allows public crawl. | Add a regression check that important public paths remain allowed. |
| Canonicalization | 76 | Sampled pages self-canonicalize and www redirects correctly. Static scan requires exception classification for 29 apparent missing canonicals. | Verify every indexable page has one self or deliberate cross-canonical. |
| URL structure | 78 | Clean lowercase readable routes dominate. There are several overlapping `best`, `vs`, `answers`, and translated route families. | Canonicalize one intent per route family and redirect retired near-duplicates. |
| Redirect chains | 72 | HTTP and www redirect directly to HTTPS apex. Old GSC snapshot had 3 redirect pages, but current sitemap needs a fresh redirect audit. | Test every sitemap URL for one-hop 200 or intentional removal. |
| Pagination | 64 | Startup and region pages use routed pagination. No current crawl check confirms rel/next strategy or internal pagination discoverability. | Test pagination families with bots and link graph output. |
| Hreflang / international | 58 | Some apex pages have `en` and `x-default`; local scan found 94 files without hreflang. Signals has an i18n sitemap. | Classify true localized pages, add reciprocal tags only where real translations exist, and noindex weak duplicates. |
| JS rendering / JS SEO | 86 | Signals sends pre-rendered Next.js HTML with `x-nextjs-prerender: 1`; sampled body content is present server-side. | Add visual production checks because this project has a recorded blank-screen incident. |
| Log-file signals | 18 | No crawler-log report or edge request log is accessible in the audit. | Build a weekly proxy from GSC crawl stats plus Vercel/PostHog evidence. |

## 3.6 Structured data and markup

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| Schema / structured data | 78 | Sampled pages parsed valid JSON-LD for Organization, Dataset, FAQPage, HowTo, Article, WebPage, BreadcrumbList, Question, Answer, and more. | Add a rendered schema truth scanner, not only presence tests. |
| Rich-result eligibility | 70 | FAQPage, HowTo, Dataset, Article, BreadcrumbList, ItemList, and video/news sitemaps are present. Eligibility is reduced by false claims and unverified Google feature appearance. | Repair claim truth, then track feature ownership in GSC. |
| HTML semantics | 72 | One H1 on all sampled visitor pages and accessible rendered HTML are positive. Full semantic audit has not been run. | Run a live landmark and heading-order audit for every template family. |
| Meta titles and descriptions | 64 | Samples are descriptive and keyworded. Search snippets still reveal stale claims and 21 source files lack descriptions before classification. | Build a title/description uniqueness and truth report for all indexable pages. |
| Heading hierarchy | 74 | Sampled pages had one H1 and 4 to 27 H2s. No duplicate H1 appeared in the apex static scan. | Add a release gate for one H1 and ordered H2/H3 on indexable templates. |
| XML feeds | 82 | RSS, news sitemap, image sitemap, video sitemap, API outputs, and WebSub paths are present in source and live sitemap surfaces. | Validate every feed item points to a current, canonical, factual URL. |

## 3.7 Speed as a ranking signal

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| CWV | 72 | PostHog and GA4 CWV instrumentation exists and pSEO guards protect known reporting bugs. No current field percentile report was retrieved. | Pull 28-day mobile and desktop CWV percentiles with bot and background-tab filters. |
| LCP | 74 | Edge-delivered static/prefetched pages sampled at 147 to 662 ms transfer start. Actual LCP requires field data. | Use the existing WebVitals reporter output to rank LCP pages by traffic. |
| INP | 72 | Static apex and pre-rendered signals architecture help, but no interaction percentile data was pulled. | Review top interactive tools and forms using field INP data. |
| CLS | 78 | Existing regression guards protect a documented dynamic-image CLS defect. No live field distribution was pulled. | Check top templates for image dimensions and field CLS p75. |
| TTFB | 82 | Sampled live endpoints were roughly 147 to 662 ms and served from Vercel. | Monitor p75 by route family and investigate outliers over 800 ms. |
| FCP | 75 | CDN delivery and pre-rendering are strong, but no current field FCP report exists. | Query existing PostHog/GA4 CWV data after access recovery. |
| Mobile friendliness | 76 | Viewport-ready static and responsive Next.js pages are implied by production markup, but no mobile browser sweep was conducted. | Run an automated mobile screenshot and tap-target audit of top 30 landings. |
| Mobile-first indexing | 74 | Content is server-rendered and the architecture is mobile-capable. Parity has not been verified on all template families. | Compare mobile and desktop rendered text for priority route families. |

## 3.8 SERP performance

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| SERP feature coverage | 56 | Schema supports FAQ, HowTo, dataset, article, breadcrumbs, image, news, and video discovery. Actual feature ownership is unmeasured. | Record GSC appearance data and a manual SERP baseline for priority queries. |
| Average position | 20 | No current GSC query export was available. The local snapshot is May-only and index-focused. | Pull last-28 and last-90-day GSC query and page exports. |
| Impressions | 20 | No current GSC impressions data was available. | Recover GSC access before publishing more content. |
| SERP CTR | 20 | No current clicks and impressions data was available. | Identify high-impression low-CTR pages, then test factual title and description improvements. |
| Title/meta CTR levers | 58 | Many live titles contain year, category, and price framing. Old or unverified numbers damage relevance and trust. | Replace stale titles before testing any CTR copy. |
| Featured snippets | 64 | FAQ, direct answers, HowTo, and question structures exist. No snippet ownership was verified. | Map 20 direct question queries and build answer-first pages only for those queries. |
| People Also Ask | 67 | FAQPage and answer routes are well represented. No live PAA capture was run. | Build question clusters from GSC queries and SERP PAA evidence. |
| Sitelinks | 55 | Brand architecture has clear hubs and navigation, but brand ambiguity and no brand-query data limit sitelink confidence. | Strengthen entity consistency and reduce duplicate intent routes. |

## 3.9 Local search

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| NAP consistency | N/A | GitDealFlow is an online data product, not a local service seeking geographic buyer traffic. | Do not create local-listing work solely for SEO. |
| Google Business Profile | N/A | A GBP would not match the product's global investor discovery intent. | Do not allocate time here. |
| Local pack presence | N/A | Local packs are not a qualified acquisition channel for this product. | Keep budget on investor, data, and technical-startup queries. |

## 3.10 Paid acquisition and SEM

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| SEM | 5 | No verified active search-campaign report was available. | Keep paid search off until query and qualified-visitor baselines exist. |
| PPC | 5 | No active campaign structure or current performance report was provided. | Do not create a campaign next session. |
| Quality Score | 0 | No active Google Ads keyword-level data exists in the audit. | N/A until a deliberate future test is approved. |
| Ad rank | 0 | No auction data is available. | N/A until a deliberate future test is approved. |
| CPC | 0 | No current paid-media data is available. | N/A until a deliberate future test is approved. |
| CPM | 0 | No current display/social paid-media data is available. | N/A until a deliberate future test is approved. |
| CPA | 0 | No current paid acquisition data is available. | N/A until a deliberate future test is approved. |
| ROAS | 0 | No current revenue-attribution report is available. | N/A until a deliberate future test is approved. |
| ROI | 0 | No current paid cost and qualified-visitor evidence is available. | N/A until a deliberate future test is approved. |
| Impression share | 0 | No paid auction report is available. | N/A until a deliberate future test is approved. |
| Keyword / audience targeting | 25 | Existing product framing identifies angels, scouts, seed investors, and technical-startup investors, but no paid audience definition is validated. | Turn the organic query map into audiences only after organic evidence is available. |

**Paid decision:** Do not spend next session. Existing historical context indicated poor paid Reddit visitor quality. This audit has no current paid-platform evidence that would overturn that decision.

## 3.11 Other traffic channels

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| SMM | 43 | Live homepage links Telegram, X, Flipboard, GitHub, RSS, and Discord. No current channel reach or source-quality report was available. | Publish one evidence-backed weekly data point with a unique placement ID and UTM. |
| Referral traffic | 48 | Third-party references exist and the site has UTM/affiliate/referral infrastructure. No current referral landing table is available. | Create a source, landing page, qualified visitor, and outcome report by referrer. |
| Email as a traffic source | 70 | The Sunday Signal is a core owned channel and there is substantial email automation. Acquisition performance is not currently reported. | Report newsletter clicks to content/data pages separately from lifecycle mail. |
| Direct traffic | 25 | Brand confusion and missing branded-query data limit confidence in direct demand. | Improve entity consistency and measure direct human visitors with bot filters. |
| Community / Reddit distribution | 60 | An earned-community rotation, pacing guard, and UTM approach already exist. HN is blocked and Reddit capacity is limited. | Execute one disclosed, useful community placement per week from the approved rotation. |
| Backlink-driving PR | 45 | SSRN, open data, research, GitHub, and comparison assets are linkable. No current editorial pipeline result is verified. | Pitch a data finding only after the truth sweep and with a public reproducible asset. |

## 3.12 Platform and security foundation

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| CMS SEO capabilities | 78 | Static content and Next.js routes provide direct URL, metadata, schema, feed, and sitemap control. The two-site split increases maintenance risk. | Centralize public claims and rendered-site checks across both domains. |
| Headless / rendering setup | 86 | Apex static output and signals pre-rendered Next.js output are crawler-friendly. | Preserve visual production checks because curl 200 has previously hidden blank pages. |
| SSL / HTTPS | 100 | HTTPS and direct redirects are verified live. | Maintain the current configuration. |
| HSTS | 100 | Both sampled domains return `max-age=63072000; includeSubDomains; preload`. | Keep it guarded in release checks. |
| Site availability / uptime | 82 | Both domains and public machine surfaces returned 200 in this audit. There is no current uptime incident evidence. | Keep the existing uptime monitor and add traffic-impact annotations for outages. |

## 3.13 Measurement and tooling

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| GSC coverage | 30 | GSC report exists but is from 2026-05-30 and 29.4% of its 770 URL inspections failed with 401. | Restore access and regenerate against the live sitemap inventory. |
| GA4 acquisition reporting | 50 | GA4 is installed across static pages and pSEO guards protect `qualified_visit` mirroring. No current GA4 report was read. | Pull source/medium, landing, and `qualified_visit` data weekly. |
| Indexing / coverage reports | 35 | A historical inspection report exists, but it is stale and partially unauthenticated. | Re-run live inspection samples by route family every week. |
| Crawl stats | 18 | No current Google or Bing crawl-stat export is available. | Export crawl stats after GSC access repair. |
| Rank tracking | 10 | No query list, current rank file, or reporting cadence was found. | Create a 50-query tracking sheet driven by business intent. |
| KPI / north-star for traffic | 60 | The code has qualified-visitor instrumentation, but no current public source report was available. | Publish one internal weekly KPI: qualified unique visitors by channel and landing page. |
| PostHog / analytics events | 78 | PostHog EU, GA4, qualified-visit bridge, conversion events, and CWV reporting are present in source. | Read the actual data with host and bot filters before changing acquisition strategy. |

## 3.14 Audience framing

| Item | Score | Reason with evidence | Single highest-impact fix |
|---|---:|---|---|
| B2B vs B2C search behavior | 72 | The primary framing correctly targets angels, scouts, seed investors, and technical-startup investors. Some generic startup and finance pages dilute the ICP. | Define an ICP query filter and noindex irrelevant generic page families. |
| Buyer-intent vs informational keyword mix | 48 | Informational answers and comparison pages are extensive. The intended buyer journey is not measured by query class. | Tag every page and query as informational, evaluation, or action-oriented. |
| Funnel-stage keyword coverage | 55 | TOFU research and questions, MOFU comparisons, and data/tool pages exist. There is no measurement proving a balanced qualified-visitor mix. | Build three separate landing-page cohorts and report qualified visits by cohort. |

---

# 4. The Ranked Top 10 Traffic Wins

Impact measures expected qualified visitor lift, not signups or revenue. Effort is implementation time after discovery. Scores are deliberately conservative until current analytics is recovered.

| Rank | Win | Categories improved | Impact | Effort | Score | Why it ranks here |
|---:|---|---|---|---|---:|---|
| 1 | Repair factual drift across live, indexed, and machine-readable pages | Trust, SEO, GEO, AEO, CTR, entity | High | Medium | 9/10 | Search results are already publishing false sector, lead-time, research, and price claims. Correctness is a prerequisite for qualified traffic. |
| 2 | Recover GSC, GA4, and PostHog source-of-truth reporting | GSC, CTR, impressions, rank tracking, channel measurement | High | Easy | 9/10 | This turns future work from guesses into decisions and reveals which existing pages already earn relevant demand. |
| 3 | Create a route-family indexability ledger and noindex only proven low-value pages | Index bloat, thin content, crawl budget | High | Medium | 8/10 | There are 2,300 live sitemap URLs and 774 static HTML files under 1,000 words. Remove crawl waste without deleting useful data pages. |
| 4 | Add a generated rendered-claim truth gate to both deployments | Content freshness, technical SEO, GEO, E-E-A-T | High | Medium | 8/10 | Existing guards did not stop many stale phrases from reaching live search. The repaired truth state must be undeployable if regressed. |
| 5 | Use GSC query-by-page data to merge cannibalizing pages and strengthen winners | Keyword research, cannibalization, intent, CTR | High | Medium | 8/10 | The estate has overlapping answers, comparisons, best lists, alternatives, locales, and pSEO families. Data decides which URL deserves the query. |
| 6 | Upgrade only high-intent data, methodology, comparison, and answer templates | pSEO quality, topical authority, AEO | High | Hard | 7/10 | The template multiplier is large, but first select pages with real demand and unique data rather than adding prose everywhere. |
| 7 | Build a 20-prompt AI-answer citation baseline and targeted source pages | GEO, citation share, RAG, AIO | Medium | Easy | 7/10 | The technical agent surfaces are excellent, but no citation share is measured. A baseline makes AI work falsifiable. |
| 8 | Run the approved weekly earned-community rotation with UTM discipline | Community, referral, brand search | Medium | Easy | 7/10 | It is a low-cost channel aligned with the product, provided posts are useful, disclosed, paced, and measured. |
| 9 | Build a research-citation and external-identity outreach asset | E-E-A-T, DA, links, entity SEO, PR | Medium | Medium | 6/10 | The methodology, open data, and reproducible code are linkable assets once the claim sweep is complete. |
| 10 | Add a weekly live SEO/AI smoke check and regression dashboard | Technical SEO, uptime, freshness, LLMO | Medium | Medium | 6/10 | The current problem is drift across two sites and thousands of outputs. Early detection protects earned traffic. |

## Deliberately excluded from the top 10

- A new paid campaign: no current data supports it.
- More generic pSEO pages: the site first needs proof that current families are unique, indexed, and demand-aligned.
- Local SEO: not relevant to global investor discovery.
- Hacker News submissions: blocked by account health, not a traffic opportunity until recovery is verified.
- Cold outreach: does not match the community-first acquisition strategy and is outside this audit.

---

# 5. Execution Plan

## Preflight: isolate the work and preserve current state

**Files:**
- Read: `AGENTS.md`
- Read: `CLAIMS-LEDGER.md`
- Read: `landing/AGENTS.md`
- Read: `pseo-site/AGENTS.md`
- Read: `landing/vercel.json`
- Read: `pseo-site/.deploy-lineage`
- Create: isolated clean worktree, not the current dirty working copy

**Produces:** a safe execution checkout and a dated baseline manifest. No production change yet.

- [ ] **Step 1: Inspect shared-worktree activity before changing anything.**

Run:
```bash
ps aux | grep -E "vercel (deploy|build)|hermes" | grep -v grep
git -C /Users/sipi/signals-gitdealflow status --short
git -C /Users/sipi/signals-gitdealflow stash list
```

Expected: record active workers, existing uncommitted files, and stashes. Do not use a bare `git stash pop`.

- [ ] **Step 2: Create a clean worktree from current `main`.**

Run:
```bash
git -C /Users/sipi/signals-gitdealflow fetch origin
git -C /Users/sipi/signals-gitdealflow worktree add /tmp/gitdealflow-traffic-fixes -b traffic-discovery-fixes origin/main
```

Expected: `/tmp/gitdealflow-traffic-fixes` is clean and independent of the existing dirty checkout.

- [ ] **Step 3: Read current project instructions and deploy identity.**

Run:
```bash
cd /tmp/gitdealflow-traffic-fixes
sed -n '1,220p' AGENTS.md
sed -n '1,220p' CLAIMS-LEDGER.md
sed -n '1,220p' landing/AGENTS.md
sed -n '1,220p' pseo-site/AGENTS.md
cat pseo-site/.deploy-lineage
```

Expected: `role=CANONICAL` for the pSEO source and no instruction conflict.

- [ ] **Step 4: Confirm each Vercel project before building.**

Run separately from each deploy directory:
```bash
cd /tmp/gitdealflow-traffic-fixes/landing && vercel pull --yes
cd /tmp/gitdealflow-traffic-fixes/pseo-site && vercel pull --yes
```

Expected: the landing project maps to `gitdealflow.com`, and pSEO maps to `signals.gitdealflow.com`. Stop if either project is ambiguous.

- [ ] **Step 5: Commit baseline-only documentation if desired, otherwise continue without modifying production sources.**

Expected: no deployment during preflight.

## Task 1: Build a repeatable live acquisition audit collector

**Files:**
- Create: `tools/audit-traffic-discovery.mjs`
- Create: `data/audit/traffic-discovery-snapshot.json`
- Create: `data/audit/traffic-discovery-snapshot.md`
- Create: `tools/test/audit-traffic-discovery.test.mjs`
- Modify: root `package.json` only if one exists and has a project-wide scripts convention. Otherwise document the direct command in this plan and `tools/README.md`.

**Consumes:** two domain roots, sitemap indexes, robots files, representative route list, current claim ledger.

**Produces:** machine-readable baseline containing strict sitemap counts, redirects, robots permissions, headers, metadata, schema types, title/H1/canonical checks, public agent endpoints, body word counts, and broken-link samples.

- [ ] **Step 1: Write failing tests for sitemap recursion and claim extraction.**

Create test fixtures containing one `sitemapindex`, one nested child `urlset`, and one malformed XML file. Test the collector returns exact URL totals and fails malformed XML.

```js
import assert from "node:assert/strict";
import test from "node:test";
import { countSitemapUrls, extractClaimTokens } from "../audit-traffic-discovery.mjs";

test("counts nested sitemap URLs, not child sitemap nodes", async () => {
  const fetchText = async (url) => ({
    "https://example.test/sitemap.xml": "<?xml version=\"1.0\"?><sitemapindex><sitemap><loc>https://example.test/a.xml</loc></sitemap></sitemapindex>",
    "https://example.test/a.xml": "<?xml version=\"1.0\"?><urlset><url><loc>https://example.test/a</loc></url><url><loc>https://example.test/b</loc></url></urlset>",
  })[url];
  assert.equal(await countSitemapUrls("https://example.test/sitemap.xml", fetchText), 2);
});

test("extracts forbidden public claims", () => {
  assert.deepEqual(extractClaimTokens("20 sectors and 6-12 weeks"), ["20 sectors", "6-12 weeks"]);
});
```

- [ ] **Step 2: Run the test and confirm it fails before implementation.**

Run:
```bash
node --test tools/test/audit-traffic-discovery.test.mjs
```

Expected: failure because the collector exports do not exist.

- [ ] **Step 3: Implement the collector with explicit output fields.**

The collector must record at least:

```js
{
  generatedAt: "ISO-8601",
  domains: {
    "gitdealflow.com": {
      sitemapUrls: 0,
      sitemapFiles: 0,
      invalidSitemaps: [],
      robotsAllows: { googlebot: true, gptbot: true, claudeBot: true, perplexityBot: true },
      headers: { httpsRedirect: true, wwwRedirect: true, hsts: true },
      sampledPages: []
    }
  },
  claimDrift: [{ url, token, context }],
  endpointChecks: [{ url, status, contentType }],
  failures: []
}
```

Use strict XML parsing, not regex-only counting. Fetch representative pages from each indexable family. Capture HTTP status, final URL, title, meta description, canonical, H1 count, schema parse result, visible-word count, response time, and public claim tokens.

- [ ] **Step 4: Run tests and capture the baseline.**

Run:
```bash
node --test tools/test/audit-traffic-discovery.test.mjs
node tools/audit-traffic-discovery.mjs --out data/audit/traffic-discovery-snapshot.json --markdown data/audit/traffic-discovery-snapshot.md
```

Expected: strict sitemap totals match live counts at the time of run. Any page with `20 sectors`, `6-12 weeks`, `peer-reviewed` applied to the GitDealFlow preprint, `219 fundraises`, or unverified pricing is listed with URL and surrounding text.

- [ ] **Step 5: Commit the collector and baseline separately.**

```bash
git add tools/audit-traffic-discovery.mjs tools/test/audit-traffic-discovery.test.mjs data/audit/traffic-discovery-snapshot.json data/audit/traffic-discovery-snapshot.md
git commit -m "feat: add GitDealFlow traffic discovery audit collector"
```

## Task 2: Make public claims truthful across both domains and all agent surfaces

**Files:**
- Create: `claims/public-claims.json`
- Create: `tools/verify-public-claims.mjs`
- Create: `tools/test/verify-public-claims.test.mjs`
- Modify: `landing/scripts/verify-claims.mjs`
- Modify: `pseo-site/scripts/verify-no-regressions.ts`
- Modify: `landing/research/github-velocity-correlation-study.html`
- Modify: `landing/research/index.html`
- Modify: `landing/research/vc-deal-flow-signal-2026/index.html`
- Modify: translated equivalents of the previous report where the assertion detects drift
- Modify: `pseo-site/app/vs/[slug]/page.tsx`
- Modify: `pseo-site/app/faq/page.tsx`
- Modify: `pseo-site/app/best/page.tsx`
- Modify: `pseo-site/content/alternatives.ts`
- Modify: `pseo-site/content/standalone-faqs.ts`
- Modify: `pseo-site/content/agent-queries.ts`
- Modify: `pseo-site/content/posts.ts`
- Modify: `pseo-site/content/funds.ts`
- Modify: other source files identified by the new rendered-claim scan

**Consumes:** `CLAIMS-LEDGER.md`, `pseo-site/lib/canonical-claims.ts`, current public pricing source, live audit report.

**Produces:** one canonical claim registry, source-level and rendered-output gates, and no public GitDealFlow claim that conflicts with the ledger.

- [ ] **Step 1: Write the canonical claim manifest.**

```json
{
  "panel": "350+ startups",
  "sectors": "15 sectors",
  "research": "219 startup-period observations across 55 startups",
  "leadTime": "21 to 47 days before the public fundraise announcement",
  "researchStatus": "SSRN preprint, openly published and reproducible, not formally peer-reviewed in a journal",
  "bannedOwnClaimPatterns": [
    "400+ startups",
    "400+ orgs",
    "20 sectors",
    "6-12 weeks pre-fundraise",
    "219 fundraises",
    "peer-reviewed methodology"
  ]
}
```

Do not use this manifest to rewrite competitor facts. The scanner must know whether the subject is GitDealFlow before flagging a phrase.

- [ ] **Step 2: Write failing scanner tests.**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { findOwnClaimDrift } from "../verify-public-claims.mjs";

test("flags a false GitDealFlow lead time", () => {
  const hits = findOwnClaimDrift("GitDealFlow surfaces signals 6-12 weeks before a fundraise.");
  assert.equal(hits[0].code, "GDF_LEAD_TIME_DRIFT");
});

test("does not flag a competitor claim in a cited comparison", () => {
  assert.deepEqual(findOwnClaimDrift("Harmonic says its own product starts at incorporation."), []);
});
```

- [ ] **Step 3: Run the tests to prove the guard begins red.**

```bash
node --test tools/test/verify-public-claims.test.mjs
```

Expected: failure before scanner implementation.

- [ ] **Step 4: Implement a source and rendered-output scanner.**

The scanner must:

1. Scan deployable landing HTML, pSEO `app`, `content`, `lib`, public agent files, generated `llms` routes, feeds, OG card sources, translations, and JSON-LD.
2. Skip test code and guard strings only through a narrow explicit allowlist. Never hide a live source directory from scanning.
3. Emit filename, line/route, exact token, and classification: `panel`, `sector`, `lead-time`, `research-status`, `research-sample`, `price`, or `unknown`.
4. Require a separate price manifest for every public price. Do not carry stale price labels into titles, FAQ, feed, metadata, cards, or agent docs.
5. Validate rendered output after both builds, because static output and Next.js generated pages can diverge from source.

- [ ] **Step 5: Repair current confirmed truth defects first.**

Required replacements:

| Confirmed defect | Required correction |
|---|---|
| `A peer-reviewed study...` on live apex research page | State SSRN preprint, openly published/reproducible, not formally peer-reviewed in a journal. |
| `~1,200 fundraise events` on apex research page | Remove unless a primary source substantiates it. Use the locked 219-observation wording when referring to this panel. |
| `20 sectors` when describing GitDealFlow | Replace with `15 sectors`. |
| `6-12 weeks`, `3-6 weeks`, or `6.2 weeks` when describing GitDealFlow's research lead time | Replace with the exact 21-47 day evidence language, including the sample where context needs it. |
| `219 fundraises` for GitDealFlow research | Replace with `219 startup-period observations across 55 startups`. |
| Old prices such as €9.97, €19, €49, €97, or price comparisons | Verify against the live owned checkout source. Keep only prices with a current source of truth and include a freshness date. |

- [ ] **Step 6: Run source guards and current project guards.**

```bash
node tools/verify-public-claims.mjs --root . --mode source
cd landing && node scripts/verify-claims.mjs
cd ../pseo-site && npm run verify:no-regressions
```

Expected: no public own-claim drift. Do not edit guard text to hide failing sources.

- [ ] **Step 7: Add a negative regression proof.**

Temporarily inject a known bad phrase into a fixture or untracked temporary file included by the test, then run the test. The scanner must fail with the expected code. Remove the test injection before commit.

- [ ] **Step 8: Commit source truth repair and guards.**

```bash
git add claims/public-claims.json tools/verify-public-claims.mjs tools/test/verify-public-claims.test.mjs landing pseo-site
git commit -m "fix: reconcile public GitDealFlow claims across discovery surfaces"
```

## Task 3: Recover real acquisition and search measurement

**Files:**
- Create: `data/audit/acquisition-baseline-YYYY-MM-DD.json`
- Create: `data/audit/acquisition-baseline-YYYY-MM-DD.md`
- Create: `tools/pull-acquisition-baseline.mjs` or a Python 3.11 equivalent
- Create: `tools/test/acquisition-baseline.test.mjs` or equivalent
- Modify: `docs/measurement-runbook.md` if it exists, otherwise create it
- Do not commit keys, tokens, raw PII, or individual visitor records.

**Consumes:** approved OAuth/vault access, PostHog EU, GA4, GSC, Bing WMT, sitemap inventory, current UTM conventions.

**Produces:** a current 28-day and 90-day acquisition baseline for human unique visitors, qualified visitors, source/medium, landing page, query/page performance, and index health.

- [ ] **Step 1: Validate credentials without printing them.**

Use environment or approved vault loader only. Output only booleans, project IDs, property URLs, and record counts.

Expected checks:

```text
PostHog personal API access: usable or blocked
GA4 property access: usable or blocked
GSC property sc-domain:gitdealflow.com: usable or blocked
Bing WMT property access: usable or blocked
```

- [ ] **Step 2: Pull PostHog unique visitors correctly.**

Required filters:

1. `$host IN ('gitdealflow.com', 'www.gitdealflow.com', 'signals.gitdealflow.com')`
2. Real-browser gate such as nonzero viewport and non-bot browser.
3. Exclude founder-country/self-testing according to the established reporting policy.
4. Exclude obvious direct datacenter-bot patterns.
5. Use `countDistinct(distinct_id)`, not raw pageviews.

Required output fields:

```json
{
  "period": "last_28_days",
  "humanUniqueVisitors": 0,
  "qualifiedUniqueVisitors": 0,
  "bySourceMedium": [],
  "byLandingPage": [],
  "byUtmCampaign": [],
  "directShare": 0,
  "botFilteredShare": 0
}
```

- [ ] **Step 3: Pull GA4 source/medium and qualified visit data.**

Report `activeUsers`, `sessions`, `eventCount(qualified_visit)`, source/medium, landing page, and campaign for 28 and 90 days. Reconcile the exact definition difference from PostHog in the report. Do not silently merge the metrics.

- [ ] **Step 4: Repair and run GSC reporting.**

The existing `pseo-site/data/audit/gsc-index-report.json` is from 2026-05-30 and had 226 401 failures. Refresh OAuth or service-account access. Then pull:

1. Search Analytics by query, page, country, device, and search appearance for 28 and 90 days.
2. Sitemap status for both domains.
3. URL Inspection sample stratified by family: homepage, methodology, dataset, answer, comparison, sector, startup, locale, tool, feed, and API documentation.
4. Crawl statistics and indexed/excluded categories where the property exposes them.

- [ ] **Step 5: Create a 50-query rank set.**

The list must contain:

- 15 investor-intent queries, such as deal flow tools, startup sourcing, GitHub startup signals, and VC research.
- 15 comparison queries, only where GitDealFlow has factual comparison pages.
- 10 research/data queries, such as GitHub engineering velocity dataset and startup funding signal research.
- 5 agent/MCP queries.
- 5 branded-disambiguation queries.

For every query record intent, target URL, current GSC clicks, impressions, CTR, average position, likely SERP feature, and next action.

- [ ] **Step 6: Commit only aggregate, non-sensitive reports.**

```bash
git add data/audit/acquisition-baseline-*.json data/audit/acquisition-baseline-*.md docs/measurement-runbook.md tools/pull-acquisition-baseline.* tools/test/acquisition-baseline.*
git commit -m "feat: add GitDealFlow acquisition measurement baseline"
```

## Task 4: Decide what deserves indexing before expanding content

**Files:**
- Create: `data/audit/route-family-ledger.csv`
- Create: `tools/audit-indexability.mjs`
- Create: `tools/test/audit-indexability.test.mjs`
- Modify: `landing/_rebuild_sitemap.py`
- Modify: `pseo-site/app/sitemap/[id]/route.ts`
- Modify: relevant route metadata or robots files only after the ledger approves it

**Consumes:** current 2,300-URL live inventory, GSC page/query data, rendered word count, unique-data percentage, internal link depth, canonical status, and route intent.

**Produces:** a route-family decision: `index`, `improve then index`, `noindex,follow`, `301 redirect`, or `remove`. No bulk noindex change without this ledger.

- [ ] **Step 1: Write a route-family schema.**

```csv
family,sample_url,intent,unique_data_source,median_words,median_internal_inlinks,median_click_depth,gsc_impressions_90d,gsc_clicks_90d,index_state,decision,reason,owner
```

Required families include homepage, research, dataset, methodology, answers, compare, alternatives, best, vs, sector, city, startup, predicted, weekly, tools, glossary, locale, feed, embed, transaction, and verification.

- [ ] **Step 2: Write failing tests for classification rules.**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { decideIndexability } from "../audit-indexability.mjs";

test("noindexes a transaction page without search value", () => {
  assert.equal(decideIndexability({ intent: "transaction", words: 180, impressions: 0, uniqueData: 0 }), "noindex,follow");
});

test("keeps a data page with unique evidence", () => {
  assert.equal(decideIndexability({ intent: "research", words: 700, impressions: 40, uniqueData: 0.7 }), "index");
});
```

- [ ] **Step 3: Build the live crawl and source mapping.**

For each sitemap URL, capture final status, canonical, robots directive, H1, word count, schema types, source family, inbound internal links, and click depth from the closest hub. Detect orphan pages as sitemap URLs with no internal source link, except deliberate standalone resources documented in the ledger.

- [ ] **Step 4: Resolve the apex static exceptions.**

The current local scan reports 325 pages under 400 words, 21 missing descriptions, 29 missing canonicals, and 94 missing hreflang entries. Categorize each exception into:

- verification or ownership file, exclude/noindex
- transaction/thank-you/preview/widget, noindex-follow and exclude from sitemap
- duplicate/redirect source, 301 and remove from sitemap
- actual indexable content gap, improve template/source
- intentionally single-language page, no hreflang needed

- [ ] **Step 5: Reconcile the GSC historical inventory with live inventory.**

The historical report references 2,793 sitemap URLs while the live signals sitemap has 1,918. Produce a diff showing which URLs were intentionally retired, redirected, canonicalized, or are unexpectedly absent. Do not assume lower count is a defect.

- [ ] **Step 6: Update sitemap generators only from the approved ledger.**

For apex, preserve `landing/_rebuild_sitemap.py` exclusions and add deterministic tests for every new exclusion. For signals, modify the sitemap route only after rendered URL and canonical checks pass.

- [ ] **Step 7: Verify no redirect or noindex URL remains in a sitemap.**

```bash
python3 landing/_rebuild_sitemap.py
python3 landing/_validate_sitemap.py
node tools/audit-indexability.mjs --verify-sitemaps
```

Expected: every sitemap URL returns one canonical indexable 200. Deliberate exceptions must appear in the route-family ledger, not silently disappear.

## Task 5: Improve high-intent content families, not the entire long tail

**Files:**
- Modify: `pseo-site/content/alternatives.ts`
- Modify: `pseo-site/content/comparisons.ts`
- Modify: `pseo-site/content/agent-queries.ts`
- Modify: `pseo-site/content/posts.ts`
- Modify: `pseo-site/app/answers/[slug]/page.tsx`
- Modify: `pseo-site/app/compare/page.tsx`
- Modify: `pseo-site/app/sector/[slug]/page.tsx`
- Modify: `pseo-site/app/dataset/page.tsx`
- Modify: `landing/dataset.html`
- Modify: selected apex comparison/research source files identified by GSC
- Create: `data/audit/content-priority-backlog.csv`

**Consumes:** Task 3 query/page data and Task 4 route-family ledger.

**Produces:** 20 to 40 priority pages with a clear query, verified factual basis, direct answer, unique data or comparison evidence, useful internal links, correct schema, and a truthful current title/description.

- [ ] **Step 1: Select pages by evidence, not opinion.**

Prioritize a page only if it meets at least one condition:

1. High impressions with low CTR.
2. Position 4 to 20 for a qualified query.
3. Existing referring domains or referral visitors.
4. A strong public data asset with no direct answer page.
5. A comparison page that answers a real investor choice and can cite facts.

- [ ] **Step 2: Add a content brief record per page.**

```csv
url,primary_query,intent,current_position,impressions_90d,ctr_90d,claim_sources,unique_data,required_sections,internal_links_from,internal_links_to,schema,acceptance_test
```

- [ ] **Step 3: Use the same high-information structure on each approved page.**

Required ordered sections:

1. One 40 to 60 word direct answer that contains the query language and a truthful limitation.
2. A concise evidence table with source, date, and what it supports.
3. A method, comparison, or data explanation that differs from sibling pages.
4. A decision/use-case section for the intended investor, scout, or operator.
5. Related internal links to the nearest hub and two genuinely useful siblings.
6. FAQ only where the questions are answered in the visible body.
7. JSON-LD that exactly matches visible content.

- [ ] **Step 4: Do not write generic competitor or financial claims.**

For comparisons, use publicly sourced product facts and date them. If a competitor price, feature, or claim cannot be verified, remove it or mark it as unavailable rather than guessing.

- [ ] **Step 5: Add template-level tests.**

Every priority template must prove:

- one H1
- title and description present
- self-canonical
- no stale own claim
- direct answer before the first major explanatory heading
- at least three contextual internal links
- valid JSON-LD
- a body word floor appropriate to the route family

- [ ] **Step 6: Verify selected rendered pages, not just source.**

```bash
cd pseo-site
npm run verify:metadata
npm run verify:speakable
npm run verify:jsonld
npm run audit:pseo
npm run audit:pseo-coverage
```

Expected: no templated page loses metadata, schema, or useful body during rendering.

## Task 6: Repair the internal-link graph around demand winners

**Files:**
- Create: `tools/audit-internal-links.mjs`
- Create: `data/audit/internal-link-graph.json`
- Create: `data/audit/internal-link-opportunities.csv`
- Modify: only hubs identified by the graph, likely `pseo-site/app/compare/page.tsx`, `pseo-site/app/answers/page.tsx`, `pseo-site/app/sector/page.tsx`, `pseo-site/app/research/page.tsx`, `landing/index.html`, `landing/research/index.html`, and selected category hubs

**Consumes:** current sitemap inventory, rendered HTML, Task 3 demand winners, and Task 4 decisions.

**Produces:** a graph with inbound-link count, click depth, orphan status, and proposed contextual links for priority pages.

- [ ] **Step 1: Build a crawler that resolves internal links per host.**

Do not treat a cross-domain link as broken because it points to the other GitDealFlow host. Record host and canonical destination separately.

- [ ] **Step 2: Write a test for the known cross-host case.**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { resolveInternalUrl } from "../audit-internal-links.mjs";

test("keeps a signals-domain link on its own host", () => {
  assert.equal(
    resolveInternalUrl("https://gitdealflow.com", "https://signals.gitdealflow.com/methodology"),
    "https://signals.gitdealflow.com/methodology",
  );
});
```

- [ ] **Step 3: Rank opportunities.**

Prioritize pages that have query demand, zero or low inlinks, and a valid parent hub. Never add footer-style link farms. Every link needs an explanatory anchor and a topical reason.

- [ ] **Step 4: Preserve existing internal-link safeguards.**

`pseo-site/scripts/verify-no-regressions.ts` already guards programmatic comparisons and related-startup modules. Extend it only with explicit fixed-state checks for any new high-value hub links.

- [ ] **Step 5: Re-crawl and prove improvement.**

Expected: no selected priority page is orphaned, and each has a direct path from a relevant top-level hub in at most three clicks.

## Task 7: Turn AI discoverability into measured citation share

**Files:**
- Create: `data/audit/ai-citation-baseline-YYYY-MM-DD.md`
- Create: `data/audit/ai-citation-prompts.json`
- Create: `tools/verify-agent-surfaces.mjs`
- Create: `tools/test/verify-agent-surfaces.test.mjs`
- Modify: `pseo-site/app/llms.txt/route.ts` only if a current link/claim scan finds a defect
- Modify: `pseo-site/app/llms-full.txt/route.ts` only if a current link/claim scan finds a defect
- Modify: public agent manifests only if a current link/claim scan finds a defect

**Consumes:** fixed claims from Task 2, public agent endpoints, a stable prompt set.

**Produces:** an honest citation/mention baseline with answer engine, prompt, sources cited, GitDealFlow URL cited, claim accuracy, and follow-up page opportunity.

- [ ] **Step 1: Verify all machine interfaces before any prompt test.**

Test these return 200 and describe the real product:

```text
https://gitdealflow.com/llms.txt
https://gitdealflow.com/llms-full.txt
https://signals.gitdealflow.com/.well-known/mcp.json
https://signals.gitdealflow.com/.well-known/agent-card.json
https://signals.gitdealflow.com/api/openapi.json
https://signals.gitdealflow.com/api/agent/tools
https://signals.gitdealflow.com/api/signals.json
https://signals.gitdealflow.com/api/signals.csv
https://signals.gitdealflow.com/api/nlweb
```

- [ ] **Step 2: Write link and semantic tests.**

The test must fail if a manifest refers to a 404 endpoint, an outdated number, a stale price, an old quarter, an invalid research claim, or a different product category.

- [ ] **Step 3: Define 20 fixed prompts.**

Use four groups of five:

1. Investor sourcing: `What are credible ways to find technical startups before a public funding announcement?`
2. Tool evaluation: `What are the best deal flow tools for a solo technical angel investor in 2026?`
3. Research and data: `Is there an open dataset linking GitHub engineering activity and startup fundraising?`
4. Agent and workflow: `Which MCP tools help research startup engineering momentum?`

Do not alter prompts after looking at answers. Save date, model/version where visible, answer text excerpt, citations, and claim accuracy.

- [ ] **Step 4: Score the baseline.**

For each engine calculate:

```text
mention rate = prompts naming GitDealFlow / 20
citation rate = prompts citing a GitDealFlow URL / 20
accurate mention rate = accurate mentions / all GitDealFlow mentions
```

No response should be called a citation if it only names the brand without a source link.

- [ ] **Step 5: Build only gaps shown by the baseline.**

If engines miss methodology, strengthen the methodology/data evidence page. If they miss tool installation, strengthen the MCP/OpenAPI install page. If they repeat a false claim, return to Task 2 rather than producing more content.

## Task 8: Establish an earned distribution cadence that creates qualified referral traffic

**Files:**
- Modify: `data/audit/acquisition-baseline-YYYY-MM-DD.md`
- Create: `distribution/earned-placement-ledger.csv`
- Create: reviewed post drafts in the existing approved distribution staging location
- Use existing GitDealFlow community automation only after reading its state and pacing guard

**Consumes:** the community rotation skill, claims guard, UTM convention, Task 3 baseline, Reddit state, and verified public research assets.

**Produces:** at most one useful, disclosed community placement per weekly slot, with a unique UTM and a referral measurement record.

- [ ] **Step 1: Read pacing and claim requirements.**

Run the current claims guard against every draft before any publication. Use only these fixed claims:

```text
350+ startups or organizations
15 sectors
219 startup-period observations across 55 startups
21-47 days before public fundraise announcements
```

- [ ] **Step 2: Use the approved community rotation.**

| Week | Community | Useful angle | Mandatory disclosure |
|---|---|---|---|
| 1 | r/datasets | Open dataset, fields, limitations, reproducibility | State GitDealFlow ownership in the opening sentence. |
| 2 | r/juststart | What it took to make a public GitHub signal reproducible | State GitDealFlow ownership in the opening sentence. |
| 3 | r/devops | Measuring repository activity without treating it as a funding prediction | State GitDealFlow ownership in the opening sentence. |
| 4 | r/angelinvestors | Diligence caveats and how to verify a signal | State GitDealFlow ownership in the opening sentence. |

Do not post in r/SaaS. Do not exceed four Reddit actions in a day or violate the same-subreddit pace guard.

- [ ] **Step 3: Attach a unique verified UTM.**

Example:

```text
https://gitdealflow.com/dataset?utm_source=reddit&utm_medium=community&utm_campaign=gdf-earned-community-2026-w35&utm_content=datasets
```

Verify the final URL returns 200 before publishing.

- [ ] **Step 4: Record the outcome without inventing reach.**

```csv
date,channel,community,asset,utm,post_url,status,visible_after_24h,referral_visitors_7d,qualified_visitors_7d,notes
```

- [ ] **Step 5: Keep Hacker News paused.**

No submission, warm-up automation, or comment campaign. The only recovery gate is moderator confirmation or a verified `dead:false` submitted item.

## Task 9: Earn authority through research, not directory filler

**Files:**
- Create: `distribution/research-citation-brief.md`
- Create: `distribution/research-citation-targets.csv`
- Modify: `/citations`, `/methodology`, `/dataset`, or their source files only if Task 2 truth checks and Task 7 citation baseline reveal a gap

**Consumes:** corrected research language, SSRN page, public dataset, open source code, and verified external sources.

**Produces:** a small, credible data-citation package for authors, newsletters, researchers, and VC ecosystem publications.

- [ ] **Step 1: Build a one-page citation package.**

It must contain:

- exact dataset title and current quarter
- the 219-observation wording and 21-47 day finding, with limitation
- methodology link
- SSRN link
- public data/API/CSV link
- open-source replication link
- one sentence on what GitDealFlow does not claim

- [ ] **Step 2: Source 20 relevant publication targets manually.**

Prioritize investor research newsletters, startup data publications, open-data communities, and technical VC analysis blogs. Exclude scraped mass contact lists and cold-email sequences.

- [ ] **Step 3: Mark every outcome correctly.**

`planned`, `drafted`, `submitted`, `published`, or `declined`. A submitted pitch is not a placement. A directory profile is not editorial authority.

- [ ] **Step 4: Track actual referring traffic and links.**

No authority win is reported unless a live external URL exists and the source is recorded in the referral report.

## Task 10: Add a weekly freshness, crawl, and discovery regression loop

**Files:**
- Create: `scripts/gdf-weekly-discovery-check.py` or `tools/gdf-weekly-discovery-check.mjs`
- Create: `data/audit/weekly-discovery-state.json`
- Create: a GitDealFlow-profile cron job only after the script is stable
- Modify: `docs/measurement-runbook.md`

**Consumes:** Tasks 1 through 7 outputs.

**Produces:** a quiet weekly monitor that reports only changes: false claim reappearance, sitemap drift, endpoint failures, redirect/noindex sitemap entries, broken canonical, agent-manifest dead link, crawl/index regressions, top-query movement, and human qualified visitor movement.

- [ ] **Step 1: Make the monitor deterministic.**

Stable output fields:

```json
{
  "claimDrift": [],
  "sitemapUrlCounts": {},
  "invalidSitemaps": [],
  "sitemapNon200": [],
  "agentEndpointFailures": [],
  "metadataFailures": [],
  "gscChanges": {},
  "topQueryChanges": [],
  "qualifiedVisitorChanges": []
}
```

No timestamps in the comparable payload except a separate generated-at field. The monitor must be quiet if nothing material changed.

- [ ] **Step 2: Run locally for two identical inputs.**

Expected: identical stable output hashes and no false change event.

- [ ] **Step 3: Create one weekly GitDealFlow-profile cron only after local validation.**

The job must use the GitDealFlow profile, a self-contained prompt, plain ELI5 delivery, and a change-only monitor. It must not post externally or send outreach.

- [ ] **Step 4: Verify the stored cron definition.**

Confirm schedule, profile, source script, delivery destination, repeat behavior, and state file. Do not claim it runs until one live manual run has produced the expected output.

---

# 6. Build and Production Release Protocol

## 6.1 Landing release

**Directory:** `/tmp/gitdealflow-traffic-fixes/landing`

- [ ] Run all landing-specific claim, sitemap, and static checks.

```bash
cd /tmp/gitdealflow-traffic-fixes/landing
node scripts/verify-claims.mjs
python3 _rebuild_sitemap.py
python3 _validate_sitemap.py
node ../tools/verify-public-claims.mjs --root .. --scope landing --mode source
vercel build --prod
```

- [ ] Verify built output contains corrected text and no prohibited claim.

```bash
node ../tools/verify-public-claims.mjs --root .. --scope landing --mode rendered
```

- [ ] Deploy only if the Vercel project identity was confirmed in preflight.

```bash
vercel deploy --prebuilt --prod --yes --archive=tgz
```

- [ ] Verify production with cache-busted URLs. Check status, title, H1, canonical, visible research wording, JSON-LD validity, sitemap membership, and static asset availability.

```bash
curl -sS "https://gitdealflow.com/research/github-velocity-correlation-study?verify=truth-repair" -o /tmp/gdf-research.html
curl -sS "https://gitdealflow.com/sitemap.xml?verify=truth-repair" -o /tmp/gdf-sitemap.xml
```

## 6.2 Signals release

**Directory:** `/tmp/gitdealflow-traffic-fixes/pseo-site`

- [ ] Confirm no concurrent Vercel build/deploy is running.
- [ ] Confirm `.deploy-lineage` remains canonical.
- [ ] Run all pSEO source gates.

```bash
cd /tmp/gitdealflow-traffic-fixes/pseo-site
npm run verify:no-regressions
npm run verify:release-integrity
npm run typecheck
npm run build
npm run verify:metadata
npm run verify:speakable
npm run verify:jsonld
npm run audit:pseo
npm run audit:pseo-coverage
```

- [ ] Run the rendered claim scanner against `.next` or the generated output. It must prove that public output cannot contain the old GitDealFlow claim variants.
- [ ] Deploy using the canonical project flow.

```bash
vercel build --prod
vercel deploy --prebuilt --prod --yes --archive=tgz
vercel inspect signals.gitdealflow.com
```

- [ ] Verify production visually and by source. The pSEO AGENTS instructions require a screenshot check because a curl 200 has previously hidden a blank page.

Required URLs:

```text
/
/methodology
/dataset
/compare/best-deal-flow-tools-vc-firms-2026
/compare/best-ai-deal-sourcing-tools-2026
/answers/github-data-for-startup-investors
/predicted
/.well-known/mcp.json
/.well-known/agent-card.json
/api/openapi.json
/sitemap.xml
/robots.txt
```

## 6.3 Post-deploy search notifications

- [ ] Submit only changed, canonical, indexable URLs to IndexNow after live verification.
- [ ] Confirm the key file contents match the registered key exactly before submission.
- [ ] Do not use Google Indexing API as a bulk substitute for normal pages. Use sitemap, GSC, and IndexNow appropriately.
- [ ] Re-run the live acquisition collector and attach the before/after diff to the release record.

---

# 7. Acceptance Criteria

The next session is complete only when every relevant criterion below is proven with output.

## Truth and trust

- [ ] No rendered GitDealFlow page, manifest, feed, agent file, JSON-LD block, title, description, or social card contains an unapproved own claim.
- [ ] The live apex research page no longer calls the SSRN paper peer-reviewed or claims ~1,200 fundraise events.
- [ ] Live samples on both domains use `350+`, `15 sectors`, `219 startup-period observations across 55 startups`, and `21 to 47 days` correctly where relevant.
- [ ] A deliberately injected bad claim makes the correct release gate fail.

## Crawl and index

- [ ] Strict XML parsing succeeds for both sitemap trees.
- [ ] Every sitemap URL sampled by family returns an indexable canonical 200, or is deliberately removed and documented.
- [ ] No redirect, noindex, transactional, verification, or duplicate URL remains in an index sitemap without an explicit documented reason.
- [ ] A fresh GSC report exists and distinguishes current indexed, unknown, crawled-not-indexed, redirect, and inspection-error counts.

## Content and internal linking

- [ ] Every priority page has a query, intent, source evidence, unique-data reason, and internal-link plan in the backlog.
- [ ] No selected priority page is orphaned.
- [ ] Page-level schema matches visible content.
- [ ] Content expansion occurs only after the current family passes the uniqueness and indexability checks.

## AI and agent discovery

- [ ] All public agent and API surfaces return 200 and describe the correct product.
- [ ] Every agent-manifest link resolves.
- [ ] A 20-prompt AI-answer citation baseline exists and labels citations, mentions, and claim accuracy honestly.

## Measurement and distribution

- [ ] A current 28-day and 90-day human unique visitor baseline exists.
- [ ] PostHog and GA4 definitions are written down and reconciled rather than conflated.
- [ ] GSC query, page, CTR, and average-position exports identify the first 50 query targets.
- [ ] Each community placement has ownership disclosure, an approved UTM, a visible status, and a source-quality record.
- [ ] No paid campaign is launched without a separate evidence-backed decision.

## Release integrity

- [ ] Landing build and pSEO build pass from the clean isolated worktree.
- [ ] Production aliases, not only deployment URLs, serve the new truthful content.
- [ ] Visual verification confirms pSEO pages are not blank.
- [ ] The final commit is integrated into the canonical main line or the divergence is reported plainly.
- [ ] The weekly discovery monitor completes one verified dry run and is quiet on unchanged input.

---

# 8. Next-Session Starting Prompt

Copy and paste this into a new Hermes session:

```text
Execute `/Users/sipi/signals-gitdealflow/docs/superpowers/plans/2026-08-21-gitdealflow-traffic-discovery-fixes.md` autonomously. Start with the preflight and Task 1. Work from a clean isolated worktree, not the dirty `/Users/sipi/signals-gitdealflow` checkout. Preserve the locked GitDealFlow claims: 350+ startups/orgs, 15 sectors, 219 startup-period observations across 55 startups, and 21-47 days before public fundraise announcements. First fix live/indexed false claims, then recover GSC/GA4/PostHog measurement, decide indexability by route family, strengthen only demand-backed pages, and release with production plus visual verification. Do not launch paid ads, cold outreach, personal LinkedIn activity, or HN activity. Do not stop at a plan: build, test, deploy, and verify every feasible task, then report real output and any true human gate.
```
