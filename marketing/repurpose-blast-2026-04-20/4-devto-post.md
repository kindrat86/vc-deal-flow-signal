# Variant 4 — dev.to Short Post (DRAFT)

**Title:** GitHub commit velocity as a VC signal: Infisical just spiked +1496%

**Tags:** opensource, security, devtools, venture

---

As a developer who also writes angel checks, I spend a lot of time thinking about how to find early-stage companies before the hype cycle starts. Press releases are too late. Crunchbase is too late. LinkedIn activity is too late.

GitHub activity is not too late.

This week, [Infisical](https://www.infisical.com) — the open-source secrets management platform — showed up in our monitoring with a +1496% spike in commit velocity. That's 399 commits across 14 days from 100 distinct contributors.

## What the signal actually means

In our system, the signal type is "Infrastructure buildout." That's not just a description — it's a classification that comes from analyzing the nature of the commits: are they fixing bugs, adding features, or laying new architectural foundations?

Infrastructure buildout commits look like:
- New service directories appearing
- Dependency upgrades that cascade through the codebase
- Configuration management getting overhauled
- New integration targets being scaffolded

When a post-seed startup does this at scale, it means they are preparing to support significantly more load, more enterprise customers, or a significantly expanded product surface.

## Why Infisical specifically

The secrets management market is in a rare inflection point. HashiCorp Vault (the dominant player) was acquired by IBM/Broadcom, which triggered restlessness across its enterprise customer base. Doppler, the VC-backed alternative, raised $20M in 2021 and has not made much noise since.

Infisical entered as the open-source, developer-first alternative with self-hosting options and a clean API. The GitHub traction has been real — tens of thousands of stars, active community, regular releases.

The +1496% velocity spike this week suggests they are getting ready to ship something significant.

## How to spot this yourself

The methodology is straightforward, even if building it requires work:

1. Track GitHub orgs for startups in your target sectors
2. Compute 14-day rolling commit velocity per org
3. Compare against trailing 90-day baseline velocity
4. Flag anything above a threshold (we use >200% as a "strong signal" threshold)
5. Layer signal type classification on top

The hard part is not the math — it's maintaining a quality list of startups to track and filtering noise (large OSS foundations, research orgs, consulting shops).

We built [GitDealFlow](https://signals.gitdealflow.com/predict) to do this automatically for 4,200+ startup GitHub orgs. But even a spreadsheet with 50 companies and a weekly GitHub API pull will give you signal that most investors don't have.

The Infisical spike this week is the clearest example of why this matters. Three to six weeks from now, you'll probably read about their Series A in your inbox. Or you could be watching the GitHub signal right now.
