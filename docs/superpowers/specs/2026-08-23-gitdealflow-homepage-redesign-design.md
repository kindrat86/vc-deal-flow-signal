# GitDealFlow homepage redesign

## Objective
Turn `gitdealflow.com` from a dense all-at-once sales page into a premium, evidence-led conversion path for angels, scouts, and seed investors. The primary conversion remains the free Sunday email signup: **Get this Sunday’s 5 names**.

## Audience and promise
The visitor is an investor who wants technical startup deal flow before it becomes obvious, but does not want to read code. GitDealFlow reads public GitHub engineering activity across **350+ startup orgs** in **15 sectors** and sends five weekly plain-English signals.

### Claim guardrails
- Use only canonical public claims: 350+ orgs, 15 sectors, and the descriptive panel of 219 startup-period observations across 55 startups with no linked funding-event labels.
- State the 21 to 47 day window as an observed research-panel lead time, never a promise or funding prediction.
- A flagged company is a public engineering-activity match, not a claim it is raising.
- Do not add invented testimonials, client logos, performance results, or investment advice.
- Keep pseudonymous public identity. Never expose the maintainer’s real name.

## Creative direction
### Visual language
A dark editorial research desk: graphite and ink-blue surfaces, warm ivory typography, restrained signal-orange as the single conversion accent, hairline data-grid texture, and pale cyan reserved for verification links. The layout uses asymmetry, generous space, large numeric moments, a solid header, and a single primary CTA.

### Hero
The hero is a two-column composition on desktop and a story-first stack on mobile:
1. eyebrow: who the product is for;
2. headline: “The best technical startups do not announce momentum. They commit it.”;
3. explicit mechanism and canonical scope;
4. a premium embedded-video frame with an honest poster state;
5. email capture and risk reversal;
6. compact evidence rail: public, plain English, Sunday cadence.

The video container must work before the generated asset exists, using a branded poster and an accessible `aria-label`. It will play a provided MP4 with controls and captions when `media/gitdealflow-signal-explainer.mp4` and the matching VTT file exist. Its poster and fallback copy must remain useful if the asset is unavailable.

### Conversion sequence
1. Hook: code-side momentum appears before funding news.
2. Mechanism: velocity, contributor breadth, and infrastructure buildout.
3. Evidence: a simple “signal → observed 21 to 47 days → press” timeline, with claim qualification.
4. Story: why The Data Nerd stopped waiting for warm intros.
5. Offer: five weekly signals in plain English, free.
6. Objections: no code required, public and auditable method, limitations on closed-source or stealth companies.
7. CTA: repeated signup form and no-card risk reversal.

## Video specification
A 75 to 90 second, 16:9 premium explainer VSL with subtitles. The video uses Hook → Story → Offer:

| Beat | Time | Message | Visual |
|---|---:|---|---|
| Cold open | 0-8s | By the time a startup round hits the feed, the edge is gone. | A deal headline flashes, then rewinds through a dark data field. |
| Pattern | 8-24s | The clues were already public in GitHub activity. | Commit velocity, contributor breadth, and infrastructure layers turn on. |
| Epiphany story | 24-42s | The Data Nerd repeatedly saw great teams a week too late, then noticed a public buildout before a round. | Abstract engineering desk, no recreated logos or unverified companies. |
| Mechanism | 42-62s | GitDealFlow reads public activity across 350+ startup orgs and turns it into a plain-English weekly read. | A ranked signal card resolves into five anonymized rows. |
| Proof and boundary | 62-76s | The research panel observed a 21 to 47 day lead time. A signal is a reason to investigate, not proof a company is raising. | Timeline and readable programmatic overlays. |
| Offer | 76-90s | Five names on Sunday. No code. No card. | The Sunday email card and CTA. |

No AI-generated readable text is required inside footage. Any titles, numbers, captions, and end card are rendered by the web page or assembled programmatically.

## Technical implementation
- Preserve existing static HTML deployment and the `js-signup-form` behavior.
- Keep existing external pages, signup endpoint, analytics events, navigation, and SEO metadata intact unless a claim requires correction.
- Add a small `landing/homepage-redesign.css` layer loaded after the existing styles so the redesign is isolated and reversible.
- Add `landing/media/README.md` to document the expected MP4, VTT, and poster filenames.
- Reuse a static SVG or CSS poster for the initial build. Do not ship a fake video URL.
- Keep page semantics, keyboard focus states, responsive behavior, and reduced-motion support.

## Verification
- Run the project claim guard before build.
- Verify no banned/stale product claims remain in the redesign layer.
- Render locally at 390px and 1440px and measure no horizontal overflow.
- Submit or inspect the existing email form wiring without submitting a real email address.
- Validate HTML references: redesign stylesheet is present, the video fallback works, and no external asset 404 is introduced.
- Deploy only after local verification. Read back the live page and video response before calling it released.
