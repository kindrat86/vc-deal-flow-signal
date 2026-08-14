/**
 * Content-freshness overlay for blog posts.
 *
 * `date` on a BlogPost is the PUBLISHED date and never changes. This file
 * records when the PROSE / statistics / references were last substantively
 * revised, a content-level freshness signal that is distinct from the weekly
 * dataset refresh (`getDataLastModified()`, which reflects `data/startups.json`
 * mtime, not editorial revision).
 *
 * The quarterly `gitdealflow-blog-freshen` cron is the only writer of this map:
 * it reviews the evergreen cornerstone posts in `TOP_BLOG_POSTS`, refreshes any
 * stale figures (startup counts, sector counts, quarter references, broken
 * links) and bumps `lastUpdated` to the revision date. Hand-authored revisions
 * can also add an entry directly.
 *
 * Rendering merge order for "last updated":
 *   postFreshness[slug].lastUpdated  (content revision, if any)
 *   else post.date                   (published date)
 * JSON-LD `dateModified` / `lastReviewed` already fold in the weekly dataset
 * refresh, so content revision + data refresh both surface correctly.
 */

export interface PostFreshness {
  /** YYYY-MM-DD the prose/statistics were last substantively revised. */
  lastUpdated?: string;
  /** One-line note of what changed on the most recent revision. */
  refreshNote?: string;
}

export const postFreshness: Record<string, PostFreshness> = {
  // Populated by the quarterly gitdealflow-blog-freshen cron and/or manual edits.
};

/**
 * Evergreen cornerstone posts, ranked by inbound internal-link equity (from
 * `data/internal-links.json`) plus pillar centrality. These are the posts the
 * quarterly refresh cron reviews, the long-tail launch/announcement posts are
 * deliberately excluded (they are historical records, not ranking surfaces).
 */
export const TOP_BLOG_POSTS: string[] = [
  "ai-startup-signals-2026", // 965 inbound internal links, dominant sector deep-dive
  "source-startup-deals-before-crunchbase", // 340, deal-sourcing cornerstone
  "startup-engineering-metrics-investors-should-track", // 338, methodology cornerstone
  "i-tracked-369-startup-github-orgs-six-months", // 336, operator-notes flagship
  "how-vcs-track-engineering-acceleration-2026-playbook", // 7,043 words, flagship playbook
  "what-is-deal-flow-signal", // 20, core definition, high query match
  "47-alternative-data-sources-angel-investors-2026", // 2,493 words, long-form reference
  "enterprise-saas-github-signal-patterns", // sector taxonomy, benchmark-heavy
  "what-is-engineering-acceleration", // 2,077 words, core definition
  "github-due-diligence-for-vcs", // due-diligence pillar cornerstone
];

/**
 * Effective content-level "last updated" date for a post.
 * Returns the later of the recorded content revision and the published date,
 * so a missing/older revision safely falls back to publication.
 */
export function getPostLastUpdated(slug: string, publishedDate: string): string {
  const lu = postFreshness[slug]?.lastUpdated;
  if (!lu) return publishedDate;
  return lu > publishedDate ? lu : publishedDate;
}
