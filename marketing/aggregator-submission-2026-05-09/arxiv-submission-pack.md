# arXiv submission pack

arXiv is the gold-standard preprint server for quantitative-finance, economics, and computer-science research. Cross-listing the SSRN paper to arXiv significantly increases discoverability among the academic audience (and AI assistants disproportionately cite arXiv papers because of clean LaTeX-derived metadata).

**The bottleneck is not your paper. It's the endorsement gate.** Read the full timing first.

## Realistic timeline

| Phase | Active time | Wall time |
|---|---|---|
| Identify endorsers + send requests | 90 min | 0 |
| Wait for endorsements (need ≥1, ideally 3-5) | — | **2-8 weeks** |
| Account creation + paper formatting | 60 min | 0 |
| Submission + arXiv moderation review | 15 min active | 1-3 days |
| **Total** | **~2.5 hours active** | **3-10 weeks** |

The endorsement step is by far the dominant cost. arXiv requires that a first-time submitter to **q-fin.GN** (or **econ.GN**) be endorsed by an existing arXiv-published author in that subject area, who has uploaded ≥3 papers in the last 5 years. Endorsement is human-to-human approval. arXiv moderators do not endorse on your behalf.

## Step 1 — Choose the primary category and cross-list

The SSRN paper sits at the intersection of finance, economics, and computer science. The right primary category determines which set of endorsers you need.

**Recommended primary:** `q-fin.GN` (Quantitative Finance — General Finance)
- Best fit because the paper is about a financial-investment signal.
- Endorser pool: alt-data + venture-finance researchers who post on arXiv.

**Recommended cross-lists:**
- `econ.GN` (Economics — General Economics) — innovation/entrepreneurship economics audience.
- `cs.SE` (Computer Science — Software Engineering) — software-engineering-data audience.

You only need endorsement for the **primary** category. Cross-lists do not require additional endorsement once your account can post to the primary.

**If finding q-fin.GN endorsers is impossible**, fallback to `econ.GN` as primary — broader endorser pool, slightly worse topical fit.

## Step 2 — Identify endorser candidates

Strategy: find 8-12 authors who (a) have posted ≥3 papers in q-fin.GN or econ.GN in the last 24 months, and (b) work in adjacent topic areas (alt-data, VC, innovation, open-source economics, software analytics).

**Search starting points:**

1. **arXiv listing for q-fin.GN recent**: https://arxiv.org/list/q-fin.GN/recent — scan titles for "venture", "startup", "alternative data", "GitHub", "software", "innovation".
2. **arXiv listing for econ.GN recent**: https://arxiv.org/list/econ.GN/recent — same scan.
3. **Google Scholar**: search `"alternative data" venture site:arxiv.org` and `"github" "startup" site:arxiv.org`.
4. **Adjacent academic Twitter/X**: search for q-fin researchers active on X. The community is small.

**Filter criteria for each candidate:**
- Has ≥3 papers in the last 24 months on arXiv in q-fin.GN or econ.GN (verify via arXiv author search).
- Email is publicly available (faculty page, paper PDF, ORCID profile).
- Topic overlap: even loose overlap counts (alt-data, fintech, innovation, open source, entrepreneurship).
- **Exclusion:** don't ask researchers at firms that compete with the project. Even an unrelated paper from a competing firm's researcher is a no-go.

**Aim for 8-12 emails sent.** Realistic conversion: 1-3 endorsements over 2-4 weeks. arXiv requires only **one** endorsement per category, but having 2-3 raises confidence.

## Step 3 — Send endorsement-request emails

This is the highest-leverage 90 minutes of work in this submission pack. Personalize each email — generic blast emails get archived.

**Email template** (60-90 words, plain prose):

```
Subject: Endorsement request for arXiv q-fin.GN — paper on GitHub-velocity signals

Dear Dr. [Lastname],

I read your paper "[exact paper title]" recently and noticed our work
sits in adjacent territory. I have a preprint on SSRN
(https://ssrn.com/abstract=6606558) presenting a longitudinal panel of
GitHub engineering-velocity signals across venture-backed startups,
which I would like to cross-list to arXiv under q-fin.GN with
econ.GN and cs.SE as cross-lists.

I'm a first-time arXiv submitter and would appreciate an endorsement
if you find the work in scope for the category. The arXiv endorsement
code is generated at the URL below — happy to share once you confirm.

No obligation either way. Thank you for considering.

Best,
The Data Nerd
ORCID: 0009-0002-2222-4112
SSRN: https://ssrn.com/abstract=6606558
```

**Customize per recipient:**
- Replace `[Lastname]` with the actual name (verify spelling).
- Replace `"[exact paper title]"` with one of THEIR actual papers — read the abstract briefly, mention something specific.
- If they're at a university, send from a research-grade email (not personal Gmail). If you have access to a university alum email, use it. Otherwise create a clean Gmail address dedicated to this purpose: `thedatanerd.research@gmail.com` or similar.

**The endorsement request URL** is generated by arXiv after you create an arXiv account and click "Request endorsement" → arXiv emails you a link to share with potential endorsers. Don't include a fake URL in the email; tell them you'll share it once they confirm.

