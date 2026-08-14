# Signal 1, Commit Velocity Acceleration

## What it is

Commit-velocity acceleration is the rate of change of a startup's daily commit count, measured over a fourteen-day rolling window, against the same fourteen-day window of the prior period. In plain English: are they shipping more code this fortnight than last fortnight, and by how much?

It is the highest-yield single signal in this book. If I had to give up six of the seven signals and keep one, this is the one. In the SSRN-indexed panel of two hundred and nineteen Series-A-bound startups, a fourteen-day commit-velocity acceleration of two hundred per cent or more, with two-period confirmation, fired a median of thirty-three days before the Series A announcement. The interquartile range was twenty-one to forty-seven days. The hit rate, defined as the percentage of firings that preceded a fundraise within ninety days, was sixty-eight per cent.

Sixty-eight per cent is not a heuristic. It is a working investor's edge.

## Why it works

A startup's commit graph is the most honest representation of its forward motion. Every other surface is performable. The blog can be written ahead. The press release can be timed. The conference talk can be prepared months in advance and shipped on a stage rented for the purpose. The commit graph cannot be performed, because the commit graph is the work itself. If the commits are not happening, the work is not happening, and the company is not shipping, no matter what the website says.

Acceleration in the commit graph is therefore acceleration in the underlying work. Why does it precede a fundraise so reliably? Because three things tend to happen in the same six-week window in a Series-A-bound company.

First, the founders close the seed round or its extension and begin spending the capital. Capital deployment in early-stage software companies is overwhelmingly engineering hires. Engineers who are hired in week one of a fundraise begin shipping code by week three or four. Their commits show up in the public repository in week three or four. The fundraise announcement happens in week eight, ten, or twelve, after the round legals close and the press team coordinates the announcement with the lead investor's communications calendar. The commit acceleration is therefore visible in the public record several weeks before the announcement.

Second, the founders prepare the metrics deck for the Series A pitch. The Series A pitch deck contains, in almost every case, a section about engineering velocity, usually phrased as "shipping cadence", "release frequency", or "feature velocity". To put a credible number in that section, the founders need to ship more in the run-up than in the run-up's run-up. They know this. They prioritize accordingly. The result is a pre-pitch commit acceleration that is observable to anyone who is looking, but almost nobody is looking.

Third, the technical lead readies the company for due diligence. Due diligence in a Series A includes a code-quality review by the lead investor's technical advisor. The technical lead, knowing this, spends the four weeks before the term sheet on a controlled refactor: increasing test coverage, removing TODOs, paying down obvious tech debt, splitting monoliths into services that the diligence reviewer will read favorably. These commits are usually small but numerous. They show up as a commit-count spike with a high refactor-to-feature ratio.

The combination of the three, a hiring spike, a metrics-deck velocity push, and a diligence preparation refactor, produces a sharp, sustained, two-week acceleration in the commit graph. It does this in the run-up to almost every Series A round. It is one of the closest things to a deterministic signal that exists in venture capital.

## What it looks like in the wild

Let me walk you through one concrete example from the public record. The startup is Modal Labs. Their main repository is `modal-labs/modal-client`. The Series A was announced on October 19, 2023, led by Redpoint, at a forty-million-dollar valuation. Look at the commit graph for the eight weeks preceding October 19.

In the eight weeks before the announcement, the daily commit count on `modal-client` averaged roughly twenty commits per day. In the four weeks before that, weeks twelve through eight before the announcement, the average was roughly nine commits per day. In the four weeks before that, twenty through twelve, the average was roughly six.

The fourteen-day commit-velocity acceleration crossed the two-hundred-per-cent threshold around September 12, 2023. The Series A was announced on October 19. The lead time was thirty-seven days, which is squarely in the median range.

Anybody who was watching the Modal commit graph in mid-September 2023 had a clean signal that the company was about to do something significant, and a fair guess that the something was a fundraise, because the alternative explanations (an open-source release, a hackathon, a security incident) all fail the false-positive checks I will describe in the next section.

You can verify this yourself. Go to `https://github.com/modal-labs/modal-client/graphs/commit-activity` and look at the weekly commit counts for September and October 2023. The acceleration is unmistakable. It is also publicly visible to every investor on the planet, and not one of the consensus deal-flow tools surfaced it.

This is the gap this book is about.

## How to compute it

