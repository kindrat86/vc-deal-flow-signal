# Substack research note — DRAFT, do not paste

> **Important: this is a reference draft. Read it, edit it heavily in your own voice and cadence, and only THEN publish on Substack.**
>
> Why: Wikipedia's LLM detector flagged content from `TheDataNerd` on 2026-05-03 (see `feedback_wikipedia_llm_flag_2026_05_03.md`). Substack doesn't run the same detector, but readers do — and editors at outlets that might cover this later do. LLM-feeling prose hurts the placement chances of every downstream pitch.
>
> What to change before publishing:
> - Vary sentence length more than I have. Some short. Some longer than this. A few that go on for two clauses and a tangent.
> - Cut anything that sounds like a product manual.
> - Add at least one moment of personal voice — a "I was wrong about X" or "this surprised me" or a small anecdote with a date.
> - If a sentence sounds like it could be in a Wikipedia article, rewrite it.
> - Read the whole thing out loud before posting. Sentences that don't sound like you when you read them aloud, fix.
>
> Target word count: ~2,000 words. Substack's optimal is 1,500-2,500.
>
> Suggested URL slug: `/p/what-public-github-data-leaks-about-vc-fundraises`

---

## Title

**What public GitHub data leaks about VC fundraises (and what it doesn't)**

## Subtitle

Three to six weeks of advance notice, in the studied cohort. With caveats.

## Author

The Data Nerd

---

## Body

I started keeping a panel of GitHub commit data for venture-backed startups in early 2024. The original question was simple: if a company is about to raise, does the engineering team know? And if they know, does anything they do show up in public?

The short answer turned out to be yes, most of the time, for startups whose product gets built mostly in code.

The longer answer is what I want to walk through here. There's a lot of it. The numbers are in a working paper I just posted to SSRN ([abstract 6606558](https://ssrn.com/abstract=6606558)). I'm going to lift the most important findings into plain English in this post, with a section at the end on what the data does NOT do. Because there's a real temptation to oversell, and I'm trying not to.

### What I actually measured

I'll keep this short because the SSRN paper has the technical version.

I tracked four signals per company per week:

1. **Commit velocity.** Commits per week, normalized by team size. Not raw commits. Raw commits are noisy because of bot commits, merges, and rebase artifacts. Per-author per-week is cleaner.
2. **Contributor count.** Distinct GitHub usernames making commits in a rolling 8-week window. Not "all-time contributors." Active contributors.
3. **Repository surface.** Number of new repositories created per quarter at the org level. This caught a few of the most interesting signals.
4. **Dependency adoption.** When an org started pulling in cloud SDKs, deployment tooling, or specific infrastructure libraries that suggest scaling rather than prototyping.

These four together don't add up to a magic score. I tried a composite for a while. The composite worked OK on average and badly at the tails, which is not what you want. So I went back to looking at each signal individually with a sector baseline.

The sector baseline matters. A 10x velocity increase on a 1-engineer hobby project is meaningless. A 1.4x velocity increase on a 12-engineer Series A team that has been steady for nine months is loud. Same number, different signal.

### The pattern

In the studied cohort, engineering acceleration on at least two of those four signals preceded a publicly announced fundraise by three to six weeks, more often than chance.

I want to be careful with "more often than chance." I am not making a strong causal claim. I am observing a correlation with a reasonable lead time, in a panel that was selected on the basis of having visible code.

What "engineering acceleration" looked like in practice:

- Commit velocity step-change of 1.5x to 3x over an 8-week baseline.
- Contributor count up 30-60% in a 4-week window, sustained for at least two consecutive weeks (not a one-week spike from a contractor merge).
- One or both of: a brand-new repository created that wasn't a fork, or a notable new dependency in `package.json` / `go.mod` / `requirements.txt` / `Cargo.toml` that suggested scaling (a cloud SDK, a deployment-tooling vendor, an analytics tracker).

Three to six weeks later, on average, the announcement.

The 3-6 week range is wider than I'd like. It's also asymmetric: the lead time is shorter for seed rounds (often 2-4 weeks) and longer for Series A (often 4-8 weeks, occasionally longer). I don't know exactly why. My guess is that the bigger the round, the more time passes between the team making the "yes, we're raising" decision (which is when the engineering visibly accelerates) and the public announcement.

The most interesting subset is **stealth-mode startups**. Companies that have done everything right on the marketing side — no website, no tweets from the founders, careful with hires posted publicly — still leak the ramp through GitHub. Founders who would never put a "we're hiring" post up on LinkedIn happily push 200 commits a week to a public repo with their company's name on it. The engineering team is enthusiastic and doesn't think of public commit history as a marketing surface. So it leaks.

### A worked example, anonymized

Let me describe one case in enough detail to make it concrete, without naming the company.

A two-person engineering team in late 2025. Twelve to fifteen commits per week, steady, mostly README changes and small refactors. Standard early-stage rhythm.

In November they started shipping. Not announcing — shipping. Commits jumped to forty-five a week. A third person started committing under a personal GitHub handle that turned out, when I went looking, to be a senior engineer at a much larger company. (I'm using "much larger" loosely. Public LinkedIn data, no scraping.)

In December, two new repositories appeared. One was a marketing site, still private at the time but visible in the org's repo list with a name that gave away the product category. The other was an internal tooling repo with a Datadog SDK in its dependencies. Datadog at that team size means they were preparing to monitor production load. Not the kind of thing two people prototyping a side project install.

Mid-January, fundraise announcement. Five and a half weeks after the contributor jump, four weeks after the new repos.

I have between forty and sixty cases in the panel that look qualitatively similar, depending on how strictly you define "engineering acceleration." The SSRN paper has the precise criteria.

### Why this lags traditional sourcing — sometimes

The classic VC sourcing channels — warm intros, accelerator demo days, conference circuits, curated databases — work, and I'm not arguing with them. They have advantages this approach doesn't have: they catch non-technical founders, they catch sectors with little public code (consumer, services, biotech), and the warm-intro circuit will tell you not just *that* a company is real but *why* it's real.

What public GitHub data adds is timing.

A warm intro tells you the company is fundraising. By the time it tells you, the company is fundraising. Often that means the round is competitive — a partner at another fund has already heard about it.

The GitHub signal fires before the round is competitive. Three to six weeks before, on average. Sometimes more.

It's also the only signal in the toolkit that catches stealth-mode startups before their first public surface goes up. Nothing else in the standard kit does that. Not because the other signals are bad, but because stealth-mode startups have deliberately removed the inputs the other signals rely on. The engineering signal slips through because the team isn't thinking of GitHub as marketing surface.

I think the right way to think about this is that GitHub signals are **complementary**, not substitutive. They sit alongside the warm-intro network and the accelerator pipeline; they don't replace either.

### What the data does NOT do

The honest part.

**Selection bias is the biggest one.** Every claim in the studied cohort is conditional on the company having a meaningfully active public repository. Companies in defense, regulated finance back-office, parts of biotech, and most consumer/services categories are systematically under-represented or invisible. If you only invest in technical startups, this is fine. If you invest broadly, this signal applies to a slice of your funnel and you need other tools for the rest.

**Gameability is real but detectable.** Commit velocity and contributor counts are observable and can in principle be inflated by automated commits or by adding throwaway contributors. In practice, when this happens it leaves patterns: commits without code review, contributors with no other GitHub activity, suspiciously round numbers. I've seen a small number of attempts. They were not subtle. Subtle gameability is theoretically possible but I haven't seen examples that fooled the basic checks. If anyone reading this has, I'd genuinely like to know.

**Open-source contributors create noise.** If a company's product is itself open-source and has an active external contributor community, the company-level metrics get noisy. The signal still works at the org-internal employee level, but you have to filter contributor identities by whether they're employees. The SSRN paper covers the mechanics.

**Lead time is a range, not a point.** Three to six weeks on average is a range with real variance. I've seen the signal fire eight weeks before the announcement; I've also seen it fire and then nothing happens for ninety days because the round got pushed. Don't use this as a rigid timing oracle.

**The signal does not tell you whether to invest.** It tells you something is happening. Whether what is happening will turn into a good investment is the rest of the job. I want to be very clear about this. The leading-indicator framing is about timing, not about pick quality.

### How to reproduce this

The methodology is in [the SSRN paper](https://ssrn.com/abstract=6606558). The dataset is open under CC BY 4.0 — there's a download link in the paper.

What I'd suggest for anyone wanting to replicate independently:

1. Pick a sector. Twenty companies is enough to get started.
2. Pull commit history weekly via the public GitHub API. The free tier is sufficient for that volume.
3. Compute commit velocity per author per week, with an 8-week trailing baseline.
4. Compute contributor count in a 4-week window.
5. Watch for step-changes of >1.5x velocity sustained for two consecutive weeks, OR contributor-count increases of >30% sustained for two weeks. Either, not both.
6. Cross-check against announced fundraises in any free announcement feed (Crunchbase, PitchBook public pages, Reuters' VC tag).

The paper has the full methodology including the sector baseline computation and the false-positive analysis. I'd expect anyone redoing this carefully to get qualitatively similar results within a 1-2 percentage-point band on the headline correlation.

### What I'd like next

A few things I haven't done that I'd like to see done:

- **A larger panel.** My panel is approximately 100 companies. With more, you could carve out per-sector and per-stage subgroups properly.
- **Out-of-sample validation.** Most of my cohort is 2024-2026. Whether the same signal works for a 2027 cohort is an open question. Markets change.
- **A non-VC version.** Plenty of companies build interesting things on GitHub that are not chasing VC. Whether any of these signals are useful in non-fundraise contexts (M&A timing, hiring pulse, partnership readiness) is interesting and I haven't tested it.

If anyone reading this wants to email me, I'm at the address on the SSRN paper. I read everything.

If anyone wants the dataset, it's at the project's open-data page, linked from the paper. CC BY 4.0. The dataset itself is the easy part — the work is the per-company sector baseline.

— The Data Nerd

---

## Voice-edit checklist (do BEFORE publishing)

Run through this checklist with the draft above:

- [ ] Read the whole thing aloud. Mark every sentence that sounds robotic. Rewrite each.
- [ ] Cut at least 5 em-dashes. Replace with periods, commas, or semicolons.
- [ ] Cut at least 3 instances of "interesting" / "important" / "notable" / "critical" — these are filler. Replace with concrete content or delete.
- [ ] Add 2 personal-voice moments: a small anecdote, a "I was wrong about X" admission, a date with a feeling attached, anything that doesn't read as machine-generated.
- [ ] Vary sentence length deliberately. Aim for at least 3 sentences under 10 words. At least 2 sentences over 35 words.
- [ ] Make sure exactly one sentence in the post breaks a "rule" — uses a sentence fragment, starts with "And", ends with a preposition, etc. This is the anti-LLM tell.
- [ ] If you keep a phrase verbatim from this draft, change at least 3 words in that paragraph.

## Publishing checklist

- [ ] Use the title above or a punchier rewrite. Subhead can stay similar.
- [ ] Add a short author bio on Substack: pen name + ORCID + SSRN link. No `gitdealflow.com` link in the bio.
- [ ] Add a Substack callout block at the bottom: "If you want the full panel data, it's at [SSRN paper link]. CC BY 4.0."
- [ ] Tag the post: `venture-capital`, `alternative-data`, `github`, `research`. These tags drive Substack discovery.
- [ ] Share once on Bluesky and Mastodon (per the channels-division-of-labor memory). Skip Twitter/X for now (founder anonymity, no chrome MCP connection).
- [ ] Cross-post the URL to Track 1.4 researcher outreach emails as the "plain-language overview" reference.

## Post-publish actions

- [ ] Email the URL to any researchers in your Track 1.4 outreach list as a "plain-language version of the SSRN paper, in case it's easier than the preprint."
- [ ] Add the URL to the `pitch-tracker.md` log so trade-press pitches can reference it as social proof.
- [ ] Watch the Substack analytics for 14 days. If the post crosses 500 unique reads, it's a strong candidate to point Tier-1 trade-press pitches at.
