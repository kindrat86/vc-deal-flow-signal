import assert from "node:assert/strict";
import { buildRedditPageview } from "../../lib/reddit-attribution.ts";

const tracked = new URL(
  "https://signals.gitdealflow.com/dataset?utm_source=reddit&utm_medium=organic&utm_campaign=datasets-2026-08-21&utm_content=prepost-datasets-2026-08-21",
);
const event = buildRedditPageview(tracked, "203.0.113.7", "Mozilla/5.0");
assert.deepEqual(event, {
  event: "$pageview",
  distinct_id: "reddit:203.0.113.7",
  properties: {
    $host: "signals.gitdealflow.com",
    $pathname: "/dataset",
    $current_url: tracked.toString(),
    $referring_domain: "reddit",
    $ip: "203.0.113.7",
    $raw_user_agent: "Mozilla/5.0",
    utm_source: "reddit",
    utm_medium: "organic",
    utm_campaign: "datasets-2026-08-21",
    utm_content: "prepost-datasets-2026-08-21",
    source: "first-party-reddit-attribution",
  },
});

assert.equal(
  buildRedditPageview(new URL("https://signals.gitdealflow.com/dataset?utm_source=reddit&utm_medium=cpc&utm_campaign=x&utm_content=y"), "203.0.113.7", "Mozilla/5.0"),
  null,
);
assert.equal(
  buildRedditPageview(new URL("https://signals.gitdealflow.com/dataset?utm_source=reddit&utm_medium=organic&utm_campaign=x"), "203.0.113.7", "Mozilla/5.0"),
  null,
);
console.log("reddit attribution tests passed");