The formal computation is straightforward. For an organization with a primary repository (and we will discuss how to identify the primary repository when there are several in a moment), the procedure is:

1. Pull the commit list for the past forty-two days using the GitHub commits endpoint, paginated to a sensible page size. Limit to the default branch.
2. Bucket the commits into three consecutive fourteen-day windows: the current window (days zero through fourteen back), the prior window (days fourteen through twenty-eight back), and the prior-prior window (days twenty-eight through forty-two back).
3. Compute the commit count for each window.
4. The fourteen-day commit-velocity acceleration is `(current - prior) / max(prior, 1)`. Express it as a percentage.
5. Apply the two-period confirmation: the signal fires only if `current > prior` *and* `prior > prior_prior`. Without the confirmation, the false-positive rate roughly triples.
6. Apply the absolute-floor filter: if the prior window had fewer than ten commits, ignore the signal, the percentage acceleration is too noisy at low absolute volumes, and you will spend your time chasing tiny repositories that are accelerating from zero to four.

The script that does this is in the methodology chapter, in roughly thirty lines of Python. You do not need to write it from scratch, the GitDealFlow MCP server exposes a `get_commit_velocity` tool that does it for any organization in one call, but you should write it yourself once, on the first reading of this book, because writing it once is the difference between trusting the signal and using it.

## Choosing the right repository

The single most common mistake new readers of this signal make is computing it on the wrong repository. A startup with a public GitHub presence usually has between three and twenty repositories. Not all of them are equally informative. The right repository to compute on is the one that hosts the active product code, the place where the engineering team is shipping the actual product against the company's actual roadmap.

Three patterns to recognize:

The *primary product repository* is the right one. It is usually the largest by line count, the most-starred by far, the one with the highest commit volume in the past ninety days, and the one that contains the production deployment code paths. For a developer-tools company this is almost always the SDK or CLI repo. For an infrastructure company it is the orchestrator or the daemon. For a data-platform company it is the query engine. You can identify it visually in about twenty seconds by sorting the org's repos by recent commit activity.

The *documentation site repository* is the wrong one. Documentation repos accelerate sharply in the run-up to a launch, then plateau. They will fire a false positive on this signal regularly, especially around marketing pushes that have nothing to do with a fundraise. If a startup's most-active repository is a `docs` or `website` repo, you are not looking at engineering acceleration, you are looking at content acceleration.

The *vendored example or template repository* is also the wrong one. These repos accelerate in lockstep with marketing campaigns and developer-relations pushes. They are not predictive of anything except the marketing budget.

When in doubt, compute the signal on the top three repositories by ninety-day commit volume and take the maximum acceleration across them, weighted by recent activity. The GitDealFlow Scout Score uses this composition by default.

## False positives, six patterns to recognize

The two-hundred-per-cent acceleration with two-period confirmation has a sixty-eight per cent hit rate. The thirty-two per cent miss rate consists almost entirely of these six false-positive patterns. Learn them and your hit rate goes up substantially.

**The hackathon spike.** A startup runs an internal hackathon, and the resulting branches all get merged in a single week. The commit graph spikes for three to seven days, then collapses to baseline. The two-period confirmation usually filters this out, because the prior window will not have shown sustained acceleration. Hackathon spikes are short and sharp; Series A run-ups are sustained.

**The dependency-bump bot.** Renovate or Dependabot floods the commit log with bumps. This produces high commit counts but very low diversity in author and content. You can filter it by computing the signal only on commits whose author is not a bot, most reliable filter is the `[bot]` suffix in the GitHub username, plus a small allowlist of known service accounts.

**The documentation sprint.** A founder spends two weeks writing the public documentation in advance of a launch. This produces a real commit acceleration, but on a non-product repository. The mitigation is choosing the right repository (above).

**The security-incident remediation.** A CVE is reported and the team scrambles to patch. This produces a sharp, real commit spike. It is distinguishable from a Series A run-up by inspecting the commit messages, security commits cluster around words like "fix", "CVE", "patch", "harden", and by the timing relative to public disclosure databases.

**The contracting-team migration.** The team hires a third-party contracting firm for a discrete project. The contractors land their work in a four-week burst. This is sometimes confusable with a real hiring spike, but the contributor profiles will reveal the difference: real new hires show up with personal GitHub accounts that have other side-project activity; contracting-firm staff usually show up with accounts that look professional but have no personal activity, and the accounts often appear in coordinated batches with similar account ages.

