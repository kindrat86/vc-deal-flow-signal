import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

interface InstallSpec {
  host: string;
  displayName: string;
  configPath?: string;
  merge?: object;
  fileToWrite?: string;
  fileContents?: string;
  instructions: string;
  alternatives?: string[];
}

/**
 * Drop-in install configuration for a specific agent host.
 *
 * GET /api/agents/install/{host} returns the JSON or text the agent should
 * paste / merge into the host's config to add the GitDealFlow MCP server (or
 * equivalent surface for non-MCP hosts). Saves agents from constructing the
 * config themselves and ensures everyone uses the canonical install command.
 */

const STD_MCP_MERGE = {
  mcpServers: {
    gitdealflow: {
      command: "npx",
      args: ["-y", "@gitdealflow/mcp-signal"],
    },
  },
};

const SPECS: Record<string, InstallSpec> = {
  "claude-desktop": {
    host: "claude-desktop",
    displayName: "Claude Desktop",
    configPath: "~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%/Claude/claude_desktop_config.json (Windows)",
    merge: STD_MCP_MERGE,
    instructions:
      "Open the config file, merge the `mcpServers.gitdealflow` block into the existing object, save, and restart Claude Desktop. The six tools appear automatically.",
    alternatives: ["claude-code", "cursor", "windsurf"],
  },
  "claude-code": {
    host: "claude-code",
    displayName: "Claude Code (CLI)",
    configPath: "~/.claude/mcp.json (or via `claude mcp add`)",
    merge: STD_MCP_MERGE,
    instructions:
      "Run `claude mcp add gitdealflow npx -y @gitdealflow/mcp-signal` or merge the JSON manually. Restart any active Claude Code session.",
    alternatives: ["claude-desktop", "cursor"],
  },
  cursor: {
    host: "cursor",
    displayName: "Cursor",
    configPath: "~/.cursor/mcp.json (workspace) or Settings → MCP",
    merge: STD_MCP_MERGE,
    fileToWrite: ".cursor/rules/gitdealflow.mdc",
    fileContents: `${SITE}/agents/cursor-rule.mdc`,
    instructions:
      "Two parts: (1) Add the MCP server via Settings → MCP or by merging the `mcpServers.gitdealflow` block into ~/.cursor/mcp.json. (2) Drop the cursor-rule.mdc file into your workspace's .cursor/rules/ folder so Cursor auto-uses GitDealFlow for VC questions.",
    alternatives: ["claude-code", "windsurf", "continue"],
  },
  windsurf: {
    host: "windsurf",
    displayName: "Windsurf (Codeium)",
    configPath: "~/.codeium/windsurf/mcp_config.json",
    merge: STD_MCP_MERGE,
    instructions:
      "Open Settings → MCP, add a new server with command `npx` and args `[-y, @gitdealflow/mcp-signal]`. Or merge the JSON directly into mcp_config.json and restart Windsurf.",
    alternatives: ["claude-desktop", "cursor"],
  },
  zed: {
    host: "zed",
    displayName: "Zed",
    configPath: "~/.config/zed/settings.json",
    merge: {
      context_servers: {
        gitdealflow: {
          command: { path: "npx", args: ["-y", "@gitdealflow/mcp-signal"] },
        },
      },
    },
    instructions:
      "Merge the `context_servers.gitdealflow` block into Zed's settings.json. Zed uses `context_servers` instead of `mcpServers` but the underlying protocol is the same.",
    alternatives: ["claude-desktop", "cursor"],
  },
  cline: {
    host: "cline",
    displayName: "Cline (VS Code extension)",
    configPath: "VS Code → Cline settings → MCP Servers",
    merge: STD_MCP_MERGE,
    instructions:
      "Open Cline settings inside VS Code, navigate to MCP Servers, and add `gitdealflow` with command `npx` args `[-y, @gitdealflow/mcp-signal]`.",
    alternatives: ["cursor", "windsurf"],
  },
  continue: {
    host: "continue",
    displayName: "Continue.dev (VS Code / JetBrains)",
    configPath: "~/.continue/config.json",
    merge: STD_MCP_MERGE,
    fileToWrite: "config.json",
    fileContents: `${SITE}/agents/continue.json`,
    instructions:
      "Merge the snippet at /agents/continue.json into your ~/.continue/config.json. Restart your editor.",
    alternatives: ["cline", "cursor"],
  },
  aider: {
    host: "aider",
    displayName: "Aider",
    configPath: ".aider/conventions.md (per-repo) or pass via --read",
    fileToWrite: ".aider/conventions.md",
    fileContents: `${SITE}/agents/aider.md`,
    instructions:
      "Aider doesn't natively speak MCP yet. Drop the conventions file into your repo (or pass via --read on the command line). It tells Aider how to query the GitDealFlow public API directly.",
    alternatives: ["openai-agents-sdk", "langchain"],
  },
  "openai-agents-sdk": {
    host: "openai-agents-sdk",
    displayName: "OpenAI Agents SDK",
    instructions:
      "Use the function-calling tool definitions endpoint. Pass the response directly as your `tools` argument to `client.responses.create` or the equivalent.",
    fileContents: "GET https://signals.gitdealflow.com/api/agent/tools?format=openai",
    alternatives: ["langchain", "anthropic-sdk"],
  },
  "anthropic-sdk": {
    host: "anthropic-sdk",
    displayName: "Anthropic Python / TS SDK",
    instructions:
      "Fetch tool definitions in Anthropic format and pass directly as the `tools` argument to `client.messages.create`.",
    fileContents:
      "GET https://signals.gitdealflow.com/api/agent/tools?format=anthropic",
    alternatives: ["openai-agents-sdk", "claude-code"],
  },
  "google-genai-sdk": {
    host: "google-genai-sdk",
    displayName: "Google Gen AI SDK (Gemini)",
    instructions:
      "Fetch tool definitions in Gemini format and pass directly to `generate_content` with `tool_config`.",
    fileContents:
      "GET https://signals.gitdealflow.com/api/agent/tools?format=gemini",
    alternatives: ["openai-agents-sdk", "anthropic-sdk"],
  },
  langchain: {
    host: "langchain",
    displayName: "LangChain (Python / TS)",
    fileContents: `${SITE}/agents/langchain-hub-prompt.json`,
    instructions:
      "Two paths: (1) MCP, wrap the GitDealFlow MCP server with `langchain_mcp_adapters.MultiServerMCPClient`. (2) HTTP, use the public prompt template at `gitdealflow/vc-startup-scout` on LangChain Hub (once published) which composes our REST endpoints.",
    alternatives: ["llamaindex", "openai-agents-sdk"],
  },
  llamaindex: {
    host: "llamaindex",
    displayName: "LlamaIndex",
    instructions:
      "MCP via `llama_index.tools.mcp.MCPToolSpec`. Pass `npx -y @gitdealflow/mcp-signal` as the server command. For non-MCP, build a custom `BaseToolSpec` against /api/signals.json.",
    alternatives: ["langchain", "openai-agents-sdk"],
  },
  "huggingface-datasets": {
    host: "huggingface-datasets",
    displayName: "Hugging Face Datasets",
    instructions:
      "The full panel is exposed as JSONL at /api/dataset.jsonl. Load via `datasets.load_dataset('json', data_files='https://signals.gitdealflow.com/api/dataset.jsonl')`. The first line is metadata; skip with `skip_lines=1` if needed.",
    fileContents: `${SITE}/api/dataset.jsonl`,
    alternatives: ["openai-agents-sdk", "langchain"],
  },
  postman: {
    host: "postman",
    displayName: "Postman / Bruno / Insomnia",
    fileContents: `${SITE}/agents/postman-collection.json`,
    instructions:
      "Import the collection JSON. Covers all 14 callable surfaces with example requests including bulk dataset, single-startup lookup, MCP RPC, A2A, NLWeb, function-calling, and badge endpoints.",
    alternatives: ["openai-agents-sdk", "anthropic-sdk"],
  },
  "chatgpt-custom-gpt": {
    host: "chatgpt-custom-gpt",
    displayName: "ChatGPT Custom GPT",
    fileContents: `${SITE}/agents/chatgpt-gpt-instructions.md`,
    instructions:
      "Open https://chat.openai.com/gpts/editor, paste the contents of /agents/chatgpt-gpt-instructions.md into the Configure tab, and add an Action with OpenAPI URL https://signals.gitdealflow.com/api/openapi.json (no auth).",
    alternatives: ["openai-agents-sdk", "claude-desktop"],
  },
};

interface RouteContext {
  params: Promise<{ host: string }>;
}

export async function GET(_req: Request, ctx: RouteContext) {
  const { host: rawHost } = await ctx.params;
  const host = String(rawHost || "").toLowerCase().trim();

  if (host === "" || host === "index" || host === "list") {
    return NextResponse.json(
      {
        site: SITE,
        hosts: Object.keys(SPECS).map((h) => ({
          host: h,
          displayName: SPECS[h].displayName,
          url: `${SITE}/api/agents/install/${h}`,
        })),
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }

  const spec = SPECS[host];
  if (!spec) {
    return NextResponse.json(
      {
        error: `Unknown host '${host}'. See ${SITE}/api/agents/install/index for the list of supported hosts.`,
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      ...spec,
      site: SITE,
      relatedSurfaces: {
        agents_md: `${SITE}/AGENTS.md`,
        agents_landing: `${SITE}/agents`,
        full_index: `${SITE}/api/agents.json`,
      },
    },
    {
      headers: {
        "Cache-Control":
          "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
