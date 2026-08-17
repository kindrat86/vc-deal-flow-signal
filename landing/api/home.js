/**
 * gitdealflow.com (apex): home-page content negotiation.
 *
 * The apex is a pure static Vercel project (framework null), so a static
 * index.html cannot serve a different Content-Type per Accept header, and
 * Vercel Routing Middleware + `has`-conditional rewrites do not run on this
 * preset. The proven pattern (same as api/crawl-proxy.js) is: remove the
 * static twin (index.html -> index.src.html) so a vercel.json rewrite can
 * route "/" here, then answer in the right representation.
 *
 *   - Accept: text/markdown  -> markdown (Content-Type: text/markdown)
 *   - everything else         -> the real HTML (Content-Type: text/html)
 *
 * Non-markdown clients get the identical HTML the static index.html used to
 * serve (read from index.src.html via includeFiles). `vary: accept` keeps the
 * two representations from being cross-served by a shared edge cache.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

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

export default function handler(req, res) {
  const accept = (req.headers["accept"] || "").toLowerCase();

  if (accept.includes("text/markdown")) {
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
    return res.send(HOME_MD);
  }

  try {
    const html = readFileSync(join(process.cwd(), "index.src.html"), "utf8");
    res.status(200);
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("vary", "Accept");
    res.send(html);
  } catch (err) {
    console.error(`[home] index.src.html read failed: ${err && err.message ? err.message : err}`);
    res.status(500).send("Home page unavailable");
  }
}
