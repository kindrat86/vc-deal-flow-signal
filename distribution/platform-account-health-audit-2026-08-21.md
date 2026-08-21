# GitDealFlow platform and account health, updated 2026-08-21

This scorecard uses live checks and currently enabled scheduler behavior. It does not treat a draft, a scheduled job, karma, or an internal document as reach.

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| Account trust and age | 45 | No active GitDealFlow job creates platform accounts, but most public accounts remain small and HN has no live items. | Build useful history on the existing Reddit and X accounts, without promotional volume. |
| Anti-ban pacing | 75 | Reddit now blocks non-allowlisted targets and blocks promotion until five helpful contributions exist. HN remains blocked. | Let useful, non-promotional participation earn the required Reddit contribution history. |
| Rate-limit handling | 80 | The rank and share-of-voice jobs were live-tested, scheduler-tested, and resumed with zero failure streak. | Monitor the next scheduled runs, then remove stale error references from the audit notes. |
| CAPTCHA and session hygiene | 75 | No solver is used. X and Reddit have separate Safari windows, but Safari cookie isolation is not yet real profile isolation. | Create and log into separate Safari profiles for X and Reddit. |
| Shadowban detection | 82 | HN Firebase is the final source of truth. Current result: 25 submitted items, 25 dead, 0 live. | Keep the HN write block until a newly created item is verified `dead:false`. |
| ToS compliance | 70 | No active cron writes to HN or LinkedIn. Reddit submissions have allowlist, pacing, participation, and content gates. | Keep every high-risk platform write paused unless its current policy permits it. |
| Platform policy risk | 68 | HN is blocked, the disallowed `r/angelinvestors` scheduled post is paused, and the remaining scheduled Reddit targets are allowlisted. | Do not resume an excluded community job without an explicit policy change. |
| Brand handle consistency | 65 | `https://gitdealflow.com/brand` is live and defines GitDealFlow, VC Deal Flow Signal, and The Data Nerd. | Link the canonical brand page from approved external profiles when their profile editors are available. |
| Content moderation history | 50 | The homepage no longer promises predictions or mislabels the research sample. The historical HN and Reddit moderation events remain. | Lead with limitations, public data, and one useful method, not product claims. |
| Appeal readiness | 80 | HN forensics and monitoring exist, but the account is still 0 of 25 live items. | Keep one clean appeal outcome on record and do not send a new appeal or submission. |

## Controls verified this session

- HN: all 25 `SipitenoMK` submitted items returned `dead:true` from Firebase.
- HN and LinkedIn: no active cron has a write path.
- Reddit: `r/SaaS` and unallowlisted communities are blocked. The `r/angelinvestors` scheduled job is paused.
- Reddit promotion: the participation gate currently reports 0 of 5 required helpful contributions, so promotion cannot run.
- Community draft preflight blocks stale panel counts, prediction promises, missing disclosure, missing caveats, and product links in no-promo drafts.
- Search Console rank and share-of-voice jobs were manually run, scheduler-run, and resumed. Both have `last_status: ok` and `failure_streak: 0`.
- The live GitDealFlow homepage now describes the research sample as `219 startup-period observations across 55 startups` and says it is evidence to investigate, not proof of a future round.

## Remaining human-only action

Create two Safari profiles and log in once:

1. GDF X: `@Sipiteno`
2. GDF Reddit: `u/Worth_Wealth_6811`

Until then, separate Safari windows lower collision risk but do not isolate cookies.
