/**
 * /api/ask — fuzzy multi-result search across the Q&A corpus.
 *
 * Sibling of /api/answer (single best match). This one returns the top-N
 * ranked candidates so an agent can present options or pick a different
 * confidence threshold. Designed for autocomplete-style UX in agent
 * front-ends and for diagnostic comparison vs /api/answer.
 */

import { agentQueries } from "@/content/agent-queries";
import { standaloneFaqs } from "@/content/standalone-faqs";

// Per-request because the answer depends on `?q=`. Vercel's CDN does NOT
// include the query string in its cache key by default.
export const dynamic = "force-dynamic";

const SITE = "https://signals.gitdealflow.com";

function tokenize(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function score(qTokens: Set<string>, candidate: string): number {
  const cTokens = tokenize(candidate);
  let hits = 0;
  for (const t of qTokens) if (cTokens.has(t)) hits++;
  return qTokens.size === 0 ? 0 : hits / qTokens.size;
}

function corsHeaders() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "X-Robots-Tag": "index, follow",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(20, parseInt(url.searchParams.get("limit") || "5", 10) || 5);

  if (!query) {
    return new Response(
      JSON.stringify(
        {
          _meta: {
            name: "VC Deal Flow Signal — Fuzzy Multi-Result Q&A Search",
            description:
              "Top-N ranked Q&A candidates over the full /answers + /faq corpus. Sibling of /api/answer (single best match). Designed for autocomplete UX and confidence-tuned agents.",
            usage: "GET /api/ask?q={query}&limit={1-20}",
            singleBestAnswer: `${SITE}/api/answer?q={query}`,
            lexicalSearch: `${SITE}/api/llms-search?q={query}&limit={1-50}`,
            dataset: `${SITE}/qa.jsonl`,
            examples: [
              `${SITE}/api/ask?q=engineering+acceleration`,
              `${SITE}/api/ask?q=deal+sourcing&limit=10`,
              `${SITE}/api/ask?q=stealth+startups`,
            ],
            license: "https://creativecommons.org/licenses/by/4.0/",
            citation: "VC Deal Flow Signal (signals.gitdealflow.com), CC BY 4.0.",
          },
          query: "",
          count: 0,
          results: [],
        },
        null,
        2
      ),
      { headers: corsHeaders() }
    );
  }

  const qTokens = tokenize(query);

  type Candidate = {
    type: "agent-query" | "faq";
    question: string;
    answer: string;
    url: string;
    confidence: number;
  };

  const all: Candidate[] = [];

  for (const aq of agentQueries) {
    const s = Math.max(score(qTokens, aq.query), score(qTokens, aq.h1));
    if (s > 0) {
      all.push({
        type: "agent-query",
        question: aq.query,
        answer: aq.tldr,
        url: `${SITE}/answers/${aq.slug}`,
        confidence: s,
      });
    }
  }

  for (const f of standaloneFaqs) {
    const s = score(qTokens, f.question);
    if (s > 0) {
      const url = f.sourceHref.startsWith("http")
        ? f.sourceHref
        : `${SITE}${f.sourceHref}`;
      all.push({
        type: "faq",
        question: f.question,
        answer: f.answer,
        url,
        confidence: s,
      });
    }
  }

  const ranked = all.sort((a, b) => b.confidence - a.confidence).slice(0, limit);

  return new Response(
    JSON.stringify(
      {
        query,
        count: ranked.length,
        results: ranked,
        attribution:
          "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com",
        license: "https://creativecommons.org/licenses/by/4.0/",
        dataset: `${SITE}/qa.jsonl`,
        related: {
          singleBestAnswer: `${SITE}/api/answer?q=${encodeURIComponent(query)}`,
          fullDataset: `${SITE}/qa.jsonl`,
          knowledgeGraph: `${SITE}/knowledge-graph.json`,
        },
      },
      null,
      2
    ),
    { headers: corsHeaders() }
  );
}
