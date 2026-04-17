# MCP Distribution Strategy: "The MCP Server IS the Product"
## Framework: Isenberg Strategy #1 — Embedded Distribution
## Created: 2026-04-16 | Updated: 2026-04-17 (Chrome extension added as parallel channel)

---

## Core thesis

The MCP server is not a feature of VC Deal Flow Signal. It IS the product for the first 100 users. Developer-investors who use Claude daily are the highest-intent buyers. Every distribution action should amplify MCP server installs, not website visits.

The funnel: MCP install → use it weekly → hit the free tier limit → subscribe.

## Parallel channel: Chrome extension (added 2026-04-17)

The Chrome extension is the sibling embedded-distribution channel for the non-developer persona. Same funnel logic, different audience:

- **MCP server** targets dev-investors who live in Claude/Cursor/Claude Code
- **Chrome extension** targets traditional VCs who live in Crunchbase / AngelList / PitchBook

Install URL: https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn

Both channels should be mentioned together in content. Avoid forcing a choice — the persona self-selects. The Chrome extension should NOT replace the MCP angle in dev-community content, and the MCP angle should NOT replace the Chrome extension in investor-community content. In general-audience content (landing page, launch posts, email sequences), mention both.

---

## Priority actions (ordered by leverage)

### TIER 1 — DO THIS WEEK (highest leverage)

#### 1. awesome-mcp-servers PR #4933 — GET IT MERGED
- **Status:** PR open at https://github.com/punkpeye/awesome-mcp-servers/pull/4933
- **Why it matters:** This list gets thousands of GitHub stars and views. A merged listing = permanent discovery.
- **Actions:**
  - [ ] Check PR status — if stale, comment asking for review
  - [ ] If requested changes, fix immediately
  - [ ] If no activity in 48h, politely ping maintainer
  - [ ] Once merged, share the merged PR on Twitter: "Just got listed on awesome-mcp-servers 🎉"

#### 2. Twitter thread — share dev.to article
- **Asset:** `distribution/twitter-devto-article-thread.md`
- **Actions:**
  - [ ] Post 6-tweet thread from @data_nerd
  - [ ] Pin tweet 1
  - [ ] Quote-tweet the "invisible funnel" tweet (tweet 5) standalone later in the week
  - [ ] Reply to any MCP-related tweets from @AnthropicAI, @alexalbert__, @simonw with the article link

#### 3. Discord blitz — 5 servers in 5 days
- **Asset:** `distribution/discord-mcp-posts.md`
- **Schedule:**
  - [ ] Day 1: Anthropic/Claude Discord
  - [ ] Day 2: MCP Community Discord
  - [ ] Day 3: Cursor Discord
  - [ ] Day 4: Indie builder Discord
  - [ ] Day 5: TypeScript/dev Discord

#### 4. Hashnode cross-post
- **Asset:** `distribution/hashnode-mcp-crosspost.md`
- **Actions:**
  - [ ] Create Hashnode account as The Data Nerd
  - [ ] Import dev.to article with canonical URL
  - [ ] Share Hashnode link in Discord communities that prefer it

#### 5. Demo GIF/video — 30-second MCP in action
- **Why:** Visual proof converts 10x better than text descriptions
- **Script:**
  1. Open Claude Desktop or Claude Code
  2. Type: "Which startups are accelerating in fintech?"
  3. Show Claude calling the MCP tool + returning live data
  4. Type: "Get the signal for roboflow"
  5. Show the detailed profile response
- **Tools:** Use macOS screen recording (Cmd+Shift+5) or Kap (open source)
- **Output:** GIF (for Twitter, Discord, GitHub README) + MP4 (for dev.to embed)
- **Distribution:**
  - [ ] Add to GitHub README as hero visual
  - [ ] Embed in dev.to article (edit to add)
  - [ ] Post as standalone tweet: "This is what AI-native distribution looks like. 30 seconds from question to live startup data." + GIF
  - [ ] Add to Discord showcase posts
  - [ ] Add to npm package description
  - [ ] Add to MCP Registry listing (if supported)

---

### TIER 2 — THIS MONTH (compound over time)

#### 6. Second dev.to article: "How to publish an MCP server to the ecosystem"
- **Angle:** Tutorial/guide, not product pitch. Teach others how to publish.
- **Structure:**
  1. npm publish workflow
  2. MCP Registry (mcp-publisher CLI)
  3. Directory submissions (which ones matter, which to skip)
  4. Discovery optimization (good descriptions, install commands)
- **CTA:** "Here's one I built as a reference: @gitdealflow/mcp-signal"
- **Why:** Positions you as an MCP ecosystem expert. Attracts server builders who also invest.

#### 7. Third dev.to article: "5 MCP servers every investor should install"
- **Angle:** Listicle — curate the best MCP servers for the investor workflow
- **Include:** Your server + 4 others (financial data, news, calendar, CRM)
- **Why:** Generous framing (not just self-promotion), gets shared by other server creators
- **Bonus:** Tag the creators of the other servers on Twitter — they'll amplify

