# Tier 2 — Framework PR / cookbook drafts

These are PRs into upstream open-source repos to seed GitDealFlow as a reference example. They're high-DA backlinks AND they put us in front of the dev-investor audience that uses these frameworks.

**All require user review + push** because they include runnable code in your name (`kindrat86`). Drafts below; user runs `gh pr create` once happy.

---

## 1. OpenAI Cookbook — investor research notebook

**Target repo:** `openai/openai-cookbook`
**Path:** `examples/agents-sdk/vc_deal_flow_signal_research.ipynb`
**Why:** Cookbook has 60k+ stars; sits at the top of any GPT-5 / agent search; merges from third parties happen weekly.

**PR title:** `Add: Investor research example using GitDealFlow MCP server`

**PR body:**
> This notebook shows how to build a small investor-research agent using the OpenAI Agents SDK and a public, no-auth MCP server (`@gitdealflow/mcp-signal`). The agent answers questions like "what AI/ML startups are accelerating fastest right now?" by calling read-only tools that return GitHub-derived engineering momentum signals across ~400 venture-backed startups.
>
> The example is fully runnable end-to-end — the MCP server is public, no API keys, the only paid dependency is OpenAI itself.
>
> Closes none — this is a new contribution under `examples/agents-sdk/`.

**Notebook outline** (12 cells):
1. Install: `openai-agents`, `mcp`, `@gitdealflow/mcp-signal`
2. Setup: import + load OPENAI_API_KEY
3. Define MCP server config (stdio via npx)
4. Create Agent with model=gpt-5, tools=mcp_server
5. Run query: "What are the top 5 AI/ML startups by commit-velocity acceleration this month?"
6. Show the agent's tool calls + the final answer
7. Run query: "Compare engineering momentum at Anthropic, OpenAI, and Cohere"
8. Show structured output
9. Run query: "Find dark horses in fintech with breakout signals but no public press coverage"
10. Note on caching, telemetry opt-out (`GITDEALFLOW_MCP_TELEMETRY=0`)
11. Reference: methodology link + SSRN paper id 6606558
12. Citation block

**Action:** Build the notebook locally at `marketing/llm-marketplaces/openai-cookbook-vcdealflow.ipynb`, test, then `gh repo fork openai/openai-cookbook && cd ... && gh pr create`.

**Risk:** OpenAI cookbook reviewers can be slow + selective. Notebook quality matters. Worth iterating before pushing.

---

## 2. Anthropic Cookbook — same idea, Claude + MCP

**Target repo:** `anthropics/anthropic-cookbook`
**Path:** `examples/mcp/vc_deal_flow_signal.ipynb` or `examples/agents/vc_deal_flow_signal.ipynb`
**Why:** Anthropic cookbook is the canonical reference for Claude + MCP examples.

**PR title:** `Add: VC deal flow research agent using public MCP server`

Notebook structure mirrors the OpenAI one but uses `claude-opus-4-7` and the official MCP Python SDK.

**Action:** Same flow — build, test, fork, PR.

---

## 3. Vercel AI SDK examples

**Target repo:** `vercel/ai`
**Path:** `examples/next-mcp/` (or `examples/next-openai/` if MCP example dir doesn't exist)
**Why:** AI SDK is the most-installed agent SDK on npm; example dir is a star magnet; targets dev-investor audience directly.

**Example shape:** A 60-line Next.js Route Handler that uses AI SDK's `streamText` + the GitDealFlow MCP server via the experimental MCP transport. Returns a streaming research response.

**PR title:** `feat(examples): add vc-deal-flow-signal MCP example`

**Action:** Build minimal `app/api/research/route.ts` example, test locally, fork + PR.

---

## 4. CrewAI Tools

**Target repo:** `crewAIInc/crewAI-tools`
**Path:** `crewai_tools/tools/gitdealflow_tool.py`
**Why:** CrewAI has its own Tools registry. Adding a first-class Tool means CrewAI users can `from crewai_tools import GitDealFlowTool`.

**Tool shape:**
```python
from crewai_tools import BaseTool
import httpx

class GitDealFlowTool(BaseTool):
    name = "GitDealFlow Engineering Signal"
    description = "Look up GitHub-derived engineering acceleration signals for venture-backed startups."

    def _run(self, query: str) -> str:
        # Smart-route to the appropriate GitDealFlow API endpoint
        ...
```

**PR title:** `feat: add GitDealFlowTool for VC deal flow research`

---

## 5. AutoGen / DSPy / Pydantic AI / LlamaHub — quick PRs

Lower priority. Each is one example file + a short README. Do these in a single batched session after the higher-priority ones land.

| Repo | Path | Format |
|---|---|---|
| `microsoft/autogen` | `python/samples/agentchat_examples/vc_deal_flow.py` | Python script |
| `stanfordnlp/dspy` | `examples/integrations/gitdealflow.py` | Python module + signature |
| `pydantic/pydantic-ai` | `examples/pydantic_ai_examples/vc_deal_flow.py` | Python script |
| `run-llama/llama_index` | `llama-index-integrations/tools/llama-index-tools-gitdealflow/` | Tool spec (already drafted in `distribution/agent-registries-2026-04-26.md`) |

---

## Anti-patterns to avoid

- **No corporate fluff in PR titles.** Reviewers reject "promotional" PRs. Lead with what the example *does*, not who built it.
- **No tracking pixels in cookbook code.** OPT-OUT telemetry only.
- **No secrets in the notebook.** Public APIs, no API keys.
- **Test before pushing.** A failed CI on a cookbook PR is a faster-no than a slow-yes.

---

## Watcher coverage

Add each PR's URL to `tools/llm-marketplaces-watcher/tracks.json` as a `github_pr` track once filed. The existing watcher already supports `github_issue` — needs a small extension to handle `github_pr` (state can be `open|closed|merged`). I'll add that when first PR is filed.
