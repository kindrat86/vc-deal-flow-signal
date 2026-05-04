# Daily Briefing — 2026-05-04

## Headline event
**Second Chrome extension shipped: VC GitHub Lookup — Startup Signals on Hover.** Companion to the existing Crunchbase + Wellfound badge. Hover any GitHub repo or org link → instant signal tooltip; chip injected on direct repo/org page loads; toolbar manual-lookup popup. Manifest V3, ~16 KB, no telemetry. Install: https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm

## Already shipped autonomously today
- Apex landing (gitdealflow.com): JSON-LD `sameAs` extended; SoftwareApplication featureList updated; pricing-card bonus pivoted from one→two extensions; §11 hero rebuilt as side-by-side dual-extension card; chrome.html now lists both extensions with separate JSON-LD nodes and refreshed body copy
- pSEO (signals.gitdealflow.com): Footer + CTABanner show both extensions; /integrations gains a new card for the GitHub-lookup extension; /citations and /about JSON-LD `sameAs` extended; /llms.txt and /llms-full.txt refreshed with both entries; /changelog gets a 2026-05-04 entry and corrects the prior Apr-17 entry (Crunchbase + Wellfound, not the stale tri-domain claim)
- All `marketing/launch-posts/*` drafts updated: PH listing, IH-products listing, IH long-form, PH long-form, Reddit /r/startups, Reddit /r/venturecapital, Reddit /r/SideProject, directory-startupbuffer
- Memory updated with the new Chrome extension reference

## Manual posting blocks (USER ACTION — Claude drafts only per division-of-labor)

> All channels below are user-posted per memory rules (no LinkedIn/Reddit/HN automation; HN must stay rough and user-rewritten). Drafts ready to copy-paste.

### Twitter / X — single tweet ✅ POSTED 2026-05-04 ~14:30 EEST from @data_nerd

> Shipped variant: hook-first / single branded URL / 169 raw / 162 weighted. Replaced the original 369-raw / 272-weighted draft after Twitter composer red-highlighted the long Chrome Web Store URL. Style codified as durable rule in memory `feedback_tweet_style_short_branded.md`.

```
GitHub is now a deal-flow surface.

Hover any repo → commit velocity, contributor growth, signal type. Free Chrome extension, no account.

https://gitdealflow.com/chrome
```
*169 raw / 162 weighted (well under 280-char @data_nerd non-Premium cap)*

Posted permalink: TBD — paste back into project_daily_marketing_log.md when captured.

### Reddit — r/SideProject (manual post)
**Title:** Built a Chrome extension that turns GitHub itself into a deal-flow surface
```
Hover any github.com/<owner> or github.com/<owner>/<repo> link and a tooltip surfaces commit velocity (14d), velocity change vs prior period, contributor count and growth, signal type, and a stage estimate.

A chip is also injected on direct repo and org page loads so the data is always one glance away. The toolbar opens a manual lookup form for any GitHub URL.

Manifest V3, ~16 KB, no analytics, no account, no host-page content collection. Only the owner slug is sent to the public signals API; responses cached in session storage for ≤5 min.

Companion to my earlier extension that overlays the same signal on Crunchbase and Wellfound profiles. Install both for the complete loop.

GitHub Lookup: https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm
Crunchbase/Wellfound badge: https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn

Built solo, six months in. Public dataset, public methodology (SSRN preprint).
```

### Indie Hackers — Build-in-Public milestone (manual post)
**Title:** Shipped extension #2 — turning GitHub itself into a deal-flow surface
```
Two months ago I shipped a Chrome extension that overlays an engineering-acceleration badge onto Crunchbase and Wellfound startup profiles. Today I shipped its companion: VC GitHub Lookup.

Hover any GitHub repo or org link → tooltip with commit velocity (14d), velocity change, contributor count and growth, signal type, and stage estimate. Chip on direct repo or org page loads. Toolbar manual lookup for any GitHub URL.

The thesis: investors should see the engineering signal where the engineering itself is happening, not just on Crunchbase. Two surfaces, same dataset, complete loop.

Install: https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm

Manifest V3, ~16 KB, no analytics. Only the owner slug hits the public API; responses cached in session storage for 5 min so the API stays friendly. Free in perpetuity.

Anyone using GitHub-side signals in their workflow? What would make this more useful?
```

### Hacker News — Show HN (USER MUST REWRITE per rough-edit rule)
**Title (one of):**
- `Show HN: Hover any GitHub repo for VC-grade engineering signals`
- `Show HN: A Chrome extension that turns GitHub into a deal-flow surface`
**Body — DELIBERATELY ROUGH (rewrite before posting per Apr 22 mod flag rule):**
```
this is a free chrome extension. hover any github repo or org link, see commit velocity over the last 14d, velocity change vs prior period, contributor count and growth, signal type, stage estimate. chip on direct visits. toolbar popup if you want to type an org name in.

manifest v3, 16kb, no analytics, no account. only thing it sends is the owner slug. responses cached 5 min in session storage.

uses signals.gitdealflow.com which i've been building for 6 months — public dataset, methodology on ssrn (abstract 6606558).

companion to my earlier extension that does the same thing on crunchbase and wellfound profiles. two surfaces, same data.

install: chromewebstore.google.com/detail/plgngijmloeljfkenecdkhiblcfcbblm

honest feedback wanted on whether the hover is too aggressive (fires on every github.com link in the page), too subtle, or right.
```

### LinkedIn (company page only — USER POSTS via LinkedIn UI)
```
Two surfaces, same signal — engineering acceleration meets you where you research.

We just shipped our second free Chrome extension: VC GitHub Lookup. Hover any GitHub repo or org and see commit velocity, contributor growth, signal type, and a stage estimate. Chip on direct visits. Toolbar manual lookup popup.

It's the companion to our existing Crunchbase + Wellfound profile badge — together they form the complete loop. The signal where you do deal research, AND the signal where the engineering itself originates.

Free in perpetuity. Manifest V3, ~16 KB, no analytics, no account.

Install: https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm

Existing extension (Crunchbase + Wellfound): https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn
```

## Notes / guardrails
- Per memory `feedback_no_linkedin_no_reddit_automation`, Claude drafts only — user posts manually on Reddit / LinkedIn / HN / IH.
- Per memory `feedback_hn_manual_posting`, the HN draft above is intentionally rough; rewrite before posting (Apr 22 mod flagged polished bodies).
- Per memory `feedback_target_conversations_not_people`, before any HN/Reddit post, run a 30-sec scan of the front page to ensure the audience matches; if not, defer.
- The LinkedIn post is for the company page (per memory `feedback_linkedin_undecided`), not personal profile.
