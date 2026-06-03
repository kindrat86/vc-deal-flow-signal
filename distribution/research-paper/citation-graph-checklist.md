# Earn-the-first-citation — Zenodo + ORCID edit checklist

Owner-only manual steps (account access required). These connect the paper ↔ dataset in
the scholarly graph and attach both to the author identity — the **precondition** that lets
OpenAlex/Crossref/Scholix recognize a citation when one lands. They do **not** themselves
create a third-party citation (that still needs the data-drop in `post-approval-amplification.md`).

**Canonical identifiers** (copy-paste):
- SSRN paper DOI: `10.2139/ssrn.6606558`  ·  URL: https://ssrn.com/abstract=6606558
- Zenodo dataset (version) DOI: `10.5281/zenodo.19650920`  ·  record: https://zenodo.org/records/19650920
- Zenodo concept DOI (latest): `10.5281/zenodo.19650919`
- ORCID iD: `0009-0002-2222-4112`  ·  profile: https://orcid.org/0009-0002-2222-4112

Verified state (2026-06-02): paper has **0 references / 0 relations / 0 citations** in
Crossref + OpenAlex; the Zenodo record links SSRN by **URL, not DOI**; ORCID has **0 works**.

---

## Part A — Zenodo: add the paper↔dataset DOI edge  (~5 min)

The current record links the paper as `Is documented by → https://ssrn.com/abstract=6606558`
(a **URL**). DataCite only emits a Scholix/OpenAlex edge from a **DOI**-scheme related identifier.

- [ ] **A1.** Sign in to https://zenodo.org as the depositor (the "The Data Nerd" account).
- [ ] **A2.** Open the record: https://zenodo.org/records/19650920 → click **Edit** (Zenodo allows
      metadata-only edits to a published record — no new version needed).
- [ ] **A3.** Scroll to **Related works** (a.k.a. "Related/alternate identifiers").
- [ ] **A4.** Click **Add related work** and enter:
  - **Identifier:** `10.2139/ssrn.6606558`
  - **Relation:** `Is supplement to`   *(dataset is supplement to the article — the standard pairing)*
  - **Scheme:** DOI *(Zenodo auto-detects)*  ·  **Resource type:** Publication / Preprint *(optional)*
- [ ] **A5.** (Optional, tidy) Edit the existing `Is documented by → ssrn.com/abstract=6606558`
      row: replace the URL with the DOI `10.2139/ssrn.6606558` so both rows are DOI-scheme.
- [ ] **A6.** (Optional, enables auto-ORCID later) In **Creators**, attach the ORCID iD
      `0009-0002-2222-4112` to "The Data Nerd".
- [ ] **A7.** **Save → Publish.**
- [ ] **A8.** Verify (immediate — DataCite updates on publish):
      ```
      curl -s https://api.datacite.org/dois/10.5281/zenodo.19650920 \
        | python3 -c "import sys,json;print([r for r in json.load(sys.stdin)['data']['attributes']['relatedIdentifiers']])"
      ```
      Expect a row with `relatedIdentifier: 10.2139/ssrn.6606558`, `relationType: IsSupplementTo`, `relatedIdentifierType: DOI`.

---

## Part B — ORCID: claim the paper + the dataset  (~5 min)

ORCID `0009-0002-2222-4112` currently lists 0 works. Adding both attaches them to the author
identity (anonymity-safe — the ORCID *is* "The Data Nerd") and lets OpenAlex/Scholix group them.

- [ ] **B1.** Sign in to https://orcid.org as The Data Nerd.
- [ ] **B2.** **Works** section → **+ Add** → **Add DOI**.
- [ ] **B3.** Paste `10.2139/ssrn.6606558` → **Retrieve work details** (pulls Crossref metadata)
      → **Add this work**. Set visibility to **Everyone**.
- [ ] **B4.** **+ Add → Add DOI** again → `10.5281/zenodo.19650920` → **Retrieve work details**
      (pulls DataCite metadata) → **Add this work** → visibility **Everyone**.
      *(If "Add DOI" can't resolve it, use **Add → Search & link → DataCite** and search the DOI.)*
- [ ] **B5.** Verify (public API):
      ```
      curl -s -H "Accept: application/json" https://pub.orcid.org/v3.0/0009-0002-2222-4112/works \
        | python3 -c "import sys,json;d=json.load(sys.stdin);print('works:',len(d['group']))"
      ```
      Expect `works: 2`.

---

## Part C — Optional / lower-yield

- [ ] **C1. SSRN reverse link** — SSRN author editing is limited and usually has **no**
      DataCite-style related-identifier field; skip unless a "related materials/data" field exists.
      The Zenodo→SSRN DOI edge (Part A) + ORCID grouping (Part B) are sufficient for the graph.
- [ ] **C2. DataCite → ORCID auto-update** — after A6 (ORCID on the Zenodo creator), future
      dataset versions can auto-push to ORCID; one-time consent prompt the first time.

---

## Done when

- [ ] DataCite shows the dataset **IsSupplementTo** the SSRN DOI (Part A8). ✅ immediate
- [ ] ORCID public profile lists **2 works** (Part B5). ✅ immediate
- [ ] OpenAlex links them (propagation lag ~days–weeks):
      `curl -s "https://api.openalex.org/works/W7154916891" | python3 -c "import sys,json;d=json.load(sys.stdin);print('cited_by',d['cited_by_count'],'| related',len(d['related_works']))"`

> ⚠️ These are graph **plumbing**, not a citation. The first *third-party* citation still
> requires the data-drop outreach (one VC/alt-data newsletter or a Wikipedia reference) —
> see `post-approval-amplification.md` and `../wikipedia-article-draft.md`. Cold email is
> saturated per the outreach log; prefer a value-first data-drop.
