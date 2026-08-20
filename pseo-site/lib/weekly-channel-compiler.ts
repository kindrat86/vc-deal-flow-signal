export type WeeklySignal = {
  period: string;
  publishedAt: string;
  title: string;
  summary: string;
  canonicalUrl: string;
  datasetUrl: string;
  topSignals: Array<{
    name: string;
    sector: string;
    commitVelocityChange: string;
    contributors: number;
    signalType: string;
    url: string;
  }>;
};

export type WeeklyChannelAssets = {
  api: { json: WeeklySignal; csv: string };
  rss: string;
  websub: {
    topics: string[];
    hubs: string[];
    deliveries: Array<{
      hub: string;
      payload: { "hub.mode": "publish"; "hub.url": string };
    }>;
  };
  mcp: { package: string; tool: string; description: string; example: string; assetUrl: string };
  email: { subject: string; preheader: string; text: string };
  card: { headline: string; body: string; cta: string; url: string; alt: string };
};

const BASE_URL = "https://signals.gitdealflow.com";
const HUBS = ["https://pubsubhubbub.appspot.com/", "https://pubsubhubbub.superfeedr.com/"];
const TOPICS = [`${BASE_URL}/feed.xml`, `${BASE_URL}/atom.xml`, `${BASE_URL}/rss.xml`, `${BASE_URL}/feed.json`];

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function csvCell(value: string | number): string {
  const source = String(value);
  return /[",\n]/.test(source) ? `"${source.replace(/"/g, '""')}"` : source;
}

export function compileWeeklyChannelAssets(signal: WeeklySignal): WeeklyChannelAssets {
  if (!signal.topSignals.length) throw new Error("Weekly signal needs at least one top signal.");
  const rows = signal.topSignals.map((item) => [item.name, item.sector, item.commitVelocityChange, item.contributors, item.signalType, item.url]);
  const csv = ["name,sector,commit_velocity_change,contributors,signal_type,url", ...rows.map((row) => row.map(csvCell).join(","))].join("\n") + "\n";
  const top = signal.topSignals[0];
  const subject = `${signal.title} | GitDealFlow weekly signal`;
  const preheader = `${top.name}: ${top.commitVelocityChange} commit velocity, ${top.contributors} contributors.`;
  const text = `${signal.title}\n\n${signal.summary}\n\nTop signal: ${top.name} (${top.sector})\n${top.commitVelocityChange} commit velocity, ${top.contributors} contributors, ${top.signalType}.\n\nRead the report: ${signal.canonicalUrl}\nDownload the data: ${signal.datasetUrl}`;

  return {
    api: { json: signal, csv },
    rss: `<item><title>${escapeXml(signal.title)}</title><link>${escapeXml(signal.canonicalUrl)}</link><guid isPermaLink="true">${escapeXml(signal.canonicalUrl)}</guid><pubDate>${new Date(signal.publishedAt).toUTCString()}</pubDate><description>${escapeXml(signal.summary)}</description></item>`,
    websub: {
      hubs: HUBS,
      topics: TOPICS,
      deliveries: HUBS.flatMap((hub) => TOPICS.map((topic) => ({
        hub,
        payload: { "hub.mode": "publish" as const, "hub.url": topic },
      }))),
    },
    mcp: { package: "@gitdealflow/mcp-signal", tool: "get_weekly_channel_asset", description: `Read the ${signal.period} weekly report and its machine-readable export.`, example: `get_weekly_channel_asset({ period: \"${signal.period}\" })`, assetUrl: `${BASE_URL}/api/weekly/${signal.period}.json` },
    email: { subject, preheader, text },
    card: { headline: signal.title, body: `${top.name}: ${top.commitVelocityChange} commit velocity with ${top.contributors} contributors. ${signal.summary}`, cta: "Read the weekly signal", url: signal.canonicalUrl, alt: `${signal.title}. Top signal: ${top.name}, ${top.commitVelocityChange} commit velocity.` },
  };
}
