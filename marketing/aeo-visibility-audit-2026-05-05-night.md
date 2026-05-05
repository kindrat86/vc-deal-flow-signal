# AEO/SEO/pSEO/GEO/AIO/LLMO Visibility Audit — 2026-05-05 (Night, Pass IV)

Fourth same-day audit. Prior passes: AM (84→98), PM (89→96), Evening (89→94).
Run after merge of `bbdc10d` (origin/main) into `claude/pricing-buyers-guide-2026-05-04`.

## Methodology

5 external WebSearch probes + 14 production curl probes against `signals.gitdealflow.com`
schemas, sitemaps, well-known surfaces, robots.txt, OpenAPI, agent-card, and selected pSEO
pillar pages. Cross-checked against the file inventory produced by an Explore subagent.

## Scorecard (0-100)

| # | Acronym | Score | Evidence |
|---|---------|------:|---------|
| 1 | **SEO** (classic Google/Bing) | **84** | robots.txt clean + 5 sitemaps declared + canonical tags consistent + TTFB 178ms; but `site:signals.gitdealflow.com` returns 0 results (subdomain not deeply indexed) and `site:gitdealflow.com` returns just 1 (apex thin) |
| 2 | **pSEO** (programmatic) | **95** | 30+ dynamic route patterns × thousands of static params (startup, compare, vs, predicted, answers, alternatives, best, use-cases, signals, stage, momentum, weekly, etc.); each with metadata + OG image + JSON-LD + hreflang where relevant |
| 3 | **GEO** (generative search) | **92** | Brand probes return us as #1 with detailed accurate descriptions in ChatGPT-grounded results. "best alternative data VC tools 2026" returns us in top 3. "MCP server VC GitHub signals" returns us. Novel-term ("scout score") query does NOT yet cite us. |
| 4 | **AIO** (Google AI Overviews) | **86** | All structural prerequisites in place: speakable schema on home/methodology/research/predicted/answers, FAQPage on /faq /pricing /methodology, QAPage on /answers/[slug], llms.txt + llms-full.txt + ai-policy.json + ai.txt, recursive IndexNow (1,412 URLs/build). External AI Overview citation rate cannot be measured from here. |
| 5 | **AEO** (answer engines, voice) | **90** | 50+ /answers/[slug] pages with QAPage + Speakable, 11 Q&As on /pricing, multi-Q&A on /faq /methodology /buyers-guide; /api/answer + /api/ask + /api/llms-search live; voice-grade Speakable specs. Two high-intent gap topics remain (agent-native VC tools, scout score definition). |
| 6 | **LLMO** (LLM-target opt) | **96** | llms.txt + llms-full.txt anchor brand attribution, 23+ well-known surfaces, /md/* mirror routes, agent-card.json (7 skills), mcp.json + ai-plugin.json + agents.json, OpenAPI v1.1.0 (21 paths), model.json, compliance.json, ai-policy.json. Probably most exhaustive in category. |
| 7 | **Technical SEO** | **90** | HTTPS + HSTS preload + security.txt + X-Content-Type-Options + Permissions-Policy + Vercel CDN + per-page prerender. /.well-known/llms.txt currently 308→/llms.txt (latency tax + canonical drift risk for AI bots). |
| 8 | **E-E-A-T** | **88** | SSRN abstract + DOI + ORCID for "The Data Nerd" persona, Wikidata Q139376302, /attestations lists 8 third-party indexers, /corrections public log, /press kit, RootIdentitySchema with 23-entry sameAs cross-graph. Persona is anonymous-but-credentialed; bounded by single-author setup. |
| 9 | **Schema / structured data** | **95** | 48 unique types deployed across 90+ pages; verified live: Article + ClaimReview + ItemList on /predicted/2026-w18, QAPage+FAQPage on /answers/, FAQPage + AggregateOffer on /pricing, WebApplication+HowTo on /receipts, Organization+Person+SoftwareApplication site-wide |
| 10 | **Mobile / Core Web Vitals** | **85** | TTFB 178ms, total 217ms, dark/light scheme, viewport meta correct, 375px audit shipped. /predicted/2026-w18 134KB, home 323KB (heaviest, no critical regressions). |
| 11 | **i18n / hreflang** | **80** | 12 locales × 30+ topics route, HreflangLinks component on key pages, sitemap-i18n.xml. But i18n covers only 79 URLs of 1,400+ canonical — most pSEO pages still single-locale. |
| 12 | **Voice Search Optimization (VSO)** | **90** | Speakable schema on home, methodology, research, predicted, answers, /pricing. Question-style headings on /answers, /faq, /methodology. |
| 13 | **Discovery / indexability** | **78** | Recursive IndexNow shipped, sitemap declared, robots.txt clean. But Google `site:signals.gitdealflow.com` returns 0 — deep crawl not yet underway. GSC subdomain submission status unknown from CLI. |
| 14 | **Rich results / knowledge panel** | **80** | SoftwareApplication + Organization + ContactPoint on home, Wikidata cross-link, OpenAlex/SSRN/Crossref/Semantic Scholar sameAs. No formal Knowledge Panel claim status visible. |
| 15 | **MCP / Agent discoverability** | **97** | mcp.json + agent-card.json (7 skills, parity with /api/openapi.json paths) + agents.json + ai-plugin.json. Glama A-tier. Smithery + mcp.so structurally unavailable per `feedback_smithery_*` and `feedback_mcp_so_*` memory. |
| 16 | **Image / Video / News SEO** | **85** | sitemap-images.xml + sitemap-videos.xml + news-sitemap.xml all live; image alt-text density not yet measured. No actual video content yet. |

**Composite (un-weighted average): 88.0**

This is *lower* than the evening pass (94) because tonight's measurement is stricter on
the **Discovery/indexability** dimension once Google `site:` was probed directly. The
evening 94 didn't include that probe. Internal infra remains best-in-class.

## Gaps (only items autonomous-fix can address)

1. **`/.well-known/llms.txt` 308 redirect** — Some AI crawlers may not follow 308; serve content directly. Trivial.
2. **Missing /answers page**: "agent-native VC deal flow tools 2026" — hot category 2026; we should anchor it. (Greg Isenberg "Agents Are the New SaaS" thesis already in memory.)
3. **Missing /answers page**: "what is a GitHub scout score" — we coined the term but it doesn't rank. /receipts is the product page; /answers is the explainer.
4. **/receipts schema thin on Service** — has WebApplication + HowTo + FAQPage; should add `Service` schema for procurement evaluators + tighten "Scout Score" term anchoring in title.
5. **RootIdentitySchema missing Service entry** — the dashboard product is a `SoftwareApplication`, but the underlying offering ("VC deal flow signal as a service") could be mirrored as `Service` for procurement RFP matchers.

