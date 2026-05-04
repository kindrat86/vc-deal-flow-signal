# Launch-Day Reply Pack — Sunday Apr 26, 2026

**Purpose:** Pre-canned, copy-paste responses to the most likely PH/Twitter/IH comment categories on launch day. Saves you reaction time tomorrow when 30+ comments may land in a 4-hour window.

**How to use:** Find the closest scenario below, copy the reply, **trim/personalize 1-2 phrases** (don't paste verbatim — PH/HN moderators flag identical text patterns). Most replies are 60-100 words; resize to fit the comment context.

**Voice rules:** operator tone, specific numbers, acknowledge limits honestly. Never "Great question!", never "Thanks for the support!", never em-dashes.

---

## Differentiation questions

### Q: "How is this different from Harmonic / Dealroom / PitchBook / Crunchbase?"
```
Three differences. We use only public GitHub data, no proprietary feeds. Self-serve, no demo call required. Priced at €9.97/mo for individuals, not $10K/yr for funds. The actual signal is the same family — engineering acceleration as a leading indicator — but the accessibility is the wedge. Harmonic's strength is people-graph; ours is code-graph. Different lenses on the same companies.
```

### Q: "Why not just use Forager / Specter / 4Degrees?"
```
Those tools search people networks (LinkedIn change events, founder histories). We search code activity (commits, contributors, repo expansion). Different upstream signals. Forager will tell you when a senior engineer joins a startup. We'll tell you when their commit velocity doubles. Both are useful. We're not trying to replace people-graph tools, we're adding a layer most existing platforms don't track.
```

### Q: "What about [other GitHub-tracking tool, e.g. GitGuardian / Sourcegraph / OpenSauced]?"
```
Those tools mostly serve engineering teams as their primary audience (security, code search, dev metrics). We serve investors as our primary audience. Same raw data, different aggregation and ranking layer. The "investor-narrative scoring" we run weights signals like framework migrations and contributor surges, which engineering tools don't surface because they're not interesting to a CTO.
```

---

## Gameability questions

### Q: "Doesn't commit count just get gamed?"
```
Total commit count yes, baseline-relative change much less. We measure each org against its own 90-day baseline, not a global average. Contributor growth is the harder one to fake — adding seats costs real money and shows up in the GitHub member API. The dominant gamed-commit pattern (auto-commits via bots) shows up as low contributor count + high frequency, which the scoring penalizes.
```

### Q: "What about projects that just bot-commit a lot?"
```
Bot-only repos look distinctive in our data — high commit frequency from a single contributor account, no PR review activity, no issue churn. We filter those out at the ranking step. The signal we surface requires multiple human contributors plus framework-level work, which is hard to fake without actual engineering payroll.
```

### Q: "Stars are vanity, why should commits be different?"
```
Agree on stars being vanity since you can buy them for $20 on Fiverr. Commits are different because they require an authored email, time-stamped, and (for non-trivial work) a real diff that gets reviewed. The signal is not raw count but rate of change against the team's own baseline, which is much harder to gamify than a follower count.
```

---

## Data / methodology questions

### Q: "What's your sample size?"
```
~4,200 GitHub orgs across 19 sectors right now, expanding to 8,000 by end of summer. The ranking algorithm runs daily over the public GitHub API. Methodology paper is at signals.gitdealflow.com/methodology. SSRN preprint with the 47-day window analysis is at ssrn.com/abstract=6606558 if you want the academic version.
```

### Q: "How do you validate the signal is actually predictive?"
```
Honest answer: imperfectly. We can show ex-post that a sustained 75%+ velocity change preceded the median tracked fundraise by 28-47 days. We can't yet show forward-looking precision/recall because the dataset is still maturing. The methodology paper walks through the cohort analysis. We're transparent about the uncertainty and we publish the raw ranking dataset so anyone can audit it.
```

### Q: "What's the false positive rate?"
```
Roughly 35-40% of accelerating signals don't end up correlating with a fundraise within 6 months. Common false positives: open-source project just hired a maintainer (real growth, no fundraise event), or a startup that already raised before our tracking started. We surface those as "high-velocity, no event" rather than hiding them.
```

### Q: "Why GitHub specifically and not GitLab / Bitbucket?"
```
GitHub has roughly 80% of private startup engineering activity by our estimate. GitLab is strong in enterprise self-hosted, which we can't see. Bitbucket is mostly Atlassian-ecosystem and doesn't expose the same public signal volume. We focus where the data density is highest. Adding GitLab cloud is on the roadmap but isn't priority while GitHub coverage is still expanding.
```

---

## Pricing / access questions

### Q: "What's free vs paid?"
```
Free: weekly Signal Digest email (5 breakout startups, real numbers), 3 scout predictions per month, full MCP server access (5 tools, never gated), Chrome extension. Paid Dashboard at €9.97/mo: 60+ accelerating startups, sector/stage/geography filters, 10 predictions/month, Sharp/Elite scout ranks. Paid Insider Circle at €97/mo: private community + API access. PH50OFF gets you 50% off three months on the paid tiers.
```

### Q: "Is there a trial?"
```
The free Signal Digest is the trial — five real startups in your inbox every Monday. If five doesn't tell you whether the signal is useful, sixty more on the paid tier won't change that. PH50OFF brings the paid Dashboard to about €5/mo for the first three months if you want to dig deeper.
```

### Q: "Can I get a custom enterprise plan?"
```
Yes for the API access tier. Reach out at signal@gitdealflow.com with your use case (number of seats, integration target, custom sectors). Most fund-level use cases land between the €97/mo Insider Circle and a custom API agreement around $500-2K/mo depending on volume.
```

---

## MCP / integration questions

### Q: "How does the MCP server work?"
```
One-line install: npx @gitdealflow/mcp-signal. Works in Claude Desktop, Claude Code, Cursor, Zed, or any MCP-compatible client. Five tools: get_methodology, get_signals_summary, get_startup_signal, get_trending_startups, search_startups_by_sector. No API key needed for the free tier. Just ask Claude "show me trending fintech startups" and it pulls live data without leaving your AI assistant.
```

### Q: "Does the MCP work in [tool X]?"
```
Anything that speaks the MCP protocol. Officially tested in Claude Desktop, Claude Code, Cursor, Zed. Should work in Continue, Aider, custom MCP clients with no modification. If you hit a compatibility issue, open an issue on github.com/gitdealflow/mcp-signal and we'll look.
```

### Q: "Why MCP and not a REST API?"
```
Because our buyer is increasingly an investor working inside an AI assistant, not someone writing curl scripts. The REST API exists too (paid tier), but the MCP version is where we see the actual product-market fit moment: VCs asking Claude "which fintech startups are accelerating?" instead of opening another dashboard tab.
```

---

## Geographic / scope questions

### Q: "Does this work for European / Asian / non-US startups?"
```
Yes. Our tracking set is global, weighted by sector activity rather than HQ location. About 60% of orgs are US, 25% Europe, 15% rest of world. The signal works best where engineering is GitHub-public, which skews toward open-source-friendly cultures. Non-OSS startups in markets that prefer GitLab self-hosted are harder for us to read.
```

### Q: "Is this only public companies / OSS projects?"
```
We only see public GitHub activity, but that includes most early-stage startups. Even closed-source companies usually have a public org with at least their docs site, internal tooling, or a single repo. The signal degrades for companies that keep everything in private repos and never open-source anything, which is rare for engineering-heavy startups.
```

---

## Skeptical / contrarian replies

### Q: "Velocity != quality"
```
Correct, and we don't claim it does. Velocity correlates with engineering investment, which correlates with hiring, which correlates with fundraising readiness. None of those imply the product is good. The signal is upstream of product quality. It tells you the company is moving, not that they're moving toward something useful.
```

### Q: "Most VCs don't care about engineering metrics"
```
Most don't, which is why this is interesting for the ones who do. Solo angels and technical seed investors are our main audience, not Tier-1 funds with established sourcing. The Tier-1 funds have warmer networks and don't need alt-data. Solo investors don't have those networks, which is the gap we fill.
```

### Q: "This is just stalking developers"
```
We track public GitHub orgs, not individual contributors. Same data anyone can see by visiting github.com. We don't expose individual emails, identities, or employment graphs. The aggregation is at the org level — "this company's engineering accelerated" — not "this specific person is committing more." If a contributor wants to be invisible, GitHub already lets them set their email private; we respect that.
```

---

## Supportive / positive replies (warm response, not gushing)

### When someone says "Excited to try / Just signed up / Looks great"
```
Appreciate it. Email signal@gitdealflow.com if you have a specific sector you'd want us to deepen — sectors are weighted by signal volume right now and we'll tilt the next data refresh based on what subscribers actually use.
```

### When someone is a fellow MCP-ecosystem builder
```
Thanks. The MCP install path is npx @gitdealflow/mcp-signal — would be curious whether the tool descriptions read clearly to your AI assistant. Glama gave us a 4.8/5.0 on Tool Definition Quality but external feedback is more useful than the score.
```

### When someone says "Following / Saved for later"
```
The Signal Digest goes out Mondays. If "later" means tomorrow, that's your first one. If you find it useful, the Insider Circle is where the heavier analysis lives. If you don't find it useful, the unsubscribe link is right at the top.
```

---

## Procedural / launch-specific

### Q: "Why launch on a Sunday?"
```
PH Sunday traffic is lower volume but higher attention-per-visitor in our test. Most launches stack Tuesday-Thursday so Sunday faces less competition for the front-page slots. Your mileage may vary as a strategy. We'll know after today whether it was a good call.
```

### Q: "Where can I see the leaderboard / rankings?"
```
signals.gitdealflow.com is the main dashboard. Sector rankings: signals.gitdealflow.com/startups-to-watch. Scout leaderboard (the prediction game): signals.gitdealflow.com/leaderboard. Methodology for how the rankings get computed: signals.gitdealflow.com/methodology.
```

---

## Tough question handling (hostile/pointed)

### Q: "How is this not just a wrapper around the GitHub API?"
```
Fair framing. The wrapper is the cheap part. The expensive part is the ranking algorithm — investor-narrative scoring with sector weighting, velocity capping to filter outliers, contributor log bonus, signal-type classification. Github API gives you the raw events. We turn those events into ranked startup lists with provenance every signal can be backed up by a query. The wrapper is shippable in a weekend; the scoring took us four months of iteration.
```

### Q: "What's stopping someone from cloning this?"
```
Nothing. The methodology is published, the SSRN paper has the math, the dataset is downloadable as CSV. The moat is the maintained tracking set (which orgs to watch) plus the scoring tuning, both of which compound with use. We made the methodology open because the alternative (proprietary black box) is what every existing platform does and it's part of why none of them are trusted by individual investors.
```

### Q: "Why should I trust your numbers?"
```
You shouldn't, just because we said so. The methodology page walks through every step. The CSV with the underlying raw data per startup is downloadable. The SSRN paper has the longitudinal validation. If any number we publish doesn't reproduce from the public GitHub API plus our scoring rules, we want to hear about it. That's the verification path we built into the product.
```

---

## Maker thread first comment (already locked in PH but include here for reference)

The PH listing has the maker first comment auto-pinned (per `project_ph_listing_staged.md`). It will auto-post when the launch goes live at 10:01 EEST. No action needed on this — it's the 2500-char long-form already persisted.

---

## How to triage tomorrow

When a comment lands, ask yourself in this order:
1. **Is this a question I can answer in <30 seconds with a copy-paste from above?** Use the template, edit 1-2 phrases.
2. **Is this hostile/skeptical?** Pull from "tough question handling" — engage seriously, don't dismiss.
3. **Is this supportive?** Use a warm-response template, ALWAYS ask one specific follow-up question (keeps the thread alive).
4. **Is this asking for something only the user can answer (e.g. specific use case help)?** Reply briefly that you'll DM them, then handle async.

**Time budget:** aim for ~3 min per reply. 30 comments × 3 min = 90 min total. With templates, you should land closer to 60 min.

**What NOT to do:**
- Don't reply to every comment (some don't need it; PH algo doesn't reward 1:1 reply rate)
- Don't engage trolls past 1 reply (PH penalizes long argumentative threads)
- Don't paste full templates verbatim across 5 different comments (pattern detection)
- Don't link to gitdealflow.com in every reply (PH penalizes self-promo)

**What TO do:**
- Reply to the first 3-5 supportive comments warmly (sets the tone for the thread)
- Reply to every skeptical comment with the substantive template (signals you take the criticism seriously)
- Ignore obvious trolls or 0-karma drive-bys
- Add a personal flourish to 1-2 replies per hour (variety in voice)

---

## Maker self-reply milestones (drop into the maker-comment thread every 2-3h)

**Why these work:** PH algorithm weights recent comment activity in the thread. A maker self-reply with a milestone update keeps the thread visually active and gives any returning visitor a reason to glance again. Strictly factual, never a vote-plea.

**Cadence:** target every 2-3 hours from T+4h until T+12h (≈ 14:00 → 23:00 EEST). Skip if no actual new milestone — silence beats filler.

**Universal rules:**
- Lead with a number (rank, votes, comments, PostHog visitors)
- One concrete observation about WHO is showing up (geography, occupation, install pattern)
- One forward statement (what we're shipping next, what we're learning)
- NEVER "please vote" or "we're so close to #N"
- ≤80 words

### Template A — Early-day momentum (T+4h to T+6h)

```
Update from inside the launch. We're at [N] upvotes and [M] thoughtful questions in the thread. About a third of the questions are about gaming the signal — which is exactly the conversation we wanted. Live in the dashboard right now: [recent shipped feature, e.g. "the agent-callable A2A endpoint for `is GitDealFlow live on PH right now?` queries"]. If you have a methodology question we haven't covered, drop it below — answering everything before midnight Pacific.
```

### Template B — Mid-day check-in (T+7h to T+9h)

```
Six hours in. [N] upvotes, [M] comments, [K] new MCP installs from npm. The angle that landed unexpectedly: [one specific theme from the thread, e.g. "false-positive transparency — turns out 'we admit 35% FP rate' converts skeptics faster than any benchmark we ran"]. Working through the unanswered questions in order. Couple more milestone updates coming before US east-coast wakes up tomorrow morning.
```

### Template C — Evening update (T+10h to T+12h)

```
End-of-EU-day update. [N] upvotes, currently #[rank] in [Dev Tools / AI / Productivity]. Most surprising data point: [one PostHog observation, e.g. "47% of /receipts visitors share their score within 2 minutes — way above what we predicted"]. Thanks to everyone who shipped questions today. Will be back at this thread when US-west wakes up. The MCP demo at gitdealflow.com/integrations/claude is the highest-converting page so far if you want to see the agent flow.
```

### Template D — Comment-density spike (use ONLY if comments outpace votes)

```
Quick note: comment thread density is outrunning vote velocity right now (~[ratio] comments per upvote vs the PH average of ~0.05). That ratio is the cleanest sign we're getting people who actually want to dig into the methodology, not just drive-by upvoters. Specific question I'd love a take on from anyone here: [one open-ended methodology question]. Honest about uncertainty.
```

### Template E — Late-night close-out (T+13h to T+15h)

```
Last update from EU. [N] upvotes, [M] comments. Roughly [P]% of visitors hit /api/a2a — the agent endpoint — which is the metric I cared about most. The agent-discoverability angle worked. Couple of follow-up DMs to send tonight, more methodology Qs to answer in the morning. If you're discovering this thread now: the install is `npx -y @gitdealflow/mcp-signal`. Free, no auth, queryable from any MCP-aware agent.
```

### Numbers source

Pull live counts from:
- **PH rank/votes:** the listing page itself (manually) or `node tools/ph-momentum/poll.mjs --check-auth`
- **npm installs:** `npm view @gitdealflow/mcp-signal time` (or just check daily downloads on the package page)
- **/receipts share rate:** PostHog dashboard (or `tools/ph-momentum/poll.mjs` events)
- **Visitor count:** PostHog real-time
- **Comment density ratio:** divide comment count by upvote count from PH page

Refresh the numbers immediately before posting. Stale numbers at 21:00 EEST that say "we're at 24 upvotes" when it's actually 31 reads as inattentive.
