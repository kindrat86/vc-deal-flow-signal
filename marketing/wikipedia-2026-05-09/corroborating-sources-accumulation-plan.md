# Corroborating sources accumulation plan — 2026-05-09 onward

**Revised 2026-05-09 PM:** user picked Option A (preserve anonymity). Anonymity rule blocks all peer-reviewed journal and conference paths for the SSRN paper. Tracks 1.1 (JBVI journal submission) and 1.5 (conference talks) are dropped — both require real-name authorship. Track 1.4 (researcher outreach) does the heavy lifting for Gate 1.

**Realistic gate timeline under outreach-only path:**

| Gate | Realistic met-by | Notes |
|---|---|---|
| **Gate 1** — ≥2 Scholar citations | 2027-Q1 to 2027-Q3 | 9-18 months via outreach only (1-2 conversions per 10 emails) |
| **Gate 2** — ≥1 Tier-1 trade press | Unchanged — opportunistic | Pitching anonymously also harder; lean on the *paper*, not the byline |
| **Gate 3** — 90 days no-flags on `TheDataNerd` | 2026-08-07 | On track if no Wikipedia activity from this account |

**Wikipedia bundle re-evaluation date:** revised to **2027-Q1 minimum** (was 2026-08-01). Bundle stays deferred until all three gates are met simultaneously. Gate 3 will be ready well before Gate 1; the bottleneck is academic citations.

This document lists concrete actions to reach those gates.

---

## Track 1 — Academic citations (gate 1)

Under the anonymity-preserving constraint, all peer-reviewed journal and conference paths are blocked. Citations must come from third-party researchers organically discovering and citing the SSRN preprint. Track 1.4 (direct outreach) is the primary lever.

### 1.1. ~~Submit to peer-reviewed journal~~ — DROPPED (2026-05-09)

Decision: dropped. JBVI, Journal of Financial Data Science, Research Policy, and Strategic Management Journal all require real-name corresponding-author identity for Editorial Manager submission, ORCID linking, and copyright transfer. The anonymity rule (`feedback_anonymity_no_podcasts.md`) takes precedence.

If the anonymity rule is ever revisited, the previously-recommended target was **Journal of Business Venturing Insights** (Elsevier, 8-12 week turnaround). Re-open this track only after explicit user direction to drop the anonymity rule.

### 1.2. Set Google Scholar alerts

Monitor citations and adjacent literature. 5 minutes one-time at https://scholar.google.com/scholar_alerts:

- Alert on the exact paper title.
- Alert on `"GitHub" "venture capital"` plus year filter 2026.
- Alert on `"alternative data" "early stage"` plus year filter 2026.
- Alert on the ORCID `0009-0002-2222-4112`.

Forward all alert emails to the GitDealFlow ops inbox.

### 1.3. Add the paper to author profiles on aggregators

60-90 minutes, mostly form-filling:

- Confirm SSRN profile is public + complete.
- Cross-list on **arXiv q-fin.GN** or **arXiv econ.GN**. arXiv has higher citation-discovery surface than SSRN alone for this audience.
- Submit to **RePEc** (Research Papers in Economics). Free, indexed, treated as canonical by economists.
- Confirm the OpenAlex W7154916891 record is correct and lists all current identifiers.
- Confirm the Semantic Scholar entry exists; if not, submit via the S2 paper-request form.
- Confirm the Zenodo deposit + DataCite DOI are linked from SSRN.

### 1.4. Direct outreach to working researchers — PRIMARY LEVER

Under the outreach-only path, this track does almost all the work for Gate 1. Aim for **20-30 researcher emails over 6-12 months** to realistically land 2-3 citations.

**Cadence:** 3-5 emails per month. Bursts of 10+ in a single week look like a campaign and reduce response rate.

**Identifying researchers** (target list of 30+, contact 20-30):

