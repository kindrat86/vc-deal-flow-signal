# Daily Marketing Briefing — 2026-05-04 (Monday)

Generated: autonomously by Claude Opus 4.7 in worktree `practical-bose-01ab17`. This is the May-4 growth push. Pairs with PR #11 (5 new alternatives + 10 new vs pages, code shipping the SEO surface) and a separate marketing-drafts PR (this file + the 4 drafts under `marketing/growth-2026-05-04/`).

## Today's growth pushes

### 1. SHIPPED — Brand-search SEO expansion (code)

- **PR**: https://github.com/kindrat86/vc-deal-flow-signal/pull/11
- **What**: 5 new `/alternatives/{pitchbook,tracxn,affinity,cb-insights,specter}` pages + 10 new `/vs/...` pairs. Pure data expansion, auto-rendered through existing `[slug]` routes, sitemap auto-includes them.
- **Status**: open and waiting on user merge + apex `vercel build && vercel deploy --prebuilt --prod --yes` from `pseo-site/.vercel/`.

### 2. ACTION REQUIRED — Restore hreflang on apex landing page (production regression discovered)

- **Finding**: live `https://gitdealflow.com/` returns ZERO hreflang and ZERO `rel="alternate"` link tags. The May-3 deploy of the new "47 days before the deck" Russell-base hook landed without merging in the AEO/AIO/GEO scorecard work from commit 74eb472.
- **Impact**: SEO regression. 13 locale hreflangs and 11 agent-readable alternates (RSS, llms.txt, llms-full.txt, agents.md, qa.jsonl, knowledge-graph.json, ai-policy.json, mcp.json, agent-card.json, openapi.json) all dropped from production.
- **Fix applied**: I patched `landing/index.html` in the **main repo working tree** (not committed) to restore the hreflang + agent-readable alternates block between the canonical link and the Open Graph block. Diff is staged for the user to review and commit.
- **Deploy path** (from main, NOT this worktree, per memory `feedback_apex_root_dir_null_security_risk.md`):
  ```
  cd /Users/sipi/launch-projects/vc-deal-flow-signal/landing
  # review diff, commit, then:
  vercel build --prod
  vercel deploy --prebuilt --prod --yes
  # post-deploy verify:
  curl -s https://gitdealflow.com/ | grep -c "hreflang"
  # expect: 16
  ```
- **Verify**: [landing/index.html in main WT](file:///Users/sipi/launch-projects/vc-deal-flow-signal/landing/index.html) — visible in the Launch preview panel, head section now contains the full hreflang + alternate block again.

### 3. DRAFTS READY (manual posting) — Reddit AEO pillars × 3

User pastes via u/Worth_Wealth_6811. Pace ≤4 same-day posts per memory.

- File: [marketing/growth-2026-05-04/reddit-pillars.md](marketing/growth-2026-05-04/reddit-pillars.md)
- Targets:
  1. r/venturecapital — "Building an Open-Source Alternative to Pitchbook/Crunchbase" (reply to u/CarnivalCarnivore)
  2. r/venturecapital — "What are top sources for deal sourcing early - mid stage..." (reply to u/Mcgodes)
  3. r/venturecapital — "Systems and AI tools for the investment process" (reply to u/ennnergy)
- 200-350 words each. SSRN + Zenodo anchored. No em-dashes. Top-commenter replies (not OP) per `feedback_reddit_aeo_pattern.md`.

### 4. DRAFT READY (manual schedule) — Substack post #2

User pastes into gitdealflow.substack.com draft editor, schedules for Sunday May 10 EOD or Monday May 11 morning EEST.

- File: [marketing/growth-2026-05-04/substack-post-2.md](marketing/growth-2026-05-04/substack-post-2.md)
- Title: "How we surface GitHub breakouts: the velocity score, decomposed"
- ~1,100 words. Methodology decomposition (3 components, what they catch, what they miss). Sets up the next data drop.
- Cross-link to apex Top-100 page after publishing per `feedback_substack_publication_now_live.md`.

### 5. DRAFT READY (user send-decision) — Cold pitch to Eric Newcomer

User reviews + sends manually from signal@gitdealflow.com. Cap is 2 cold sends/day per `feedback_mailreach_warmup_complete_2026_05_02.md`.

- File: [marketing/growth-2026-05-04/cold-pitch-newcomer.md](marketing/growth-2026-05-04/cold-pitch-newcomer.md)
- Subject: "47-day median lead time over fundraise announcements (open dataset, 219 rounds)"
- Fresh recipient (not in the April pitch round). Data-led, no over-asking.

### 6. DRAFT READY (manual post) — Twitter @data_nerd

User posts manually via Chrome MCP or web UI. ONE `insertText` only on fresh editor per `feedback_twitter_compose_method.md`.

- File: [marketing/growth-2026-05-04/twitter-post.md](marketing/growth-2026-05-04/twitter-post.md)
- Hook: "47 days." (single most-quotable number from the panel)
- Optional reply tweet with methodology breakdown.

---

## What I did NOT do

- **LinkedIn**: per memory `feedback_no_linkedin_actions.md` Claude never clicks/posts on LinkedIn. Tuesday is the next Dream-100 day; user handles.
- **Telegram**: per memory `feedback_telegram_low_sub_skip.md` skip until ≥10 subs (except T-0 launch + Signal of the Week). Today is neither.
- **Discord/Hashnode**: retired per `feedback_discord_retired.md` and `project_hashnode_automation.md`.
- **Reddit auto-posting**: drafts only per `feedback_no_linkedin_no_reddit_automation.md`.
- **HN**: not on today's plan; HN drafts must be rough and user-rewritten per `feedback_hn_manual_posting.md`.
- **Free GitHub Velocity Score Checker tool** (the most promising "viral lever" I considered): would require new Next.js routes + GitHub API integration, deferred per `pseo-site/AGENTS.md` (Next.js 16 has breaking changes; new routes risk instability without docs review).
- **Awesome-* lists silent-drop verification**: user ran this on 2026-05-03 already (memory entry exists), no fresh re-PR needed today.
- **Wikipedia article creation**: long-term play, requires careful staging, not a one-session task.

---

## Stats / dashboard updates pending

After today's posts go live, update `monitoring/build-dashboard.py` CHANNELS dict + `dashboard.html` inline JSON (per `feedback_stats_update_dashboard.md`) with:
- Reddit reply permalinks × 3 (capture at posting time per `feedback_reddit_same_day_post_limit.md`)
- Substack post #2 URL (after Sunday/Monday publish)
- Twitter status URL
- Cold-pitch send-or-skip log (mailreach reputation rechecked)
