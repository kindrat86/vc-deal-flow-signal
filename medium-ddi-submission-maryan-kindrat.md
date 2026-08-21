---
title: "What a Public GitHub Engineering-Velocity Dataset Can Show Investors, and What It Cannot"
subtitle: "A descriptive panel can sharpen questions in technical diligence. It cannot, on its own, forecast a financing event."
author: "Maryan Kindrat"
publication_target: "DataDrivenInvestor"
tags: ["Venture Capital", "Data", "GitHub", "Due Diligence", "Research"]
featured_image: "/Users/sipi/signals-gitdealflow/assets/ddi-github-velocity-clean-visual.svg"
---

# What a Public GitHub Engineering-Velocity Dataset Can Show Investors, and What It Cannot

*Public GitHub activity can make engineering work more legible. It cannot turn a descriptive dataset into a financing forecast.*

Investors often meet a startup after the story has already been compressed into a deck, a round announcement, and a handful of references. Public engineering work offers a different view: a timestamped record of commits, contributors, and repositories.

That record is useful. It is also easy to overstate.

A new public dataset, **A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups**, provides 219 startup-period observations from 55 venture-backed startups over five quarters, from Q2 2025 through Q2 2026.[1] It uses public GitHub engineering-velocity data and records four inputs: commit velocity, contributor count, new repositories, and a deterministic classification into four acceleration patterns.[1]

The dataset is published under CC BY 4.0 on Zenodo.[2] That makes it useful for investors, researchers, and operators who want to inspect the work rather than accept a black-box conclusion.

But the paper is descriptive. Its release has **no linked funding-event labels**.[1] That one sentence sets the boundary for every responsible use of the data.

## What the dataset can show

### 1. How public engineering activity changes over time

A one-day GitHub check is a snapshot. A panel adds sequence.

Each observation records commit velocity over a rolling 14-day window, unique-contributor count, and new-repository creation.[1] Those are not measures of company quality or investment readiness. They are observable facts about public engineering activity.

For an investor, the value is comparative. Instead of asking whether a team has “a lot” of activity, you can ask better questions:

- Is activity rising, flat, or falling relative to the team’s own prior periods?
- Is more of the visible work coming from more contributors, more commits, or newly public repositories?
- Is the change concentrated in one repository or spread across a team’s public work?

These questions are useful in early technical diligence because they make the evidence explicit. They do not settle the investment case.

### 2. Four distinct patterns deserve different follow-up questions

The paper classifies observations into four acceleration patterns: **framework migration, engineering hiring burst, infrastructure buildout, and deploy-frequency spike**.[1]

That distinction matters because a rise in activity is not one thing.

A framework migration may reflect maintenance work, a strategic rewrite, or a platform transition. An engineering hiring burst may prompt questions about team formation and onboarding. An infrastructure buildout may invite a closer look at reliability, scale, or a product change. A deploy-frequency spike can be a reason to ask what milestone is being shipped.

None of these labels tells an investor why the pattern occurred. They help an investor choose the next question. The GitHub record supplies an observable prompt. Founders, customers, architecture, market evidence, and references supply the explanation.

### 3. The data can support reproducible diligence workflows

The release uses public GitHub data and is available under CC BY 4.0.[1][2] That is important for scrutiny.

A reader can reproduce a basic workflow: inspect a startup’s public organization, compare commit velocity across consistent windows, count visible contributors, note new repositories, and document the result. The output is not an investment recommendation. It is an auditable starting point for a research memo.

This matters because technical diligence often fails in the opposite direction. A vague statement such as “the team is moving fast” is difficult to challenge. A dated set of public observations is easier to examine, qualify, and correct.

### 4. The panel can generate testable research questions

The strongest use of a descriptive dataset is often not the conclusion it supplies. It is the question it makes possible.

Researchers could join this panel to independently collected funding-event data, product-launch data, hiring data, or other outcomes. They could specify the matching rule, publish exclusions, and test whether a pattern generalizes by sector or stage.

That work would be different from this release. It would require outcome labels, a defined study design, and transparent treatment of selection effects. The present dataset is a foundation for that work, not evidence that it has already been completed.

## What the dataset cannot show

### It cannot prove that GitHub activity predicts fundraises

The release has no linked funding-event labels.[1] Therefore it cannot establish whether any observed GitHub pattern predicts a financing event.

A startup can accelerate public engineering work for many reasons: a launch, a migration, a reliability push, an open-source strategy, a new customer requirement, or a team’s normal cadence. Conversely, a company can raise with little public GitHub activity, especially if its work is private or not software-led.

A public activity pattern can be worth investigating. It is not proof of a future round.

### It cannot provide a fundraise lead time

A lead-time claim needs dated outcome events matched to dated signals. This release does not contain those linked event labels.[1]

Any claim about how many days or weeks GitHub activity appears before a financing announcement goes beyond what this dataset alone can support. That should be treated as a hypothesis for a separate, labeled study, not as a finding from this paper.

### It cannot convert public engineering output into a quality score

More commits are not automatically better. More contributors are not automatically a stronger team. More repositories are not automatically product progress.

Public GitHub data misses private repositories, non-code work, product decisions, customer traction, security practices, founder judgment, and the context behind a change. It also reflects which companies choose to work publicly. That means the data should be read as a partial view, not a ranking of companies.

## A practical way to use the panel

Use public engineering-velocity data as a diligence prompt, not a verdict.

1. **Observe.** Record the public change in commits, contributors, and repositories over a consistent window.
2. **Classify carefully.** Treat the four patterns as descriptions of visible activity, not explanations.
3. **Ask.** Use the pattern to form a concrete founder or technical-diligence question.
4. **Triangulate.** Compare it with product evidence, customer references, market knowledge, and direct technical review.
5. **Keep the boundary.** Do not infer a financing event or timing claim from this descriptive release.

That approach is modest by design. It is also more useful than a false promise of prediction.

## The useful claim is narrower, and stronger

Public GitHub engineering activity can help investors notice where to look closer. This dataset makes that process more inspectable by organizing 219 startup-period observations across 55 venture-backed startups, over five quarters, with clear variables and four defined patterns.[1]

Its value is not that it tells an investor what will happen next. Its value is that it turns a vague impression of engineering momentum into a record that can be questioned, reproduced, and combined with better evidence.

That is the right role for a public dataset in investment research: not an oracle, but a disciplined starting point.

## Author

**Maryan Kindrat** is the founder of GitDealFlow and works with public GitHub engineering-activity data. He writes here in his personal capacity.

## References

[1] VC Deal Flow Signal, *A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups* (2026), SSRN abstract 6606558. https://ssrn.com/abstract=6606558. Research page and methodology summary: https://signals.gitdealflow.com/research

[2] VC Deal Flow Signal, *GitHub Engineering-Velocity Dataset* (2026), Zenodo, CC BY 4.0. https://doi.org/10.5281/zenodo.19650920
