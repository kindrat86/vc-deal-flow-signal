# Variant 9 — Quora Answer

**Target question:** "How do angel investors find early-stage startups before they raise a round?" OR "What are the early signals that an open-source startup is about to raise funding?"

**Credential string (per user SOP):** Founder, GitDealFlow — tracking GitHub signals for VCs

---

**Answer:**

One of the cleanest early indicators I have found: GitHub commit velocity, specifically the "framework migration" pattern at Growth stage.

A concrete example from this week. Akto — the open-source API security testing platform, Y Combinator W22 — just registered a +75% commit velocity change. That is 267 commits from 53 contributors over 14 days, well above their baseline.

The signal type matters. Framework migration means the team is overhauling core internals rather than just shipping features. Growth-stage teams almost never refactor the core casually. That pattern in our dataset typically precedes one of three things over the next 3 to 6 weeks: a new product surface launching, an enterprise tier shipping, or a fundraising round closing.

This is not cherry-picked. Across 4,200+ startup GitHub orgs tracked over six months, framework migration spikes at Growth stage have been one of the more consistent leading indicators of upcoming announcements in the dataset.

The market context makes Akto independently interesting. Salt Security raised more than $300M and has been working through layoffs and exec turnover. Noname Security was acquired by Akamai for around $500M. Wallarm is enterprise-only. The developer-first, open-source slot in API security is open, and Akto is the obvious team positioned to take it.

By the time this surfaces in Crunchbase or TechCrunch, the next round will already be priced.

If you want to track this kind of signal systematically, I built [GitDealFlow](https://signals.gitdealflow.com/predict) to surface exactly these patterns — engineering acceleration data that shows up weeks before the press coverage does.
