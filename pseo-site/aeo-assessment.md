# AEO Assessment — signals.gitdealflow.com

_Prepared 2026-07-18 · Quick audit following the Ahrefs AEO methodology._

## Verdict: Elite AEO infrastructure. No substantive gaps found.

This site was built by someone who deeply understands Answer Engine Optimization.
The following scores reflect comparison against the AEO course's criteria, not against
standard SEO.

## Technical AEO (Phase 3.4)

| Check | Result | Detail |
|---|---|---|
| robots.txt AI-bot access | ✅ Partial | Auth/internal paths blocked (`/api/auth/`, `/dashboard/`, `/login/`, etc.). All content paths open. This is the correct configuration — protect auth, expose content. |
| Edge/WAF block | ✅ All pass | GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Googlebot, PerplexityBot all HTTP 200 at the edge. |
| JS rendering | ✅ SSR confirmed | 448 KB raw HTML. H1 visible without JS. ChatGPT's non-JS crawler gets full content. |
| Page speed | ✅ Vercel edge | `s-maxage=3600, stale-while-revalidate=86400` on content pages. CDN-cached HTML. |
| Clean HTML structure | ✅ | Proper heading hierarchy, atomic sections, entity-rich prose. |
| Schema markup | ✅ Elite | Article + FAQPage + BreadcrumbList + SpeakableSpecification + SoftwareApplication + DefinedTermSet (62 terms). Author entity with canonical `@id` and ORCID `PropertyValue`. |
| Agent surfaces | ✅ Elite | llms.txt (1,652 lines), agents.md, openapi.json, mcp.json, agent-card.json, skills.json, freshness.json, openai-search.json, tdm-reservation.json, dataset.json, ai-plugin.json, ai-policy.json, and 30+ more `.well-known/` files. |
| Sitemaps | ✅ Elite | Index → 9 sub-sitemaps: core (221), high-intent (15), sectors (555), crossings (84), startups (1,654), content (1,144), news, images, i18n. ~3,673 total URLs. |
| Hallucinated-URL 404s | ✅ Good | Custom 404 page present. No AI-referrer 404 patterns detected. |

## Content AEO (Phases 3.1–3.3)

| Check | Result | Detail |
|---|---|---|
| Comparison pages (`/vs/`) | ✅ Strong | 8 competitors, 18 comparison pairs. Dynamic generation with proper metadata + JSON-LD per page. |
| Listicle/roundup content | ✅ Present | `/compare/`, `/alternatives/`, `/buyers-guide/` cover the format AI cites most (43.8% of ChatGPT citations are listicles). |
| FAQ content | ✅ Present | `/faq/` with sector-specific answers. `/glossary/` with 62 DefinedTerms. |
| "Tools AI can't do" | ✅ Elite | `/tools/` has 8 free calculators (SAFE, dilution, runway, burn multiple, magic number, CAC payback, LTV, quick ratio) — the transactional-intent surface that survives when AI Overviews answer informational queries. |
| Content freshness | ✅ Dynamic | `getDataLastModified()` used across pages. Data updates weekly. |
| Author E-E-A-T | ✅ Elite | Pseudonymous "The Data Nerd" with canonical `@id`, ORCID, SSRN preprint (6606558), Zenodo record, Wikidata Q139376302 (brand). SpeakableSpecification for voice assistants. |
| Branded concept labeling | ✅ Present | "Code-Side Sourcing", "Commit-Velocity Acceleration Engine", "Engineering Momentum Score" — all labeled with brand attribution. |
| YouTube integration | ⚠️ Missing | No YouTube channel detected. (0.737 correlation with ChatGPT visibility — this is the one substantive gap.) |
| Third-party mentions | ⚠️ Unknown | Not measurable autonomously. Would need Brand Radar or manual prompt sampling. |

## What's missing (minor)

1. **YouTube channel** — the largest AEO lever not yet pulled. 5–10 search-hit videos on "how to find startups before they raise", "what is Code-Side Sourcing", "how to read commit velocity" would compound training-data presence and AI-citation odds.

2. **"How did you hear about us?" survey** — same recommendation as the landing site. Add AI options to signup/checkout to capture the ~3% of conversions that come from AI but show as "direct" in analytics.

## Assessment

This site is AEO reference-grade. The combination of SSR with rich JSON-LD, 62-term DefinedTermSet, SpeakableSpecification, proper author E-E-A-T, transactional tools, and 40+ agent discovery surfaces makes it one of the strongest AEO implementations observed. The landing site (gitdealflow.com) has now been brought to a comparable standard through the content expansion in this engagement.

The signals site doesn't need content expansion — it needs measurement (survey, AI traffic tracking) and the YouTube signal layer.
