/**
 * Data backing the /for-{framework} programmatic pages.
 *
 * Distinct from /a2a/{framework}: those pages are wire-it-up technical
 * how-tos. /for-{framework} pages are positioned for the builder/investor
 * crossover: "you build with X, here's why GitDealFlow signals make your
 * agent worth running." Long-tail captures queries like
 * "vc signals for langchain", "alt-data for crewai agents",
 * "deal-flow agent in vercel ai sdk", etc.
 */

export interface FrameworkPositioning {
  slug: string;
  /** Display name for the framework. */
  name: string;
  /** URL-safe label used in copy, lower-cased. */
  shortName: string;
  /** One-line audience hook for the H1 subhead. */
  hook: string;
  /** Two-paragraph positioning narrative for the dev-investor reader. */
  narrative: string[];
  /** What "shipping with X" looks like once you wire GitDealFlow in. */
  outcomes: { title: string; detail: string }[];
  /** A complete starter agent — copy, paste, run. Different framing from /a2a. */
  starterCode: { title: string; lang: string; code: string };
  /** A second snippet showing one production-shaped pattern. */
  productionCode: { title: string; lang: string; code: string };
  /** Five concrete example prompts the agent can answer once wired. */
  examplePrompts: string[];
  /** Three FAQ entries shaped for AEO/AIO snippet harvesting. */
  faqs: { q: string; a: string }[];
  /** Framework-specific gotchas. */
  gotchas: string[];
  /** External docs links (label + url). */
  docsLinks: { label: string; url: string }[];
  /** Cross-link slug for the matching /a2a page when one exists. */
  a2aSlug?: string;
}

const A2A = "https://signals.gitdealflow.com/api/a2a";
const MCP_NPM = "@gitdealflow/mcp-signal";

