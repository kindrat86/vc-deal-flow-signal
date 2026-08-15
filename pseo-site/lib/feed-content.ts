/**
 * Shared markdown-ish body -> HTML renderer for full-text feed syndication.
 *
 * Mirrors the block rules of app/blog/[slug]/page.tsx so feed readers and
 * Flipboard's RSS ingest see the same document the live page renders:
 *   - "## Heading"            -> <h2>
 *   - "1. ..." ordered blocks -> <ol><li>
 *   - "**Label:** text"       -> <p><strong>Label:</strong> text</p>
 *   - everything else         -> <p>
 * Inline rules mirror renderInline(): [text](url) links + [1] citation
 * markers (citations resolve to the on-page #references anchor).
 *
 * Used by /feed.xml (content:encoded) and /atom.xml (content type="html").
 * Flipboard's RSS guidelines require full-text items; excerpt-only feeds
 * fail their human review (session-verified 2026-08-15, do not regress).
 */

const BASE_URL = "https://signals.gitdealflow.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Inline: markdown links + citation markers, everything else escaped. */
function renderInlineHtml(text: string): string {
  const tokenRe = /\[([^\]]+)\]\(([^)]+)\)|\[(\d+)\]/g;
  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(text)) !== null) {
    out += escapeHtml(text.slice(last, m.index));
    if (m[2]) {
      out += `<a href="${escapeHtml(m[2])}">${escapeHtml(m[1])}</a>`;
    } else if (m[3]) {
      // Citation marker: point at the references section on the live page.
      out += `<sup><a href="${BASE_URL}/blog/#references">[${m[3]}]</a></sup>`;
    } else {
      out += escapeHtml(m[0]);
    }
    last = m.index + m[0].length;
  }
  out += escapeHtml(text.slice(last));
  return out;
}

/**
 * Render a full post body to feed-safe HTML, capped so a single heavy post
 * cannot bloat the feed beyond what syndicators will accept. Flipboard
 * tolerates long bodies; the cap exists to bound feed size, not to truncate
 * normal posts (avg post body renders well under the cap).
 */
export function renderPostBodyHtml(post: {
  body: string;
  slug: string;
}): string {
  const MAX_CHARS = 30_000;
  const html = post.body
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("## ")) {
        return `<h2>${renderInlineHtml(trimmed.slice(3))}</h2>`;
      }
      const boldLabel = trimmed.match(/^\*\*(.+?)\*\*:?\s*([\s\S]*)/);
      if (boldLabel) {
        return `<p><strong>${renderInlineHtml(boldLabel[1])}:</strong> ${renderInlineHtml(
          boldLabel[2],
        )}</p>`;
      }
      if (trimmed.match(/^\d+\.\s/)) {
        const items = trimmed
          .split("\n")
          .map((line) => line.replace(/^\d+\.\s+/, ""));
        return `<ol>${items
          .map((i) => `<li>${renderInlineHtml(i)}</li>`)
          .join("")}</ol>`;
      }
      return `<p>${renderInlineHtml(trimmed)}</p>`;
    })
    .join("\n");
  if (html.length <= MAX_CHARS) return html;
  // Truncate at the last safe boundary before the cap.
  const cut = html.slice(0, MAX_CHARS);
  const lastClose = Math.max(cut.lastIndexOf("</p>"), cut.lastIndexOf("</h2>"), cut.lastIndexOf("</li>"));
  return cut.slice(0, lastClose + 4) + `\n<p><a href="${BASE_URL}/blog/${post.slug}">Read the full analysis</a></p>`;
}
