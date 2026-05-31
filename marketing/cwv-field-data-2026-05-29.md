# CWV Field-Data Validation — 2026-05-29

**Trigger:** Follow-up to the 2026-05-29 SEO/GEO/AEO audit, which scored CWV ~82–83 from *source inference only* and flagged "DOM/parse size + no `next/image`" as the residual gap. This pass pulls **real field data** from PostHog (`$web_vitals` events, last 28 days) to replace inference with measurement — the lever the prior audits kept recommending but never executed.

## Headline: CWV is failing on desktop home, not on images or fonts

The image/font theories are **dead** (confirmed): the 6 raw `<img>` are copy-paste badge embed *strings* (not rendered elements), and the Inter font is self-hosted + same-origin preloaded with zero runtime Google Fonts fetch. The real problem is **LCP on desktop, concentrated on the home page.**

### Site-wide p75 (28d, all pages)

| Metric | p75 | Google bar | Verdict | n |
|---|---:|---|---|---:|
| **LCP** | **3154 ms** | ≤2500 good / ≤4000 ni | ⚠️ **Needs improvement** | 254 |
| INP | 70 ms | ≤200 good | ✅ Good | 78 |
| CLS | 0.00 | ≤0.10 good | ✅ Excellent | 151 |
| FCP | 1836 ms | ≤1800 good | ⚠️ Borderline (1 ms over) | 444 |
| TTFB | 483 ms | ≤800 good | ✅ Good | 60 |

**A site passes Core Web Vitals only if LCP + INP + CLS are all "good" at p75. LCP fails → the site does not currently pass CWV in the field.**

### The failure is desktop-specific

| Device | LCP p75 | n |
|---|---:|---:|
| **Desktop** | **3915 ms** | 200 |
| Mobile | 826 ms | 54 |

Counterintuitive (mobile is usually worse). Desktop being ~4.7× slower points to a **per-page LCP element that is larger on desktop** (the hero `<h1>` is `text-3xl` on mobile → `text-5xl` on `sm+`), not a network/device-class issue.

### The failure is concentrated on a few heavy pages

| Path | LCP p75 | n | Note |
|---|---:|---:|---|
| `/` | **3936 ms** | 133 | **Primary offender — reliable sample** |
| `/methodology` | 7943 ms | 14 | Worst, but low-n/noisy |
| `/book` | 3557 ms | 8 | low-n |
| `/trending` | 3709 ms | 3 | low-n |
| `/vs/specter-vs-harmonic-ai` | 652 ms | 10 | ✅ pSEO leaf — fast |
| `/weekly/top-100` | 606 ms | 4 | ✅ fast |
| `/receipts` | 252 ms | 3 | ✅ fast |
| `/pricing`, `/login`, `/developers`, `/data-sources` | <1100 ms | — | ✅ fast |

**The entire long-tail pSEO corpus has excellent LCP (250–800 ms).** Since Google assesses CWV per-URL / per-page-group, the ranking-relevant programmatic surface *passes*. The drag is isolated to the high-traffic marketing pages — bad for those pages' ranking, but the GEO/SEO long tail is unaffected.

### Not simple DOM size

- `/` = 520 KB HTML, ~1608 tags, LCP 3936 ms
- `/methodology` = 193 KB HTML, ~490 tags, LCP 7943 ms ← **fewer tags, worse LCP**
- `/weekly/top-100` = 110 KB, ~303 tags, LCP 606 ms

methodology has 3× fewer tags than home but worse LCP, so raw byte/tag count isn't the sole cause — there's a **specific large LCP element** on these pages whose final paint is delayed (leading hypothesis: the big desktop hero text re-painting on `display:swap` font swap, since the large `text-5xl` block is the largest contentful element on desktop but not on mobile).

## Corrected score

**CWV: ~76/100** (down from the inferred 82–83). The downgrade is honesty, not regression — field data shows LCP fails the "good" bar on the primary entry page. Mitigants that keep it from being lower: CLS is perfect (0), INP/TTFB are comfortably good, and the bulk of the URL surface (pSEO) is fast.

## What was shipped this pass

- **PR #254** — removed the dead `fonts.gstatic.com` preconnect (next/font self-hosts; verified zero runtime gstatic fetch). Zero-risk render-path cleanup. *Does not fix LCP* — it removes an unused-preconnect diagnostic.

## Recommended next step (NOT done — needs a real trace, not a guess)

The home page is conversion-critical and 1270+ lines; blindly refactoring it on the swap-repaint hypothesis is the wrong move. The correct sequence:

1. **Run one Lighthouse/WebPageTest trace on `/` at desktop preset** to confirm the actual LCP element and whether the timestamp lands on the font swap. Cheap, decisive.
2. If the LCP element is the hero `<h1>` and LCP == swap moment: test `next/font` `display: "optional"` (eliminates the swap repaint + any CLS risk; tradeoff is fallback font on slow first loads) — this is a typography/design decision, so flag it for the owner rather than changing unilaterally.
3. If LCP is gated by critical-path bytes: trim the home above-the-fold (defer below-fold sections / move the 9 inline JSON-LD blocks below the LCP content) and re-measure.
4. Re-pull this query weekly (`$web_vitals` p75 by device + path) to confirm the swing — the data pipeline already exists (`WebVitalsReporter` → PostHog).

*Query: PostHog HogQL over `$web_vitals`, 28-day window, `email-api/.env` creds. Reproducible.*
