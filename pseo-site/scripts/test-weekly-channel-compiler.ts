import assert from "node:assert/strict";
import { compileWeeklyChannelAssets } from "../lib/weekly-channel-compiler";

const assets = compileWeeklyChannelAssets({
  period: "2026-W34",
  publishedAt: "2026-08-20T09:00:00.000Z",
  title: "Developer tools are accelerating",
  summary: "Three developer-tool startups showed sustained engineering acceleration.",
  canonicalUrl: "https://signals.gitdealflow.com/reports/2026-W34",
  datasetUrl: "https://signals.gitdealflow.com/api/signals.csv",
  topSignals: [
    {
      name: "Example Labs",
      sector: "Developer tools",
      commitVelocityChange: "+84%",
      contributors: 24,
      signalType: "Infrastructure buildout",
      url: "https://github.com/example-labs",
    },
  ],
});

assert.deepEqual(Object.keys(assets).sort(), ["api", "card", "email", "mcp", "rss", "websub"]);
assert.equal(assets.api.json.period, "2026-W34");
assert.match(assets.api.csv, /Example Labs/);
assert.match(assets.rss, /<title>Developer tools are accelerating<\/title>/);
assert.ok(assets.websub.topics.includes("https://signals.gitdealflow.com/feed.json"));
assert.equal(assets.websub.deliveries.length, assets.websub.hubs.length * assets.websub.topics.length);
assert.deepEqual(assets.websub.deliveries[0], {
  hub: "https://pubsubhubbub.appspot.com/",
  payload: { "hub.mode": "publish", "hub.url": "https://signals.gitdealflow.com/feed.xml" },
});
assert.equal(assets.mcp.tool, "get_weekly_channel_asset");
assert.match(assets.email.subject, /Developer tools are accelerating/);
assert.equal(assets.card.headline, "Developer tools are accelerating");
assert.match(assets.card.alt, /Example Labs/);

console.log("weekly channel compiler: 6 native assets verified");
