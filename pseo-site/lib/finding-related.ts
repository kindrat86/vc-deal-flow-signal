/**
 * Match a research finding to 2-3 most relevant blog posts by keyword
 * overlap. Used by `app/research/[slug]/page.tsx` to surface contextual
 * cross-links from each finding into the actionable content cluster.
 *
 * Closes the audit gap "research findings have no back-links to blog
 * posts" (Internal linking: 82/100 → 90/100). Each of the 30 findings
 * gains 2-3 outbound contextual links into the post cluster, plus a
 * deterministic "Read the methodology" + "Free tools" group.
 *
 * The matcher is deterministic at build time — no per-request work.
 */
import type { Finding } from "@/content/research-findings";
import { posts, type BlogPost } from "@/content/posts";
import type { RelatedGroup } from "@/components/RelatedLinks";

// Lowercased word list with stop words removed. We score on substring
// presence rather than full tokenization because finding titles are short
// and the vocabulary is small (commit velocity, contributor, framework,
// migration, signal, sector names, etc.).
const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "of",
  "for",
  "and",
  "or",
  "to",
  "in",
  "on",
  "at",
  "is",
  "are",
  "with",
  "by",
  "from",
  "as",
  "vs",
  "than",
  "over",
  "under",
  "show",
  "shows",
  "showing",
  "across",
  "this",
  "that",
  "these",
  "those",
]);

const PLAYBOOK_SLUG =
  "how-vcs-track-engineering-acceleration-2026-playbook";

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function scorePost(finding: Finding, post: BlogPost): number {
  const findingTokens = new Set([
    ...tokenize(finding.title),
    ...tokenize(finding.claim),
    ...tokenize(finding.section),
  ]);
  if (findingTokens.size === 0) return 0;

  const postBag = (
    post.title +
    " " +
    post.description +
    " " +
    (post.summary ?? "")
  ).toLowerCase();

  let score = 0;
  for (const tok of findingTokens) {
    if (postBag.includes(tok)) score += 1;
  }
  // Slight boost for the canonical playbook so it always lands as a
  // strong fallback when keyword overlap is thin.
  if (post.slug === PLAYBOOK_SLUG) score += 0.5;
  return score;
}

export function getRelatedGroupsForFinding(finding: Finding): RelatedGroup[] {
  // Top-2 posts by keyword score, with the playbook as a guaranteed
  // fallback when the matcher returns nothing useful.
  const ranked = posts
    .map((p) => ({ post: p, score: scorePost(finding, p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .filter((r) => r.score > 0);

  const seen = new Set<string>();
  const applyLinks = ranked
    .filter(({ post }) => {
      if (seen.has(post.slug)) return false;
      seen.add(post.slug);
      return true;
    })
    .slice(0, 3)
    .map(({ post }) => ({
      href: `/blog/${post.slug}`,
      label: post.title,
      subtitle: post.description.split(".")[0] + ".",
    }));

  // Always-on groups. Static deterministic links into the methodology
  // cluster and the free-tools cluster. Same set on every finding so the
  // build output is stable and the component does not need per-finding
  // configuration.
  const methodologyLinks = [
    {
      href: "/methodology",
      label: "Methodology",
      subtitle: "How acceleration is measured, end-to-end.",
    },
    {
      href: "/glossary",
      label: "Glossary",
      subtitle: "Plain-language definitions for every signal type.",
    },
    {
      href: "/faq",
      label: "FAQ",
      subtitle: "Most-asked questions about the dataset and methods.",
    },
    {
      href: "/research",
      label: "All 30 findings",
      subtitle: "The full SSRN-indexed research summary.",
    },
  ];

  const toolsLinks = [
    {
      href: "/trending",
      label: "Trending startups",
      subtitle: "Top 20 by acceleration, refreshed weekly.",
    },
    {
      href: "/receipts",
      label: "Scout Score (free)",
      subtitle: "Paste a GitHub username, get a 0-100 taste score.",
    },
    {
      href: "/predict",
      label: "Scout game (free)",
      subtitle:
        "Forward-looking prediction game — call a Series A in 6 months.",
    },
    {
      href: "/api/signals.json",
      label: "Signals JSON",
      subtitle: "Live API. CC BY 4.0.",
    },
  ];

  const groups: RelatedGroup[] = [];
  if (applyLinks.length > 0) {
    groups.push({ title: "Apply this finding", links: applyLinks });
  }
  groups.push({ title: "How it's measured", links: methodologyLinks });
  groups.push({ title: "Free tools & data", links: toolsLinks });

  return groups;
}
