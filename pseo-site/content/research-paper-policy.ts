/**
 * Research-paper cluster index policy (audit item: search-intent match 42).
 *
 * Ground truth (GSC 28d 2026-07-17..08-13, pulled 2026-08-16):
 *   /research-paper/* leaves = 20,085 impressions / 3 clicks / 0.015% CTR,
 *   concentrated on ML-paper citation-hunter queries (RAG 11.0K, InstructGPT
 *   3.9K, LoRA 2.9K imps at pos 8-10). The audience is citation hunters, not
 *   the investor ICP. The investor lede + CTA (commit 6cd1aef1, live
 *   2026-08-15 evening) is the retarget attempt.
 *
 * PRE-REGISTERED DECISION RULE (audit fix, conditional): if the post-lede
 * cluster CTR stays ~0, noindex the pure-bibliography leaves. Operationalized:
 *   window = 2026-08-16.. pull-3d, page-dim GSC, /research-paper/ filter
 *   IF imps >= 3000 AND CTR < 0.20%  -> decision flips to "noindex"
 *   (0.20% = still zero-click at slightly-above-site-average; the working
 *   exemplar families run 1.2-2.0% CTR, so a working lede clears 0.20%
 *   easily. 3000 imps guarantees a multi-week post-change sample.)
 *
 * The flip is executed autonomously by
 *   ~/.hermes/scripts/gdf-research-noindex-evaluator.py
 * (weekly cron from 2026-08-29), which rewrites ONLY this file's decision /
 * verdict / decidedAt fields, re-runs verify-no-regressions + tsc, commits,
 * and deploys. Every consumer layer (leaf metadata robots, proxy
 * X-Robots-Tag, sitemap membership) reads this file, so the flip is a
 * one-file change and this tree without the flip cannot regress silently:
 * §54 in scripts/verify-no-regressions.ts fails the build if any layer is
 * unwired.
 *
 * keepIndexable (stays indexable even after a flip):
 *   - forsgren-2018 (DORA): deploy frequency / lead time IS this product's
 *     signal lineage (the 4th acceleration class is a deploy-frequency
 *     spike); 8 imps/28d = negligible index cost.
 *   - vaswani-2017 (transformer): featured in the §37 /research hub
 *     "Foundational papers" bridge (guarded href); 146 imps / 1 click =
 *     0.68% CTR, the cluster's best performer.
 * The /research-paper index page is a hub, not a bibliography leaf, and is
 * always indexable (this policy governs leaves only).
 */

export type ResearchPaperDecision = "retain" | "noindex";
export type ResearchPaperVerdict =
  | "pending"
  | "retain-confirmed"
  | "flip-to-noindex";

export interface ResearchPaperPolicy {
  decision: ResearchPaperDecision;
  verdict: ResearchPaperVerdict;
  decidedAt: string | null;
  rule: {
    /** Post-lede window start (lede live 2026-08-15 evening). */
    windowStart: string;
    /** Minimum post-lede cluster impressions before the rule is decidable. */
    minImpressions: number;
    /** Cluster CTR strictly below this fraction triggers the flip. */
    maxCtr: number;
  };
  /** Leaf slugs that stay indexable under decision = "noindex". */
  keepIndexable: string[];
}

export const RESEARCH_PAPER_POLICY: ResearchPaperPolicy = {
  decision: "retain",
  verdict: "pending",
  decidedAt: null,
  rule: {
    windowStart: "2026-08-16",
    minImpressions: 3000,
    maxCtr: 0.002,
  },
  keepIndexable: [
    "forsgren-2018-accelerate-dora-research",
    "vaswani-2017-attention-is-all-you-need",
  ],
};

/** Is this leaf slug indexable under the current policy? */
export function researchPaperLeafIndexable(slug: string): boolean {
  if (RESEARCH_PAPER_POLICY.decision !== "noindex") return true;
  return RESEARCH_PAPER_POLICY.keepIndexable.includes(slug);
}

/**
 * Proxy-side check by pathname. Matches only leaf paths
 * (/research-paper/<slug>); the /research-paper index hub never matches.
 * Returns false for everything while decision = "retain" (inert).
 */
export function researchPaperLeafNoindexByPath(pathname: string): boolean {
  if (RESEARCH_PAPER_POLICY.decision !== "noindex") return false;
  const m = pathname.match(/^\/research-paper\/([^/]+?)\/?$/);
  if (!m) return false;
  try {
    return !RESEARCH_PAPER_POLICY.keepIndexable.includes(
      decodeURIComponent(m[1]),
    );
  } catch {
    return !RESEARCH_PAPER_POLICY.keepIndexable.includes(m[1]);
  }
}
