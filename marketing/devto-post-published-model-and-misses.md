# We published our fundraising-prediction model and its misses. Here's what 219 rounds taught us.

{ cover: https://signals.gitdealflow.com/opengraph-image }

Most funding-prediction content is survivorship theater: the hits get screenshots, the misses get deleted. We did the opposite - we published the methodology, the dataset, and the prediction ledger including a 0-for-10 first cohort - because a signal you can't audit is just marketing.

This is the short version of what 219 funding rounds taught us about predicting Series A announcements from public GitHub data. The full paper is on SSRN; the dataset is on Zenodo under CC BY 4.0; links at the end.

## The signal, in one paragraph

We track public GitHub engineering activity across 350+ startup organizations. Four patterns repeatedly showed up in the weeks before a Series A announcement:

1. **Commit-velocity jumps** - a 50%+ increase in commits per day across the org's most active repos
2. **Contributor growth** - 30%+ new unique committers in a two-week window (engineering hires being onboarded)
3. **Infrastructure commits** - Dockerfiles, Kubernetes manifests, CI configs, monitoring: the "we're about to scale" tells
4. **Repo-creation bursts** - 3+ new public repos in 30 days, usually the codebase splitting for launch

Individually, each is noisy. Combined - and this is the part the paper actually contributes - they formed a composite that preceded public Series A announcements by **21 to 47 days** across our 219-round panel, with a 3.4x lift versus announcement-cycle data sources.

## The part nobody publishes: the misses

Our first live prediction cohort went **0 for 10**. Every name our model flagged in that window either didn't raise, raised later than predicted, or raised without any observable GitHub pattern at all.

We published that ledger anyway, for three reasons:

- **Survivorship bias is the default state of this genre.** If a tool shows you only wins, you're looking at marketing, not measurement.
- **The misses are diagnostic.** Two of the ten misses were teams doing infrastructure work in *private* repos - the signal physically cannot see them. That's a coverage boundary, not a model bug, and knowing the boundary matters more than knowing the hit rate.
- **Pre-registration keeps us honest.** The ledger is written down before outcomes exist. Anyone can check whether this quarter's calls were right.

## What the data can't do (the honest list)

- See private repos. A large fraction of serious pre-raise work never touches public GitHub.
- Distinguish fundraise prep from launches, migrations, or open-source pushes. Acceleration is a fact; its *cause* is a hypothesis.
- Replace announcement-cycle databases. Crunchbase and PitchBook record what happened. This is a different instrument pointed at a different moment - leading, not lagging.
- Work outside technical startups. If a company's product isn't code, there's no signal to read.

## Why open?

The full methodology - cleaning protocol, bot-contamination filters, survivorship handling, the scoring function - is public. The dataset (219 startup-period observations, CC BY 4.0) is downloadable. The signal engine is MIT-licensed on GitHub. If you think the numbers are wrong, you can re-derive them, which is the only kind of claim about the future worth taking seriously.

## Links

- Preprint (SSRN): https://ssrn.com/abstract=6606558
- Dataset (Zenodo, CC BY 4.0): https://doi.org/10.5281/zenodo.19650920
- Methodology: https://signals.gitdealflow.com/methodology
- Open-source signal engine: https://github.com/kindrat86/gitdealflow-signal-engine
- Live public dashboard: https://signals.gitdealflow.com

Questions, methodological attacks, and replication attempts all welcome in the comments.

---

*Disclosure: I build VC Deal Flow Signal, a tool built on this dataset. The research is free and open; the tool is the business.*
