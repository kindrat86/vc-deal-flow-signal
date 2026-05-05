# Social drafts — Series A Race 2026 launch

User posts manually per [no-LinkedIn-actions](feedback_no_linkedin_actions.md) + [Reddit/HN manual posting](feedback_hn_manual_posting.md). Do NOT auto-post.

---

## Twitter / X (composer-method: ONE insertText on fresh editor; no clear-and-reinsert)

### Anchor post (own profile, @data_nerd)
```
We just opened a public prediction market on which 5 GitHub-flagged startups raises a Series A first by EOY 2026.

Implied odds are derived from commit velocity, contributor growth, and signal type. No real money, no positions, public methodology.

https://signals.gitdealflow.com/markets/series-a-race-2026
```
(280 chars — fits standard cap. NOT premium.)

### Reply 1 (self-reply with the leaderboard)
```
Top 5 right now:

#1 Zapply Jobs — 46% (1,694 commits/14d, +400% contrib growth)
#2 Kanvas — 22% (598 commits, framework migration)
#3 AtroCore — 16% (PIM/MDM, 18 contributors)
#4 OpenOLAT — 10%
#5 Lonero — 6%

Resolves Dec 31, 2026 on first publicly disclosed Series A.
```

### Reply 2 (the angle that gets reshares)
```
Polymarket and Kalshi don't list seed-stage startup markets. Too granular for real-money exchanges.

Manifold mirror is staged but the canonical artifact lives on the methodology page itself. Free to read, machine-readable JSON, CC BY 4.0.

https://signals.gitdealflow.com/api/markets/series-a-race-2026.json
```

---

## Reddit

### r/venturecapital (per memory: comments-only — automod kills product posts)
**Don't post the market as a thread.** Wait for an organic thread on "predicting Series A" or "github signals" or "alt data" and drop a top-comment with:

```
We actually published this as a public market last week — 5 candidates, live implied odds, public methodology, public resolver. Source-of-truth dataset is CC BY 4.0.

signals.gitdealflow.com/markets/series-a-race-2026

The five candidates collectively have 65 contributors + 2,500 commits over the last 14 days. None have closed a Series A. Model says one will by year's end. Resolves on Crunchbase/PitchBook/SEC Form D.

Not affiliated with any of the candidates. Not investment advice.
```

### r/startups, r/EntrepreneurRideAlong (no-link sub — name-only)
Per memory: r/EntrepreneurRideAlong silently drops link posts. Use name-only mentions if commenting:
> "There's a public prediction market tracking which of 5 high-signal early-stage GitHub orgs raises Series A first by EOY 2026 — search 'VC Deal Flow Signal markets' if you want the methodology."

### r/MachineLearning, r/datascience (the methodology angle)
```
Built a prediction market on top of an alt-data dataset (GitHub commit velocity).

Composite score = 0.40 × normalized commit velocity + 0.30 × velocity change + 0.20 × contributor growth + 0.10 × new repos. Softmax-normalized to implied probabilities across 5 candidates.

Question: which of 5 high-signal Pre-seed/Seed startups raises a Series A first by EOY 2026?

Resolver: Crunchbase / PitchBook / SEC Form D. Public, version-locked, no real money.

Curious how others would weight the score components. The 14-day window is short — we get whiplash on velocity-change weight when a startup ships a big PR.

[link to methodology page]
```

---

## Hacker News (per memory: never LLM-polished — user rewrites before pasting)

### Show HN draft (rough — user smooths)
```
Title: Show HN: Open prediction market on which 5 GitHub-flagged startups raises Series A first
URL: https://signals.gitdealflow.com/markets/series-a-race-2026

Body: We pull commit velocity, contributor growth, and signal type from public GitHub for ~4,200 venture-backed startups. The Pre-seed/Seed cohort with positive signal becomes a candidate set. Top 5 go in a public market.

Resolves Dec 31, 2026 on first publicly disclosed primary Series A round (Crunchbase, PitchBook, SEC Form D, or company press release). Bridge rounds and SAFEs don't count.

Implied odds are softmax of a composite score (40% normalized commit velocity + 30% velocity change + 20% contributor growth + 10% new repos). The composite weights came from looking at our historical receipts dataset of validated unicorns.

Manifold mirror is staged (play money). We don't propose Polymarket/Kalshi listings on questions where we own the source-of-truth dataset — that's a resolver conflict.

Methodology + JSON: https://signals.gitdealflow.com/markets/methodology
```

---

## IndieHackers (Ember SPA — paste manually via daily trigger)
```
Title: We turned our alt-data dataset into a public prediction market

Body: A public market on which of 5 high-signal early-stage startups raises Series A first by EOY 2026. Implied odds from GitHub commit velocity. No real money — we don't operate an exchange. Public methodology, public resolver.

Curious if any IH folks have done seeded markets on top of their proprietary datasets. The angle that surprised me: Polymarket and Kalshi don't list seed-stage markets at all. Too niche for real-money exchanges. But the *artifact itself* (the question + odds + methodology) generates press hooks even without a betting venue.

Link: signals.gitdealflow.com/markets/series-a-race-2026
```

---

## Email pitch (cold outreach via signal@gitdealflow.com — Zoho)

### Subject lines (A/B)
- A: "5 startups, 1 race, public methodology — Series A by EOY 2026"
- B: "We made a Polymarket-style market on which startup raises next"

### Body
```
Hi [name],

Quick one — we just opened a public prediction market on which 5 GitHub-flagged early-stage startups raises a Series A first by Dec 31, 2026.

The novel piece: implied odds are derived from public GitHub data (commit velocity, contributor growth, signal type), the methodology is public, the resolver is public, and the candidate set is locked at market open. No real money — we don't operate an exchange. Polymarket/Kalshi don't list seed-stage markets, so the artifact lives on the methodology page itself.

The 5 candidates currently sit at:
46% Zapply Jobs / 22% Kanvas / 16% AtroCore / 10% OpenOLAT / 6% Lonero

Page: https://signals.gitdealflow.com/markets/series-a-race-2026
Press kit: signal@gitdealflow.com (reply for fact-sheet + founder bio)
JSON: signals.gitdealflow.com/api/markets/series-a-race-2026.json

If it's interesting for [publication], happy to share the underlying dataset and the composite-score derivation.

— The Data Nerd
VC Deal Flow Signal (GitDealFlow)
SSRN: https://ssrn.com/abstract=6606558
```

**Targets (per memory: cold outreach OK on Zoho since Mailreach 98/100):**
- Sifted (London) — alt-data angle
- The Information's Pro tier — startup tracking
- Newcomer (Eric Newcomer) — seed-stage funding angle
- Strictly VC (Connie Loizos) — already on outreach list per i18n round 2 memory
- Term Sheet (Fortune)
- Pitchbook News
- Eric Friedman's "It's Pronounced Metrosexual" newsletter
- Packy McCormick's Not Boring (long shot)

Pacing: ≤2 sends/day per Mailreach gate.
