# Submission checklist

Single-page tick-box list to run through. Each line links to the relevant detail file.

## Pre-flight (5 min, do once)

- [ ] Confirm a clean Gmail address dedicated to research identity (e.g. `thedatanerd.research@gmail.com`). Don't use personal email.
- [ ] Confirm ORCID `0009-0002-2222-4112` is active and verified.
- [ ] Have the SSRN paper PDF locally.
- [ ] Have access to the SSRN author dashboard.

## Track A — OpenAlex corrections (15 min) → see `openalex-corrections.md`

- [ ] Update SSRN profile to link ORCID `0009-0002-2222-4112` (5 min).
- [ ] Submit OpenAlex Correction A — link ORCID to W7154916891 + W7154992629 (5 min).
- [ ] Submit OpenAlex Correction B — add abstract to W7154992629 (3 min).
- [ ] Submit OpenAlex Correction C — link the two records as related works (2 min).

## Track B — Semantic Scholar (30 min) → see `semantic-scholar-pack.md`

- [ ] Sign in to S2 via ORCID at https://www.semanticscholar.org/sign-in (5 min).
- [ ] Claim author profile `2430837379` (5 min + email verification wait).
- [ ] Populate profile fields (name, affiliation = "Independent researcher", ORCID, brief About text) (10 min).
- [ ] Submit paper-record corrections — add ORCID, suggest Economics + Finance fields (5 min).
- [ ] Set up citation alerts on paperId `4dd7b11e79757f68e0c4107252514cbfdfbb0462` (5 min).

## Track C — MPRA / RePEc (25 min + 1-7 day wait) → see `mpra-repec-submission-pack.md`

- [ ] Register at https://mpra.ub.uni-muenchen.de/ (5 min).
- [ ] Verify email + complete researcher profile (5 min).
- [ ] Submit paper via "New Item" → upload PDF + fill all form fields per pack (15 min).
- [ ] Wait for editorial review (1-7 days).
- [ ] Subscribe to NEP-CFN, NEP-ENT, NEP-INO, NEP-FMK email lists (5 min, can do same-day).

## Track D — arXiv (90 min active + 2-8 week wait) → see `arxiv-submission-pack.md`

- [ ] Register arXiv account at https://arxiv.org/user/register (5 min).
- [ ] Identify 8-12 endorser candidates from q-fin.GN / econ.GN recent listings (45 min).
- [ ] Send personalized endorsement-request emails (45 min).
- [ ] **Wait 2-8 weeks for ≥1 endorsement.**
- [ ] Format manuscript (LaTeX preferred, PDF acceptable) (30-60 min).
- [ ] Submit via arXiv submission interface with metadata from pack (15 min).
- [ ] Wait for moderation hold (0-3 days).

## Post-submission (do within 60 min after each track lands)

After OpenAlex corrections processed (~2-6 weeks after submission):
- [ ] Re-run `https://api.openalex.org/works/W7154992629` to confirm ORCID + abstract present.

After Semantic Scholar profile claimed:
- [ ] Re-run `https://api.semanticscholar.org/graph/v1/author/2430837379` to confirm verified status.

After MPRA accepted:
- [ ] Add MPRA URL to SSRN external links.
- [ ] Update Semantic Scholar paper record with MPRA link.
- [ ] Confirm RePEc indexing at https://ideas.repec.org/ (1-2 weeks post-MPRA-acceptance).

After arXiv accepted:
- [ ] Add arXiv ID (e.g. `2604.NNNNN`) to SSRN external links.
- [ ] Add arXiv version to Semantic Scholar profile.
- [ ] Update OpenAlex via correction form to add the arXiv DOI cross-link.

## Order to execute (sequencing matters)

**Day 1 (today, ~75 min active):**
- Track A (OpenAlex corrections) — 15 min
- Track B (Semantic Scholar) — 30 min
- Track C (MPRA submission) — 25 min
- Wait

**Week 1-2:**
- MPRA acceptance (passive)
- Begin Track D endorser identification + emails

**Week 2-8:**
- Wait for arXiv endorsements
- Begin researcher outreach per Track 1.4 of `corroborating-sources-accumulation-plan.md`

**Week 4-8:**
- arXiv submission once endorsement lands
- OpenAlex corrections processed and re-verified
- First NEP digest mentions of MPRA paper

## Done state

By the end of week 10 (worst case), the paper will be discoverable via:

- SSRN ✓ (already)
- Zenodo ✓ (already)
- OpenAlex ✓ (already, with corrections applied)
- Semantic Scholar ✓ (already, with profile claimed)
- MPRA / IDEAS / EconPapers ✓ (new)
- arXiv ✓ (new)
- 4 NEP email digests (recurring discovery surface)

That's the maximum academic-discoverability surface achievable for a single SSRN preprint without a journal acceptance. **Track 1 of the corroborating-sources accumulation plan is then 80% complete.** The remaining 20% is the journal submission, which is the longest single thread (8-32 weeks).