Search Google Scholar with author-filter (sort by date, last 24 months):
- `"GitHub" "venture capital" 2024..2026`
- `"alternative data" "venture" 2024..2026`
- `"open source" "investment signal" 2024..2026`
- `"developer activity" "startup" 2024..2026`
- `"commit velocity" OR "commit data" 2024..2026`

Cross-reference with:
- SSRN's "Most Downloaded" lists in Entrepreneurship + Innovation Networks (last 12 months)
- arXiv econ.GN recent submissions (last 12 months)
- arXiv q-fin.GN recent submissions
- NBER Working Papers on entrepreneurial finance
- RePEc IDEAS top-downloaded entrepreneurship papers

**Email template** (60-80 words). Send from `signal@gitdealflow.com` so replies are tracked:

> Subject: SSRN preprint on GitHub engineering velocity for venture-backed startups
>
> Dear Prof. [Last Name],
>
> I noticed your recent work on [specific paper title or topic]. I recently posted a related preprint on a longitudinal panel of GitHub engineering velocity for venture-backed startups (55 orgs, 5 quarters, CC-BY-4.0): https://ssrn.com/abstract=6606558
>
> If it's useful for your bibliography or for a teaching example, the dataset and methodology are open. Happy to share underlying numbers if helpful.
>
> Best,
> The Data Nerd

**Rules:**
- Do NOT ask for a citation directly. Asking lowers response rate ~70%.
- Do NOT pitch the GitDealFlow product.
- Do NOT include any commercial URL. SSRN link only.
- Do NOT suggest collaboration unless they raise it.
- Personalize the *one* sentence referencing their work.

**Tracking:** spreadsheet columns — name, affiliation, email, send-date, response-date, response-summary, citation-status. Review monthly.

**Realistic conversion:**
- ~30% reply rate ("interesting, will take a look")
- ~10-15% engage further
- ~5-10% cite the paper in their next work
- 20-30 emails → 1-3 citations over 6-12 months

### 1.5. ~~Conference talks~~ — DROPPED (2026-05-09)

Decision: dropped. All major venture-research and alt-data conferences (SMS, AOM, Wharton P&O, Battle of the Quants, etc.) require speaker name, affiliation, and bio for the program. Anonymity rule blocks this.

### 1.6. Lift discoverability of the SSRN paper itself

Compounds with Track 1.4 — researchers who can find the paper are more likely to cite it. Discoverability work does not require breaking anonymity.

- Update SSRN page with proper keywords, JEL codes (G24, G32, M13, O33).
- Cross-list on **arXiv** (econ.GN or q-fin.GN). arXiv permits pseudonymous authors in some cases; check current policy. If allowed, this is high-leverage.
- Submit to **RePEc IDEAS** as an SSRN-mirrored working paper.
- Confirm **OpenAlex W7154916891** record is correct.
- Confirm **Semantic Scholar** entry exists with full text linked.
- Confirm **Zenodo + DataCite** dataset deposit + DOI are linked back to the paper.

---

## Track 2 — Trade press (gate 2)

Tier-1 trade press is harder than academic citation; it requires either timing (a news hook) or a well-developed pitch. The pitch is for the **paper, not the product**.

### 2.1. Three news-hook angles (pick one, develop deeply)

| Hook | Angle | Outlets |
|---|---|---|
| **GitHub as the new SignalRank** | Frame the SSRN paper alongside SignalRank's published model. | The Information, TechCrunch, Forbes |
| **Stealth-mode startups can't actually hide** | Frame around the empirical finding that public GitHub activity leaks even when marketing surfaces are dark. | Bloomberg, FT, WSJ |
| **What VCs are watching now that LinkedIn data is paywalled** | Alt-data shift narrative. | Pitchbook News, Crunchbase News, Axios Pro Rata |

### 2.2. Pitch list (build once, reuse)

For the chosen hook, identify 2-3 reporters covering the beat at each Tier-1 outlet. Target a final list of **8-12 reporters across 4-6 outlets**.

### 2.3. Pitch craft

