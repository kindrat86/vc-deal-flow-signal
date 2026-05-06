<!--
PUBLISH NOTES (for the user, not for Substack):

  Source:        PR #4 (closed, never merged) → distribution/medium-autopublish/drafts/08-github-due-diligence-for-vcs.md
  Salvage date:  2026-05-06
  Target:        Substack long-form post on the gitdealflow Substack mirror
  Title:         "The 20-minute GitHub due-diligence pass I wish I'd done on my first three angel checks"
  Subtitle:      "Three angel checks, three avoidable disasters, and the cheap technical screen I should've run before opening the checkbook."
  Tags:          Venture Capital, Due Diligence, GitHub, Angel Investing
  Canonical:     publish on Substack first, set canonical to Substack URL.
                 (Original PR #4 had `signals.gitdealflow.com/blog/...` as canonical — that path
                 doesn't exist on prod. Substack-canonical is the right move.)

  Brunson ladder additions (vs. the original Medium draft):
    - Bookend CTA #1 — /book (Free + Shipping) at the *opening* (Brunson Best-Bait)
    - Bookend CTA #2 — /firstlook (€7 Sector Deep-Dive tripwire) at the close
    - Soft P.S. — Acceleration Watch free digest (Brunson rule: every long-form piece
      delivers value first, then offers the next rung; never just a hard pitch)

  Suggested cadence: Tuesday 09:00 UTC publish. Cross-quote on Substack Notes
  same-day. Mirror to dev.to (Forem API, automated) two days later.
-->

# The 20-minute GitHub due-diligence pass I wish I'd done on my first three angel checks

*Three angel checks, three avoidable disasters, and the cheap technical screen I should've run before opening the checkbook.*

---

I lost roughly $16,500 on my first three angel checks. Not because the deals were obvious garbage — they each had a deck, a founder I liked, and at least one warm intro — but because I skipped twenty minutes of work that would have, in retrospect, told me almost everything I needed to know. The work was free. The data was sitting on a public webpage. I just didn't think to look.

I want to walk through what those twenty minutes look like now, because the embarrassing part is how cheap the filter is once you build the muscle. And I want to walk through what they each cost me, because I think that's where the lesson actually sticks.

> *Author's note (2026-05-06): I've since written this up as a 31,000-word book — [The 7 GitHub Signals Behind Every Pre-Seed That Quietly Outperforms](https://signals.gitdealflow.com/book). The Substack version below is the short story behind chapter one. The book is free + shipping if you want the full pass with worked examples.*

## Check one: the company that was actually one tired founder

The first check was about $5k into a solo-founder developer tools company. The deck was clean. The founder was articulate. The GitHub looked busy — the org's main repo had 200+ commits in the previous month and the README was beautiful.

Honestly, I just looked at the green squares on the contribution graph and felt good.

What I didn't do: open the Contributors tab. If I had, I would've seen that 96% of those commits came from one human and the rest were from a bot. The "team" the founder kept referencing in their pitch was them, plus an automation account, plus a contractor who'd pushed twice in March and never came back.

The product wasn't bad. The traction was real, in the sense that real users were using it. But the company had no engineering team to scale. It had a founder, a job they hadn't quit, and an exhaustion curve that hit about three months after my check cleared.

I learned the most expensive lesson in angel investing on that one — solo founders in capital-intensive verticals are roughly always more solo than they look in the deck.

## Check two: the docs theater company

Second check, about $7.5k. Two founders, dev tools again because apparently I am slow. GitHub looked even better than the first one — multiple contributors, weekly cadence, a swelling stream of commits on the docs repo.

The thing I didn't notice was the *kind* of commits.

If I'd spent eight minutes scrolling through the actual commit messages, I'd have noticed that one founder was committing exclusively to docs and marketing repos. README updates. Landing page tweaks. Contribution guide formatting. Real talk, beautifully written contribution guides.

The other founder was supposedly the technical co-founder. Their commits to the actual product repo had stopped roughly six weeks before my check. I never asked why. I assumed they were "heads down on something private."

They weren't. They were leaving. The company died about four months after I wrote the check, and the autopsy was not technical at all — the founders had stopped speaking to each other in February, and one of them was filling the gap by polishing public surface area while the other was already mentally out the door.

The signal was right there in the contributor graph. I didn't read it because I'd never read one carefully before.

## Check three: the dependency-bot mirage

Third check, about $4k into what looked like a growth-stage company. Multiple repos. Steady commit cadence. The deck claimed a 12-person engineering team.

I clicked into their main repo and saw what felt like normal activity. Pull requests opening, getting merged, closed. A reassuring stream.

Then a friend of mine — someone who actually does this for a living — looked over my shoulder and asked me what fraction of those PRs were authored by humans.

I didn't know. I'd never thought to check.

It turned out roughly 70% of their public commit volume was being generated by Dependabot, Renovate, and a couple of other automation tools that open and merge their own pull requests. The "engineering team" wasn't twelve people. It was four. The remaining "engineers" listed on the about page were either advisors who'd never pushed code or names that looked like contractors but turned out to be the founder's college friends, included for legitimacy.

The company didn't blow up dramatically. It just slowly stopped responding to investor updates. The check is still technically alive on a cap table somewhere, but I treat it as dead and have for a while.

## What twenty minutes now looks like, in real life

After the third one, I built a checklist. I stop being honest about how I feel about the founder. I open GitHub. I run the same five-step pass on every company before I let myself even draft a check.

It takes twenty minutes if I'm being thorough. Less if the company is obviously off.

**Step one — the org page.** I open the GitHub organization. I look at four things in about ninety seconds. Number of public repos. Date of the most recent push across the org. Whether the pinned repos look like product code or experiments. Whether there's a README on the org itself, which is a small but real indicator that someone is taking the public surface seriously.

**Step two — the contributor graph on the main repo.** I open the Contributors tab on whatever the company's primary repo is. I count humans. I notice if one person is doing 90% of the work. I look at the timeline graph for each top contributor — are they pushing consistently, or did one of them go quiet three months ago? The patterns are obvious once you've seen a few of them. The answer to "is this a team or is this one founder pretending to be a team" usually takes about three minutes to land on.

**Step three — commit message scan.** I scroll through the last fifty or so commits. Not reading carefully — just reading the messages. I'm looking for the ratio of "Add OAuth provider" to "Bump lodash from 4.17.20." Feature commits versus chore commits. If I see thirty consecutive chore commits, the company is in maintenance mode regardless of what the deck says. If I see a steady mix of features and bug fixes, the team is actually building something.

**Step four — the bot check.** Sort the contributor list and look for accounts that end in `[bot]` or have suspiciously high commit counts and zero LinkedIn footprint. Calculate roughly what fraction of merged PRs are bot-authored. Anything over 40% means the velocity number you're about to be sold is mostly automation.

**Step five — new repos in the last 90 days.** Click on the "Repositories" tab and sort by "Recently created." If the company has spun up two or three new infrastructure-shaped repos in the last quarter — SDKs, internal tools, deployment configs — that tells me they're investing in platform. That's a different signal than a team that's only been touching one repo for a year. Both can be fine, but they tell me very different things about what stage of company I'm looking at.

That's the whole pass. The first time I ran it on a real deal it took me forty minutes because I kept stopping to look up what GitHub features did. By the fifth or sixth time it was twenty minutes. By the twentieth it was fifteen and I'd missed almost nothing.

## The part I got wrong even after building the checklist

The mistake I made next was treating the GitHub pass like it was diligence. It isn't. It's a screen.

The actual technical due diligence — code quality, architecture decisions, whether the team can actually scale to the number on the deck — none of that is visible from outside. It happens on a call with the engineering team, looking at private repos, reading their internal docs, talking to their senior engineers about what kept them up the past quarter.

What the GitHub pass tells me is whether that call is worth scheduling. It's a screen, not a verdict. I run it because if a company fails it, I save myself the calendar time. If they pass it, I treat that as permission to schedule the real conversation, not as a substitute for it.

The other thing I got wrong: I underweighted private-first companies for too long. Some of the best dev shops I know keep almost everything private. They have a marketing site and one open-source utility repo and that's it. If you ran my five-step pass on them, they'd score near-zero. That doesn't mean their engineering is weak — it means their open-source strategy is "we don't have one." Which is fine. The signal works the way it works. Absence of public signal is not the same as bad signal.

I now treat the pass as a positive screen, not a negative one. If GitHub looks good, I learned something. If GitHub looks empty, I learned almost nothing — I have to go ask other questions.

## What I do on a Tuesday now

I usually run the pass before any first call. The morning of the meeting, I block twenty minutes on my calendar. Coffee. GitHub org page. Contributor graph. Message scan. Bot check. New repo scan. Five steps. Done.

Then I write three questions for the founder based on what I saw. Not gotcha questions — actual questions. *"I noticed your contributor count jumped from 4 to 9 in March. Was that a hiring burst around your last raise, or contractors?"* *"Your top contributor stopped pushing in February — did someone leave?"* *"I saw you spun up a new SDK repo last quarter. Is that an internal tool or part of your product strategy?"*

The conversations after I started doing this got noticeably better. Founders generally appreciate someone showing up informed. The ones that get defensive about basic public data — that's its own signal, by the way. I've passed on two deals in the last six months specifically because the founder treated GitHub questions like an attack rather than a normal piece of the conversation.

## The line I won't cross

One ethical thing I want to put on record because I see it done badly. The contributor list on a GitHub org is not a recruiting list. The names on it are people who chose to make their work visible, not people who signed up to be cold-pitched by random investors. I've never DMed a contributor on a portfolio company's GitHub. I've never used the data to poach. The minute investors start doing that, the data stops being public — founders make their orgs private, and the signal disappears for everyone.

The data is a window into the company. Not a roster.

## Closing the loop

I lost the equivalent of a decent used car learning what a careful GitHub pass looks like. The checks weren't catastrophic, individually — they were just sloppy. The first one was a solo-founder mirage. The second was a docs-theater cover for a co-founder split. The third was a dependency-bot army wearing engineering-team clothes. All three were visible in twenty minutes of free public data. I just didn't look.

I'm not saying running this pass would have saved every check. I'm saying it would have saved at least two of those three, and the time cost of running it was less than the time I spent reading the deck. That's a bad ratio to be on the wrong side of.

The deck is the story the company wants you to hear. The GitHub org is the story they tell whether they mean to or not. If you only have time to read one of them carefully, I now believe you should pick the second.

---

### If this resonated

There are three places to take this further, depending on which one fits the way you write checks today:

- **The free Sunday digest** — five engineering-acceleration signals every Monday morning, sector-tagged, no commitment. This is the rhythm version of the post above. [signals.gitdealflow.com](https://signals.gitdealflow.com/) — free forever.
- **The book** — [*The 7 GitHub Signals Behind Every Pre-Seed That Quietly Outperforms*](https://signals.gitdealflow.com/book) — 31,000 words, 104 pages, free + shipping. Chapter one is the long version of the five-step pass above; chapters 2–7 are the four signals I left out of this post (contributor diversity Gini, dependents graph, README freshness, new-repo cadence, and the composite score that ties them together).
- **The €7 First Look Pass** — pick any one of our 20 tracked sectors. Within 24 hours we send the full Sector Deep-Dive PDF for that sector — top 25 ranked orgs, 14-day acceleration deltas, contributor maps, signal-type classification, and the top 3 names not yet on Crunchbase. Plus the raw CSV. [signals.gitdealflow.com/firstlook](https://signals.gitdealflow.com/firstlook) — credited 100% toward Dashboard if you upgrade within 14 days.

*P.S. The methodology behind every claim in this post — including the "21–47 days before the deck" lead-time band — is open and reproducible from the SSRN preprint at [ssrn.com/abstract=6606558](https://ssrn.com/abstract=6606558). Source code is CC BY 4.0 — fork the entire thing and re-derive every number from public GitHub data without trusting me.*
