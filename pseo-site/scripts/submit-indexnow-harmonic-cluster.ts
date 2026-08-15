#!/usr/bin/env npx tsx
// One-off targeted IndexNow ping for the harmonic-cluster internal-link change
// (audit PA-30 win, commit b20022c7). Same preflight discipline as
// scripts/submit-indexnow.ts: verify the key file by CONTENT, not status.
const BASE_URL = "https://signals.gitdealflow.com";
const KEY = process.env.INDEXNOW_KEY || "22dfd6f8f816469b8c216bc7eaf8b936";
const URLS = [
  "/vs/harmonic-ai-vs-pitchbook",
  "/vs/harmonic-ai-vs-crunchbase",
  "/vs/harmonic-ai-vs-dealroom",
  "/vs/harmonic-ai-vs-tracxn",
  "/vs/harmonic-ai-vs-forager-ai",
  "/vs/harmonic-ai-vs-cb-insights",
  "/vs/fund-momentum-vs-harmonic-ai",
  "/vs/affinity-vs-harmonic-ai",
  "/vs/openvc-vs-harmonic-ai",
  "/vs/specter-vs-harmonic-ai",
  "/vs/signalrank-vs-harmonic-ai",
  "/alternatives/harmonic-ai",
  "/answers/free-harmonic-ai-alternative-2026",
  "/compare/gitdealflow-vs-harmonic-for-solo-angels",
  "/compare/vc-deal-flow-signal-vs-harmonic-ai",
].map((u) => BASE_URL + u);

async function main() {
  const keyUrl = `${BASE_URL}/${KEY}.txt`;
  const keyRes = await fetch(keyUrl);
  const keyBody = (await keyRes.text()).trim();
  if (!keyRes.ok || keyBody !== KEY) {
    console.warn(`IndexNow SKIPPED: key file invalid (HTTP ${keyRes.status}, body ${JSON.stringify(keyBody.slice(0, 40))} != key)`);
    return;
  }
  console.log(`Submitting ${URLS.length} URLs to IndexNow...`);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host: "signals.gitdealflow.com", key: KEY, keyLocation: keyUrl, urlList: URLS }),
  });
  const body = await res.text().catch(() => "(unreadable body)");
  if (res.ok) console.log(`IndexNow response: HTTP ${res.status} (${URLS.length} URLs submitted)`);
  else console.warn(`IndexNow REJECTED: HTTP ${res.status}, ${body.slice(0, 300)}`);
}

main();
