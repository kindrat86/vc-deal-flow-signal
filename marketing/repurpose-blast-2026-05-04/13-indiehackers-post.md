# Variant 13 — IndieHackers short discussion post

**Cadence:** Monday 20:00 EEST · auto-publish via ih-daily-maintenance scheduled task (per memory `reference_ih_daily_trigger`)
**CTA:** anchor blog (single)
**Target board:** Marketing, Lessons Learned, or Growth — pick whichever has the most active thread today
**Length:** 412 words

---

## Title

What I learned shipping a free weekly data product to investors for 3 weeks

---

## Body

Three weeks ago I started publishing a free weekly Signal of the Week — a single startup ranked #1 across 100 tracked GitHub orgs in 19 sectors, based on engineering velocity.

Three lessons that surprised me.

**Lesson 1: the audience that shows up is not the audience I designed for.**

I built this for early-stage VCs. The audience that actually engages is developer-investors — angels who write checks and also write code. They want the methodology page open in another tab while they read the signal. They run the predictor on their own portfolio companies before they finish the post. They install the MCP server.

I rewrote the landing page to talk to them instead. Conversion roughly doubled.

**Lesson 2: free + non-gated + cite-encouraged compounds slowly but it does compound.**

The first week's signal got cited by exactly one newsletter. The second week, three. The third week, seven. None of these citations were paid. None were placements. They were just publications that found the data useful and quoted the citation block.

The compounding worked because the dataset is CC BY 4.0 and the methodology page is reproducible. Editors can cite it without legal review. That removes the largest friction point for being quoted.

**Lesson 3: the discipline rule that mattered most was "skip a week if no candidate clears all four gates".**

This is the rule that protects the average. The temptation is always to ship a story every week. If you ship a weak story alongside three strong ones, the brand becomes "publishes data with mixed signal quality". If you ship three strong stories and skip the fourth week, the brand becomes "only publishes when the data supports it".

I have not had to skip yet. This week's pick (airbytehq, +866% commit velocity, 100 contributors) clears the gates by a wide margin. But the rule is the rule. If next week's data is weak, I will skip and the silence will be more credible than a forced story.

The full six-month methodology and the 4200-org dataset is here:

https://signals.gitdealflow.com/blog/i-tracked-4200-startup-github-orgs-six-months

Happy to answer questions about the gating logic or the dataset construction.
