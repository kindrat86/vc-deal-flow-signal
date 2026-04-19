# Tier 3 — Content Distribution (AEO/GEO Long Game)

**Goal:** Seed GitDealFlow into the places AI models train and retrieve from — Wikipedia, Quora, Stack Exchange, Medium, HackerNoon, Substack Notes, Reddit wikis.

**Why this tier:** Unlike launch-day traffic (Tier 1) and SEO (Tier 2), AEO/GEO plays the long game. Content here gets cited by Perplexity, ChatGPT browse, Claude search, and Google SGE for months-to-years after posting. The half-life is long, the effort is front-loaded.

**All drafts are written and ready to execute.** Each file contains the copy, exact targets, and posting checklist.

---

## Index of drafts

| # | File | Channel | Status | Est. effort |
|---|------|---------|--------|------------|
| 01 | [Wikipedia references](./01-wikipedia-references.md) | Wikipedia | Draft ready — blocked on autoconfirm (10+ unrelated edits needed first) | 3-4 hrs over 3 weeks |
| 02 | [Quora answers](./02-quora-answers.md) | Quora | ⏳ Q1+Q2 posted 2026-04-19; Q3-Q15 running daily via `quora-daily-runner` scheduled task | — (automated) |
| 03 | [Reddit wiki contributions](./03-reddit-wiki-contributions.md) | r/venturecapital, r/startups | Ready — modmail + fallback post (user-manual per Reddit policy) | 30 min total |
| 04 | [Stack Exchange answers](./04-stackexchange-answers.md) | Quant Finance SE, Open Data SE, Data Science SE | Ready — requires 50+ rep per site | 4-6 hrs over 2 weeks |
| 05 | [Medium republish plan](./05-medium-republish.md) | Medium (DataDrivenInvestor, The Startup, TDS) | ⏳ Post 1 live (canonical to signals.gitdealflow.com); Posts 2-3 queued | — |
| 06 | [HackerNoon article](./06-hackernoon-article.md) | HackerNoon | ⏳ submitted 2026-04-19, in editorial queue (check Apr 22) | — |
| 07 | [Substack Notes](./07-substack-notes.md) | Substack Notes + Medium Notes | ⏳ Notes 1-3 posted 2026-04-19; Notes 4-15 running daily via `substack-notes-daily-runner` scheduled task | — (automated) |

