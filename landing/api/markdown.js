/**
 * gitdealflow.com (apex): text/markdown content negotiation.
 *
 * The apex is a pure static Vercel project (vanilla HTML/CSS, framework null,
 * outputDirectory "."). Static files cannot serve a different Content-Type
 * per Accept header, and Vercel Routing Middleware does not run on this preset
 * (verified 2026-08-16), so this function is the way to answer
 * "Accept: text/markdown" with markdown instead of making an assistant parse
 * browser HTML.
 *
 * vercel.json rewrites any request whose Accept header contains "text/markdown"
 * here (`has: [{ type: "header", key: "accept", value: "text/markdown" }]`).
 * Requests that do NOT ask for markdown never match the rewrite and keep the
 * normal static HTML path. The `vary: accept` header keeps the two
 * representations from being cross-served by a shared cache.
 */

const HOME_MD = `# GitDealFlow: Startup Signals 21-47 Days Before the Round

GitDealFlow flags startups accelerating on GitHub before the round. Weekly signals from 350+ startup orgs for investors who want leading indicators, not lagging.

## The Velocity Verdict

GitDealFlow reads 350+ startup GitHub orgs across 15 sectors, flags the ones accelerating, and sends you five names every Sunday, 21 to 47 days before the round.

## What you get

- Weekly signal: five startups quietly accelerating on GitHub, in your inbox before the round.
- Leading indicators from public engineering activity: commit velocity, contributor growth, and repository expansion.
- Machine-readable data: free JSON, CSV, MCP server, A2A endpoint, and function-calling API.

## Get started

- Website: https://gitdealflow.com
- JSON API: https://signals.gitdealflow.com/api/signals.json
- Machine-readable reference: https://gitdealflow.com/llms.txt
- Contact: signals@gitdealflow.com
`;

function titleFromPath(path) {
  const parts = path
    .split("/")
    .filter(Boolean)
    .map((s) => s.replace(/[-_]+/g, " "))
    .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s));
  return parts.join(" ") || "GitDealFlow";
}

function fallbackMarkdown(path) {
  const url = "https://gitdealflow.com" + path;
  const title = titleFromPath(path);
  return `# ${title}

${url}

GitDealFlow flags startups accelerating on GitHub before the round. Weekly signals from 350+ startup orgs across 15 sectors, sent five names at a time every Sunday, 21 to 47 days before the round.

For the full machine-readable content, see:

- llms.txt: https://gitdealflow.com/llms.txt
- llms-full.txt: https://gitdealflow.com/llms-full.txt
- JSON API: https://signals.gitdealflow.com/api/signals.json
`;
}

export default function handler(req, res) {
  const url = new URL(req.url || "/", "https://gitdealflow.com");
  let path = url.searchParams.get("path") || "";
  if (!path || path === "/") path = "/";
  if (path !== "/" && !path.startsWith("/")) path = "/" + path;

  const body = path === "/" ? HOME_MD : fallbackMarkdown(path);

  res.status(200);
  res.setHeader("content-type", "text/markdown; charset=utf-8");
  res.setHeader("vary", "Accept");
  res.setHeader(
    "cache-control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  );
  res.setHeader(
    "strict-transport-security",
    "max-age=63072000; includeSubDomains; preload",
  );
  res.send(body);
}
