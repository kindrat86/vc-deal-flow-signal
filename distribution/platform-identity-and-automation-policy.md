# GitDealFlow identity and platform-write policy

**Purpose:** one source of truth for public identity, account use, and what automation is allowed.

## Canonical public identity

| Field | Canonical value | Use it for |
|---|---|---|
| Product name | GitDealFlow | Brand and company-page name |
| Research and data product | VC Deal Flow Signal | Dataset, methodology, citations, MCP, A2A, and public research |
| Public author byline | The Data Nerd | Pseudonymous research and long-form writing |
| Website | https://gitdealflow.com | Public marketing link |
| Data and API site | https://signals.gitdealflow.com | Data, API, methodology, and citations |
| Public email | signals@gitdealflow.com | Product contact |
| Telegram channel | https://t.me/gitdealflow | GitDealFlow channel only |
| X handle | @Sipiteno | Existing account used for the pseudonymous research voice |
| LinkedIn | GitDealFlow company page only | Legitimacy artifact, never a personal-profile outlet |

## Names that are not product identities

| Name or handle | Rule |
|---|---|
| @MaryanK499484 | Personal account. Never publish GitDealFlow content from it. |
| u/Worth_Wealth_6811 | Community participation account. Disclose ownership before any GitDealFlow link. Do not call it GitDealFlow or The Data Nerd. |
| SipitenoMK | Hacker News account. No posts, comments, warm-ups, appeals, or automation until a new item is visibly live (`dead:false`) and Maryan explicitly approves the write. |
| VC Deal Flow Signal | Product descriptor, not a second company or unrelated brand. Pair it with GitDealFlow on first mention where clarity helps. |
| The Data Nerd | Pseudonymous author byline, not a separate company or customer-facing support identity. |

## Required first mention

Use one of these forms in a public profile, bio, byline, or post that has room:

- **GitDealFlow, the VC Deal Flow Signal research dataset**
- **VC Deal Flow Signal by GitDealFlow**
- **The Data Nerd, writing for GitDealFlow's VC Deal Flow Signal**

Do not use more than one brand name in a headline unless the platform needs a byline.

## Platform write policy

| Platform | Automation status | Write rule |
|---|---|---|
| Hacker News | Prohibited | No automated or agent-authored post, comment, warm-up, appeal, or submission. No write unless Maryan explicitly approves after live-item recovery evidence. |
| Reddit | Guarded | Allowed only through the allowlisted pacing system. Max four actions daily, seven days between promotional posts, no r/SaaS, ownership disclosure before a GitDealFlow link. Stop on CAPTCHA, rate limit, or removal. |
| X | Guarded | Use @Sipiteno only. Reply-first through 2026-09-18. No personal account writes. Measure replies that earn a response, follow, repost, or click. |
| LinkedIn | Human-approved only | Company page only. Every post requires explicit approval. Never DM or post from a personal profile. |
| Telegram | Guarded | GitDealFlow channel only. The bot must be an admin. Publish useful weekly data, not cross-posted sales copy. |
| Indie Hackers, HackerNoon, Quora, forums | Human-gated | Drafting and reading are allowed. Publishing requires the platform session, current rules, and explicit approval when the surface has a moderation or identity risk. |
| Stack Overflow | Prohibited | No product, dataset, or promotional posts. |

## Before every public write

1. Use an existing account. Do not create a new one for distribution.
2. Read the current platform rules and current account state.
3. Verify the live data, methodology, and final UTM link return HTTP 200.
4. Run `~/.local/bin/python3.11 ~/.hermes/scripts/gdf_claims_guard.py <draft-path>`.
5. Give useful data or method first. Disclose ownership before linking GitDealFlow.
6. Stop at CAPTCHA, rate limit, login wall, moderation block, or unclear rule. Do not retry-spam.
7. Record the live URL, post ID, logged-out visibility, UTM, replies, qualified visits, subscribers, demos, and revenue.

## Account-health gates

- HN health is item-level survival, not karma or profile rendering.
- Reddit health is logged-in profile visibility plus anonymous post visibility. Anonymous profile 404 alone proves nothing.
- A 403 from an API is a failed measurement source, not a negative platform-health signal. Pause the failing job until credentials or property permissions are repaired.
- One browser session per platform. Do not reuse sessions across accounts.
- Current state: X and Reddit use separate Safari windows, which prevents tab collisions but does not separate Safari cookies. The named Chrome profile is the only true browser-profile boundary. Do not claim profile isolation for Safari until the user has created and logged into separate Safari profiles.
- The machine-readable registry is `distribution/platform-session-registry.json`. Validate it with `~/.local/bin/python3.11 tools/verify_platform_session_registry.py` before changing an automated platform session.

## Ownership

This document is the canonical source for GitDealFlow identity and platform-write rules. The community posting checklist and platform-session registry should be followed alongside it.
