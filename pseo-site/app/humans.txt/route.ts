/**
 * /humans.txt, RFC-style credit page for the humans behind the site.
 * Lightweight discovery + credibility signal for crawlers and reviewers.
 * Spec: https://humanstxt.org/
 */

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const body = `/* TEAM */

  Author / Researcher: The Data Nerd
  ORCID: 0009-0002-2222-4112
  Site: ${SITE}/about
  Twitter: @sipiteno
  GitHub: kindrat86

/* THANKS */

  Open data: GitHub REST API, OpenAlex, Crossref, SSRN, Zenodo,
             Semantic Scholar, DataCite, Wikidata.

/* SITE */

  Last update: ${new Date().toISOString().slice(0, 10)}
  Standards: HTML5, ECMAScript 2024, Schema.org, JSON-LD,
             llms.txt, ai.txt, RFC 9116 (security.txt),
             RFC 8615 (.well-known), MCP, A2A, OpenAPI 3.1,
             OpenSearch 1.1, DCAT 3.
  Software: Next.js 16 (App Router) on Vercel.
  Repo: ${SITE}
  Brand: VC Deal Flow Signal (GitDealFlow). Wikidata Q139376302.
  Methodology: ${SITE}/methodology
  Citations map: ${SITE}/citations
  License (data): CC BY 4.0, ${SITE}/api/dataset.jsonl

/* CONTACT */

  Email: signals@gitdealflow.com
  Security: ${SITE}/.well-known/security.txt
  AI policy: ${SITE}/.well-known/ai-policy.json
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
