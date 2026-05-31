# Directory + roundup actions — RETARGETED to the Crunchbase-alternatives gap

Updated 2026-05-31 PM after the two-engine GEO probe. **The gap is narrower and
sharper than the first plan assumed.**

## What the second engine changed

The first plan said "the whole alternatives cluster is 0%." The Anthropic run (n=36)
proved that wrong. Per-query truth, both engines:

| Query | You.com | Anthropic | Verdict |
|---|---|---|---|
| `alternatives-harmonic` | — | **67% / 67%** | ✅ we already win this framing |
| `alternatives-crunchbase` | 0% / 0% | **0% / 0%** | 🔴 the ONE real, cross-engine gap |

So this is not an "alternatives" problem — it's **specifically the
"Crunchbase alternative" framing.** Everything below targets that, and only that.

## WHY we lose the Crunchbase query (from the probe's cited competitors)

For `alternatives-crunchbase`, the engines surfaced these instead of us:
`crunchbase, pitchbook, openvc, dealroom, devactivity, reporank, star history`.

Two distinct rival camps, and we fit neither *as currently framed*:
1. **"Free startup/investor database"** → OpenVC, Crunchbase free tier. We are NOT a
   database, so the query's implicit "free database" intent skips us.
2. **"Free GitHub-activity tool"** → Star History, RepoRank, devActivity. These own the
   GitHub-data angle in Crunchbase-alternative roundups — and **we, the one tool that
   turns GitHub data into a fundraise signal, are absent from those roundups.**

Contrast: for `alternatives-harmonic` the field is Crunchbase/Dealroom/Evertrace/
Harmonic/PitchBook — a "pre-fundraise sourcing" frame where our leading-signal angle
already wins. **The fix is to make the Crunchbase query read like the Harmonic query:
position us as the free, GitHub-native *leading signal*, and land in the roundups that
answer "Crunchbase alternatives."**

---

## TARGET LIST — the roundups that actually rank for "Crunchbase alternatives 2026"

Pulled live 2026-05-31. These are the editorial pages answer engines cite for this
query. Inclusion in even 2–3 is the highest-leverage move. (Outreach copy:
`listicle-outreach-email.md`, variant **CB**.)

| Roundup | URL | Angle to pitch / gap they have |
|---|---|---|
| VC Beast | https://vcbeast.com/crunchbase-alternatives | Already cite "free + GitHub" framing; no fundraise-signal tool listed |
| Papermark | https://www.papermark.com/blog/crunchbase-alternatives | Founder-skewed; missing a free pre-raise signal |
| Multilogin | https://multilogin.com/blog/best-crunchbase-alternatives/ | Sales/data-skew; no GitHub-native option |
| Peony | https://www.peony.ink/blog/top-10-crunchbase-alternatives | "data everyone scrapes" angle — we're the non-scraped public-GitHub signal |
| Prospeo | https://prospeo.io/s/crunchbase-alternatives | "honest guide" — open to a genuinely different category |
| Smarte | https://www.smarte.pro/blog/crunchbase-alternatives | B2B-data list; no leading-indicator entry |
| StartupHub.ai | https://www.startuphub.ai/alternatives/crunchbase | "free AI startup DB + real-time API" — direct fit for our free API/MCP |
| GlobalDatabase | https://www.globaldatabase.com/top-10-crunchbase-alternatives-competitors-... | company/funding-data list; GitHub-signal gap |
| startupa.ge | https://startupa.ge/alternatives/crunchbase | small "5 best" list, easy to amend |

Priority order: **VC Beast → StartupHub.ai → Peony → Prospeo** (most on-theme / most
likely to add a free GitHub-native entry), then the rest.

## Directory actions — now scoped to reinforce the Crunchbase framing

All login-gated → **user executes**; agent drafts only (standing division of labor).

### 1. AlternativeTo (LIVE since 2026-05-24) — make the Crunchbase mapping rank
- The Crunchbase alt-to mapping already exists but the listing has **0 upvotes**, so it
  doesn't surface on `/software/crunchbase/` alternatives. **Getting even 3–5 upvotes on
  the Crunchbase-alternative relationship is the single cheapest win** — AlternativeTo is
  itself one of the pages engines read for this query.
- Add 2–3 screenshots; ensure the one-liner leads with "free GitHub-native leading
  signal," not "engineering acceleration" jargon.
- URL: https://alternativeto.net/software/vc-deal-flow-signal/manage/

### 2. StartupHub.ai — both a roundup AND a directory
- It has a `/alternatives/crunchbase` page AND lists a "free AI startup DB + real-time
  API." Our free JSON/CSV/MCP API is a direct fit. Submit/pitch for inclusion there
  specifically (covers a directory + a cited roundup in one move).

### 3. SourceForge / Slashdot "Compare" — NEW, lead the comparison with Crunchbase
- When creating the listing, make the **headline comparison row "VC Deal Flow Signal vs
  Crunchbase"** (not vs Harmonic). These Compare pages are do-follow + AI-ingested and
  reinforce the exact framing we're losing.

### 4. SaaSHub (LIVE) — upvote the Crunchbase-alternatives relation
- Same mechanic as AlternativeTo: the listing exists; nudge the `/crunchbase-alternatives`
  relation with a couple of votes + screenshots so it surfaces.

## On-page reinforcement (one small, high-value change)
Our `/alternatives/crunchbase` page is first-party so engines won't cite it for the query
directly — but we can make it **roundup-shaped and quotable**: add a neutral
"Free Crunchbase alternatives for GitHub-based sourcing (2026)" comparison table listing
us *alongside* OpenVC, Star History, RepoRank, devActivity with an honest one-line each.
Engines pull roundup-shaped tables; a first-party page that reads like a roundup has a
better shot at being quoted than a pure "us vs them" page. (Separate PR; optional.)

## Explicitly SKIP (unchanged, logged in memory)
- G2 / Capterra (business-verification gated), SEO-farm directories, paid "guaranteed listing."
- Do NOT chase `use-case-trending` (0% on Anthropic) — engines won't cite us for live
  "what's accelerating right now" rankings. That's a freshness limit, not authority. Skip.

## Measurement
Re-run the probe in ~2 weeks and watch **`alternatives-crunchbase` specifically** (not the
cluster average). Target: move it from 0% → surfaced ≥33% on at least one engine. The
`alternatives-harmonic` 67% is the proof the positioning works once we're in the roundups.
