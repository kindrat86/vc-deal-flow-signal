# RePEc / IDEAS / EconPapers — self-archive submission

**Target URL (archive host):** https://ideas.repec.org/
**Submission guide:** https://ideas.repec.org/getstarted.html
**Contact:** `repec@repec.org`

**Rationale:** RePEc is the standard economics/finance research archive.
IDEAS, EconPapers, NEP, Socionet, and CitEc all pull from RePEc. JEL
codes on the paper (G24 venture capital, L26 entrepreneurship, O32 R&D,
C81 micro data) map cleanly to this audience. This is the single highest
credibility anchor for VC-alt-data researchers.

## How RePEc works

RePEc is a **decentralized** archive — authors don't submit papers
directly. Instead, an institution or research site registers a *RePEc
archive*, then uploads RDF-style templates describing each paper. IDEAS
etc. are front-ends that aggregate every archive.

Two paths:

### Path A — Self-hosted archive (preferred)

Host the RePEc templates on `signals.gitdealflow.com/repec/` and email
RePEc to register the archive. One-time setup, ~2 hours.

1. Create `pseo-site/public/repec/` directory with:
   - `gitdealflowarch.rdf`   (archive template)
   - `gitdealflowseri.rdf`   (series template — "Working Papers")
   - `paper-6606558.rdf`     (paper template for this preprint)
2. Deploy the pSEO site (auto on merge to main).
3. Email `repec@repec.org` with:
   - Subject: `New RePEc archive registration — GitDealFlow`
   - Body: link to the archive URL + confirm the three template URLs resolve.
4. Wait ~7 days for indexing. Once accepted, the paper appears at
   `https://ideas.repec.org/p/gitdealflow/<id>.html`.

### Path B — Use MPRA (Munich Personal RePEc Archive)

If hosting the templates is too much, upload to MPRA instead:
https://mpra.ub.uni-muenchen.de/

MPRA is a mirror archive that anyone can submit to (free, no account
approval beyond email verification). Paper appears on RePEc automatically
after MPRA staff review (typically 3–5 business days).

Recommended for v1. Migrate to Path A when the research site is worth
curating.

## MPRA submission fields

- **Author:** `The Data Nerd`, affiliation `VC Deal Flow Signal (independent)`
- **Title:** same as SSRN
- **Abstract:** paste from `../abstract.txt`
- **Keywords:** `venture capital; alternative data; GitHub; open source; engineering velocity; startup analytics; panel data`
- **JEL codes:** `G24, L26, O32, C81`
- **Date posted:** `2026-04-20`
- **Full text:** upload `../paper.pdf`
- **Original URL:** `https://ssrn.com/abstract=6606558`
- **Related data:** `https://doi.org/10.5281/zenodo.19650920` (CC BY 4.0)

## Downstream indexers

Once RePEc-registered the paper is automatically picked up by:
- IDEAS/RePEc (https://ideas.repec.org/)
- EconPapers (https://econpapers.repec.org/)
- Socionet
- CitEc (citation tracking)
- Google Scholar (secondary via RePEc)
- Microsoft Academic Graph (via NLP partners)
- Semantic Scholar (after ~4-week crawl)

## RePEc archive templates (ready to deploy)

See `repec-templates/` (to be generated). Structure:

```
pseo-site/public/repec/
├── gitdealflowarch.rdf
├── gitdealflowseri.rdf
└── paper-6606558.rdf
```

These are text files. The RePEc schema is documented at
https://ideas.repec.org/t/repectemplates.html.

## Automation

See `scripts/submit-mpra.mjs` (Steel.dev-based, Path B).
