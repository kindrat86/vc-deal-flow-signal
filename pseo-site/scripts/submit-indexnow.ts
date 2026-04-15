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
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "";

async function main() {
  // Only run on Vercel production deploys
  if (process.env.VERCEL && process.env.VERCEL_ENV !== "production") {
    console.log("Skipping IndexNow — not a production deploy.");
    return;
  }

  console.log("Fetching sitemap...");
  let sitemapXml: string;
  try {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    sitemapXml = await res.text();
  } catch (e) {
    console.log("Could not fetch sitemap (site may not be deployed yet), skipping IndexNow.");
    return;
  }

  // Simple regex extraction of <loc> URLs
  const urls: string[] = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(sitemapXml)) !== null) {
    urls.push(match[1]);
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