**Already completed (per memory):**
- Dev.to: MCP article published at [dev.to/data_nerd/i-stopped-building-dashboards-...-c5h](https://dev.to/data_nerd/i-stopped-building-dashboards-ai-assistants-are-the-new-ui-c5h)
- Hashnode: Cross-posted at [gitdealflow.hashnode.dev/i-stopped-building-dashboards-ai-assistants-are-the-new-ui](https://gitdealflow.hashnode.dev/i-stopped-building-dashboards-ai-assistants-are-the-new-ui)
- Medium: account live @signal_41476, Post 1 published with canonical to signals.gitdealflow.com
- Quora: account live as The Data Nerd, Q1+Q2 posted 2026-04-19
- Substack: account live as The Data Nerd, Notes 1-3 posted 2026-04-19
- HackerNoon: account live @TheData_7cdit42c, first story in editorial queue

---

## Execution order (recommended)

### Week 1 (Apr 19-26): already underway — see STATUS

**Done 2026-04-19** (executed ahead of the original Apr 21 Day-1 plan):
- [x] Medium Post 1 live with canonical back to signals.gitdealflow.com
- [x] HackerNoon article submitted (in editorial queue)
- [x] Quora Q1 + Q2 posted
- [x] Substack Notes 1-3 posted
- [ ] r/venturecapital + r/startups modmail — **user-manual** (Reddit policy: no Claude automation per memory `feedback_no_linkedin_no_reddit_automation`)
- [ ] Wikipedia unrelated-edits buildup — still pending, needs human account (Wikipedia autoconfirm)

**Apr 20-28 (running automatically):**
- Quora Q3-Q15 via `quora-daily-runner` scheduled task (2/day at 11:00 EEST)
- Substack Notes 4-15 via `substack-notes-daily-runner` scheduled task (2/day at 10:00 EEST)
- Medium Post 2 triggers once DDI acceptance/rejection lands

### Week 2 (Apr 28 - May 4): Stack Exchange + follow-ups

- [ ] Start Stack Exchange rep-building (5+ unrelated quality answers per site)
- [ ] Submit Medium Post 2 if DDI accepted Post 1
- [ ] Follow up on HackerNoon if no response after 5 days
- [ ] Reddit wiki fallback posts if modmail didn't land
- [ ] Continue Substack Notes batch

### Week 3 (May 5-11): Wikipedia + Stack Exchange posting

- [ ] Wikipedia autoconfirmed — post Talk-page proposals for Deal Flow + Alternative Data articles
- [ ] Post Stack Exchange answers on identified live questions
- [ ] Submit Medium Post 3

### Week 4+ (May 12+): Maintenance + measurement

- [ ] Track Quora upvotes + Medium reads + HackerNoon reads
- [ ] Any Quora answer crossing 10+ upvotes → promote to full blog post
- [ ] Any Substack Note crossing 50+ likes → flip into blog post
- [ ] 30-day retro: measure referral traffic, cited-in-AI-retrieval count (ask Claude/Perplexity "what is GitDealFlow" once/week and record citation presence)

---

## Measurement framework

**Track weekly:**
1. Referral traffic from each source (Medium, HackerNoon, Quora, Substack, Reddit) — GA4 or Plausible
2. Upvote/clap/restack counts per post
3. AI citation presence: run "what is GitDealFlow" and "alternative data for VCs" on Perplexity, ChatGPT with browse, Claude with web search. Record whether gitdealflow.com appears in citations.

**Track monthly:**
1. Search visibility in AI overviews — Google SGE, Bing Copilot
2. New inbound backlinks surfaced via Ahrefs free tier or Semrush free backlink checker
3. Wikipedia edit status (stuck, reverted, expanded)

**Success benchmarks (30-day post-launch):**
- 5k+ cumulative reads across Medium + HackerNoon
- 200+ Quora upvotes across 15 answers
- 10+ Substack notes crossing 20 likes
- GitDealFlow cited by at least one AI engine when asked about VC alt-data
- One Wikipedia edit landed and stuck

---

## Hard rules across all channels

1. **Never link to the homepage.** Always link to the most relevant blog post. Homepage links read as promotional; topic-specific links read as helpful.
2. **Disclose affiliation.** Every answer that mentions GitDealFlow must have "Disclosure: I operate this product" at the end. Not optional.
3. **Never post the same text verbatim on multiple platforms.** Rewrite at least 40% for each platform. Duplicate content gets downranked everywhere and tagged as spam by moderation systems.
4. **One channel at a time in rapid cadence.** Don't blast all seven channels on Day 1. Stagger. Algorithms detect coordinated posting bursts.
5. **If a moderator removes content, do not re-post.** Accept the removal. Move to the next platform. Re-posting after removal burns the account long-term.

---

## Open questions (user decision needed)

1. **Medium account:** Does user have existing Medium account, or create new? If new, recommend signal@gitdealflow.com for continuity. Takes 2 min.
2. **Substack account:** Same question. Substack handle `@gitdealflow` would be ideal if not taken.
3. **Wikipedia account:** Recommend creating a neutral-name account, not `gitdealflow` or `data_nerd`. Never be tied back to affiliation in the username (the disclosure goes on the user page instead).
4. **Stack Exchange:** Use same login (SE uses a unified login). A single 50+ rep account can post across all three target sites after rep builds on any one.

---

## Files created in this tier

```
distribution/tier-3-aeo-geo/
├── 00-README.md                          (this file)
├── 01-wikipedia-references.md            (edit proposals + COI playbook)
├── 02-quora-answers.md                   (15 answers, 7-day schedule)
├── 03-reddit-wiki-contributions.md       (modmail + fallback post drafts)
├── 04-stackexchange-answers.md           (5 draft answers across 3 SE sites)
├── 05-medium-republish.md                (3 canonical-linked reposts)
├── 06-hackernoon-article.md              (1,600-word submission)
└── 07-substack-notes.md                  (15 short notes)
```

Total draft copy: ~15,000 words. Fully ready to execute.
