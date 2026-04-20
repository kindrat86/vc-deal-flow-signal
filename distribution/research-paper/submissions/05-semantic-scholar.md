# Semantic Scholar — claim author + request indexing

**Target URL:** https://www.semanticscholar.org/

**Rationale:** Semantic Scholar is the AI/academic-search backbone for
ChatGPT citations and many downstream tools (Connected Papers, Lens.org,
Litmaps). Free, no paywall. Their corpus pulls SSRN via Google Scholar
within 1–4 weeks.

## Timeline expectation

SSRN → Google Scholar: typically 24–72 hours after paper approval.
Google Scholar → Semantic Scholar: 1–4 weeks via their periodic crawl.

**Today (2026-04-20):** Paper not yet indexed — verified via
`https://api.semanticscholar.org/graph/v1/paper/URL:https://ssrn.com/abstract=6606558`
returning 404.

## Actions

### Step 1 — Wait for auto-ingest (T+1 to T+4 weeks)

Nothing to do. Poll with:
```bash
curl "https://api.semanticscholar.org/graph/v1/paper/URL:https://ssrn.com/abstract=6606558?fields=title,authors,externalIds" | jq
```
When the command returns a valid JSON (not 404), the paper is indexed.

### Step 2 — Claim the author page

Once the paper is indexed, Semantic Scholar creates an author entity.
Steps to claim:

1. Search Semantic Scholar for `The Data Nerd`.
2. Click the author result → `Claim Author Page`.
3. Sign in with ORCID (prerequisite — see `04-orcid.md`).
4. Confirm via email to `signal@gitdealflow.com`.
5. Edit the author profile:
   - Display name: `The Data Nerd`
   - Homepage: `https://gitdealflow.com`
   - Affiliation: `VC Deal Flow Signal (independent researcher)`
6. Enable **Author Alerts** to track new citations of the paper.

### Step 3 — Request missing-paper indexing (if still 404 after 4 weeks)

If Semantic Scholar hasn't indexed the paper after 4 weeks:

1. Claim the author page first (Step 2).
2. Go to `Author Page → Edit → Add Papers → Add a paper that does not exist in our corpus`.
3. Paste:
   - **Open-access PDF URL:** `https://ssrn.com/abstract=6606558/paper.pdf`
     (or the Zenodo mirror if SSRN PDF is paywalled for the form)
   - **Backup OA URL:** `https://zenodo.org/records/19650920/files/paper.pdf`
     (upload paper.pdf to Zenodo as a new file if not already there — see below)
4. Wait up to 2 weeks for processing.

### Step 4 — Boost corpus discoverability (one-time)

After the paper appears, run a citation query to prime related-paper discovery:

```bash
curl "https://api.semanticscholar.org/graph/v1/paper/URL:https://ssrn.com/abstract=6606558/references?fields=title,authors,externalIds"
```

If any cited papers in the SSRN paper have Semantic Scholar records, the
link graph builds automatically.

## Automation

See `scripts/check-indexing.mjs` — polls Semantic Scholar + Google Scholar
+ OpenAIRE daily and updates amplification-status.json when the paper
appears.

## Ancillary — add Zenodo paper.pdf

Semantic Scholar ranks OA-PDF-linked papers higher. Add `paper.pdf` to
the Zenodo record so Semantic Scholar can link it:

1. Zenodo record 19650920 → Edit → New Version.
2. Add `paper.pdf` to the files list (8 files → 9).
3. Publish. New DOI `10.5281/zenodo.19650921` (concept DOI unchanged).
4. Update citation everywhere to use the concept DOI
   (`10.5281/zenodo.19650919`) which auto-resolves to latest.