export const FRAMEWORKS: FrameworkPositioning[] = [
  {
    slug: "langchain",
    name: "LangChain",
    shortName: "LangChain",
    hook: "Wire VC engineering signals into any LangChain agent in 20 lines of Python.",
    narrative: [
      "If you ship LangChain agents and you also write angel checks, you sit in the rarest segment of the deal-flow market. The default playbook — Crunchbase Pro, PitchBook, hand-rolled scrapers — is built for analysts, not for builders. None of it is callable from your agent loop. None of it knows what Series A milestone a 14-day commit-velocity spike actually predicts. The data was never designed to flow through an LLM.",
      "GitDealFlow signals are. The corpus is 140 venture-backed startups across 15 sectors, refreshed weekly, ranked by the kind of GitHub momentum that historically precedes fundraises by three to six weeks. The MCP server and the public A2A endpoint expose the same five skills your LangChain ReAct loop needs: trending, sector slice, named-startup lookup, dataset summary, methodology citation. Drop the tool in, point your agent at OpenAI or Anthropic, and you're shipping deal-flow conviction by Sunday.",
    ],
    outcomes: [
      {
        title: "ReAct loops that cite SSRN",
        detail:
          "When the analyst agent picks a startup, it can demand the methodology paper for the deal memo. get_methodology returns the same SSRN-anchored text every time, so citation lines are stable across reruns.",
      },
      {
        title: "Multi-tool chains without paid APIs",
        detail:
          "Compose with web search, Crunchbase free-tier, GitHub REST, and a memo-writer LLM call. GitDealFlow contributes the 'is this team actually shipping' signal that no other free source surfaces.",
      },
      {
        title: "LangGraph state machines",
        detail:
          "The five skills are stateless and idempotent — drop them into a LangGraph node and they replay safely on retry. Same response for the same args inside a refresh window.",
      },
      {
        title: "MCP-native if you already moved",
        detail:
          "If you're on langchain-mcp-adapters, our published @gitdealflow/mcp-signal package works as a drop-in MCP server. Same tools, stdio transport, no auth.",
      },
    ],
    starterCode: {
      title: "Minimal LangChain agent (Python)",
      lang: "python",
      code: `# pip install langchain langchain-openai langchain-core requests
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
import requests

A2A = "${A2A}"

@tool
def gitdealflow(skill: str, args: dict | None = None) -> dict:
    """Live VC engineering signals from GitDealFlow.

    skill: get_trending_startups | search_startups_by_sector |
           get_startup_signal | get_signals_summary | get_methodology
    args:  skill-specific dict (e.g. {"sector": "ai-ml"})
    """
    body = {
        "jsonrpc": "2.0", "id": 1,
        "method": "message/send",
        "params": {"message": {"role": "user", "parts": [
            {"kind": "data", "data": {"skill": skill, "args": args or {}}},
        ]}},
    }
    return requests.post(A2A, json=body, timeout=15).json()

agent = create_react_agent(
    ChatOpenAI(model="gpt-5.4"),
    tools=[gitdealflow],
)

result = agent.invoke({
    "messages": [("user", "Who's accelerating in fintech this week? Cite methodology.")]
})
print(result["messages"][-1].content)`,
    },
    productionCode: {
      title: "LangGraph deal-memo pipeline",
      lang: "python",
      code: `# Two-node graph: scout pulls signals, analyst writes a memo.
from langgraph.graph import StateGraph, END
from typing import TypedDict
import requests

A2A = "${A2A}"

class State(TypedDict):
    sector: str
    signals: list
    memo: str

def scout(state: State) -> State:
    body = {"jsonrpc":"2.0","id":1,"method":"message/send",
            "params":{"message":{"role":"user","parts":[
                {"kind":"data","data":{
                    "skill":"search_startups_by_sector",
                    "args":{"sector": state["sector"]}
                }},
            ]}}}
    data = requests.post(A2A, json=body, timeout=15).json()
    return {"signals": data["result"]["artifacts"][0]["parts"][0]["data"]["startups"][:5]}

def analyst(state: State) -> State:
    # ...your LLM-call here, given state["signals"]...
    return {"memo": f"Top 5 in {state['sector']}: " + ", ".join(s["name"] for s in state["signals"])}

graph = StateGraph(State)
graph.add_node("scout", scout)
graph.add_node("analyst", analyst)
graph.set_entry_point("scout")
graph.add_edge("scout", "analyst")
graph.add_edge("analyst", END)

app = graph.compile()
out = app.invoke({"sector": "ai-ml"})
print(out["memo"])`,
    },
    examplePrompts: [
      "Who is trending in fintech this week? Cite the methodology.",
      "Compare commit velocity for Roboflow and Modular — which is shipping faster?",
      "Show me ai-ml startups with breakout signals; rank by contributor delta.",
      "What does engineering acceleration mean — is it the same as Y Combinator?",
      "Summarize the dataset: how many sectors, how many startups, how fresh.",
    ],
    faqs: [
      {
        q: "How is this different from giving LangChain a Crunchbase API tool?",
        a: "Crunchbase Pro is $20K/yr and surfaces post-fact data — funding announcements, headcount changes, press. GitDealFlow surfaces leading indicators: commit velocity changes, contributor growth, infrastructure buildout, all from public GitHub. The two are complementary; GitDealFlow gets you to the deal three to six weeks before Crunchbase has the round announced.",
      },
      {
        q: "Does the LangChain tool work with Anthropic Claude as well?",
        a: "Yes. The tool is model-agnostic — it's a plain Python callable wrapped by @tool. It works with ChatOpenAI, ChatAnthropic, ChatVertexAI, ChatBedrock, or any LangChain chat model. The tool calling format is normalized by LangChain before the model sees it.",
      },
      {
        q: "Is there a rate limit?",
        a: "The public A2A endpoint has no application-layer rate limit, but the upstream CDN may briefly throttle bursts above ~100 req/sec from a single IP. For batch enrichment loops, add a 100ms sleep or use the dataset.jsonl bulk endpoint instead. The dataset is updated weekly, so caching for a few hours is safe.",
      },
    ],
    gotchas: [
      "create_react_agent occasionally calls tools with malformed args. Validate `skill` against the enum before forwarding the request.",
      "Sector slugs are normalized (crypto → web3, AI → ai-ml). Pass user free-text through search_startups_by_sector and let the endpoint resolve.",
      "If you stream tokens, fetch the tool result in a separate node so the model sees structured data, not a half-streamed JSON string.",
    ],
    docsLinks: [
      { label: "LangChain Tools concept", url: "https://python.langchain.com/docs/concepts/tools/" },
      { label: "LangGraph agents", url: "https://langchain-ai.github.io/langgraph/" },
      { label: "langchain-mcp-adapters", url: "https://github.com/langchain-ai/langchain-mcp-adapters" },
    ],
    a2aSlug: "langchain",
  },
  {
    slug: "crewai",
    name: "CrewAI",
    shortName: "CrewAI",
    hook: "Build a role-based VC scouting crew where the scout, analyst, and skeptic share live engineering signals.",
    narrative: [
      "CrewAI's core unit is the role: a scout who finds, an analyst who writes, a skeptic who pokes holes. The pattern fits venture work better than any other agent framework — diligence is exactly that conversation. The missing piece is data. Without it, the scout is hallucinating company names from training-data fragments and the skeptic is correcting them.",
      "Plug GitDealFlow's A2A endpoint in as a single BaseTool and the scout becomes credible. Now it's pulling 140 real startups, ranked by 14-day commit velocity, with an SSRN-anchored methodology the skeptic can cite back. Run the crew on a Monday cron and your weekly deal-flow review writes itself: who's accelerating, who's stalling, who deserves a partner check-in.",
    ],
    outcomes: [
      {
        title: "Scout / analyst / skeptic crew",
        detail:
          "Three agents, one tool, structured handoff. Scout pulls top 20 trending. Analyst drafts a 1-pager on the top result. Skeptic challenges the pick by demanding the methodology citation.",
      },
      {
        title: "Sector-scoped weekly digests",
        detail:
          "Daily/weekly Process schedules let CrewAI run unattended. Pipe the result into Slack, Notion, Linear — anywhere the team already lives.",
      },
      {
        title: "Compositional with other paid sources",
        detail:
          "Crews chain tools cleanly. Add SerpAPI for press, the Crunchbase free tier for funding history, GitHub REST for repo facts. GitDealFlow contributes the velocity signal nothing else has.",
      },
      {
        title: "Verbose mode for prompt-engineering loops",
        detail:
          "Set verbose=True for the first run to see exactly which skill the agent picked, then strip it back for production. The five skills are tightly named so the LLM almost never picks wrong.",
      },
    ],
    starterCode: {
      title: "Three-agent VC scouting crew",
      lang: "python",
      code: `# pip install crewai crewai-tools requests
from crewai import Agent, Task, Crew, Process
from crewai_tools import BaseTool
import requests

A2A = "${A2A}"

class GitDealFlowTool(BaseTool):
    name: str = "gitdealflow"
    description: str = (
        "Live VC engineering signals. "
        "skill: get_trending_startups | search_startups_by_sector | "
        "get_startup_signal | get_signals_summary | get_methodology"
    )

    def _run(self, skill: str, args: dict | None = None) -> dict:
        body = {"jsonrpc":"2.0","id":1,"method":"message/send",
                "params":{"message":{"role":"user","parts":[
                    {"kind":"data","data":{"skill": skill, "args": args or {}}},
                ]}}}
        return requests.post(A2A, json=body, timeout=15).json()

tool = GitDealFlowTool()

scout = Agent(role="Scout",
              goal="Surface this week's most accelerated startups in fintech.",
              backstory="A relentless deal sourcer with a nose for breakouts.",
              tools=[tool])

analyst = Agent(role="Analyst",
                goal="Write a 1-page memo on the scout's top pick.",
                backstory="An ex-LP partner who writes diligence memos in their sleep.",
                tools=[tool])

skeptic = Agent(role="Skeptic",
                goal="Cite the methodology and challenge the analyst's conclusion.",
                backstory="A contrarian who demands evidence over narrative.",
                tools=[tool])

crew = Crew(
    agents=[scout, analyst, skeptic],
    tasks=[
        Task(description="Pull trending fintech this week.", agent=scout, expected_output="Top 5 with signal data."),
        Task(description="Memo on the top pick.", agent=analyst, expected_output="One-page deal memo."),
        Task(description="Cite methodology + push back.", agent=skeptic, expected_output="Two paragraph rebuttal."),
    ],
    process=Process.sequential,
    verbose=True,
)

print(crew.kickoff())`,
    },
    productionCode: {
      title: "Scheduled weekly digest with Pydantic args_schema",
      lang: "python",
      code: `from pydantic import BaseModel
from crewai_tools import BaseTool
from typing import Literal, Any
import requests, schedule, time

A2A = "${A2A}"

class GitDealFlowArgs(BaseModel):
    skill: Literal[
        "get_trending_startups", "search_startups_by_sector",
        "get_startup_signal", "get_signals_summary", "get_methodology",
    ]
    args: dict[str, Any] | None = None

class GitDealFlowTool(BaseTool):
    name: str = "gitdealflow"
    description: str = "Live VC engineering signals — strict typed args."
    args_schema: type[BaseModel] = GitDealFlowArgs

    def _run(self, skill: str, args: dict | None = None) -> dict:
        body = {"jsonrpc":"2.0","id":1,"method":"message/send",
                "params":{"message":{"role":"user","parts":[
                    {"kind":"data","data":{"skill": skill, "args": args or {}}},
                ]}}}
        return requests.post(A2A, json=body, timeout=15).json()

def run_weekly():
    # ...build crew, kickoff, post result to Slack...
    pass

schedule.every().monday.at("09:00").do(run_weekly)
while True:
    schedule.run_pending(); time.sleep(60)`,
    },
    examplePrompts: [
      "Scout: pull this week's top 20 trending and rank by my fintech focus.",
      "Analyst: draft a one-page memo on the top result with risks and the engineering signal.",
      "Skeptic: cite the SSRN methodology and challenge the scout's conclusion.",
      "Compose: scout → analyst → skeptic → email-drafter pipeline.",
      "Verifier: pull the dataset summary and confirm the data is fresh (<7 days old).",
    ],
    faqs: [
      {
        q: "How do I attach the GitDealFlow tool to multiple agents in a crew?",
        a: "Instantiate GitDealFlowTool() once and pass the same instance to every Agent that needs it via tools=[tool]. CrewAI handles concurrency safely — each agent's tool call is independent.",
      },
      {
        q: "Does CrewAI work with Anthropic and Mistral, not just OpenAI?",
        a: "Yes. CrewAI uses LiteLLM under the hood, which supports OpenAI, Anthropic, Mistral, Bedrock, Vertex, Cohere, and Ollama. Set the llm parameter on Agent (or LITELLM_PROVIDER env vars) — the GitDealFlow tool is unchanged.",
      },
      {
        q: "Can I use GitDealFlow with CrewAI Studio (the no-code UI)?",
        a: "Yes — CrewAI Studio supports Custom Tools via the Tool Builder. Paste the BaseTool class above into the code editor, save, and the tool becomes available to drag onto any agent in the visual flow.",
      },
    ],
    gotchas: [
      "CrewAI passes tool args as kwargs — declare _run signature explicitly or use a Pydantic args_schema.",
      "Crews default to verbose=False; turn on verbose=True the first run so you see exactly which skill the agent picked.",
      "Process.hierarchical lets a manager LLM delegate; for VC use cases, Process.sequential gives more predictable memo output.",
    ],
    docsLinks: [
      { label: "CrewAI tools docs", url: "https://docs.crewai.com/concepts/tools" },
      { label: "CrewAI Studio (no-code)", url: "https://docs.crewai.com/installation" },
      { label: "Our AgentCard", url: "https://signals.gitdealflow.com/.well-known/agent-card.json" },
    ],
    a2aSlug: "crewai",
  },
  {
    slug: "letta",
    name: "Letta",
    shortName: "Letta",
    hook: "Stateful VC analyst agents with persistent memory of every startup they've scouted.",
    narrative: [
      "Letta (formerly MemGPT) is the only mainstream agent framework where memory is a first-class primitive. For venture work, that maps perfectly: deal flow is fundamentally a longitudinal exercise — you watched this team six months ago, the signal was warm, you passed; now the signal is breakout and you want to remember why you hesitated. Stateless agents lose that thread on every restart.",
      "Wire GitDealFlow into a Letta agent and the agent's archival memory becomes a personal scouting database. Every startup it looks up gets remembered. Every methodology citation gets indexed. When you ask 'have I seen Roboflow before?', the agent can answer with the exact prior context, plus the live commit-velocity delta since you last looked. That's a VC analyst that compounds.",
    ],
    outcomes: [
      {
        title: "Persistent watchlist memory",
        detail:
          "Every startup the agent surfaces is written to archival memory automatically. Restart the server, the watchlist survives. Ask 'who have I been tracking?' and the agent recalls.",
      },
      {
        title: "Self-editing core memory",
        detail:
          "Letta agents can edit their own persona block. Start with 'I am a venture analyst' and after 50 conversations the agent has refined its own thesis prompt — 'I focus on dev-tools breakouts under 10 contributors.'",
      },
      {
        title: "Recall rather than re-fetch",
        detail:
          "Letta's RAG over conversation history means follow-ups don't burn tool calls. 'What did Modular's velocity look like last week?' hits memory, not the API. Faster, cheaper, and capture-able context.",
      },
      {
        title: "Server-mode for team agents",
        detail:
          "Run Letta server, expose REST endpoints for the team, every analyst hits the same shared agent with the same accumulated knowledge. The crew's deal flow IQ goes up over time.",
      },
    ],
    starterCode: {
      title: "Letta agent with GitDealFlow tool",
      lang: "python",
      code: `# pip install letta-client letta requests
# Run \`letta server\` first, then:
from letta_client import Letta
import requests

A2A = "${A2A}"

# Define the tool as a plain Python function. Letta uses the docstring
# and signature to auto-generate the JSON schema.
def gitdealflow_query(skill: str, args: dict = None) -> dict:
    """Live VC engineering signals from GitDealFlow.

    Args:
        skill (str): One of get_trending_startups, search_startups_by_sector,
                     get_startup_signal, get_signals_summary, get_methodology.
        args (dict): Skill-specific arguments (e.g. {"sector": "ai-ml"}).

    Returns:
        dict: JSON-RPC response with .result.artifacts[0].parts[0].data
              containing the structured payload.
    """
    body = {
        "jsonrpc": "2.0", "id": 1,
        "method": "message/send",
        "params": {"message": {"role": "user", "parts": [
            {"kind": "data", "data": {"skill": skill, "args": args or {}}},
        ]}},
    }
    return requests.post(A2A, json=body, timeout=15).json()

client = Letta(base_url="http://localhost:8283")

# Upload tool, then create a stateful agent that uses it
tool = client.tools.upsert_from_function(func=gitdealflow_query)

agent = client.agents.create(
    name="vc_scout",
    memory_blocks=[
        {"label": "persona", "value": "I am a VC analyst that tracks engineering acceleration across 140 startups. I remember every startup I've seen and refine my thesis over time."},
        {"label": "human", "value": "The user is an investor or dealmaker who writes angel checks but doesn't read code."},
    ],
    tool_ids=[tool.id],
    model="openai/gpt-5.4",
    embedding="openai/text-embedding-3-small",
)

response = client.agents.messages.create(
    agent_id=agent.id,
    messages=[{"role": "user", "content": "What's accelerating in fintech this week?"}],
)
print(response.messages[-1].content)`,
    },
    productionCode: {
      title: "Persistent scouting memory across sessions",
      lang: "python",
      code: `# Same agent, weeks later. The agent remembers prior context.
from letta_client import Letta

client = Letta(base_url="http://localhost:8283")

# Reuse the agent_id from the prior session.
agent_id = "agent-..."  # persisted in your DB

# Letta auto-recalls relevant archival entries. The agent will:
# 1. Surface that Roboflow was tracked 8 weeks ago at warm signal.
# 2. Re-query GitDealFlow for the *current* signal.
# 3. Compute the delta and reason about it in conversation.
response = client.agents.messages.create(
    agent_id=agent_id,
    messages=[{"role": "user", "content": "Has anything I tracked changed materially?"}],
)
print(response.messages[-1].content)

# Inspect the agent's accumulated archival memory.
archival = client.agents.archival_memory.list(agent_id=agent_id, limit=20)
for entry in archival:
    print(entry.text[:160])`,
    },
    examplePrompts: [
      "What's accelerating in fintech this week? Remember the names for next time.",
      "Has anything I tracked changed materially since last month?",
      "Show me my entire watchlist with the current commit velocity for each.",
      "Refine your persona block: focus on dev-tools breakouts under 10 contributors.",
      "Cite the SSRN methodology and store it in your archival memory for future reference.",
    ],
    faqs: [
      {
        q: "Does Letta have native MCP support?",
        a: "As of late 2025, Letta exposed an MCP-compatible interface for tool definitions, and the @gitdealflow/mcp-signal package can be wrapped in a Letta tool. The simplest path remains a plain Python function tool that hits the A2A endpoint — Letta's tool auto-generation reads the docstring and signature to build the schema for the LLM.",
      },
      {
        q: "Why use Letta over LangChain for VC scouting agents?",
        a: "Memory. LangChain agents are stateless by default; you have to bolt on a vector store and engineer the recall logic yourself. Letta agents have core memory + archival memory + recall memory built in, plus self-editing primitives. For a deal-flow agent that compounds knowledge over months, Letta is the path of least resistance.",
      },
      {
        q: "Can I run Letta server in production for a team?",
        a: "Yes — Letta ships a REST API server (`letta server`) that supports multi-user agent management, persistent storage (SQLite or Postgres), and authentication. Multiple analysts can share one VC-scout agent or fork into per-user agents that share archival memory.",
      },
    ],
    gotchas: [
      "Letta's archival memory grows over time; if you're cost-sensitive, set archival_memory_size limits in agent config or periodically prune via the API.",
      "Tool docstrings are the single source of truth for JSON schema — keep arg descriptions tight and accurate or the LLM picks wrong skills.",
      "Local-only mode (no server) works for prototyping but loses persistence across script restarts; run `letta server` for stateful agents.",
    ],
    docsLinks: [
      { label: "Letta docs", url: "https://docs.letta.com" },
      { label: "Letta on GitHub", url: "https://github.com/letta-ai/letta" },
      { label: "MemGPT paper (UC Berkeley)", url: "https://arxiv.org/abs/2310.08560" },
    ],
  },
  {
    slug: "mastra",
    name: "Mastra",
    shortName: "Mastra",
    hook: "Type-safe VC signal agents shipped alongside your Next.js app.",
    narrative: [
      "Mastra is the TypeScript agent framework you reach for when you already ship a Next.js or Hono app. It speaks the same Zod schemas, the same Vercel AI SDK primitives, the same edge-or-Node deployment story. That means deal-flow features can ship inside the same codebase as your portfolio dashboard, with the same type safety and the same deploy pipeline.",
      "Mastra's MCP support is first-class — drop the @gitdealflow/mcp-signal package into MCPClient and every Mastra agent in your project gets all five skills. The A2A fallback is pure fetch, edge-safe, no child processes — useful when you want a single Server Action to surface 'is this startup tracked?' for a logged-in user without spinning up a stdio server.",
    ],
    outcomes: [
      {
        title: "Inside Server Actions",
        detail:
          "A single async Server Action can chain 'lookup startup → write to portfolio DB → revalidate dashboard' in 30 lines. The Mastra agent handles the LLM-driven branching; your code stays declarative.",
      },
      {
        title: "Inside cron-triggered routes",
        detail:
          "Mastra workflows on Vercel Cron Jobs (or any cron runner) let you ship a Monday digest that pulls trending, summarizes via a small AI Gateway model, posts to Slack, and writes to Postgres — all in one TypeScript module.",
      },
      {
        title: "Inside multi-step agents with memory",
        detail:
          "Mastra's @mastra/memory gives you durable thread state. Pair it with GitDealFlow tools and your scout agent remembers which startups were already pitched into the Slack channel, avoiding repeats.",
      },
      {
        title: "Inside Hono API routes",
        detail:
          "Hono + Mastra is the lightest stack for a deal-flow API microservice. Deploy to Cloudflare Workers, Bun, or Vercel Functions — the same agent code runs everywhere.",
      },
    ],
    starterCode: {
      title: "Mastra agent with MCP transport",
      lang: "typescript",
      code: `// npm install @mastra/core @mastra/mcp zod
// Models route through the AI Gateway via plain string IDs.
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { MCPClient } from "@mastra/mcp";

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
  instructions:
    "You surface live engineering acceleration signals via the gitdealflow tools. " +
    "Always cite the methodology paper (SSRN abstract=6606558) when asked about the data.",
  model: "openai/gpt-5.4",
  tools,
});

export const mastra = new Mastra({
  agents: { scoutAgent },
});

// Use:
const reply = await scoutAgent.generate(
  "Who is trending in fintech this week?",
);
console.log(reply.text);`,
    },
    productionCode: {
      title: "Edge-safe Server Action with A2A fallback",
      lang: "typescript",
      code: `// app/api/scout/route.ts (Next.js App Router)
import { createTool } from "@mastra/core/tools";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";

export const runtime = "nodejs"; // not edge — fetch keep-alive matters

const A2A = "${A2A}";

const gitdealflow = createTool({
  id: "gitdealflow",
  description: "VC engineering signals: trending, sector, named lookup, methodology.",
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
    const r = await fetch(A2A, {
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
});

const agent = new Agent({
  name: "Scout",
  instructions: "Use gitdealflow tools to answer about engineering acceleration.",
  model: "openai/gpt-5.4",
  tools: { gitdealflow },
});

export async function POST(req: Request) {
  const { question } = await req.json();
  const out = await agent.generate(question);
  return Response.json({ reply: out.text });
}`,
    },
    examplePrompts: [
      "Inside a Server Component: pull weekly top 20 to seed your dashboard.",
      "Inside a Route Handler: surface 'is this startup tracked?' to logged-in users.",
      "Inside a Server Action: write a watchlist alert email when a tracked startup hits breakout.",
      "Inside a Mastra workflow: chain trending → memo-writer → email-sender steps.",
      "Inside a cron job: write a Monday digest to the team's Slack.",
    ],
    faqs: [
      {
        q: "Does Mastra MCPClient work in Vercel Edge runtime?",
        a: "No — MCPClient spawns a stdio child process and Edge runtime forbids subprocesses. Use the A2A fetch tool for edge routes; reserve MCPClient for Node.js routes (set `export const runtime = 'nodejs'`).",
      },
      {
        q: "How does Mastra compare to the raw Vercel AI SDK?",
        a: "The Vercel AI SDK gives you generateText / streamText / tool() primitives. Mastra layers structured agents, memory, workflows, and MCP on top. For a one-shot tool call, the AI SDK is enough. For multi-step agents with state, Mastra removes a lot of plumbing.",
      },
      {
        q: "Can I deploy Mastra agents on Cloudflare Workers?",
        a: "Yes — Mastra is runtime-agnostic. Workers requires the A2A fetch tool (not MCPClient stdio). The agent.generate() call is pure fetch + LLM API, fully Workers-compatible.",
      },
    ],
    gotchas: [
      "Mastra MCPClient holds long-lived stdio processes — call `await mcp.disconnect()` in serverless teardown to avoid orphaned children.",
      "If your edge runtime can't spawn child processes, use the A2A fetch tool — it's pure fetch, edge-safe.",
      "Mastra's memory store defaults to LibSQL; for multi-region deployments, swap to Postgres or Upstash Redis.",
    ],
    docsLinks: [
      { label: "Mastra docs", url: "https://mastra.ai/docs" },
      { label: "Mastra MCP integration", url: "https://mastra.ai/docs/agents/using-tools-and-mcp" },
      { label: "Our MCP package", url: `https://www.npmjs.com/package/${MCP_NPM}` },
    ],
    a2aSlug: "mastra",
  },
  {
    slug: "vercel-ai-sdk",
    name: "Vercel AI SDK",
    shortName: "Vercel AI SDK",
    hook: "Ship VC signal features inside your Next.js app — Server Components, Route Handlers, Server Actions.",
    narrative: [
      "The Vercel AI SDK is the default for AI features inside web apps. If you ship Next.js, the AI SDK is the path of least resistance from idea to production. generateText, streamText, and tool() compose with React Server Components, Route Handlers, Server Actions, and the AI Gateway out of the box.",
      "Drop GitDealFlow in as a single tool() with a Zod-validated input schema and your portfolio dashboard becomes deal-flow-aware. The MCP integration via experimental_createMCPClient gives you the same five skills with zero argument typing — useful for prototypes — but for production-shaped apps, the explicit tool() path is more debuggable and friendlier to TypeScript inference.",
    ],
    outcomes: [
      {
        title: "Server Component data fetch",
        detail:
          "Pull weekly top 20 inside a Server Component, render the table at request time. Cache with React's `cache()` helper or Next.js fetch cache; the dataset refreshes weekly so 6-hour TTL is safe.",
      },
      {
        title: "Streaming chat UI",
        detail:
          "useChat hook + streamText + tool() = a deal-flow chat panel that streams tokens, calls GitDealFlow, and renders structured tool results inline via the Generative UI pattern.",
      },
      {
        title: "AI Gateway with model routing",
        detail:
          "Route to OpenAI for fast queries and Anthropic for memo writing — same tool, no code change. The AI Gateway handles the model switch and the observability is unified.",
      },
      {
        title: "Background workflows with WDK",
        detail:
          "Vercel Workflow DevKit (WDK) makes long-running deal-flow batches durable. 'Enrich 50 startups overnight' survives crashes, retries automatically, and emails the result when done.",
      },
    ],
    starterCode: {
      title: "Tool() in a Route Handler",
      lang: "typescript",
      code: `// app/api/chat/route.ts (Next.js App Router)
// Models route through the Vercel AI Gateway via plain string IDs.
import { tool, streamText, convertToModelMessages, type UIMessage } from "ai";
import { z } from "zod";

export const runtime = "nodejs"; // tool fetch + LLM stream

const A2A = "${A2A}";

const gitdealflow = tool({
  description:
    "Live VC engineering signals — trending startups, sector watchlists, named-startup profiles, dataset summaries, methodology citation.",
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
  execute: async ({ skill, args }) => {
    const res = await fetch(A2A, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1, method: "message/send",
        params: { message: { role: "user", parts: [
          { kind: "data", data: { skill, args: args ?? {} } },
        ]}},
      }),
    });
    return (await res.json()).result.artifacts[0].parts[0].data;
  },
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: "openai/gpt-5.4",
    tools: { gitdealflow },
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}`,
    },
    productionCode: {
      title: "Server Component with cached weekly fetch",
      lang: "typescript",
      code: `// app/dashboard/trending/page.tsx
import { unstable_cache } from "next/cache";

const A2A = "${A2A}";

const fetchTrending = unstable_cache(
  async () => {
    const res = await fetch(A2A, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1, method: "message/send",
        params: { message: { role: "user", parts: [
          { kind: "data", data: { skill: "get_trending_startups" } },
        ]}},
      }),
    });
    return (await res.json()).result.artifacts[0].parts[0].data.startups;
  },
  ["gitdealflow-trending"],
  { revalidate: 21600, tags: ["gitdealflow"] }, // 6h
);

export default async function TrendingPage() {
  const startups = await fetchTrending();
  return (
    <main>
      <h1>Trending this week</h1>
      <ol>
        {startups.map((s: { name: string; sector: string }) => (
          <li key={s.name}>
            <strong>{s.name}</strong> — {s.sector}
          </li>
        ))}
      </ol>
    </main>
  );
}`,
    },
    examplePrompts: [
      "Pull weekly top 20 inside a Server Component to seed a dashboard.",
      "Stream a chat reply that calls gitdealflow when the user asks about a startup.",
      "Trigger from a Server Action: 'add this org to my watchlist'.",
      "Schedule a weekly Vercel Cron route that emails the top 5 breakouts.",
      "Compose with the AI Gateway: route fast lookups to a small model, memos to a large one.",
    ],
    faqs: [
      {
        q: "Does this work with the AI Gateway and BYOK?",
        a: "Yes. The AI Gateway sits transparently between your Vercel AI SDK code and any provider you're routed to. The gitdealflow tool() definition is unchanged — you can swap models freely or BYOK without touching the integration.",
      },
      {
        q: "Can I run the tool in Edge runtime?",
        a: "Yes — the A2A endpoint is just a fetch, edge-safe. The MCP path (experimental_createMCPClient with stdio transport) is Node-only because it spawns a subprocess. For Edge, stick with the explicit tool() definition.",
      },
      {
        q: "How does this fit with the Workflow DevKit (WDK)?",
        a: "WDK gives you durable, retryable steps. Wrap the gitdealflow fetch as a step.run() so a long batch — 'enrich 50 startups, write to Postgres, email when done' — survives crashes and retries 5xx automatically. The endpoint returns 200 with JSON-RPC error envelopes, so check `result` vs `error`, not HTTP status.",
      },
    ],
    gotchas: [
      "tool() expects you to return JSON-serializable data; the .data field on artifacts is already a plain object — passing it through is safe.",
      "If you use Edge runtime, the fetch to A2A should be on regular Node runtime since you may want to hold connections longer. Set `export const runtime = 'nodejs'`.",
      "The Vercel AI SDK's streamText pipes tool calls + tool results into the data stream — render them with the Generative UI pattern, not as plain text.",
    ],
    docsLinks: [
      { label: "Vercel AI SDK", url: "https://ai-sdk.dev" },
      { label: "AI SDK MCP integration", url: "https://ai-sdk.dev/docs/mcp" },
      { label: "Vercel AI Gateway", url: "https://vercel.com/docs/ai-gateway" },
    ],
    a2aSlug: "vercel-ai-sdk",
  },
];

export function getFrameworkPositioning(slug: string): FrameworkPositioning | undefined {
  return FRAMEWORKS.find((f) => f.slug === slug);
}

export function getAllForFrameworkSlugs(): string[] {
  return FRAMEWORKS.map((f) => f.slug);
}
