# Claims Ledger (canonical claims, locked 2026-08-16)

Single source of truth for every public number about GitDealFlow / VC Deal Flow Signal.

## Ground truth (live API: signals.gitdealflow.com/api/signals.json)

- totalStartups (panel): 411 at last read (2026-08-16). Changes weekly.
- totalSectors: 15.
- Period: Q3 2026.

## Locked canonical claims (do not change without user sign-off)

| Metric | Canonical form | Banned forms |
|---|---|---|
| Panel size | "350+" | "400+", "369", "411", "4,200+", "4,800", "~400", any exact count |
| Sector count | "15" | "20", "4,200+ orgs" |
| Data period | "Q3 2026" (advances quarterly) | "Q2 2026" once Q3 has started |
| SSRN research sample | "12,000+ repos", "219 fundraises", "~75 unicorns" (sample labels, NOT panel size) | conflating any sample number with panel size |

Rationale: "350+" is a stable floor that survives the weekly refresh. Exact counts (369, 411, 540) change weekly and create drift. "400+" overclaims the deduped unique-org count (under 400).

## Surfaces

- landing (gitdealflow.com): "350+", "Q3 2026". Deployed and verified.
- pseo-site (signals.gitdealflow.com): "350+", "Q3 2026". DEPLOYED + LIVE-VERIFIED 2026-08-19 (24/24 needles, both hosts): llms.txt, /md, llms-full, homepage, stats.json (citation stat now floors), blog byline, and the 350++ typo fleet all derive lib/canonical-claims.ts (§56 guard extended: stats.json + blog claimSurfaces, 350++ banned token, apex llms-full floor+quarter needle). Deployed from union 78da4cfe after a foreign-lineage revert; redeployed as last writer.
- mcp-server (npm @gitdealflow/mcp-signal): README "350+", server.ts "350+", openai-app manifest "350+". Source fixed (2.2.2); npm whoami OK again, publish pending.
- Glama repo (kindrat86/mcp-deal-flow-signal): "350+ / 15 sectors". Pushed 25dabab.
- signal-engine repo (kindrat86/gitdealflow-signal-engine): re-locked to "350+" (commit b924d80) and pushed to origin/main 2026-08-16.
- chrome-extension: PUBLISH.md "350+".
- External directories (Glama live, mcpservers.org, Cursor Directory, Chrome Web Store): login-gated; punch list below.

## Enforcement

- verify-claims.ts was REMOVED in revert f2c842b0 (do not reference it). Enforcement now lives in pseo-site/scripts/verify-no-regressions.ts SS56: lib/canonical-claims.ts floor module + surface needles + banned-token scan (400+ / ~400 / 4,200+ / 4,800 orgs / 369 / 411 / 540 as claims) + stale weekly-report check. Proven fail-closed 2026-08-16.
- Also SS10c: app/about/page.tsx pinned to "350+ venture-backed startups" (not 369/~400/400+).

## External directory punch list (login-gated)

1. Glama (glama.ai): live description was stale "20 sectors"; re-crawl after repo push.
2. mcpservers.org: manual form, bot-gated.
3. Cursor Directory: Vercel Security Checkpoint 403.
4. Chrome Web Store: developer dashboard (Google OAuth).
5. npm published README: token 401; re-login then publish.

## 2026-08-16 reconciliation session (audit win #6, executed)

- New single source of truth: `pseo-site/lib/canonical-claims.ts` (PANEL_CLAIM = "350+", panelClaimFloor()). Every dynamically-counted surface (homepage hero + SocialProofBar + sector-list footer, llms.txt, llms-full.txt, /md mirrors, /startups + /startups/region directories, weekly-report generator, digest-email generator) now derives the floor instead of rendering raw sector-sums (411/540) that overstate the deduped unique-org count (< 400).
- Weekly-report + digest generators re-emitted stale claims from dirty local data (20 sectors / 400+ / 540); both generators now phrase panel size as the floor and prebuild regenerates the committed copy from committed data (15 sectors / 350+).
- Fixed stale copies: root README (369), landing/de/about (369), content/press-releases.ts + content/state-of-engineering-velocity.ts (4,800 orgs), PAID-ADS docs (369).
- Enforcement: verify-no-regressions.ts SS56, proven fail-closed both directions (lineage revert + banned-token injection).
- Known residual: the 2026-08-16 16:00 Sunday digest was sent with "540 startups / 20 sectors" (generated from dirty local data before this fix); next issue self-corrects.
