/**
 * Engine Room, RSS 2.0 + iTunes podcast feed.
 *
 * Brunson DotCom Secrets Ch 11, Phase 6 ("change the selling environment").
 * The buyer subscribes to this URL in Apple Podcasts / Spotify / Overcast /
 * any podcast or RSS reader. From that point forward the rhythm arrives in
 * a different app from email, that IS the environment shift.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 3600;

const SITE = "https://signals.gitdealflow.com";
const FEED_URL = `${SITE}/post-90/feed.xml`;
const CHANNEL_TITLE = "Engine Room, VC Deal Flow Signal";
const CHANNEL_DESC =
  "The post-90 cohort home for VC Deal Flow Signal. Weekly synthetic-voice voice memo on the single sharpest GitHub-acceleration break, plus the monthly founder talk and quarterly State-of-the-Engine post-mortem. Methodology, not personality. Anonymity-safe Cartesia voice, panel data, falsifiable predictions.";

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function rfc2822(d: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getUTCDay()]}, ${pad(d.getUTCDate())} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} GMT`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function nextSunday(after: Date): Date {
  const d = new Date(Date.UTC(after.getUTCFullYear(), after.getUTCMonth(), after.getUTCDate(), 9, 0, 0));
  while (d.getUTCDay() !== 0 || d.getTime() <= after.getTime()) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return d;
}

function firstTuesdayOfMonth(year: number, month0: number): Date {
  const d = new Date(Date.UTC(year, month0, 1, 16, 0, 0));
  while (d.getUTCDay() !== 2) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return d;
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d.getTime());
  r.setUTCMonth(r.getUTCMonth() + n);
  return r;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d.getTime());
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

type Episode = {
  guid: string;
  title: string;
  description: string;
  pubDate: Date;
  link: string;
  duration?: string;
  episodeType?: "trailer" | "full" | "bonus";
};

function buildEpisodes(now: Date): Episode[] {
  const items: Episode[] = [];

  items.push({
    guid: `${SITE}/post-90#welcome`,
    title: "Welcome to the Engine Room",
    description:
      "If you've crossed Day 90 of the signal rhythm, the relationship moves out of email and into your podcast app, your calendar, and a public ledger. This trailer explains the three rituals, the synthetic-voice rule, and what to expect from here. The first Sunday Brief drops the next time the calendar flips to Sunday.",
    pubDate: now,
    link: `${SITE}/post-90`,
    duration: "2:00",
    episodeType: "trailer",
  });

  let s = now;
  for (let i = 0; i < 4; i++) {
    s = nextSunday(s);
    const slug = s.toISOString().slice(0, 10);
    items.push({
      guid: `${SITE}/post-90/sunday-brief/${slug}`,
      title: `Sunday Brief, week of ${slug}`,
      description:
        "Five-minute synthetic-voice voice memo. The week's single sharpest GitHub-acceleration break across 350+ venture-backed orgs. What shifted on the panel. One thing to put on the radar before Monday's public Acceleration Watch.",
      pubDate: s,
      link: `${SITE}/weekly`,
      duration: "5:00",
      episodeType: "full",
    });
  }

  for (let i = 1; i <= 4; i++) {
    const ref = addMonths(now, i);
    const t = firstTuesdayOfMonth(ref.getUTCFullYear(), ref.getUTCMonth());
    const monthLabel = t.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
    items.push({
      guid: `${SITE}/state-of-github/${t.toISOString().slice(0, 7)}`,
      title: `Founder talk, ${monthLabel}`,
      description:
        "Monthly address. What the panel showed across 350+ venture-backed orgs this month, what shifted in the false-positive rate, and one falsifiable prediction on the record. Same content cadence as the State of GitHub written archive, now in audio + scheduled-event form.",
      pubDate: t,
      link: `${SITE}/state-of-github`,
      duration: "10:00",
      episodeType: "full",
    });
  }

  const QUARTERS = [
    { days: 90, label: "Day 90, first quarterly post-mortem" },
    { days: 180, label: "Day 180, six-month post-mortem" },
    { days: 270, label: "Day 270, three-quarter post-mortem" },
    { days: 365, label: "Day 365, one-year post-mortem" },
  ];
  for (const q of QUARTERS) {
    const d = addDays(now, q.days);
    items.push({
      guid: `${SITE}/post-90/quarter/${d.toISOString().slice(0, 10)}`,
      title: q.label,
      description:
        "Quarterly State-of-the-Engine post-mortem. Long-form written + audio. Reports back on the previous quarter's specific prediction (resolved on the public Receipts ledger) and lays a fresh falsifiable prediction for the next 90 days.",
      pubDate: d,
      link: `${SITE}/wins`,
      duration: "12:00",
      episodeType: "full",
    });
  }

  return items;
}

function renderItem(ep: Episode): string {
  const parts: string[] = [];
  parts.push("    <item>");
  parts.push(`      <title>${escape(ep.title)}</title>`);
  parts.push(`      <link>${escape(ep.link)}</link>`);
  parts.push(`      <guid isPermaLink="false">${escape(ep.guid)}</guid>`);
  parts.push(`      <pubDate>${rfc2822(ep.pubDate)}</pubDate>`);
  parts.push(`      <description><![CDATA[${ep.description}]]></description>`);
  parts.push(`      <itunes:summary>${escape(ep.description)}</itunes:summary>`);
  parts.push(`      <itunes:author>VC Deal Flow Signal</itunes:author>`);
  if (ep.duration) parts.push(`      <itunes:duration>${ep.duration}</itunes:duration>`);
  if (ep.episodeType) parts.push(`      <itunes:episodeType>${ep.episodeType}</itunes:episodeType>`);
  parts.push(`      <itunes:explicit>false</itunes:explicit>`);
  parts.push("    </item>");
  return parts.join("\n");
}

export async function GET() {
  const now = new Date();
  const episodes = buildEpisodes(now);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escape(CHANNEL_TITLE)}</title>
    <link>${SITE}/post-90</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description><![CDATA[${CHANNEL_DESC}]]></description>
    <language>en-us</language>
    <copyright>CC BY 4.0, VC Deal Flow Signal</copyright>
    <lastBuildDate>${rfc2822(now)}</lastBuildDate>
    <pubDate>${rfc2822(now)}</pubDate>
    <generator>VC Deal Flow Signal, Engine Room feed</generator>
    <itunes:author>VC Deal Flow Signal</itunes:author>
    <itunes:summary>${escape(CHANNEL_DESC)}</itunes:summary>
    <itunes:owner>
      <itunes:name>VC Deal Flow Signal</itunes:name>
      <itunes:email>signals@gitdealflow.com</itunes:email>
    </itunes:owner>
    <itunes:image href="${SITE}/icon.png" />
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <itunes:category text="Business">
      <itunes:category text="Investing" />
    </itunes:category>
    <itunes:category text="Technology" />
    <image>
      <url>${SITE}/icon.png</url>
      <title>${escape(CHANNEL_TITLE)}</title>
      <link>${SITE}/post-90</link>
    </image>
${episodes.map(renderItem).join("\n")}
  </channel>
</rss>
`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      Link: `<${FEED_URL}>; rel="canonical"`,
    },
  });
}
