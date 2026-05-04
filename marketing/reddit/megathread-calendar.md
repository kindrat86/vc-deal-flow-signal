# Layer 5 — Recurring Megathread Calendar

**Status:** WEEKLY ROUTINE. User posts manually.

**Why this layer matters:** recurring megathreads (e.g., r/SideProject "Show what you built", r/Entrepreneur "Thank Me Thursday") are ZERO-RISK posting surfaces. Automod whitelists them, mods don't punish promotional content there because the thread itself IS the promo container. Per-thread traffic is low (1-5 visitors) but the cumulative drumbeat compounds week over week.

**Key principle:** treat these as a habit, not a launch. One 60-90 word entry per thread per week. Different angle each time so the same audience doesn't see boilerplate.

---

## Reality check (2026-04-26 audit)

I curl'd all 6 subs to confirm recurring megathreads exist. **Most do NOT have reliable weekly threads in 2026** — the "every Saturday" assumption from older Reddit playbooks is mostly dead. Updated calendar below reflects what's actually live + a search-pattern fallback for the dead ones.

## The calendar (post-audit)

| Day | Time (EEST) | Subreddit | Reality | Action |
|---|---|---|---|---|
| Mon | 09:00 | r/AI_Agents | NO recurring sticky | Find HOTTEST agent-list post via `curl -s -A "Mozilla/5.0" "https://www.reddit.com/r/AI_Agents/hot.json?limit=10"` and reply to top commenter (use Template A below) |
| Tue | 14:00 | r/SaaS | NO recurring "What are you working on" thread; pinned posts are RULES warnings only | **SKIP r/SaaS megathread.** Use Template A on a fresh r/SideProject "drop your SaaS" thread instead (these recur daily as user-created posts; find via hot.json) |
| Wed | — | rest day | — | — |
| Thu | 16:00 | r/Entrepreneur | "Thank Me Thursday" NOT pinned; **but "Sunday Steam: Vent It or Roast It"** IS pinned weekly: [example](https://reddit.com/r/Entrepreneur/comments/1sw1f8r/sunday_steam_vent_it_or_roast_it_april_26_2026/) | Switch slot to **SUN 16:00**; use Sunday Steam thread (vent/roast, not gratitude — adjust Template C accordingly) |
| Fri | 13:00 | r/IndieHackers | **"Friday Share Fever" exists weekly** — confirmed live: [example](https://reddit.com/r/indiehackers/comments/1suaeoq/friday_share_fever_lets_share_your_project/) (30 ups, 164 comments) | KEEP — high-engagement megathread, our best Layer 5 surface |
| Sat | 12:00 | r/SideProject | NO weekly "Show what you built" thread; pinned posts are old/permanent | Find a fresh user-created "drop your project" post via `curl -s -A "Mozilla/5.0" "https://www.reddit.com/r/SideProject/hot.json?limit=10"` (today's example: "Drop your side project. I will make you rank on ChatGPT" 16 ups / 43 comments / 3h old) |
| Sun | 14:00 | r/microsaas | NO weekly "Drop your SaaS" thread; only old "Big Updates" pinned | Find a hot user-created post via `curl -s -A "Mozilla/5.0" "https://www.reddit.com/r/microsaas/hot.json?limit=10"` |

Plus when they appear (variable cadence):
- r/mcp showcase threads (search for "showcase" or "what are you using" in /new)
- r/cursor "what's your setup" threads (rare but high-value)
- r/ClaudeAI weekly tool roundups (sporadic; watch /hot)
- r/programming "What are you working on?" Saturday thread (also sporadic in 2026)

## Daily megathread-finder one-liner (run each morning)

```bash
for sub in SideProject microsaas AI_Agents IndieHackers Entrepreneur SaaS; do
  echo "=== r/$sub ==="
  curl -s -A "Mozilla/5.0" "https://www.reddit.com/r/$sub/hot.json?limit=8" \
    | python3 -c "
import sys, json, time
d = json.load(sys.stdin)
for c in d['data']['children']:
    p = c['data']
    age_h = (time.time() - p['created_utc'])/3600
    if p.get('stickied') or any(k in p['title'].lower() for k in ['drop','show','share','built','week','megathread','launch','steam','fever']):
        flag = 'PINNED' if p.get('stickied') else ''
        print(f'  [{flag:6}] ups={p[\"ups\"]:>4} c={p[\"num_comments\"]:>3} age={age_h:>5.1f}h: {p[\"title\"][:70]}')
        print(f'    -> https://reddit.com{p[\"permalink\"]}')
"
done
```

---

## Comment templates by sub (cycle through, don't repeat)

### r/AI_Agents — Monday weekly sticky

**Template A (week 1, MCP angle):**

```
Built a free MCP server that exposes startup engineering signals to your agent. 5 read-only tools: get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_methodology. Install: `npx @gitdealflow/mcp-signal`. AgentCard at signals.gitdealflow.com/.well-known/agent-card.json. JSON-RPC stub at /api/a2a if you prefer that protocol. Free, no auth, listed on official MCP Registry. Useful for VC sourcing or any "what's hot in OSS this week" agent workflow.
```
Word count: 71

**Template B (week 2, A2A angle):**

```
Shipped an Agent2Agent endpoint last weekend wrapping our existing dataset. AgentCard at signals.gitdealflow.com/.well-known/agent-card.json, JSON-RPC at /api/a2a. Five skills for startup engineering signals across 4,200 GitHub orgs. Curl-able from terminal, cursor-callable inline during diligence, claude-callable via the MCP variant. Already indexed at a2aregistry.org. The methodology paper at ssrn.com/abstract=6606558 covers the false-positive analysis if you care about that.
```
Word count: 65

---

### r/SaaS — Tuesday "What are you working on?"

**Template A (week 1, traction angle):**

```
Building VC Deal Flow Signal. Free MCP server on npm + paid dashboard at EUR 9.97/mo. Two weeks in. Numbers: ~12 daily npm installs, 1 real email subscriber (anonymous solo build is hard), 0 paid yet, soft-launched on PH last Sunday. Doubling down on the MCP server because the conversion narrative is way better than the dashboard. signals.gitdealflow.com.
```
Word count: 60

**Template B (week 2, learning angle):**

```
Working on the freemium funnel for VC Deal Flow Signal. Lesson from week 2: free MCP server (`npx @gitdealflow/mcp-signal`) gets shared dev-to-dev. Free dashboard demo gets bookmarked and forgotten. The wedge that gets shared in chats wins. PocketBase + Stripe + Vercel stack, EUR 9.97/mo paid tier. signals.gitdealflow.com.
```
Word count: 51

---

### r/Entrepreneur — Thursday "Thank Me Thursday"

**Template A (week 1, gratitude-driven):**

```
Thanks to the 11 people who left comments on my SideProject build-in-public posts this week. Two of them flagged a feature I had not thought of (an explain-panel for the alerts in the dashboard). Building it next sprint. If you are running a niche SaaS and want fresh eyes, drop a link below mine and I will write a real comment back this weekend. signals.gitdealflow.com (free MCP + paid dashboard for VCs tracking GitHub momentum).
```
Word count: 79

---

### r/IndieHackers — Friday Roundup

**Template A (week 1, transparent metrics):**

```
Week 2 update on VC Deal Flow Signal. Shipped: free MCP server (12 daily npm installs), Chrome extension (1 user), receipts game at /receipts (viral spike pending r/SideProject post Mon), Sunday PH launch (editorial did not feature, transparent retro coming Mon). Email list: 1 real subscriber. Karma on Reddit: 748. Long way to go. gitdealflow.com.
```
Word count: 58

---

### r/SideProject — Saturday "Show what you built this week"

**Template A (week 1, ship-list framing):**

```
Shipped this week:
- /receipts — free game grading your GitHub stars against ~75 unicorns (signals.gitdealflow.com/receipts)
- A2A endpoint at signals.gitdealflow.com/api/a2a (Cursor-callable inline diligence)
- Scout Score badge generator at /badge-builder (auto-updating SVG for your README)
- Hourly PH momentum tracker (internal)

Stack: Next.js 16 on Vercel. Free tier stays free forever. Site: gitdealflow.com.
```
Word count: 56

**Template B (week 2, lesson framing):**

```
Lesson from week 2: shipped a soft Sunday PH launch, editorial did not feature, decided not to bury the failure. Posted a transparent retro to r/SideProject and r/IndieHackers. The retros are getting more upvotes than the launch did. The actual product (free MCP server for VC engineering signals at signals.gitdealflow.com) had its best week of npm installs because the retro audience converted at 3-1 over the launch audience. Real signal: vulnerability sells.
```
Word count: 76

---

### r/microsaas — Sunday "Drop your SaaS"

**Template A (week 1, full pitch):**

```
VC Deal Flow Signal. Free MCP server (`npx @gitdealflow/mcp-signal`) + paid dashboard at EUR 9.97/mo + Insider Circle at EUR 97/mo. Anonymous solo build, week 2.

Wedge: the MCP server. Devs install it in 30s, get live startup engineering data in Claude or Cursor. Free forever, 5 read-only tools.

Upgrade path: dashboard ranks 85+ startups by sector, Insider Circle adds API access + private Telegram.

PH50OFF gives 50% off 3 months on either paid tier.

signals.gitdealflow.com. Drop yours below mine and I'll check it out.
```
Word count: 87

---

## When to skip

- DO NOT post in 2 megathreads same day (looks spammy, account flag risk)
- DO NOT use the same template twice on the same sub. Cycle A/B/C.
- DO NOT post if the megathread is dead (<10 comments in last 24h). Wait for the next week's thread.
- DO NOT include emojis. Per `feedback_reddit_comment_style.md`.

## When the thread DOESN'T appear

Some megathreads aren't perfectly weekly. If the expected thread isn't pinned on its expected day:
- Wait 24h
- Check sub's "About" or sticky posts
- If still missing, skip that week. Don't try to retrofit into a non-megathread, that triggers automod.

## Tracking

Per-week log lives in `marketing/reddit/megathread-log-{YYYY-WW}.md` (create when you start). Track per row: thread URL, comment URL, upvotes at +24h, clicks (if PostHog shows referrer).

## Out of scope

- r/wallstreetbets daily threads — wrong audience, anonymity rule + financial-advice exposure
- r/marketing weekly threads — saturated with marketers, low conversion
- r/Entrepreneur "Roast my idea" thread — too negative-framed, eats karma
- r/startups daily thread — sub culture is anti-self-promo even in megathreads

## Voice rules (apply to ALL megathread comments)

Per `feedback_reddit_comment_style.md`:
- 50-100 words (megathread comments can be slightly longer than reply comments since the thread WANTS them)
- No em-dashes
- Statements > questions
- ONE link per comment max (more triggers automod on some subs)
- Bury the link near the bottom, lead with the value
- Reply to anyone who replies to your comment within 4h

## Why these subs were chosen

- r/SideProject (Sat) — sub culture is "show your build", weekly thread is high-engagement
- r/microsaas (Sun) — Sunday peak with 80+ comment megathreads, founder-to-founder
- r/Entrepreneur (Thu) — Thank Me Thursday is gratitude-framed, lowers promo allergy
- r/IndieHackers (Fri) — Friday Roundup is mature audience, accepts metrics-first comments
- r/SaaS (Tue) — building-focused, Tuesday is mid-week peak
- r/AI_Agents (Mon) — weekly Project Display sticky accumulates 7 days of attention
