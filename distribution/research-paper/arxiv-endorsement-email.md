# arXiv endorsement request — cold email template

arXiv requires a one-time endorsement for first-time authors in a
category. You pick 3–5 recent q-fin.GN submitters, email them, and
await a response. Typical success rate with a well-crafted request is
~40%; sending 3–5 increases the chance of at least one yes to ~90%.

## Who to email

1. Go to https://arxiv.org/list/q-fin.GN/recent
2. Open the 10 most recent papers in that category
3. Skim the PDF — prefer authors whose paper topic overlaps with yours
   (alternative data, startup finance, panel data, venture capital,
   empirical finance)
4. For each candidate, find their **institutional email** from the PDF
   title page or the author's personal website
   (Google "[author name] + university email")
5. Prioritize authors at accessible institutions (e.g. business school
   faculty, PhD students at finance programs)

**Good candidate signals:**
- Recent q-fin.GN submitter (last 6–12 months)
- Topic adjacent: alt-data, venture capital, startup outcomes, FinTech,
  empirical finance, text-as-data, panel econometrics
- Publicly listed email on personal site or arXiv author page
- Junior researchers (assistant prof / PhD student) tend to respond
  faster than senior faculty

## Email template (send from signal@gitdealflow.com)

---

**Subject:** arXiv endorsement request — alternative-data dataset paper for q-fin.GN

Dear Dr. [Last Name],

I read your recent q-fin.GN paper on [specific topic from their paper]
with interest — especially [one specific detail from their paper, 1
sentence]. My work overlaps your focus on [alt data / panel methods / VC outcomes / whatever the actual overlap is].

I'm submitting a dataset paper to q-fin.GN and arXiv requires an
endorsement from an existing submitter in the category. Would you be
willing to endorse my submission?

**Paper:** *A Longitudinal Panel of GitHub Engineering Velocity for
Venture-Backed Startups: Dataset and Early Observations*

**Short summary:** I release a public quarterly panel of GitHub
engineering-velocity signals across 55 venture-backed startups and 20
sectors (Q2 2025 – Q2 2026; 219 observations), document the
collection methodology, and report descriptive statistics. The paper
is framed as a dataset descriptor — no strong predictive claims —
and invites replication against Crunchbase / PitchBook funding-event
data.

**Public artifacts:**
- SSRN preprint: https://ssrn.com/abstract=6606558
- Dataset DOI: https://doi.org/10.5281/zenodo.19650920 (CC BY 4.0)
- Code: https://github.com/kindrat86/gitdealflow-signal-classifier (MIT)

All materials are freely accessible and already live. If you're
willing to endorse, the arXiv endorsement page is here:
https://arxiv.org/auth/need-endorsement

My arXiv submitter email is **signal@gitdealflow.com**. I fully
understand if this is out of scope or you prefer not to endorse work
you haven't read — no hard feelings. Either way, I'd welcome your
feedback on the paper.

Thank you for considering,

The Data Nerd
VC Deal Flow Signal
signal@gitdealflow.com
https://gitdealflow.com

---

## Notes for personalization

- **[specific topic from their paper]** — replace with the actual paper
  topic in 4–6 words (e.g. "firm-level climate-risk exposure using
  10-K text").
- **[one specific detail]** — one concrete thing you liked: a method
  choice, a finding, a clever dataset construction. This shows you
  actually read the paper and is the single biggest lift on response
  rate.
- **[alt data / panel methods / VC outcomes / ...]** — pick the
  overlap that's most natural for the recipient's paper.
- Don't change anything else — the template is tuned to be concise,
  specific, and low-ask.

## Sending mechanics

- Send from **signal@gitdealflow.com** (warmed Zoho inbox, per project
  memory — avoids Google Workspace bouncing).
- Use **plain text**, no HTML formatting.
- Send individually, not BCC — each email should read as a real 1:1.
- Space submissions 1 per day per recipient to avoid spam classifiers
  clustering them.
- If no response in 5 business days, don't chase — move to the next
  candidate.

## After endorsement

Once an endorser accepts:

1. Endorser gets an arXiv endorsement link; they click → you're
   endorsed for q-fin.GN. Your arXiv submission window opens.
2. Submit at https://arxiv.org/submit — select q-fin.GN primary,
   cs.DB and stat.AP as cross-lists.
3. Upload `paper.pdf` (or `paper.tex` — pandoc can export LaTeX from
   `paper.md` too).
4. Licensing: arXiv perpetual non-exclusive; CC BY 4.0 on the PDF.
5. arXiv mints `arXiv:YYMM.NNNNN` within ~30 minutes.
6. Update Zenodo related identifiers with the arXiv DOI/URL (same API
   flow as the SSRN update we did 2026-04-19).
7. Submit Papers With Code with the arXiv URL as primary paper link.
