# Post-SSRN-approval amplification plan

Trigger: SSRN approval email arrives (expected 2026-04-20 or -21).

## T+0h (immediately after SSRN goes public)

### 1. Submit to Papers With Code

- Go to https://paperswithcode.com/submit
- Fill the form using the values in
  `distribution/research-paper/papers-with-code-submission.md`
- Paper URL: `https://ssrn.com/abstract=6606558` (now live)
- Code: `https://github.com/kindrat86/gitdealflow-signal-classifier`
- Dataset: `https://zenodo.org/records/19650920`
- Tick the **Dataset** checkbox
- PwC review: 3–7 days

### 2. Update Zenodo related identifiers

Add PwC URL once assigned (via the legacy deposit edit API flow we
used 2026-04-19 — see `distribution/dataset/LIVE-URLS.md` for the
Zenodo notes section).

### 3. Announce on Twitter (@data_nerd)

Thread of 4 tweets:

**Tweet 1:**
> I just released a public dataset + preprint on startup engineering
> velocity — 219 observations across 55 venture-backed startups and
> 20 sectors, 5 quarters of data.
>
> Free to use (CC BY 4.0). DOI: 10.5281/zenodo.19650920
>
> 🧵 why I built this and what's in it:

**Tweet 2:**
> VC deal sourcing is moving from network-mediated referrals to
> alt-data. GitHub is one of the cleanest alt-data sources because
> it's hard to game — you can't fake a 14-day commit cadence or a
> hiring burst in the contributor graph.

**Tweet 3:**
> The panel tracks 4 acceleration patterns:
>
> - Framework migration (75% of obs)
> - Deploy frequency spike (12%)
> - Engineering hiring burst (9%)
> - Infrastructure buildout (4%)
>
> These empirically precede fundraise announcements by 6-12 weeks.

**Tweet 4:**
> Paper: ssrn.com/abstract=6606558
> Dataset: zenodo.org/records/19650920
> Kaggle: kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal
> Code: github.com/kindrat86/gitdealflow-signal-classifier
>
> Replication studies joining vs Crunchbase/PitchBook very welcome.

### 4. LinkedIn announcement (company page + personal)

Plain-text, no hashtags:

> New: I published a public longitudinal dataset of startup
> engineering velocity — 219 observations across 55 venture-backed
> startups and 20 sectors.
>
> Full paper on SSRN: [link]
> Dataset on Zenodo (DOI-stamped, CC BY 4.0): [link]
> Mirror on Kaggle: [link]
> Classifier code on GitHub (MIT): [link]
>
> If you research alternative data in venture capital or want to join
> the panel against Crunchbase/PitchBook funding events, replication
> studies welcome — happy to co-author.

Tag: @packy, @gergelyorosz, @elizabeth (Dream 100 editors — per
project memory).

## T+24h

### 5. Newsletter pitches (Dream 100 — emails staged in memory)

Individual emails to:
- Packy McCormick (Not Boring)
- Gergely Orosz (Pragmatic Engineer)
- Connie Loizos (StrictlyVC / TechCrunch)
- Elizabeth (first name + editor context in `project_newsletter_contacts` memory)
- Lenny (Lenny's Newsletter)

Body template (adapted per outlet):

> Hi [first name],
>
> Quick pitch for [Not Boring / Pragmatic Engineer / StrictlyVC] —
>
> I just released a public dataset of GitHub engineering velocity
> across 55 venture-backed startups, with an SSRN preprint
> describing the methodology. Panel covers 5 quarters of commit
> activity, contributor growth, and acceleration classification
> across 20 sectors.
>
> Might be a fit for a [data viz / engineering insights / alt-data in VC]
> piece. All CC BY 4.0 so you can excerpt freely.
>
> - Paper: https://ssrn.com/abstract=6606558
> - Data: https://doi.org/10.5281/zenodo.19650920
> - One concrete finding: Framework migration dominates (75% of obs)
>   and precedes fundraise announcements by 6-12 weeks in our
>   observational sample
>
> Happy to pull any cut of the data on request.
>
> The Data Nerd
> signal@gitdealflow.com
> https://gitdealflow.com

### 6. r/VentureCapital comment (not main post — per memory)

Find a thread about alt-data sourcing or VC tooling. Post a 40-55
word comment following the Reddit style memory (no em-dashes,
declarative → numbers → close):

> Released a public panel of GitHub engineering velocity for 55
> venture-backed startups. 219 obs across 20 sectors, 5 quarters,
> CC BY 4.0. Framework migration shows up in 75% of pre-fundraise
> observations. Data + paper on Zenodo (10.5281/zenodo.19650920) and
> SSRN. Replication against Crunchbase would be useful.

### 7. IndieHackers post (Startup Lessons category)

Cross-post abstract + dataset link. Already have IH seeding live —
this is a straightforward announcement, not a seed.

## T+72h

### 8. arXiv endorsement campaign

Use `distribution/research-paper/arxiv-endorsement-email.md`. Pick 3-5
recent q-fin.GN submitters, send individual emails from
signal@gitdealflow.com. Don't chase after 5 business days — move to
next candidates.

### 9. Dev.to article

Longer-form post summarizing the paper — "I built a public dataset of
GitHub engineering velocity. Here's what's in it." Publish on dev.to
under the existing @data_nerd account. Cross-post to Hashnode (per
memory pattern).

## T+1 week

### 10. Papers With Code follow-up

If PwC hasn't approved, email support with the SSRN + Zenodo + code
URLs. PwC reviewers sometimes need a nudge.

### 11. arXiv submission

Once any endorser accepts, submit arXiv with paper.tex (generate from
paper.md via `pandoc paper.md -o paper.tex`).

## Tracking

Paste final URLs into `distribution/dataset/LIVE-URLS.md` as each
destination goes live. Update Zenodo related identifiers at each
milestone.
