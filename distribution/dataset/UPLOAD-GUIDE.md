# Dataset upload guide — Kaggle, Data.world, Zenodo

This bundle is upload-ready for each target platform. Pick a platform, follow
the specific steps. Total time across all three: ~25 minutes.

## 1. Kaggle (highest-traffic data destination)

**Why:** Kaggle datasets index well on Google, get cited by LLMs, and pass
trust signals to Google Dataset Search.

### Web UI path (fastest)

1. Go to https://www.kaggle.com/datasets → **New Dataset**.
2. Drag all three CSVs into the uploader: `startup_signals.csv`,
   `sector_aggregates.csv`, `signal_type_timeseries.csv`.
3. Title: **VC Deal Flow Signal — Startup Engineering Acceleration**
4. Subtitle: **GitHub commit velocity and acceleration signals across 20
   startup sectors, 5 quarters**
5. Description: paste the body of `README.md` (Kaggle accepts markdown).
6. Tags: `finance`, `venture capital`, `github`, `startups`, `open source`,
   `time series`, `panel data`.
7. License: **CC BY 4.0**.
8. Click **Create Private Dataset** first, verify files render, then **Make
   Public**. (Public from the start is fine too — the private staging step is
   optional.)
9. After publishing, add **gitdealflow.com** to the dataset URL field so the
   landing page shows a link back to you.

### CLI path (if you prefer)

```bash
pip install kaggle
# place ~/.kaggle/kaggle.json from https://www.kaggle.com/settings
cd distribution/dataset/
kaggle datasets create -p .    # reads dataset-metadata.json automatically
```

`dataset-metadata.json` already encodes the title, description, license, and
file list. Edit the `id` field (`gitdealflow/vc-deal-flow-signal`) if you want
a different slug under your Kaggle profile.

## 2. Data.world

**Why:** Data.world is a high-DA (DR 83) platform with strong AEO signals —
ChatGPT, Perplexity, and Gemini pull from it. It natively parses our
`datapackage.json`.

1. Sign up at https://data.world (free tier supports public datasets).
2. **Create dataset** → upload all three CSVs **and** `datapackage.json`.
   (Data.world auto-detects the Frictionless spec and applies the schema.)
3. Title, description, license, tags all populate from `datapackage.json`.
4. Set visibility to **Open**.
5. In the dataset summary, add:
   > Source: https://gitdealflow.com  •  Live API:
   > https://signals.gitdealflow.com/api/signals.csv

## 3. Zenodo (DOI — the big unlock for Papers With Code + SSRN)

**Why:** Zenodo assigns a permanent DOI, which makes the dataset citeable in
academic work and unlocks Papers With Code.

1. Sign in at https://zenodo.org (GitHub OAuth is fastest).
2. **New Upload → Dataset**.
3. Upload all bundle files, including `README.md`, `LICENSE.txt`,
   `CITATION.cff`, `datapackage.json`. Zenodo reads `CITATION.cff`
   automatically and populates author/version fields.
4. Metadata:
   - **Communities:** search for and join *Open Data* and *Economics*.
   - **Keywords:** same as `datapackage.json` — venture-capital, startups,
     github, engineering-velocity, alternative-data, etc.
   - **Related identifiers:** add `https://gitdealflow.com` (type: *is
     supplement to*, relation: *is derived from*).
5. Publish. You will receive a DOI of the form `10.5281/zenodo.XXXXXXX`.
6. **Update `CITATION.cff` and the Dataset JSON-LD on signals.gitdealflow.com
   with the DOI** once assigned — both already expect a placeholder.

## 4. Google Dataset Search

Nothing to submit directly. Google Dataset Search auto-indexes anything with
valid `schema.org/Dataset` JSON-LD markup. The landing page and pSEO home page
already emit this markup with `distribution`, `variableMeasured`,
`measurementTechnique`, `temporalCoverage`, and keyword metadata.

To accelerate discovery:
1. Confirm the page at https://signals.gitdealflow.com validates cleanly at
   https://search.google.com/test/rich-results (type: *Dataset*).
2. After Zenodo assigns a DOI, update the `identifier` field in the JSON-LD
   graph.
3. Google Dataset Search recrawls on a ~2 week cadence; a forced IndexNow
   ping on the home page URL accelerates re-indexing. (Already wired.)

## 5. Post-upload — update this repo

Once each destination is live, paste the final URLs into
`distribution/dataset/LIVE-URLS.md` (create if missing) and link them from the
landing-page footer. Backlinks from Kaggle + Data.world + Zenodo to
gitdealflow.com compound for both SEO and AEO.
