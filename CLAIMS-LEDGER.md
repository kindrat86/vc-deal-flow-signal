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
- pseo-site (signals.gitdealflow.com): "350+", "Q3 2026". Source fixed; redeploy required.
- mcp-server (npm @gitdealflow/mcp-signal): README "350+", server.ts "350+", openai-app manifest "350+". Source fixed; npm publish blocked (token 401).
- Glama repo (kindrat86/mcp-deal-flow-signal): "350+ / 15 sectors". Pushed 25dabab.
- signal-engine repo (kindrat86/gitdealflow-signal-engine): needs re-lock to "350+".
- chrome-extension: PUBLISH.md "350+".
- External directories (Glama live, mcpservers.org, Cursor Directory, Chrome Web Store): login-gated; punch list below.

## Enforcement

- pseo-site/scripts/verify-claims.ts (prebuild): bans stale tokens (369, 4,800-as-orgs, 350++, thousands-of, 400+ once strengthened).
- pseo-site/scripts/verify-no-regressions.ts (prebuild): pins canonical blocks ("350+ venture-backed startups", not 369/~400; strengthen to also ban "400+").

## External directory punch list (login-gated)

1. Glama (glama.ai): live description was stale "20 sectors"; re-crawl after repo push.
2. mcpservers.org: manual form, bot-gated.
3. Cursor Directory: Vercel Security Checkpoint 403.
4. Chrome Web Store: developer dashboard (Google OAuth).
5. npm published README: token 401; re-login then publish.
