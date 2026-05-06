# Signal 2 — Contributor Influx

## What it is

Contributor influx is the count of distinct human contributors who appear for the first time in the public commit log of a startup's primary repository within a fourteen-day window. It is, in plain English, the count of new engineering hires who have started shipping code recently enough to show up in the public record.

The threshold that fires the signal is four or more new distinct human contributors in the fourteen-day window, with two-period confirmation. In the SSRN-indexed panel the median lead time was twenty-six days before the Series A announcement, with an interquartile range of eighteen to forty-one days. The hit rate, defined the same way as in Signal 1, was seventy-one per cent.

Seventy-one per cent is the highest single-signal hit rate in the book. The reason is that contributor influx is the most directly causal signal in the seven-signal stack: the round closes, capital is deployed, hires are made, hires start shipping, hires appear in the commit log. There are very few alternative explanations for "four new humans started shipping production code on this repository in the last two weeks", and almost all of them are correlated with the same underlying cause as a Series A run-up.

## Why it works

When a startup raises a Series A, the single largest immediate use of proceeds is engineering headcount. The standard pattern is roughly: a fifteen-million-dollar Series A funds twelve to twenty engineering hires over the following twelve months, with the first six to ten of those landing in the first ninety days. Series A rounds are usually pre-staffed in this sense — the founders have been talking to candidates for the previous quarter, the offers go out within a week of the term sheet, and the start dates cluster in the thirty-to-sixty-day window after the round closes. By the time the round is publicly announced, the first hires are already in the door.

Public hires show up in three places: LinkedIn (slow, performative, usually two to four weeks after start date), the company's website team page (sloppier, often weeks or months delayed), and the commit log (fast, automatic, requires no marketing decision to publish). The commit log is the leading edge.

There is also a second-order effect that compounds the signal. Strong engineering candidates, when evaluating early-stage startups, look at the public commit history to assess the engineering culture. They want to see active maintainers, frequent reviews, code that does not embarrass the team. A startup that is preparing for a Series A is, simultaneously, preparing to recruit on the strength of its public engineering surface. So the same period that produces commit acceleration also produces a deliberate cleanup of the public commit log, the merging of long-pending pull requests, and the surfacing of high-quality contributors as visible reviewers. Contributor influx therefore both reflects and amplifies the same underlying fundraise-prep cycle.

## How to compute it

The procedure for counting contributor influx is more subtle than counting commits, because GitHub's APIs do not expose first-seen-on-repository as a primitive. You have to compute it. The approach:

1. Pull the full author list for all commits on the default branch in the past sixty days.
2. Pull the full author list for all commits on the default branch in the prior sixty days (days sixty through one hundred and twenty back).
3. The new-contributor set is the difference: authors who appear in the recent sixty-day list but not in the prior sixty-day list.
4. Restrict the recent window to the most recent fourteen days and compute the count.
5. Apply the bot filter: drop any author whose login ends in `[bot]`, plus an explicit allowlist for known service accounts (renovate, dependabot, github-actions, copilot, etc.).
6. Apply the two-period confirmation: the count must be greater than or equal to four in the most recent fourteen-day window, and greater than or equal to two in the prior fourteen-day window. The two-period confirmation matters more here than for Signal 1, because the noise floor is higher.

The look-back window of one hundred and twenty days is critical and worth defending. Too short a look-back (e.g. thirty days) misclassifies returning maintainers as new contributors. Too long a look-back (e.g. a full year) misses real new hires who happened to push a one-line typo fix to the repository six months before they joined the company. One hundred and twenty days is the empirical sweet spot from the SSRN panel; ninety also works acceptably; thirty does not.

## Distinguishing real hires from noise

The hardest part of using this signal is telling a real new-hire contributor from a noise-source contributor. There are five kinds of noise to be aware of, and three positive tells that confirm a contributor is a real new hire.

The five noise sources:

