# Evan Buhler — thesis reverse-engineering + board verdict

**Date:** 2026-05-29 (the "over the weekend" he asked for)
**Context:** Evan (@evanbuhler) rejected the daintree/dev-tools pitch on a momentum framing. In voice
notes he said: *generalist fund, likes AI, into neurotech, very comfortable being early, but dev-tools
no, and not interested in the momentum angle.* Then: *"Why don't you take my portfolio, my website,
and try to reverse engineer what this guy is investing in? It's not dev tools."* I promised to do
exactly that and come back **only if I find something interesting.**

---

## 1. Decoded thesis (the homework he asked for)

**Who he is**
- GP at **Talok Capital** (talokcapital.com), early-stage VC, founded 2024, SF Bay Area.
- Also a startup/VC attorney at **Generative Counsel** (generativecounsel.com), UC Irvine Law '19.
- Operates as an angel-sized writer: **~$5K–$20K checks, sweet spot ~$10K**, pre-seed/seed.

**What he actually backs (portfolio = ground truth, not the deck)**
- **xAI** — frontier AI. Signals: conviction on application-defining AI, comfort with frontier risk.
- **Parafin** — embedded fintech / SMB capital infrastructure. Signals: fintech *rails behind*
  real businesses, not consumer fintech apps.
- **Draftly** (advisor) — LinkedIn content/creator-growth tool. Signals: creator economy +
  future-of-work + practical AI-assisted content.

**Stated focus areas (nfx / public profiles), filtered through what he confirmed by voice:**
- Future of Work, Education, Human Capital / HRTech, Creator/Passion Economy, AI, LegalTech, SaaS,
  GenAI, marketplaces, social commerce/networks, wellness.
- Explicit voice additions: **AI yes, neurotech yes, very early yes.**
- Explicit exclusions: **dev-tools no, momentum-as-thesis no.**
- Repeatedly flagged as a backer of **diverse and female founders.**

**One-line read of his real lane:**
> Early (pre-seed) **application-layer AI**, **embedded fintech rails**, and **future-of-work /
> creator tools** — plus genuine **neurotech** curiosity. Small, fast checks. First-time / diverse
> founders. Allergic to dev-tools and to "look how fast they're shipping" pitches.

---

## 2. Board verdict (honest)

I ran the full current board (135 unique startups, Q2 2026, 20 sectors) against the decoded thesis.
Filter: early-stage (pre-seed/seed) AND application-layer (not infra/dev-tools/OSS-library) AND
plausibly AI / fintech / future-of-work / neurotech AND momentum that reflects real engineering
(not bot commits).

**Result: nothing clears the bar this week.** Why:

1. **The board structurally over-indexes on exactly what he said no to.** It ranks on GitHub
   engineering momentum, so the top of every sector is mature OSS infra and dev-tools —
   huggingface, ray, mlflow, modular, vespa, roboflow. That's the dev-tools/momentum pile he rejected.
2. **Everything genuinely app-layer is already Growth-stage** (too late for a pre-seed angel).
3. **Neurotech essentially never appears.** Neurotech R&D lives in wet labs and private repos, not
   public commit streams — a momentum board can't see it. Honest structural blind spot to admit.
4. **The single "early + AI-tagged" row is a false positive:** `zapply.jobs` — a job-application
   autofill extension + curated job-board lists. Not AI, and its high commit velocity (1692/14d,
   3 contributors) is **automated listing-update bots**, not real engineering. Pitching it would
   instantly read as spam to him and burn the warm thread.

**Decision: do not manufacture a pitch.** He set the bar ("only if interesting") and praised honesty.
The correct move is to return the homework, give the honest no, and set a real standing filter.

---

## 3. Candidates considered and rejected

| Startup | Why it surfaced | Why it fails Evan's thesis |
|---|---|---|
| zapply.jobs | early + AI/HR tag | not AI; bot-inflated commits; growth-stage marketing |
| huggingface / ray / mlflow / modular / vespa / roboflow | top AI momentum | dev-tools/infra (explicit no) + too late |
| photoprism | "AI-Powered Photos App" | growth-stage OSS, self-hosted infra flavor |
| GetStream | in-app chat/feeds + AI moderation | growth-stage infra/SDK (dev-tools adjacent) |
| medusajs / saleor / vuestorefront | commerce | dev-first commerce infra (dev-tools) |
| elimu-ai | pre-seed, edtech, mission-driven | OSS learning software, not AI/fintech, no momentum |
| daintreehq | the original pitch | dev-tools — already rejected by him |

---

## 4. Standing filter (so the come-back is real, not vapor)

`scan-evan-fit.py` encodes this thesis as a repeatable filter over `pseo-site/data/startups.json`.
Re-run it weekly; it prints only companies that trip Evan's lane. He hears from me **only** on a hit.

Run: `python3 marketing/evan-buhler-2026-05-29/scan-evan-fit.py`
