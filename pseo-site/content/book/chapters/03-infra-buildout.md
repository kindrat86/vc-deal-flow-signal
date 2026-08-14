# Signal 3, Infrastructure Repository Buildout

## What it is

Infrastructure repository buildout is the appearance of new public repositories under a startup's organization that contain operational infrastructure code, Terraform modules, Helm charts, Kubernetes manifests, CI/CD configuration, runbooks, database schemas, observability dashboards. The signal fires when two or more such repositories appear in a thirty-day window, or when a single such repository accelerates from zero to a sustained commit cadence in fourteen days.

In plain English: the company is publicly building the operational scaffolding that a Series-A-funded startup needs and a seed-stage one does not.

The median lead time for this signal in the SSRN-indexed panel was forty-one days before the Series A announcement, with an interquartile range of twenty-eight to sixty-three days. The hit rate was sixty-two per cent, lower than the first two signals but with a useful complementary property: it fires earliest of the seven, often before the commit acceleration on the main product repository is visible.

Sixty-two per cent at forty-one days lead time is a meaningfully different bet than sixty-eight per cent at thirty-three days. The earlier-firing signals get you into conversations before the main acceleration is visible to the rest of the market.

## Why it works

A startup at the Series A stage is preparing for a step-change in operational complexity. The seed-stage company runs on three or four EC2 instances, a managed database, a single CI pipeline, and a Slack channel for alerting. The Series-A-funded company runs on Kubernetes (or an equivalent), terraformed across two or three environments, with a real observability stack, on-call rotation, and a deploy pipeline that does not require any one engineer to be online for a release to ship.

The transition between those two states takes between two and four months of focused engineering work. The work is mostly infrastructure code, and infrastructure code at modern startups is increasingly maintained as separate repositories, partly because monorepo tooling for infra is still less mature than for application code, partly because access controls on infra are easier to manage at the repository level, and partly because mature engineering teams default to small focused repositories for components that have distinct deploy lifecycles.

The result is that a startup ramping up for a Series A round will, in the eight to twelve weeks before the announcement, publicly create or substantially expand a set of infra-shaped repositories. These repositories are usually under-noticed, because they are not the product. They are also more honest than the product repository, because their existence is much harder to fake, you cannot spin up a credible Terraform module suite for a company that is not actually scaling its infrastructure.

## What to look for

Six repository archetypes are diagnostic. None of them is sufficient on its own, but the appearance of two or more in the same thirty-day window is a strong signal.

**The Terraform or OpenTofu modules repository.** Usually named `infra`, `terraform`, `tofu`, `cloud`, or with the company name plus `-infra`. Contains module declarations, environment-specific variable files (often `dev.tfvars`, `staging.tfvars`, `prod.tfvars`), and a small README. The presence of three distinct environments configured here is a strong signal, most seed-stage companies have one or two environments at most.

**The Helm chart or Kubernetes manifests repository.** Usually named `charts`, `helm`, `k8s`, or `manifests`. Contains chart definitions, values files, and template manifests. A new chart for an internal control plane, an internal-tools backend, or a shared platform service is especially diagnostic, these things are not built by seed-stage companies because seed-stage companies have no internal users to serve.

**The deploy or CI/CD repository.** Usually named `deploy`, `release`, `ci`, or `pipeline`. Contains GitHub Actions workflows, GitLab CI definitions, ArgoCD manifests, FluxCD manifests, or similar. The new presence of multi-environment deploy gating, manual approvals on production, and rollback automation is diagnostic.

**The observability or runbook repository.** Usually named `observability`, `runbooks`, `oncall`, or `dashboards`. Contains Grafana dashboard JSON, Prometheus alert rules, Datadog monitors, or written runbooks for common incidents. New runbooks especially are a strong indicator that the company is anticipating an on-call rotation, which only makes sense at scale.

**The schemas or contracts repository.** Usually named `schemas`, `proto`, `contracts`, or `api-spec`. Contains protocol buffer definitions, OpenAPI specs, or similar. The new presence of API versioning patterns (`v1/`, `v2/` directories, deprecation notices, contract tests) suggests the company is starting to treat its API as a stable public contract, which only makes sense once there is a real customer base.

**The internal-tools repository.** Usually named with the company prefix plus `-tools`, `-admin`, `-internal`, or `-ops`. Contains internal admin dashboards, customer-support tooling, or operational scripts. Internal tools are built when the team is large enough that the founders cannot personally do customer support and infrastructure ops, which usually corresponds to the eight-to-fifteen-engineer size that follows a Series A.

## How to compute it

The computation requires walking the organization's repositories rather than just the primary one. The procedure:

1. List all repositories under the organization, excluding archived and forked.
2. For each repository, retrieve its creation date and its first-commit date. The two are usually within hours, but if they differ by weeks the repository was likely imported from elsewhere and should be flagged for manual review.
3. For each repository, classify it as `product`, `documentation`, `template-or-example`, `infrastructure`, or `other`, using a heuristic based on the repository name, the file types in the root tree (e.g. presence of `terraform/`, `helm/`, `*.tf`, `Chart.yaml`, `Dockerfile`, `kustomization.yaml`), and the README contents.
4. The signal fires when two or more repositories classified `infrastructure` are created within a thirty-day window, or when a single such repository moves from a baseline of fewer than five commits per fourteen-day window to a sustained ten or more commits per fourteen-day window across two consecutive periods.
5. Apply the team-size scaling: very small companies (one to three engineers) often create infra repositories slowly even at scale, because the founder is a part-time DevOps engineer; very large companies (fifty-plus engineers) create infra repositories continuously, regardless of fundraise. The signal is most informative for the four-to-twenty-engineer band.

