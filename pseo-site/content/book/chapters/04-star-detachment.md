# Signal 4 — Star-Velocity Detachment

## What it is

Star-velocity detachment is the divergence between a repository's recent star-acquisition rate and its recent commit-velocity rate. Both are measurable, and both move together for most repositories most of the time. When they diverge — specifically, when stars accelerate sharply while commits stay flat or decelerate — something off-platform is happening. That something is usually a launch, a viral demonstration, a Hacker News spike, a Twitter thread, an investor-deck reveal, or a major media moment.

The signal fires when the trailing fourteen-day star-acquisition rate exceeds three times the trailing-fourteen-day-of-the-prior-fortnight rate, while the commit-velocity acceleration over the same period is below fifty per cent. That is, attention is accelerating much faster than work, which means attention is being driven by something other than the work.

Median lead time in the SSRN panel was nineteen days before the Series A announcement, with an interquartile range of nine to thirty-four days. Hit rate was fifty-eight per cent. This is the lowest single-signal hit rate in the book. It is included because it is the only signal that catches the marketing-momentum pattern that the other six signals miss, and because it composes informatively with the others.

## Why it works

A startup preparing for a Series A round often runs a public-attention campaign in the weeks before the term sheet. The campaign produces a Hacker News post, a Twitter thread, a viral demo on X, a Show HN, a launch post on Product Hunt, a feature in a trade publication, or a mention in a high-traffic newsletter. The attention drives a wave of new GitHub stars on the company's primary repository, often within a forty-eight-hour window of the publication.

The stars show up before the engineering work catches up with the new attention. The team is in the middle of preparing for the round, so the commit cadence is roughly steady or even slightly down. The result is a measurable detachment: stars per day three or four times baseline, commits per day flat. In the next two weeks the team usually catches up — they ship the features that the new attention is asking for — and the divergence narrows. But the firing has happened, and the public-attention spike is now in the historical record.

The reason this signal precedes a Series A is that public-attention spikes are valuable to the company *exactly* during the run-up to a round. They serve three purposes simultaneously: they validate the demand-side narrative for the pitch deck (the chart-up-and-to-the-right star graph is a recurring slide), they create soft pressure on the lead investor to close the term sheet quickly (because attention is increasing), and they recruit engineering candidates who will land in the post-round hiring sprint. Founders who do not deliberately orchestrate an attention spike before a fundraise are leaving multiplicative effects on the table, and most experienced founders know this.

## How to compute it

The procedure is parallel to Signal 1 but on a different metric.

1. Pull the star-events feed for the repository for the past forty-two days using the GitHub stargazers endpoint. Note: this endpoint is paginated and the timestamps are reverse-chronological; you may need several pages for popular repositories.
2. Bucket the star events into three consecutive fourteen-day windows.
3. Compute the star-acquisition count per window.
4. Compute the star-velocity acceleration as `(current - prior) / max(prior, 1)`.
5. Compute the commit-velocity acceleration over the same windows (this is Signal 1; reuse the computation).
6. The signal fires when star-velocity acceleration is above two hundred per cent (i.e. three times prior) and commit-velocity acceleration is below fifty per cent.
7. Apply the absolute floor: if the prior fourteen-day window had fewer than ten new stars, the percentage is too noisy to use; ignore the firing.

The stargazers endpoint requires an `Accept: application/vnd.github.star+json` header to return star timestamps rather than a flat list. This is documented but easy to miss. The first time you write the script you will probably forget the header and wonder why all the stars look like they happened today.

## Distinguishing the kind of off-platform event

A firing tells you that an off-platform event is driving attention. It does not tell you which kind. Six common off-platform events produce this signature, and the correct interpretation depends on which one it is.

**A Hacker News front-page post.** The signature is a sharp spike in the first twenty-four hours, decaying over three to seven days. The spike comes from a single coordinated source. You can confirm by searching `https://hn.algolia.com` for the company name in the relevant window. If a HN post hit the front page, it will be visible there.

**A Twitter / X thread by a high-follower account.** Signature is similar to the HN spike but with a different decay profile — longer tail, more secondary spikes from quote-tweets and replies. You can confirm by searching X for the repository URL. If the thread exists, it usually has a substantive reply chain.

**A Product Hunt launch.** Signature is a sharp single-day spike on the launch day, with a moderate residual over the next week. Confirm by checking Product Hunt for the company name.

**A trade publication feature.** Signature is a slow ramp over the publication day and the day after, with a long, flat residual lasting up to four weeks. Confirm by Google-searching the company name with a date filter.

