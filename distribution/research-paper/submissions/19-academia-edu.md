# Academia.edu — profile + paper upload (low priority)

**Target URL:** https://www.academia.edu/

**Rationale:** Academia.edu is a large but polarizing platform — some
academics boycott it over its paywalls and aggressive upsells. Still
indexed by Google and valuable for discovery. **Low priority** —
prefer ResearchGate (`03-researchgate.md`) and Semantic Scholar
(`05-semantic-scholar.md`) first.

## Submission flow

1. Register at https://www.academia.edu/signup.
2. Choose `Independent researcher` in affiliation.
3. Upload `../paper.pdf` via `My Profile → Upload a Paper`.
4. Add title, abstract (from `../abstract.txt`), keywords, research
   interests (match the tags used in other drafts).
5. Set privacy: `Public`.

## Research interests to pick

- Venture Capital
- Open Source Software
- Alternative Data
- Panel Data
- Startup Finance

## License

Academia.edu has no per-paper license field. Add a footer line in the
paper description:
`Licensed CC BY 4.0. Companion dataset at https://doi.org/10.5281/zenodo.19650920.`

## After upload

1. URL format: `https://independent.academia.edu/TheDataNerd/Papers/...`
2. Paste into `../amplification-status.json` under `academia_edu`.
3. Ignore Academia.edu's "Premium" upsell — the free tier is fine.

## Automation

See `scripts/submit-academia-edu.mjs`. Academia.edu has no public API;
Steel.dev flow similar to ResearchGate.