The classification heuristic is implemented in the GitDealFlow MCP server as the `classify_repository` tool. Implementing it yourself is straightforward but takes longer than the corresponding code for Signals 1 and 2, budget an hour rather than fifteen minutes.

## What it looks like in the wild

Concrete example: a public infrastructure-tools company we tracked through 2024. In the eight weeks preceding their Series A announcement they created four new repositories under their organization. Two of them were Terraform modules for AWS and GCP respectively. One was a Helm chart for their control-plane service. One was a runbooks repository with seven written runbooks for common operational incidents.

None of the four repositories had any presence in the company's blog posts, on their landing page, or in their public roadmap. They were created with very minimal READMEs and no documentation polish. They were, in other words, internal infrastructure work that happened to be hosted on the public side of the company's GitHub for convenience and access-control simplicity.

The signal fired forty-eight days before the Series A announcement, which is in the middle of the interquartile range. By the time the Series A was announced, the four repositories had a combined three hundred and fifty commits and twelve contributors, six of whom resolved on LinkedIn to recent infrastructure hires.

The investor who was watching the organization's repository creation feed had a forty-eight-day head start on every other investor, including ones with warm intros to the founder, because none of the warm-intro investors thought to look at the repository creation feed.

This is the gap. It is small. It is real. It is repeatable.

## False positives, four patterns to recognize

**The open-source platform play.** A startup whose product is itself an open-source platform (e.g. an open-source observability stack, an open-source database, an open-source ML platform) creates infra-shaped repositories continuously as part of the product. The signal fires for them every quarter. Mitigation: classify the product itself; if the product is an open-source platform, raise the threshold or use the product-repo commit-velocity signal instead.

**The acquisition integration buildout.** A startup that has just made a tuck-in acquisition often creates a flurry of infra repositories to integrate the acquired team's systems. Mitigation: cross-check against public M&A coverage; if there is a recent acquisition, the infra signal is explained.

**The compliance-driven scaffolding.** A startup that is going through SOC 2 or HIPAA compliance for the first time will create a set of infra repositories specifically to satisfy auditor requirements, runbooks, access reviews, change management. This often coincides with a Series A run-up but sometimes precedes it by months. Mitigation: read the runbook contents; compliance-driven runbooks have characteristic phrasing and structure that is distinguishable from operationally-driven ones.

**The hobby-project namespace.** Some founders share their personal GitHub organization with their startup's. The personal projects show up in the same repository feed and can mimic an infra buildout if the founder has a hobby of building Terraform modules. Mitigation: check the contributor list of each new repo; a real company-infra repo has multiple internal contributors within four weeks; a founder-hobby repo stays single-contributor.

## Threshold guidance

The two-infra-repos-in-thirty-days threshold is the default. For very small organizations (single founder, no team), require three repositories rather than two, because solo founders create infra repos on hobby cadence. For very large organizations (twenty-plus engineers), the threshold is too easy to satisfy from baseline activity; use the commit-velocity-on-existing-infra-repo variant instead.

The single-repo acceleration variant, where one new infra repo goes from zero to ten commits per fortnight across two consecutive periods, fires less often but with substantially higher hit rate (around seventy-three per cent in the SSRN panel). It is the better signal for medium-sized organizations where the baseline new-repo creation rate is too high to use the count-based variant cleanly.

## When to act

A clean firing of Signal 3, two new infra repositories or one accelerating one, with no false-positive flags, is an early-stage signal that warrants adding the company to your active-watch list and starting passive monitoring. It is too early, on its own, to start active diligence; the signal precedes the round by enough that the founders may not yet have begun the conversation circuit.

The right play is to combine Signal 3 with Signal 1 and Signal 2. When all three fire concurrently, within a thirty-day window of each other, the combined firing rate is the highest in the seven-signal stack. That is the moment to reach out for a conversation, even if the signals are still ten weeks ahead of the announcement.

## Exercises

**Exercise 3.1.** Pick five startups from your watchlist. List all repositories under each organization. Classify each into product, documentation, template, infrastructure, or other. How many companies have one or more infrastructure repositories? Of those, how many created the infrastructure repositories in the past sixty days?

**Exercise 3.2.** For one Series A announcement from the past ninety days, walk back the organization's repository creation history. How many infrastructure repositories existed at the announcement date? How many existed sixty days before? Ninety days before? Document the buildout trajectory.

**Exercise 3.3.** Pick a startup that you suspect is preparing for compliance certification (you can usually tell from the presence of a `compliance` or `audit` repository, or from public hiring posts mentioning SOC 2). Look at their infra-repo trajectory. How is it different from a startup ramping for a Series A?

**Exercise 3.4.** For one of your tracked startups, set up a recurring weekly check on their organization's repository creation feed. After eight weeks, what is the baseline new-repo rate? What would you consider an above-baseline week?

The fourth exercise establishes the per-organization baseline that you will need to interpret the signal correctly. Without a baseline you will overweight every new repo.
