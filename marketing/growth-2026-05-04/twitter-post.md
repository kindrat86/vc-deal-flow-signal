# Twitter Post — 2026-05-04

**Account**: @data_nerd  
**Tier**: Free (NOT Premium, 280-char cap per memory `reference_twitter.md`)  
**Compose method**: ONE `insertText` call on a fresh editor per memory `feedback_twitter_compose_method.md` — NEVER clear-and-reinsert in same session  
**Today's hook**: Fresh data anchor (219-round panel) + new Substack publication, Mon May 4 morning EEST is ideal posting window

---

## Single tweet (240 chars — fits cap with room for reply)

47 days.

That's the median lead time GitHub engineering acceleration has over the corresponding fundraise announcement, across 219 confirmed rounds in our public panel.

Open dataset (CC BY 4.0): https://zenodo.org/records/19650920
Paper: https://ssrn.com/abstract=6606558

---

## Char count

```
47 days.

That's the median lead time GitHub engineering acceleration has over the corresponding fundraise announcement, across 219 confirmed rounds in our public panel.

Open dataset (CC BY 4.0): https://zenodo.org/records/19650920
Paper: https://ssrn.com/abstract=6606558
```

= 277 characters before t.co URL shortening (Twitter compresses URLs to 23 chars each, so net ~243 visible). Within 280 cap on free tier.

---

## Optional reply tweet (post immediately after, in a thread)

The methodology decomposes to three components: commit velocity, contributor delta, and repo-expansion fingerprint. Contributor delta carries the most weight — 78% of rounds in the panel showed a +30% contributor jump in the 60 days before announcement.

(Char count: 269 — fits cap)

---

## Posting checklist

- [ ] Fresh Twitter compose editor (do NOT use a draft from earlier in the session)
- [ ] ONE `insertText` call with the full tweet body
- [ ] Verify both URLs render as t.co cards before posting
- [ ] Optional: post the methodology reply as a quote-tweet of the first, 30-60 seconds later (avoids the "self-comment looks coordinated" pattern)
- [ ] Capture status URL (https://x.com/data_nerd/status/...) into `monitoring/build-dashboard.py` CHANNELS.twitter and matching `dashboard.html` JSON, per memory `feedback_stats_update_dashboard.md`
- [ ] If engagement crosses 10 likes in 2 hours: pin to profile (replaces current pinned tweet only if user OKs it)

---

## Why this hook over alternatives

- **"47 days" lead** is the single most quotable number in the SSRN paper. Easier to share than a methodology summary.
- **Zenodo + SSRN URLs** trigger the academic-content recognition heuristic on Twitter that gets the post boosted into ML/researcher feeds.
- **No product URL** in the body. The dataset/paper are the primary CTA. Product discovery is downstream of academic credibility per memory `feedback_ssrn_credibility_anchor.md`.
- **No em-dash** — preserves Brunson rhythm; statements not questions.
