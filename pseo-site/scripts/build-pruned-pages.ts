/**
 * build-pruned-pages.ts — deterministic zero-impression sitemap prune (2026-08-16).
 *
 * Computes the dead-weight leaf set from GSC 90d by-page data + the live
 * sitemap inventory and writes content/pruned-pages.ts. The generated module is
 * consumed by app/sitemap/[id]/route.ts and app/sitemap.txt/route.ts: pruned
 * URLs LEAVE the sitemaps but stay live, internally linked, and crawlable
 * (same convention as the niche-down prune in content/niches.ts, §48). This is
 * a sitemap-level cut, not a noindex: direct/referral/agent traffic keeps
 * working and a future re-tier can re-add any URL by re-running this script.
 *
 * Rule: prune when a URL is (a) advertised by one of the 5 page shards,
 * (b) in a prune-eligible leaf family, (c) BELOW the impression threshold in
 * GSC over the trailing 90d window (default: zero impressions AND zero clicks;
 * --min-imps 10 prunes <10-impression pages), and (d) not protected. Protected:
 *  - young tokens in the path (current month/week/quarter: 2026-08, 2026-w3x,
 *    -q3-2026) so freshly shipped pages can never be pruned before their first
 *    crawl-verdict window;
 *  - blog posts dated >= 2026-07-01 in content/posts.ts (TOFU pillar etc.) and
 *    the claims-frozen slug i-tracked-369-startup-github-orgs-six-months;
 *  - locale surfaces (/ja /ko /zh ...), and strategic families: /vs /compare
 *    /answers /for /summit /parables /tools /research /research-paper /signal
 *    /fund /founder /topics /niche-down /startups /startups-to-watch /sector
 *    /markets /integrations /learn /free (all outside the ELIGIBLE list below).
 *
 * Run from pseo-site (cwd = pseo-site):
 *   npx tsx scripts/build-pruned-pages.ts
 *   npx tsx scripts/build-pruned-pages.ts --dry-run
 *   npx tsx scripts/build-pruned-pages.ts --min-imps 10 --dry-run
 *   npx tsx scripts/build-pruned-pages.ts --gsc <path> --inventory <path>
 *
 * Re-run quarterly or after template retirements. The output is committed and
 * the §53 guard pins canaries + a size band, so a stale generated file cannot
 * deploy silently. GSC snapshot default: the prune pipeline's by-page pull
 * (data/prune/gsc-by-page.json in the rank tracker). Inventory default: live
 * fetch of the signals sitemap index; --inventory accepts the pipeline's
 * sitemap-inventory.json shape for offline replay.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const TRACKER_DATA = path.join(
  HOME,
  ".hermes/scripts/gitdealflow-rank-tracker/data",
);

const BASE = "https://signals.gitdealflow.com";
const PAGE_SHARDS = [
  "sitemap/core.xml",
  "sitemap/content.xml",
  "sitemap/sectors.xml",
  "sitemap/crossings.xml",
  "sitemap/startups.xml",
];

// Prune-eligible leaf families. Hub/index pages, curated statics, strategic
// families, and the quarterly niche-down surface are deliberately absent.
const ELIGIBLE: RegExp[] = [
  /^\/benchmarks\/[^/]+$/,
  /^\/city\/[^/]+$/,
  /^\/best\/[^/]+$/,
  /^\/stage\/[^/]+\/[^/]+$/,
  /^\/stage\/[^/]+\/signal\/[^/]+$/,
  /^\/signals\/[^/]+\/[^/]+$/,
  /^\/trends\/[^/]+$/,
  /^\/works-with\/[^/]+$/,
  /^\/year-in-review\/[^/]+$/,
  /^\/acquirer\/[^/]+$/,
  /^\/startup\/[^/]+$/,
  /^\/use-cases\/[^/]+$/,
  /^\/build-vs-invest\/[^/]+$/,
  /^\/case-study\/[^/]+$/,
  /^\/startup-ideas\/[^/]+$/,
  /^\/playbooks\/[^/]+$/,
  /^\/from-stars-to-seed\/[^/]+$/,
  /^\/community-signal\/[^/]+$/,
  /^\/solo-founder-tracker\/[^/]+$/,
  /^\/predicted\/[^/]+$/,
  /^\/blog\/[^/]+$/,
  /^\/weekly\/top-100\/[^/]+$/,
];

const YOUNG_TOKEN = /2026-08|2026-w3\d|-q3-2026/;
const DATA_EXT = /\.(json|xml|jsonl|txt|csv)$/;
const LOCALES = ["zh", "ja", "de", "es", "fr", "pt", "ko", "hi", "ru", "it", "nl", "ar"];
const FROZEN_BLOG_SLUGS = new Set(["i-tracked-369-startup-github-orgs-six-months"]);
const YOUNG_BLOG_DATE = "2026-07-01";

function fail(msg: string): never {
  console.error("build-pruned-pages: " + msg);
  process.exit(1);
}

interface Args {
  gsc: string;
  inventory: string | null;
  out: string;
  dryRun: boolean;
  minImps: number;
}

function parseArgs(argv: string[]): Args {
  const a: Args = {
    gsc: path.join(TRACKER_DATA, "prune/gsc-by-page.json"),
    inventory: null,
    out: "content/pruned-pages.ts",
    dryRun: false,
    minImps: 1,
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--gsc") a.gsc = argv[++i];
    else if (argv[i] === "--inventory") a.inventory = argv[++i];
    else if (argv[i] === "--out") a.out = argv[++i];
    else if (argv[i] === "--min-imps") a.minImps = Number(argv[++i]);
    else if (argv[i] === "--dry-run") a.dryRun = true;
  }
  return a;
}

/** Blog posts too young to prune: date >= YOUNG_BLOG_DATE across ALL
 * content/*.ts files (posts.ts plus merged clusters like
 * posts-sourcing-cluster.ts and TOFU that define posts OUTSIDE posts.ts as
 * literals — a prior blind spot that could prune freshly-shipped cluster
 * content on a re-run). Flat slug->date regex: entry blocks contain nested
 * braces (faqs arrays etc.), so block-based parsing fails; the non-greedy
 * scan matches slug with the next date in the file. Over-protection (false
 * positives) is safe; under-protection is not. */