#### 8. MCP listicle outreach (email)
- **Asset:** `memory: project_mcp_listicle_outreach.md` — pitch to 4 "best MCP servers" articles
- **Timing:** After email warmup completes (~May 2026)
- **Actions:**
  - [ ] Identify 4-6 existing "best MCP servers" articles (Google search)
  - [ ] Email authors asking to be included
  - [ ] Offer to write a paragraph + provide screenshots

#### 9. GitHub README enhancement
- **Actions:**
  - [ ] Add demo GIF as hero visual
  - [ ] Add "Featured in" badges (awesome-mcp-servers, MCP Registry, Glama, etc.)
  - [ ] Add usage examples with real output
  - [ ] Add "Other MCP servers you might like" section (cross-pollination)
  - [ ] Ensure the README ranks for "mcp server startup data" / "mcp server vc" searches

#### 10. MCP-focused Twitter content (ongoing)
- **Add to weekly content cycle:**
  - 1 tweet/week with a specific MCP query + result screenshot
  - 1 tweet/week engaging with MCP ecosystem tweets (retweet + comment)
  - 1 tweet/week about MCP ecosystem growth (new servers, new directories, adoption numbers)
- **Template:** "Asked Claude: '[query]' → got live data from 2,000+ startup GitHub orgs in 3 seconds. This is what MCP does." + screenshot

#### 11. Hacker News MCP threads
- **Strategy:** Don't post your own server. Find existing HN threads about MCP and comment with your experience.
- **Search for:** "MCP server", "Model Context Protocol", "Claude tools"
- **Comment angle:** "I built one for VC deal flow — here's what I learned about the publishing process" + link to dev.to article

#### 12. Reddit MCP distribution (beyond existing plan)
- **Add these subreddits to the rotation:**
  - r/MCP (if exists) — direct audience
  - r/ClaudeAI — "I built an MCP server, AMA about the process"
  - r/ChatGPTPro — "How MCP servers compare to ChatGPT plugins" (educational, not pitch)
  - r/artificial — broader AI audience
- **Asset:** `distribution/reddit-mcp-posts.md` already has r/ClaudeAI, r/cursor, r/LocalLLaMA posts

---

### TIER 3 — NEXT MONTH (ecosystem positioning)

#### 13. MCP server for other AI clients
- **Expand beyond Claude:** Ensure the server works with Cursor, Windsurf, Cody, and any MCP-compatible client
- **Test and document:** Add setup instructions for each client to README and dev.to
- **Why:** Each client = a new distribution channel

#### 14. Streamable HTTP transport
- **Current:** stdio only (limits discovery on Smithery)
- **Add:** HTTP transport for browser-based clients
- **Unlocks:** Smithery listing, web-based MCP clients, API-style usage

#### 15. MCP server directory SEO
- **Optimize listings on:** Glama, mcp.so, MCP Market, PulseMCP, Cline
- **Actions:**
  - [ ] Add screenshots/GIFs to all directory listings
  - [ ] Ensure descriptions are keyword-rich (startup data, VC, deal flow, engineering signals)
  - [ ] Add the demo GIF wherever supported

#### 16. Contribute to MCP ecosystem
- **Write:** A PR to the MCP docs with a "publishing your first server" guide
- **Speak:** If there are MCP community calls or Twitter Spaces, volunteer
- **Build goodwill:** Help other server creators debug their publishing workflow

#### 17. Product Hunt micro-launch for MCP server specifically
- **Separate from the main PH launch** (which is for the full product)
- **Tagline:** "Query VC deal flow signals from inside Claude"
- **Category:** Developer Tools > AI
- **Why:** PH has an active MCP/AI tools audience

---

## Weekly MCP noise checklist (add to existing content cycle)

Every week, ensure at least 5 of these happen:

- [ ] 1 tweet with MCP query screenshot
- [ ] 1 tweet engaging with MCP ecosystem content
- [ ] 1 reply to a Dream 100 target mentioning AI tools/MCP
- [ ] 1 Discord comment in an MCP-related server
- [ ] 1 Reddit comment in an MCP-related thread
- [ ] Check awesome-mcp-servers PR status
- [ ] Check directory listing statuses (mcp.so, MCP Market, Cline)

---

## Metrics to track

| Metric | Tool | Target (30 days) |
|--------|------|------------------|
| npm weekly downloads | npmjs.com stats | 100+ |
| GitHub stars | GitHub | 25+ |
| MCP Registry installs | Registry dashboard | Track |
| dev.to article views | dev.to analytics | 1,000+ |
| dev.to article reactions | dev.to analytics | 50+ |
| Discord server joins from MCP posts | Manual tracking | 10+ |
| Twitter impressions on MCP content | Twitter analytics | 5,000+ |
| awesome-mcp-servers PR merged | GitHub | Yes |

---

## The flywheel

```
MCP installs → users query data → they share results on Twitter
    ↓                                        ↓
dev.to articles → Discord/Reddit posts → more installs
    ↓                                        ↓
awesome-mcp-servers listing → GitHub stars → npm downloads
    ↓                                        ↓
directory listings → search discovery → more installs
```

Every action feeds back into more installs. The MCP server is the distribution engine.
