# Platform-Native Hooks — Daily Briefing Template (2026-05-09)

> **Why this exists.** The 2026-05-09 trilogy audit (V8) flagged Traffic
> Secrets §1 Ch 3 at 92/100 — the same opener was being reused across
> Twitter, Reddit, HN, dev.to, Hashnode, Discord, LinkedIn, Email,
> AngelList, Product Hunt, Indie Hackers, Telegram. This briefing template
> resolves that gap: one universal product story, twelve platform-native
> openers. Single source of truth: `pseo-site/content/platform-hooks.ts`
> (also surfaced at `/distribution/platform-hooks` and as JSON at
> `/api/v1/platform-hooks.json`). When you ship a daily briefing, copy
> this template, swap the universal story (if it changed), keep the
> per-platform variants tuned.
>
> **Brunson note (internal-only).** This briefing maps cleanly to TS §1
> Ch 3 — the universal Hook/Story/Offer triad with platform-specific
> resolutions. NEVER ship the framework names to customer copy. The
> public-side language stays neutral ("opener / narrative / offer").

---

## The universal story (this week)

- **Opener.** Warm-intro deal flow is slow. GitHub commit data is fast.
- **Narrative.** Public commit-velocity acceleration crosses a falsifiable threshold 21–47 days before a Series A round closes. We track 4,200+ orgs, methodology peer-indexed (SSRN 6606558), n=219 paired observations, 68% hit rate at 33-day median lead.
- **Offer.** Free Acceleration Watch — five names every Monday. Or jump the queue with a €7 First Look Pass on a sector you pick.

---

## Posting map — which platform, when, what

> Status legend: ✅ posted · 🟡 drafted · ⏸ blocked · ❌ aborted

### 1. Twitter / X — `@data_nerd` 🟡

- **Window.** Tue 13:00–16:00 UTC.
- **Opener pattern.** One-line counter-intuitive observation, no preamble.
- **Constraint.** ≤169 raw / ≤162 weighted chars (durable rule from `feedback_tweet_style_short_branded.md`).

```
GitHub is now a deal-flow surface.

Hover any repo → commit velocity, contributor growth, signal type. Free Chrome extension, no account.

https://gitdealflow.com/chrome
```

- **Rule.** Never thread without a payoff hook in tweet 1. Never link to /pricing — link to /watch or /firstlook.
- **CTA target.** `gitdealflow.com/chrome` (not /pricing).

### 2. Reddit — `u/gitdealflow` 🟡

- **Window.** Tue / Wed 13:00–15:00 UTC. Tag-match the subreddit (r/startups vs r/AngelInvesting).
- **Opener pattern.** Vulnerable-builder frame.

```
Title: I spent six months reading commit logs of 4,200 startups. Here's what I learned.

Body:
After my last side project flatlined I started obsessing over a question:
which startups are accelerating *right now*, before the press release?

So I built a panel of 4,200 GitHub orgs and tracked commit-velocity
deltas weekly. n=219 fundraise events, 68% hit rate at 33-day median
lead time. Methodology paper here: ssrn.com/abstract=6606558

Not selling anything in this thread — would love feedback on the
false-positive analysis (22% rate, controls in §4 of the paper).

If you want to replicate, the dataset is CC BY 4.0 on Zenodo.
```

- **Rule.** Never lead with the product. Never paste the same body across subs — auto-mod cross-flag triggers shadowban.
- **Status.** Manual user-post only (per division-of-labor rule).

### 3. Hacker News — `thedatanerd` ⏸

- **Window.** Tue / Wed 09:00–11:00 UTC for Show HN. Sunday 14:00 UTC second-best.
- **Status.** Account currently flagged (per `feedback_chrome_mcp_extension_not_connected_2026_05_04.md` lineage). Hold until age + karma rebuild.
- **Title (when ready).**

```
Show HN: Predicting Series A rounds with GitHub commit velocity (n=219, 68% hit rate)
```

- **First-author-comment.**

