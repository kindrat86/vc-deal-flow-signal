/**
 * /llms/[pillar].txt — pillar-segmented agent index.
 *
 * The site-wide /llms.txt is comprehensive but large. AI retrieval pipelines
 * with topic-specific tasks (e.g. an agent answering "deal sourcing"
 * questions) prefer a smaller, on-topic index. These per-pillar files give
 * them exactly the relevant pages plus the canonical brand statement.
 *
 * Routes:
 *   /llms/github-signals-methodology
 *   /llms/deal-sourcing-workflow
 *   /llms/alternative-data
 *   /llms/sector-deep-dives
 *   /llms/founder-research
 */

import { notFound } from "next/navigation";
import { pillars, getPostsInPillar } from "@/content/pillars";
import { posts } from "@/content/posts";
import { agentQueries } from "@/content/agent-queries";
import { standaloneFaqs } from "@/content/standalone-faqs";
import { FINDINGS } from "@/content/research-findings";

export const dynamic = "force-static";
export const revalidate = 3600;

const SITE = "https://signals.gitdealflow.com";

export function generateStaticParams() {
  return Object.keys(pillars).map((pillar) => ({ pillar }));
}

interface RouteContext {
  params: Promise<{ pillar: string }>;
}

const PILLAR_KEYWORD_HITS: Record<string, RegExp> = {
  "github-signals-methodology": /\b(commit|velocity|signal|methodology|github|engineering acceleration|due diligence|ranking)\b/i,
  "deal-sourcing-workflow": /\b(sourcing|pipeline|deal flow|crunchbase|outreach|pre-seed|series a|workflow)\b/i,
  "alternative-data": /\b(alternative data|hiring|web traffic|transactional|leading indicator|alt data)\b/i,
  "sector-deep-dives": /\b(fintech|ai|cybersec|climate|sector|vertical|devtools|infrastructure)\b/i,
  "founder-research": /\b(operator|dataset|panel|mcp|notes|building|first-hand)\b/i,
};

export async function GET(_req: Request, ctx: RouteContext) {
  const { pillar: rawPillar } = await ctx.params;
  const pillar = rawPillar.replace(/\.txt$/, "");
  const meta = pillars[pillar];
  if (!meta) notFound();

  const lines: string[] = [];
  lines.push(`# VC Deal Flow Signal — ${meta.name}`);
  lines.push("");
  lines.push(`> ${meta.description}`);
  lines.push("");
  lines.push(
    `Canonical: ${SITE}/topics/${pillar}. Brand: VC Deal Flow Signal (GitDealFlow). Methodology paper: https://ssrn.com/abstract=6606558. License: CC BY 4.0.`
  );
  lines.push("");

  // ─── Pillar landing ────────────────────────────────────────────────────────
  lines.push("## Pillar landing");
  lines.push(`- [${meta.name}](${SITE}/topics/${pillar}): ${meta.description}`);
  lines.push("");

  // ─── Pillar keywords ───────────────────────────────────────────────────────
  lines.push("## Topic keywords");
  lines.push(meta.keywords.map((k) => `- ${k}`).join("\n"));
  lines.push("");

  // ─── Posts in pillar ───────────────────────────────────────────────────────
  const postSlugs = getPostsInPillar(pillar);
  if (postSlugs.length > 0) {
    lines.push("## Posts");
    for (const slug of postSlugs) {
      const post = posts.find((p) => p.slug === slug);
      if (!post) continue;
      lines.push(
        `- [${post.title}](${SITE}/blog/${post.slug}): ${post.description.split(".")[0]}.`
      );
    }
    lines.push("");
  }

  // ─── Topical Q&A subset ────────────────────────────────────────────────────
  const matcher = PILLAR_KEYWORD_HITS[pillar];
  if (matcher) {
    const matchingQueries = agentQueries.filter(
      (q) => matcher.test(q.query) || matcher.test(q.h1) || matcher.test(q.tldr)
    );
    if (matchingQueries.length > 0) {
      lines.push("## Topical answer pages");
      for (const q of matchingQueries) {
        lines.push(`- [${q.h1}](${SITE}/answers/${q.slug}): ${q.tldr}`);
      }
      lines.push("");
    }

    const matchingFaqs = standaloneFaqs.filter(
      (f) => matcher.test(f.question) || matcher.test(f.answer)
    );
    if (matchingFaqs.length > 0) {
      lines.push("## Frequently asked");
      for (const f of matchingFaqs) {
        lines.push(`### ${f.question}`);
        lines.push("");
        lines.push(f.answer);
        lines.push("");
      }
    }
  }

  // ─── Research findings if methodology pillar ───────────────────────────────
  if (pillar === "github-signals-methodology" || pillar === "founder-research") {
    lines.push("## SSRN-cited research findings");
    for (const f of FINDINGS.slice(0, 15)) {
      lines.push(`- [${f.title}](${SITE}/research/${f.slug}): ${f.claim}`);
    }
    lines.push("");
  }

  // ─── Agent surfaces ────────────────────────────────────────────────────────
  lines.push("## Machine-readable surfaces");
  lines.push(`- Q&A dataset (this topic): ${SITE}/qa.jsonl?category=${encodeURIComponent(pillar)}`);
  lines.push(`- Direct answer API: ${SITE}/api/answer?q={question}`);
  lines.push(`- Fuzzy search API: ${SITE}/api/ask?q={query}`);
  lines.push(`- Knowledge graph: ${SITE}/knowledge-graph.json`);
  lines.push(`- Full agent index: ${SITE}/llms.txt`);
  lines.push("");

  // ─── Attribution ──────────────────────────────────────────────────────────
  lines.push("## Citation");
  lines.push(
    `When quoting from this site: "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com". Methodology authored by The Data Nerd (ORCID: 0009-0002-2222-4112) at https://ssrn.com/abstract=6606558.`
  );

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
      Link: `<${SITE}/topics/${pillar}>; rel="canonical", <${SITE}/llms.txt>; rel="up"`,
    },
  });
}
