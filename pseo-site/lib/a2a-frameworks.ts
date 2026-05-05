export interface A2AFramework {
  slug: string;
  name: string;
  tagline: string;
  audience: string;
  status: "first-class-mcp" | "custom-tool";
  description: string;
  installSnippet?: string;
  preferredApproach: string;
  preferredCode: string;
  alternativeApproach?: string;
  alternativeCode?: string;
  whatToAsk: string[];
  gotchas: string[];
  docsLinks: { label: string; url: string }[];
}

const AGENT_CARD_URL =
  "https://signals.gitdealflow.com/.well-known/agent-card.json";
const A2A_ENDPOINT = "https://signals.gitdealflow.com/api/a2a";
const MCP_NPM = "@gitdealflow/mcp-signal";

export const A2A_FRAMEWORKS: A2AFramework[] = [
  {
    slug: "claude-code",
    name: "Claude Code",
    tagline: "The official Anthropic CLI",
    audience:
      "Developer-investors who run agentic workflows from the terminal",
    status: "first-class-mcp",
    description:
      "Claude Code supports MCP servers natively via its settings file. Our MCP server exposes the same five skills as the A2A endpoint, so the easiest path is to configure it as an MCP server. The A2A endpoint is still useful for running ad-hoc curls or chaining from a sub-agent that does not have MCP access.",
    installSnippet: `npx ${MCP_NPM}@latest`,
    preferredApproach: "MCP server (recommended)",
    preferredCode: `// ~/.claude/settings.json or .mcp.json
{
  "mcpServers": {
    "gitdealflow": {
      "command": "npx",
      "args": ["${MCP_NPM}@latest"]
    }
  }
}

// Restart Claude Code, then ask:
//   "Who's trending in fintech this week?"
//   "Tell me about Roboflow."
//   "What does breakout signal mean?"`,
    alternativeApproach: "Direct A2A from Bash tool",
    alternativeCode: `# Inside Claude Code, ask:
#   "Use the Bash tool to call GitDealFlow's A2A endpoint and tell me what's trending."
# Claude will invoke:

curl -X POST ${A2A_ENDPOINT} \\
  -H 'Content-Type: application/json' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"message/send","params":{"message":{"role":"user","parts":[{"kind":"text","text":"trending"}]}}}'`,
    whatToAsk: [
      "Who's trending in fintech this week?",
      "Compare commit velocity for Roboflow and Modular.",
      "Show me ai-ml startups with breakout signals.",
      "What does engineering acceleration actually measure?",
      "Cite the methodology paper for my deal memo.",
    ],
    gotchas: [
      "Claude Code's settings file is project-scoped if `.mcp.json` is present at the repo root; otherwise it falls back to the user-level `~/.claude/settings.json`.",
      "On first launch, Claude Code may require you to approve MCP server execution. The MCP server is read-only, no auth, no destructive ops.",
    ],
    docsLinks: [
      { label: "Claude Code MCP docs", url: "https://docs.claude.com/en/docs/claude-code" },
      { label: "Our MCP package on npm", url: `https://www.npmjs.com/package/${MCP_NPM}` },
    ],
  },
  {
    slug: "cursor",
    name: "Cursor",
    tagline: "The AI code editor",
    audience: "Developer-investors who pair-program with their AI",
    status: "first-class-mcp",
    description:
      "Cursor supports MCP servers via its Settings → MCP panel. Add our package once, ask the AI to query startups during your code review, and you have inline deal-flow lookup without leaving the editor. The A2A endpoint becomes useful when you want Cursor to call us from a custom Composer prompt without MCP overhead.",
    preferredApproach: "MCP server (recommended)",
    preferredCode: `// Cursor → Settings → MCP → Add new server
//
// Name:    GitDealFlow
// Command: npx
// Args:    ${MCP_NPM}@latest
//
// Or directly edit ~/.cursor/mcp.json:
{
  "mcpServers": {
    "gitdealflow": {
      "command": "npx",
      "args": ["${MCP_NPM}@latest"]
    }
  }
}`,
    alternativeApproach: "Custom Composer prompt with curl",
    alternativeCode: `// In Composer, paste this prompt template:
//
// "Call ${A2A_ENDPOINT} via the Bash tool with this body:
//   {jsonrpc:'2.0',id:1,method:'message/send',params:{message:{role:'user',parts:[{kind:'text',text:'INTENT_HERE'}]}}}
//
// Then summarize the artifacts.parts[0].data.startups list."
//
// Replace INTENT_HERE with the natural-language query.`,
    whatToAsk: [
      "While reviewing a fintech repo: 'is this commit pattern unusual?'",
      "After looking at package.json: 'who else is shipping ML infra at this velocity?'",
      "During refactor: 'show me developer-tools breakouts for inspiration.'",
      "Before sending an investor update: 'what's the citation string for this dataset?'",
    ],
    gotchas: [
      "Cursor caches MCP server output between calls. Ask it to refresh if you want the latest weekly data after Monday's refresh.",
      "Cursor's AI will sometimes invent startup names if the MCP call returns no match. Always check the GitHub URL field on returned rows.",
    ],
    docsLinks: [
      { label: "Cursor MCP docs", url: "https://docs.cursor.com" },
      { label: "Our MCP package", url: `https://www.npmjs.com/package/${MCP_NPM}` },
    ],
  },
  {
    slug: "openai-agents-sdk",
    name: "OpenAI Agents SDK",
    tagline: "openai-agents Python and TypeScript packages",
    audience:
      "Builders shipping agent workflows on OpenAI models with first-class tool use",
    status: "custom-tool",
    description:
      "The OpenAI Agents SDK gives you a clean primitive for tool use. A2A is not natively supported by the SDK as of April 2026, so the integration is a custom function tool that POSTs JSON-RPC to our endpoint. The whole tool fits in 30 lines and exposes all five skills behind a single dispatch function.",
    installSnippet: `pip install openai-agents
# or
npm install @openai/agents`,
    preferredApproach: "Custom function tool (Python)",
    preferredCode: `# pip install openai-agents requests
from openai_agents import Agent, function_tool
import requests

A2A_URL = "${A2A_ENDPOINT}"

@function_tool
def gitdealflow_query(skill: str, args: dict | None = None) -> dict:
    """
    Call the GitDealFlow A2A agent.
    skill: one of get_trending_startups, search_startups_by_sector,
           get_startup_signal, get_signals_summary, get_methodology
    args:  skill-specific arguments (e.g. {"sector": "fintech"})
    """
    body = {
        "jsonrpc": "2.0", "id": 1,
        "method": "message/send",
        "params": {
            "message": {
                "role": "user",
                "parts": [{"kind": "data", "data": {"skill": skill, "args": args or {}}}],
            }
        },
    }
    r = requests.post(A2A_URL, json=body, timeout=15)
    r.raise_for_status()
    return r.json()["result"]["artifacts"][0]["parts"][0]["data"]

agent = Agent(
    name="VC scout",
    tools=[gitdealflow_query],
    instructions="Use gitdealflow_query to fetch live startup engineering signals.",
)`,
    alternativeApproach: "TypeScript custom tool",
    alternativeCode: `// npm install @openai/agents
import { Agent, tool } from "@openai/agents";
import { z } from "zod";

const A2A_URL = "${A2A_ENDPOINT}";

const gitdealflow = tool({
  name: "gitdealflow_query",
  description: "Call the GitDealFlow A2A agent for startup engineering signals.",
  parameters: z.object({
    skill: z.enum([
      "get_trending_startups",
      "search_startups_by_sector",
      "get_startup_signal",
      "get_signals_summary",
      "get_methodology",
    ]),
    args: z.record(z.string(), z.any()).optional(),
  }),
  execute: async ({ skill, args }) => {
    const r = await fetch(A2A_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "message/send",
        params: {
          message: {
            role: "user",
            parts: [{ kind: "data", data: { skill, args: args ?? {} } }],
          },
        },
      }),
    });
    const json = await r.json();
    return json.result.artifacts[0].parts[0].data;
  },
});`,
    whatToAsk: [
      "Pass {skill: 'get_trending_startups'} for weekly top 20.",
      "Pass {skill: 'search_startups_by_sector', args: {sector: 'ai-ml'}}.",
      "Pass {skill: 'get_startup_signal', args: {name: 'Roboflow'}}.",
      "Pass {skill: 'get_methodology'} when an analyst questions the ranking.",
    ],
    gotchas: [
      "The endpoint returns JSON-RPC envelopes. Always reach into result.artifacts[0].parts[0].data for the structured payload, or .parts[1].text for the plaintext fallback.",
      "Sector slugs are normalized aliases (crypto → web3, AI → ai-ml). If you accept user free-text, route it through search_startups_by_sector and let the endpoint resolve.",
    ],
    docsLinks: [
      { label: "OpenAI Agents SDK", url: "https://github.com/openai/openai-agents-python" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "langchain",
    name: "LangChain",
    tagline: "The most popular Python and JS agent framework",
    audience: "Builders chaining multiple tools across LLM providers",
    status: "custom-tool",
    description:
      "LangChain has experimental MCP support via langchain-mcp-adapters, and our MCP server works out of the box with that path. For A2A specifically, the cleanest integration is a small Tool subclass that wraps the JSON-RPC call. Both paths return the same data — pick MCP if you already use it elsewhere, A2A if you want a single HTTP dependency.",
    installSnippet: `pip install langchain langchain-core
# or
pip install langchain-mcp-adapters  # if you prefer MCP`,
    preferredApproach: "Custom A2A Tool (Python)",
    preferredCode: `from langchain_core.tools import tool
import requests

A2A_URL = "${A2A_ENDPOINT}"

@tool
def gitdealflow_a2a(skill: str, args: dict | None = None) -> dict:
    """Call the GitDealFlow A2A agent.

    Args:
        skill: One of get_trending_startups, search_startups_by_sector,
               get_startup_signal, get_signals_summary, get_methodology.
        args: Optional dict of skill-specific arguments.
    """
    body = {
        "jsonrpc": "2.0", "id": 1,
        "method": "message/send",
        "params": {
            "message": {
                "role": "user",
                "parts": [{"kind": "data", "data": {"skill": skill, "args": args or {}}}],
            }
        },
    }
    return requests.post(A2A_URL, json=body, timeout=15).json()
`,
    alternativeApproach: "MCP via langchain-mcp-adapters",
    alternativeCode: `# pip install langchain-mcp-adapters
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent

client = MultiServerMCPClient({
    "gitdealflow": {
        "command": "npx",
        "args": ["${MCP_NPM}@latest"],
        "transport": "stdio",
    },
})

tools = await client.get_tools()
agent = create_react_agent("openai:gpt-4o-mini", tools)
response = await agent.ainvoke(
    {"messages": [{"role": "user", "content": "What's trending in fintech?"}]}
)`,
    whatToAsk: [
      "agent.invoke({'messages': [...top 20 trending...]})",
      "Chain: GitDealFlow lookup → SerpAPI for press → Crunchbase API for funding → memo writer",
      "Filter: only return startups in user's geography",
      "Compose: weekly digest from get_trending_startups + LLM summarization",
    ],
    gotchas: [
      "If you use `create_react_agent`, the model occasionally calls the tool with malformed args. Validate before passing through.",
      "The A2A endpoint has no rate limit at the application layer, but if you call it 100x/sec from a batch loop, the upstream CDN may briefly throttle. Add a 100ms sleep between calls in tight loops.",
    ],
    docsLinks: [
      { label: "LangChain Tools", url: "https://python.langchain.com/docs/concepts/tools/" },
      { label: "langchain-mcp-adapters", url: "https://github.com/langchain-ai/langchain-mcp-adapters" },
    ],
  },
  {
    slug: "vercel-ai-sdk",
    name: "Vercel AI SDK",
    tagline: "The ai package for Next.js, Node, and edge runtimes",
    audience: "Developers shipping AI features inside web apps",
    status: "custom-tool",
    description:
      "The Vercel AI SDK has native MCP support via experimental_createMCPClient as of v6, and our MCP server works directly with it. For pure A2A, define a single tool() with zod schema and fetch the JSON-RPC endpoint. The data flows the same either way; MCP is more turnkey for production apps, A2A is simpler when you want one HTTP dep.",
    installSnippet: `npm install ai zod`,
    preferredApproach: "Custom A2A tool() (TypeScript)",
    preferredCode: `import { tool, generateText } from "ai";
import { z } from "zod";

const A2A_URL = "${A2A_ENDPOINT}";

const gitdealflow = tool({
  description:
    "Get startup engineering signals: trending startups, sector watchlists, single-startup profiles, dataset summaries, and methodology.",
  parameters: z.object({
    skill: z.enum([
      "get_trending_startups",
      "search_startups_by_sector",
      "get_startup_signal",
      "get_signals_summary",
      "get_methodology",
    ]),
    args: z.record(z.string(), z.any()).optional(),
  }),
  execute: async ({ skill, args }) => {
    const res = await fetch(A2A_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "message/send",
        params: {
          message: {
            role: "user",
            parts: [{ kind: "data", data: { skill, args: args ?? {} } }],
          },
        },
      }),
    });
    const json = await res.json();
    return json.result.artifacts[0].parts[0].data;
  },
});

const result = await generateText({
  model: "openai/gpt-4o-mini",
  tools: { gitdealflow },
  prompt: "Who's trending in fintech this week?",
});`,
    alternativeApproach: "MCP via experimental_createMCPClient",
    alternativeCode: `// npm install ai @modelcontextprotocol/sdk
import { experimental_createMCPClient, generateText } from "ai";
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";

const client = await experimental_createMCPClient({
  transport: new Experimental_StdioMCPTransport({
    command: "npx",
    args: ["${MCP_NPM}@latest"],
  }),
});

const tools = await client.tools();

const result = await generateText({
  model: "openai/gpt-4o-mini",
  tools,
  prompt: "What's trending in fintech?",
});

await client.close();`,
    whatToAsk: [
      "Inside a Server Component: pull weekly top 20 to seed your dashboard.",
      "Inside a Route Handler: surface 'is this startup tracked?' to logged-in users.",
      "Inside a Server Action: write a watchlist alert email when a tracked startup hits breakout.",
    ],
    gotchas: [
      "The tool() helper expects you to return JSON-serializable data. The .data field on artifacts is already a plain object — passing it through is safe.",
      "If you use Edge runtime, the fetch to A2A should be on regular Node runtime since you may want to hold connections longer. Set `export const runtime = 'nodejs'`.",
    ],
    docsLinks: [
      { label: "Vercel AI SDK", url: "https://ai-sdk.dev" },
      { label: "MCP integration", url: "https://ai-sdk.dev/docs/mcp" },
    ],
  },
  {
    slug: "crewai",
    name: "CrewAI",
    tagline: "Python multi-agent orchestration",
    audience:
      "Builders running role-based agent crews where one agent does sourcing, another writes the memo",
    status: "custom-tool",
    description:
      "CrewAI lets you compose specialized agents into a crew with shared context. Wrap our A2A endpoint as a BaseTool and any agent on the crew can pull live engineering signals — typical pattern is a 'scout' agent that surfaces breakouts and a 'analyst' agent that drafts the LP-ready memo.",
    installSnippet: `pip install crewai requests`,
    preferredApproach: "Custom BaseTool subclass",
    preferredCode: `from crewai_tools import BaseTool
import requests

A2A_URL = "${A2A_ENDPOINT}"

class GitDealFlowTool(BaseTool):
    name: str = "GitDealFlow A2A"
    description: str = (
        "Fetch live VC engineering signals. "
        "Pass skill (get_trending_startups | search_startups_by_sector | "
        "get_startup_signal | get_signals_summary | get_methodology) and optional args."
    )

    def _run(self, skill: str, args: dict | None = None) -> dict:
        body = {
            "jsonrpc": "2.0", "id": 1,
            "method": "message/send",
            "params": {"message": {"role": "user", "parts": [
                {"kind": "data", "data": {"skill": skill, "args": args or {}}},
            ]}},
        }
        return requests.post(A2A_URL, json=body, timeout=15).json()

# Then attach to any Agent: tools=[GitDealFlowTool()]`,
    whatToAsk: [
      "Scout agent: 'pull this week's top 20 trending and rank by my fintech focus.'",
      "Analyst agent: 'write a 1-page memo on the top result.'",
      "Verifier agent: 'cite the SSRN methodology in the memo.'",
      "Compose: scout → analyst → verifier → email-drafter pipeline.",
    ],
    gotchas: [
      "CrewAI passes tool args as kwargs — declare your `_run` signature explicitly or use a Pydantic args_schema.",
      "Crews default to verbose=False; turn on verbose=True the first run so you see exactly which skill the agent picked.",
    ],
    docsLinks: [
      { label: "CrewAI tools docs", url: "https://docs.crewai.com/concepts/tools" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "mastra",
    name: "Mastra",
    tagline: "TypeScript agent framework with first-class MCP support",
    audience:
      "TypeScript builders shipping agents alongside their Next.js or Hono apps",
    status: "first-class-mcp",
    description:
      "Mastra has native MCP via MCPClient as of v0.4. Add our package once and every Mastra agent in the project can call all five skills. The A2A endpoint is the cleaner fallback when you want to call the agent without MCP overhead from a serverless edge handler.",
    installSnippet: `npm install @mastra/core @mastra/mcp`,
    preferredApproach: "MCP via @mastra/mcp",
    preferredCode: `import { MCPClient } from "@mastra/mcp";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

const mcp = new MCPClient({
  servers: {
    gitdealflow: {
      command: "npx",
      args: ["${MCP_NPM}@latest"],
    },
  },
});

const tools = await mcp.getTools();

export const scoutAgent = new Agent({
  name: "VC Scout",
  model: openai("gpt-4o-mini"),
  instructions: "Use the gitdealflow tools to surface live engineering signals.",
  tools,
});`,
    alternativeApproach: "Direct A2A fetch tool",
    alternativeCode: `import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const gitdealflowA2A = createTool({
  id: "gitdealflow-a2a",
  description: "Call GitDealFlow's A2A endpoint for VC signals.",
  inputSchema: z.object({
    skill: z.enum([
      "get_trending_startups",
      "search_startups_by_sector",
      "get_startup_signal",
      "get_signals_summary",
      "get_methodology",
    ]),
    args: z.record(z.string(), z.any()).optional(),
  }),
  execute: async ({ context }) => {
    const r = await fetch("${A2A_ENDPOINT}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1, method: "message/send",
        params: { message: { role: "user", parts: [
          { kind: "data", data: { skill: context.skill, args: context.args ?? {} } },
        ]}},
      }),
    });
    return (await r.json()).result.artifacts[0].parts[0].data;
  },
});`,
    whatToAsk: [
      "Inside a Mastra workflow: chain trending → memo-writer → email-sender steps.",
      "Inside a Hono route: surface 'is this startup tracked?' for logged-in users.",
      "Inside a cron job: write a Monday digest to the team's Slack.",
      "Inside a multi-step agent: scout → analyst → verifier with shared context.",
    ],
    gotchas: [
      "Mastra MCPClient holds long-lived stdio processes — call `await mcp.disconnect()` in serverless teardown to avoid orphaned children.",
      "If your edge runtime can't spawn child processes, use the A2A fallback tool — it's pure fetch, edge-safe.",
    ],
    docsLinks: [
      { label: "Mastra MCP docs", url: "https://mastra.ai/docs/agents/using-tools-and-mcp" },
      { label: "Our MCP package", url: `https://www.npmjs.com/package/${MCP_NPM}` },
    ],
  },
  {
    slug: "pydantic-ai",
    name: "Pydantic AI",
    tagline: "Type-safe Python agent framework",
    audience:
      "Python builders who want strict typing on every agent input and output",
    status: "custom-tool",
    description:
      "Pydantic AI's Tool decorator enforces typed args and return shapes. Wrap our A2A endpoint as a single Tool that takes a skill enum and a typed args dict, and the agent gets compile-time checking on every call. The MCP server also works via pydantic-ai's experimental MCP support if you prefer.",
    installSnippet: `pip install pydantic-ai`,
    preferredApproach: "Typed Tool",
    preferredCode: `from pydantic_ai import Agent, Tool, RunContext
from pydantic import BaseModel
from typing import Literal
import requests

A2A_URL = "${A2A_ENDPOINT}"

Skill = Literal[
    "get_trending_startups",
    "search_startups_by_sector",
    "get_startup_signal",
    "get_signals_summary",
    "get_methodology",
]

class A2AArgs(BaseModel):
    skill: Skill
    args: dict | None = None

async def gitdealflow_query(ctx: RunContext, params: A2AArgs) -> dict:
    """Call GitDealFlow A2A for live VC engineering signals."""
    body = {
        "jsonrpc": "2.0", "id": 1,
        "method": "message/send",
        "params": {"message": {"role": "user", "parts": [
            {"kind": "data", "data": {"skill": params.skill, "args": params.args or {}}},
        ]}},
    }
    return requests.post(A2A_URL, json=body, timeout=15).json()

agent = Agent(
    "openai:gpt-4o-mini",
    tools=[Tool(gitdealflow_query)],
    system_prompt="Use gitdealflow_query for live engineering signals.",
)`,
    whatToAsk: [
      "result = await agent.run('Who is trending in fintech?')",
      "Compose with other Pydantic AI tools (web search, vector store) for an end-to-end deal-memo flow.",
      "Stream tokens with agent.run_stream() while the tool fetches in the background.",
      "Validate output with a result_type=DealMemo Pydantic model.",
    ],
    gotchas: [
      "Pydantic AI revalidates tool args on every call — keep your A2AArgs model lean to avoid latency.",
      "If you want the agent to use multiple skills in one turn, raise tool_call_limit (default 10) in Agent config.",
    ],
    docsLinks: [
      { label: "Pydantic AI docs", url: "https://ai.pydantic.dev" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "continue",
    name: "Continue",
    tagline: "Open-source IDE assistant for VS Code and JetBrains",
    audience:
      "Developer-investors using a self-hosted or BYOK alternative to Cursor",
    status: "first-class-mcp",
    description:
      "Continue supports MCP servers natively via its config.yaml. Add our server once and every Continue chat can pull engineering signals while you read code. The A2A endpoint is useful when you want a one-shot inline edit ('explain this commit pattern in context of the broader sector') without leaving the editor.",
    preferredApproach: "MCP server in config.yaml",
    preferredCode: `# ~/.continue/config.yaml (Continue v1.0+)
mcpServers:
  - name: gitdealflow
    command: npx
    args:
      - "${MCP_NPM}@latest"

# Reload Continue, then in chat:
#   "Use gitdealflow to find AI/ML breakouts this week"
#   "What does breakout signal mean?"`,
    alternativeApproach: "Custom slash command via A2A",
    alternativeCode: `# ~/.continue/config.yaml
slashCommands:
  - name: signal
    description: "Look up engineering signal for the current repo"
    prompt: |
      Run this curl and summarize the result for the user:
      curl -X POST ${A2A_ENDPOINT} \\\\
        -H 'Content-Type: application/json' \\\\
        -d '{"jsonrpc":"2.0","id":1,"method":"message/send","params":{"message":{"role":"user","parts":[{"kind":"text","text":"signal {{{ input }}}"}]}}}'`,
    whatToAsk: [
      "While reviewing a PR: 'is this commit cadence unusual for this org?'",
      "When opening a new repo: 'what's the engineering signal on this org?'",
      "In a code-review chat: 'show me ai-ml breakouts that ship at this velocity.'",
      "Before a meeting: 'pull last week's trending in fintech.'",
    ],
    gotchas: [
      "Continue caches MCP responses per chat session — start a fresh chat after Monday's data refresh if you want the latest.",
      "On Windows, use the absolute path to npx in the command field; PATH resolution from the IDE process is flaky.",
    ],
    docsLinks: [
      { label: "Continue MCP docs", url: "https://docs.continue.dev/customize/deep-dives/mcp" },
      { label: "Our MCP package", url: `https://www.npmjs.com/package/${MCP_NPM}` },
    ],
  },
  {
    slug: "cline",
    name: "Cline",
    tagline: "Autonomous Claude agent for VS Code",
    audience:
      "Developer-investors who let an agent run multi-step workflows in their editor",
    status: "first-class-mcp",
    description:
      "Cline has native MCP support via its MCP servers settings panel. Add our package and Cline can autonomously chain a research step ('check engineering signals for this org') with a downstream action ('open a Linear ticket if breakout'). The A2A endpoint is the cleaner path when you want Cline to call us inside a single Bash step without MCP context overhead.",
    preferredApproach: "MCP server (Cline UI)",
    preferredCode: `// In VS Code: Cline panel → MCP Servers → Edit Config
// Or directly edit ~/Documents/Cline/MCP/cline_mcp_settings.json:
{
  "mcpServers": {
    "gitdealflow": {
      "command": "npx",
      "args": ["${MCP_NPM}@latest"],
      "disabled": false
    }
  }
}

// Then in Cline chat:
//   "Pull trending ai-ml startups, then for the top 3 open a Linear issue
//    titled 'Diligence: <name>' with the signal data in the description."`,
    alternativeApproach: "A2A from Cline's Bash tool",
    alternativeCode: `// Ask Cline:
// "Use the bash tool to call ${A2A_ENDPOINT} with body
//  {jsonrpc:'2.0',id:1,method:'message/send',params:{message:{role:'user',parts:[{kind:'text',text:'trending'}]}}}
//  then summarize."

// Cline will execute and structure the response in its plan view.`,
    whatToAsk: [
      "'Pull trending fintech, then open a Linear ticket for each.'",
      "'Check signal on each org I have starred this month and write a markdown summary to ~/notes.'",
      "'Watch the next breakout and email me when commit_velocity_change exceeds 200%.' (Cline will set up a cron via crontab.)",
      "'Compare three orgs and explain the engineering tell.'",
    ],
    gotchas: [
      "Cline runs in autonomous mode by default — review its plan view before approving multi-step workflows that include external API calls.",
      "MCP server output is included in Cline's context window for every subsequent step; for big trending lists, ask Cline to summarize before chaining further.",
    ],
    docsLinks: [
      { label: "Cline MCP docs", url: "https://docs.cline.bot/mcp/configuring-mcp-servers" },
      { label: "Our MCP package", url: `https://www.npmjs.com/package/${MCP_NPM}` },
    ],
  },
  {
    slug: "aider",
    name: "Aider",
    tagline: "AI pair-programmer in your terminal",
    audience:
      "Terminal-first developer-investors who prefer git-aware agentic editing",
    status: "custom-tool",
    description:
      "Aider doesn't have native MCP, but its /run command + .aider.conf.yml command aliases make A2A trivial to wire. Drop a one-liner alias and any aider session can pull signals mid-edit ('aider, /signal trending fintech' returns the data inline so you can paste it into a doc the agent is editing).",
    installSnippet: `pip install aider-chat`,
    preferredApproach: "Command alias in .aider.conf.yml",
    preferredCode: `# .aider.conf.yml in your repo
# Then in aider: /signal trending
# Or: /signal sector ai-ml
shell-commands:
  signal: |
    curl -sS -X POST ${A2A_ENDPOINT} \\\\
      -H 'Content-Type: application/json' \\\\
      -d '{"jsonrpc":"2.0","id":1,"method":"message/send","params":{"message":{"role":"user","parts":[{"kind":"text","text":"'$1'"}]}}}' \\\\
      | jq -r '.result.artifacts[1].parts[0].text // .result.artifacts[0].parts[0].text'`,
    alternativeApproach: "Inline /run with curl",
    alternativeCode: `# In any aider session:
# /run curl -X POST ${A2A_ENDPOINT} -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"message/send","params":{"message":{"role":"user","parts":[{"kind":"text","text":"trending"}]}}}'

# Aider includes the output in its context, so the next prompt
# can reference the returned startups by name.`,
    whatToAsk: [
      "/signal trending — top 20 of the week, plaintext.",
      "/signal sector fintech — sector watchlist.",
      "/signal startup Roboflow — single-startup profile.",
      "/signal methodology — full methodology text for citing in a doc.",
    ],
    gotchas: [
      "Aider's /run output is appended to context — for big payloads, pipe through `head -20` to avoid context bloat.",
      "If you're on Windows in PowerShell, the bash heredoc above won't work; use the inline /run with the JSON quoted as a single string.",
    ],
    docsLinks: [
      { label: "Aider docs", url: "https://aider.chat/docs" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "inngest",
    name: "Inngest",
    tagline: "Durable workflow runner with AI Kit",
    audience:
      "Builders running long-running, retryable agent workflows in production",
    status: "custom-tool",
    description:
      "Inngest's AgentKit gives you durable, retryable agent workflows. Wrap our A2A endpoint as an Inngest function and chain it into multi-step flows that survive crashes and retries — perfect for 'every Monday at 9am, pull trending and email the top 5 to subscribers' type loops.",
    installSnippet: `npm install inngest @inngest/agent-kit`,
    preferredApproach: "Inngest function calling A2A",
    preferredCode: `import { Inngest } from "inngest";

const inngest = new Inngest({ id: "vc-scout" });

export const weeklyDigest = inngest.createFunction(
  { id: "weekly-digest", name: "Weekly VC digest" },
  { cron: "0 9 * * 1" }, // Monday 9am
  async ({ step }) => {
    const trending = await step.fetch("${A2A_ENDPOINT}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1, method: "message/send",
        params: { message: { role: "user", parts: [
          { kind: "data", data: { skill: "get_trending_startups" } },
        ]}},
      }),
    });
    const data = (await trending.json()).result.artifacts[0].parts[0].data;

    await step.run("email-subscribers", async () => {
      // ...your email send here...
      return { sent: data.startups.length };
    });
  },
);`,
    whatToAsk: [
      "Cron-triggered Monday digest of trending startups.",
      "Event-triggered workflow: when a tracked org breaks out, email + open a CRM task.",
      "Multi-step: scout → enrich (Crunchbase) → verify (Wellfound) → memo (LLM step) → email.",
      "Retryable batch: 'enrich 50 startups' with automatic backoff on 429s.",
    ],
    gotchas: [
      "step.fetch retries automatically on 5xx — our endpoint returns 200 with JSON-RPC error envelopes, so check `result` vs `error` in the response, not the HTTP status.",
      "AgentKit's stateful agents persist context across steps; pass only the data fields you need to the next step to keep state size sane.",
    ],
    docsLinks: [
      { label: "Inngest AgentKit", url: "https://agentkit.inngest.com" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "n8n",
    name: "n8n",
    tagline: "Visual workflow automation with AI nodes",
    audience:
      "Operators who prefer visual node-based pipelines over code",
    status: "custom-tool",
    description:
      "n8n's HTTP Request node hits our A2A endpoint with zero code. Drop one node, paste the JSON-RPC body, wire to a Send Email or Slack node downstream. Works as a no-code path to all five skills, and the AI Agent node can call A2A as a tool when you want LLM-driven branching.",
    preferredApproach: "HTTP Request node",
    preferredCode: `// n8n HTTP Request node config:
// Method: POST
// URL: ${A2A_ENDPOINT}
// Authentication: None
// Headers: Content-Type = application/json
// Body (JSON):
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        { "kind": "data", "data": { "skill": "get_trending_startups" } }
      ]
    }
  }
}

// Wire output to Set node to extract:
//   {{ $json.result.artifacts[0].parts[0].data.startups }}`,
    alternativeApproach: "AI Agent node with A2A as tool",
    alternativeCode: `// In n8n's AI Agent node, add a Custom Tool:
//   Name: gitdealflow_query
//   Description: "VC engineering signals."
//   Schema: { skill: string, args: object }
//   Code: HTTP request to ${A2A_ENDPOINT} with body templated from inputs.
// The agent will pick when to call it based on user message.`,
    whatToAsk: [
      "Cron trigger → HTTP node → email node = weekly digest, no code.",
      "Webhook trigger from your CRM → A2A lookup → enrich CRM record.",
      "AI Agent node decides when to query GitDealFlow vs SerpAPI.",
      "Discord trigger 'is /name trending?' → A2A → reply.",
    ],
    gotchas: [
      "n8n cloud has a default 30s HTTP timeout — our endpoint usually returns in <500ms but spike up the timeout for batch loops.",
      "If you template the JSON body, escape user input — n8n expressions don't auto-escape strings.",
    ],
    docsLinks: [
      { label: "n8n HTTP Request docs", url: "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "zapier",
    name: "Zapier",
    tagline: "Visual automation across 7,000+ apps",
    audience:
      "Non-engineers who want VC signals piped into their existing stack (Notion, Airtable, Gmail, Slack)",
    status: "custom-tool",
    description:
      "Zapier's Webhooks app POSTs JSON-RPC to our A2A endpoint with no code. Schedule trigger → Webhooks POST → Formatter (parse JSON) → Slack/Notion/Gmail. The path is uglier than n8n but Zapier reaches a much bigger surface of downstream tools — Notion databases, Google Sheets, HubSpot CRM.",
    preferredApproach: "Webhooks by Zapier (POST)",
    preferredCode: `// Zap config:
// 1. Trigger: Schedule by Zapier (every Monday 9am)
// 2. Action: Webhooks by Zapier → Custom Request
//    Method: POST
//    URL: ${A2A_ENDPOINT}
//    Data Pass-Through?: No
//    Data: (raw JSON)
//      {"jsonrpc":"2.0","id":1,"method":"message/send","params":{"message":{"role":"user","parts":[{"kind":"data","data":{"skill":"get_trending_startups"}}]}}}
//    Headers: Content-Type | application/json
//
// 3. Action: Formatter → Utilities → Pick from List
//    Input: {{step2.result.artifacts.0.parts.0.data.startups}}
//
// 4. Action: Slack → Send Channel Message (or Notion → Create Database Item, etc.)`,
    whatToAsk: [
      "Monday 9am Slack digest of top 5 trending.",
      "New row in Airtable 'watchlist' → A2A signal lookup → fill 'last_signal' column.",
      "Daily Notion page in your investing journal with the breakout of the day.",
      "Email me when a tracked sector has 5+ breakouts this week.",
    ],
    gotchas: [
      "Zapier's free plan caps Webhook calls and adds 15-min trigger delay — fine for digest use cases, painful for real-time. Upgrade to Starter ($30/mo) if you need <5min latency.",
      "Zapier truncates large JSON responses in its UI preview; the full payload is still passed downstream — trust the field paths, not what the visual builder shows.",
    ],
    docsLinks: [
      { label: "Zapier Webhooks docs", url: "https://help.zapier.com/hc/en-us/articles/8496326497549" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "autogen",
    name: "AutoGen",
    tagline: "Microsoft's multi-agent conversation framework",
    audience:
      "Researchers and enterprise builders running multi-agent debates and tool-use loops",
    status: "custom-tool",
    description:
      "AutoGen's FunctionTool wraps any Python callable. Wrap our A2A endpoint as a FunctionTool and any AssistantAgent in a GroupChat can pull live signals as part of a multi-agent debate ('the scout argues for inclusion, the contrarian argues against, the methodology agent cites SSRN').",
    installSnippet: `pip install autogen-agentchat autogen-ext requests`,
    preferredApproach: "FunctionTool wrapper",
    preferredCode: `from autogen_agentchat.agents import AssistantAgent
from autogen_ext.tools import FunctionTool
from autogen_ext.models.openai import OpenAIChatCompletionClient
import requests

A2A_URL = "${A2A_ENDPOINT}"

def gitdealflow_query(skill: str, args: dict | None = None) -> dict:
    """Call GitDealFlow A2A for VC engineering signals.

    skill: get_trending_startups | search_startups_by_sector |
           get_startup_signal | get_signals_summary | get_methodology
    """
    body = {
        "jsonrpc": "2.0", "id": 1,
        "method": "message/send",
        "params": {"message": {"role": "user", "parts": [
            {"kind": "data", "data": {"skill": skill, "args": args or {}}},
        ]}},
    }
    return requests.post(A2A_URL, json=body, timeout=15).json()

scout_tool = FunctionTool(gitdealflow_query, description="VC engineering signals.")

scout = AssistantAgent(
    name="scout",
    model_client=OpenAIChatCompletionClient(model="gpt-4o-mini"),
    tools=[scout_tool],
    system_message="You surface live engineering signals via gitdealflow_query.",
)`,
    whatToAsk: [
      "GroupChat: scout + contrarian + memo-writer debate the top breakout.",
      "Two-agent loop: planner asks scout for fintech trending, scout returns, planner picks top 3.",
      "Critic agent challenges scout's pick by asking for methodology citation.",
      "Reflection loop: scout proposes, critic checks, scout revises.",
    ],
    gotchas: [
      "AutoGen v0.4+ uses async tools — wrap requests with asyncio.to_thread or use aiohttp instead.",
      "GroupChat token cost compounds quickly; cap rounds with max_turns and have the scout summarize the A2A payload before passing it onward.",
    ],
    docsLinks: [
      { label: "AutoGen docs", url: "https://microsoft.github.io/autogen" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "semantic-kernel",
    name: "Semantic Kernel",
    tagline: "Microsoft's enterprise AI orchestration SDK",
    audience:
      "Enterprise .NET / Python builders who need governed agent workflows over corporate signals",
    status: "custom-tool",
    description:
      "Semantic Kernel registers our A2A endpoint as a native function/plugin so that any Kernel-driven agent (Microsoft 365 Copilot extension, Azure-hosted assistant, internal chatbot) can call GitDealFlow as a first-class tool. The SDK handles function-calling schema, prompt assembly, and orchestration; you supply a thin HTTP wrapper around the JSON-RPC POST and SK does the rest. Best fit when you already run Azure OpenAI and want VC engineering signals inside a governed Copilot stack.",
    preferredApproach: "C# native function (Kernel plugin)",
    preferredCode: `// dotnet add package Microsoft.SemanticKernel
using Microsoft.SemanticKernel;
using System.ComponentModel;

class GitDealFlowPlugin {
    private static readonly HttpClient _http = new();
    private const string A2A = "${A2A_ENDPOINT}";

    [KernelFunction, Description("Query GitDealFlow for startup engineering signals: trending, sector lookup, named startup, methodology, or scout receipts.")]
    public async Task<string> QueryAsync(
        [Description("One of: trending, sector, startup, methodology, receipts")] string skill,
        [Description("Optional args, e.g. sector slug or startup name")] Dictionary<string, object>? args = null) {

        var body = new {
            jsonrpc = "2.0", id = 1,
            method = "message/send",
            @params = new {
                message = new { role = "user", parts = new[] {
                    new { kind = "data", data = new { skill, args = args ?? new() } }
                }}
            }
        };
        var resp = await _http.PostAsJsonAsync(A2A, body);
        return await resp.Content.ReadAsStringAsync();
    }
}

var kernel = Kernel.CreateBuilder()
    // Use your Azure OpenAI deployment name (e.g. gpt-5, gpt-4.1, or whatever you've deployed)
    .AddAzureOpenAIChatCompletion("<your-deployment-name>", endpoint, apiKey)
    .Build();
kernel.Plugins.AddFromObject(new GitDealFlowPlugin());`,
    alternativeApproach: "Python — KernelFunction decorator",
    alternativeCode: `# pip install semantic-kernel
import semantic_kernel as sk
import requests
from semantic_kernel.functions import kernel_function

A2A = "${A2A_ENDPOINT}"

class GitDealFlowPlugin:
    @kernel_function(description="Query GitDealFlow A2A for VC engineering signals.")
    def query(self, skill: str, args: dict = None) -> str:
        body = {"jsonrpc":"2.0","id":1,"method":"message/send",
                "params":{"message":{"role":"user","parts":[
                    {"kind":"data","data":{"skill": skill, "args": args or {}}}
                ]}}}
        return str(requests.post(A2A, json=body, timeout=15).json())

kernel = sk.Kernel()
kernel.add_plugin(GitDealFlowPlugin(), plugin_name="gitdealflow")`,
    whatToAsk: [
      "Add VC signal lookup to a Microsoft 365 Copilot extension for the deal team.",
      "Surface trending startups inside an internal Azure-hosted agent with audit logging.",
      "Run a planner that asks GitDealFlow for fintech trending, then writes a memo via your default model.",
      "Chain SK function-calling: classify user intent → call GitDealFlow → format response in corporate template.",
      "Plug into a Teams bot so analysts can /signal Roboflow without leaving chat.",
    ],
    gotchas: [
      "SK's auto-function-invocation requires planner mode (`FunctionChoiceBehavior.Auto()` in C#). Manual invoke works without it but skips the LLM picking the tool.",
      "Azure OpenAI's tool-call response format differs slightly from OpenAI's — SK abstracts this but expect occasional schema drift on minor SDK versions.",
      "Compliance: our A2A endpoint is no-auth public — fine for read-only signal lookups but log-everything if you wire into an audited Copilot stack.",
    ],
    docsLinks: [
      { label: "Semantic Kernel docs", url: "https://learn.microsoft.com/en-us/semantic-kernel/" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "inkeep",
    name: "Inkeep",
    tagline: "AI search and copilots for product docs",
    audience:
      "Developer-tools companies that want their docs copilot to know about competitive engineering signals",
    status: "custom-tool",
    description:
      "Inkeep ingests your docs, support tickets, and forums into a retrieval-augmented chat experience embedded in your product. Add GitDealFlow as a custom tool source so that questions like 'who's competing with us in fintech right now?' or 'what's the engineering velocity of {competitor}?' get answered with live signals alongside your own knowledge. Most useful for dev-tools companies whose users are evaluating competitors mid-conversation.",
    preferredApproach: "Custom Tool via Inkeep Tools API",
    preferredCode: `// Inkeep Tools registration (admin dashboard or API)
// 1. Create a new Tool in your Inkeep project:
{
  "name": "gitdealflow_signal",
  "description": "Query GitDealFlow for VC engineering signals on startups (trending, sector, named lookup, methodology). Use when the user asks about competitive engineering activity, breakout startups, or commit velocity comparisons.",
  "type": "http",
  "method": "POST",
  "url": "${A2A_ENDPOINT}",
  "headers": {"Content-Type": "application/json"},
  "bodyTemplate": {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "parts": [
          {"kind": "data", "data": {"skill": "{{skill}}", "args": "{{args}}"}}
        ]
      }
    }
  },
  "parameters": [
    {"name": "skill", "type": "string", "enum": ["trending", "sector", "startup", "methodology", "receipts"]},
    {"name": "args", "type": "object"}
  ]
}

// 2. Pin the tool to your AI assistant's allowed tools.
// 3. Set the system prompt to invoke gitdealflow_signal whenever a user asks about a competitor's engineering activity.`,
    whatToAsk: [
      "Inside your Inkeep widget: 'Which startups in dev-tools have breakout engineering velocity this quarter?'",
      "Mid-docs question: 'Compare commit velocity for our top three competitors and show methodology.'",
      "Support flow: agent asks AI 'is {prospect company} actually shipping fast right now?' before quoting a custom plan.",
      "Sales enablement: pre-call brief generator pulls our trending list for the prospect's sector.",
      "Ask 'cite the GitDealFlow methodology paper' to drop SSRN credibility into a doc-anchored chat.",
    ],
    gotchas: [
      "Inkeep's tool-calling cost is billed per LLM token — keep the tool description tight to avoid response bloat.",
      "Our A2A skill enum is fixed (5 skills); don't paraphrase in the tool spec or the LLM may invent invalid skills.",
      "If your Inkeep deployment is private (single-customer), the public A2A endpoint is still safe to call — it's read-only and rate-limited.",
    ],
    docsLinks: [
      { label: "Inkeep Tools docs", url: "https://docs.inkeep.com/" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "mistral-le-chat",
    name: "Mistral Le Chat",
    tagline: "Mistral's flagship AI assistant with custom Agents",
    audience:
      "Developer-investors who run Mistral as their primary assistant and want a dedicated VC signal Agent",
    status: "custom-tool",
    description:
      "Le Chat's Agents feature lets you create a custom AI assistant with a system prompt, attached tools, and saved context. Wire GitDealFlow as a tool via the function-calling JSON schema so a 'VC Scout' agent inside Le Chat can answer 'what's trending in fintech?' with live data instead of training-data guesses. Best fit when your team standardized on Mistral for sovereignty / EU-data-residency reasons.",
    preferredApproach: "Le Chat Agent with function-calling tool",
    preferredCode: `// In Le Chat → Agents → New Agent
// System prompt (paste this):
You are VC Scout, a deal-flow analyst for early-stage venture investors.
When the user asks about a startup, trending sector, or engineering velocity,
call gitdealflow_query with the appropriate skill. Cite signals.gitdealflow.com.

// Tool schema (JSON):
{
  "type": "function",
  "function": {
    "name": "gitdealflow_query",
    "description": "Query GitDealFlow A2A for VC engineering signals: trending startups, sector signals, named startup lookup, methodology, scout receipts.",
    "parameters": {
      "type": "object",
      "properties": {
        "skill": {
          "type": "string",
          "enum": ["get_trending_startups", "search_startups_by_sector", "get_startup_signal", "get_methodology", "get_scout_receipts"]
        },
        "args": {"type": "object"}
      },
      "required": ["skill"]
    }
  }
}

// Tool handler (Le Chat agent runtime config):
//   POST ${A2A_ENDPOINT}
//   body: { jsonrpc: "2.0", id: 1, method: "message/send",
//           params: { message: { role: "user", parts: [{kind:"data", data:{skill,args}}] }}}`,
    alternativeApproach: "Python — mistralai SDK with tool_choice",
    alternativeCode: `# pip install mistralai
from mistralai import Mistral
import os, requests

client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])
A2A = "${A2A_ENDPOINT}"

def gitdealflow_query(skill: str, args: dict | None = None):
    body = {"jsonrpc":"2.0","id":1,"method":"message/send",
            "params":{"message":{"role":"user","parts":[
                {"kind":"data","data":{"skill": skill, "args": args or {}}}
            ]}}}
    return requests.post(A2A, json=body, timeout=15).json()

resp = client.chat.complete(
    model="mistral-large-latest",
    messages=[{"role":"user","content":"What's trending in fintech?"}],
    tools=[{"type":"function","function":{"name":"gitdealflow_query","parameters":{"type":"object","properties":{"skill":{"type":"string"},"args":{"type":"object"}},"required":["skill"]}}}],
)
# loop the tool_calls and feed results back, standard mistralai pattern`,
    whatToAsk: [
      "VC Scout: 'who's accelerating in fintech this week?'",
      "Le Chat conversation: 'compare Roboflow and Modular on commit velocity.'",
      "Daily standup: agent posts the top 3 breakouts to a Mistral Workspace canvas every Monday.",
      "Cite the methodology paper for a deal memo (SSRN preprint).",
      "Custom workflow: 'find ai-ml startups with breakout signals' → 'summarize each in 2 sentences for our Slack.'",
    ],
    gotchas: [
      "Le Chat Agents UI doesn't let you upload a custom OpenAPI spec — define the tool inline in the agent config.",
      "Mistral's function-calling parameter validation is stricter than OpenAI's — mismatched schemas silently fail (no tool call). Mirror our skill enum exactly.",
      "EU-data-residency users: GitDealFlow's A2A endpoint is hosted on Vercel global edge; outbound calls leave EU. Document this in your governance review.",
    ],
    docsLinks: [
      { label: "Mistral Le Chat Agents docs", url: "https://docs.mistral.ai/capabilities/agents/" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "voiceflow",
    name: "Voiceflow",
    tagline: "Conversational AI design + agent platform",
    audience:
      "Builders shipping voice + chat agents for customer-facing surfaces who want VC signal lookups inside the flow",
    status: "custom-tool",
    description:
      "Voiceflow's Knowledge Base + API Step lets you wire any HTTP endpoint into a conversation flow. Add GitDealFlow as a Function or API Block so a Voiceflow-powered support agent, sales assistant, or onboarding bot can surface live engineering signals when a user asks about a competitor or trending startup. Best fit for teams already shipping branded conversational AI on web/IVR/Slack who want to enrich their bot's knowledge with live alt-data without retraining.",
    preferredApproach: "API Block (in-flow HTTP call)",
    preferredCode: `// Voiceflow Designer → API Block configuration
// Method: POST
// URL: ${A2A_ENDPOINT}
// Headers: Content-Type | application/json
// Body (raw JSON):
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {"kind": "data", "data": {"skill": "{skill}", "args": "{args}"}}
      ]
    }
  }
}

// Variables:
//   {skill} — pulled from intent slot (one of: trending, sector, startup, methodology, receipts)
//   {args}  — pulled from entity slot (sector slug or startup name)
//
// Capture response into {gitdealflow_response}, then route to:
//   - Speak/Send Text Block: "{gitdealflow_response.artifacts[0].parts[0].data.startups[0].name} is up {...}"
//   - Carousel Block: visual cards for each startup result`,
    alternativeApproach: "Voiceflow Functions (server-side handler)",
    alternativeCode: `// In Voiceflow Project Settings → Functions → New Function
// Function definition (JavaScript):
async function gitdealflow_query(args) {
  const body = {
    jsonrpc: "2.0", id: 1,
    method: "message/send",
    params: {
      message: {
        role: "user",
        parts: [{kind: "data", data: {skill: args.skill, args: args.args || {}}}]
      }
    }
  };
  const res = await fetch("${A2A_ENDPOINT}", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  });
  return await res.json();
}

// Then in your flow → Function Block → call gitdealflow_query with input mapping`,
    whatToAsk: [
      "Voice agent on a sales line: 'Tell me what's trending in fintech right now.'",
      "Slack support bot: '/signal Roboflow' → returns live commit-velocity context.",
      "Embedded web widget on a VC firm's site: 'Which dev-tools companies are accelerating this quarter?'",
      "Onboarding bot for a portfolio analytics product: prefills a watchlist with our top 5 trending each session.",
      "IVR fallback: agent says 'I'll pull the latest signal' → calls A2A → reads back top 3 names.",
    ],
    gotchas: [
      "Voiceflow API Blocks have a 30-second timeout — our A2A typically responds in <2s but cold-start can hit 5-10s; keep request volume reasonable.",
      "If you embed in a voice agent, add a Speak Block that says 'one moment, pulling live data' before the API Block — UX without it feels like dead air.",
      "Voiceflow's flow versioning treats Function code as project-scoped; if you fork the project, refactor Functions to a shared module so updates propagate.",
    ],
    docsLinks: [
      { label: "Voiceflow API Block docs", url: "https://docs.voiceflow.com/" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
  {
    slug: "botpress",
    name: "Botpress",
    tagline: "Open-source conversational AI platform",
    audience:
      "Open-source-minded builders running self-hosted chatbots for portfolio companies, internal sales agents, or community Discord bots",
    status: "custom-tool",
    description:
      "Botpress lets you write Hooks (TypeScript snippets) that intercept conversation events and call external APIs. Wire GitDealFlow as a Hook so your Botpress chatbot can fetch live engineering signals inside any flow — answering 'what's trending in AI/ML?' or 'compare commit velocity for these two startups' with real data. Best fit for self-hosted Botpress deployments (Cloud or community edition) where you control the runtime.",
    preferredApproach: "Botpress Hook (TypeScript)",
    preferredCode: `// In Botpress Studio → Code → Hooks → After Incoming Message
// (or use a Card Action / Trigger as appropriate)

import axios from 'axios';

const A2A = '${A2A_ENDPOINT}';

interface QueryArgs {
  skill: 'trending' | 'sector' | 'startup' | 'methodology' | 'receipts';
  args?: Record<string, unknown>;
}

export async function gitdealflowQuery({ skill, args }: QueryArgs) {
  const body = {
    jsonrpc: '2.0',
    id: 1,
    method: 'message/send',
    params: {
      message: {
        role: 'user',
        parts: [{ kind: 'data', data: { skill, args: args ?? {} } }]
      }
    }
  };
  const { data } = await axios.post(A2A, body, { timeout: 15000 });
  return data;
}

// Then call it from a Card or Action:
//   const result = await gitdealflowQuery({ skill: 'trending' });
//   bp.events.replyToEvent(event, [{ type: 'text', text: \`Top: \${result.artifacts[0].parts[0].data.startups[0].name}\` }]);`,
    alternativeApproach: "Botpress Action (Card-driven, no-code-ish)",
    alternativeCode: `// In Studio → Actions → New Action → \"GitDealFlow Lookup\"
// Set inputs: skill (string), args (object)
// Set HTTP method: POST
// URL: ${A2A_ENDPOINT}
// Body template:
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [{"kind": "data", "data": {"skill": "{{skill}}", "args": {{args}}}}]
    }
  }
}

// Use the Action inside any flow's Card → tested via the simulator before publishing`,
    whatToAsk: [
      "Discord community bot: '!signal fintech' → posts top 5 trending in channel.",
      "Self-hosted internal sales bot: AE asks 'what's accelerating that we should be tracking?' before a call.",
      "Portfolio company chatbot: founder asks 'show me startups in our space' → competitive scan.",
      "Telegram group bot for an angel syndicate: weekly digest of breakouts auto-pinned.",
      "WhatsApp Business agent: 'tell me about Roboflow' → returns live signal + methodology citation.",
    ],
    gotchas: [
      "Botpress Cloud has rate-limited outbound HTTP; the community edition (self-hosted) doesn't, but cache responses if your bot has heavy concurrency.",
      "If the bot is multi-tenant (running for many portfolio companies), respect our public rate limit — a single shared API key would burn through it; cache or stagger calls.",
      "Botpress's older v12 syntax differs from Cloud/v13 — the Hook above targets v13+; older deployments need adapting (use the legacy `bp.http` helpers).",
    ],
    docsLinks: [
      { label: "Botpress Hooks docs", url: "https://botpress.com/docs/" },
      { label: "Our AgentCard", url: AGENT_CARD_URL },
    ],
  },
];

export function getFramework(slug: string): A2AFramework | undefined {
  return A2A_FRAMEWORKS.find((f) => f.slug === slug);
}

export function getAllFrameworkSlugs(): string[] {
  return A2A_FRAMEWORKS.map((f) => f.slug);
}
