# GitDealFlow LinkedIn Company Page: 100 Followers in 14 Days Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `linkedin-company-page-operations` and `macos-browser-driving`. Follow this plan task-by-task. Every public write must be from the GitDealFlow company page, never Maryan's personal profile.

**Goal:** Attempt to grow the GitDealFlow LinkedIn company page from 12 to 100 followers in 14 days through company-page-only content, company-page engagement, and owned-channel promotion.

**Architecture:** First repair the page's public positioning and its live claim drift. Then run a measured 14-day content experiment based on native document posts, practical investor education, and page-only conversation participation. Log a daily baseline so the work is judged by followers, qualified clicks, and discussions, not activity volume.

**Tech Stack:** LinkedIn company page admin, Safari, AppleScript page reads, GitDealFlow public sites, PostHog, local Markdown log files.

**Spec:** This document. Source evidence was captured from LinkedIn on 2026-08-21, 23:30 EEST.

## Global Constraints

- Operate only `https://www.linkedin.com/company/113165009/` as the GitDealFlow company page.
- Never post, comment, message, follow, or invite anyone from Maryan's personal LinkedIn profile.
- Do not use the page's 50 invitation credits. They invite Maryan's connections and are expressly out of scope.
- No paid boosts or LinkedIn ads. Organic posts first.
- No cold DMs, connection requests, scraped audience lists, fake engagement, engagement pods, or automated follows.
- Verify the company identity before every company-page write. New posts must show the company avatar and `VC Deal Flow Signal / Post to Anyone`. Replies must explicitly switch to the company identity and save the selection.
- Use only locked claims from `AGENTS.md` and `CLAIMS-LEDGER.md`: `350+ startups` or `350+ orgs`, `15 sectors`, and `219 startup-period observations across 55 venture-backed startups over five quarters`.
- Never call the 219 observations funding events, a prediction result, lift, precision, or a lead-time outcome.
- Do not state `411`, `400+`, `369`, `4,200+`, or any exact current panel count in LinkedIn copy.
- Do not imply a GitHub signal proves an imminent fundraise or replaces diligence. State that it is a research input.
- No URL in the body of a LinkedIn post. Use a UTM-tagged link in the first company-page comment only when it serves the post.
- Use plain English, no emoji in automated Safari paste paths, no em dash, and no invented customer, revenue, performance, or employee claims.
- Run `~/.local/bin/python3.11 ~/.hermes/scripts/gdf_claims_guard.py <draft-path>` before each public post.
- Before reporting a write as complete, read the public rendered post and confirm author, final copy, intended attachment, timestamp, and URL.

---

# Audit Baseline

## Page and funnel baseline

| Metric | Value | Window | Meaning |
|---|---:|---|---|
| Total company-page followers | 12 | Live on 2026-08-21 | Starting point |
| Followers needed | 88 | 14 days | Required net new followers |
| Required pace | 6.29/day | 14 days | Very aggressive organic pace |
| New organic followers | 8 | Jul 21 to Aug 19 | Recent growth, no sponsored followers |
| New followers | 0 | Last 7 days dashboard | Current momentum is stalled |
| Search appearances | 12 | Aug 13 to Aug 19 | Discovery exists but is very small |
| Page views | 9 | Jul 21 to Aug 19 | Profile conversion is weak |
| Unique page visitors | 7 | Jul 21 to Aug 19 | Small sample |
| Custom button clicks | 0 | Jul 21 to Aug 19 | No CTA conversion |
| Content impressions | 300 | Jul 21 to Aug 19 | Organic only |
| Reactions | 4 | Jul 21 to Aug 19 | Organic only |
| Comments | 2 | Jul 21 to Aug 19 | Organic only |
| Reposts | 0 | Jul 21 to Aug 19 | No amplification yet |

## Content table audit

LinkedIn's two-page content table lists 12 posts, 220 listed impressions, 29 clicks, 3 listed reactions, and 2 comments. The 30-day headline reports 300 impressions and 4 reactions, so use LinkedIn's 30-day headline as the official account total and use the table for post ranking.

