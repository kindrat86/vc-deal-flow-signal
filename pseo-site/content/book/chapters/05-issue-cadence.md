# Signal 5, Issue Closure Cadence

## What it is

Issue closure cadence is the median time between an issue's creation and its closure on a startup's primary repository, computed over a rolling thirty-day window. It is a leadership-quality signal rather than a fundraise-prediction signal in the strict sense, but a sharp tightening of the median, especially against a baseline of slow closure, has predictive value as a tie-breaker between superficially similar startups.

The signal fires when the median issue-close-time on a repository drops by more than fifty per cent across two consecutive thirty-day windows, while issue creation rate remains stable or rises. In plain English: the team is closing issues twice as fast as they were a month ago, on roughly the same volume of new issues. That is a real tightening of operational discipline, and it almost never happens by accident.

In the SSRN-indexed panel, sharp tightening of issue-closure cadence preceded Series A announcements with a median lead time of fifty-two days, an interquartile range of thirty-five to seventy-six days, and a hit rate of fifty-five per cent. The earliest-firing of the seven signals, and the lowest hit rate by itself, but with the highest signal value as a *tie-breaker* between two firing-on-other-signals candidates.

## Why it works

A founding team preparing for a Series A makes a deliberate decision to clean up the public engineering surface. The cleanup is partly about the diligence-prep refactor I described in Signal 1, but it has a separate component that shows up in the issue tracker. Specifically: long-pending public issues are either closed (via fixes, via "won't fix" decisions, or via "duplicate" links to a canonical issue) or moved to a private internal tracker. The result is an issue tracker that looks well-maintained, recently active, and high-discipline.

The reason this matters is that Series A diligence increasingly includes an evaluation of the team's engineering operating cadence, and the public issue tracker is the most accessible operational artifact. A diligence reviewer looking at a startup's GitHub for the first time will spend roughly five minutes on the issue tracker and form a strong opinion about whether the team has its act together. A messy tracker with hundred-day-old open issues, no labels, no triage activity, and stale milestones produces a poor impression, even if the underlying engineering is strong. Founders who have done diligence before know this and clean up accordingly.

The cleanup happens whether the founders are explicitly preparing for diligence or not, because the cleanup has a downstream effect: a clean issue tracker is a better recruiting surface, and the recruiting push that precedes a Series A creates the same incentive. The issue-cadence signal is therefore over-determined: it would fire from the diligence-prep motivation alone, and it fires more reliably when the recruiting motivation is also present.

## How to compute it

The computation is straightforward but pagination-heavy.

1. Pull the issue list for the repository, both open and closed, scoped to issues created in the past one hundred and twenty days. Use the GitHub issues endpoint with `state=all`, paginated.
2. Filter to bona fide issues (exclude pull requests, which the GitHub API conflates with issues by default, you have to explicitly exclude any record with a `pull_request` field).
3. For each closed issue, compute its time-to-close as `closed_at - created_at`, in hours.
4. Bucket the issues by closure date into two consecutive thirty-day windows: the recent thirty days, and the prior thirty days.
5. Compute the median time-to-close for each window. Use the median, not the mean, issue closure times have a long tail, and the mean is heavily skewed by a small number of very-old issues that get suddenly closed.
6. Compute the cadence change as `(prior_median - recent_median) / prior_median`. A positive number means closing faster; the signal fires when this is above fifty per cent.
7. Apply the volume floor: the recent window must have at least ten closed issues for the median to be statistically meaningful. Below that, ignore the firing.
8. Apply the issue-creation-rate sanity check: the recent thirty days must have an issue-creation rate of at least seventy per cent of the prior thirty days. If the team is simply not creating issues anymore, the median will look great but the signal is meaningless.

The volume floor and the creation-rate sanity check together rule out most of the trivial false positives, which were the bulk of the misfires we saw in the SSRN panel before adding the checks.

## What it looks like in the wild

Concrete example: a data-platform startup we tracked through 2024. Their primary repository had a baseline issue-close median of around two hundred and forty hours, that is, ten days, over the trailing year. In the second half of August, the median dropped to one hundred and eighty hours, then in the second half of September to ninety hours. The issue-creation rate was steady at roughly seven new issues per week.

The Signal 5 firing was confirmed in early October at a sustained sub-hundred-hour median across two consecutive thirty-day windows. The Series A was announced in early December, sixty-eight days after the firing, on the higher end of the interquartile range.

