# Substack Post #2 — Methodology Decomposition

**Publication**: gitdealflow.substack.com  
**Cadence target**: Sunday May 11, 2026 (one week after post #1)  
**Post #1 reference**: "Top 100 GitHub Signal Startups — Week of May 2026" (post_id 196326406)

**Why this post**: post #1 was the data drop. Post #2 is the methodology that earns trust and makes future drops citable. Pure evergreen reference content. Sets up the reader to subscribe for next week's data drop.

**SEO target**: "GitHub velocity score methodology", "how does GitHub deal flow signal work", "alternative data venture capital methodology"

---

## Title

How we surface GitHub breakouts: the velocity score, decomposed

## Subtitle / deck

Three components, one panel of 4,200 startups, and 47 days of average lead time over the fundraise announcement. Here is the formula, line by line.

## Body (paste verbatim into the Substack draft editor)

Last week we published the first weekly Top 100, ranking 91 startup organizations by GitHub engineering acceleration. The single question we got most often: what exactly is the score?

This is the methodology, decomposed. Three components, what each one measures, what it is good at, and what it misses. If you want the formal version it is in our SSRN paper at ssrn.com/abstract=6606558 and the panel itself is on Zenodo at zenodo.org/records/19650920 under CC BY 4.0.

### The signal in one paragraph

For each startup organization in our panel of 4,200, we compute three rolling time-series each week. Commit velocity (the rate of incremental work shipping into public repositories). Contributor delta (the count of distinct authors active in a window, and the change in that count). Repo expansion fingerprint (the rate at which new repositories appear under the org and how quickly they accumulate non-trivial activity). The composite score is the standardized sum of the three components, sector-normalized. Companies whose composite score crosses a sector-specific threshold appear on the weekly Top 100.

### Component 1: Commit velocity

Commit velocity is the most intuitive and the noisiest of the three. It tracks the count of commits across all public repos in the org per rolling 7-day window, with an exponential decay so recent activity dominates the score.

Why this matters: a doubling of commit velocity over 30 days is statistically rare. It almost always reflects either a hiring wave, a deadline-driven push toward a launch milestone, or both. In our panel both of those events tend to cluster within a few weeks of a fundraise announcement.

What this misses: refactor commits, mass renames, automated commits from bots. We filter mass-pattern commits and bot-authored commits (any account ending in -bot or marked as a GitHub App) but the residual noise is the price of a publicly-readable signal.

### Component 2: Contributor delta

Contributor delta is the cleanest of the three. It tracks the count of distinct human authors who have pushed a commit into public org repositories in a rolling 30-day window, plus the week-over-week change.

The reason we like contributor delta: hiring is the most reliable leading indicator for venture-funded companies. New engineering hires usually push their first public commit within 2 to 3 weeks of starting. A sharp jump in contributor count, especially when the new contributors are not all the same author cluster, is the strongest single predictor in our panel.

In the 219 confirmed fundraises in our analysis, 78 percent showed a contributor delta of +30 percent or higher in the 60 days preceding the announcement.

### Component 3: Repo expansion fingerprint

The third component picks up the structural side of engineering acceleration. It tracks new repository creation under the org plus how quickly each new repo accumulates non-trivial commits.

Why this is useful: a single new repo with one commit is meaningless. A new repo that goes from zero to twenty commits across three or more authors in two weeks usually means the org has spun up a new internal tool, a deploy pipeline, an observability stack, or an experimental product line. All of those are downstream effects of growth.

This component is the most sector-sensitive. Infrastructure companies create repos constantly as part of normal operations. AI/ML companies do it less often but more meaningfully. We sector-normalize before adding to the composite.

### How the three combine

Each component is z-scored within its sector cluster (we use 20 sector clusters derived from GitHub topic taxonomy, normalized weekly). The composite score is the sum of the three z-scores, with the contributor-delta component double-weighted. A startup appears on the Top 100 if its composite crosses a sector-specific threshold AND it has at least 90 days of public activity history (newer orgs are too noisy).

### What this signal does not catch

Three categories of company are systematically invisible to us. First, anyone using private repos exclusively, which is most pre-MVP teams. Second, anyone who ships through forks of public repos rather than under the org account. Third, non-technical founders whose engineering work is entirely contracted out and who do not maintain their own GitHub presence.

For technical startups with a public GitHub footprint, the signal is durable. The 47 days of median lead time over the fundraise announcement in our panel held across 19 of the 20 sector clusters and across both 2024 and 2025 cohorts.

### What is coming Sunday

This Sunday we publish Top 100 number 2. Same panel, fresh week of data. If you want the digest in your inbox without remembering to come back, the free subscription is one click. Methodology updates and any threshold changes will be published as their own post in this series, never silently rolled in.

Paper: ssrn.com/abstract=6606558  
Dataset: zenodo.org/records/19650920  
Free weekly digest: gitdealflow.com

---

## Posting checklist

- [ ] Open https://gitdealflow.substack.com/publish/post and start a new draft  
- [ ] Paste title + subtitle, then body verbatim  
- [ ] Format the four `### Component N:` lines as H3, the leading paragraph blocks stay as default text  
- [ ] Add the three URLs at the bottom as actual hyperlinks (Substack auto-detects; verify they render as buttons not bare text)  
- [ ] Cross-link to post #1 ("Last week we published the first weekly Top 100") with a real link to the post #1 URL  
- [ ] Schedule for Sunday May 10 EOD or Monday May 11 morning EEST (not Saturday — early-week reads beat weekend reads on Substack VC audience)  
- [ ] Notify the apex blog: add a 2-line "Read the methodology on Substack" callout under the existing Top-100 callout (per memory `feedback_substack_publication_now_live.md`, bidirectional cross-link is the validated pattern)  
- [ ] Re-ping IndexNow on the apex Top-100 page after the cross-link change  
- [ ] Capture the Substack post URL into MEMORY.md `feedback_substack_publication_now_live.md` as week-2 entry  
