# Harvard Dataverse — dataset mirror

**Target URL:** https://dataverse.harvard.edu/

**Rationale:** Harvard Dataverse is the largest academic dataverse
installation. Assigns DOIs, indexed by Google Dataset Search, OAI-PMH.
The Harvard domain carries very high academic credibility (DA 93+).

## Prerequisites

- Register at https://dataverse.harvard.edu/dataverseuser.xhtml?editMode=CREATE
  using `signal@gitdealflow.com`. Institutional affiliation optional;
  pick `Independent researcher`. Verify email.
- Enable ORCID (same iD from `04-orcid.md`).

## Create a Dataverse (collection)

Before uploading a dataset, create a collection to hold future datasets:

1. Root → `Add Data → New Dataverse`.
2. Name: `VC Deal Flow Signal`
3. Identifier: `vc-deal-flow-signal`
4. Category: `Researcher`
5. Dataverse contact email: `signal@gitdealflow.com`
6. Affiliation: `VC Deal Flow Signal`

The URL becomes: `https://dataverse.harvard.edu/dataverse/vc-deal-flow-signal`.

## Add dataset

Inside the new Dataverse → `Add Data → New Dataset`.

**Dataset fields:**

- **Title:**
  `Startup GitHub Engineering Velocity Panel — companion dataset to SSRN paper 6606558`
- **Author:** `The Data Nerd` (Independent)
- **Author identifier:** ORCID iD
- **Contact email:** `signal@gitdealflow.com`
- **Description:** same block as Figshare (see `07-figshare.md`).
- **Subject:** `Business and Management`, `Computer and Information Science`, `Social Sciences`
- **Keywords:** `venture capital; alternative data; GitHub; open source; engineering velocity; startup analytics; panel data`
- **Related publication:**
  ```
  The Data Nerd. (2026). A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations. SSRN. https://ssrn.com/abstract=6606558
  ```
- **Related data:** `https://doi.org/10.5281/zenodo.19650920`
- **Notes:** `Mirror of primary Zenodo deposit. Live-refresh CSV at https://signals.gitdealflow.com/api/signals.csv.`
- **Language:** `English`
- **Production date:** `2026-04-19`
- **Distribution date:** `2026-04-19`

**License:** `CC BY 4.0`

**Files to upload:** same set as Figshare (see `07-figshare.md`).

## After publish

1. Note the Dataverse DOI (format: `doi:10.7910/DVN/XXXXXX`).
2. Paste into `../amplification-status.json` under `harvard_dataverse`.
3. Add Harvard DOI to Zenodo record's related-identifiers
   (IsAlternateOf + IsPublishedIn).
4. Update Wikidata paper item Q139493250 with P2699 (URL of related
   dataset) pointing at the Harvard Dataverse record.

## Automation

See `scripts/submit-harvard-dataverse.mjs`. Dataverse has a full
REST API (Native API + SWORD) — if the API token is generated once
from user profile, the script can upload fully unattended.

### Dataverse Native API one-liner (after login)

```bash
curl -H "X-Dataverse-key:$API_TOKEN" \
     -X POST \
     -F 'file=@distribution/dataset/startup_signals.csv' \
     "https://dataverse.harvard.edu/api/datasets/:persistentId/add?persistentId=doi:10.7910/DVN/XXXXXX"
```
