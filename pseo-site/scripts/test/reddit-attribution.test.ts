import assert from "node:assert/strict";
import { createServer } from "node:http";
import { buildRedditPageview, captureRedditPageview } from "../../lib/reddit-attribution";

const tracked = new URL(
  "https://signals.gitdealflow.com/dataset?utm_source=reddit&utm_medium=organic&utm_campaign=datasets-2026-08-21&utm_content=prepost-datasets-2026-08-21",
);
const event = buildRedditPageview(tracked, "203.0.113.7");
assert.deepEqual(event, {
  event: "reddit_organic_pageview",
  distinct_id: "reddit:203.0.113.7",
  properties: {
    $host: "signals.gitdealflow.com",
    $pathname: "/dataset",
    $current_url: tracked.toString(),
    $referring_domain: "reddit",
    $ip: "203.0.113.7",
    utm_source: "reddit",
    utm_medium: "organic",
    utm_campaign: "datasets-2026-08-21",
    utm_content: "prepost-datasets-2026-08-21",
    source: "first-party-reddit-attribution",
  },
});

for (const url of [
  "https://signals.gitdealflow.com/dataset?utm_source=reddit&utm_medium=cpc&utm_campaign=x-2026-08-21&utm_content=prepost-x-2026-08-21",
  "https://signals.gitdealflow.com/dataset?utm_source=reddit&utm_medium=organic&utm_campaign=x&utm_content=prepost-x-2026-08-21",
  "https://signals.gitdealflow.com/dataset?utm_source=reddit&utm_medium=organic&utm_campaign=x-2026-08-21&utm_content=bad",
  "https://preview.vercel.app/dataset?utm_source=reddit&utm_medium=organic&utm_campaign=x-2026-08-21&utm_content=prepost-x-2026-08-21",
]) {
  assert.equal(buildRedditPageview(new URL(url), "203.0.113.7"), null);
}
assert.equal(buildRedditPageview(tracked, ""), null);

async function main() {
const received: { method?: string; body?: unknown } = {};
const server = createServer((request, response) => {
  let body = "";
  request.on("data", (chunk) => { body += chunk; });
  request.on("end", () => {
    received.method = request.method;
    received.body = JSON.parse(body);
    response.writeHead(200, { "content-type": "application/json" });
    response.end('{"status":1}');
  });
});
await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
assert.ok(address && typeof address !== "string");
const captured = await captureRedditPageview(
  event,
  `http://127.0.0.1:${address.port}/capture/`,
  "phc_test_key",
);
await new Promise<void>((resolve) => server.close(() => resolve()));
assert.equal(captured, true);
assert.equal(received.method, "POST");
assert.deepEqual(received.body, { api_key: "phc_test_key", ...event });

console.log("reddit attribution tests passed");
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
