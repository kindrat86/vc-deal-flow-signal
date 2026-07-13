/**
 * Renders per-page agent-discoverability hints inside the page body. Pair with
 * the site-wide hints in app/layout.tsx (which only know the /md/ root) so
 * pillar pages advertise their *specific* Markdown mirror plus a link to the
 * Q&A subset relevant to the page.
 *
 * Browsers ignore <link> outside <head>, but HTML parsers, RSS readers, and
 * LLM crawlers (Common Crawl, GPTBot, ClaudeBot, PerplexityBot) read every
 * <link rel="alternate"> regardless of placement — Next.js 16's App Router
 * doesn't expose <head> from a child page, so emitting from the body is the
 * pragmatic option.
 */
import { supportsMdMirror } from "@/lib/md-mirror";

const SITE = "https://signals.gitdealflow.com";

interface Props {
  /** Path of the current page, e.g. "/methodology" or "/glossary". */
  path: string;
  /** Optional category to filter the Q&A dataset link (e.g. "methodology"). */
  qaCategory?: string;
}

export function AgentMirrorLinks({ path, qaCategory }: Props) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const hasMdMirror = supportsMdMirror(cleanPath);
  const mdHref = `${SITE}/md${cleanPath}`;
  const qaHref = qaCategory
    ? `${SITE}/qa.jsonl?category=${encodeURIComponent(qaCategory)}`
    : `${SITE}/qa.jsonl`;
  return (
    <>
      {hasMdMirror && (
        <link
          rel="alternate"
          type="text/markdown"
          href={mdHref}
          title={`Markdown mirror of ${cleanPath}`}
        />
      )}
      <link
        rel="alternate"
        type="application/x-ndjson"
        href={qaHref}
        title="Q&A dataset for this topic (CC BY 4.0)"
      />
    </>
  );
}
