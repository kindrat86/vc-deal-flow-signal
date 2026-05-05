import { posts } from "@/content/posts";
import { getDataLastModified } from "@/lib/data";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

// JSON Feed v1.1 — https://www.jsonfeed.org/version/1.1/
// Modern, machine-readable feed format complementing RSS at /feed.xml. Used by
// Inoreader, NetNewsWire, FeedBin, Feedly, and most LLM agents that prefer
// JSON over XML.
export async function GET() {
  const lastModified = getDataLastModified().toISOString();

  // Most recent first; cap at 50 to keep the feed lean.
  const items = [...posts]
    .filter((p) => p.date <= new Date().toISOString().slice(0, 10))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 50)
    .map((p) => ({
      id: `${BASE_URL}/blog/${p.slug}`,
      url: `${BASE_URL}/blog/${p.slug}`,
      title: p.title,
      content_text: p.summary || p.description,
      content_html: `<p>${(p.summary || p.description).replace(/</g, "&lt;")}</p>`,
      summary: p.description,
      date_published: new Date(p.date + "T09:00:00Z").toISOString(),
      date_modified: new Date(p.date + "T09:00:00Z").toISOString(),
      authors: [
        {
          name: "The Data Nerd",
          url: `${BASE_URL}/about`,
        },
      ],
      tags: p.relatedSectors,
      language: "en-US",
    }));

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "VC Deal Flow Signal — Blog",
    home_page_url: `${BASE_URL}/blog`,
    feed_url: `${BASE_URL}/feed.json`,
    description:
      "GitHub commit-velocity tracking for venture capital. Practical guides on engineering acceleration as a deal flow signal.",
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
    _last_modified: lastModified,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
