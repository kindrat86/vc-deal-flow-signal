# arXiv endorsement plan (Fix #9)

**Status:** blocked on endorsement — not a code-addressable fix. This file documents the human-loop process so it doesn't get lost.

## What's needed

arXiv requires an **endorsement** from an established author in the target category before a first-time author can submit. For this paper (venture alt-data / empirical finance / applied quantitative methods), the right categories are:

- `q-fin.GN` (Quantitative Finance — General Finance)
- `econ.GN` (Economics — General Economics)
- Secondary: `stat.AP` (Statistics — Applications)

## Candidate endorsers

Academic authors who have recently published in q-fin.GN or econ.GN on adjacent topics:

| Name | Affiliation | Relevant work | Contact path |
|---|---|---|---|
| Gordon Burtch | Boston University | Alternative data in crowdfunding / venture | University email (public) |
| Ethan Mollick | Wharton | Entrepreneurial finance, AI-era startups | Wharton email (public) |
| Sabrina Howell | NYU Stern | Venture capital empirical research | NYU email (public) |
| Filippo Mezzanotti | Northwestern Kellogg | VC / private capital empirical | Kellogg email |
| Ramana Nanda | Imperial College | Entrepreneurship + finance | Imperial email |

**Do not spam.** Pick one, write a 6-sentence email with the SSRN preprint attached, explain the dataset + methodology in 2 sentences, and ask *politely* for an endorsement. If declined, wait a week and try one more. Do not send more than 3 total requests.

## Email template

```
Subject: arXiv endorsement request — engineering-velocity panel on 55 venture-backed startups

Hi Professor [Name],

I'm writing to request an arXiv endorsement for a short empirical paper that
may be relevant to your work on [specific topic you've read of theirs].

The paper presents a longitudinal panel of GitHub engineering-velocity
signals across 55 venture-backed startups over five quarters, with a
falsifiable hypothesis test: that sustained commit-velocity acceleration
precedes fundraise announcements by 6-12 weeks on average. The dataset is
published on Zenodo under CC BY 4.0 (DOI 10.5281/zenodo.19650920) and
mirrored on Kaggle and data.world.

I'm targeting q-fin.GN as the primary category. The SSRN preprint is here:
[SSRN URL once available — currently under editorial review].

I would be grateful if you could consider endorsing the submission. Happy
to share the manuscript in full if useful.

Thank you for your time,
[Your real name]
[Affiliation or email address]
```

## Alternatives if endorsement is blocked for >60 days

1. Submit directly to **SSRN** only (no endorsement needed; already in progress)
2. Submit to **OSF Preprints** (no endorsement, less prestigious than arXiv but indexed)
3. Submit to **ResearchGate** (self-publish, good for citation tracking)
4. Submit to **Zenodo** as a "preprint" document alongside the dataset (already hosted)
5. Publish on **RePEc** (for economics specifically) — accepts first-time authors via institutional affiliation

## Why this matters

arXiv indexing → Papers With Code indexing → broad academic citability → LLM training-data inclusion. The chain unlocks several AIO/AEO signals that Zenodo alone doesn't reach. It's worth the 2-4 weeks of human-loop effort even at modest odds.

## Dependencies

- SSRN approval (currently under review at [distribution/dataset/LIVE-URLS.md](dataset/LIVE-URLS.md))
- arXiv endorser identified + contacted
- arXiv manuscript formatted to arXiv LaTeX guidelines

All three must clear before this fix can be closed. Expect realistic timeline: **4-8 weeks** from today.
