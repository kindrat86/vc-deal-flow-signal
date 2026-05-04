# Variant 9 — Quora answer

**Cadence:** Monday 18:00 EEST · auto-publish via quora-daily-runner
**CTA:** /predict (single)
**Credential:** "Founder, GitDealFlow — tracking GitHub signals for VCs" (per memory `feedback_quora_credential_required`)
**Question target:** existing Google-page-1 question (per memory `feedback_quora_no_self_created_questions`)

---

## Target question candidates (auto-runner picks the highest-fit live question; do NOT self-create)

1. "How do venture capitalists find startups before they go public?"
2. "What signals do early-stage investors use to identify promising startups?"
3. "How can I find startups that are about to raise a Series A or B?"
4. "Are there any open-source tools for tracking startup activity?"

The auto-runner should select whichever is currently live and ranking on page 1 for the target keyword. If none are live, skip this variant for the week — do not force.

---

## Answer (282 words)

The most underused signal for early-stage diligence is engineering velocity on public GitHub.

Most companies you would want to invest in have at least one public repo. They cannot hide their commit history, contributor count, or release cadence. Long before a round is announced, the engineering org accelerates. Hiring shows up as a contributor count rising. A product launch shows up as deploy frequency spiking. A pivot shows up as new repositories appearing under the org.

I rank 100 startup GitHub orgs every Monday across 20 sectors using four metrics on a rolling 14-day window: commit velocity, contributor count, new repositories, and velocity change versus a trailing baseline. Anything that clears four gates (15+ contributors, 30+ commits per 14 days, 50%+ velocity change, sector fit) moves into a candidate set. The top candidate is published as Signal of the Week.

This week, the pick is airbytehq, an open-source data integration platform. Commit velocity is up 866% over 14 days on a baseline of 1864 commits, with 100 active contributors. The dominant pattern is a deploy frequency spike. In a six-month dataset of 4200 orgs, this specific pattern on a high-contributor base precedes announced fundraises by 2 to 4 weeks.

The framing for a data infrastructure investor: this is the diligence window where warm intros still work. By the time TechCrunch covers a round, the signal will be 6 to 8 weeks old.

You can run the same scorer on any GitHub org for free. There is also an MCP server that lets Claude or Cursor surface the same data inside an IDE. Methodology is published in full and the dataset is CC BY 4.0.

Run it on any org: https://signals.gitdealflow.com/predict
