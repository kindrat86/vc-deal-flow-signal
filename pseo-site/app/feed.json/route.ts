import { posts } from "@/content/posts";
import { getDataLastModified } from "@/lib/data";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

/**
 * /feed.json, JSON Feed v1.1 (https://www.jsonfeed.org/version/1.1/) for the
 * blog stream.
 *
 * Companion to /rss.xml + /atom.xml + /feed.xml. JSON Feed is preferred by
 * Inoreader, NetNewsWire, FeedBin, Feedly's modern reader, and most
 * LLM/agent retrieval pipelines that ingest JSON natively without an XML
 * parser. This is the "agent-native" sibling of the XML feeds.
 *
 * What's in here that goes beyond the JSON Feed core spec:
 * - `content_html` carries summary + key-stats + references inline so an
 *   agent can cite a post without a second fetch.
 * - `image` + `banner_image` per item for richer reader cards.
 * - `_gitdealflow` extension namespace exposes venture-specific metadata
 *   (related sectors, key stats, references, FAQ count, citation block)
 *   so an agent that knows our schema can use it for citation directly.
 * - `Link` header advertises RSS/Atom siblings + the broader feed catalog.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function GET() {
  const lastModified = getDataLastModified().toISOString();

  // Most recent first; cap at 50 to keep the feed lean for readers and
  // small enough that retrieval pipelines can ingest in a single pass.
  const items = [...posts]
    .filter((p) => p.date <= new Date().toISOString().slice(0, 10))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 50)
    .map((p) => {
      const url = `${BASE_URL}/blog/${p.slug}`;
      const summaryText = p.summary || p.description;

      // content_html is the agent-citable body. We hand-build a short HTML
      // doc that carries the summary, key stats (if any), references (if any),
      // and the canonical link, so an LLM that consumes the feed can cite
      // the page accurately without a follow-up fetch.
      const keyStatsHtml = (p.keyStats ?? [])
        .map(
          (k) =>
            `<li><strong>${escapeHtml(k.value)}</strong>: ${escapeHtml(
              k.label,
            )}${k.context ? ` <em>(${escapeHtml(k.context)})</em>` : ""}</li>`,
        )
        .join("");
      const refsHtml = (p.references ?? [])
        .slice(0, 5)
        .map(
          (r) =>
            `<li>[${escapeHtml(r.label)}] <a href="${escapeHtml(
              r.url,
            )}">${escapeHtml(r.title)}</a>: ${escapeHtml(r.source)}</li>`,
        )
        .join("");

      const contentHtml = [
        `<p>${escapeHtml(summaryText)}</p>`,
        keyStatsHtml ? `<h3>Key stats</h3><ul>${keyStatsHtml}</ul>` : "",
        refsHtml ? `<h3>References</h3><ul>${refsHtml}</ul>` : "",
        `<p><a href="${url}">Read the full post →</a></p>`,
      ]
        .filter(Boolean)
        .join("\n");

      return {
        id: url,
        url,
        external_url: undefined,
        title: p.title,
        content_html: contentHtml,
        content_text: summaryText,
        summary: p.description,
        // OG image renders an auto-generated card per slug.
        image: `${BASE_URL}/blog/${p.slug}/opengraph-image`,
        banner_image: `${BASE_URL}/blog/${p.slug}/opengraph-image`,
        date_published: new Date(p.date + "T09:00:00Z").toISOString(),
        date_modified: new Date(p.date + "T09:00:00Z").toISOString(),
        authors: [
          {
            name: "The Data Nerd",
            url: `${BASE_URL}/about`,
            avatar: `${BASE_URL}/icon.png`,
          },
        ],
        tags: p.relatedSectors,
        language: "en-US",
        // Publisher-namespaced extension. Agents that know the namespace can
        // cite richer than the core spec allows; agents that don't simply
        // ignore the underscored field per JSON Feed v1.1 §rules.
        _gitdealflow: {
          slug: p.slug,
          relatedSectors: p.relatedSectors,
          keyStats: p.keyStats ?? [],
          referencesCount: p.references?.length ?? 0,
          faqsCount: p.faqs?.length ?? 0,
          citation: `The Data Nerd (${p.date.slice(0, 4)}). "${p.title}". VC Deal Flow Signal. ${url}`,
          license: "https://creativecommons.org/licenses/by/4.0/",
        },
      };
    });

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "VC Deal Flow Signal, Blog",
    home_page_url: `${BASE_URL}/blog`,
    feed_url: `${BASE_URL}/feed.json`,
    description:
      "GitHub commit-velocity tracking for venture capital. Practical guides on engineering acceleration as a deal flow signal, written for readers who want earlier public signal, clearer timing, and less noise.",
    user_comment:
      "JSON Feed v1.1. Companion XML feeds at /rss.xml and /atom.xml. Catalog of every feed (per-stream × per-format) at /.well-known/feeds.json.",
    icon: `${BASE_URL}/icon.png`,
    favicon: `${BASE_URL}/favicon.ico`,
    language: "en-US",
    authors: [
      {
        name: "The Data Nerd",
        url: `${BASE_URL}/about`,
        avatar: `${BASE_URL}/icon.png`,
      },
    ],
    items,
    _gitdealflow: {
      stream: "blog",
      itemCount: items.length,
      lastModified,
      license: "https://creativecommons.org/licenses/by/4.0/",
      siblings: {
        rss: `${BASE_URL}/rss.xml`,
        atom: `${BASE_URL}/atom.xml`,
        sitemap: `${BASE_URL}/news-sitemap.xml`,
      },
      otherStreams: {
        predicted: `${BASE_URL}/predicted/feed.json`,
        answers: `${BASE_URL}/answers/feed.json`,
        research: `${BASE_URL}/research/feed.json`,
      },
      catalog: `${BASE_URL}/.well-known/feeds.json`,
    },
    // JSON Feed v1.1 `hubs` (spec §top-level): array of {type, url}. This is
    // the spec-compliant WebSub advertisement, parity with the 3 <link
    // rel="hub"> entries in /rss.xml + /atom.xml so a WebSub-aware reader can
    // subscribe for push updates from the JSON feed too. (Previously carried
    // only as a non-standard `_hubs` string array, which readers ignore.)
    hubs: [
      { type: "WebSub", url: "https://pubsubhubbub.appspot.com/" },
      { type: "WebSub", url: "https://pubsubhubbub.superfeedr.com/" },
      { type: "WebSub", url: "https://websubhub.com/" },
    ],
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
      Link: [
        `<${BASE_URL}/feed.json>; rel="self"; type="application/feed+json"`,
        `<${BASE_URL}/rss.xml>; rel="alternate"; type="application/rss+xml"`,
        `<${BASE_URL}/atom.xml>; rel="alternate"; type="application/atom+xml"`,
        `<${BASE_URL}/.well-known/feeds.json>; rel="related"; type="application/json"; title="Feed catalog"`,
        `<https://creativecommons.org/licenses/by/4.0/>; rel="license"`,
      ].join(", "),
    },
  });
}
