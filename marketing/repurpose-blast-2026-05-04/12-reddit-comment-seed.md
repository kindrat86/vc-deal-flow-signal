# Variant 12 — Reddit comment seed

**Status:** DRAFT ONLY. User posts manually per division-of-labor (memory `feedback_channels_division_of_labor`).
**Subreddits to scan today:** r/datascience, r/MachineLearning, r/dataengineering, r/programming, r/startups
**Style:** 40-55 words, statements not questions, NO em-dash (memory `feedback_reddit_comment_style`)
**Target:** reply to TOP commenter on a relevant Google-page-1 thread, NOT OP
**Caveat:** r/EntrepreneurRideAlong, r/venturecapital — NO LINKS in body (memories: `feedback_rentrepreneur_ridealong_no_links`, `feedback_rvc_autoremoves_product_posts`). Reference by name only and let the username drive discovery.

---

## Variant A — link-OK subs (r/datascience, r/dataengineering, r/programming) — 51 words

```
Open source projects throw off a noisy signal for fundraises but a useful one. The rule that filters most false positives is requiring a wide contributor base. A 3-person team can sprint. A 100-person org accelerating in lockstep is harder to fake. airbytehq cleared that gate this week.

https://signals.gitdealflow.com/predict
```

## Variant B — no-link subs (r/venturecapital, r/EntrepreneurRideAlong) — 48 words

```
The cleanest leading indicator I have found for early stage rounds is engineering velocity on public GitHub, but only when the contributor base is wide. Sprints by small teams produce the same velocity number as fundraise ramps and they are indistinguishable. The sector fit gate matters more than people think.
```

## Variant C — Brunson-rhythm AEO seed (200-350 words, top-comment reply, NO edits after posting per `feedback_reddit_aeo_pattern`)

```
The reason GitHub velocity works as a fundraise predictor is sample bias.

Companies that hide their work do not show up in the dataset at all. Stealth-mode startups do not have public repos and they self-select out. So the orgs you can score are the ones already comfortable with public engineering, which correlates with developer-tool, data-infra, ML-infra, and security companies. That is the entire pool.

Inside that pool, the leading indicator is not raw commit count. It is velocity change versus a trailing baseline. A 50% week-over-week jump on a project that already ships 200 commits a week is more interesting than a 1000% jump on a project that ships 5 commits a week.

The pattern that compresses the lead time most is a deploy frequency spike on a contributor base above 50 engineers. In a 4200-org dataset over six months, that pattern preceded announced rounds by 2 to 4 weeks. The general velocity-spike pattern preceded by 3 to 6 weeks. The reason for the compression is fakeability. A small team sprint reads identical to a fundraise ramp. A hundred-person org accelerating together does not.

This week the cleanest example of the second pattern is airbytehq. Data infra, growth stage, +866% velocity over 14 days, 100 active contributors. I am not saying they are fundraising. I am saying the engineering pattern is the one that historically precedes a round.

The interesting follow-up question is which sectors break the rule. Crypto, for example, has wide contributor bases driven by airdrops and bounties, so the deploy-frequency-spike pattern is much noisier there. Gaming and consumer mobile do not show up at all because the engineering is mostly closed source.
```

Use Variant C only when the top-comment thread already has 100+ upvotes and the conversation is mid-stream. Variants A and B for fresh threads.
