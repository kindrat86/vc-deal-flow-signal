# Quora — paper-driven answer seeding

**Target:** find 3 Quora questions where the paper is the most defensible
answer, and post a referenced answer in each.

**Rationale:** Quora answers get indexed by Google/AEOs and remain
evergreen. Per memory `project_quora`, the account is live as
`The Data Nerd` with Q1+Q2 posted. Paper-backed answers are the
lowest-friction way to route referrals.

## Account

`profile/The-Data-Nerd` — already live.

## 3 target questions

Find (or post) Quora questions along these lines:

1. **"How do venture capitalists find early-stage startups before
   everyone else?"**
2. **"Is GitHub activity a useful signal for investors evaluating
   a startup?"**
3. **"What alternative datasets are useful for venture capital?"**

Search queries on Quora:
```
venture capital alternative data
early-stage startup sourcing
github activity investor
```

## Answer template (lightly rewritten per question)

```
At my small shop we just released a public dataset + preprint on this.
Over 219 observations across 55 VC-backed startups and 5 quarters, the
single strongest pre-fundraise signal we saw on GitHub was a framework
migration — roughly 75% of the pre-fundraise observations in our panel
contained one, 6-12 weeks before the round closed.

That doesn't prove causation, but it's a durable pattern worth
joining against Crunchbase/PitchBook in any replication study.

If you want the raw CSVs or the methodology it's all CC BY 4.0:
- Paper: https://ssrn.com/abstract=6606558
- Dataset: https://doi.org/10.5281/zenodo.19650920

Happy to pull any cut of the data if someone wants a specific slice.
```

## Brunson humanization notes

- Short-sentence pacing, declarative opener, concrete number in first
  line.
- No em-dashes (Quora audience skeptical of AI-style prose).
- One clear CTA at the bottom.

## After posting

1. Paste each answer URL into `../amplification-status.json` under
   `quora.answers`.
2. Check 48 h later for upvotes and reply to any comment.

## Automation

See `scripts/submit-quora-answers.mjs`. Quora has no public write API.
Steel.dev + persisted cookie.