| Rank | Post | Date | Format | Impressions | Clicks | Reactions | Comments | Read |
|---:|---|---|---|---:|---:|---:|---:|---|
| 1 | Best PitchBook Alternatives for Startup Signals | Aug 17 | Article | 80 | 3 | 2 | 2 | Best proof that a buyer-intent comparison can create discussion. Feature this after claim and link review. |
| 2 | AI & Machine Learning Startups Heating Up | Aug 19 | Article | 36 | 2 | 0 | 0 | Sector framing outperformed generic product links. |
| 3 | Weekly signal report | Aug 19 | Article | 29 | 0 | 0 | 0 | Data-heavy, but no interaction or clicks. Contains banned exact `411`; repair before more amplification. |
| 4 | Commit cadence tells you more than a pitch deck | Aug 18 | Document | 13 | 1 | 0 | 0 | Native document got interaction but needs a clearer first-slide hook. |
| 5 | GitHub activity is not a funding oracle | Aug 20 | Document | 11 | 12 | 1 | 0 | Strongest click intent. The 109.09% CTR is a tiny-base artifact, not a scalable result. Reuse the skeptical, honest framing. |
| 6 | Hiring pages are the most gamed signal | Aug 11 | Document | 8 | 3 | 0 | 0 | Strong practical angle but low reach. Test with a better title slide. |
| 7 | Best Crunchbase Alternatives for VC Deal Flow | Aug 10 | Article | 8 | 3 | 0 | 0 | Buyer-intent topic deserves a document version. |
| 8 | GitHub Momentum Checker | Aug 13 | Article | 7 | 1 | 0 | 0 | Tool alone did not earn distribution. |
| 9 | Velocity Verdict Cheat Sheet | Aug 12 | Article | 7 | 1 | 0 | 0 | Needs native visual proof, not an outbound article card. |
| 10 | Free Open Datasets, Aug 20 | Article | 3 | 0 | 0 | 0 | Generic link card failed. |
| 11 | Free Open Datasets, Aug 21 | Article | 3 | 0 | 0 | 0 | Repeat link-card format failed again. |
| 12 | Backtest your last three angel checks | Article | 3 | 0 | 0 | 0 | Too early to judge, but it repeats the weak outbound-link pattern. |

## Audience quality read

- Followers are geographically scattered. No location has more than two followers.
- The visible follower mix includes founders, developers, operators, community builders, and unrelated small-business profiles. It is not yet a concentrated angel, scout, or seed-fund audience.
- Visitor job functions are overwhelmingly business development in this tiny sample. This is not the target audience, so raw follower count cannot be treated as buyer growth.
- One visitor is from G2. This is a useful weak signal of category research, not a lead.
- LinkedIn reports no searchable keyword pattern yet. The name, tagline, About section, and featured item need clearer buyer language.

## Page positioning audit

Current page fields were read from LinkedIn Edit Page:

- Name: `VC Deal Flow Signal`
- Public URL: `linkedin.com/company/gitdealflow`
- Tagline: `Private signal desk for angel-stage GitHub breakouts. Five names every Sunday - no code reading required.`
- CTA: `View website` to `https://gitdealflow.com/report`, verified HTTP 200.
- About section includes unsupported `100M+ GitHub repos`, deterministic breakout wording, and stale offer/pricing language. It must be replaced before more amplification.

## Honest goal assessment

100 followers in 14 days means 88 net new followers, or 6.29 per day. That is 11 times the page's last-30-day growth of eight followers, compressed into two weeks. It is possible only if one or more posts reach people beyond the current audience and turn those viewers into follows. Posting more link cards will not do it.

The sprint is worth running because it creates a clean organic evidence base. Do not claim the target is on track without the daily follower ledger.

---

# Execution Tasks

### Task 1: Make the profile credible before increasing reach

**Files:**
- Modify: `distribution/linkedin-100-followers-sprint/daily-metrics.csv`
- Create: `distribution/linkedin-100-followers-sprint/page-copy.md`
- Read: `AGENTS.md`, `CLAIMS-LEDGER.md`, `distribution/platform-identity-and-automation-policy.md`

**Produces:** A claim-safe profile, stable CTA, and baseline row for every later decision.

- [ ] Create `distribution/linkedin-100-followers-sprint/`.
- [ ] Record the starting baseline: 12 followers, 300 30-day impressions, four reactions, two comments, zero reposts, nine page views, seven unique visitors, zero CTA clicks, and 12 search appearances.
- [ ] Save this exact replacement tagline in `page-copy.md` and verify it is at most 120 characters before entering it:

