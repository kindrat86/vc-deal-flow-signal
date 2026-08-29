# Show HN draft (Maryan-only posting)

**Title:** Show HN: Open-source GitHub momentum signal for startup investors

**URL:** https://github.com/kindrat86/gitdealflow-signal-engine?utm_source=hackernews&utm_medium=community&utm_campaign=gdf-launch-2026-09&utm_content=show-hn

**Text:**

I built an open-source reference implementation of the GitHub engineering-momentum signal behind GitDealFlow.

It measures three public signals for any GitHub organization:

- commit velocity over the latest 14 days versus the previous 14
- contributor growth over 30 days
- new repository creation over 30 days

The computation is MIT-licensed. You can run it on your own watchlist with your own GitHub token and compute. The live product tracks 350+ startup organizations across 15 sectors and sends five names every Sunday, but the engine itself stays open.

I also published the research context: 219 startup-period observations across 55 startups. That release is descriptive and has no linked funding-event labels. Separately, the documented examples show the acceleration pattern 21 to 47 days before public fundraise announcements. It is a sourcing signal, not a financing prediction and not investment advice.

The goal is to make the method falsifiable instead of asking anyone to trust a proprietary score. The repo includes the formula, tests, caveats, and links to the public methodology and data.

Things I would especially value feedback on:

1. Are the three input signals the right minimum useful set?
2. Which bot or generated-commit patterns should be filtered next?
3. What would make the output useful in a real sourcing workflow without turning it into a noisy database?

Repo: https://github.com/kindrat86/gitdealflow-signal-engine
Methodology: https://signals.gitdealflow.com/methodology
Free book: https://signals.gitdealflow.com/book
Public prediction ledger: https://signals.gitdealflow.com/predicted

I will be here to answer technical and methodology questions.
