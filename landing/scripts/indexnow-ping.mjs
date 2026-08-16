#!/usr/bin/env node
/**
 * Submit ALL apex (gitdealflow.com) sitemap URLs to IndexNow.
 *
 * Non-fatal by design: IndexNow is a crawl hint, not a correctness gate.
 * A failed or skipped ping must never block an otherwise-good landing deploy.
 *
 * Hardened vs. the retired scripts/indexnow-ping.sh:
 *   - recurses the sitemapindex into its shard(s) (was: one hardcoded file)
 *   - submits ALL on-host URLs (was: `head -100` of ~360, so ~72% never pinged)
 *   - drops cross-domain URLs (one foreign URL 422s the ENTIRE batch)
 *   - de-dupes (sitemapindex + shard can repeat a URL)
 *   - preflights the key file BY CONTENT, not just status (a soft-404 serves
 *     HTTP 200 with a wrong body and every submission still rejects)
 *
 * Usage: node scripts/indexnow-ping.mjs
 */

const HOST = "gitdealflow.com";
const BASE_URL = `https://${HOST}`;
const KEY = "22f462164f53aacbb1d0b771d018bcf1";
const KEY_URL = `${BASE_URL}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const LOC_REGEX = /<loc>(.*?)<\/loc>/gs;

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function collectUrls(xml) {
  const out = [];
  let m;
  while ((m = LOC_REGEX.exec(xml)) !== null) out.push(m[1]);
  return out;
}

const isShard = (u) =>
  u.includes("/sitemap/") ||
  u.endsWith("/sitemap.xml") ||
  u.endsWith("-sitemap.xml") ||
  u.endsWith("/sitemap-pages.xml") ||
  u.endsWith("/sitemap-i18n.xml") ||
  u.endsWith("/sitemap-images.xml") ||
  u.endsWith("/sitemap-videos.xml") ||
  u.endsWith("/news-sitemap.xml");

async function main() {
  const urls = [];
  try {
    const indexXml = await fetchText(`${BASE_URL}/sitemap.xml`);
    const entries = collectUrls(indexXml);
    for (const entry of entries) {
      if (!isShard(entry)) {
        urls.push(entry);
        continue;
      }
      try {
        const shardXml = await fetchText(entry);
        for (const u of collectUrls(shardXml)) urls.push(u);
      } catch (e) {
        console.warn(`[indexnow-ping] skipping unreachable shard ${entry}: ${e.message}`);
      }
    }
  } catch (e) {
    console.warn(`[indexnow-ping] could not fetch sitemap (site may not be deployed yet): ${e.message}`);
    return;
  }

  // Cross-domain filter: one foreign URL 422s the entire batch.
  const onHost = urls.filter((u) => u === BASE_URL || u.startsWith(`${BASE_URL}/`));
  const unique = [...new Set(onHost)];

  if (unique.length === 0) {
    console.warn("[indexnow-ping] no on-host URLs found, skipping.");
    return;
  }

  // Preflight key BY CONTENT, not status.
  try {
    const keyBody = (await fetchText(KEY_URL)).trim();
    if (keyBody !== KEY) {
      console.warn(
        `[indexnow-ping] SKIPPED: key file at ${KEY_URL} body != key ` +
          `(${JSON.stringify(keyBody.slice(0, 40))}). Every submission would be rejected.`
      );
      return;
    }
  } catch (e) {
    console.warn(`[indexnow-ping] SKIPPED: could not verify key file at ${KEY_URL}: ${e.message}`);
    return;
  }

  const payload = { host: HOST, key: KEY, keyLocation: KEY_URL, urlList: unique };
  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      console.log(`[indexnow-ping] OK HTTP ${res.status} — ${unique.length} apex URLs submitted.`);
      return;
    }
    const body = await res.text().catch(() => "(unreadable body)");
    console.warn(
      `[indexnow-ping] REJECTED HTTP ${res.status} (${unique.length} URLs): ${body.slice(0, 300) || "(empty)"}`
    );
  } catch (e) {
    console.warn(`[indexnow-ping] submission failed: ${e.message}`);
  }
}

main();
