# OWNER ACTIONS — signals.gitdealflow.com

> Prepared by growth-harness (Claude Sonnet 5), 2026-07-23. This site is
> owner-gated (see AGENTS.md: "Auto-deploy loop DISABLED intentionally — do
> not turn it back on") so nothing below was deployed. It was fully verified
> locally before being logged here — see the commit message for what.

---

## 1. Title/meta rewrite on the 2 highest-value click-gap pages (2026-07-23)

**What:** `growth-harness`'s `click_gap` signal found 5 page-one pages
earning almost no clicks despite real rankings — the largest measured lever
in the whole 10-site portfolio (see `growth-harness/STRATEGY.md`). This
change fixes the two highest-value ones:

- `/vs/harmonic-ai-vs-pitchbook` — position 6.1, 1,194 impr/28d, 3 clicks
- `/vs/harmonic-ai-vs-dealroom` — position 5.0, 259 impr/28d, 1 click
- `/compare/best-ai-deal-sourcing-tools-2026` — position 9.1, 254 impr/28d, 1 click

Titles rewritten to match the actual dominant query phrasing (a direct
question — GSC data shows these mostly rank via AI Overview / AI Mode
answering the question from the page, not a human clicking a blue link).
Meta descriptions rewritten from a fully generic template to a real sentence
pulled from each page's own hand-authored verdict — no invented copy.

The title/description change is in the shared `vs/[slug]/page.tsx` template,
so it applies to all 35 `/vs/` pairs, not just these two — verified across 5
sample pages including all 3 pairs that hit an extraction edge case (verdict
opens with a shared-trait sentence rather than the differentiator).

**Commit:** `336e78ea` on `worldclass-signals` (already pushed to origin).

**Verified before logging here:** `tsc --noEmit` clean, `eslint` clean, real
local dev server (not just a build pass), rendered `<title>`/meta spot-checked
on 5 pages, JSON-LD (Article/BreadcrumbList/FAQPage) confirmed intact, and a
screenshot of the live-rendered page confirming no hydration blank-screen —
this site's own documented failure mode, and the reason this checklist says
screenshot rather than curl.

**Deploy command — run from the clean worktree, NOT the primary working copy:**

The primary working copy at `~/signals-gitdealflow/pseo-site` is currently on
branch `internal-link-engine` with 42 uncommitted files — `vercel --prod`
from there would ship that, not this change. Deploy from the isolated worktree
instead:

```bash
cd /tmp/growth-harness-track-a-signals-1784821182/pseo-site
git log --oneline -1   # confirm you see 336e78ea
vercel --prod
```

If that worktree has since been removed, rebuild a clean one first:

```bash
cd ~/signals-gitdealflow
git worktree add --detach /tmp/signals-deploy-1784821587 origin/worldclass-signals
cd /tmp/signals-deploy-*/pseo-site && npm ci && vercel --prod
```

**Pre-deploy check from AGENTS.md:** the domain is alias-pinned — `vercel --prod`
alone may not update the live site; you may need to re-alias afterward.

**After deploying:** verify with a screenshot of `https://signals.gitdealflow.com/vs/harmonic-ai-vs-pitchbook`
(the site's own convention — a 200 status has hidden a blank page here before).

---

## 2. Remaining click-gap pages — investigated 2026-07-23, no further code change

The harness's `click_gap`/`striking_distance` signals flagged 5 pages total.
Sections 1-2 account for all 5. No new commit — everything below was resolved
by reading real data, not by writing more code.

**`/vs/harmonic-ai-vs-crunchbase` — already fixed, no separate change needed.**
Position 10.6, 445 impr/28d, 1 click. It uses the same shared `vs/[slug]/page.tsx`
template as pitchbook and dealroom, so commit `336e78ea` above already fixes
its title/description too. Verified rendering: `How Does Harmonic.ai Compare
to Crunchbase? (2026)`, description leads with the real differentiator
(leading signal vs. lagging database). Nothing further to do.

**`/research-paper/hu-2021-lora-low-rank-adaptation` and
`/research-paper/bai-2022-constitutional-ai` — investigated, declined.**
3,982 and 519 impr/28d respectively, ~1 click each. Pulled the actual queries
landing on both pages: overwhelmingly literal paper-citation searches ("hu et
al 2021 lora paper", "bai et al 2022 constitutional ai arxiv") — people want
the primary source (arxiv.org), not a third-party summary, however good. A
title rewrite either loses to arxiv.org's authority for that exact intent
anyway, or wins clicks from an audience (researchers/engineers hunting a
citation) that isn't this site's buyer and won't convert. Left the titles as
they are — correctly framed as "VC Deal Flow Signal Research" context pages,
not paper mirrors. The harness's separately-proposed `internal_links` action
on both pages is still open in `plan.md` and is a reasonable next step if you
want to chase position without touching the copy.

**`/answers/free-harmonic-ai-alternative-2026` — investigated, declined.**
448 impr/28d, 6 clicks. The title/description are already strong and already
match the dominant query intent almost exactly: `Harmonic.ai Pricing & Free
Alternative (2026) — $24k/seat vs $0` against real queries "harmonic pricing"
(37 impr), "harmonic.ai alternative" (37 impr), "how much does harmonic cost"
(16 impr). The queries sit at position 7-15, where near-zero CTR is expected
regardless of title quality — this is a ranking problem, not a copy problem,
and rewriting an already-good title would be busywork. The harness's
`internal_links` proposal for this URL (open in `plan.md`) is the right lever.

Full reasoning + the raw query data for both decisions is in
`growth-harness/state/signals.gitdealflow.com/changelog.md`.
