/**
 * /api/answer — direct Q→A retrieval API for AI agents.
 *
 * Single-shot answer endpoint. Pass `?q=` (or POST { question }) and get back
 * a citation-ready answer object: short answer + supporting facts + canonical
 * URL on this site for verification. Designed for ChatGPT custom GPTs,
 * Claude tool use, Perplexity actions, and any retrieval pipeline that
 * doesn't want to crawl HTML.
 *
 * Response is JSON with conservative CORS so any agent can call it. Falls
 * back to the closest agent-query (`/answers/[slug]`) by token-overlap
 * scoring when no exact match is found.
 */

import { agentQueries } from "@/content/agent-queries";
import { standaloneFaqs } from "@/content/standalone-faqs";

// Per-request because the answer depends on `?q=`. Vercel's CDN does NOT
// include the query string in its cache key by default — so we deliberately
// avoid `force-static` + `s-maxage` here, otherwise the first cached response
// (typically the empty-q error) is served for every subsequent query.
export const dynamic = "force-dynamic";

const SITE = "https://signals.gitdealflow.com";

interface AnswerHit {
  question: string;
  answer: string;
  url: string;
  source: "agent-query" | "faq";
  confidence: number;
  facts?: { claim: string; sourceUrl: string }[];
  related?: { question: string; url: string }[];
}

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

function findBest(query: string): AnswerHit | null {
  const qTokens = tokenize(query);
  if (qTokens.size === 0) return null;

  let best: AnswerHit | null = null;

  for (const aq of agentQueries) {
    const s = Math.max(score(qTokens, aq.query), score(qTokens, aq.h1));
    if (s > 0 && (!best || s > best.confidence)) {
      best = {
        question: aq.query,
        answer: aq.tldr,
        url: `${SITE}/answers/${aq.slug}`,
        source: "agent-query",
        confidence: s,
        facts: aq.facts.slice(0, 4).map((f) => ({
          claim: f.claim,
          sourceUrl: f.sourceUrl,
        })),
        related: aq.related.slice(0, 3).map((rs) => {
          const r = agentQueries.find((q) => q.slug === rs);
          return r
            ? { question: r.query, url: `${SITE}/answers/${r.slug}` }
            : { question: rs, url: `${SITE}/answers/${rs}` };
        }),
      };
    }
  }

  for (const f of standaloneFaqs) {
    const s = score(qTokens, f.question);
    if (s > 0 && (!best || s > best.confidence)) {
      const url = f.sourceHref.startsWith("http")
        ? f.sourceHref
        : `${SITE}${f.sourceHref}`;
      best = {
        question: f.question,
        answer: f.answer,
        url,
        source: "faq",
        confidence: s,
      };
    }
  }

  return best && best.confidence >= 0.2 ? best : null;
}

function envelope(hit: AnswerHit | null, query: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Question",
    text: query,
    answerCount: hit ? 1 : 0,
    acceptedAnswer: hit
      ? {
          "@type": "Answer",
          text: hit.answer,
          url: hit.url,
          author: { "@type": "Organization", name: "VC Deal Flow Signal" },
          citation: hit.facts?.map((f) => ({
            "@type": "CreativeWork",
            text: f.claim,
            url: f.sourceUrl,
          })),
        }
      : undefined,
    suggestedAnswer: hit?.related?.map((r) => ({
      "@type": "Answer",
      text: r.question,
      url: r.url,
    })),
    license: "https://creativecommons.org/licenses/by/4.0/",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
    },
    _meta: {
      query,
      matchedQuestion: hit?.question,
      confidence: hit?.confidence ?? 0,
      source: hit?.source,
      attribution:
        "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com",
      methodology: "https://ssrn.com/abstract=6606558",
      dataset: `${SITE}/qa.jsonl`,
    },
  };
}

function corsHeaders() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "X-Robots-Tag": "index, follow",
    Link: `<${SITE}/qa.jsonl>; rel="alternate"; type="application/x-ndjson", <${SITE}/api/answer>; rel="self"`,
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function usageEnvelope() {
  return {
    _meta: {
      name: "VC Deal Flow Signal — Direct Answer API",
      description:
        "Single-shot Q→A retrieval over the full /answers + /faq corpus. Designed for AI agents that prefer JSON over HTML scraping. Returns a citation-ready Question/Answer envelope.",
      usage: "GET /api/answer?q={question}  or  POST {\"question\":\"...\"}",
      fuzzyMultiResult: `${SITE}/api/ask?q={query}&limit={1-20}`,
      lexicalSearch: `${SITE}/api/llms-search?q={query}&limit={1-50}`,
      dataset: `${SITE}/qa.jsonl`,
      examples: [
        `${SITE}/api/answer?q=what+is+vc+deal+flow+signal`,
        `${SITE}/api/answer?q=how+is+commit+velocity+measured`,
        `${SITE}/api/answer?q=what+is+a+scout+score`,
      ],
      license: "https://creativecommons.org/licenses/by/4.0/",
      citation: "VC Deal Flow Signal (signals.gitdealflow.com), CC BY 4.0.",
    },
    "@context": "https://schema.org",
    "@type": "Question",
    text: "",
    answerCount: 0,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
    },
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") || url.searchParams.get("question") || "").trim();
  if (!query) {
    return new Response(JSON.stringify(usageEnvelope(), null, 2), {
      headers: corsHeaders(),
    });
  }
  const hit = findBest(query);
  return new Response(JSON.stringify(envelope(hit, query), null, 2), {
    headers: corsHeaders(),
  });
}

export async function POST(request: Request) {
  let body: { question?: string; q?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* fall through */
  }
  const query = (body.question || body.q || "").trim();
  if (!query) {
    return new Response(JSON.stringify(usageEnvelope(), null, 2), {
      headers: corsHeaders(),
    });
  }
  const hit = findBest(query);
  return new Response(JSON.stringify(envelope(hit, query), null, 2), {
    headers: corsHeaders(),
  });
}