**Bots and service accounts.** The bot filter handles ninety per cent of these. The remaining ten per cent are obscure CI bots that do not follow the `[bot]` naming convention. If you see a "contributor" whose only commits are titled "automated weekly version bump" or "dependency update", manually flag and exclude them.

**Drive-by external contributors.** Open-source-friendly startups occasionally accept small documentation fixes or typo corrections from external community members. These contributors are real humans, but they are not new hires. The tell is volume: a real new hire produces between five and forty commits in their first fourteen days; a drive-by contributor produces between one and three. A simple commit-count threshold of three or more on the new contributor's name in the firing window filters out almost all drive-by noise.

**Contracting-firm staff.** A startup that hires an outside contracting firm for a discrete project produces a burst of new contributors who all show up at once and disappear after eight to twelve weeks. The tells: the contractor accounts have similar account ages (they were created in a coordinated batch), they have professional-looking but personal-side-project-empty profiles, and their commits cluster on a specific feature branch rather than spread across the codebase. If three or more of your "new contributors" share these traits, treat them as a contracting cohort, not a hiring cohort.

**Returning maintainers.** A maintainer who took a four-month break and then returned will look like a new contributor against a thirty-day look-back. The fix is the one-hundred-and-twenty-day look-back described above, which catches almost all returning maintainers. If you see a "new" contributor whose first commit looks unusually senior — refactoring a core subsystem on day one — manually check their full GitHub commit history to see if they have prior involvement.

**Pseudonymous accounts.** A small number of engineers maintain pseudonymous GitHub accounts and occasionally rotate them. This is rare in commercial-startup contexts but common in crypto-adjacent ones. There is no reliable automated filter; the manual heuristic is to be sceptical of new contributors whose accounts have been created in the past sixty days and have no other public activity.

The three positive tells:

**LinkedIn confirmation.** If a new contributor name resolves to a LinkedIn profile that shows a recent start date at the company in question, the contributor is almost certainly a real new hire. This is the single highest-confidence confirmation. Forty per cent of new-hire contributors will be confirmable this way within a week of the firing.

**Personal side-project activity.** Real engineering hires almost always have personal repositories on their GitHub account — usually four or more, with at least one updated in the past six months. The tell is signal-to-noise: a real hire has a profile that says "this is a working software engineer with a public footprint", whereas a contracting account or a fake-looking account has the visual signature of a profile that was created for purpose.

**Org-membership progression.** If the new contributor's avatar appears in the public org members list within four to six weeks of their first commit, that is high-confidence confirmation that they are an employee. Not all startups maintain a visible public org member list, so the absence of this signal is not negative evidence — but its presence is strongly positive.

## What it looks like in the wild

Concrete example: Modal Labs, the same company we used in Signal 1. The fourteen-day commit-velocity acceleration crossed two hundred per cent on or about September 12, 2023. The contributor influx crossed four on or about September 18 — six days later. By October 5, the new-contributor count for the trailing fourteen-day window had risen to seven. Three of those seven names resolved on LinkedIn within two weeks to recent Modal hires.

The Series A was announced October 19. The Signal 2 firing on September 18 had a thirty-one day lead time, which is squarely in the median range. The combined Signal 1 plus Signal 2 firing — that is, the dual acceleration in commits *and* in contributors — produces a substantially higher hit rate than either signal alone, because it rules out almost all of the false positives I described in chapter one.

This is the right intuition for using the signal stack. No single signal is decisive. The combination of two or three concurrent signals is usually decisive. The full seven-signal score is decisive enough to act on with high conviction.

## False positives — three patterns to recognize

Beyond the five noise sources discussed above, three structural false-positive patterns produce real-looking contributor influx without a Series A run-up.

**The open-source community-building push.** A startup runs a community-engagement campaign — a hackathon, a contributor-recognition program, a bounty program, a major version release with a contribution drive — and the result is a real influx of external community contributors. The tell is the contributor mix: a Series-A run-up has overwhelmingly internal-team contributors (which means contributors who do not have other public open-source activity outside of this project). A community-building push has the opposite mix: most of the new contributors will have rich public footprints elsewhere.

