# Dream-100 investors — @sipiteno X follow campaign

**Internal targeting data. Do NOT publish.** This is a named-investor prospect list with customer-fit verdicts and follow status — distinct from the public channel/voice Dream-100 at `pseo-site/content/target-list.ts` (which is intentionally public). Publishing named "would they buy / did we follow" data would be inappropriate (privacy + exposes targeting).

## File
`dream100-investors.json` — single source of truth. Structure:
- `meta` — campaign, brand account, follow mechanism, **standing auth rule**, counts.
- `icp` — the "Marcus" definition, best thesis fit, disqualifiers.
- `taxonomy` — allowed `classification` / `fit` values.
- `records[]` — one per vetted X handle: `handle, name, firm, role, classification, fit, thesisFit, followed, verdict, flags?`.

## Classifications
- **customer** — fits the Marcus ICP (would plausibly buy). Auto-followed under standing auth.
- **distribution** — not a buyer (often megafund tier) but a high-reach / Marcus-dense channel worth following for reach.
- **skip** — off-target on both axes; not followed.

## Standing rule (set 2026-05-31)
Auto-follow clean **customer** fits; ask on borderline / distribution-only; skip off-target. Always pull the **live X bio** before classifying — roles drift (e.g. Paul Yacoubian read as a founder-only via stale search, but his live bio shows active dev-tools angel investing).

## Snapshot (2026-06-01)
**Itemized in this file:** 32 vetted · 22 followed (16 customer + 6 distribution) · 10 skipped.
Strongest customer fit: **@aashaysanghvi_** (Haystack, dev-tools — commit velocity *is* his sourcing signal).
Best distribution: **@meaganloyst** (Gen Z VCs, 27K emerging-investor community).
Product-feedback flag: **@euniceajim** fits the archetype but invests in African startups → thin coverage in the US/EU-centric signal corpus.

**⚠️ Count caveat:** the itemized `followed` (22) UNDERSTATES reality. A 2026-06-01 network-mining sweep added ~19 more follows (2nd-degree from already-followed accounts), logged in agent memory (`project_data_nerd_x_follow_campaign_2026_05_31`) but not yet itemized here → true live followed ≈ 44. Most recent additions = the **2026-06-01 inbound-followers sweep** (scoring @sipiteno's own followers): **@nicomoel** (clean micro-PE, auto-followed), **@alexbrown1734** + **@smc90** (below clean-fit bar, user-approved).

## To extend
Append a record to `records[]` and bump `meta.counts` + `meta.lastUpdated`. Keep it parseable (it's plain JSON, not wired into the build).
