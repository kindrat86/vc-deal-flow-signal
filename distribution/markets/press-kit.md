# Press kit — Series A Race 2026

**Public URL:** https://signals.gitdealflow.com/markets/series-a-race-2026
**Machine-readable JSON:** https://signals.gitdealflow.com/api/markets/series-a-race-2026.json
**Methodology:** https://signals.gitdealflow.com/markets/methodology
**Contact:** signal@gitdealflow.com

---

## One-line pitch
> An open prediction market on which of 5 high-signal early-stage startups raises a Series A first by EOY 2026 — implied odds derived from GitHub commit-velocity, contributor growth, and signal classification. Free, citation-encouraged, machine-readable.

## What's new
First seeded prediction market on startup funding outcomes sourced entirely from public GitHub data. Five Pre-seed and Seed candidates, live implied odds, public methodology, public resolver criteria. The market lives on the methodology page; we don't operate an exchange and don't take positions.

## The 5 candidates (ranked by implied probability)
| Rank | Startup | Sector | Stage | Velocity 14d | Implied odds |
|---:|---|---|---|---:|---:|
| 1 | Zapply Jobs | AI & Machine Learning | Pre-seed | 1,694 (+82%) | 46% |
| 2 | Kanvas (BakaPHP) | Social & Community | Seed | 598 (+32%) | 22% |
| 3 | AtroCore | Enterprise SaaS | Seed | 116 (+38%) | 16% |
| 4 | OpenOLAT | EdTech | Seed | 102 (-33%) | 10% |
| 5 | Lonero | Enterprise SaaS | Seed | 32 (+28%) | 6% |

Residual NO probability (none raise by Dec 31, 2026): 0% in the candidate-relative model; ~50%+ when adjusted for base-rate timing risk (most seed-stage startups don't close Series A in any 7-month window).

## Why this is novel
- Polymarket and Kalshi seed-stage markets are nonexistent — too granular for real-money exchanges, too niche for the curators.
- Manifold has a few "next unicorn" markets but no one mirrors a structured engineering-signal dataset into them.
- VCs running this analysis internally don't publish — every major fund treats commit-velocity work as proprietary.
- Public methodology + public JSON + public resolver = press-citable artifact.

## Quotes (use either, attribute to "The Data Nerd, founder of VC Deal Flow Signal")

> "Every VC tracking-team builds a 'who's about to raise' shortlist from GitHub data. We just made one public — with the math, the candidates, and a hard resolver date."

> "The five startups in this market collectively have 65 contributors and 2,500 commits over the last 14 days. None of them have closed a Series A yet. The model says one of them will by year's end. We'll find out who."

## Compliance notes
- Not investment advice; explicit disclaimer on the page.
- Implied odds are model output, not a real-money bet.
- Author and publisher hold no equity, advisory, or consulting positions in any candidate.
- Source-of-truth dataset (GitHub commit velocity) is CC BY 4.0.
- Resolver criteria public and version-locked: Crunchbase / PitchBook / SEC Form D / company press release.

## Citation block (paste in articles, newsletters, podcasts)
```
VC Deal Flow Signal — Series A Race 2026.
Live implied odds, signals.gitdealflow.com/markets/series-a-race-2026, May 2026.
Machine-readable: signals.gitdealflow.com/api/markets/series-a-race-2026.json (CC BY 4.0).
```

## Founder bio
**The Data Nerd** is the founder of VC Deal Flow Signal (GitDealFlow). The methodology paper is published on SSRN (https://ssrn.com/abstract=6606558, DOI 10.2139/ssrn.6606558) and indexed by OpenAlex, Crossref, Semantic Scholar, Zenodo, and DataCite. ORCID 0009-0002-2222-4112.

## Existing coverage / mentions
- SSRN paper (DOI 10.2139/ssrn.6606558) — methodology peer-visible since 2026-04
- Hugging Face Datasets — full panel mirror at huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal
- MCP Registry — published as `io.github.kindrat86/vc-deal-flow-signal`; Glama A-Tier (4.9/5.0 across 6 tools)
- Wikidata Q139376302