The investor who weighted Signal 5 alongside Signals 1 and 2 in their composite score had this company ranked fifth overall on a thirty-organization watchlist by mid-September. By mid-October it was ranked second. By early November it was ranked first. The Series A was announced four weeks later. The investor had a four-week head start on every other lead they had.

That is what tie-breaking value looks like in practice.

## Distinguishing real cadence improvement from artifacts

The most common artifact that mimics real cadence improvement is a one-time triage event. A new technical lead joins the company, spends a week aggressively closing stale issues with terse "won't fix" or "out of date" comments, and the median drops sharply. This is real operational discipline tightening, but it is a one-shot rather than a sustained pattern.

The two-period confirmation handles this: a real sustained cadence improvement persists across two consecutive thirty-day windows. A one-shot triage produces a single window of improvement followed by a regression.

A second artifact is the issue-template-change effect. A repository that adopts a stricter issue template, requiring more fields, requiring more labels, requiring reproducer instructions, will see a sharp drop in low-quality issues, which raises the proportion of well-defined issues, which lowers the median time-to-close. This is real operational improvement, but it is also a useful tell about the team's recent investment in maintainer ergonomics.

A third artifact is the bot-driven auto-close. Some repositories configure stale-bot to auto-close issues that have been inactive for sixty or ninety days. A bot push to refresh stale-bot rules will close a wave of old issues at once, which can produce an artificial cadence-tightening signature. Mitigation: filter out closures whose author is `[bot]` and whose close-comment matches stale-bot phrasing.

## Threshold guidance

The fifty-per-cent-tightening threshold with two-period confirmation is the conservative default. It produces approximately one signal firing per organization per quarter for organizations with active issue trackers.

Many small organizations do not use the public issue tracker at all, they use Linear or Notion or another off-GitHub tracker. For these organizations, the signal cannot be computed and should be skipped rather than treated as zero. The Scout Score in GitDealFlow gives a `null` rather than a low score for organizations with insufficient issue-tracker activity, to avoid penalizing them for using a different tool.

The signal is most informative for organizations with a baseline issue-close median in the seventy-two-to-three-hundred-and-sixty-hour range, that is, three to fifteen days. Below that, the team is already operating at very tight cadence and there is no room to tighten further; above that, the team's issue tracker is essentially neglected and the signal is meaningless.

## When to act

A Signal 5 firing on its own is not a reason to act. It is, as I said at the start, a tie-breaker rather than a primary trigger. The right interpretation is: in your active-watch list, when two startups score similarly on Signals 1, 2, and 3, weight your attention toward the one that is also showing Signal 5 firing. The combination has the highest base-rate hit rate in the seven-signal stack and the longest lead time.

A Signal 5 firing is also a useful diagnostic for cold reading a startup you do not yet know. If you are evaluating an unfamiliar company and want a quick read on whether the founding team has operational discipline, the issue-tracker hygiene gives you the answer in five minutes. A clean tracker with sub-hundred-hour median is consistent with a team that will execute well; a messy tracker is not necessarily disqualifying, but it is a yellow flag worth investigating.

## Exercises

**Exercise 5.1.** Pick five startups from your watchlist. Compute the issue-close median over the trailing thirty days and the prior thirty days. Which fire above the fifty-per-cent-tightening threshold? Which pass the volume floor and creation-rate sanity check?

**Exercise 5.2.** Pick three Series A announcements from the past sixty days. Plot the issue-close-median trajectory over the eight weeks preceding each announcement. Which would have fired Signal 5 ahead of the announcement, at what lead times?

**Exercise 5.3.** Pick a startup whose issue tracker you suspect is poorly maintained. Compute the cadence anyway. What does the median look like? What is the volume floor? What does this tell you about the team?

**Exercise 5.4.** Pick a startup that recently hired a new technical lead (often discoverable from LinkedIn). Compute the issue-cadence trajectory before and after the hire. Document the visual signature of a one-time triage event versus a sustained cadence tightening.

The third exercise is the most useful for cold-reading new candidates. A team that does not maintain its public issue tracker at all is a team that has either chosen a private tracker (which is fine, signal-wise; you just can't compute) or is not yet operating at the discipline level you want to see at Series A, that distinction matters.
