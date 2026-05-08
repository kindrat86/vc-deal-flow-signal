import { BOOK } from "@/lib/book";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";
const FEED_URL = `${SITE}/book/podcast.xml`;
const COVER_URL = `${SITE}/downloads/seven-signals-cover.svg`;
const AUDIO_BASE = `${SITE}/downloads/audio`;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pubDate(daysAfterPublish: number): string {
  const d = new Date(BOOK.publishedDate + "T08:00:00Z");
  d.setUTCDate(d.getUTCDate() + daysAfterPublish);
  return d.toUTCString();
}

/**
 * iTunes/Apple Podcasts-compatible RSS 2.0 feed for the audiobook. Each
 * chapter is one episode; episode order is set by `<itunes:episode>` per the
 * Apple Podcasts spec (2021+ "serial" shows). Synthetic narration is
 * disclosed via `<itunes:author>` so directories can label appropriately.
 *
 * Audio files live under /downloads/audio/<slug>.mp3 and are produced by
 * the Cartesia narration cron — this feed enumerates every chapter unconditionally
 * so the feed shape is stable across narration backfills; player apps that hit a
 * 404 simply skip the episode and re-poll on next sync, which is the standard
 * podcast-app behavior.
 */
export async function GET() {
  const items = BOOK.chapters
    .map((c) => {
      const title = `${c.number === 0 ? "Introduction" : c.number === 8 ? "Methodology" : c.number === 9 ? "Replication appendix" : c.number === 10 ? "Conclusion" : `Signal ${c.number}`}: ${c.title}`;
      const url = `${SITE}/book/listen/${c.slug}`;
      const audioUrl = `${AUDIO_BASE}/${c.slug}.mp3`;
      // 1 minute ≈ 8400 bytes for ~112 kbps MP3, rough but valid for `length`.
      const approxBytes = c.estimatedReadMinutes * 8400 * 8;
      const minutes = c.estimatedReadMinutes;
      const seconds = minutes * 60;
      return `    <item>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(c.summary)}</description>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate(c.number)}</pubDate>
      <enclosure url="${audioUrl}" length="${approxBytes}" type="audio/mpeg"/>
      <itunes:title>${escapeXml(c.title)}</itunes:title>
      <itunes:subtitle>${escapeXml(c.subtitle)}</itunes:subtitle>
      <itunes:summary>${escapeXml(c.summary)}</itunes:summary>
      <itunes:duration>${seconds}</itunes:duration>
      <itunes:episode>${c.number + 1}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
      <itunes:author>${escapeXml(BOOK.authorName)}</itunes:author>
      <itunes:image href="${COVER_URL}"/>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>${escapeXml(BOOK.title)} — Audiobook</title>
    <link>${SITE}/book/listen</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>
    <language>${BOOK.language}</language>
    <description>${escapeXml(BOOK.description)} Synthetic neural narration via Cartesia — anonymous, consistent, ad-free, free to subscribe.</description>
    <itunes:author>${escapeXml(BOOK.authorName)}</itunes:author>
    <itunes:owner>
      <itunes:name>${escapeXml(BOOK.authorName)}</itunes:name>
      <itunes:email>signal@gitdealflow.com</itunes:email>
    </itunes:owner>
    <itunes:summary>${escapeXml(BOOK.description)}</itunes:summary>
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>serial</itunes:type>
    <itunes:image href="${COVER_URL}"/>
    <itunes:category text="Business">
      <itunes:category text="Investing"/>
    </itunes:category>
    <itunes:category text="Technology"/>
    <image>
      <url>${COVER_URL}</url>
      <title>${escapeXml(BOOK.title)}</title>
      <link>${SITE}/book/listen</link>
    </image>
    <copyright>CC-BY-4.0 — GitDealFlow ${new Date().getFullYear()}</copyright>
    <generator>VC Deal Flow Signal — Next.js 16 audiobook builder</generator>
    <podcast:locked>no</podcast:locked>
    <podcast:guid>${BOOK.isbn}</podcast:guid>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
