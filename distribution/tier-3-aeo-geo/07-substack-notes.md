# Substack Notes — 15 Ready-to-Post Notes

**Platform reality:** Notes are Substack's in-network short-form feed. They surface in recommendations if they get early engagement. Character target: 500-800 chars, reads in 15-20 seconds.

**Posting account:** Create a free Substack account under signal@gitdealflow.com or use existing. Link the handle to @gitdealflow domain in the profile. Do NOT start a Substack newsletter (per memory: `channels rejected: Substack (splits list)`).

**Cadence:** 2-3 notes per day, mixed with 5-10 restacks of other users' notes (Substack algorithm rewards engagement ratio). Skip restacks of direct competitors.

**Style:** Declarative opener. One concrete data point. One-sentence close. No em-dashes. Statements beat questions.

**Link rules:** 1 in 5 notes links to a blog post. The other 4 are pure idea-drops to build brand recognition. Over-linking looks promotional and gets downranked.

---

## Batch 1 — Engineering signal fundamentals

### Note 1

> Stars don't predict fundraises.
>
> Commit velocity change does.
>
> A startup doubling its 14-day commit count is the strongest leading signal you can pull from public data. Works 3-6 weeks before the round announcement.
>
> The metric every VC uses by 2027.

### Note 2

> Hedge funds bought alt-data ten years ago.
>
> VCs are about six years behind, but the catchup started.
>
> The signals that work in private markets aren't credit card or satellite. They're team-behavior: commits, contributor growth, repo creation. Engineering acceleration is the sharpest.

### Note 3

> Commit velocity is how fast the team ships.
>
> Engineering acceleration is whether they're shipping faster than last month.
>
> Velocity is informative. Acceleration is predictive.
>
> The derivative is the alpha.

### Note 4

> Most VCs say their edge is their network.
>
> Networks are shared. The startup in your inbox is also in every other GP's inbox this week.
>
> Data edge is what separates timing. Networks are how you close. Different problem, different tools.

---

## Batch 2 — Specific metrics

### Note 5

> +50% commit velocity in 14 days isn't a fluke.
>
> +50% sustained over two consecutive 14-day windows is a regime change.
>
> One window catches release spikes. Two windows filter them out.
>
> That's the threshold.

### Note 6

> Signal lead times by type:
>
> Engineering acceleration: 3-6 weeks before round
> Contributor burst: 4-8 weeks
> Web traffic spike: 4-6 weeks
> Hiring posts: 4-8 weeks
> Social mentions: 1-2 weeks
>
> Engineering leads. Social confirms.

### Note 7

> A GitHub org with 5 active contributors going to 10 in 30 days just hired.
>
> They hired because they raised, or they're about to.
>
> The cap table moves before the press release does. The public commit log catches it first.

### Note 8

> Contractor bursts look like hiring bursts for one week.
>
> Filter by contributors with 3+ merged PRs in the window and the noise drops out.
>
> Small rule, big cleanup.

---

## Batch 3 — Mistakes + anti-patterns

### Note 9

> Four GitHub metrics VCs overweight and shouldn't:
>
> Stars. Forks. Lifetime commits. Top-contributor PR count.
>
> Four metrics that actually correlate with outcomes: velocity change, contributor delta, new-repo type, and commit distribution.
>
> Different metrics entirely.

### Note 10

> Kubernetes at 4 engineers is a red flag.
>
> Vercel plus Postgres at 4 engineers is the right stage.
>
> Over-engineered infrastructure signals the team is optimizing for future problems instead of shipping current ones.
>
> Stack fit to stage matters.

### Note 11

> AI startups distort commit signals.
>
> LLM-generated code inflates velocity without reflecting team scale.
>
> In AI sectors, weight contributor count higher than commit count. One engineer with Cursor can produce 500 commits a week.
>
> The noise is real. Adjust the priors.

---

## Batch 4 — Contrarian / punchy

### Note 12

> Crunchbase is a lagging indicator.
>
> By the time a fundraise lands in Crunchbase, the round closed three to six weeks ago.
>
> The question isn't what's on Crunchbase. It's what will be on Crunchbase in Q3.

### Note 13

> Most deal flow tools are CRMs.
>
> Affinity, Visible, Edda, Zapflow. Good for organizing. Don't source deals.
>
> Sourcing requires signal generation. That's a different product category. Still mostly DIY inside top funds.

### Note 14

> Pre-seed is not signal-free.
>
> Founders often push personal GitHub commits on a problem for months before incorporating.
>
> A personal account with sustained weekend commits on a specific niche is a stronger pre-seed signal than a brand-new org page.
>
> Watch the builder, not the entity.

### Note 15

> The last decade of hedge fund alpha was built on alt-data.
>
> The next decade of VC alpha will be.
>
> The firms building data teams now are setting up a structural advantage the network guys can't match in five years.

---

## Linked-note variants (post 1 per week, not more)

### Note L1 (link to blog post)

> I watched 2,000 startup GitHub orgs for a year.
>
> Four patterns consistently predicted fundraises by 3-6 weeks:
> engineering acceleration, contributor burst, infrastructure buildout, framework migration.
>
> Full breakdown of what worked and what didn't: [gitdealflow.com/blog/5-github-patterns-that-predict-fundraises](https://signals.gitdealflow.com/blog/5-github-patterns-that-predict-fundraises)

### Note L2 (link to blog post)

> Commit velocity is noisy. Weekly seasonality dominates raw data.
>
> Aggregate to 14-day windows. Compute rate of change. Require two consecutive positive windows above +50%.
>
> That's the clean signal.
>
> Methodology: [gitdealflow.com/blog/commit-velocity-explained](https://signals.gitdealflow.com/blog/commit-velocity-explained)

### Note L3 (link to blog post)

> Post-investment, GitHub becomes an early-warning system.
>
> A 50% drop in commit velocity over two months precedes the "team issues" email by a full quarter.
>
> Four metrics worth monitoring monthly: [gitdealflow.com/blog/startup-engineering-metrics-investors-should-track](https://signals.gitdealflow.com/blog/startup-engineering-metrics-investors-should-track)

---

## Posting schedule (7 days, 2-3 per day)

| Day | Notes to post |
|-----|----|
| Mon Apr 21 | 1, 2, 3 |
| Tue Apr 22 | 4, 5 |
| Wed Apr 23 | 6, 7, L1 (linked) |
| Thu Apr 24 | 8, 9 |
| Fri Apr 25 | 10, 11, 12 |
| Sat Apr 26 | 13, 14, L2 (linked) |
| Sun Apr 27 | 15, L3 (linked) |

**Engagement routine before each post session (2 min):**
- Restack 3-5 notes from people in VC/startup/data space
- Reply to 2 notes with a genuine short comment
- Then post the daily batch

This matches Substack's engagement-ratio algorithm. Pure broadcast posting gets downranked.

---

## Cross-post strategy

All 15 notes can be cross-posted to:
1. **Medium Notes** (1:1, same text, platform doesn't care)
2. **LinkedIn** (expand 3 into full posts with more context — 150-200 words each)
3. **Bluesky** (same text, hashtag `#VC #altdata`)

Do NOT cross-post to Twitter; Twitter drafts are managed separately per memory (@sipiteno, tight 280-char limit, trim before posting).

---

## 30-day measurement

- Log impressions + likes + restacks for each note in `marketing/substack-notes-log.md`
- Promote any note crossing 20+ likes to a Medium post or a short Dev.to note
- Notes that hit 50+ likes: promote to a full blog post on gitdealflow.com (flip the direction — note becomes the summary, blog becomes the deep dive)
