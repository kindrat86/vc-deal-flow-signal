/**
 * Submit all sitemap URLs to IndexNow after a successful build.
 *
 * Fetches the sitemap index, recurses into every sub-sitemap, and submits
 * the union of all <loc> URLs to the IndexNow API. This ensures Bing,
 * Yandex, and other participating search engines re-index every page on
 * each deploy.
 *
 * Usage: npx tsx scripts/submit-indexnow.ts
 * Designed to run in CI or as a postbuild step. INDEXNOW_KEY env var
 * required.
 */

const BASE_URL = "https://signals.gitdealflow.com";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "";

const LOC_REGEX = /<loc>(.*?)<\/loc>/g;

async function fetchUrlsFromSitemap(url: string): Promise<string[]> {
  const res = await fetch(url);
  if (!res.ok) return [];
  const xml = await res.text();
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = LOC_REGEX.exec(xml)) !== null) {
    out.push(m[1].trim());
  }
  return out;
}

async function main() {
  // Only run on Vercel production deploys (or when explicitly forced).
  const onVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
  const isProd = process.env.VERCEL_ENV === "production";
  const force = process.env.INDEXNOW_FORCE === "1";
  if (onVercel && !isProd && !force) {
    console.log("Skipping IndexNow — not a production deploy.");
    return;
  }
  if (!INDEXNOW_KEY) {
    console.log("Skipping IndexNow — INDEXNOW_KEY env var not set.");
    return;
  }

  console.log("Fetching sitemap index...");
  const indexUrls = await fetchUrlsFromSitemap(`${BASE_URL}/sitemap.xml`);

  // sitemap.xml is a <sitemapindex> pointing to sub-sitemaps. Each <loc>
  // there is a sub-sitemap URL (e.g. /sitemap/sectors.xml). If a <loc>
  // looks like a page URL (no /sitemap/), treat it as a final URL.
  const subSitemaps: string[] = [];
  const directPageUrls: string[] = [];
  for (const u of indexUrls) {
    if (u.endsWith(".xml") && u.includes("/sitemap")) subSitemaps.push(u);
    else directPageUrls.push(u);
  }

  console.log(`Sitemap index → ${subSitemaps.length} sub-sitemaps + ${directPageUrls.length} direct URLs`);

  const allUrls: string[] = [...directPageUrls];
  for (const sub of subSitemaps) {
    const urls = await fetchUrlsFromSitemap(sub);
    console.log(`  ${sub} → ${urls.length} URLs`);
    allUrls.push(...urls);
  }

  // Deduplicate
  const unique = Array.from(new Set(allUrls));
  if (unique.length === 0) {
    console.log("No URLs found, skipping.");
    return;
  }

  // IndexNow limit: 10,000 URLs per submission. We're well under but batch
  // defensively in case the dataset grows.
  const BATCH_SIZE = 9000;
  let submitted = 0;
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    const payload = {
      host: "signals.gitdealflow.com",
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: batch,
    };
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(`IndexNow batch ${i / BATCH_SIZE + 1}: HTTP ${res.status} (${batch.length} URLs)`);
      if (res.status === 200 || res.status === 202) submitted += batch.length;
    } catch (e) {
      console.log(`IndexNow batch ${i / BATCH_SIZE + 1} failed: ${e}`);
    }
  }
  console.log(`IndexNow done: ${submitted}/${unique.length} URLs submitted`);
}

main();
