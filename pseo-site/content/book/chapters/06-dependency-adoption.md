# Signal 6 — Downstream Dependency Adoption

## What it is

Downstream dependency adoption is the count of distinct other repositories that import a startup's published package — npm, PyPI, Maven, crates.io, Go modules, RubyGems, etc. — measured over a rolling thirty-day window. The signal fires when the count of new downstream importers in the most recent thirty days is more than three times the count in the prior thirty days, and the absolute volume is above twenty new importers.

This signal is specific to companies whose product is, in some form, a software library or SDK that other developers integrate into their own code. That covers most developer-tools companies, most infrastructure companies, most AI-tooling companies, and many open-source-led platform companies — but it does not cover SaaS companies whose product is a hosted application with no developer-facing library, nor consumer companies, nor most marketplace and commerce companies.

For the companies it does cover, dependency adoption is the second-most-honest signal in the book — second only to commit-velocity acceleration. The reason is that dependency adoption is not visible in the company's own GitHub at all; it lives entirely in third-party repositories. The company cannot perform it without the cooperation of strangers.

Median lead time in the SSRN-indexed panel was thirty-eight days before the Series A announcement, with an interquartile range of twenty-four to fifty-six days. Hit rate, for the subset of companies where the signal is computable, was seventy-three per cent.

Seventy-three per cent is the second-highest hit rate in the book.

## Why it works

A startup's product-market fit, for a developer-tools or infrastructure company, is often most visible in the dependency graphs of other companies. If real builders are adding the package to their `package.json`, their `requirements.txt`, their `go.mod`, their `Gemfile`, then the company is one push of distribution from category leadership. If they are not, the company is in the early-traction or no-traction stage, and a Series A round is premature.

Series A rounds for developer-tools companies are usually led by funds that have looked at the dependency adoption curve as part of their thesis. The fund's analyst has, somewhere in their investment memo, a chart of weekly downstream importers over the past six months. If that chart is up-and-to-the-right with a recent acceleration, the round is much more likely to happen at all and to happen at a higher price.

The acceleration happens for two compounding reasons. First, real product-market fit produces acceleration in adoption — early adopters integrate the package, write blog posts about it, recommend it to their teams, and the diffusion compounds. Second, the company itself often runs a developer-relations push in the run-up to the round, producing tutorials, blog posts, conference talks, and integrations with popular frameworks. The DevRel push amplifies the underlying fit-driven adoption.

The combination produces a sharp recent acceleration that is visible to anybody who is watching the public dependency graphs — which, again, almost nobody is.

## How to compute it

The computation is package-registry-specific. Each registry exposes a different API and different concept of "downstream dependency". The most informative are:

**npm.** For npm packages, use the npm registry's downloads endpoint to get weekly download counts and the GitHub dependency graph (via the `dependents` view in the package's repository, accessible programmatically via the dependency-graph BigQuery dataset or via a simple HTML scrape of the dependents page). The download counts are a useful sanity check; the dependents count is the actual signal. Use the public Libraries.io API as the canonical source for cross-registry dependent counts — Libraries.io updates roughly daily and exposes a clean JSON.

**PyPI.** For PyPI packages, use the public BigQuery dataset `bigquery-public-data.pypi.file_downloads` for weekly download counts, and the GitHub dependency graph for the dependents-repository count. Libraries.io also covers PyPI.

**Maven.** Use Sonatype Central's API for download counts and the Maven Central dependency-graph data for dependent artifact counts.

**crates.io.** Use the crates.io public API for download counts. The dependents count is also exposed via crates.io and via Libraries.io.

**Go modules.** Go's proxy.golang.org index lets you sample importer counts indirectly; Libraries.io has cleaner aggregated data.

The cleanest implementation is to wrap Libraries.io as the primary source and fall back to registry-specific APIs where Libraries.io coverage is partial. Libraries.io is rate-limited at one request per second on the free tier, which is sufficient for a watchlist of two to three hundred organizations.

The signal-firing computation, given the per-registry data, is:

1. For each package owned by the organization, pull the trailing-sixty-day count of distinct importing repositories.
2. Bucket into two consecutive thirty-day windows.
3. Compute the new-importer count for each window.
4. The signal fires when `recent / prior > 3` and `recent > 20`.
5. Apply the registry-coverage caveat: if the organization publishes packages on multiple registries, sum the new-importer counts across registries before applying the threshold. Libraries.io exposes this aggregation directly.