**Send rate:** 2-3 personalized emails per day, max 8-12 total. Don't blast.

## Step 4 — Create arXiv account

1. Go to https://arxiv.org/user/register
2. Use the same Google/ORCID-linked email as the Semantic Scholar profile (consistency across aggregators is helpful).
3. Verify email.
4. Add ORCID `0009-0002-2222-4112` in account settings.

## Step 5 — Format the manuscript for arXiv

arXiv accepts:
- LaTeX source (preferred — better metadata extraction, smaller file size).
- PDF (acceptable but loses some downstream features).

**LaTeX format:** if you don't have the SSRN paper in LaTeX, convert via:
- Pandoc: `pandoc ssrn-paper.docx -o paper.tex` (if you have a docx).
- Manual: rewrite the abstract + intro in LaTeX. The full paper can be a PDF appendix if needed.

Required arXiv style elements:
- `\documentclass{article}` (or `\documentclass[a4paper]{article}`)
- Title, author, affiliation block
- Abstract (≤1920 chars / ~250 words for arXiv abstract field, but the paper's full abstract can be longer)
- References in BibTeX or `thebibliography`

**Critical:** the manuscript metadata (title, abstract, author) **must match exactly** between the LaTeX file and the arXiv submission form. Any mismatch triggers moderation hold.

## Step 6 — Pre-fill submission form metadata

When you submit (after endorsement is approved), arXiv asks for:

| Field | Value |
|---|---|
| Title | `A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups` |
| Authors | `The Data Nerd` |
| ORCID | `0009-0002-2222-4112` |
| Comments | `55 startups, 20 sectors, 5 quarters; companion dataset on Zenodo (DOI: 10.5281/zenodo.19650920); cross-listed from SSRN abstract 6606558` |
| Primary subject | `q-fin.GN` |
| Cross-listings | `econ.GN, cs.SE` |
| MSC class | `91G80` (Financial applications) |
| ACM class | leave blank or `K.4.4` (Electronic Commerce) |
| Journal-ref | leave blank initially; fill in if/when journal version accepted |
| DOI | leave blank for arXiv version (arXiv issues its own ID; you can list the SSRN DOI in the comments instead) |

**Abstract for the arXiv form** (use this exact text, ≤1920 chars):

> We release a quarterly longitudinal panel of GitHub engineering-velocity signals across 55 venture-backed startups in 20 sectors, spanning five quarters from Q2 2025 through Q2 2026 (219 startup-period observations). Signals include commit velocity over a rolling 14-day window, unique-contributor count, and new-repository creation. We document descriptive patterns including framework migration and hiring-related contributor influxes, and we observe that engineering-acceleration signals computed from public GitHub data preceded publicly disclosed fundraise announcements by approximately three to six weeks for the studied cohort. Data and methodology are open (CC-BY-4.0); replication kit and the full panel are available via the companion Zenodo deposit.

(Adjust if the actual SSRN abstract differs — copy verbatim from the live SSRN listing.)

## Step 7 — Submit and survive moderation

1. Upload LaTeX/PDF.
2. Fill all metadata fields per Step 6.
3. Submit → arXiv runs automated checks (file format, abstract length, category routing) and a moderator may eyeball the submission.
4. Typical moderation hold: 0-3 days.
5. Most likely flag: if the moderator suspects the paper is off-topic for q-fin.GN, they may suggest re-categorization. Accept their suggestion — fighting the moderator is a topic-bullet-in-foot.

## Step 8 — Post-submission

Once live (typical arXiv ID format `2604.NNNNN` for May 2026):

- Update SSRN to add `arXiv:2604.NNNNN` to the SSRN listing's "External link" field.
- Update OpenAlex correction A to mention the arXiv ID (so the three records — SSRN, Zenodo, arXiv — get cross-linked).
- Update Semantic Scholar profile to add the arXiv version under your authorId.
- Set up arXiv paper-tracking alerts on Google Scholar and Semantic Scholar with the new arXiv ID.

## Decision: do this or skip?

**Reasons to do this:**
- arXiv is highest-prestige preprint surface in q-fin / econ academic community.
- Citation discoverability lift: ~3-5x vs. SSRN-only.
- AI-assistant citation share: arXiv papers are over-represented in academic-query answers from Claude/ChatGPT/Perplexity.

**Reasons to skip:**
- 90 minutes of personalized email is real cost.
- 2-8 week wall time waiting for endorsements.
- Risk of zero endorsements landing if your outreach quality is poor.
- The SSRN deposit is already widely indexed (Crossref, OpenAlex, Semantic Scholar, OurResearch), so the marginal lift from arXiv is real but not massive.

**My read:** worth doing **after** OpenAlex corrections and MPRA submission have shipped. Those are higher-confidence wins. arXiv is the long-tail bet.

If you decide to skip arXiv: that's defensible. The other three indexes (OpenAlex, Semantic Scholar, MPRA) cover ~85% of the academic discoverability lift on their own.