```
Author here. The methodology lives at signals.gitdealflow.com/methodology
— but the falsifiability statement is the important bit:

* False-positive rate: 22% (controls in §4 of the SSRN paper).
* Lead-time IQR: 21–47 days, median 33.
* The signal that fails: small-team velocity bursts driven by a single
  contributor's branch — we filter these via the contributor-growth
  primitive but it's the largest false-positive source.

Dataset is CC BY 4.0 on Zenodo. Critique welcome.
```

- **Rule.** Never use marketing language. Concede + ship the fix on nitpicks; never argue.

### 4. dev.to — `@gitdealflow` 🟡

- **Window.** Bi-weekly Tue 09:00 UTC.
- **Opener pattern.** Tutorial framing.

```
Title: How I compute Series A predictions in twelve lines of Python

Lead:
Most VC software costs $1k+/seat. The signal that drives 68% of my
predictions runs in twelve lines of Python against the public GitHub API.
This post walks the code, the dataset, and the false-positive analysis.
```

- **Length target.** 1,200–2,000 words. Code blocks every 200 words.
- **Rule.** Tutorial-first, brand-second. Never gate behind email.

### 5. Hashnode — `@gitdealflow` 🟡

- **Window.** Bi-weekly Wed 10:00 UTC. Pair-publish with dev.to via canonical-tag.
- **Opener pattern.** Deep technical essay.

```
Title: Building a GitHub commit-velocity index: dataset, method, and the regression that ties them together
```

- **Length target.** 1,500–3,000 words. Tables + charts + code.
- **Rule.** Code-blocks > prose. Never repeat the dev.to essay verbatim — Hashnode crowd notices the cross-post.

### 6. Discord — `gitdealflow` (MCP / Cursor / Anthropic ecosystems) 🟡

- **Window.** When relevant to live conversation.
- **Opener pattern.** Quiet drop, peer-to-peer.

```
Built an MCP server that surfaces GitHub commit-velocity for any org or repo. Six tools, free forever. Drop a 👀 if useful, link in next msg.
```

- **Two-message drop.** Message 1 above; message 2 with the link only after a 👀 reaction lands.
- **Rule.** Read pinned messages before posting. Never spam DMs. Never link in first message in a strict channel.

### 7. LinkedIn — `GitDealFlow Company` 🟡

- **Window.** Tue / Wed / Thu 08:00–10:00 UTC.
- **Opener pattern.** Industry-trend in line 1, your data in line 2, contrarian payoff in line 3 (above 'see more' fold).

```
85% of seed deals still source through warm intros.
We found a public-data signal that arrives 21–47 days earlier.
Methodology, not magic — n=219, 68% hit rate.

[…rest of post under 'see more' fold…]

Question for fund GPs: do you incorporate engineering-side signals
in pre-seed diligence? Comment "methodology" and I'll DM the SSRN
paper.
```

- **Rule.** Never link in body. Comment-link mechanic only. Never copy-paste from Twitter — LinkedIn audience reads slowly.

### 8. Email — `signal@gitdealflow.com` (cold outreach) 🟡

- **Window.** Tue–Thu 09:00–11:00 partner-local.
- **Cap.** ≤2 sends/day per Mailreach warm-up rule (98/100 score as of 2026-05-02).
- **Opener pattern.** Specific reference to their portfolio + your data point in line 1.

```
Subject: 33 days early on [Company]'s Series A

Saw [Fund] led [Company]'s Series A — our signal flagged the run-up
33 days before the announcement.

We track 4,200 orgs by GitHub commit-velocity acceleration. n=219,
68% hit rate, lead-time 21–47 days IQR.

15 minutes next Wednesday to walk through three names that just
crossed the threshold for [their thesis]?

— [signature with SSRN DOI]
```

- **Rule.** Never start with "Hope this finds you well." Never CC. Never attach.

### 9. AngelList — `gitdealflow` 🟡

