# Quora — 15 Ready-to-Post Answers

**Post cadence:** 2 per day over 7-8 days, not all at once (Quora downranks rapid-fire posting).
**Account:** @sipiteno or a new account. If new, do 3-5 upvotes + 1 non-promotional answer before posting promotional content.
**Link rules:** Link to the blog post that directly matches the question, never the homepage. Never paste the same link twice in one answer. End with a soft CTA.
**Style:** 150-250 words, declarative opener, concrete numbers, punchy close. No em-dashes. Questions beat no-context lists.

---

## Q1. [How do VCs find promising startups early?](https://www.quora.com/How-do-VCs-and-investors-find-companies-to-invest-in)

> Most VCs don't find startups early. They find them at the same time everyone else does — the warm intro, the demo day, the tweet that goes viral.
>
> The structural problem: networks are shared. Andreessen, Sequoia, Accel, and the guy in the 47th downtown co-working space all hear about the same deal the same week.
>
> What actually generates early-stage edge in 2026:
>
> 1. **Engineering signals.** A startup's public GitHub commits show 3-6 weeks before a fundraise lands. You can measure commit velocity rate-of-change. A 14-day window where activity doubles is a serious tell.
> 2. **Hiring signals.** Job posts for senior engineers and go-to-market roles move 4-8 weeks ahead of a round.
> 3. **Web traffic acceleration.** 4-6 weeks of lead time.
> 4. **Social mentions.** Already late. Treat as confirmation, not discovery.
>
> The network still matters — it's how you close. But "find" and "close" are different problems.
>
> If you want the framework for reading GitHub: [How to Read GitHub Signals for Startup Investing](https://signals.gitdealflow.com/blog/how-to-read-github-signals-for-startup-investing).

---

## Q2. [What tools or websites do venture capitalists use to find promising startups?](https://www.quora.com/What-are-the-tools-or-websites-that-venture-capitalists-use-to-find-promising-startups)

> Tool stacks break into three layers.
>
> **Layer 1 — Coverage databases.** Crunchbase, PitchBook, CB Insights, Dealroom. These tell you who exists and what they've raised. Lagging indicators. Everyone has them.
>
> **Layer 2 — CRM and workflow.** Affinity and Harmonic for relationship intelligence. Visible, Zapflow, Edda for deal pipeline. These organize the firm, they don't generate alpha.
>
> **Layer 3 — Signal generation.** This is where the edge lives. Alternative data sources: LinkedIn hiring data (via Revelio, Draup), web traffic (SimilarWeb, SemRush), app downloads (Sensor Tower), and public engineering activity (GitHub via custom pipelines or [GitDealFlow](https://gitdealflow.com)).
>
> The shift over the last three years: top funds now have a data engineer on the investment team. The tool isn't off-the-shelf anymore. It's a pipeline.
>
> If you want to understand the GitHub-signal side, [this piece](https://signals.gitdealflow.com/blog/what-is-deal-flow-signal) covers the four signal types and their lead times.

---

## Q3. What is alternative data in venture capital?

> Alternative data in VC is any quantitative, public-but-underused signal that surfaces startup traction before traditional channels do.
>
> Hedge funds have used alt data for a decade. Credit card transactions, satellite imagery, foot traffic, app downloads. VC is about six years behind.
>
> The categories that work in private markets:
>
> - **Engineering activity** (GitHub commits, contributor growth, new repos) — 3-6 week lead time
> - **Hiring signals** (job boards, LinkedIn) — 4-8 weeks
> - **Web traffic** (SimilarWeb, Cloudflare Radar) — 4-6 weeks
> - **Developer adoption** (npm downloads, PyPI installs, Docker pulls) — variable
>
> The reason engineering activity is the highest-value signal for private markets: you can't fake commits at scale, the data is free via GitHub's API, and it precedes every other visible milestone.
>
> Full breakdown: [Alternative Data in Venture Capital: The Complete Guide](https://signals.gitdealflow.com/blog/alternative-data-venture-capital).

---

## Q4. How do I do technical due diligence on a seed-stage startup?

> Seed-stage TDD is different from later rounds because there's almost nothing to audit.
>
> No SOC2. No production incidents. No customer churn. The stack is a prototype.
>
> What you can actually measure at seed:
>
> 1. **Commit consistency.** Open their GitHub org. Are there daily commits, or is the graph mostly empty with occasional Sunday-night bursts? Consistent shipping predicts execution.
> 2. **Contributor growth rate.** Three contributors in March, eight in April is a real signal. A 50%+ contributor jump in a month usually means a hire wave funded by a friends-and-family round.
> 3. **Repo creation pattern.** New infrastructure repos (deployment, observability, internal tools) mean the team is building for scale. Only product repos means they're still in prototype.
> 4. **Tech choices vs. stage.** Kubernetes at 4 engineers is a red flag. Vercel + Postgres at 4 engineers is the right stage.
>
> This screens in 5-10 minutes per company. The framework: [GitHub Due Diligence for VCs](https://signals.gitdealflow.com/blog/github-due-diligence-for-vcs).

---

## Q5. How do VCs source deals outside of their network?

> Non-network sourcing is where modern VC is actually differentiated.
>
> The answer three years ago was "attend more demo days, write more blog posts, get on more podcasts." That's still true but it's not the differentiator anymore.
>
> What top-quartile funds do now:
>
> 1. **Automated scraping of public data.** Job boards, GitHub, Product Hunt, app stores, hiring pages. Feeds a weekly internal review.
> 2. **Sector-specific listening.** A fintech fund watches Discord servers and Reddit subs for fintech builders. An AI fund watches Hugging Face uploads.
> 3. **Outbound based on data.** When a company crosses a signal threshold (say, 50% commit velocity growth in 14 days), an associate sends a warm-ish cold email the same day.
>
> The network still closes deals. Data sources them.
>
> If you want to see this in action for the engineering side: [Source Startup Deals Before Crunchbase](https://signals.gitdealflow.com/blog/source-startup-deals-before-crunchbase).

---

## Q6. What GitHub metrics actually predict startup success?

> Stars don't predict anything. Forks don't predict anything. PRs merged on popular open-source repos are a proxy for engineering talent but not for company success.
>
> The metrics that correlate with startup traction:
>
> 1. **Commit velocity rate-of-change.** Not absolute velocity — the derivative. A startup going from 30 commits/week to 90 commits/week in 14 days is the strongest leading signal.
> 2. **Active contributor count growth.** A 50%+ bump in a month usually means a hiring round funded by recent capital.
> 3. **New repository creation.** Especially infrastructure repos — the company is moving from prototype to platform.
> 4. **Commit distribution.** One contributor doing 90% of commits is fragile. Five contributors at 15-25% each is healthy.
>
> None of these work in isolation. Together they describe execution cadence.
>
> The pattern writeup: [5 GitHub Patterns That Predict Fundraises](https://signals.gitdealflow.com/blog/5-github-patterns-that-predict-fundraises).

---

## Q7. What is engineering acceleration and how do investors measure it?

> Engineering acceleration is the second derivative of commit activity. Velocity is how fast the team is shipping. Acceleration is whether they're shipping faster than they were last month.
>
> Investors care about acceleration, not velocity, for a simple reason: startups that double their shipping pace right before a round, consistently, outperform startups with high-but-flat shipping.
>
> Measurement, concretely:
>
> - Baseline: 14-day rolling commit count across the org's repos
> - Comparison: current 14-day window vs. previous 14-day window
> - Signal: +50% or more, sustained over two consecutive 14-day windows
>
> Why sustained matters: a single spike often means a bug bash or a release crunch, not real acceleration. Two consecutive +50% windows means the team genuinely scaled their output.
>
> Context and definition: [What Is Engineering Acceleration?](https://signals.gitdealflow.com/blog/what-is-engineering-acceleration).

---

## Q8. Can GitHub activity predict when a startup will raise?

> Not precisely. But it predicts the window.
>
> Pattern observed across 350+ startup organizations:
>
> - Engineering acceleration (+50% commit velocity sustained two weeks) → 3-6 weeks later, announcement
> - Contributor burst (+50% active contributors in 30 days) → 4-8 weeks, announcement
> - Infrastructure buildout (new deploy/observability repos) → mid-round, often post-term-sheet
>
> The signals don't tell you "they'll close on March 15." They tell you "this team is in round-prep mode right now."
>
> Useful for warm outbound: reach out before the round is public and you're competing with everyone else on the cap table.
>
> The lead-time breakdown: [What Is Deal Flow Signal?](https://signals.gitdealflow.com/blog/what-is-deal-flow-signal).

---

## Q9. What alternative data sets do hedge funds use that VCs could also use?

> Most hedge fund alt-data doesn't translate to private markets. Credit card data and foot traffic need a public-company baseline.
>
> The alt-data that crosses over:
>
> 1. **Hiring data.** Revelio, Draup, LinkedIn scraping. Works for both public and private.
> 2. **Web traffic.** SimilarWeb, Cloudflare Radar. Works early-stage if the product is web-based.
> 3. **App downloads.** Sensor Tower, data.ai. Only useful for consumer mobile.
> 4. **Developer adoption.** npm, PyPI, Docker Hub. Useful for dev-tool startups specifically.
> 5. **Public engineering activity.** GitHub, GitLab. This one is VC-native more than hedge-fund-native, and it's where most of the early-stage signal is.
>
> The private-markets playbook is not a clone of the hedge-fund playbook. The signals that survived the crossover are the ones tied to team behavior, not consumer behavior.
>
> The framework: [Alternative Data in Venture Capital](https://signals.gitdealflow.com/blog/alternative-data-venture-capital).

---

## Q10. How do pre-seed investors find deals if there's no data?

> There's always data. Pre-seed just means less of it and higher noise.
>
> Where pre-seed signal lives:
>
> 1. **GitHub before the company exists.** Founders often push code under a personal account months before incorporating. A personal account with sustained weekend-and-evening commits on a specific problem is stronger than a brand-new org.
> 2. **LinkedIn "Stealth" or recent departures.** Engineers leaving FAANG and going "Building something new" = pre-seed candidate pool.
> 3. **Twitter/X dev accounts.** Builders tweet. Follow accounts that post technical threads about a specific problem space.
> 4. **Dev community participation.** Consistent contributors to niche OSS projects often become founders in that niche.
>
> The common thread: pre-seed signal is about the builder, not the company. You're investing in the person's trajectory before they have an entity.
>
> Practical workflow: [Pre-Seed Deal Sourcing via GitHub](https://signals.gitdealflow.com/blog/pre-seed-deal-sourcing-github).

---

## Q11. What is commit velocity and why does it matter for investing?

> Commit velocity is the number of commits a startup's engineering team ships in a defined window, typically 14 days.
>
> Why investors care: commit velocity is the closest public proxy for how fast a team is turning effort into shipped product.
>
> What the number means:
>
> - **0-30 commits/week:** Prototype phase or very small team
> - **30-100 commits/week:** Active product development, usually 3-8 engineers
> - **100-300 commits/week:** Scaled team, shipping fast
> - **300+ commits/week:** Either a large team or a heavy CI/automation footprint
>
> Raw velocity is less important than velocity change. A team doubling from 30 to 60 is a stronger signal than a team flat at 300. The derivative is what predicts breakouts.
>
> Definition and edge cases: [Commit Velocity Explained](https://signals.gitdealflow.com/blog/commit-velocity-explained).

---

## Q12. Is it legal and ethical to use GitHub data for investment decisions?

> Legal: yes. Public data scraped within GitHub's API terms is standard practice and used by every major fund running a data operation.
>
> Ethical: depends on how you use it.
>
> What's fine:
> - Scoring companies on public engineering activity
> - Using commit velocity as a deal-sourcing filter
> - Mentioning "I saw your team's commits have been accelerating" in a first meeting (founders usually take it as a compliment)
>
> What's not fine:
> - Contacting individual contributors directly for recruiting or info
> - Using repo contents to reverse-engineer product strategy and share with competitors
> - Poaching from portfolio company GitHub activity
>
> The line: team-level aggregate signals are fair game. Individual-developer-targeted outreach is not.
>
> Framework: [GitHub Due Diligence for VCs](https://signals.gitdealflow.com/blog/github-due-diligence-for-vcs).

---

## Q13. What engineering metrics should VCs track in portfolio companies?

> Post-investment, GitHub becomes an early-warning system.
>
> Four metrics worth monitoring monthly:
>
> 1. **Commit velocity trend.** A 50% drop over two months usually precedes the "team issues" email by one to two quarterly board updates.
> 2. **Active contributor count.** Sudden drop = attrition. Sudden jump with no prior announcement = stealth hiring you didn't fund.
> 3. **Deploy frequency.** If the team stops merging to main, something is blocked — usually architecture debate, a bad migration, or a product pivot in progress.
> 4. **Repo sprawl.** Too many new repos = scattered focus. Only one repo getting all commits = narrowing to real product.
>
> None of these replace board updates. They surface questions to ask during the call.
>
> The monitoring framework: [Engineering Metrics for Investors](https://signals.gitdealflow.com/blog/startup-engineering-metrics-investors-should-track).

---

## Q14. How should I evaluate an AI startup's technical team before investing?

> AI startups distort normal signals. Three calibrations to apply:
>
> 1. **Discount raw commit velocity.** LLM-generated code inflates the number. A 500-commit week can be one engineer running Cursor on a big refactor. Weight contributor count and code-review activity higher.
> 2. **Check model/infra repos specifically.** Is the team pushing evaluation harnesses, prompt versioning, data pipelines? Or is the repo just a thin API wrapper over OpenAI? The difference separates "real AI team" from "wrapper with a landing page."
> 3. **Look at the team's prior shipping record.** In AI, model choice will change three times before Series A. What matters is whether the team ships and iterates. Their GitHub history before this company is the strongest predictor.
>
> Velocity alone is noisy in AI. Composition, direction, and track record carry the weight.
>
> Deep dive: [AI Startup Signals 2026](https://signals.gitdealflow.com/blog/ai-startup-signals-2026).

---

## Q15. What are the biggest mistakes investors make when reading GitHub data?

> Four recurring errors:
>
> 1. **Worshipping stars.** Stars are a vanity metric. Unrelated to revenue, unrelated to funding, unrelated to team quality. Ignore them.
> 2. **Counting total commits forever.** Lifetime commits mean nothing. The right window is the last 14-30 days. Startup dynamics change monthly.
> 3. **Ignoring contributor distribution.** A repo with one person doing 95% of commits is one quit-notice away from a zombie project. Spread matters.
> 4. **Extrapolating from one week.** Release weeks inflate velocity. Holidays deflate it. Always look at two consecutive windows before drawing conclusions.
>
> The fifth mistake, which is strategic not tactical: treating GitHub as the primary signal. It's a filter, not a thesis. Combine with hiring, web traffic, founder evaluation, and market analysis.
>
> Full list: [Investor Mistakes in Reading GitHub Signals](https://signals.gitdealflow.com/blog/investor-mistakes-github-signals).

---

## Post schedule (7 days, 2/day)

| Day | Q# | Link target |
|-----|----|-|
| Mon Apr 21 | Q1, Q2 | how-to-read-github-signals, what-is-deal-flow-signal |
| Tue Apr 22 | Q3, Q4 | alternative-data-venture-capital, github-due-diligence-for-vcs |
| Wed Apr 23 | Q5, Q6 | source-startup-deals-before-crunchbase, 5-github-patterns-that-predict-fundraises |
| Thu Apr 24 | Q7, Q8 | what-is-engineering-acceleration, what-is-deal-flow-signal |
| Fri Apr 25 | Q9, Q10 | alternative-data-venture-capital, pre-seed-deal-sourcing-github |
| Sat Apr 26 | Q11, Q12 | commit-velocity-explained, github-due-diligence-for-vcs |
| Sun Apr 27 | Q13, Q14 | startup-engineering-metrics, ai-startup-signals-2026 |
| Mon Apr 28 | Q15 | investor-mistakes-github-signals |

**Tracking:** After each post, record the Quora URL + upvote count in `marketing/quora-log.md`. Revisit at 14 and 30 days; top 3 performers get boosted to Medium as standalone pieces.