**The acquisition-prep refactor.** A startup that is preparing for an acquisition rather than a Series A often shows the same diligence-prep refactor pattern. The signal fires correctly that something is about to happen, but the something is an exit, not a Series A. There is a tell: acquisition-prep refactors have a higher proportion of commits to ops, billing, and compliance subsystems (because the acquirer's diligence cares about these), whereas Series-A-prep refactors are weighted toward product and core engineering subsystems. This is a soft tell, not a hard one.

**The open-source release sprint.** The team is preparing a major version release of an open-source package. The acceleration is real, the work is real, but it is not predictive of a fundraise. The tell here is in the contributor mix: an open-source release sprint will pull in a wider community of external contributors than a Series-A-prep refactor, which is overwhelmingly internal-team-only. You can compute the internal-vs-external contributor ratio in the same script.

## Threshold guidance

The two-hundred-per-cent threshold with two-period confirmation is the conservative default. It produces approximately one signal firing per organization per quarter, which is the right cadence for a watchlist of one to two hundred organizations.

If you are running a watchlist of fewer than fifty organizations, you can drop the threshold to one hundred and fifty per cent and accept the higher false-positive rate, because you can manually verify each firing in fifteen minutes. The hit rate at one hundred and fifty per cent drops to roughly fifty-eight per cent, which is still well above any consensus tool's signal quality.

If you are running a watchlist of more than five hundred organizations, raise the threshold to two hundred and fifty per cent and require three-period confirmation. The hit rate at three-fifty with three-period confirmation rises to seventy-six per cent, but the firing rate drops to roughly one signal per organization per six months, which is too sparse for a smaller watchlist.

The defaults in the GitDealFlow Scout Score are tuned for a watchlist of two hundred to three hundred organizations: two hundred per cent acceleration, two-period confirmation, ten-commit absolute floor on the prior window, internal-contributor ratio above seventy per cent.

## When to act

A clean firing of this signal, two-hundred-per-cent acceleration, two-period confirmation, no false-positive flags, is a strong reason to put the company on your active-watch list and start the diligence the same week. Two things to do:

First, look at the contributor list of the new commits in the firing window and identify the new names. Cross-reference them on LinkedIn. If they show "joined in October 2023" type dates that are recent, that is the second signal (next chapter) firing simultaneously, and the combined firing rate is much higher than either signal alone.

Second, check the founder's public posting cadence. If the founder is suddenly posting more on LinkedIn or X about hiring, about the product, about the roadmap, that is a soft confirmation that the run-up is real. Quiet founders during a strong commit acceleration are also fine, some teams build heads-down, but loud founders during a strong commit acceleration are essentially a public announcement that something is about to ship.

A clean firing is not, by itself, a reason to write a check. It is a reason to be in the conversation early. The next steps, meeting the founders, understanding the product, building conviction, are still the work of the investor. The signal does not replace that work. It just gets you to the conversation before the round closes.

## Exercises

The following exercises take fifteen to thirty minutes each and produce concrete output you can paste into your watchlist.

**Exercise 1.1.** Pick five startups you are interested in but have not actively tracked. Compute the fourteen-day commit-velocity acceleration on the primary repository of each. How many fire above two hundred per cent? Of those, how many pass the two-period confirmation? Make a note of which ones do, and re-check them weekly.

**Exercise 1.2.** Pick three Series A announcements from the last sixty days. Find the primary GitHub repository of each. Compute the historical commit-velocity acceleration in the eight weeks preceding the announcement. How many of the three would have fired your two-hundred-per-cent threshold ahead of the announcement? Make a note of the lead times.

**Exercise 1.3.** Pick a startup you have been tracking for at least three months. Compute the commit-velocity acceleration weekly for those three months. Plot the values. What is the variance? At what point would you have called a real acceleration versus baseline noise?

**Exercise 1.4.** Identify one false-positive pattern from the list above (your choice) and find a real example of it in the wild, a startup whose recent commit acceleration is explained by, say, a documentation sprint or a dependency bot rather than a Series A run-up. Document the tells you used to make the call.

The fourth exercise is the most useful. The investors who consistently get value from this signal stack are the ones who have personally caught at least three false positives and remember the patterns. The first true positive feels exciting. The first false positive that you correctly walked away from is the one that makes you a better investor.