- **Window.** Wed 14:00 UTC (peak syndicate-activity window).
- **Opener pattern.** Peer-level question framing.

```
Question for syndicate leads: do you incorporate engineering-acceleration signals in pre-seed diligence?
```

- **Rule.** Never spam syndicate feed with product. DM-side only when someone replies. Treat as peer-to-peer Discord.

### 10. Product Hunt — `gitdealflow` ⏸

- **Window.** Tuesday 00:01 PT launch-day.
- **Status.** Already launched once; second launch deferred until measurable v2.0 ship.
- **First-comment template (for next launch).**

```
Launched today after six months heads-down. The thing I wish existed
in my angel days — I read commit logs for fun, and there was no tool
that let me trade on what I saw.

Built solo. Public dataset. SSRN-indexed methodology. €0 to start,
€7 if you want a sector deep-dive.

Reply to every comment in the next hour — ask me anything.
```

- **Rule.** Reply to every comment within 60 minutes on launch day or fall off the leaderboard.

### 11. Indie Hackers — `@gitdealflow` 🟡

- **Window.** Mon / Wed 12:00 UTC.
- **Opener pattern.** Lead with a number.

```
Title: We hit €1,000 MRR by selling commit-graph data to angels. Here's the breakdown.

Body:
Six months in, mix is:
- 47 paid: €9.97/mo Dashboard (45) + €97/mo Insider (2)
- €1,021 MRR
- Funnel: free Acceleration Watch (1,400 subs) → €7 First Look Pass
  → Dashboard

What worked: methodology-first content (SSRN preprint moved more
free→paid than any landing-page copy). What didn't: Reddit ads (CPC
acceptable, conversion 0.3%, killed after €120 spend).
```

- **Rule.** Never round to make figures prettier. IH crowd notices.

### 12. Telegram — `t.me/gitdealflow` (owned channel) 🟡

- **Window.** Sunday 18:00 UTC pre-Monday signal drop.
- **Opener pattern.** Insider drop, no-frills.

```
Sector Sweep update: 5 names crossed signal threshold this week.

Three are in AI-devtools, two in verifiable compute. Names + 14-day
charts inside the dashboard for Insider members; the public version
posts Monday 09:00 UTC with the top 5.

/firstlook for the full sector-sweep deep dive.
```

- **Rule.** Telegram subscribers expect 2-day lead-time vs Twitter. Never gate names — subscribers earned the access.

---

## Cross-platform anti-patterns (do not do)

1. **Copy-paste a Twitter post into LinkedIn.** LinkedIn audience reads slowly; brevity reads as low-effort.
2. **Lead Reddit / HN with the product.** Auto-mod or community downvote.
3. **Repeat the dev.to essay on Hashnode verbatim.** Cross-post detection.
4. **Link in body on LinkedIn.** Algorithm penalty (-40% reach).
5. **Skip the falsifiability statement on HN.** Engineering crowd reads it as marketing without it.
6. **Cold-DM on Discord or AngelList.** Permanent ban risk.
7. **Spam comment-links on Reddit.** Profile shadowban after 3.
8. **Round MRR figures on IH.** Replication-minded audience notices and disengages.
9. **Use the same opening sentence twice in one week across platforms.** Even if the bodies differ — google indexes the openers and Yandex flags as duplicate-intent.
10. **Beg for upvotes off-platform on Product Hunt launch day.** Disqualification risk.

---

## Source of truth

- **Code:** `pseo-site/content/platform-hooks.ts`
- **HTML:** `https://signals.gitdealflow.com/distribution/platform-hooks`
- **JSON (agents):** `https://signals.gitdealflow.com/api/v1/platform-hooks.json`
- **No-extension alias:** `https://signals.gitdealflow.com/api/v1/platform-hooks`

When the universal story changes (new dataset, new lead-time IQR, new
hit rate), update `UNIVERSAL_STORY` in `content/platform-hooks.ts` and
re-derive each variant. Do not edit per-platform copy in isolation —
the cross-platform consistency check breaks.
