/**
 * /sitemap.txt — plain-text sitemap (Google + Bing supported).
 * Fast for AI crawlers that prefer simple newline-delimited URL lists
 * over XML. Mirror of sitemap.xml URL set.
 */

import { getAllSectors, getCurrentPeriod, getAllPeriods, getAllStartupSlugs } from "@/lib/data";
import { posts } from "@/content/posts";
import { comparisons } from "@/content/comparisons";
import { alternatives } from "@/content/alternatives";
import { useCases } from "@/content/use-cases";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";
import { pillars } from "@/content/pillars";
import { agentQueries } from "@/content/agent-queries";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const urls: string[] = [];

  // Core
  const core = [
    "",
    "/about",
    "/methodology",
    "/glossary",
    "/faq",
    "/citations",
    "/data-sources",
    "/research",
    "/agents",
    "/developers",
    "/integrations",
    "/integrations/mistral",
    "/install",
    "/badge-builder",
    "/built-with",
    "/predict",
    "/receipts",
    "/leaderboard",
    "/answers",
    "/changelog",
    "/trending",
    "/blog",
    "/compare",
    "/alternatives",
    "/use-cases",
    "/topics",
    "/signal-of-the-week",
    "/weekly",
    "/story",
    "/llms.txt",
    "/llms-full.txt",
    "/qa.jsonl",
    "/ai.txt",
    "/robots.txt",
    "/humans.txt",
    "/opensearch.xml",
    "/sitemap.xml",
    "/feed.xml",
    "/manifest.webmanifest",
    "/api/dataset.jsonl",
    "/api/answers.json",
    "/api/openapi.json",
    "/api/agents",
    "/.well-known/agent-card.json",
    "/.well-known/ai-policy.json",
    "/.well-known/mcp.json",
    "/.well-known/security.txt",
  ];
  for (const p of core) urls.push(`${SITE}${p}`);

  // Programmatic surfaces
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();
  for (const sector of sectors) {
    for (const p of allPeriods) {
      if (sector.periods[p.slug]) {
        urls.push(`${SITE}/startups-to-watch/${sector.slug}-${p.slug}`);
      }
    }
  }
  for (const slug of getAllStartupSlugs()) {
    urls.push(`${SITE}/startup/${slug}`);
  }
  for (const post of posts) urls.push(`${SITE}/blog/${post.slug}`);
  for (const c of comparisons) urls.push(`${SITE}/compare/${c.slug}`);
  for (const a of alternatives) urls.push(`${SITE}/alternatives/${a.slug}`);
  for (const u of useCases) urls.push(`${SITE}/use-cases/${u.slug}`);
  for (const r of RESEARCH_FINDINGS) urls.push(`${SITE}/research/${r.slug}`);
  for (const p of Object.values(pillars)) urls.push(`${SITE}/topics/${p.slug}`);
  for (const q of agentQueries) urls.push(`${SITE}/answers/${q.slug}`);

  const body = urls.join("\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
