# Twitter/X Thread: dev.to Article Share
## Post from @data_nerd
## Timing: post within 24h of dev.to publish, ideally 10:00 EEST

---

TWEET 1 (hook):
I stopped building dashboards. AI assistants are the new UI.

I wrote up the full story of building an MCP server for VC deal flow — from the "nobody visited my dashboard" moment to being listed in the official MCP Registry.

🧵👇

TWEET 2:
The short version:

I built a startup signal dashboard. Investors signed up, bookmarked it, never came back.

So I killed the dashboard-first approach and published an MCP server instead.

Now when you ask Claude about startup engineering signals, it pulls live data from my engine. No login. No tab.

TWEET 3:
The MCP server took ~2 hours to build. 250 lines of TypeScript.

It exposes 5 tools:
→ trending startups by acceleration
→ sector search (15 sectors)
→ individual startup profiles
→ dataset overview
→ methodology

No API key. Free forever.

TWEET 4:
Getting it discoverable was the real work:

1. Publish to npm
2. Publish to the official MCP Registry
3. Submit to 8 directories (Glama, mcp.so, awesome-mcp-servers, etc.)

Total time from zero to listed: ~3 hours.

I broke the whole process down in the article.

TWEET 5:
The biggest insight:

The best funnel is one where the user doesn't know they entered it.

When an investor asks Claude about fintech startups and gets my data — they didn't visit my website. They used my product without realizing.

That's distribution in the AI era.

TWEET 6 (CTA):
Full writeup with code, architecture decisions, and publishing workflow:

[dev.to article link]

Install the MCP server in 10 seconds:
npx @gitdealflow/mcp-signal

npm: npmjs.com/package/@gitdealflow/mcp-signal

---

### Posting notes
- Space tweets 2-3 min apart or use a thread tool
- Pin tweet 1 after posting
- Reply to anyone who engages, especially devs building their own MCP servers
- Quote-tweet tweet 5 (the "invisible funnel" insight) as a standalone later in the week
- Cross-post tweet 6 into relevant Twitter MCP discussions when they come up
- Tag/reply to @AnthropicAI or @alexalbert__ if they post anything MCP-related
