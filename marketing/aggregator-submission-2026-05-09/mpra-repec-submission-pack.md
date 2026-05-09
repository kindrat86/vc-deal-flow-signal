# MPRA / RePEc submission pack

RePEc (Research Papers in Economics) is the canonical bibliographic database for economics research. For independent researchers without an institutional RePEc archive, the standard route is **MPRA (Munich Personal RePEc Archive)** — a personal-research repository run by the Munich University Library that automatically feeds RePEc.

Submission to MPRA = listing on RePEc, IDEAS, EconPapers, NEP (New Economics Papers email lists, which is a discovery channel in itself), and several smaller economics aggregators.

## Why this matters

RePEc is the most important academic database for economists. Economics-trained researchers and their AI assistants (Claude, ChatGPT, Perplexity, when answering economics queries) rely heavily on RePEc / IDEAS as a citation source. The SSRN paper is in scope (entrepreneurial finance, alternative data — both are economics topics), and MPRA acceptance is high for technically competent submissions.

## Realistic timeline

| Step | Active time | Wall time |
|---|---|---|
| Account creation | 5 min | 0 |
| Form fill + upload | 20 min | 0 |
| Editorial review | — | 1-7 days |
| Indexed in RePEc | — | +1-2 weeks after MPRA acceptance |
| **Total** | **25 min** | **2-3 weeks to full RePEc indexing** |

## Step 1 — Pre-submission checklist

Before opening the form, have these ready:

- [ ] **Manuscript file** in PDF format. MPRA accepts PDF only — no LaTeX source. Use the same PDF as the SSRN deposit if it's clean and reasonably formatted.
- [ ] **Title** (final form): `A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations`
- [ ] **Abstract** (≤1500 chars).
- [ ] **5-10 keywords**.
- [ ] **JEL codes** (see below).
- [ ] **Companion dataset DOI**: `10.5281/zenodo.19650920`.
- [ ] **SSRN URL**: `https://ssrn.com/abstract=6606558`.
- [ ] **ORCID**: `0009-0002-2222-4112`.
- [ ] **Email address** for the MPRA account (use the same one as Semantic Scholar / arXiv).

## Step 2 — Account creation

1. Go to https://mpra.ub.uni-muenchen.de/
2. Click "Register" (top right).
3. Fields:
   - First name: `The`
   - Last name: `Data Nerd`
   - Email: same as your other research accounts
   - Affiliation: `Independent researcher` (MPRA accepts this; many submissions are unaffiliated)
   - ORCID: `0009-0002-2222-4112`
4. Verify email.
5. Set up your "Researcher Profile" with the same dry, neutral About text used on Semantic Scholar.

## Step 3 — Submission form

1. Go to https://mpra.ub.uni-muenchen.de/cgi/users/home (after login) → "New Item".
2. Item type: select **Paper**.
3. Upload the PDF.

## Step 4 — Form fields (exact values)

**Title:**
```
A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations
```

**Authors:** add one author entry:
- Family name: `The Data Nerd`
- Given name: leave blank or use `(pen name)`
- ORCID: `0009-0002-2222-4112`
- Affiliation: `Independent researcher`

**Abstract** (paste verbatim from the SSRN listing; should be ≤1500 chars):
```
We release a quarterly longitudinal panel of GitHub engineering-velocity signals across 55 venture-backed startups in 20 sectors, spanning five quarters from Q2 2025 through Q2 2026 (219 startup-period observations). Signals include commit velocity over a rolling 14-day window, unique-contributor count, and new-repository creation. We document descriptive patterns including framework migration and hiring-related contributor influxes, and we observe that engineering-acceleration signals computed from public GitHub data preceded publicly disclosed fundraise announcements by approximately three to six weeks for the studied cohort. Data and methodology are open (CC-BY-4.0); replication kit and the full panel are available via the companion Zenodo deposit (DOI 10.5281/zenodo.19650920).
```

**Keywords** (5-10, comma-separated):
```
alternative data, venture capital, GitHub, software development, commit velocity, longitudinal panel, startup, fundraising signals, open data, code-side sourcing
```

**JEL classification codes** — these are the economics subject codes that route the paper into NEP email lists. Pick 3-5:

