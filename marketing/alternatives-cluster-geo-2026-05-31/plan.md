# Alternatives-Cluster GEO Campaign — Execution Plan
**Created 2026-05-31 · Sub-campaign of the Off-Page Authority Program · Owner: operator**

## Why this campaign exists (the data, not a hunch)

The GEO citation probe (`monitoring/geo-citation-probe.py`) measured a hard gap.
Baseline 2026-05-31 (You.com Research, answer-engine citations):

| Intent cluster | Surfaced | Own-domain cited | Status |
|---|---:|---:|---|
| methodology | 100% | 100% | ✅ owned |
| agent-infra | 100% | 50% | ✅ owned |
| discovery | 67% | 67% | 🟡 on the bubble |
| **alternatives** | **0%** | **0%** | 🔴 **this campaign** |

The "alternatives" intent is the **highest commercial-intent cluster** — someone
asking "free alternatives to Crunchbase/PitchBook/Harmonic for GitHub-based deal
flow" is a buyer. We are cited **0%** despite shipping 14 well-built `/alternatives/*`
comparison pages (all live, HTTP 200, full feature tables + FAQ schema).

## The mechanism (why great on-page pages still get 0% here)

When the probe asked the alternatives questions, the engine cited these — every one a
**third-party roundup/listicle**, none a vendor comparison page:

- `vcbeast.com/crunchbase-alternatives`
- `affinity.co/guides/vc-ai-tools`
- `coresignal.com/blog/startup-data-guide`
- `chatfin.ai/blog/top-10-best-ai-tools-for-private-equity-vc`
- `natecue.com/.../star-history-github`, `reporank.co`, `devactivity.com`,
  `gitrecap.com/blog/free-github-activity-tracker-tools` (the "free GitHub tools" framing)
- `github.com/iloveitaly/openbook` (the "open-source PitchBook" framing)

**Conclusion:** for "X alternatives" queries, answer engines structurally prefer
*independent* roundups over *first-party* "we vs them" pages. Our `/alternatives/*`
pages are first-party — so they're skipped no matter how good they are. **The fix is
not more on-page work; it is getting VC Deal Flow Signal *into the roundups the
engines already cite*.** That is an off-page move — confirming the Off-Page briefing's
Track 1, now with the exact surfaces named and a way to measure success.

---

## Target surfaces, tiered by (yield ÷ effort)

### Tier A — self-serve directories — ⚠️ CORE ONES ALREADY LIVE (verified 2026-05-31)

**Do NOT resubmit** AlternativeTo or SaaSHub — they've been live since 2026-05-22/24
(see memory: `project_alternativeto.md`, `project_saashub.md`, `reference_skip_list.md`).
Per the standing division of labor, every directory submission is behind a login gate →
**the user submits; the agent only drafts.** So Tier A reduces to *incremental* moves on
the listings that already exist, plus the two not-yet-done directories.

| Surface | Status | Incremental action (USER — login-gated) |
|---|---|---|
| **AlternativeTo.net** | ✅ LIVE (alt to Crunchbase, PitchBook, CB Insights, Harmonic, Tracxn) | (a) **add Dealroom + Affinity** as alt-to mappings (currently missing); (b) **get upvotes** — listing has 0 likes so it doesn't rank; (c) add screenshots. |
| **SaaSHub** | ✅ LIVE (alt to Crunchbase, PitchBook, Harmonic, Tracxn, CB Insights) | add product video + screenshots for "featured" review; add Dealroom + Affinity tags. |
| **Product Hunt** | ✅ Launched 2026-05-18 | ensure the listing's "Alternatives" tab maps the 6 competitors. |
| **SourceForge "Compare"** | ⬜ NOT done | free vendor listing + comparison rows vs Crunchbase/PitchBook. New, do-follow. |
| **Slashdot (Business Software)** | ⬜ NOT done | mirrors SourceForge graph; same listing. |
| ~~G2 / Capterra~~ | ❌ abandoned | require business verification (vendor email + phone) — skip. |

Full dedup'd, ready-to-act checklist with copy: **`assets/directory-actions.md`**.

### Tier B — listicle inclusion outreach (1 email each, highest authority yield)
Get added to the roundups the probe caught the engines citing. One concise pitch each;
the angle is **"the free / GitHub-native option you're missing."**

