# Directory actions — DEDUP'D (what's left, after reconciling with what's already live)

Reconciled 2026-05-31 against project memory. **Most core directories are already live.**
This file lists ONLY the incremental, not-yet-done actions. All require a logged-in
account → **user executes** (agent cannot create accounts or submit logged-in forms).

## Already LIVE — do NOT resubmit
| Directory | Live since | Alt-to mappings present |
|---|---|---|
| AlternativeTo (`data-nerd-gdf`) | 2026-05-24 | Crunchbase, PitchBook, CB Insights, Harmonic, Tracxn |
| SaaSHub | 2026-05-22 | Crunchbase, PitchBook, Harmonic, Tracxn, CB Insights |
| Product Hunt | 2026-05-18 | — |
| Wikidata (Q139376302) | — | entity anchor |

## Incremental actions (the only new work)

### 1. AlternativeTo — strengthen the existing listing
- **Add missing alt-to mappings:** Dealroom, Affinity (both have live `/alternatives/*`
  pages on our side but are absent from the AlternativeTo listing).
- **Fix the ranking problem:** listing has **0 likes** → it won't surface. Get a few
  genuine upvotes (community ask, or a second account — your call on policy).
- Add 2–3 screenshots (login required).
- URL: https://alternativeto.net/software/vc-deal-flow-signal/manage/ (edit mode)

### 2. SourceForge — NEW listing (not yet done)
- Create a free vendor/project listing at https://sourceforge.net/software/vendors/
- Use the copy in `alternativeto-listing.md` (name, tagline, full description).
- Add "Compare to" rows vs Crunchbase, PitchBook, CB Insights, Harmonic, Tracxn,
  Dealroom, Affinity. SourceForge "Compare" pages are do-follow and AI-ingested.

### 3. Slashdot Business Software — NEW (mirrors SourceForge)
- Same vendor account often spans both; submit the same listing at
  https://slashdot.org/software/ . Low marginal effort once SourceForge is done.

### 4. SaaSHub — completeness pass on existing listing
- Add product video + screenshots (improves "featured" review odds).
- Add tags/alt-to: Dealroom, Affinity.

## Explicitly SKIP (logged in memory)
- G2 / Capterra — require business verification (vendor email + phone), abandoned.
- Generic "submit your startup" SEO-farm directories — nofollow/toxic.
- Paid "guaranteed listing" services — link schemes.

## Why this is still the right campaign despite directories being live
The directories are live but the `alternatives` cluster is **still 0% cited** — which
tells us directory presence alone isn't moving the answer engines yet (AlternativeTo's
0-upvote ranking is likely why it's not surfaced). So the priority order is:
1. **Listicle inclusion** (editorial roundups — what the engines actually cite) ← highest leverage
2. **AlternativeTo upvotes + Dealroom/Affinity mappings** (make the live listing rank)
3. **SourceForge/Slashdot** (net-new do-follow surfaces)

Re-measure with the GEO probe in 2 weeks; watch the `alternatives` row.
