/**
 * Tiny fuzzy search over the 62-term glossary.
 *
 * Strategy:
 *   1. Exact match on `id` or normalized `term` → return first.
 *   2. Substring match on term/id → score by position (earlier = better).
 *   3. Substring match on definition → lower-weight fallback.
 *
 * Returns up to N matches sorted by descending score. Pure function — used
 * by both the /define command (top-1) and inline-mode (top-5).
 */

import { glossaryTerms, type GlossaryTerm } from "@/content/glossary";

const SITE = "https://signals.gitdealflow.com";

export interface GlossaryHit {
  term: GlossaryTerm;
  score: number;
  url: string;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").trim();
}

export function searchGlossary(query: string, limit = 5): GlossaryHit[] {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(/\s+/).filter((t) => t.length > 1);

  const hits: GlossaryHit[] = [];

  for (const term of glossaryTerms) {
    const tn = normalize(term.term);
    const id = term.id.toLowerCase();
    const def = normalize(term.definition);

    let score = 0;

    // Whole-query passes — strongest signals
    if (tn === q || id === q) score = 100;
    else if (tn.startsWith(q) || id.startsWith(q)) score = 80;
    else if (tn.includes(q) || id.includes(q)) {
      const idx = Math.min(
        tn.indexOf(q) === -1 ? Infinity : tn.indexOf(q),
        id.indexOf(q) === -1 ? Infinity : id.indexOf(q),
      );
      score = Math.max(40, 70 - idx);
    } else if (def.includes(q)) {
      score = 20;
    }

    // Per-token fallback for multi-word queries: every token must appear
    // somewhere (term/id/definition). Score = sum of best per-token hit.
    if (score === 0 && tokens.length > 1) {
      let tokenScore = 0;
      let matchedAll = true;
      for (const tok of tokens) {
        if (tn.includes(tok) || id.includes(tok)) tokenScore += 8;
        else if (def.includes(tok)) tokenScore += 3;
        else {
          matchedAll = false;
          break;
        }
      }
      if (matchedAll) score = tokenScore;
    }

    if (score > 0) {
      hits.push({
        term,
        score,
        url: `${SITE}/define/${term.id}`,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.term.term.localeCompare(b.term.term));
  return hits.slice(0, limit);
}

export function defineUrl(termId: string): string {
  return `${SITE}/define/${termId}`;
}
