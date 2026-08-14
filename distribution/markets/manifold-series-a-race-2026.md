# Manifold market — Series A Race 2026

**Status:** DRAFT (user posts manually under @sipiteno)

**Why Manifold and not Polymarket/Kalshi:**
- Manifold = play money (mana), no KYC, no real money. Free to post, free to bet.
- Polymarket = real-money, requires UMA bond + 24h dispute window. We hold the source-of-truth dataset → resolver conflict → not appropriate.
- Kalshi = exchange-curated. Listings are not user-proposable. Suggestion-form pitch staged separately.

---

## Post these fields verbatim into manifold.markets/create

### Question (140 char max)
```
Which of these 5 GitHub-flagged startups raises Series A first by Dec 31, 2026?
```

### Outcome type
**Multiple choice** → exclusive, one winner.

### Answers (paste each on its own line in Manifold's "Answers" field)
```
Zapply Jobs (zapplyjobs)
Kanvas (bakaphp)
AtroCore
OpenOLAT
Lonero
None of the above by Dec 31, 2026
```

### Description (Markdown, paste verbatim)
```markdown
Live implied odds and full methodology: https://signals.gitdealflow.com/markets/series-a-race-2026
Machine-readable JSON: https://signals.gitdealflow.com/api/markets/series-a-race-2026.json

**Resolves YES** on the first publicly disclosed primary Series A round (Crunchbase, PitchBook, SEC Form D, or company press release) closing on or before 2026-12-31, 23:59 UTC.

**Excluded:** bridge rounds, SAFEs, convertible notes, secondary transactions, extensions of an existing seed round (even if > $5M).

**If multiple candidates close on the same day:** the higher publicly disclosed round size wins; ties broken by earlier UTC time.

**Resolves to "None"** if none qualify by the deadline.

Candidate selection: Pre-seed and Seed stage startups with at least 30 commits in the last 14 days, ranked by composite engineering-acceleration score (40% commit velocity + 30% velocity change + 20% contributor growth + 10% new repos). Source: VC Deal Flow Signal Q2-2026 dataset of 350+ tracked startup GitHub orgs.

Not investment advice. The market creator does not hold equity, advisory, or consulting positions in any of the candidates.
```

### Close date
**2026-12-31, 23:59 UTC**

### Initial liquidity
**M$100** (default Manifold seed; user can top up to surface in featured)

### Tags
`startups`, `vc`, `funding`, `github`, `tech`, `2026`

### Visibility
**Public**

---

## Pre-flight checklist (before user posts)
- [ ] User logged into Manifold as @sipiteno (consistent with HN/Reddit/IH/PH/Quora handles)
- [ ] Confirm zapplyjobs, bakaphp, atrocore, OpenOLAT, Lonero-Team are still in the live dataset (re-run candidate query if >7 days old)
- [ ] Confirm none of the 5 has already announced a Series A in last 7d (negates whole market)
- [ ] Set close date to **2026-12-31 23:59 UTC** (not local time)
- [ ] After posting: capture market URL, paste back into pseo-site/data/markets.json `externalMirrors[platform=Manifold].url` and flip status from "draft" to "live"
- [ ] After posting: place a small M$10 bet on each candidate to seed odds (seeds visible price discovery)

## Post-publish followups
- Tweet the Manifold URL from @sipiteno → quote-tweet the gitdealflow.com/markets/series-a-race-2026 page
- Comment on the Manifold market with the methodology URL
- Update memory: `project_markets_series_a_race_2026.md` with live URL + first-7d activity