```text
GitDealFlow, the VC Deal Flow Signal: public GitHub momentum for angels, scouts and seed investors.
```

- [ ] Save this exact replacement About section in `page-copy.md`:

```text
GitDealFlow, the VC Deal Flow Signal, is a public research and data product for angels, scouts and seed investors.

We track public GitHub engineering activity across 350+ startup orgs in 15 sectors: commit velocity, contributor growth and repository expansion.

Our research release covers 219 startup-period observations across 55 venture-backed startups over five quarters. It is a research input, not a funding forecast or investment recommendation.

Use the public data, methodology and weekly report to investigate engineering momentum alongside your own diligence.
```

- [ ] In the company page editor, change only the tagline and About section. Keep the existing website CTA URL because `https://gitdealflow.com/report` returned HTTP 200.
- [ ] Confirm the edited values persist after a full page reload.
- [ ] Open View as member and verify the public page shows no personal profile as author, owner, post author, or call-to-action identity.
- [ ] Check whether the page has a banner. If absent or unreadable, prepare a 1128x191 banner with only this claim-safe copy:

```text
GitDealFlow
Public GitHub momentum for angels, scouts and seed investors
350+ startup orgs. 15 sectors. Updated weekly.
```

- [ ] Upload the banner only after confirming all copy and dimensions. Re-open View as member and visually verify it renders cleanly on desktop.

### Task 2: Repair live claim drift and feature the proven post

**Files:**
- Create: `distribution/linkedin-100-followers-sprint/content-inventory.md`
- Modify: `distribution/linkedin-100-followers-sprint/daily-metrics.csv`
- Read: `CLAIMS-LEDGER.md`

**Produces:** No company-page post contains the banned exact panel count, and the page showcases the only post with both reactions and comments.

- [ ] Inventory every published company post from the LinkedIn Content table. Record title, date, format, impressions, clicks, reactions, comments, reposts, follows, and claim-risk status.
- [ ] Open the Aug 19 weekly signal report. It says `411 startups across 15 sectors`, which violates the locked claim ledger.
- [ ] If LinkedIn permits a safe edit, replace only that sentence with:

```text
Weekly signal report: public GitHub activity across 350+ startup orgs in 15 sectors.
```

- [ ] If LinkedIn does not permit the safe edit, delete the post and record deletion plus its old 29 impressions in `content-inventory.md`. Do not silently repost the same copy.
- [ ] Review all other posts for exact panel counts, funding-prediction language, unverified performance claims, stale pricing, and unsupported testimonial language. Do not bulk-delete good posts.
- [ ] Review `Best PitchBook Alternatives for Startup Signals`, the Aug 17 post with 80 impressions, two reactions, and two comments. Confirm the destination returns HTTP 200 and every claim passes the guard.
- [ ] Feature that post on the company Home tab. Re-open View as member and verify it is actually featured.

### Task 3: Produce eight native, claim-safe assets before scheduling

**Files:**
- Create: `distribution/linkedin-100-followers-sprint/drafts/day-01.md` through `day-14.md`
- Create: `distribution/linkedin-100-followers-sprint/assets/`
- Create: `distribution/linkedin-100-followers-sprint/utm-map.csv`
- Read: `AGENTS.md`, `CLAIMS-LEDGER.md`

**Produces:** Eight separate company-post assets, each useful without a click and each with a unique measurement URL when a link is needed.

- [ ] Use four native document carousels, two single-image data cards, one short native screen recording, and one text post. Do not create another bare external-link preview post.
- [ ] Build each document at 1080x1350 with a readable title slide, no dense tables, and a final slide that asks the reader to follow the company page for weekly public-data diligence notes.
- [ ] Use the following post queue. Do not reuse an exact opener.

