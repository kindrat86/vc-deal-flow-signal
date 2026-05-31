/**
 * Notify WebSub (PubSubHubbub) hubs that our feeds have updated.
 *
 * IndexNow handles Bing/Yandex/Seznam push (see submit-indexnow.ts).
 * WebSub handles RSS/Atom aggregators (Feedly, Inoreader, NewsBlur,
 * and any service subscribing to the pubsubhubbub.appspot.com or
 * superfeedr.com hubs). Together they collapse the new-content
 * indexing latency from "hours-to-days" to "seconds-to-minutes".
 *
 * Protocol: POST x-www-form-urlencoded `hub.mode=publish&hub.url=<topic>`
 * to each hub. The hub then fetches the topic URL and fans it out to
 * all subscribers. Spec: https://www.w3.org/TR/websub/
 *
 * Usage: npx tsx scripts/submit-websub.ts
 * Designed to run in CI or as a postbuild step.
 */

const BASE_URL = "https://signals.gitdealflow.com";

const HUBS = [
  "https://pubsubhubbub.appspot.com/",
  "https://pubsubhubbub.superfeedr.com/",
];

const TOPICS = [
  `${BASE_URL}/feed.xml`,
  `${BASE_URL}/atom.xml`,
  `${BASE_URL}/rss.xml`,
];

async function notify(hub: string, topic: string): Promise<void> {
  const body = new URLSearchParams({
    "hub.mode": "publish",
    "hub.url": topic,
  });
  try {
    const res = await fetch(hub, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    // The de-facto contract is HTTP 204 No Content on success. Some hubs
    // return 200 or 202; treat 2xx as success.
    if (res.status >= 200 && res.status < 300) {
      console.log(`WebSub OK: ${hub} ← ${topic} (HTTP ${res.status})`);
    } else {
      console.log(
        `WebSub non-2xx: ${hub} ← ${topic} (HTTP ${res.status}) — continuing`,
      );
    }
  } catch (e) {
    console.log(`WebSub failed: ${hub} ← ${topic}: ${e}`);
  }
}

async function main() {
  // Only run on Vercel production deploys.
  if (process.env.VERCEL && process.env.VERCEL_ENV !== "production") {
    console.log("Skipping WebSub — not a production deploy.");
    return;
  }

  console.log(
    `Notifying ${HUBS.length} hub(s) about ${TOPICS.length} topic(s)...`,
  );
  // Fan out: every hub for every topic. Total = 6 lightweight POSTs.
  await Promise.all(
    HUBS.flatMap((hub) => TOPICS.map((topic) => notify(hub, topic))),
  );
  console.log("WebSub notifications complete.");
}

main();
