# MCP Directory Submissions
## Submit to all directories within 48 hours of launch

### Done
- [x] Official MCP Registry (registry.modelcontextprotocol.io) - published as io.github.kindrat86/vc-deal-flow-signal
- [x] npm (@gitdealflow/mcp-signal) - https://www.npmjs.com/package/@gitdealflow/mcp-signal
- [~] mcp.so - submitted via GitHub issue https://github.com/chatmcp/mcpso/issues/2081 — **STRUCTURALLY UNAVAILABLE 2026-05-03**: site returns Next.js 404 for all GitDealFlow URLs and maintainer is dormant (5 of our open issues). Skip.

### PRIORITY: awesome-mcp-servers PR #4933
- [~] PR open: https://github.com/punkpeye/awesome-mcp-servers/pull/4933 (Finance & Fintech section)
- **This is the highest-leverage pending item.** The list gets thousands of views.
- [ ] Check PR status daily
- [ ] If stale (no review in 48h), comment politely asking for review
- [ ] If requested changes, fix within 1 hour
- [ ] Once merged, tweet about it: "Just got listed on awesome-mcp-servers"
- [ ] Once merged, add "Featured in awesome-mcp-servers" badge to GitHub README

### Needs manual action (browser)

1. **glama.ai/mcp** - https://glama.ai/mcp/servers
   - Click "Add Server" button, fill form
   - May need a Glama account
   - Category: Finance / Data Analytics

2. **smithery.ai** - https://smithery.ai/new
   - **DELISTED 2026-05-03.** Smithery's 2026-05 listing model migrated to HTTP-only; old stdio/npx servers (including ours) were dropped. Re-listing requires wrapping our stdio server in an HTTP gateway. Skip until infra ready.
   - Per ExtensionsSettings deny list, all Smithery actions are user-only — Chrome MCP cannot script smithery.ai.

### Skipped
- **mcp-get.com** - DEPRECATED, archived project. Redirects to Smithery.
- **mcpservers.org** - Could not verify submission process
- **mcphub.io** - Could not verify submission process

### Second wave (after launch posts)

3. **Product Hunt** - list under "Developer Tools > AI" as a separate micro-launch
   - Tagline: "Query VC deal flow signals from inside Claude"

4. **Reddit posts about MCP**
   - r/ClaudeAI: "I built an MCP server for VC deal flow, here's what I learned"
   - r/LocalLLaMA: "MCP server for startup engineering signals (free, no API key)"

5. **Hacker News** - mention in Show HN comments (already in launch post)

### Demo GIF (add to all listings that support media)
- [ ] Record 30-second demo GIF: Claude querying MCP server for fintech startups + individual signal
- [ ] Tools: macOS screen recording (Cmd+Shift+5) or Kap
- [ ] Add to: GitHub README (hero), npm description, dev.to article, all directory listings
- [ ] Also create MP4 version for Twitter/Discord

### Submission template

**Name:** VC Deal Flow Signal
**Description:** Startup engineering acceleration signals for VC investors. Tracks commit velocity, contributor growth, and repo expansion across 20 sectors. No API key required.
**npm:** @gitdealflow/mcp-signal
**Install:** npx @gitdealflow/mcp-signal
**GitHub:** https://github.com/kindrat86/vc-deal-flow-signal/tree/main/mcp-server
**Website:** https://gitdealflow.com
**Category:** Finance / Data Analytics / Investment Intelligence
**Transport:** stdio
**Tools:** 5 (get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_methodology)