| Code | Description | Why this paper |
|---|---|---|
| `G24` | Investment Banking; Venture Capital | **Primary fit** |
| `G14` | Information and Market Efficiency; Event Studies | Engineering-velocity → fundraise lead time is an event-study angle |
| `M13` | New Firms; Startups | Population studied |
| `O33` | Technological Change: Choices and Consequences; Diffusion Processes | Open-source / GitHub angle |
| `C81` | Methodology for Collecting, Estimating, and Organizing Microeconomic Data | Methodological contribution |

Enter as: `G24, G14, M13, O33, C81`.

**Language:** English

**Date deposited:** today

**Number of pages:** match the PDF page count.

**Comments / additional notes:**
```
Companion dataset deposited on Zenodo (DOI: 10.5281/zenodo.19650920, CC-BY-4.0). Replication code available in the dataset deposit. SSRN DOI: 10.2139/ssrn.6606558.
```

**Subjects** — MPRA's subject taxonomy. Select:
- F - Finance > G - Financial Economics > G2 - Financial Institutions and Services > G24 - Investment Banking; Venture Capital
- M - Business Administration and Business Economics; Marketing; Accounting; Personnel Economics > M1 - Business Administration > M13 - New Firms; Startups
- (optional) C - Mathematical and Quantitative Methods > C8 - Data Collection and Data Estimation Methodology > C81 - Methodology for Collecting, Estimating, and Organizing Microeconomic Data

**License:** CC-BY-4.0 (matches the SSRN and Zenodo deposits).

## Step 5 — Submit and wait for review

1. Click **Submit** (or "Request review").
2. MPRA editorial review queue: 1-7 days. They check for: scope (must be economics-related), basic formatting, no plagiarism red flags.
3. **Common rejection reasons** (avoid these):
   - PDF won't open or is malformed.
   - Abstract or keywords clearly off-topic for economics.
   - Self-promotion language in the abstract.
4. Acceptance triggers an automated DOI mint and propagation to RePEc / IDEAS / EconPapers.

## Step 6 — Post-acceptance

Once accepted (you'll receive an email), do these in the next 60 minutes:

1. **Subscribe to NEP email lists** that match the paper's JEL codes — these are weekly digests sent to subscribed economists. Particularly relevant:
   - **NEP-CFN** (Corporate Finance) — venture capital readers.
   - **NEP-ENT** (Entrepreneurship) — startup-research readers.
   - **NEP-INO** (Innovation) — tech / R&D readers.
   - **NEP-FMK** (Financial Markets) — alt-data readers.
   Subscribe at https://nep.repec.org/

2. **Add the MPRA URL to SSRN** as an external link (SSRN author dashboard → edit listing → external links).

3. **Update Semantic Scholar paper record** with the MPRA URL via the correction form (per `semantic-scholar-pack.md`).

4. **Confirm RePEc indexing** — typically 1-2 weeks after MPRA acceptance, search https://ideas.repec.org/ for the title. The paper should appear at `https://ideas.repec.org/p/pra/mprapa/[ID].html`.

## Realistic outcome assessment

MPRA acceptance rate is high (~85%) for technically competent submissions in scope. The SSRN paper is unambiguously in scope (G24, M13). Expected acceptance.

Once accepted, the paper appears in:
- IDEAS (https://ideas.repec.org/) — primary RePEc front-end
- EconPapers (https://econpapers.repec.org/) — secondary RePEc front-end
- Up to 4 NEP email digests per week, depending on JEL codes
- Citec (citation database)
- LogEc (download statistics)

Each of these is a small but real citation-discovery surface. NEP digests in particular are read by working economists actively scanning for new work — this is where your researcher-outreach (Track 1.4 of `corroborating-sources-accumulation-plan.md`) compounds.

## What NOT to include

- No links to gitdealflow.com or any commercial product page in the abstract, comments, or paper body.
- No marketing language ("our breakthrough", "novel approach", "first-of-its-kind"). MPRA editorial review penalizes this.
- No author affiliation that could be mistaken for institutional ("Flow Analysis", etc.). `Independent researcher` is the safe and accurate choice.
