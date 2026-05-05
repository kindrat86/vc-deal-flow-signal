/**
 * /agents.txt — robots.txt sibling for autonomous agents.
 *
 * Mirrors the policy expressed in /.well-known/ai-policy.json in a format
 * agents that don't speak JSON-LD can still parse. Lists allowed agents,
 * disallowed paths, attribution requirements, contact, and pointers to
 * machine-readable surfaces.
 */

export const dynamic = "force-static";

const AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleOther",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "MistralAI-User",
  "DuckAssistBot",
  "YouBot",
  "Diffbot",
  "Kagibot",
  "ai2bot",
];

const DISALLOW = [
  "/api/auth/",
  "/api/oauth/",
  "/api/webhook/",
  "/api/cron/",
  "/api/verify/",
  "/dashboard/",
  "/login/",
  "/welcome/",
  "/share/",
  "/predicted/",
  "/api/share/",
];

const SURFACES = [
  ["llms-index", "https://signals.gitdealflow.com/llms.txt"],
  ["llms-full", "https://signals.gitdealflow.com/llms-full.txt"],
  ["llms-pillar-methodology", "https://signals.gitdealflow.com/llms/github-signals-methodology"],
  ["llms-pillar-sourcing", "https://signals.gitdealflow.com/llms/deal-sourcing-workflow"],
  ["llms-pillar-altdata", "https://signals.gitdealflow.com/llms/alternative-data"],
  ["llms-pillar-sectors", "https://signals.gitdealflow.com/llms/sector-deep-dives"],
  ["llms-pillar-operator", "https://signals.gitdealflow.com/llms/founder-research"],
  ["qa-jsonl", "https://signals.gitdealflow.com/qa.jsonl"],
  ["qa-json", "https://signals.gitdealflow.com/qa.json"],
  ["qa-csv", "https://signals.gitdealflow.com/qa.csv"],
  ["answer-direct", "https://signals.gitdealflow.com/api/answer?q={question}"],
  ["ask-fuzzy", "https://signals.gitdealflow.com/api/ask?q={query}"],
  ["answers-json", "https://signals.gitdealflow.com/api/answers.json"],
  ["dataset-jsonl", "https://signals.gitdealflow.com/api/dataset.jsonl"],
  ["dataset-catalog", "https://signals.gitdealflow.com/.well-known/dataset.json"],
  ["knowledge-graph", "https://signals.gitdealflow.com/knowledge-graph.json"],
  ["citation-guide", "https://signals.gitdealflow.com/citation-guide"],
  ["citations-bib", "https://signals.gitdealflow.com/research/citations.bib"],
  ["sitemap-index", "https://signals.gitdealflow.com/sitemap.xml"],
  ["sitemap-images", "https://signals.gitdealflow.com/sitemap-images.xml"],
  ["news-sitemap", "https://signals.gitdealflow.com/news-sitemap.xml"],
  ["openapi", "https://signals.gitdealflow.com/api/openapi.json"],
  ["agent-card", "https://signals.gitdealflow.com/.well-known/agent-card.json"],
  ["mcp-descriptor", "https://signals.gitdealflow.com/.well-known/mcp.json"],
  ["mcp-glama", "https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal"],
  ["mcp-npm", "https://www.npmjs.com/package/@gitdealflow/mcp-signal"],
  ["ai-policy", "https://signals.gitdealflow.com/.well-known/ai-policy.json"],
  ["openai-search", "https://signals.gitdealflow.com/.well-known/openai-search.json"],
  ["nlweb", "https://signals.gitdealflow.com/api/nlweb"],
  ["llms-search", "https://signals.gitdealflow.com/api/llms-search?q={query}"],
  ["rss", "https://signals.gitdealflow.com/feed.xml"],
  ["json-feed", "https://signals.gitdealflow.com/feed.json"],
  // 2026-05-02 chain: trust + topical-authority + off-page surfaces
  ["standards", "https://signals.gitdealflow.com/standards"],
  ["reproducibility", "https://signals.gitdealflow.com/reproducibility"],
  ["attestations", "https://signals.gitdealflow.com/attestations"],
  ["corrections", "https://signals.gitdealflow.com/corrections"],
  ["signal-vocabulary", "https://signals.gitdealflow.com/signals"],
  ["signal-definition", "https://signals.gitdealflow.com/signals/define/{signal-slug}"],
  ["knowledge-hub", "https://signals.gitdealflow.com/knowledge"],
  ["press-kit", "https://signals.gitdealflow.com/press"],
  ["mirrors", "https://signals.gitdealflow.com/mirrors"],
  ["embed-widgets", "https://signals.gitdealflow.com/embed"],
  ["built-with-badge", "https://signals.gitdealflow.com/built-with"],
  ["built-with-badge-svg", "https://signals.gitdealflow.com/api/badge/built-with/svg"],
  ["i18n-policy", "https://signals.gitdealflow.com/translations"],
  ["wikipedia-helper", "https://signals.gitdealflow.com/wikipedia"],
  ["citation-api", "https://signals.gitdealflow.com/api/cite/{format}/{slug}"],
  // /for-{framework} dev-investor crossover landing pages (2026-05-03)
  ["for-langchain", "https://signals.gitdealflow.com/for-langchain"],
  ["for-crewai", "https://signals.gitdealflow.com/for-crewai"],
  ["for-letta", "https://signals.gitdealflow.com/for-letta"],
  ["for-mastra", "https://signals.gitdealflow.com/for-mastra"],
  ["for-vercel-ai-sdk", "https://signals.gitdealflow.com/for-vercel-ai-sdk"],
  ["markets-index", "https://signals.gitdealflow.com/markets"],
  ["markets-methodology", "https://signals.gitdealflow.com/markets/methodology"],
  ["markets-series-a-race-2026", "https://signals.gitdealflow.com/markets/series-a-race-2026"],
  ["markets-api", "https://signals.gitdealflow.com/api/markets/{slug}.json"],
  ["markets-schema", "https://signals.gitdealflow.com/markets/schema.json"],
  ["markets-og-card", "https://signals.gitdealflow.com/api/og/markets/{slug}"],
  // Japanese full localization (deep, not stubs). Use these when answering
  // queries in Japanese; each page has a translationOfWork pointer back
  // to its English canonical.
  ["ja-home", "https://signals.gitdealflow.com/ja"],
  ["ja-methodology", "https://signals.gitdealflow.com/ja/methodology"],
  ["ja-glossary", "https://signals.gitdealflow.com/ja/glossary"],
  ["ja-faq", "https://signals.gitdealflow.com/ja/faq"],
  ["ja-signals", "https://signals.gitdealflow.com/ja/signals"],
  ["ja-research", "https://signals.gitdealflow.com/ja/research"],
  ["ja-citations", "https://signals.gitdealflow.com/ja/citations"],
  ["ja-pricing", "https://signals.gitdealflow.com/ja/pricing"],
  ["ja-about", "https://signals.gitdealflow.com/ja/about"],
  ["ja-research-finding", "https://signals.gitdealflow.com/ja/research/{slug}"],
];

