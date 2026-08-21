# GitDealFlow Channel Board

**Updated:** 2026-08-21, EEST

| Channel | ICP | Access and policy | Last evidence | Next permitted action | Asset and tracked URL | 90-day result | Cost / CPQV | Status and decision |
|---|---|---|---|---|---|---:|---|---|
| Reddit | Investors and public-data users | `u/Worth_Wealth_6811`; max four actions/day; seven-day promotional spacing; never r/SaaS; ownership disclosure required | r/datasets post on 2026-08-19 is publicly visible and not filtered | No promotional post until claim-safe production verification and a fresh rules review | Claim-safe dataset lesson, unique `utm_source=reddit`, `utm_medium=community`, immutable placement ID | 328 people, 330 pageviews, 30 distribution landings, 0 signup verifies | Paid Reddit remains paused, prior audit: about €19.39 CPQV | **Hold.** Strongest earned reach, no verified signup result yet. |
| Email digest | Existing subscribers | Resend, unsubscribe requirements and Bcc rules apply | Digest links include immutable `utm_id=digest-<issue>-<content>` | Add share/archive only after production verification | Sunday issue, `utm_source=email`, `utm_medium=email`, `utm_campaign=signal-digest` | 206 people, 248 pageviews, 16 distribution landings, 0 signup verifies | No cash spend recorded | **Keep.** Owned channel with verified placement attribution. |
| MCP registries | Developer-investors and agent builders | Glama and HTTP MCP surfaces are public; account-side edits need authenticated access | Glama, MCP manifest, Agent Card, HTTP MCP endpoint and npm registry all returned HTTP 200 | Produce claim-safe proof asset, then refresh only already accessible listings | MCP install/query proof with one registry-specific placement ID | Not separated in current source rows | No cash spend recorded | **Hold until claim-safe deploy.** |
| GitHub | Developer-investors | Public repository live | GitHub repository returned HTTP 200 | Update README only after claim-safe source reaches production | README demo and UTM-tagged link | 26 people, 30 pageviews, 1 signup verify | No cash spend recorded | **Keep.** Low volume, one verified signup. |
| LinkedIn company page | Traditional investors | Company page only; personal LinkedIn prohibited; explicit approval required before posting | 27 people, 27 pageviews, 1 checkout start | No action without explicit approval | Company-page-only asset | 27 people, 27 pageviews, 0 signup verifies | No cash spend recorded | **Blocked by approval.** |
| X | Developer-investor conversations | No verified API backend; no personal DMs | `t.co` had 17 people and one signup verify; direct X source had 1 person in 28 days | Re-establish only a reply-first rhythm after claim-safe deploy | One tracked canonical link only where relevant | 17 people, 30 pageviews, 1 signup verify | No cash spend recorded | **Hold.** Low sample. |
| HN | Technical builders | Recovery gate not met; no submissions, comments, warm-up or appeals | No permitted activity | None | None | Not assessed | Not applicable | **Closed.** |
| Paid ads | Investors | Paid distribution paused | Prior audit found poor qualified-visitor economics | None without Maryan selecting a priced test after an earned signal | None | Not assessed in this run | Prior audit: about €19.39 CPQV | **Paused.** |

## Measurement notes

- Non-production browser test used `utm_source=reddit`, `utm_medium=community`, `utm_campaign=distribution-audit`, `utm_content=dataset-post`, `utm_id=reddit-datasets-20260821`.
- The exact event arrived once in PostHog as `distribution_landing` with host `127.0.0.1:4173`.
- The 90-day PostHog query was scoped to GitDealFlow host or sending domain. It still has a large direct bucket, so new external placements need explicit UTM and placement IDs.
- Any public placement stays blocked until canonical production surfaces no longer make unsupported research claims.
