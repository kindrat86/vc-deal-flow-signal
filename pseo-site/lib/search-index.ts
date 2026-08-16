/**
 * Shared site-search corpus + scoring.
 *
 * Single source of truth for:
 *   - GET /api/llms-search (JSON endpoint for AI agents, documented in
 *     llms.txt / opensearch.xml / OpenAPI)
 *   - GET /search (human SSR results page, noindex)
 *
 * Extracted 2026-08-18 from app/api/llms-search/route.ts with zero behavior
 * change (same sources, same scoring, same ordering) so the two surfaces can
 * never drift. If you add a corpus source here, both surfaces gain it.
 *
 * Sources: startups (current period, all sectors), sector hubs, blog posts,
 * comparisons, agent answers, standalone FAQs, research findings.
 */

import {
  getAllSectors,
  getCurrentPeriod,
  getStartupProfile,
} from "@/lib/data";
import { posts } from "@/content/posts";
import { comparisons } from "@/content/comparisons";
import { agentQueries } from "@/content/agent-queries";
import { standaloneFaqs } from "@/content/standalone-faqs";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";

const BASE_URL = "https://signals.gitdealflow.com";

export interface SearchHit {
  url: string;
  title: string;
  snippet: string;
  type: "startup" | "sector" | "blog" | "comparison" | "answer" | "faq" | "research";
  score: number;
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function score(query: string, ...fields: (string | undefined)[]): number {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return 0;
  let total = 0;
  for (const f of fields) {
    if (!f) continue;
    const text = f.toLowerCase();
    for (const t of qTokens) {
      if (text === t) total += 6;
      else if (text.startsWith(t)) total += 4;
      else if (text.includes(t)) total += 2;
    }
  }
  return total;
}

/**
 * Run the lexical search over the full corpus. Mirrors the scoring the
 * /api/llms-search endpoint has served since launch: startups get a small
 * freshness boost (+2), sectors and answers +1, research +2.
 */
export function searchCorpus(
  query: string,
  limit = 20
): { hits: SearchHit[]; total: number } {
  const hits: SearchHit[] = [];

  // Startups
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  for (const sector of sectors) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    for (const startup of snap.startups) {
      const s = score(query, startup.name, startup.description, sector.name);
      if (s > 0) {
        const profile = getStartupProfile(startup.name);
        hits.push({
          url: profile
            ? `${BASE_URL}/startup/${profile.slug}`
            : `${BASE_URL}/startups-to-watch/${sector.slug}-${period.slug}`,
          title: `${startup.name}, ${sector.name} startup`,
          snippet: startup.description,
          type: "startup",
          score: s + 2, // small boost, fresh data
        });
      }
    }
  }

  // Sectors
  for (const sector of sectors) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    const s = score(query, sector.name, sector.description);
    if (s > 0) {
      hits.push({
        url: `${BASE_URL}/startups-to-watch/${sector.slug}-${period.slug}`,
        title: `${sector.name}, startups to watch`,
        snippet: sector.description,
        type: "sector",
        score: s + 1,
      });
    }
  }

  // Blog posts
  for (const p of posts) {
    const s = score(query, p.title, p.description, p.body.slice(0, 600));
    if (s > 0) {
      hits.push({
        url: `${BASE_URL}/blog/${p.slug}`,
        title: p.title,
        snippet: p.description,
        type: "blog",
        score: s,
      });
    }
  }

  // Comparisons
  for (const c of comparisons) {
    const s = score(query, c.h1, c.description);
    if (s > 0) {
      hits.push({
        url: `${BASE_URL}/compare/${c.slug}`,
        title: c.h1,
        snippet: c.description,
        type: "comparison",
        score: s,
      });
    }
  }

  // Agent answers
  for (const a of agentQueries) {
    const s = score(query, a.h1, a.description, a.tldr, a.query, ...a.keywords);
    if (s > 0) {
      hits.push({
        url: `${BASE_URL}/answers/${a.slug}`,
        title: a.h1,
        snippet: a.tldr,
        type: "answer",
        score: s + 1,
      });
    }
  }

  // FAQs
  for (const f of standaloneFaqs) {
    const s = score(query, f.question, f.answer);
    if (s > 0) {
      hits.push({
        url: f.sourceHref.startsWith("http")
          ? f.sourceHref
          : `${BASE_URL}${f.sourceHref}`,
        title: f.question,
        snippet: f.answer,
        type: "faq",
        score: s,
      });
    }
  }

  // Research findings
  for (const f of RESEARCH_FINDINGS) {
    const s = score(query, f.title, f.claim, f.why);
    if (s > 0) {
      hits.push({
        url: `${BASE_URL}/research/${f.slug}`,
        title: f.title,
        snippet: f.claim,
        type: "research",
        score: s + 2,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return { hits: hits.slice(0, limit), total: hits.length };
}

/** Clamp + normalize a raw ?q= value for both surfaces. */
export function normalizeQuery(raw: string | undefined | null): string {
  return (raw ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, 100);
}
