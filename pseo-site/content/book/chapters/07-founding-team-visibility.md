# Signal 7 — Founding-Team Public Visibility

## What it is

Founding-team public visibility is the rate of public engineering output — blog posts, conference talks, OSS maintenance, podcast appearances, technical Twitter/X threads — by the founding team and the technical lead. It is measured as a count of distinct public outputs in the past sixty days, weighted by the audience size of the platform. The signal fires when the count rises by more than fifty per cent across two consecutive sixty-day windows.

This is the softest of the seven signals, both in computation and in interpretation. It is the only signal in the book that requires a meaningful manual element — the count cannot be fully automated because the platforms are heterogeneous and the attribution to specific founders requires some judgement. It is also the most predictive of certain *kinds* of Series A rounds, specifically the kinds where the lead investor is buying the founder's public credibility as part of the thesis.

Median lead time in the SSRN-indexed panel was forty-five days before the Series A announcement, with an interquartile range of twenty-eight to seventy-one days. Hit rate was sixty-four per cent.

The signal's value is mostly in its breadth: it catches Series-A-bound companies whose other public-data signals are quiet, because the company is operating in stealth or because the technical lead prefers to communicate through long-form posts rather than commit logs.

## Why it works

A founding team preparing for a Series A is, in addition to everything else, preparing the public credibility surface that the lead investor's analyst will read. The analyst will, in the week before the term sheet is finalised, do a survey of the founder's public output — to validate the engineering depth claim, to understand the founder's communication ability, to assess whether the founder will be effective as a public face for the company in the recruiting and customer-facing contexts that the Series A round implies.

Founders who have done this before know that the public-output-survey happens. They prepare for it. The preparation is partially deliberate — writing one or two engineering blog posts on hard technical problems the team has solved — and partially organic — accepting podcast invitations they would otherwise have declined, agreeing to speak at conferences in the relevant window, opening up about the technical roadmap on Twitter.

The result is a measurable acceleration in public engineering output in the eight to twelve weeks before the round. The acceleration is asymmetric: it concentrates heavily on the technical co-founder or the head of engineering, less so on the CEO (whose public output usually rises after the round, not before). The asymmetry is a useful diagnostic.

There is a second-order effect. A founder who is publicly active recruits engineers more efficiently, and the post-round hiring sprint is meaningfully more successful when there is a recent body of public engineering work. This compounds the same way the recruiting motivation in Signal 5 does.

## What to look for

Six channels are diagnostic, in roughly descending order of signal value.

**Engineering blog posts on the company's own engineering blog.** A new technical-deep-dive post on the company's own engineering blog is the highest-signal output. It usually represents one to two weeks of writing time and is usually published in coordination with a marketing motion. Two posts within sixty days, when the prior baseline was zero, is a strong tell.

**Personal blog posts by the technical lead.** A long-form personal blog post by the technical co-founder or head of engineering, on a topic adjacent to the company's product, is a soft pre-fundraise signal. Personal blogs are often where founders surface ideas that are not yet ready for the company's official voice; they are also where founders demonstrate range to potential investors.

**Conference talks.** A talk at a relevant industry conference — KubeCon, NeurIPS, RailsConf, sector-specific shows — has a long preparation tail. A conference talk that is being given in the next six weeks was usually agreed to four to six months ago, which means the founder's public-attention plan was set well before the run-up. Talks are therefore lagging indicators of intent rather than leading indicators — but talks during the announcement window are amplifiers, not predictors.

**Technical podcast appearances.** A podcast appearance has a shorter preparation tail than a conference talk, usually four to ten weeks. A founder appearing on a high-listener-count podcast in the eight-week run-up is a soft pre-fundraise signal.

**OSS maintenance on widely-used external projects.** The technical lead's continued maintenance of a popular open-source project — submitting PRs, reviewing PRs, releasing versions — is a continuous baseline rather than a discrete event. A noticeable increase in OSS maintenance activity, especially on projects adjacent to the company's own product, is a soft signal.

**Long-form Twitter/X threads.** The lowest-signal output but the most volume. A founder thread that explains a technical decision, a product roadmap, or a sector thesis is a soft pre-fundraise signal, especially when the thread links back to the company's product.

## How to compute it

The computation is partially manual. The procedure I recommend is:

1. For each watchlist startup, identify the founders and the technical lead by name. This usually requires a one-time manual setup per startup, taking ten to fifteen minutes per company. Maintain a per-startup file with the names, the X handles, the personal blog URLs, and the relevant podcast/conference identifiers.
2. On a weekly cadence, scan each named source for new content. The scan can be partially automated — RSS for blogs, the X API for handles (if you have access), conference YouTube channels, podcast RSS — but a meaningful portion of the data is in non-RSS sources and requires manual inspection.
3. Tag each new piece of content with the channel type (blog, talk, podcast, OSS, thread).
4. Compute the trailing-sixty-day count by channel and overall.
5. The signal fires when the trailing-sixty-day count is more than fifty per cent above the prior sixty days, with at least one new piece in the highest-signal channel (blog post or conference talk).

