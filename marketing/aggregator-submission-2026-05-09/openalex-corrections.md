# OpenAlex corrections — both records

OpenAlex auto-ingests works from Crossref, DataCite, ORCID, and other registries. There is no public write API for end users. Corrections are submitted via OpenAlex's web form: https://help.openalex.org/.

## Why this matters

OpenAlex is the upstream source for many downstream aggregators (Lens, Dimensions, OurResearch, ResearchGate's discovery layer, plus dozens of small literature-search tools). A correction at OpenAlex propagates to all of those over the next 4-8 weeks.

## Two records to correct

### Record 1 — Zenodo dataset

- OpenAlex ID: `W7154916891`
- Public URL: https://openalex.org/W7154916891
- DOI: `10.5281/zenodo.19650920`
- Current title: "Startup Engineering Acceleration: A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups"
- Current type: `Dataset`
- Current author affiliation: "Flow Analysis (United States)" — **likely auto-inferred and incorrect**
- Current ORCID: null

### Record 2 — SSRN preprint

- OpenAlex ID: `W7154992629`
- Public URL: https://openalex.org/W7154992629
- DOI: `10.2139/ssrn.6606558`
- Current title: "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations"
- Current type: `Preprint`
- Current host: SSRN Electronic Journal
- Current ORCID: null
- Current abstract: **null** (missing)

---

## Corrections to submit

### Correction A — Link ORCID to both records

OpenAlex pulls ORCID via the Crossref → ORCID auto-link pipeline. If your SSRN/Crossref deposit didn't include the ORCID, OpenAlex won't have it.

**Two paths:**

**A1. Update at the source (preferred).** Edit the SSRN preprint listing to include your ORCID in the author metadata. SSRN's author dashboard has a "Link my ORCID" option. Once linked, Crossref refreshes within 1-7 days, and OpenAlex picks up the change in the next ingest cycle (1-4 weeks).

**A2. Direct correction at OpenAlex.** Fill the help form with the request below.

**Form URL:** https://openalex.org/contact (or the help portal at https://help.openalex.org/)

**Subject:** `Author ORCID correction for W7154916891 and W7154992629`

**Body:**
```
Hello OpenAlex team,

I am the author of the following two related works on OpenAlex:

1. W7154916891 — DOI 10.5281/zenodo.19650920 (Zenodo dataset)
2. W7154992629 — DOI 10.2139/ssrn.6606558 (SSRN preprint)

Both records list me as "The Data Nerd" but the ORCID field is null. My
verified ORCID is 0009-0002-2222-4112 (https://orcid.org/0009-0002-2222-4112).

Could you please link this ORCID to the author entity on both records?

Additionally, on W7154916891 the author affiliation is shown as "Flow Analysis
(United States)". This is an auto-inferred affiliation that does not match the
work. The dataset is independent research with no institutional affiliation.
Please remove the affiliation field if possible.

Thank you,
The Data Nerd
ORCID: 0009-0002-2222-4112
SSRN: https://ssrn.com/abstract=6606558
```

---

### Correction B — Add the missing abstract to W7154992629 (SSRN preprint record)

The SSRN preprint OpenAlex record currently has `abstract: null`. The Zenodo dataset record (W7154916891) has the abstract (in inverted-index form), but they are separate works.

**Path:** Same OpenAlex contact form as Correction A.

**Subject:** `Missing abstract on W7154992629`

**Body:**
```
Hello OpenAlex team,

The OpenAlex record W7154992629 (DOI 10.2139/ssrn.6606558, "A Longitudinal
Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset
and Early Observations") currently has the abstract field set to null.

The abstract is publicly available at the SSRN page
(https://ssrn.com/abstract=6606558) and matches the abstract on the
companion Zenodo dataset record W7154916891.

Could you please re-ingest the abstract from SSRN, or accept the inverted
index from the companion Zenodo record at W7154916891?

Thank you,
The Data Nerd
ORCID: 0009-0002-2222-4112
```

---

### Correction C — Link the two records as related

OpenAlex supports "related work" links between dataset and preprint records. The Zenodo dataset is the companion data deposit for the SSRN preprint, not duplicate work — they should be cross-linked.

**Path:** Same OpenAlex contact form.

**Subject:** `Add related-work link between W7154916891 and W7154992629`

**Body:**
```
Hello OpenAlex team,

W7154916891 (Zenodo dataset, DOI 10.5281/zenodo.19650920) is the companion
data deposit for W7154992629 (SSRN preprint, DOI 10.2139/ssrn.6606558).
The dataset deposit is referenced explicitly in the preprint's "Data
availability" section.

Could you please add a "is_supplemented_by" or "has_supplement"
relationship between these two works so they appear cross-linked in the
graph?

Thank you,
The Data Nerd
ORCID: 0009-0002-2222-4112
```

---

## Submission order and timing

1. **Today, 5 min:** Update SSRN author profile to link ORCID `0009-0002-2222-4112` (this is the upstream fix that propagates).
2. **Today, 10 min:** Submit Corrections A, B, and C as three separate OpenAlex contact-form messages (one form per request — easier for the OpenAlex team to triage).
3. **Wait 2-6 weeks:** OpenAlex applies corrections in batches. You'll receive an email reply when each is processed.
4. **At week 6, audit:** Re-run `https://api.openalex.org/works/W7154992629` — confirm ORCID is linked and abstract is present.

## Why doing all three matters

- ORCID linkage activates the Google Scholar pipeline (Scholar pulls ORCID-linked works automatically into your profile).
- Abstract enables full-text indexing in dozens of downstream tools.
- Related-work linkage means a search for the dataset surfaces the preprint and vice-versa — doubles the discovery surface for the same content.

## What NOT to do

- Don't submit corrections multiple times in one form. OpenAlex's triage process is per-message.
- Don't include marketing language or product references. The corrections are about academic metadata only.
- Don't link gitdealflow.com from the form. The cited identity should be SSRN + ORCID, period.
