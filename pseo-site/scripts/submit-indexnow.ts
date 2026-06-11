/**
 * Submit all sitemap URLs to IndexNow after a successful build.
 *
 * Fetches the live sitemap.xml, extracts all URLs, and submits them
 * to the IndexNow API in a single batch. This ensures Bing, Yandex,
 * and other participating search engines index new pages immediately.
 *
 * Usage: npx tsx scripts/submit-indexnow.ts
 * Designed to run in CI or as a postbuild step.
 */

const BASE_URL = "https://signals.gitdealflow.com";
// IndexNow keys are public by design (the protocol serves them at
// /<key>.txt), so the env var is just an override. The default must match
// public/22dfd6f8f816469b8c216bc7eaf8b936.txt — without that file on THIS
// host every submission is rejected (key existed only on the apex until
// 2026-06-11, which is why submissions returned 400/403).
const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "22dfd6f8f816469b8c216bc7eaf8b936";

async function main() {
  // Only run on Vercel production deploys
  if (process.env.VERCEL && process.env.VERCEL_ENV !== "production") {
    console.log("Skipping IndexNow — not a production deploy.");
    return;
  }

  console.log("Fetching sitemap-index...");
  let indexXml: string;
  try {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    indexXml = await res.text();
  } catch {
    console.log("Could not fetch sitemap (site may not be deployed yet), skipping IndexNow.");
    return;
  }

  // Index entries reference sub-sitemaps. Recurse into each one to
  // collect actual page URLs. Without this we submit ~6 sitemap-shard
  // URLs (which IndexNow accepts but doesn't index pages from), instead
  // of the 1,000+ real pages we want indexed.
  const SHARD_REGEX = /<loc>(.*?)<\/loc>/g;
  const shards: string[] = [];
  let shardMatch;
  while ((shardMatch = SHARD_REGEX.exec(indexXml)) !== null) {
    shards.push(shardMatch[1]);
  }

  const urls: string[] = [];
  for (const shardUrl of shards) {
    // If the shard is itself a page URL (sitemap-index containing flat
    // URLs as fallback) just keep it. Otherwise recurse.
    const isShard =
      shardUrl.includes("/sitemap/") ||
      shardUrl.endsWith("/sitemap.xml") ||
      shardUrl.endsWith("-sitemap.xml") ||
      shardUrl.endsWith("/sitemap-i18n.xml") ||
      shardUrl.endsWith("/sitemap-images.xml") ||
      shardUrl.endsWith("/sitemap-videos.xml") ||
      shardUrl.endsWith("/news-sitemap.xml");
    if (!isShard) {
      urls.push(shardUrl);
      continue;
    }
    try {
      const r = await fetch(shardUrl);
      const xml = await r.text();
      const inner = /<loc>(.*?)<\/loc>/g;
      let m;
      while ((m = inner.exec(xml)) !== null) urls.push(m[1]);
    } catch {
      // Skip unreachable shard but continue with the rest.
    }
  }

  if (urls.length === 0) {
    console.log("No URLs found in sitemap, skipping.");
    return;
  }

  console.log(`Submitting ${urls.length} URLs to IndexNow...`);
  const payload = {
    host: "signals.gitdealflow.com",
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log(`IndexNow response: HTTP ${res.status} (${urls.length} URLs submitted)`);
  } catch (e) {
    console.log(`IndexNow submission failed: ${e}`);
  }
}

main();