| Day | Format | First line or title slide | Standalone value | CTA |
|---:|---|---|---|---|
| 1 | Document, 6 slides | `A 3,275% GitHub spike can mean almost nothing.` | Explain the small-base trap and the contributor-count cross-check. | Follow for the weekly public-data diligence note. |
| 3 | Single image plus text | `Before you call a GitHub spike a signal, ask these five questions.` | Give five falsifiable questions: baseline, contributors, new repos, release cadence, and external context. | Save this checklist. |
| 4 | Document, 7 slides | `What GitHub can tell an investor, and what it cannot.` | Contrast public engineering activity with fundraise timing, revenue, founder quality, and market fit. | Follow for the next method note. |
| 6 | Short native screen recording | `A 30-second public-data diligence pass.` | Show one reproducible signal lookup. Remove company-specific implications not confirmed by source data. | Link only in first company comment if the walkthrough needs it. |
| 8 | Document, 6 slides | `Why hiring pages are weaker than filled roles.` | Use the existing hiring-page lesson, rewritten with no outbound URL in body. | Follow for the engineering-side checklist. |
| 10 | Single image plus text | `The useful question is not: is this startup raising?` | Explain how to use public signals to choose what to investigate, not what to predict. | Ask one narrow, answerable question. |
| 12 | Document, 7 slides | `PitchBook, Crunchbase and GitHub answer different diligence questions.` | Make an honest workflow comparison. Do not imply replacement or superiority everywhere. | Follow for one applied example next week. |
| 14 | Text post plus a single source card | `What changed in the public GitHub surface this week?` | Publish one verified weekly observation with its caveat and the source date. | Follow for the next weekly source note. |

- [ ] For each day, write the post text, slide copy, image prompt or asset source, first company-page comment, UTM URL, source URL, claim-guard output, and a 10-word post-verification snippet.
- [ ] Use the UTM convention below only when a linked source is necessary. Do not put this URL in the post body.

```text
https://gitdealflow.com/report?utm_source=linkedin&utm_medium=organic&utm_campaign=linkedin_100_followers&utm_content=day-XX&utm_id=linkedin-company-day-XX-202608
```

- [ ] Validate each destination URL with HTTP 200 before posting.
- [ ] Run the claims guard on each draft. If it fails, rewrite the claim. Do not weaken the guard.

### Task 4: Publish with a measured cadence and company-only identity

**Files:**
- Modify: `distribution/linkedin-100-followers-sprint/daily-metrics.csv`
- Modify: `distribution/linkedin-100-followers-sprint/content-inventory.md`
- Modify: `distribution/linkedin-100-followers-sprint/utm-map.csv`

**Produces:** Eight live company posts, each verified and logged.

- [ ] Schedule or publish only on the company page. Use 10:00 EEST on Tuesday, Wednesday, Thursday, and Sunday. If a scheduled-post option is unavailable, publish manually at the same time.
- [ ] Never publish more than one owned post in a 24-hour period.
- [ ] Before each write, confirm the new-post composer avatar URL contains `company-logo` and the audience control names VC Deal Flow Signal. If not, stop.
- [ ] Put the useful insight in the first three lines. No generic greeting, no link, and no unqualified prediction language above the fold.
- [ ] Post the supporting source link as the first comment only if the asset needs it. Confirm the comment identity is VC Deal Flow Signal before posting it.
- [ ] After posting, reload published posts and verify: correct company author, exact first-line snippet, attachment, company-comment identity if used, and public visibility.
- [ ] Record post URL, post ID, time, format, source URL, UTM, initial impressions, clicks, reactions, comments, reposts, follows, and any comment that merits a company-page response.
- [ ] Do not reply from Maryan's personal identity even when LinkedIn defaults the reply composer to it.

### Task 5: Build distribution through company-page participation only

**Files:**
- Create: `distribution/linkedin-100-followers-sprint/company-engagement-log.md`
- Modify: `distribution/linkedin-100-followers-sprint/daily-metrics.csv`

**Produces:** A small, relevant discovery loop without personal profile activity or spam.

- [ ] On each weekday, identify up to two current public posts from investor research, startup intelligence, open-data, developer-tool, or diligence pages that GitDealFlow already follows.
- [ ] Leave at most one company-page comment per day and at most five per week.
- [ ] A comment must add one of: a source-backed caveat, a practical due-diligence check, a public-data method, or a respectful counterexample. Do not add links unless the conversation specifically asks for the source.
- [ ] Do not comment on private individuals' posts where a company-page comment would look like unsolicited sales outreach.
- [ ] Do not comment `great post`, restate the post, force a question, pitch GitDealFlow, or use a company link as a reply.
- [ ] Before every reply, open the identity selector, choose VC Deal Flow Signal, click Save selection, and confirm the composer shows the company avatar. Stop if it does not.
- [ ] Log target page, target URL, comment text, company identity check, relevance reason, and observed response. Do not pursue or DM people who do not engage back.

