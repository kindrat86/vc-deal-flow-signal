# Hugging Face — dataset card (now) + Papers (after arXiv)

**Rationale:** Papers With Code has been sunset and redirects to
Hugging Face (per memory `reference_paperswithcode_dead`). HF is now
the canonical dataset + paper index for the AI/ML community.

Two surfaces here:

1. **HF Datasets** — `https://huggingface.co/datasets/thedatanerd2026/vc-deal-flow-signal`.
   **OPEN NOW** — accepts any CC-licensed dataset, no arXiv required.
2. **HF Papers** — `https://huggingface.co/papers`. **BLOCKED on arXiv ID.**

## 1 — HF Datasets (ship today)

**Source draft:** `distribution/dataset/huggingface-dataset-card.md`
(already staged with YAML frontmatter + body).

Upload steps:

1. Go to https://huggingface.co/new-dataset, create
   `thedatanerd2026/vc-deal-flow-signal` (CC-BY-4.0, public).
2. Paste the dataset card body into `README.md` on the repo.
3. Upload the three CSVs + CITATION.cff + datapackage.json either via
   the HF Hub web UI or:
   ```bash
   huggingface-cli login
   huggingface-cli upload thedatanerd2026/vc-deal-flow-signal \
     distribution/dataset/ \
     --repo-type=dataset \
     --commit-message="Initial dataset release (v1.0)"
   ```
4. Link the SSRN paper in the dataset card's **paper** field.
5. Add the HF Dataset URL to Zenodo related-identifiers.

**Status:** `draft_ready` — needs user to log in once to HF Hub
(`huggingface-cli login`) and run the upload.

## 2 — HF Papers (after arXiv lands)

Currently blocked. When arXiv endorsement lands:

1. Go to https://huggingface.co/papers/submit.
2. Paste the arXiv ID.
3. HF auto-populates title/abstract/authors from arXiv metadata.
4. Add a `#dataset` link to `thedatanerd2026/vc-deal-flow-signal`.
5. Upload paper.pdf as a supplementary file.

## Automation

See existing `tools/` scripts. HF Hub has a Python/CLI client; the
Node path is `@huggingface/hub` if we later want it in Node land.

The Steel.dev path isn't needed here — `huggingface-cli` is the
supported first-party client.

## Tracking

Paste HF URLs into `../amplification-status.json` under `huggingface`
once live.
