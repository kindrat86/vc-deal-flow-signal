# Research paper submission guide

This paper (`paper.md` + `abstract.txt`) is ready for SSRN, arXiv, and — once
a DOI is assigned — Papers With Code. None of these can be fully automated
because each requires author-identity verification under your name.

## Before you submit (do this once)

1. **Build the PDF.** On macOS:
   ```bash
   brew install pandoc basictex  # first time only, ~5 min
   cd distribution/research-paper/
   pandoc paper.md -o paper.pdf \
     --pdf-engine=xelatex \
     -V geometry:margin=1in \
     -V fontsize=11pt \
     --standalone
   ```
   If you already have pandoc + LaTeX, just the pandoc line.

2. **ORCID.** Register at https://orcid.org (free, 2 min). Put the ORCID ID
   on the paper's author line — SSRN and arXiv both weight ORCID-linked
   submissions higher for indexing.

3. **Affiliation.** Add your legal affiliation (your company name — "VC Deal
   Flow Signal" or the legal-entity equivalent) under your author block.

## 1. SSRN — easiest, no gatekeepers

**URL:** https://hq.ssrn.com/submissions/CreateNewAbstract.cfm

1. Create an SSRN author account (free, any email).
2. **Upload type:** *Working Paper*.
3. **Network classifications** — tick all that apply:
   - *Financial Economics Network* → *Entrepreneurship & Finance*
   - *Financial Economics Network* → *Venture Capital & Private Equity*
   - *Information Systems & eBusiness Network* → *Open Source Software*
4. **Title, abstract, keywords:** copy from `abstract.txt`.
5. **JEL codes:** G24, L26, O32, C81 (listed in abstract.txt).
6. Upload `paper.pdf`.
7. **Data availability statement:** paste the URL to the Kaggle/Zenodo
   mirror you published (see `distribution/dataset/UPLOAD-GUIDE.md`).
8. Submit. Acceptance is typically within 48 business hours.

SSRN will give the paper a stable URL of the form
`https://papers.ssrn.com/sol3/papers.cfm?abstract_id=XXXXXXX`. Add this URL
to:
- your LinkedIn profile (Publications section)
- the landing-page Press Coverage footer
- `distribution/research-paper/live-urls.md` (create on first submission)

## 2. arXiv — higher-authority, requires endorsement

arXiv requires a one-time **endorsement** for first-time authors in a
category. Two paths:

### Path A: Get endorsed (preferred)

1. Submit at https://arxiv.org/submit — arXiv will tell you which categories
   require endorsement and offer a search tool for endorsers.
2. The paper fits **q-fin.GN** (General Finance) most cleanly; alternatives
   are cs.DB (Databases) and stat.AP (Applications).
3. For q-fin.GN, any author who has submitted two papers in that category
   in the last three years can endorse you.
4. Cold-outreach to a prior endorser with the abstract + paper link. From
   the arXiv "endorse" page, hit the search for recent q-fin.GN submitters
   and email 3–5 with a two-sentence request. Success rate is ~40% if you
   include the paper PDF.

### Path B: Co-author with an academic

Ping the academic you find most sympathetic (e.g. someone who's published
on alternative data or open-source metrics) and offer co-authorship in
exchange for endorsement. If the paper is genuinely a dataset release with
no strong empirical claims, the bar to co-authorship is low.

### Submission itself

Once endorsed:

1. **Category:** q-fin.GN (primary), cs.DB + stat.AP (cross-list).
2. **License:** arXiv perpetual, non-exclusive. Keep CC BY 4.0 on the data
   itself; the paper license is a separate choice — **CC BY 4.0** is fine
   for arXiv too.
3. Upload `paper.tex` if you have a LaTeX version, otherwise upload
   `paper.pdf`. (Pandoc can export .tex too: `pandoc paper.md -o paper.tex`.)
4. arXiv mints a permanent ID of the form `arXiv:2604.XXXXX` (year + month +
   sequence).

## 3. Papers With Code — needs a DOI

Papers With Code (https://paperswithcode.com) is an academic link-aggregator
with heavy Google and LLM citation. Submission requires:

1. **Paper on arXiv or SSRN** (do step 1 or 2 above first).
2. **Public code repository.** Since the classifier is deterministic and
   documented in §3.3 of the paper, the simplest satisfying artifact is:
   - A new GitHub repo `gitdealflow/signal-classifier` containing the
     classifier code + `distribution/dataset/build.mjs` + sample data.
   - Zenodo DOI assigned when you upload the bundle (see
     `distribution/dataset/UPLOAD-GUIDE.md` §3).
3. Go to https://paperswithcode.com/submit and fill in: paper URL, code
   repo URL, DOI, dataset URL.
4. Tick the **Dataset** checkbox — PwC has a dedicated dataset section that
   surfaces separately from the paper list.

Papers With Code typically reviews within 3–7 days. Acceptance adds the
paper to their indexed list, which Google Scholar and multiple LLMs
(Perplexity, Claude, ChatGPT) pick up on subsequent crawls.

## 4. Amplification (do after any of the above accept)

Once SSRN, arXiv, or PwC shows the paper live:

1. Tweet the abstract + link from @data_nerd. Tag @SSRN, @arxiv_org, or
   @paperswithcode as appropriate.
2. LinkedIn announcement with the preprint link. Tag Packy McCormick,
   Gergely Orosz, and anyone else from the Dream 100 who writes about
   startup signals.
3. Add the preprint URL to the landing page footer under Press / Research.
4. Submit to r/VentureCapital (comment-only, per your memory constraint —
   paste abstract + link in an existing thread about alt-data sourcing).
5. Cross-post abstract to IndieHackers in the Startup Lessons category
   with a link to the preprint.
6. Email Newsletter outreach: Packy (Not Boring), Gergely (Pragmatic
   Engineer), Connie Loizos (TechCrunch). You already have these contacts
   researched — mention the preprint in your next planned outreach wave.

## 5. Tracking

Paste the live URLs into `distribution/research-paper/live-urls.md` (create
when you have the first one) so the rest of the marketing system can link
to them automatically.