**A viral demo on X or LinkedIn.** Signature is a multi-day amorphous spike with several cascading secondary spikes as different audiences re-share. Confirm by checking the company's social posts and the founder's social posts in the relevant window.

**A conference talk.** Signature is a sharp spike on the day of the conference's video release (often days or weeks after the talk itself), with a flat plateau afterwards. Confirm by searching for the conference's YouTube channel.

The investor's job here is to identify which of the six events is responsible, because the implications for the Series A run-up differ. A HN front-page post that the company orchestrated themselves is a stronger pre-Series-A signal than a passive trade-publication feature, because the HN post is something the team prepared for.

## What it looks like in the wild

Concrete example: a developer-tools company we tracked through 2024. Their main repository had been accumulating stars at a baseline rate of roughly twenty per day for the previous quarter. In the third week of August the daily rate jumped to ninety, then to one hundred and forty, then plateaued at sixty for several days. The commit velocity over the same period was unchanged.

The trigger was a Show HN post on August 19 that hit the front page and stayed there for nine hours. The post was made by a community member, not the founders, but the founders engaged in the comment thread and posted a follow-up on their company X account within the hour. The HN post was on a Saturday; the engagement signature suggests the founders were ready for it.

The Series A was announced October 11. The Signal 4 firing on August 19 had a fifty-three day lead time, which is on the higher end of the interquartile range. By the time the announcement came, the repository had accumulated several thousand additional stars and roughly one hundred and twenty new pull requests from external contributors.

This signal would not have caught the company on its own. It would have placed the company in the active-watch tier — and that placement would have, in combination with the other signals firing in mid-September, been the basis for a high-conviction reach-out to the founders well ahead of the term sheet.

## False positives — four patterns to recognize

**The dependent-popular-project halo.** A repository that is a plugin or integration for a much more popular project will spike whenever the parent project announces something. This is real attention, but it is not predictive of a fundraise on the plugin's own company. Mitigation: check whether the repository is depended-on-by a popular project, and discount the firing accordingly.

**The bot-driven star spike.** Star-buying services exist. The signature is a spike of stars from accounts with no other public activity, no other repositories starred, and an account-creation date within the last few months. Mitigation: sample twenty of the new stargazers and check their profiles. If more than half look fake, the signal is fraudulent and tells you something about the founder's judgement.

**The newsletter feature.** A high-traffic developer newsletter (e.g. a subscriber-list feature) produces a star spike that is partially predictive of nothing more than the editor's interest. Mitigation: not really filterable from the data alone; you need to know which newsletters are active in the relevant window.

**The viral hijack.** Occasionally a repository's content goes viral for a reason unrelated to the company's own work — a reference in a popular meme, a coincidental name collision, a tutorial blog post that someone else wrote. Mitigation: read the content of the spiking attention. If the reason for the spike is not on-thesis for the company's own product trajectory, the spike is incidental.

## Threshold guidance

The three-times-prior-velocity threshold with the under-fifty-per-cent commit-velocity-acceleration filter is the default. The signal is most informative for repositories whose baseline star-acquisition rate is in the ten-to-fifty-stars-per-day range. Above that, the signal becomes noisier because the underlying attention is already churn-driven; below that, the signal is over-fitted to single events.

You can layer the signal with attention-source identification: a HN-driven spike is more informative than a passive trade-publication spike, and the GitDealFlow Scout Score weights them accordingly.

## When to act

A clean firing of Signal 4 is the lightest-touch signal in the stack. It is a reason to add the company to your watchlist; it is not yet a reason to start diligence. The right move is to wait one to two weeks and see whether the other signals fire in concert. When Signal 4 plus Signal 1 and Signal 2 all fire within a thirty-day window, the conviction is high enough to start active diligence.

The exception is when the off-platform event is a Show HN orchestrated by the founders themselves and the post explicitly references "we are hiring" or "we are launching v1". That kind of post is a softly-stated public announcement that a fundraise is imminent, and you should reach out the same day.

## Exercises

**Exercise 4.1.** Pick five startups from your watchlist. Compute the star-velocity acceleration over the past forty-two days. Which fire? Which fire concurrently with Signal 1? Which fire with Signal 1 dormant?

**Exercise 4.2.** For each firing in Exercise 4.1, identify the off-platform attention source. Use HN search, Product Hunt, X search, and the company's blog. Which of the six event types is responsible for each firing?

**Exercise 4.3.** Pick a Series A announcement from the past sixty days. Plot the star trajectory of the company's primary repository in the eight weeks before the announcement. How many star-velocity-detachment firings would you have caught? At what lead times?

**Exercise 4.4.** Sample twenty stargazers from a recent firing. Check their profiles. How many look fake? Document the visual signature of bot-driven star spikes.
