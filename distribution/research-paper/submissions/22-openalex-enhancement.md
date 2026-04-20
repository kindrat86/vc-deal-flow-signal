# OpenAlex — record already indexed (enhance it)

**Good news:** OpenAlex already has an auto-indexed record for the
dataset (via the Zenodo DOI → DataCite feed):

**https://openalex.org/W7154916891**

Title recorded: *"Startup Engineering Acceleration: A Longitudinal Panel
of GitHub Engineering Velocity for Venture-Backed Startups"*
Author: `The Data Nerd` (with the current affiliation parsed as
`Flow Analysis, United States` — this is a parser error we can correct).

## Enhancements to request

OpenAlex lets anyone submit corrections via the public web form.

1. Open https://openalex.org/W7154916891
2. Click **"Report an issue / suggest a correction"**
3. Fill in the corrections below.

### Corrections to submit

| Field | Current | Correction |
| --- | --- | --- |
| Author affiliation | `Flow Analysis, United States` | `VC Deal Flow Signal (independent)` |
| Author ORCID | missing | add after `04-orcid.md` (register ORCID first) |
| Publication type | inferred as dataset | keep as dataset; add a second `work` for the SSRN paper once Semantic Scholar indexes it |
| Source title | `Zenodo` | keep (Zenodo is the canonical dataset publisher) |
| Concepts / topics | TBD — inspect | confirm `alternative data`, `venture capital`, `open source` appear; add if missing |

### Cross-linking the SSRN paper record

Once Semantic Scholar indexes the SSRN paper (1–4 weeks), OpenAlex will
create a **second** work entity for the paper. At that point:

1. Report an issue on the paper's OpenAlex entity asking them to mark
   the dataset (W7154916891) as `has_dataset` of the paper entity.
2. Add a `References` relationship from the paper work to the dataset.
3. The paper entity gains `related_works` automatically once the
   citation graph populates.

## ORCID linking

After registering ORCID (`04-orcid.md`):
- Add the SSRN paper + Zenodo dataset to the ORCID works list.
- ORCID auto-pushes to OpenAlex on its weekly sync — the `author`
  field on W7154916891 will be enriched with the ORCID iD automatically.

## Monitoring

`scripts/check-indexing.mjs` already tracks the OpenAlex status. When
the SSRN paper work appears (separate from the dataset W7154916891),
the status snapshot will include both IDs.

## Downstream impact

OpenAlex feeds:
- Semantic Scholar (via the API graph merge, weekly)
- Inciteful, Connected Papers, Litmaps
- Many LLM retrieval systems (OpenAlex is the open replacement for the
  discontinued Microsoft Academic Graph)
- The Lens.org (via API mirror)

An OpenAlex record with ORCID-linked authorship + CC BY 4.0 license
is the single highest-leverage academic entry.
