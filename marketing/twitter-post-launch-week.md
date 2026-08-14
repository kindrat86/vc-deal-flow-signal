# Twitter Post-Launch Cadence — @sipiteno
## Apr 20 (Mon) → Apr 26 (Sun) — sustains momentum from Apr 19 launch

All times in Athens (EEST, UTC+3). Default slot: 10:00 EEST = 09:00 CET = 07:00 UTC.
Post link: https://x.com/sipiteno/compose/tweet (account: @sipiteno)

Cadence shifts to **3x/week (Mon/Wed/Fri data observations) + 2 reactive slots (Tue/Thu MCP/replies)**. Sat = quiet, Sun = retro thread (see launch-retrospective.md).

---

### Mon Apr 20 — Day-after-launch single tweet (no thread, let the launch thread breathe)

Yesterday I shipped VC Deal Flow Signal. Day-1 numbers:

- 60+ startups across 20 sectors live in the dashboard
- #1 mover: orbiternassp (+329% commit velocity, Space Tech)
- #1 sector: Cybersecurity, akto-api-security shipping 267 commits in 14 days

The data was already public. Nobody was reading it.

signals.gitdealflow.com

---

### Tue Apr 21 — MCP angle (catches Show HN traffic)

Show HN tomorrow. Pre-tweeting the angle today so it doesn't look cold.

You can query our startup signal data directly from Claude:

```
npx @gitdealflow/mcp-signal
```

Then in Claude Desktop: "which startups in cybersecurity are accelerating?"

It returns live ranked data. No API key. No login. The MCP server IS the product for devs who invest.

---

### Wed Apr 22 — Pattern observation #1 (Mon/Wed/Fri data slot)

Looked at every startup in our top 10 this week. They all have one thing in common.

It's not the commit count. (Range: 13 to 529 commits/14 days.)
It's not the contributor count. (Range: 14 to 100 contributors.)
It's not the sector. (10 startups, 6 sectors.)

It's the **rate of change from baseline**.

orbiternassp does 30 commits in 14 days. That's small in absolute terms. But it's +329% above their own baseline. That's the signal.

Absolute volume tells you the team is big. Acceleration tells you something is changing.

Full leaderboard: signals.gitdealflow.com/trending

---

### Thu Apr 23 — Reply day (no scheduled tweet)

Spend 30-45 min replying to:
- Comments on Sun Apr 19 launch thread
- Show HN comments (if Wave 2 happened Tuesday)
- @-mentions from the week
- VC accounts that tweeted about deal sourcing this week

Goal: 10 substantive replies, not 50 likes. Algo rewards reciprocal engagement.

---

### Fri Apr 24 — Pattern observation #2 (Mon/Wed/Fri slot)

Sector everyone is sleeping on this week: Space Tech.

orbiternassp: +329% commit velocity. 37 contributors. Open-source Space Apps Challenge org with sustained growth.

OpenC3: 87 commits/14d, 45 contributors. Mission control software, going commercial.

Two open-source space startups in our top 10 in the same week. The sector hasn't been on most VC radars since 2022. The engineering data says it's quietly back.

Track it: signals.gitdealflow.com/sector/space-tech

---

### Sat Apr 25 — Quiet day

No scheduled tweet. Optional: 1 reply to a VC account, 1 quote-RT of a relevant data viz. Don't force it.

---

### Sun Apr 26 — Product Hunt launch + retro thread

PH goes live 12:01 AM PT (10:01 EEST). Twitter activity:

1. **10:05 EEST** — Quote-tweet the PH launch post: "Live on Product Hunt today: [link]. One week ago I was scared to launch. Here's what 7 days taught me: [thread]"
2. **10:06 EEST** — Drop the launch retrospective thread (see launch-retrospective.md)
3. **Throughout day** — Reply to every PH comment + Twitter reply within 30 min

---

## Notes
- All "data observation" posts must use REAL numbers from signals.gitdealflow.com — re-check before posting in case the weekly cron has updated the leaderboard
- Never use "we" when you mean "I" — the Data Nerd persona is solo
- Keep tweets under 280 chars unless explicitly threaded
- After Apr 26, drop to 2x/week (Mon + Thu) and let Product Hunt aftermath drive the rest
