# GitDealFlow Claims Ledger (canonical)

> Ground truth: `pseo-site/lib/canonical-stats.ts`, derived at build from
> `pseo-site/data/startups.json` (the same loaders the public API uses).
> Verified by `pseo-site/scripts/verify-claims.ts` on every build of both
> hosts. Static copies must stay within ±15% of the live panel count.
>
> Live at time of writing (Q3 2026 panel): **411 orgs / 15 sectors**.
> Cumulative unique orgs ever published: ~541. The panel count moves weekly;
> **never hardcode it**  - import `PANEL_CLAIM` or copy the sanctioned wording
> and let the guard band-check it.

## Sanctioned claims (safe to publish anywhere)

| Claim | Value | Source of truth |
|---|---|---|---|
| Panel size | 411 venture-backed startup GitHub orgs, 15 sectors, refreshed weekly | derived, `CURRENT_PANEL_COUNT` |
| Sector count | 15 active sectors (5 legacy clusters frozen Q2 2026) | derived, `ACTIVE_SECTOR_COUNT` |
| Period | Q3 2026 (weekly snapshots) | derived, `PERIOD_NAME` |
| Cumulative orgs | ~540 cumulative orgs since 2024 (union of all quarterly panels) | derived, `CUMULATIVE_ORG_COUNT` |
| Lead time | Engineering acceleration precedes fundraise announcements by 21-47 days | SSRN 6606558 |
| Research sample | 12,000+ public repositories (SSRN sample)  - always say "SSRN sample" | RESEARCH.ssrnRepoSample |
| Confirmed rounds | 219 confirmed rounds in the SSRN panel | RESEARCH.ssrnConfirmedRounds |
| Scout unicorn DB | ~75 validated unicorns (Scout Score reference set) | RESEARCH.scoutUnicornDb |
| SSRN preprint | SSRN 6606558 (DOI to follow) | RESEARCH.ssrnUrl |
| Citations | CC BY 4.0, cite as "VC Deal Flow Signal (signals.gitdealflow.com), Q3 2026 data" | meta.license |

## Banned tokens (fail the build)

`369`, `4,800`, `350++`, `thousands of startups`, `140 startups ranked`,
`60+ startups`, current-tense `350+` panel claims in code copy.

`350+` remains legitimate **only** in period-labelled historical prose
("350+ orgs in the Q1 2026 window").

`369` remains legitimate **only** as the frozen blog URL slug
"i-tracked-369-startup-github-orgs-six-months" (the Q1/Q2-2026 window had
369 orgs; the URL + 301 redirect are frozen). Protected by both
scripts/sweep_claims.py and scripts/verify-claims.ts - never rename it.

## Surface → canonical mapping (what changed today, 2026-08-16)

| Surface | Before | After |
|---|---|---|
| Root README, MCP README, OpenAI manifest | 369 / 369 / 369 | 400+ (band-safe through next weekly refreshes) |
| landing/about.html + de/es | 369 | 400+ |
| landing/index.html hero + SVG | 350+ / 350++ | 400+ |
| landing/llms.txt | "thousands of startups" | 400+ |
| landing/llms-full.txt (×3 spots) | 350++ ×2, 350+ | 400+ |
| landing/dashboard.html ×9 | 60+ | 400+ |
| landing/dataset.html + datasets.html | 350+ trending | 400+ |
| pseo dashboard metadata | 60+ | 400+ |
| pseo pricing ×5, use-cases ×2, PricingLadder | 140 | 400+ (Dashboard = full ranked field) |
| pseo agent-queries.ts (~40 spots) | ~350+ / 369 / "hundreds" | 400+ |
| pseo methodology-faqs comment + answer | ~350+ | 400+ |
| pseo public/agents.md + HF dataset readme | ~350+ | 400+ |
| pseo ForFrameworkPage / for-framework-data | 350+ | 400+ |
| pseo state-of-github ×2 | 350+ | 400+ |
| pseo posts.ts sector-size sentence | "web3 42 … agtech 11" (stale) | removed (weekly-varying numbers) |
| press-releases.ts | 4,800 organizations | 500+ cumulative orgs, 15 sector clusters |
| chrome-extension content.js link + PUBLISH.md | 350+ / 369 | 400+ |
| signal-engine README (public repo) | 4,200+ orgs, 20 sectors | 500+ tracked orgs, 20 sectors |
| Verify the two persistent-network templates (MCP build-guard) | n/a | added to the audit trail |

## External directories (self-service updates, NOT in this repo)

These copied the stale "4,200+" from the signal-engine README. Update when
you next log in; they are outside the deploy path:

- Glama (glama.ai) MCP listing → "411 orgs / 15 sectors, weekly"
- mcpservers.org, getbob.dev, itinai.com → panel wording above
- Cursor Directory → panel wording
- Chrome Web Store listing text → panel wording
- npm README (ships with the package; update on next publish)
 and https://github.com/kindrat86/gitdealflow-signal-engine README

## Why "400+"

The panel moved 350 → 369 → 408 → 411 → 540 (in-flight) across ten weeks.
A hardcoded round marketing number drifts within days of each Monday
refresh. `400+` is accurate for today's 411, stays accurate through the
in-flight ~540 refresh, and the build guard flags it only if the live panel
ever falls below ~350 or above ~470  - the moment it crosses, the sweep
replaces it with the new sanctioned value in one scripted pass.
