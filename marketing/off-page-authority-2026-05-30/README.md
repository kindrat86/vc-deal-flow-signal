# Off-Page Authority Campaign — 2026-05-30

Execution pack for the one dimension that can't be fixed in the repo: **off-page authority**
(the 62/100 in the 05-30 audit). Builds directly on
[`seo-authority-and-indexation-2026-05-30.md`](../seo-authority-and-indexation-2026-05-30.md)
and reuses the `tier5-link-building/` + `email-api/` pipeline already in place.

## Why now (sequencing gate cleared)

The 05-30 authority memo said **Phase 0 must precede link-building or links land on discounted
pages.** That gate is now cleared:

- ✅ `/showdown` near-dup family shipped `noindex` (PR #272) — sitemap 4,142 → 2,792.
- ✅ GSC ground truth = **83% indexed** on sample (the earlier "~4 indexed" was a `site:`-proxy
  artifact, now overturned).

So the ~400-page unique editorial core + entity hubs are indexable and worth pointing authority at.
**Link-building is no longer wasted spend.** Proceed.

## What off-page authority decomposes into (what we're moving)

| Signal | State | Plays in this pack |
|---|---|---|
| Referring-domain count + diversity | weak (mostly self-owned) | badge embeds, awesome-lists, resource pages, guest posts |
| Brand search volume ("code-side sourcing", "gitdealflow") | ~zero | category-seeding via guest essays + data-drops |
| Entity / knowledge-graph authority | **strong** (SSRN, ORCID, Wikidata) | dataset distribution (Dataset Search, OpenAlex) |
| Co-citation (named beside Crunchbase/PitchBook) | weak | listicle additions, resource pages |

## ⚠️ Honest limits on "send autonomously" (read before dispatch)

I built every asset send-ready, but **I could not dispatch from this worktree**, by design and by fact:

1. **No send capability here.** This is the `cranky-keller` worktree: `email-api/.env` (RESEND_API_KEY,
   FROM_EMAIL), the `resend` npm module, and `outreach-schedule.json` are all **absent**. The live
   sender (`email-api/send-outreach.mjs`) runs on your machine via launchd against local files not in
   this checkout. Running it here would fail.
2. **Wrong mail channel available.** The only connected mail MCP is a **Gmail account, draft-only (no
   send tool)**. All brand outreach must go from the **warmed `signal@gitdealflow.com` (Resend)** domain
   — a Gmail send would burn a cold sender and bypass your warm-up. So I did **not** create Gmail drafts.
3. **Dedup RESOLVED (2026-05-30) — the cold list is SATURATED.** Checked against the live
   `email-api/outreach-sent.json` (46 records): **every newsletter + VC target in the data-drop pitch was
   already cold-emailed twice** (initial + follow-up). Andre Retterath got **three** touches across two
   addresses, the last on **2026-05-27 (3 days ago)**. Connie, Packy, Gergely, Newcomer, Generalist, Lenny,
   Elizabeth Yin and the whole Tier 1–3 VC list: all done. → **`schedule-additions.json` is now DISABLED
   (entries emptied). Do NOT re-send.** A 3rd/4th cold touch is the one thing that sets us back.

**Net: the cold-email channel is exhausted.** Off-page authority now comes from the channels that DON'T
touch that list, all confirmed open:

## Open channels (use these — none re-touch the saturated list)

1. **Badge embeds** → `badge-embed-outreach.md`. GitHub issues/PRs to 24 accelerating companies. Fresh
   channel, zero email overlap, zero deliverability risk, dofollow links from *their* domains. **Start here.**
2. **Resource-page / listicle curators** → `awesome-listicle-targets.md` + `tier5-link-building/`. Confirmed
   fresh (Failory, Qubit, Papermark, Visible.vc, Proven SaaS, ExtractAlpha, BrightData — **none** in the sent
   log). Co-citation beside Crunchbase/PitchBook. These CAN go through the email pipeline (new recipients).
3. **Dataset distribution** → `awesome-listicle-targets.md` §dataset. Google Dataset Search, Zenodo DOI,
   OpenAlex/Semantic Scholar. **No email at all** — pure entity authority, your strongest axis.

## When the saturated list reopens

Only re-contact a saturated name if **they** engage (reply/open-driven), or after a **60–90 day cooldown**
with a genuinely new hook (e.g. an accepted guest essay) — routed through the pipeline's normal pacing.

## Files in this pack

| File | What | Action |
|---|---|---|
| `data-drop-pitch.md` | 7 newsletter "data-drop" pitches in current voice (tool-not-a-fund) | queue top 3–4 after dedup |
| `guest-essay-outlines.md` | 3 guest-essay outlines seeding the **Code-Side Sourcing** category | pitch w/ data-drop |
| `badge-embed-outreach.md` | 24 ranked badge-embed targets from `companies.ts` + embed snippet + template | press@/devrel route |
| `awesome-listicle-targets.md` | dedup'd awesome-list + resource-page targets, ready-to-paste entries | PR branches + curator emails |
| `schedule-additions.json` | the email entries pre-formatted for `email-api/outreach-schedule.json` | merge + dispatch |

## The one prerequisite for the data-drop (do this first)

The press value of a data-drop is the **freshness + venture-relevance** of the ranking. The current
`data/top-100/latest.json` is **w19 (2026-05-04, ~4 weeks stale)** and is **polluted with non-venture OSS**
(monero-project, sonic-pi, harvard-edge). **Pitching that as-is backfires** — a journalist who clicks
sees Monero, not startups.

**Before any data-drop send:** re-run the weekly ranking and apply a venture-relevance filter (exclude
pure-OSS / academic orgs; keep venture-backed companies). Then the pitch points at a clean, current,
genuinely newsworthy Top-N. Until then, queue the guest-essay + badge + listicle plays (which don't
depend on fresh ranking data).

## Sequencing (next 30 days)

1. **Week 1** — badge embeds (zero deliverability risk, dofollow links from *their* domains) + awesome-list
   PR branches + 3 resource-page curator emails.
2. **Week 1–2** — fresh venture-filtered ranking run → then queue 2 data-drop pitches (Andre Retterath
   first — both a user *and* a 45k-sub amplifier).
3. **Week 2–4** — 1 guest essay placement around the category; co-citation listicle adds.

Measure monthly in GSC: referring **domains** (not links), brand-query impressions ("code-side sourcing"),
and unprompted web mentions of the term.