Out of scope for this autonomous pass:
- GSC subdomain submission (user-only)
- Apex/subdomain consolidation (architectural decision)
- Hreflang expansion to all 1,400+ pSEO URLs (large scope)
- Backlink building / Wikipedia "scout score" citation (manual outreach)

## Fixes shipped this pass

| # | File | Change | Why |
|---|------|--------|------|
| 1 | `app/.well-known/llms.txt/route.ts` | 308→200 with same body as `/llms.txt`; both routes serve identical canonical content | AI bots don't always honor 308; some treat it as 4xx |
| 2 | `content/agent-queries.ts` | +1 entry: `agent-native-vc-deal-flow-tools-2026` | Anchor for "AI agent VC tools" / "agent-native deal flow" 2026 commercial-intent queries |
| 3 | `content/agent-queries.ts` | +1 entry: `what-is-a-github-scout-score` | Definitional anchor for our novel term; receipts page is the tool, this is the explainer |
| 4 | `app/receipts/page.tsx` | Add `Service` schema + tighten title to lead with "Scout Score" | Procurement eval + term-anchor |
| 5 | `components/RootIdentitySchema.tsx` | Add `Service` (umbrella service offering) + `Periodical` (signal report) to @graph | Two missing entity types for procurement / academic citation graph |

## Production verification (post-deploy)

Run after `vercel deploy --prebuilt --prod --archive=tgz`:

```bash
# Fix 1
curl -sI https://signals.gitdealflow.com/.well-known/llms.txt | head -3
# Expect: HTTP/2 200 (not 308)
curl -sw "[%{http_code}] %{size_download}\n" -o /dev/null https://signals.gitdealflow.com/.well-known/llms.txt

# Fix 2 + 3
curl -sw "[%{http_code}]\n" -o /dev/null https://signals.gitdealflow.com/answers/agent-native-vc-deal-flow-tools-2026
curl -sw "[%{http_code}]\n" -o /dev/null https://signals.gitdealflow.com/answers/what-is-a-github-scout-score

# Fix 4
curl -s https://signals.gitdealflow.com/receipts | grep -oE '"@type":"Service"' | head -1
curl -s https://signals.gitdealflow.com/receipts | grep -oE '<title>[^<]*</title>'

# Fix 5
curl -s https://signals.gitdealflow.com/ | grep -oE '"@type":"Service"|"@type":"Periodical"' | sort -u
```

## Next audit

Cadence remains 2026-06-04 (per `feedback_autonomous_aeo_audit_deploy.md`). After that
audit re-run the same 5 search probes + count Reddit/Wikipedia citations of "scout score"
to measure whether tonight's /answers page closed the GEO gap.