function youngBlogPaths(): Set<string> {
  const dir = path.join(process.cwd(), "content");
  if (!fs.existsSync(dir)) fail("content/ not found (run from pseo-site)");
  const out = new Set<string>();
  for (const s of FROZEN_BLOG_SLUGS) out.add("/blog/" + s);
  const re = /slug:\s*"([^"]+)"[^}]*?date:\s*"([\d-]+)"/gs;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".ts")) continue;
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw)) !== null) {
      if (m[2] >= YOUNG_BLOG_DATE) out.add("/blog/" + m[1]);
    }
  }
  return out;
}

function isEligible(p: string, youngBlog: Set<string>): boolean {
  if (DATA_EXT.test(p)) return false;
  if (YOUNG_TOKEN.test(p)) return false;
  if (p.startsWith("/signals/define/")) return false; // signal-primitive definitions (entity cluster, core shard)
  if (p.startsWith("/blog/") && youngBlog.has(p)) return false;
  return ELIGIBLE.some((r) => r.test(p));
}

async function liveInventory(): Promise<Set<string>> {
  const urls = new Set<string>();
  const res = await fetch(BASE + "/sitemap.xml", {
    headers: { "user-agent": "gdf-prune-generator" },
  });
  if (!res.ok) throw new Error("sitemap index fetch HTTP " + res.status);
  const idx = await res.text();
  const children = [...idx.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.endsWith(".xml"));
  let fetched = 0;
  for (const shard of children) {
    const key = shard.replace(/^https:\/\/signals\.gitdealflow\.com\//, "");
    if (!PAGE_SHARDS.includes(key)) continue;
    const r2 = await fetch(shard, { headers: { "user-agent": "gdf-prune-generator" } });
    if (!r2.ok) throw new Error("shard fetch HTTP " + r2.status + " " + key);
    const body = await r2.text();
    fetched++;
    for (const m of body.matchAll(/<loc>(.*?)<\/loc>/g)) {
      if (m[1].startsWith(BASE)) urls.add(m[1]);
    }
  }
  if (fetched !== PAGE_SHARDS.length) {
    throw new Error("expected " + PAGE_SHARDS.length + " shards, got " + fetched);
  }
  return urls;
}

function inventoryFromFile(fp: string): Set<string> {
  const raw = JSON.parse(fs.readFileSync(fp, "utf8"));
  const host = raw["https://signals.gitdealflow.com"];
  if (!host) fail("inventory file has no signals host key");
  const urls = new Set<string>();
  for (const shard of PAGE_SHARDS) {
    for (const u of host[shard] ?? []) {
      if (typeof u === "string" && u.startsWith(BASE)) urls.add(u);
    }
  }
  return urls;
}

/** URLs with >= minImps GSC impressions in the 90d window (kept; pruned only
 * when below the threshold). minImps=1 = prune zero-imp only (default, the
 * 08-16 pass); --min-imps 10 = prune <10-imp pages (the audit's "<10-imp"
 * tier). GSC by-page lists only URLs with >=1 impression, so zero-imp URLs are
 * simply absent from the dict. */
function gscWithMinImps(fp: string, minImps: number): Set<string> {
  if (!fs.existsSync(fp)) fail("GSC snapshot missing: " + fp);
  const raw = JSON.parse(fs.readFileSync(fp, "utf8"));
  const pages = raw?.["90"]?.["pages"];
  if (!pages) fail("GSC snapshot missing [90].pages");
  const out = new Set<string>();
  for (const [url, meta] of Object.entries(pages)) {
    const i = (meta as { i?: number })?.i ?? 0;
    if (i >= minImps) out.add(url);
  }
  return out;
}

function renderModule(pruned: string[], generated: string): string {
  const lines = pruned.map((p) => `  "${p}",`);
  return [
    "// GENERATED FILE: scripts/build-pruned-pages.ts. Do not hand-edit.",
    "//",
    "// Zero-impression (GSC 90d) leaf pages pruned from the search sitemaps,",
    "// " + generated + " pass. Prune = sitemap removal only: pages stay live,",
    "// internally linked, and crawlable; the index converges on earning URLs.",
    "// Re-run quarterly (gitdealflow-traffic-ops skill, pruning section) or",
    "// after template retirements. §53 guard pins canaries + size band.",
    "",
    "export const PRUNE_GENERATED = \"" + generated + "\";",
    "export const PRUNE_COUNT = " + pruned.length + ";",
    "export const PRUNED_PAGE_PATHS: ReadonlySet<string> = new Set([",
    ...lines,
    "]);",
    "",
    "export function isPagePruned(pathname: string): boolean {",
    "  return PRUNED_PAGE_PATHS.has(pathname);",
    "}",
    "",
  ].join("\n");
}

async function main(): Promise<void> {
  const a = parseArgs(process.argv.slice(2));
  const gsc = gscWithMinImps(a.gsc, a.minImps);
  const inv = a.inventory ? inventoryFromFile(a.inventory) : await liveInventory();
  const youngBlog = youngBlogPaths();
  const localeRe = new RegExp("^/(" + LOCALES.join("|") + ")(/|$)");

  const pruned: string[] = [];
  for (const u of [...inv].sort()) {
    const p = new URL(u).pathname;
    if (localeRe.test(p)) continue;
    if (!isEligible(p, youngBlog)) continue;
    if (gsc.has(u)) continue;
    pruned.push(p);
  }

  const byFamily: Record<string, number> = {};
  for (const p of pruned) {
    const f = p.split("/")[1];
    byFamily[f] = (byFamily[f] ?? 0) + 1;
  }
  console.log("inventory:", inv.size, "| gsc90d-with-imps:", gsc.size);
  console.log("pruned:", pruned.length, JSON.stringify(byFamily));

  const out = renderModule(pruned, new Date().toISOString().slice(0, 10));
  if (a.dryRun) {
    console.log("dry-run: not writing " + a.out);
    return;
  }
  fs.writeFileSync(path.join(process.cwd(), a.out), out);
  console.log("wrote", a.out);
}

main().catch((e) => {
  console.error("build-pruned-pages: " + (e instanceof Error ? e.message : String(e)));
  process.exit(1);
});