### Task 6: Use owned surfaces to invite follows without touching personal connections

**Files:**
- Modify: weekly GitDealFlow digest source only if it is already scheduled for this period
- Modify: `distribution/linkedin-100-followers-sprint/owned-distribution-log.md`

**Produces:** One honest, measurable invitation from owned brand surfaces.

- [ ] Add one small line to the next existing GitDealFlow weekly digest: `Follow GitDealFlow on LinkedIn for public-data diligence notes between weekly reports.`
- [ ] Use the company-page URL with a unique digest UTM. Do not send a separate blast merely to ask for follows.
- [ ] Add the same follow link once to an existing GitDealFlow-owned website footer or appropriate social section only if that change can be deployed and live-verified in the same session.
- [ ] Do not use Maryan's personal account, personal email list, connection invitations, personal newsletters, or personal social accounts for this task.
- [ ] Record sends, recipients only as aggregate counts, landing visits, follows if visible, and no spend.

### Task 7: Run a daily scorecard and make a hard decision at Day 7

**Files:**
- Modify: `distribution/linkedin-100-followers-sprint/daily-metrics.csv`
- Create: `distribution/linkedin-100-followers-sprint/day-07-review.md`
- Create: `distribution/linkedin-100-followers-sprint/final-review.md`

**Produces:** A truthful verdict, not a vanity summary.

- [ ] At 18:00 EEST daily, capture: total followers, net new followers, search appearances, page views, unique visitors, custom button clicks, content impressions, reactions, comments, reposts, post clicks, follows attributed by LinkedIn, UTM sessions, UTM signup starts, UTM verified signups, and spend.
- [ ] Record which posts reached non-followers if LinkedIn exposes that breakout.
- [ ] Compare cumulative follower count with this exact target track: Day 3: 31, Day 7: 56, Day 10: 75, Day 14: 100.
- [ ] On Day 7, if the page is below 56 followers, state plainly that the 100-follower target is off pace. Do not compensate with paid boosting, personal invitations, personal posting, or spam.
- [ ] If a post has at least 50 impressions and no clicks, reactions, comments, reposts, or follows after 72 hours, do not repeat that format in the remaining queue.
- [ ] If a format earns comments or follows, make the next queued post a variation on that format, not a copy.
- [ ] On Day 14, report follower growth, follower quality, top posts, UTM visits, qualified actions, cost, and whether LinkedIn should remain an active organic channel.

## Verification Checklist

- [ ] Company page, never personal profile, authored every new post and comment.
- [ ] Zero invitation credits used.
- [ ] Zero paid boosts and zero ad spend.
- [ ] Existing `411` claim is edited or removed.
- [ ] Tagline and About section are claim-safe and persist after reload.
- [ ] Featured post is the verified 80-impression, two-reaction, two-comment post, after link and claim check.
- [ ] Every published post has a live company-author check and a saved URL.
- [ ] Every link used in comments has a unique UTM and returned HTTP 200 before publication.
- [ ] Daily scorecard contains real LinkedIn and PostHog values, not estimates.
- [ ] Final report distinguishes follower count from qualified investor interest.

## Expected Decision Rules

- **Continue:** At least 56 followers by Day 7 and at least one post with meaningful conversation or follows from outside the existing audience.
- **Refocus, not spend:** Strong impressions but weak follows means improve the public profile, title slides, and follow CTA.
- **Stop organic cadence expansion:** Fewer than 40 followers by Day 7 and no posts with comments, reposts, or follows. Keep only one weekly proof post while reallocating effort to the community and MCP channels with stronger measured visitor quality.
- **Never buy the number:** Do not use ads, invitation credits, personal network activity, pods, follower vendors, or generic outreach to manufacture 100 followers.

## Resume Prompt

```text
Execute /Users/sipi/signals-gitdealflow/docs/superpowers/plans/2026-08-21-linkedin-company-100-followers-sprint.md autonomously. Use Safari and only the GitDealFlow LinkedIn company page, never Maryan's personal account. Start with Task 1, read AGENTS.md and CLAIMS-LEDGER.md, repair the unsupported LinkedIn About copy and the published `411 startups` post before publishing anything. Do not use invitation credits, personal connections, ads, DMs, or personal LinkedIn comments/posts. Verify every public change live and keep the daily scorecard in distribution/linkedin-100-followers-sprint/.
```
