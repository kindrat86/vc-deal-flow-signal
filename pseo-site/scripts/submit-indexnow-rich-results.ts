#!/usr/bin/env npx tsx
// One-off targeted IndexNow ping for the §32 rich-result win (commit becea246):
// query-matched FAQ on affinity-vs-harmonic-ai + single-BreadcrumbList families.
// Same preflight discipline as scripts/submit-indexnow.ts: verify the key file
// by CONTENT, not status.
const BASE_URL = "https://signals.gitdealflow.com";
const KEY = process.env.INDEXNOW_KEY || "22dfd6f8f816469b8c216bc7eaf8b936";
const URLS = [
  // the target page of the query-matched FAQ
  "/vs/affinity-vs-harmonic-ai",
  // its reverse alias (Google may have either indexed; ping both)
  "/vs/harmonic-ai-vs-affinity",
  // representative pages of the de-duplicated breadcrumb families
  "/vs",
  "/compare",
  "/answers",
  "/alternatives",
  "/best",
  "/city",
  "/sector",
  "/tools",
  "/faq",
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
