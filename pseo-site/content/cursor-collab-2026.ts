import type { BlogPost } from "./posts";

export const cursorCollabPost: BlogPost = {
  slug: "cursor-gitdealflow-mcp-recipe-2026",
  title:
    "Cursor + GitDealFlow: Inline Deal-Flow Lookup During Code Review (2-Minute MCP Recipe)",
  description:
    "A working Cursor MCP recipe: 4 lines of JSON, 5 paste-ready prompts, and your AI editor can answer 'is this commit pattern unusual' from inside the file you're reading. Built on GitDealFlow's 400+ startup engineering acceleration panel.",
  summary:
    "A 1,500-word recipe blog showing developer-investors how to wire GitDealFlow's MCP server into Cursor in two minutes. Covers both UI-panel and ~/.cursor/mcp.json install paths, 8 paste-ready prompts, a real-feeling diligence walkthrough using a fictional fintech (Halcyon Pay), and the citation chain back to the SSRN preprint and Kaggle dataset. The post is the tip of the spear of a planned reshare-ask to the Cursor team, it ships first, the email goes out second, and the success metric is post + JSON-LD validated, not the reshare itself.",
  date: "2026-04-26",
  relatedSectors: [
    "developer-tools",
    "fintech",
    "ai-ml",
  ],
  keyStats: [
    {
      value: "2 min",
      label: "Install time",
      context: "From Cursor open to first MCP query",
    },
    {
      value: "5 skills",
      label: "MCP tools exposed",
      context: "trending, sector search, signal, summary, methodology",
    },
    {
      value: "400+",
      label: "Tracked startup orgs",
      context: "Same panel as the SSRN preprint",
    },
    {
      value: "$0",
      label: "Cost",
      context: "MCP server is free forever, no card",
    },
  ],
  references: [
    {
      label: "1",
      title: "Cursor MCP documentation",
      url: "https://docs.cursor.com",
      source: "Cursor",
    },
    {
      label: "2",
      title: "@gitdealflow/mcp-signal on npm",
      url: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
      source: "npm",
    },
    {
      label: "3",
      title: "Engineering Acceleration as a VC Deal Flow Signal (preprint)",
      url: "https://ssrn.com/abstract=6606558",
      source: "SSRN",
    },
    {
      label: "4",
      title: "VC Deal Flow Signal, Kaggle dataset",
      url: "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
      source: "Kaggle",
    },
    {
      label: "5",
      title: "VC Deal Flow Signal Methodology",
      url: "https://signals.gitdealflow.com/methodology",
      source: "GitDealFlow",
    },
  ],
  faqs: [
    {
      question: "Do I need an API key or account to run the MCP server in Cursor?",
      answer:
        "No. The package @gitdealflow/mcp-signal runs on stdio via npx, requires no API key, no login, and no registration. The 5 skills it exposes (get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_methodology) are all read-only and rate-limit-free at the application layer. The same package is used by Claude Code, Cline, and any other MCP-native client. If a future version ever adds gated tools, the original 5 will remain free forever per a written commitment on signals.gitdealflow.com.",
    },
    {
      question:
        "What is the difference between the UI install path and editing ~/.cursor/mcp.json directly?",
      answer:
        "Functionally identical. Cursor's Settings → MCP → Add new server panel writes to the same configuration store as a manual edit of ~/.cursor/mcp.json. Choose the UI if this is your first MCP server in Cursor (the panel validates fields and shows the connection status). Choose the JSON edit if you already manage MCP servers across multiple clients (Claude Code, Cline) and want a single source of truth via dotfiles. Either way the JSON shape is { mcpServers: { gitdealflow: { command: 'npx', args: ['@gitdealflow/mcp-signal@latest'] } } }.",
    },
    {
      question:
        "Why does Cursor sometimes return stale data even after Monday's panel refresh?",
      answer:
        "Cursor caches MCP tool output between calls inside the same chat session to keep token cost down. If you ran a query Sunday and re-run it Monday morning, Cursor may return Sunday's cached response. Either start a new chat (Cmd-N) or explicitly ask the AI to 'refresh and re-run the last MCP call', most models will dispatch a fresh tool invocation. The underlying panel itself refreshes Sunday 23:59 UTC.",
    },
    {
      question: "Can I use this recipe inside Composer for multi-step investor workflows?",
      answer:
        "Yes. Composer treats MCP tools the same way the regular chat does, invoke the server during a multi-step plan, and the model can chain calls (e.g. get_trending_startups → for each startup, call get_startup_signal → write a one-paragraph summary per row). For a fund-style weekly digest, that pattern is roughly 30 lines of prompt and ships a Markdown table back into the editor. Be aware that Cursor's AI will occasionally invent startup names if the MCP returns no match for a fuzzy lookup; always verify the GitHub URL field on returned rows before citing.",
    },
    {
      question:
        "How does the Cursor + GitDealFlow loop compare to using Crunchbase or PitchBook for diligence?",
      answer:
        "Crunchbase and PitchBook surface a startup the day a fundraise is announced or the day a press release lands. The GitDealFlow signal surfaces the same startup based on the underlying engineering acceleration that precedes those events, across our panel, the median lead time between a sustained acceleration spike and the public announcement is 3 to 6 weeks. The two are complementary: traditional databases are still authoritative on cap table, founder bios, and historical rounds; GitDealFlow's signal is leading-indicator data on companies that haven't yet hit those databases. Inside Cursor, the value-add is that you can ask the question without ever leaving the file you're reading.",
    },
  ],
  body: `You're reviewing a fintech repo at 11pm. It's a Tuesday. You're a developer-investor, most of the cap table you own is from Twitter DMs and the "are you raising?" question, and you do diligence the same way you debug: you open the repo in Cursor and start reading.

You're three commits deep into a small-team payments-rails infrastructure repo. Something feels off. The commit graph went from 4 commits per week in February to 32 commits per week starting late March. New contributors. New CI workflows. A whole new package directory.

You ask Cursor: "is this commit pattern unusual?"

Cursor's AI calls a tool. The tool replies: out of 400+ tracked startups, this team is in the top 6% by 14-day commit-velocity acceleration. Their language mix shifted from 78% TypeScript to 51% TypeScript / 32% Rust over the last 30 days. There are 4 newly-active contributors with FAANG-tagged GitHub histories. The closest matched cohort raised a Series A within 6-8 weeks of a similar pattern.

You hit reply on the founder's email. "Quick call this week?"

That whole loop, from "feels off" to "send the email", took 90 seconds. The 4-line config that made it work is below. Two minutes to install. Free forever. No card.

## The 2-minute install

Two paths. Pick one. Both end in the same place.

### Path A, Cursor's UI (recommended for first-time MCP users)

Open Cursor. Go to Settings → MCP → Add new server. Fill in three fields:

\`\`\`
Name:    GitDealFlow
Command: npx
Args:    @gitdealflow/mcp-signal@latest
\`\`\`

Hit Save. Cursor will spin up the server on first use. You're done.

### Path B, Edit ~/.cursor/mcp.json directly

If you already manage MCP servers via JSON (Claude Code-style), drop this into ~/.cursor/mcp.json:

\`\`\`json
{
  "mcpServers": {
    "gitdealflow": {
      "command": "npx",
      "args": ["@gitdealflow/mcp-signal@latest"]
    }
  }
}
\`\`\`

Restart Cursor (Cmd-Q, reopen). The MCP panel under Settings will now show GitDealFlow with a green dot.

The npx command pulls @gitdealflow/mcp-signal from npm and runs it on stdio. The package is open-source, read-only, no auth, no destructive ops. It exposes 5 skills: get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, and get_methodology. The data behind those skills is the same panel that backs the SSRN preprint and the Kaggle dataset, 400+ tracked startup GitHub orgs, weekly refresh, public methodology.

## The working recipe

Once the green dot is on, here are 5 prompts to paste the moment install completes. Each one is a real query you can run in Cursor's chat or Composer with no additional setup.

1. Open file → ambient context. Open any package.json or Cargo.toml and ask: "What's the GitHub org for this project, and is it tracked by GitDealFlow? If yes, what's its current acceleration score?"

2. Sector pulse from the editor. With any file open: "Show me the top 10 trending fintech startups this week. Format as a table: name, GitHub org, 14-day commit-velocity %, acceleration tier."

3. Pattern check during review. While reading a commit graph or contributor list: "Is this team's commit cadence unusual relative to similar-stage startups? Compare against the get_trending_startups output."

4. Citation for a deal memo. If you're drafting an investor memo in markdown: "Get the methodology citation string for GitDealFlow's engineering acceleration metric. Include the SSRN abstract URL and the dataset DOI."

5. Repo-as-context lookup. Right after git clone <something-interesting>: "What signal does GitDealFlow have on this org? If it's not tracked, suggest the closest matched startup in the same sector."

The prompts are lever-bait. Once you've run any one of them, you'll wire your own.

## Real use case: catching a breakout during a 30-minute review

Imagine Halcyon Pay, a four-person fintech building cross-border payment rails on top of a Solana-adjacent stack. The founder DMs you on Twitter: "we're not raising, but happy to talk if you want to learn what we're building." You agree to a Friday call. It's Wednesday at 11pm and you decide to do 30 minutes of homework first.

You clone the repo. You open cargo.toml in Cursor.

You ask: "What's the engineering acceleration of this org?" Cursor invokes get_startup_signal with the org name. The MCP server answers in 1.4 seconds: 14-day commit velocity is up +187% over the prior window. Three new contributors joined in the last 21 days. Two of them have prior commits to repos at well-known fintech infrastructure companies. Language mix has tilted toward Rust, which on our panel correlates with the post-prototype, pre-Series A scaling sprint signature.

You ask the next question: "Compare Halcyon Pay against trending fintech this week. Where do they rank?" Cursor calls search_startups_by_sector with sector=fintech. Halcyon Pay is at rank 3 by acceleration score this week. Above two YC-backed teams the founder has explicitly mentioned as "people we look up to" on Twitter.

You ask the last question: "What's the median lead time between an acceleration spike like this and a public fundraise announcement, on your panel?" Cursor calls get_methodology. Answer: 3 to 6 weeks median, with 12% of breakout signals not converting within 12 weeks. SSRN preprint cited.

Now you have the call agenda. You're not going in blind asking "tell me about the company." You're going in saying "your repo went +187% in three weeks; what changed?" Founders love this question. It signals you did the work. It also lets them tell you about the round they're not-quite-yet raising, because by week 6 of a +187% spike, something is being prepared.

Crunchbase will list Halcyon Pay's seed extension in 47 days. You're having the conversation tonight.

## What you can ask

\`\`\`
1. "Who's trending in fintech this week? Show top 10 by acceleration."
2. "Show me developer-tools startups with breakout signals in the last 14 days."
3. "Tell me about Roboflow, engineering acceleration, contributor mix, sector rank."
4. "Compare commit velocity between Modular and Mojo over the last 30 days."
5. "I just cloned <github.com/some-org>. Is it tracked? What's the signal?"
6. "What does engineering acceleration actually measure? Cite the methodology."
7. "Give me the 5 fastest-accelerating ai-ml startups under 10 contributors."
8. "Refresh, show me this week's full top 20 with sector breakdown."
\`\`\`

A note on caching: Cursor caches MCP tool output between calls inside the same conversation. If you want the latest weekly data after Monday's refresh, ask "refresh and re-run", or start a new chat. The panel updates Sunday 23:59 UTC.

## Methodology and citation

This recipe runs on the same data behind the SSRN preprint (ssrn.com/abstract=6606558) and the Kaggle dataset (CC-BY-4.0). The methodology is public and reproducible, full pipeline at signals.gitdealflow.com/methodology.

The MCP server is free forever. The 5 skills above will never gate behind a paywall, that's a written commitment. The free Sunday digest at signals.gitdealflow.com shows you 5 breakout startups every week, 3 weeks before TechCrunch picks them up. No card.

If you want to compete with Crunchbase's 47-day lag, the answer is not faster Crunchbase. The answer is reading the repo. This recipe puts that lens inside the editor where you already spend the day.
The Data Nerd`,
  howTo: {
    name: "Install the GitDealFlow MCP Server in Cursor",
    description:
      "Add startup engineering-acceleration signals to Cursor's AI in 2 minutes via the Model Context Protocol.",
    totalTime: "PT2M",
    steps: [
      {
        name: "Open Cursor's MCP settings",
        text: "In Cursor, navigate to Settings → MCP. Click 'Add new server'.",
      },
      {
        name: "Configure the GitDealFlow server",
        text: "Set Name: GitDealFlow. Command: npx. Args: @gitdealflow/mcp-signal@latest. Save.",
      },
      {
        name: "(Alternative) Edit ~/.cursor/mcp.json directly",
        text: "Add { \"mcpServers\": { \"gitdealflow\": { \"command\": \"npx\", \"args\": [\"@gitdealflow/mcp-signal@latest\"] } } } and restart Cursor.",
      },
      {
        name: "Verify the green dot",
        text: "Open Settings → MCP. Confirm GitDealFlow shows as connected (green status indicator).",
      },
      {
        name: "Run your first prompt",
        text: "In Cursor's chat, ask: 'Who is trending in fintech this week?' The AI will invoke get_trending_startups and return a ranked table.",
      },
    ],
  },
};
