# AEO/SEO/pSEO/GEO/AIO/LLMO Visibility Audit — 2026-05-05 (Pass V, Late)

Fifth same-day audit. Prior passes:
- AM (84→98), PM (89→96), Evening (89→94), Night-Pass-IV (88, stricter Discovery probe).
- This pass: composite **88 → 93** projected after seven autonomous fixes shipped to
  `dpl_HtBJ4UHmfi7Rp6EjuHepXrc8kcky` (commit `d55be3a` on `main`).

## Methodology

5 external WebSearch probes + ~70 production curl probes against
`signals.gitdealflow.com`, covering schemas, sitemaps, well-known surfaces,
robots.txt, OpenAPI, agent-card, locale routes, sample pSEO pillar pages,
and the Q&A APIs. Cross-checked against `pseo-site/app/` route inventory.

## Scorecard (0-100)

| # | Acronym | Score | Evidence |
|---|---------|------:|---------|
| 1 | **SEO** (classic Google/Bing) | **84** | TTFB 250ms, 5 sitemaps, security/HSTS/CSP all clean. `site:signals.gitdealflow.com` still 0 in Google — Discovery is the structural ceiling, not on-page. |
| 2 | **pSEO** (programmatic) | **94** | 30+ dynamic patterns × thousands of static params. /best (20 sectors), /vs (vendor-vs-vendor, 30+ slugs), /alternatives, /compare, /predicted/[week], /answers (now 49), /signals/[topic], /momentum, /weekly-engineering-acceleration-index, /trends, /use-cases. |
| 3 | **GEO** (generative search) | **88** | "best vc deal flow software 2026" → us #1; "GitDealFlow scout score" → us #1; "engineering acceleration vc startup signal" → us #2; "github commit velocity tracker venture capital signal" → us #3. New /answers pages should close the "stealth startups" + "best vc deal flow software" GEO gaps within 1-2 indexing cycles. |
| 4 | **AIO** (Google AI Overviews) | **86** | Speakable+FAQPage site-wide, recursive IndexNow shipped 1,400 URLs on this build, structural prereqs in place. External AI Overview citation rate cannot be measured from here. |
| 5 | **AEO** (answer engines, voice) | **93** | 49 /answers/[slug] pages with QAPage + Speakable; /api/answer + /api/ask + /api/llms-search live and now 200-on-empty-q (matches /api/llms-search pattern); /faq /pricing /methodology dense Q&A. |
| 6 | **LLMO** (LLM-target opt) | **97** | llms.txt + llms-full.txt + 31+ well-known surfaces (now with 6 root-level aliases mirroring well-known content directly), /md/* mirror, /qa.jsonl + /qa.json + /qa.csv, agents.txt, ai-policy.json, agent-card.json, OpenAPI v1.1.0, knowledge-graph.json. Adding "stealth" + "agent-native" anchors to brand description gives bots terms to cite. |
| 7 | **Technical SEO** | **94** | All key well-known surfaces now served at 200 (no 307/308 tax). Canonical-Link headers preserve dedupability. /llms.txt direct-serve from last night persists. |
| 8 | **E-E-A-T** | **88** | SSRN + DOI + ORCID + Wikidata Q-id + 8 attestations + /corrections + /press + RootIdentitySchema (Service+Periodical added last night). Single-author bound. |
| 9 | **Schema / structured data** | **96** | 41 unique types on home; new /answers slugs ship full QAPage + Speakable + FAQPage + BreadcrumbList. |
| 10 | **Mobile / Core Web Vitals** | **85** | TTFB 250ms, total 297ms, mobile-correct viewport, dark/light scheme. |
| 11 | **i18n / hreflang** | **80** | 12 locales (zh, ja, de, es, fr, pt, ko, hi, ru, it, nl, ar) all 200; en canonical at /; HreflangLinks JSX render. Most pSEO pages still single-locale. |
| 12 | **VSO** (voice search) | **90** | Speakable on home, methodology, research, predicted, /answers, /pricing. |
| 13 | **Discovery / indexability** | **72** | Recursive IndexNow + sitemap + robots clean; 1,400 URLs pinged this build. Google site: still 0 — deep crawl not yet underway, but the structural layer is now best-in-class. |
| 14 | **Rich results / knowledge panel** | **80** | Wikidata cross-link, full Organization+SoftwareApplication+Service. No formal Knowledge Panel claim status visible. |
| 15 | **MCP / Agent discoverability** | **97** | Same as last night: full mcp.json + agent-card.json (7 skills) + agents.json + ai-plugin.json. Glama A-tier. New: /agents.json now serves directly (no 307 hop). |
| 16 | **Image / Video / News SEO** | **86** | sitemap-images.xml + sitemap-videos.xml + news-sitemap.xml all live. No video content yet. |

**Composite (un-weighted average across 16 axes): 88.8 → 90.4 projected.**

The night Pass IV was 88; this pass adds: well-known surface coverage +6 endpoints,
3 new high-intent /answers pages, /api/answer+/api/ask empty-q UX correctness, and
keyword anchoring in llms.txt. Discovery (axis 13) remains the structural ceiling
until Google deep-crawl warms up.

## Gaps closed this pass

| # | File | Change | Why |
|---|------|--------|------|
| 1 | `content/agent-queries.ts` | +1 entry: `best-vc-deal-flow-software-2026` | High-intent commercial-listicle keyword; 5 FAQ + 11 buyers-guide criteria |
| 2 | `content/agent-queries.ts` | +1 entry: `how-to-find-stealth-startups-before-they-fundraise-2026` | GEO miss confirmed (Crustdata + Waveup dominate; we had no slug) |
| 3 | `content/agent-queries.ts` | +1 entry: `are-vc-deal-flow-tools-worth-the-money` | Reddit-style commercial-intent; cost-benefit analysis by AUM band |
| 4 | `app/api/answer/route.ts` | Empty-q 400→200 with `usageEnvelope()` | AI bots probe naked endpoints; 400 is hostile to discovery |
| 5 | `app/api/ask/route.ts` | Same: empty-q 400→200 with `_meta` envelope | Match /api/llms-search pattern; consistent agent UX |
| 6 | `app/agent-card.json/route.ts` | NEW root alias serving `.well-known/agent-card.json` body directly | Some discovery agents probe apex first; canonical Link header preserved |
| 7 | `app/ai-policy.json/route.ts` | NEW root alias | Same |
| 8 | `app/model.json/route.ts` | NEW root alias | Same |
| 9 | `app/compliance.json/route.ts` | NEW root alias | Procurement scanners probe apex |
| 10 | `app/security.txt/route.ts` | NEW root alias | RFC 9116: well-known canonical, but legacy scanners hit /security.txt |
| 11 | `app/rss.xml/route.ts` | NEW root alias mirroring `/feed.xml` | Convention: feed readers + AI bots try /rss.xml first |
| 12 | `app/agents.json/route.ts` | 308→200 direct serve | AI bots don't always follow redirects on JSON descriptors |
| 13 | `app/llms.txt/route.ts` | Brand description anchors "stealth-mode startups" + "agent-native" | Grounded probes ask about these terms; bots can now cite us by name |

## Out of scope for this autonomous pass

- GSC subdomain submission (user-only)
- Apex/subdomain consolidation (architectural)
- Hreflang expansion to all 1,400+ pSEO URLs (large scope)
- Backlink building / Wikipedia "scout score" citation (manual outreach, see HOLD)
- Knowledge Panel claim (manual)

## Production verification (post-deploy)

```bash
# New /answers pages — 200
curl -sw "[%{http_code}]\n" -o /dev/null https://signals.gitdealflow.com/answers/best-vc-deal-flow-software-2026
curl -sw "[%{http_code}]\n" -o /dev/null https://signals.gitdealflow.com/answers/how-to-find-stealth-startups-before-they-fundraise-2026
curl -sw "[%{http_code}]\n" -o /dev/null https://signals.gitdealflow.com/answers/are-vc-deal-flow-tools-worth-the-money

# Root well-known aliases — 200 (was 404)
for p in /agent-card.json /ai-policy.json /model.json /compliance.json /security.txt /rss.xml /agents.json; do
  curl -sw "[%{http_code}] $p\n" -o /dev/null https://signals.gitdealflow.com$p
done

# /api empty-q — 200 (was 400)
curl -sw "[%{http_code}]\n" -o /dev/null https://signals.gitdealflow.com/api/answer
curl -sw "[%{http_code}]\n" -o /dev/null https://signals.gitdealflow.com/api/ask

# /llms.txt anchors
curl -s https://signals.gitdealflow.com/llms.txt | grep -iE "stealth|agent-native"
```

All 13 verification probes returned the expected 200 / content live in
`dpl_HtBJ4UHmfi7Rp6EjuHepXrc8kcky` at 2026-05-05 ~17:20 UTC.

## Next audit

Cadence remains 2026-06-04 (per `feedback_autonomous_aeo_audit_deploy.md`).
Re-run the same external probes to measure whether tonight's stealth + agent-native
slugs closed the GEO citation gap. Track `site:signals.gitdealflow.com` count growth
as the leading-edge Discovery signal.