| Roundup | Editor angle to pitch | Asset |
|---|---|---|
| vcbeast.com/crunchbase-alternatives | "free + GitHub-signal" gap in their table | `assets/listicle-outreach-email.md` (A) |
| affinity.co/guides/vc-ai-tools | adds a *sourcing-signal* category they lack | asset (B) |
| coresignal.com/blog/startup-data-guide | complementary free dataset (CC-BY) | asset (A) |
| Any p1 "best VC tools 2026" / "free Crunchbase alternatives" blog | same | asset (A) |

### Tier C — own the "free GitHub deal-flow tool" framing
The probe showed a *second* answer pattern: "free GitHub tools" → Star History,
RepoRank, devActivity, openbook. We're absent from that framing. Two moves:
1. **GitHub awesome-list PRs**: awesome-vc, awesome-startup-tools, awesome-alternative-data
   (awesome-mcp-servers already in). Push branches; user does the 1-click cross-fork PR
   (see memory: gh CLI cross-fork PR blocked).
2. List the **free micro-tools** (Badge Builder, Scout receipts) on the Tier-A
   directories under the "free tool" tag, not just the paid product.

---

## On-page reinforcements (small, supportive — NOT the main lever)

Won't fix 0% alone, but they help the engine connect us once authority lands:
1. Add a neutral, **roundup-shaped** comparison hub at `/alternatives` ("9 tools for
   GitHub-based deal sourcing, compared") rather than only "us vs them" — engines pull
   roundup-shaped content. Keep the per-competitor pages; add an objective multi-tool table.
2. Emit `ItemList` + `SoftwareApplication` schema for *both* tools on each
   `/alternatives/*` page (not just FAQ) so the comparison is machine-extractable.
3. Cross-link the hub from `/answers`, `/faq`, and the methodology page (already-owned
   high-authority internal pages) to pass internal equity.

---

## Measurement loop (what makes this a campaign, not a wish)

1. **Now:** baseline logged — alternatives surfaced **0%**, own-domain **0%**.
2. **Each Monday:** the weekly launchd job re-runs the battery. Watch the
   `alternatives` row in `monitoring/geo-citation-latest.md`.
3. **Target (90 days):** alternatives **surfaced ≥ 50%**, own-domain **≥ 25%**.
   Realistic: directory listings (Tier A) get crawled + AI-ingested within weeks and
   move "surfaced" before "own-domain."
4. If a directory listing lands but the cluster stays 0% after 30 days → engines weight
   editorial roundups over directories → escalate Tier B outreach.

Widen the read once live: add `alternatives-pitchbook` + `alternatives-free-github` to
`monitoring/geo-queries.json`.

---

## This week's concrete checklist (operator) — DEDUP'D against what's already live

- [ ] **AlternativeTo** (existing listing, login `data-nerd-gdf`): add **Dealroom + Affinity**
      as alt-to mappings; get a handful of **upvotes** (0 today → not ranking). Do NOT create a new listing.
- [ ] **SourceForge + Slashdot** "Compare" — the two directories NOT yet done. New do-follow
      listings (`assets/directory-actions.md` has copy).
- [ ] **SaaSHub** (existing): add screenshots/video for "featured" review; add Dealroom/Affinity tags.
- [ ] Send the listicle-inclusion emails (`assets/listicle-outreach-email.md`) — the real authority lever.
- [ ] Push awesome-list branches; ping operator for the cross-fork PRs.
- [ ] (Optional, separate PR) add the roundup-shaped `/alternatives` hub table.
- [ ] Re-run probe in 2 weeks (auto once the Anthropic key is refreshed; else manual ingest).

> Note: `assets/alternativeto-listing.md` copy is retained as reference for the
> incremental edits, **not** for a fresh submission (the listing already exists).

## Blocker logged
Automated probe provider (Anthropic) is down: `ANTHROPIC_API_KEY` in `tools/.env` is a
23-char truncated/placeholder value and returns `invalid x-api-key` (401). Refresh at
https://console.anthropic.com/settings/keys to enable scheduled automated runs. Until
then, the manual-ingest path (You.com / Perplexity / ChatGPT export) works.
