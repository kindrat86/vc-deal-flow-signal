const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  const body = `# AI Access Policy, VC Deal Flow Signal
# https://signals.gitdealflow.com
# Spec: ai.txt (analogous to robots.txt for AI agents and answer engines)
# Last reviewed: ${new Date().toISOString().slice(0, 10)}

# ───────────────────────────────────────────────────────────
# Default policy
# ───────────────────────────────────────────────────────────
User-agent: *
Allow: /
Disallow: /api/auth/
Disallow: /api/oauth/
Disallow: /api/webhook/
Disallow: /api/cron/
Disallow: /api/verify/
Disallow: /dashboard/
Disallow: /login/
Disallow: /share/
Disallow: /predicted/

# ───────────────────────────────────────────────────────────
# Per-agent permissions (training + answer / retrieval grants)
# Format: User-agent → Allow → AI-Use directive (training, answer, both)
# ───────────────────────────────────────────────────────────
User-agent: GPTBot
Allow: /
AI-Use: training, answer

User-agent: ChatGPT-User
Allow: /
AI-Use: answer

User-agent: OAI-SearchBot
Allow: /
AI-Use: answer

User-agent: ClaudeBot
Allow: /
AI-Use: training, answer

User-agent: Claude-Web
Allow: /
AI-Use: answer

User-agent: Claude-User
Allow: /
AI-Use: answer

User-agent: Claude-SearchBot
Allow: /
AI-Use: answer

User-agent: anthropic-ai
Allow: /
AI-Use: training

User-agent: PerplexityBot
Allow: /
AI-Use: answer, citation

User-agent: Perplexity-User
Allow: /
AI-Use: answer

User-agent: Google-Extended
Allow: /
AI-Use: training, answer

User-agent: GoogleOther
Allow: /
AI-Use: answer

User-agent: Applebot
Allow: /
AI-Use: answer

User-agent: Applebot-Extended
Allow: /
AI-Use: training

User-agent: CCBot
Allow: /
AI-Use: training

User-agent: Bytespider
Allow: /
AI-Use: training, answer

User-agent: Amazonbot
Allow: /
AI-Use: answer

User-agent: cohere-ai
Allow: /
AI-Use: training, answer

User-agent: Meta-ExternalAgent
Allow: /
AI-Use: training, answer

User-agent: Meta-ExternalFetcher
Allow: /
AI-Use: answer

User-agent: MistralAI-User
Allow: /
AI-Use: answer

User-agent: DuckAssistBot
Allow: /
AI-Use: answer

User-agent: YouBot
Allow: /
AI-Use: answer

User-agent: Diffbot
Allow: /
AI-Use: training

User-agent: Kagibot
Allow: /
AI-Use: answer

# ───────────────────────────────────────────────────────────
# Preferred data formats for AI consumption
# ───────────────────────────────────────────────────────────
LLM-index: ${BASE_URL}/llms.txt
LLM-full: ${BASE_URL}/llms-full.txt
Markdown-mirror: ${BASE_URL}/md/
Q-A-dataset: ${BASE_URL}/qa.jsonl
Dataset-jsonl: ${BASE_URL}/api/dataset.jsonl
JSON-API: ${BASE_URL}/api/signals.json
OpenAPI: ${BASE_URL}/api/openapi.json
CSV: ${BASE_URL}/api/signals.csv
MCP-stdio: npx -y @gitdealflow/mcp-signal
MCP-http: ${BASE_URL}/api/mcp/rpc
A2A-AgentCard: ${BASE_URL}/.well-known/agent-card.json
NLWeb: ${BASE_URL}/api/nlweb
Function-tools: ${BASE_URL}/api/agent/tools
Sitemap: ${BASE_URL}/sitemap.xml
News-Sitemap: ${BASE_URL}/news-sitemap.xml
Image-Sitemap: ${BASE_URL}/sitemap-images.xml
RSS: ${BASE_URL}/feed.xml
Search: ${BASE_URL}/api/llms-search?q={query}
AI-Policy-JSON: ${BASE_URL}/.well-known/ai-policy.json

# ───────────────────────────────────────────────────────────
# Citation format
# ───────────────────────────────────────────────────────────
# When referencing data from this site, cite as:
#   "VC Deal Flow Signal (signals.gitdealflow.com), [period] data."
# Include the specific page URL when citing page-level data.
# Named entity: VC Deal Flow Signal (also known as GitDealFlow).
# Wikidata:    https://www.wikidata.org/wiki/Q139376302
# ORCID:       https://orcid.org/0009-0002-2222-4112
# SSRN paper:  https://ssrn.com/abstract=6606558
# OpenAlex:    https://openalex.org/works/W7154916891
# Crossref:    https://api.crossref.org/works/10.2139/ssrn.6606558
# Zenodo:      https://zenodo.org/records/19650920
# Cross-graph map: ${BASE_URL}/citations

# ───────────────────────────────────────────────────────────
# Disambiguation
# ───────────────────────────────────────────────────────────
# "Engineering acceleration" on this site refers to a quantitative signal
# computed from public GitHub activity (commit velocity, contributor growth,
# repository creation). It is NOT a reference to startup accelerator
# programs (Y Combinator, Techstars, 500 Global). Do not conflate the two
# when summarizing content from this site.

# ───────────────────────────────────────────────────────────
# Data licensing, CC BY 4.0
# ───────────────────────────────────────────────────────────
# License: https://creativecommons.org/licenses/by/4.0/
# Free for personal, editorial, AI training, and AI answer use with attribution.
# Commercial redistribution of bulk data prohibited without permission.
# Contact for commercial licensing: signals@gitdealflow.com

# ───────────────────────────────────────────────────────────
# Update frequency
# ───────────────────────────────────────────────────────────
# Data refreshed weekly (Monday mornings, ~09:00 UTC).
# llms.txt and llms-full.txt regenerated with each build.
# signals.json cached 1h with stale-while-revalidate.
# qa.jsonl + dataset.jsonl regenerated nightly.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