For a watchlist of twenty to thirty active candidates, the manual portion takes about an hour per week. For larger watchlists you will want to either invest in better automation or restrict the signal to the top twenty candidates by other-signal scores.

## What it looks like in the wild

Concrete example: an AI-infrastructure startup we tracked through 2024. The technical co-founder published two engineering blog posts within a six-week window in the third quarter, both on technical aspects of the company's product. The same co-founder appeared on three high-listener-count engineering podcasts in the same window. The CEO began a series of long-form X threads on the sector landscape, posting once or twice per week, where the prior baseline had been one or two threads per quarter.

Signal 7 fired in mid-September. The Series A was announced in late November — sixty-eight days later, on the higher end of the interquartile range.

The interesting thing about this firing was that Signals 1 and 2 on the company's primary repository were quiet during the same period. The team was operating in a heads-down product mode and the commit acceleration was modest. The visibility signal caught the run-up where the in-repo signals missed it — which is exactly the catch-all role this signal plays in the seven-signal stack.

## Distinguishing pre-fundraise visibility from baseline marketing

The hard part of using Signal 7 is distinguishing the pre-fundraise burst from the company's normal marketing and developer-relations cadence. Three diagnostics help.

**Asymmetry by team member.** Pre-fundraise visibility concentrates on the technical co-founder and the head of engineering, not on the CEO. The CEO becomes more visible *after* the round. If the recent visibility burst is mostly CEO-driven, the company is likely in a different phase — could be a customer-acquisition push, could be a product-launch cycle, could be a fundraise but the round-stage is later than Series A.

**Topic specificity.** Pre-fundraise visibility tends to cluster on technical-depth topics adjacent to the company's product — the choices the team has made, the problems they have solved, the architecture they have built. Baseline DevRel visibility tends to cluster on customer use cases, integration tutorials, and product announcements. The technical-depth burst is the diagnostic.

**Concurrency with other signals.** A Signal 7 firing concurrent with Signals 1 and 2 is much more predictive than Signal 7 alone. A Signal 7 firing without any other signal firing is consistent with several non-fundraise explanations, including the founder simply working on their public profile or preparing for a job change.

## Threshold guidance

The fifty-per-cent-rise threshold across two consecutive sixty-day windows is the default. Tighten it to seventy-five per cent for organizations with already-high baseline visibility, where the absolute count is less informative. Loosen it to twenty-five per cent for organizations with low baseline, where each new piece of content is proportionally more meaningful.

The signal works best for organizations whose technical lead has at least a modest existing public presence — a personal blog with ten or more posts, a Twitter account with a thousand or more followers, or a documented history of conference talks. For organizations whose founders are deeply private (no personal blog, no public social presence, no conference history), Signal 7 cannot be computed reliably and should be skipped. This is a common pattern in stealth-mode AI labs and in some founder-backgrounds (e.g. ex-FAANG leadership who maintain no personal public footprint), and is not a negative signal — just an unmeasured one.

## When to act

Signal 7 firing in concert with Signal 1 or Signal 2 is high-conviction. Signal 7 firing alone is medium-conviction; add the company to your watchlist and check weekly for concurrent firings.

The reading exercise that produces the most value from Signal 7 is reading the new content. The blog posts, the talks, the podcast transcripts — they almost always reveal information about the company's near-term product roadmap and the founder's strategic thinking that you would not otherwise have. By the time you reach out to the founder, you have read everything they have said in public for the past two months. The conversation is materially different.

## Exercises

**Exercise 7.1.** Pick five startups from your watchlist. Set up the per-startup file with founder names, blog URLs, X handles, and known speaking schedules. Estimate how long the setup takes per company.

**Exercise 7.2.** For each startup in Exercise 7.1, count the public engineering output in the past sixty days and the prior sixty days. Which fire the fifty-per-cent threshold? What channel produced the firing?

**Exercise 7.3.** Pick a Series A announcement from the past sixty days. Walk back the founders' public visibility trajectory in the eight weeks preceding. At what lead time would Signal 7 have fired?

**Exercise 7.4.** Read the most recent engineering blog post from a founder in your watchlist. What does it tell you about the company's near-term roadmap? What product decisions are being publicly justified? Make a note of the strategic posture.

The fourth exercise is, again, the one that turns the signal into deal-flow value. The reading is the work. The signal just tells you which reading is most likely to repay the investment.
