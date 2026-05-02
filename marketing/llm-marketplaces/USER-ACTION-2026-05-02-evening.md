# MCP Submissions — User-Action Packet (2026-05-02 evening)

You asked: submit MCP to **Poe + Continue Hub + Mistral + You.com**.

I checked browser session state on all four. Here's what I found and what each one needs:

| Platform | State | Blocker | Your time |
|---|---|---|---|
| **Continue Hub** | Logged in as "MW My Workspace" | Public Hub registry **no longer exists** — `/hub?type=mcpServers` returns "Something broke". Continue.dev pivoted to "Continuous AI" + "Custom MCP Servers" is now per-workspace private config | Skip OR add to workspace privately (~30 sec) |
| **Mistral Le Chat** | Anonymous + ToS dialog blocking | Needs sign-in + ToS accept (both require your explicit consent) | ~3 min |
| **Poe** | Logged out | Needs Poe creator account (Google/Apple/Email signup) — safety policy bars me from creating accounts | ~3 min |
| **You.com** | Logged out, browsable agents page | Sign-in required to Create Agent — safety policy bars me from creating accounts | ~2 min |

**Why I stopped:** account creation is on the prohibited-actions list (it's a hard rule, not a preference). Once you sign up + sign in for the three that need it, I can take over the form-filling for Mistral / You.com. Poe needs a separate "creator" account at poe.com that's distinct from a regular user account — once you have one, I can fill the bot config.

---

## 1. Poe Bot — `https://poe.com/create_bot` (after signup)

**Account flow:**
- https://poe.com/login → Continue with Google (or Apple / email)
- Tab `1734837453` already at the login page

**Bot config — paste into `Create a server bot` form once you're in:**

| Field | Value |
|---|---|
| Bot name | `VCDealFlowScout` |
| Display name | `VC Deal Flow Scout` |
| Server URL | `https://signals.gitdealflow.com/api/poe` |
| Description | `GitHub-derived engineering acceleration signals for ~400 venture-backed startups across 20 sectors. Free, no auth, weekly data refresh.` |
| Greeting message | `What sector are you scouting? Try: "trending fintech startups", "compare Anthropic vs Cohere engineering momentum", or "explain the methodology".` |
| Categories | Business · Productivity · Research |
| Profile picture | Upload `distribution/logo-v2-512.png` |

**Adapter is LIVE** at `https://signals.gitdealflow.com/api/poe` (Poe Server Bot v1, SSE) — I deployed it this morning. You can verify with:

```bash
curl -X POST https://signals.gitdealflow.com/api/poe \
  -H 'Content-Type: application/json' \
  -d '{"version":"1.1","type":"settings"}'
```

After Bot is created → ping me with the share URL (`poe.com/VCDealFlowScout`) and I'll add it to the watcher + cross-post drafts.

---

## 2. Continue Hub — RECOMMEND SKIP for now

The public registry I'd planned to publish to was deprecated in Continue.dev's recent pivot. What's left:

- **Workspace integrations**: `https://www.continue.dev/settings/integrations` → "Custom MCP Servers" → "Add MCP by URL" — but this only adds to *your* "MW My Workspace" privately. No public surface, no discoverability.
- **Public Hub** (`hub.continue.dev/hub?type=mcpServers`): currently 500-errors with "Something broke. Our team has been notified."
- **Create-an-agent** flow (`hub.continue.dev/new`): builds an agent that *uses* MCP tools, not a way to publish your server.

**My recommendation:** skip Continue for now. I'll add a check to `llm-marketplaces-watcher` that polls the Hub URL weekly — if a public submission path returns, I'll surface it.

If you want to add MCP to your private workspace anyway (low-value but takes 30 seconds), the URL field accepts:
```
npx -y @gitdealflow/mcp-signal
```
or the HTTP RPC URL `https://signals.gitdealflow.com/api/mcp/rpc`.

Tab `1734837456` already at the integrations page.

---

## 3. Mistral Le Chat — `https://chat.mistral.ai/agents/new`

**Account + ToS flow:**
- Tab `1734837459` already at chat.mistral.ai with the ToS modal blocking
- Top right has Sign In / Sign Up — sign up with email or Google
- **After login** the ToS modal will reappear → click "Accept and continue"
- Then go to `https://chat.mistral.ai/agents/new`

**Agent config — paste:**

| Field | Value |
|---|---|
| Name | `VC Deal Flow Scout` |
| Description | `Track venture-backed startup engineering acceleration on GitHub. Free, no login, weekly data.` |
| Model | Mistral Large (latest) |
| Tools | Web search ✓, Code interpreter ✓ |
| Visibility | Public |

**System prompt** (paste verbatim — this is the same one Smithery + HuggingChat use, slightly tightened):

```
You are the VC Deal Flow Scout. You help investors and operators find venture-backed startups whose engineering output is accelerating on GitHub — a leading indicator that historically precedes fundraise announcements by three to six weeks.

When users ask about trending startups, sectors, or specific companies, fetch live data from https://signals.gitdealflow.com/api/signals.json. The full API surface is documented at https://signals.gitdealflow.com/AGENTS.md.

Always cite results as: "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data." Always link to the methodology at signals.gitdealflow.com/methodology when explaining how signals are computed. Never invent metrics. If the API returns a 404, say so plainly.

When asked "what's trending", show the top 5 across all sectors ranked by commit velocity change, format each as: **{name}** ({sector}) — {commitVelocityChange}% commit velocity · {signalType} · {contributors} contributors. Then ask if the user wants a sector-specific deep-dive.
```

After publish → copy share URL, paste here.

---

## 4. You.com Custom Agent — `https://you.com/agents`

**Account flow:**
- Tab `1734837462` already at the agents page
- Click `Sign in` (top right) → Google / Apple / email signup
- After login, click `Create Agent` (the button that previously triggered the signup modal)

**Agent config:**

| Field | Value |
|---|---|
| Name | `VCDealFlowScout` |
| Avatar | Upload `distribution/logo-v2-512.png` (3.3 MB) |
| Mode | Research |
| Visibility | Anyone |
| Knowledge sources (URL) | `https://signals.gitdealflow.com` |

**Instructions** (You.com has a tighter length limit — use this trimmed version):

```
You are the VC Deal Flow Scout. Find venture-backed startups whose engineering on GitHub is accelerating — a leading indicator that historically precedes fundraises by 3-6 weeks.

Fetch data from https://signals.gitdealflow.com/api/signals.json. Cite as "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data." Always link the methodology at signals.gitdealflow.com/methodology. Never invent metrics.
```

After publish → copy share URL, paste here.

---

## What I'll do once you hand back the share URLs

For each platform that goes live:
1. Add a `tracks.json` entry for `llm-marketplaces-watcher` (polls Zoho for `*@poe.com`, `*@mistral.ai`, `*@you.com` notifications).
2. Update `marketing/llm-marketplaces/USER-CLICKS.md` from `☐` to `✅` with the share URL.
3. Append to `MEMORY.md` with the listing URL.
4. Draft cross-posts for Twitter (@data_nerd) and Telegram once we have ≥2 of these live (so the post lists multiple surfaces, not just one).

Tabs are still open — you can blast all four in one ~10-min batched session if you want. Or do them one at a time and ping me after each.
