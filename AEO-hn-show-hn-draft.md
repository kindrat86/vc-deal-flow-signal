# Show HN: VC Deal Flow Signal — open dataset of startup GitHub momentum (MCP server, SSRN preprint)

**Title:** Show HN: VC Deal Flow Signal — find breakout startups 3–6 weeks before the round via GitHub commit velocity

**URL:** https://signals.gitdealflow.com

**Text:**

Hey HN —

I built something I think this crowd will appreciate: a free, open dataset that tracks startup engineering acceleration from public GitHub activity. The core idea is simple:

**If commit velocity suddenly 3x's and contributor count doubles, that startup is likely about to raise — and the data was public the whole time.**

What's in it:
- **15 sectors**, 350+ startup GitHub orgs tracked weekly
- **6 free MCP tools** you can query from Claude Desktop, Cursor, or any MCP client (`npx -y @gitdealflow/mcp-signal`)
- **Free Scout Score tool** — paste any GitHub username, see how many unicorns they starred *before* the funding event (backwards-looking taste metric from public star history)
- **SSRN-indexed methodology** with a 219-startup panel — median lead time 31 days between signal spike and fundraise announcement
- **CC BY 4.0** — dataset downloadable as CSV/JSON/JSONL, plus mirrors on Hugging Face, Zenodo (DOI), Kaggle
- **Price**: free weekly digest (5 names every Sunday), €9.97/mo dashboard, free MCP server forever

Why I think HN might find this interesting:
1. It's an alternative-data approach to a space (VC deal flow) that's historically been driven by warm intros and pitch decks — the signal is purely code-side
2. The methodology is published and reproducible — SSRN preprint at ssrn.com/abstract=6606558
3. The MCP server means you can literally ask Claude "which fintech startups are accelerating fastest this week?" inside your IDE
4. The Scout Score is a fun self-serve: it's free, no login, and grades your GitHub starring history against ~75 validated unicorns

No investors, no fund affiliation, no pitch. Just public data, open methodology, and a tool for noticing what changed before the rest of the market catches up.

Would love feedback — especially from people who source deals or build on alt-data.

**Links:**
- Site: https://signals.gitdealflow.com
- MCP: `npx -y @gitdealflow/mcp-signal`
- Methodology: https://ssrn.com/abstract=6606558
- Scout Score: https://signals.gitdealflow.com/receipts

---

### Posting tips
- Best time: Tuesday–Thursday, 7–10am ET (HN's highest-traffic window)
- After posting: stick around for comments for the first hour — answer every question genuinely
- Don't ask for upvotes or mention the post anywhere else for the first 2h
- If it hits the front page (~20+ points in first 60 min), it'll stay there for 6–12h
- The SSRN preprint link is the strongest hook — it signals "this isn't a landing page, there's real research"