Sample subject line:
> New SSRN paper: GitHub commit data leaked early-stage VC fundraises in 2025-2026 dataset

Sample body (60-80 words, plain prose, no marketing):
> I run a longitudinal panel of GitHub engineering velocity for venture-backed startups (open data, CC-BY-4.0). The dataset shows a measurable lead time between repository acceleration and announced fundraises across the studied cohort. The methodology paper is on SSRN: [link]. Happy to share the underlying numbers, and to nominate practitioners for comment if useful for a story. Best, The Data Nerd

Rules:
- Pitch the paper, not the product. Do NOT include `gitdealflow.com` URL.
- Pitch as a researcher, not a company.
- Send 3-5 per week, max.
- Personalize each pitch — at least one sentence referencing the reporter's recent work.

### 2.4. Adjacent surfaces (lower-bar warm-up coverage)

Before swinging at Tier-1, get one or two pieces of mid-tier coverage:

- **Pitchbook News** — accepts research-paper-driven pieces; lower bar than The Information.
- **Crunchbase News** — same.
- **StrictlyVC newsletter** (Connie Loizos) — shorter format, often spotlights novel data.
- **Equity podcast** (TechCrunch) — guest spot is high-bar but mid-tier.

---

## Track 3 — Account heat cooldown (gate 3)

The simplest gate to satisfy, but discipline is required.

### 3.1. Do nothing on Wikipedia from `TheDataNerd` account

No edits. No talk-page comments. No edit requests. The account's edit history must not grow until the 2027-Q1 re-evaluation at the earliest.

### 3.2. Do not create a second account

`WP:SOCK` ban is permanent and IP-enforced.

### 3.3. After 60 days, audit the account

At 2026-07-09 — exactly 60 days from now — check:

- `User:TheDataNerd` user page: any messages from other editors? Any block warnings? Any noticeboard mentions?
- `User_talk:TheDataNerd`: same checks.
- Watchlist movement on the May 3rd `Talk:Deal_sourcing` post.
- Search WP:COIN for any mention of the username or the SSRN paper.
- Search WP:RSN for any mention of the SSRN paper as a reliability question.

If all clear → on track for the 2027-Q1 re-evaluation. If any flag → push deferral further.

---

## Quarterly review checkpoints (revised 2026-05-09 PM)

| Date | Actions |
|---|---|
| **2026-06-09** | One-month check. Track 1.2 alerts firing? Track 1.6 discoverability tasks done (arXiv, RePEc, OpenAlex, Semantic Scholar)? Track 1.4 researcher target list at 30+? Track 2.2 pitch list complete? |
| **2026-07-09** | Two-month check. Track 1.4: at least 5-8 researcher emails sent? Wikipedia account audit (Track 3.3) — Gate 3 should be on track. |
| **2026-08-09** | Three-month check. Gate 3 (90 days no-flags) hits **2026-08-07** — if account still clean, Gate 3 is met. Track 1.4: 10-12 emails sent? Any responses? |
| **2026-11-09** | Six-month check. Track 1.4: 18-25 emails sent. Citation count: 0-1 expected. |
| **2027-02-09** | Nine-month check. Citation count: 1-2 expected. If 2 → Gate 1 nearly met. |
| **2027-Q1** | First realistic re-evaluation gate. If Gates 1-3 all met → re-open the bundle via Option 2 (hand-retype). |
| **2027-Q2-Q3** | Second realistic re-evaluation if Q1 doesn't hit Gate 1. |

---

## Out-of-scope reminders (don't drift here)

- This plan is for the **Wikipedia channel only.** Other Tier-1 plays (YouTube silent walkthrough, Reddit subreddit, LinkedIn newsletter, "State of GitHub Signal" quarterly report) proceed independently per `project_traffic_ideas_2026_05_09.md`.
- The pSEO site's internal AI-discoverability surfaces (llms.txt, agents.md, alternatives, /api/v1/*, well-known) are model-grade as of 2026-05-09 audit. No changes needed there during this window.