## What it looks like in the wild

Concrete example: the npm package for a developer-tools company we tracked through 2023. Weekly download counts grew steadily through Q2 from roughly twelve thousand to roughly forty-five thousand, then jumped to one hundred and twenty thousand in mid-Q3 over a four-week window. The dependent-repository count grew from roughly four hundred and fifty to roughly nine hundred and forty over the same window — a hundred-and-ten per cent increase in eight weeks.

The Series A was announced in early November. The Signal 6 firing on the dependent-repository count happened in late September; lead time was thirty-six days, in the middle of the interquartile range.

The investor who was tracking the package on Libraries.io had the firing in their inbox the same week it happened. The investor who was relying on Crunchbase Pro and PitchBook for developer-tools deal flow had nothing on this company until the announcement, because the consensus tools do not surface dependency-graph metrics.

## Distinguishing genuine adoption from artifacts

Three artifacts mimic genuine adoption.

**The vendor-template effect.** A startup publishes a `create-something` CLI scaffolding tool that generates a starter project containing the company's own packages as dependencies. Every project generated from the scaffolder counts as a "downstream importer", even though the importer never made an active choice. Mitigation: discount the dependent-count by the proportion of importers whose `package.json` matches the scaffolder's template signature — usually identifiable by a stable filename pattern like `template-default-name-*`.

**The peer-dependency cascade.** A package that is a peer dependency of a more popular framework will see its dependent-count rise whenever the framework releases a new version. This is real adoption in a sense — the integration is being maintained — but it is not predictive of anything other than the parent framework's continued popularity. Mitigation: read the importing repositories' content; if they are mostly forks or templates of a single framework, discount accordingly.

**The internal-monorepo effect.** Some companies' own internal repositories show up in the dependent-count when those repositories happen to be public. This double-counts the company's own use of its own package. Mitigation: filter out importing repositories whose owner is the same organization, plus a small list of known related orgs.

## Threshold guidance

The three-times-prior, twenty-absolute-floor threshold is the default for medium-sized developer-tools companies. For very early-stage projects (fewer than fifty total dependents), drop the absolute floor to ten and accept higher noise. For very mature projects (more than ten thousand total dependents), the percentage threshold is too easy to satisfy from baseline noise; switch to an absolute-increase threshold of two hundred new dependents in thirty days.

The signal is most informative for projects in the fifty-to-two-thousand baseline-dependents range — that is, established enough to have a real adoption curve, not so established that noise dominates.

For organizations that publish packages on multiple registries, sum across registries. For organizations that publish no packages, skip the signal and weight the other six accordingly. The Scout Score returns a `null` Signal 6 score for non-publishing organizations rather than a zero, to avoid penalizing companies whose business model does not produce a public package.

## When to act

A clean Signal 6 firing — real adoption acceleration, no false-positive flags, a developer-tools or infrastructure company — is a high-conviction reason to start active diligence. The lead time is comfortable, and the signal correlates strongly enough with downstream business metrics that the founders are usually receptive to a conversation.

The right preparation is to read the importing repositories' content. If you can identify three or four real production deployments of the package — companies you recognize, companies whose code is publicly visible — you have material for the founder conversation that puts you ahead of every other investor.

## Exercises

**Exercise 6.1.** Pick five developer-tools startups from your watchlist. Identify their primary published package on each registry. Pull the trailing-sixty-day dependent-count trajectory from Libraries.io. Which fire above the threshold?

**Exercise 6.2.** Pick a Series A announcement of a developer-tools company from the past ninety days. Plot the dependent-count trajectory from Libraries.io for the eight weeks preceding the announcement. Did Signal 6 fire? At what lead time?

**Exercise 6.3.** For a firing from Exercise 6.1, sample twenty of the new importing repositories. How many are real production deployments versus templates, scaffolders, or fork-of-fork artifacts? Document the distribution.

**Exercise 6.4.** Identify a startup whose business model is pure SaaS (no developer-facing package). What is the signal-stack analog of dependency adoption for them? (Hint: think about embed integrations, webhook subscribers, public API tokens.)

The fourth exercise is open-ended. The honest answer is that dependency adoption does not have a clean analog for pure SaaS, which is why Signal 6 is restricted to developer-tools and infrastructure companies. Do not try to force a substitute; just weight the other six signals accordingly.
