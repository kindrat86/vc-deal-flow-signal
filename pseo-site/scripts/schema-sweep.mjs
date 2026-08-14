// One-off live schema sweep: samples URLs from every sitemap family, fetches
// each page, extracts + JSON-parses every <script type="application/ld+json">,
// and reports per-family @type coverage, invalid JSON, and boilerplate-only
// leaves (pages whose only schema is the global RootIdentity set).
// Usage: node scripts/schema-sweep.mjs [perFamily]

const BASE = "https://signals.gitdealflow.com";
const PER_FAMILY = Number(process.argv[2] || 2);

const SITEMAPS = [
  "/sitemap/core.xml",
  "/sitemap/high-intent.xml",
  "/sitemap/sectors.xml",
  "/sitemap/crossings.xml",
  "/sitemap/startups.xml",
  "/sitemap/content.xml",
];

// Types injected on (nearly) every page by RootIdentitySchema / layout. A leaf
// that emits ONLY these is "boilerplate-only", no page-specific structured data.
const GLOBAL_TYPES = new Set([
  "Organization", "WebSite", "WebPage", "SiteNavigationElement",
  "BreadcrumbList", "ListItem", "ContactPoint", "ImageObject",
  "SearchAction", "EntryPoint", "Offer", "OfferCatalog", "Service",
  "AggregateRating", "Audience", "Newspaper", "Periodical",
  "PropertyValue", "UnitPriceSpecification", "AskAction", "Person",
  "SoftwareApplication",
]);

// Paths that legitimately ship no page-specific JSON-LD: machine-readable
// data/endpoint surfaces (filtered by extension/prefix) and a small set of
// intentionally-minimal conversion / demo / redirect pages. These are excluded
// from the PASS/FAIL verdict so the tool only fails on a REAL regression
// (a content page that lost its structured data).
const INTENTIONAL_MINIMAL = new Set([
  "squeeze",        // conversion squeeze page, intentionally bare
  "a2a-demo",       // interactive demo, not a content target
  "friday-preview", // preview page, not a content target
]);
const DATA_EXT = /\.(json|jsonl|csv|txt|xml|js|svg|png|ico)$/i;
const isDataPath = (path) =>
  DATA_EXT.test(path) || path === "api" || path.startsWith("api/") ||
  path.startsWith(".well-known");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "schema-sweep-audit" } });
  const ct = res.headers.get("content-type") || "";
  return {
    status: res.status,
    redirected: res.redirected,
    isHtml: ct.includes("text/html"),
    body: res.status === 200 ? await res.text() : "",
  };
}

function extractLdJson(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) blocks.push(m[1].trim());
  return blocks;
}

function collectTypes(node, out) {
  if (Array.isArray(node)) { node.forEach((n) => collectTypes(n, out)); return; }
  if (node && typeof node === "object") {
    if (node["@type"]) {
      const t = node["@type"];
      (Array.isArray(t) ? t : [t]).forEach((x) => out.add(x));
    }
    for (const k of Object.keys(node)) collectTypes(node[k], out);
  }
}

async function main() {
  // 1. Gather URLs per family (first path segment).
  const families = new Map();
  for (const sm of SITEMAPS) {
    const { body } = await fetchText(BASE + sm);
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
    for (const loc of locs) {
      const path = loc.replace(BASE, "").replace(/^\//, "");
      const seg = path.split("/")[0] || "(home)";
      if (!families.has(seg)) families.set(seg, []);
      families.get(seg).push(loc);
    }
  }

  const famNames = [...families.keys()].sort();
  console.log(`\nDiscovered ${famNames.length} families across ${SITEMAPS.length} sitemaps:\n`);

  const results = [];
  for (const fam of famNames) {
    const urls = families.get(fam);
    // sample: first + spread
    const sample = [];
    const step = Math.max(1, Math.floor(urls.length / PER_FAMILY));
    for (let i = 0; i < urls.length && sample.length < PER_FAMILY; i += step) sample.push(urls[i]);

    for (const url of sample) {
      const path = url.replace(BASE, "").replace(/^\//, "");
      const { status, redirected, isHtml, body } = await fetchText(url);
      // Skip non-content surfaces from the verdict: data/endpoint paths,
      // redirects (the target is audited under its own canonical path), and
      // explicitly-intentional minimal pages.
      const skip =
        isDataPath(path) || redirected || !isHtml ||
        INTENTIONAL_MINIMAL.has(fam);
      if (status !== 200) {
        results.push({ fam, url, status, ok: false, skip, note: `HTTP ${status}` });
        continue;
      }
      const blocks = extractLdJson(body);
      const types = new Set();
      let parseErrors = 0;
      for (const b of blocks) {
        try { const j = JSON.parse(b); collectTypes(j, types); }
        catch { parseErrors++; }
      }
      const pageSpecific = [...types].filter((t) => !GLOBAL_TYPES.has(t));
      results.push({
        fam, url, status, skip, ok: parseErrors === 0,
        blocks: blocks.length, parseErrors,
        totalTypes: types.size,
        pageSpecific,
        boilerplateOnly: pageSpecific.length === 0,
      });
      await sleep(60);
    }
  }

  // Report
  console.log("FAMILY".padEnd(22), "blk", "json", "specific @types (beyond global)");
  console.log("-".repeat(100));
  for (const r of results) {
    if (r.skip) {
      const why = r.status !== 200 ? `redirect/HTTP ${r.status}` : "data/endpoint/intentional";
      console.log(`${r.fam.padEnd(22)} ⏭  skipped (${why})`);
      continue;
    }
    if (!r.ok || r.status !== 200) {
      console.log(`${r.fam.padEnd(22)} ❌ ${r.note || `parseErr=${r.parseErrors}`}  ${r.url}`);
      continue;
    }
    const flag = r.boilerplateOnly ? "⚠️ BOILERPLATE-ONLY  " + r.url : "";
    console.log(
      `${r.fam.padEnd(22)} ${String(r.blocks).padStart(3)}  ✓    ${r.pageSpecific.slice(0, 8).join(", ")}${r.pageSpecific.length > 8 ? " …" : ""} ${flag}`
    );
  }

  // Verdict counts ONLY genuine content pages (skipped rows excluded).
  const scored = results.filter((r) => !r.skip);
  const parseFails = scored.filter((r) => r.parseErrors > 0).length;
  const httpFails = scored.filter((r) => r.status !== 200).length;
  const boiler = scored.filter((r) => r.ok && r.boilerplateOnly).length;
  const skipped = results.length - scored.length;

  console.log("\n" + "=".repeat(100));
  console.log(`Sampled ${results.length} URLs across ${famNames.length} families (${scored.length} scored, ${skipped} skipped as data/redirect/intentional).`);
  console.log(`Invalid JSON-LD: ${parseFails} | Non-200: ${httpFails} | Boilerplate-only: ${boiler}`);
  const fail = parseFails + httpFails + boiler;
  console.log(fail === 0
    ? "✅ PASS, every scored content family ships valid, page-specific structured data."
    : "❌ FAIL, review the flagged rows above.");
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