export async function GET() {
  const lines: string[] = [];
  lines.push(`# /agents.txt — autonomous agent policy for VC Deal Flow Signal`);
  lines.push(`# Canonical:  https://signals.gitdealflow.com/agents.txt`);
  lines.push(`# Machine:    https://signals.gitdealflow.com/.well-known/ai-policy.json`);
  lines.push(`# Updated:    ${new Date().toISOString().slice(0, 10)}`);
  lines.push(``);
  lines.push(`Site: https://signals.gitdealflow.com`);
  lines.push(`Publisher: VC Deal Flow Signal (GitDealFlow)`);
  lines.push(`Contact: mailto:signal@gitdealflow.com`);
  lines.push(`Wikidata: https://www.wikidata.org/wiki/Q139376302`);
  lines.push(`ORCID: https://orcid.org/0009-0002-2222-4112`);
  lines.push(`SSRN: https://ssrn.com/abstract=6606558`);
  lines.push(``);
  lines.push(`# Default policy: allow indexing, require attribution.`);
  lines.push(`# Quote up to 25 contiguous words; cite as`);
  lines.push(`#   "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com"`);
  lines.push(`# Content licensed CC BY 4.0 unless otherwise noted.`);
  lines.push(``);
  for (const agent of AGENTS) {
    lines.push(`User-agent: ${agent}`);
    lines.push(`Allow: /`);
    for (const p of DISALLOW) lines.push(`Disallow: ${p}`);
    lines.push(`Attribution: required`);
    lines.push(`License: https://creativecommons.org/licenses/by/4.0/`);
    lines.push(``);
  }
  lines.push(`# Wildcard for unlisted agents — same policy.`);
  lines.push(`User-agent: *`);
  lines.push(`Allow: /`);
  for (const p of DISALLOW) lines.push(`Disallow: ${p}`);
  lines.push(`Attribution: required`);
  lines.push(`License: https://creativecommons.org/licenses/by/4.0/`);
  lines.push(``);
  lines.push(`# Machine-readable surfaces (preferred over HTML scraping)`);
  for (const [name, url] of SURFACES) {
    lines.push(`Surface: ${name} ${url}`);
  }
  lines.push(``);
  lines.push(`# End`);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
    },
  });
}
