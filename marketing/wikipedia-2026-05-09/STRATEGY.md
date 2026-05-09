# Wikipedia distribution strategy — 2026-05-09

> **STATUS: DEFERRED until 2026-08-01 minimum.** See `DO-NOT-USE-UNTIL-2026-08.md` at bundle root and `memory/feedback_wikipedia_llm_flag_2026_05_03.md`. The `User:TheDataNerd` account has two LLM-detection flags from 2026-04-26 and 2026-05-03 (Albinism revert + Deal sourcing decline). Posting from this bundle now risks a third flag → topic ban or block. Use the deferral window to satisfy gates per `corroborating-sources-accumulation-plan.md`. The strategy below remains valid for the eventual retry.

---

## Why Wikipedia is the highest-leverage trending channel right now

Per the 5W AI Platform Citation Source Index released 2026-05-01:

- The **top 15 domains capture 68% of all consolidated AI citation share** across ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews.
- **Wikipedia accounts for 26-48% of ChatGPT's top-10 citation share** — by far the dominant single source for that engine.
- One well-cited Wikipedia paragraph can become a permanent AI-citation flywheel for the topic, with no recurring effort.

For a project anchored on an SSRN paper (`abstract=6606558`), Wikipedia is the single highest-ROI external surface available — but only if the editorial work is done correctly. Done sloppily, the article gets deleted within 7-14 days for notability or COI, and the topic becomes harder to revisit.

## The core trade-off: standalone article vs. section edits

Two playable paths.

### Path A — Standalone article: "GitHub signals (venture capital)"

- **Upside:** Permanent, well-cited surface that AI engines will quote when answering "what are GitHub signals for VC", "engineering acceleration as fundraise predictor", etc.
- **Downside:** ~30-50% deletion-nomination rate within 14 days for new articles in commercial-adjacent topics. To survive AfD, the article needs **multiple independent reliable secondary sources** — not just the SSRN paper plus the project's own writing.
- **Notability gate:** WP:GNG requires "significant coverage in reliable sources independent of the subject." One SSRN preprint does not clear this bar.

### Path B — Section edits to existing high-traffic articles (recommended once gates open)

- **Upside:** ~5-10x higher stick rate. Editors are far more tolerant of well-cited additions than of new commercial-adjacent articles.
- **Downside:** Less surface area, no dedicated page.
- **Target articles** (priority order):
  1. **[Alternative data (finance)](https://en.wikipedia.org/wiki/Alternative_data_(finance))** — directly relevant.
  2. **[Venture capital](https://en.wikipedia.org/wiki/Venture_capital)** — under sourcing subsection.
  3. **[GitHub](https://en.wikipedia.org/wiki/GitHub)** — under research-uses subsection.

## Recommendation

**Run Path B first, once gates open, then Path A six months later if more secondary-source coverage exists.**

Path B can ship in a single session — 1-2 sentences each into 2-3 existing articles, properly cited. Stick rate is high; AI-citation lift starts within 30-60 days.

Path A ships only when there are at least **three independent reliable secondary sources** (academic citations of the SSRN paper, or substantial trade-press coverage). Until then, attempting Path A risks burning the topic.

## Conflict-of-interest disclosure

WP:COI requires that editors disclose paid or affiliated relationships when editing about a topic they have ties to. The user (`TheDataNerd`) has authored the SSRN paper that would be the primary citation — and the username matches the paper byline, making the COI identity-obvious to any reviewing editor.

**Disclosure is mandatory:**

- Edit-request mechanism on the article's Talk page (proposes the change, lets uninvolved editors review and apply it).
- COI declaration on `User:TheDataNerd` user page.
- Never make undisclosed COI edits.

## Operational checklist (Path B, edit-request route, FOR EVENTUAL RETRY)

For each target article (when gates open):

1. Open the article's **Talk** page.
2. Click "New section" → title it `Edit request: [topic] under [section name]`.
3. Body: state the proposed change, the exact wording (HAND-RETYPED, never pasted), the citations in `<ref>{{cite journal|...}}</ref>` format, and the COI disclosure.
4. Wait 5-14 days for an uninvolved editor to review.
5. If the edit is accepted, monitor the article for 30 days for reverts. If reverted, engage on the talk page — never re-add unilaterally.

## Files in this bundle

- `STRATEGY.md` — this file.
- `DO-NOT-USE-UNTIL-2026-08.md` — root banner. Read first.
- `option-a-standalone-article.md` — Path A draft (DEFERRED).
- `option-b-section-edits.md` — Path B drafts (DEFERRED, hand-retype-only when re-opened).
- `RESEARCH-NOTES.md` — verified sources, policy refs, terms not to use.
- `corroborating-sources-accumulation-plan.md` — concrete actions for the deferral window.
