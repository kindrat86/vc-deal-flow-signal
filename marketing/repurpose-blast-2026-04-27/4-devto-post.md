# Variant 4 — dev.to Short Post (DRAFT)

**Title:** API security has a quiet leader: Akto's GitHub just spiked +75%

**Tags:** opensource, security, devtools, venture

---

As a developer who also writes angel checks, I spend a lot of time thinking about where to find early-stage companies before the hype cycle starts. Press releases are too late. Crunchbase is too late. LinkedIn activity is too late.

GitHub activity is not too late.

This week, [Akto](https://www.akto.io) — the open-source API security testing platform, Y Combinator W22 — registered a +75% commit velocity change. 267 commits over 14 days. 53 distinct contributors active.

## What the signal actually means

In our system, the signal type is "Framework migration." That is not just descriptive — it is a classification based on the nature of the commits. Are they fixing bugs, adding small features, or overhauling the core?

Framework migration commits look like:

- Core modules being restructured rather than extended
- Build pipelines and runtime targets being changed
- Config and data schemas being versioned and migrated
- Deep dependency upgrades that ripple across the codebase

Growth-stage startups do not do this casually. Refactoring the core costs engineering time, focus, and usually carries a clear reason — a new product surface that the old core could not support, an enterprise tier with different runtime requirements, or preparation for a fundraising demo where the bar is higher.

## Why Akto specifically

API security is in a rare market window. Salt Security raised more than $300M and has been working through layoffs and exec turnover. Noname Security was acquired by Akamai in 2024 for around $500M. Wallarm is enterprise-only. The developer-first, open-source slot in API security is open and largely uncontested.

Akto entered as the OSS testing platform — REST, GraphQL, gRPC out of the box, self-hostable, with a clean API surface. The GitHub traction has been real: tens of thousands of stars, an active contributor base, regular releases.

The +75% velocity change this week, with the framework-migration signal type, suggests Akto is preparing to ship something significant on top of a freshly rebuilt core.

## How to spot this yourself

The methodology is straightforward, even if building it requires work:

1. Track GitHub orgs for startups in your target sectors
2. Compute 14-day rolling commit velocity per org
3. Compare against trailing 90-day baseline velocity
4. Flag anything above a threshold (we use >50% as a "moderate signal" and >200% as "strong")
5. Layer signal-type classification on top — bug fixes, feature work, framework migration, or infrastructure buildout

The hard part is not the math. It is maintaining a quality list of startups to track, and filtering noise from large OSS foundations, research orgs, and consulting shops.

We built [GitDealFlow](https://signals.gitdealflow.com/predict) to do this automatically across 4,200+ startup GitHub orgs. But even a spreadsheet with 50 companies and a weekly GitHub API pull will give you signal that most investors do not have.

The Akto spike this week is a clean example of why this matters. Three to six weeks from now, you will probably read about a new enterprise launch or a Series B in your inbox. Or you can be watching the GitHub signal right now.
