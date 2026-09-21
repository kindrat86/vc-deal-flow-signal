import { pathToFileURL } from "node:url";

const MUTATING_LANGUAGE =
  /\b(create|delete|edit|invite|merge|remove|rename|send|update|write)\b/i;
const IDENTITY_LANGUAGE =
  /\b(authenticated|current|viewer)\b.*\b(user|profile|account)\b|\b(user|profile|account)\b.*\b(authenticated|current|viewer)\b/i;

function stringTags(tool) {
  if (Array.isArray(tool.tags)) {
    return tool.tags.map(String);
  }
  if (tool.tags && typeof tool.tags === "object") {
    return Object.entries(tool.tags)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([tag]) => tag);
  }
  return [];
}

export function chooseAuthenticatedUserTool(tools) {
  const candidates = tools
    .filter((tool) => {
      const text = `${tool.slug ?? ""} ${tool.name ?? ""} ${tool.description ?? ""}`;
      return IDENTITY_LANGUAGE.test(text) && !MUTATING_LANGUAGE.test(text);
    })
    .map((tool) => {
      const tags = stringTags(tool);
      const text = `${tool.slug ?? ""} ${tool.name ?? ""} ${tool.description ?? ""}`;
      const required = tool.inputSchema?.required;
      const noRequiredInput = !Array.isArray(required) || required.length === 0;
      const score =
        (tags.includes("readOnlyHint") ? 4 : 0) +
        (/authenticated/i.test(text) ? 3 : 0) +
        (/\bget\b|\bfetch\b|\bretrieve\b/i.test(text) ? 2 : 0) +
        (noRequiredInput ? 1 : 0);
      return { tool, score };
    })
    .sort((a, b) => b.score - a.score);

  if (!candidates.length) {
    throw new Error(
      "No safe GitHub authenticated-user lookup tool was discovered.",
    );
  }

  return candidates[0].tool;
}

function findGitHubUser(value) {
  const queue = [value];
  const seen = new Set();

  while (queue.length && seen.size < 100) {
    const current = queue.shift();
    if (!current || typeof current !== "object" || seen.has(current)) {
      continue;
    }
    seen.add(current);

    if (typeof current.login === "string" && current.login) {
      return current;
    }

    for (const nested of Object.values(current)) {
      if (nested && typeof nested === "object") {
        queue.push(nested);
      }
    }
  }

  return null;
}

export function summarizeGitHubUser(response) {
  const user = findGitHubUser(response);
  if (!user) {
    throw new Error("The GitHub response did not contain an authenticated user.");
  }

  return {
    login: user.login,
    name: typeof user.name === "string" ? user.name : null,
    url:
      typeof user.html_url === "string"
        ? user.html_url
        : typeof user.htmlUrl === "string"
          ? user.htmlUrl
          : null,
  };
}

function responseLogId(response) {
  return (
    response?.logId ??
    response?.log_id ??
    response?.data?.logId ??
    response?.data?.log_id ??
    null
  );
}

export async function runGitHubFirstCall(adapter) {
  if (!(await adapter.isConnected())) {
    const connection = await adapter.authorize();
    return {
      status: "needs_connection",
      redirectUrl: connection.redirectUrl,
    };
  }

  const tools = await adapter.listTools();
  const tool = chooseAuthenticatedUserTool(tools);
  const response = await adapter.execute(tool.slug, {});

  if (response?.error || response?.successful === false) {
    throw new Error(response.error || "The Composio tool call failed.");
  }

  return {
    status: "success",
    toolSlug: tool.slug,
    user: summarizeGitHubUser(response),
    logId: responseLogId(response),
  };
}

export function createComposioGitHubAdapter(session) {
  return {
    async isConnected() {
      const result = await session.toolkits({ toolkits: ["github"] });
      const github = result.items.find(
        (toolkit) => toolkit.slug.toLowerCase() === "github",
      );
      return Boolean(github?.connection?.isActive);
    },

    async authorize() {
      return session.authorize("github");
    },

    async listTools() {
      const result = await session.search({
        query:
          "Get the currently authenticated GitHub user's public profile. Read only, with no required input.",
        toolkits: ["github"],
      });
      if (!result.success) {
        throw new Error(result.error || "Composio GitHub tool discovery failed.");
      }
      return Object.values(result.toolSchemas).map((tool) => ({
        slug: tool.toolSlug,
        name: tool.toolSlug,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));
    },

    async execute(slug, input) {
      return session.execute(slug, input);
    },
  };
}

async function main() {
  const apiKey = process.env.COMPOSIO_API_KEY;
  const userId = process.env.COMPOSIO_USER_ID;
  if (!apiKey) {
    throw new Error("COMPOSIO_API_KEY is required.");
  }
  if (!userId) {
    throw new Error("COMPOSIO_USER_ID is required.");
  }

  const { Composio } = await import("@composio/core");
  const composio = new Composio({ apiKey });
  const session = await composio.sessions.create(userId, {
    toolkits: ["github"],
    tags: ["readOnlyHint"],
    manageConnections: false,
    sandbox: { enable: false },
  });
  const result = await runGitHubFirstCall(
    createComposioGitHubAdapter(session),
  );
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

const invokedPath = process.argv[1]
  ? pathToFileURL(process.argv[1]).href
  : undefined;
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