**The merger or acquisition integration.** When a startup acquires a small team — an acqui-hire, a tuck-in acquisition, an M&A absorption — the acquired team's GitHub identities show up as a coordinated batch on the acquiring company's repository. This looks like a contributor influx but it is not a Series A run-up; it is the integration phase of a deal that has already happened. The tell is the timing relative to public M&A announcements (which are often delayed by months) and the fact that the new contributors all have prior commits on a different repository belonging to the same team.

**The intern cohort.** Summer or term internship cohorts produce a burst of new contributors with similar timing, similar account ages, and a roughly common alma-mater pattern. The tell is the seasonality (May, June, January arrivals are over-represented), the youth of the contributors' public footprints, and the fact that intern commits tend to cluster on tutorial-and-docs subsystems rather than on the core product paths.

## Threshold guidance

The four-new-contributors-in-fourteen-days threshold with two-period confirmation is the conservative default for a watchlist of two hundred to three hundred organizations. If you are running a smaller watchlist, you can drop to three new contributors and accept a slight increase in noise. If you are running a larger watchlist, raise to five new contributors and three-period confirmation, which trades sparsity for higher hit rate.

The threshold should also scale with the existing engineering team size. A startup with six engineers shipping baseline three or four commits per day will fire this signal on adding two new hires; a startup with thirty engineers shipping fifty commits per day will not fire it on adding only three. The scaled threshold is "twenty-five per cent of the active-contributor baseline, with a minimum of three". The Scout Score in GitDealFlow uses the scaled version.

## When to act

A clean Signal 2 firing — four new human contributors, two-period confirmation, no false-positive flags — is a high-conviction reason to start active diligence the same week. Two things to do:

First, run the LinkedIn cross-reference on every new contributor in the firing window. The three to five who resolve to recent hires are your soft confirmation. Their roles tell you about the round size: senior infrastructure hires usually mean a larger round, junior product engineering hires usually mean a smaller and faster round.

Second, look at the commit content of the new contributors' first ten commits. If those commits cluster around production-readiness topics — auth, billing, observability, deployment, on-call tooling — the company is preparing to scale, which is consistent with a Series A run-up. If those commits cluster around a single specific product subsystem, the company is preparing to launch a new product or major feature, which is also consistent with a Series A pitch deck. If those commits are spread thinly across many small fixes, the new hires are likely still ramping, and the firing is real but earlier than usual.

A clean Signal 2 firing is the strongest single-signal reason to be in early conversations with a founding team. Do not let it sit on your watchlist for two weeks. Reach out the same week.

## Exercises

**Exercise 2.1.** Pick five startups from your watchlist. Compute the contributor influx (new contributors in the trailing fourteen days, with one-hundred-and-twenty-day look-back, bot-filtered). How many fire above the threshold of four?

**Exercise 2.2.** Pick three Series A announcements from the past sixty days. Compute the historical contributor-influx trajectory in the eight weeks preceding the announcement. Were the four-new-contributor and two-period-confirmation thresholds crossed ahead of the announcement? At what lead time?

**Exercise 2.3.** Pick a startup that recently absorbed an acqui-hire (you can identify these from public M&A coverage). Look at the contributor influx pattern around the acquisition close. Document the visual signature of an acqui-hire, distinct from a Series-A new-hire batch.

**Exercise 2.4.** For one of your firing signals from Exercise 2.1, run the LinkedIn cross-reference manually on each new contributor. How many resolve to recent hires within a week? What roles? What does the role mix tell you about the company's near-term product trajectory?

The fourth exercise is the one that turns the signal into actual deal-flow value. Resolve the names. Read the public profiles. Form a thesis about what the company is building. That thesis is your edge.
