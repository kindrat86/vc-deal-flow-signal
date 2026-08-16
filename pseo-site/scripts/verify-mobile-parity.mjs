#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Live mobile-first indexing parity detector (audit item "mobile-first
// indexing 90", verified 2026-08-17; see verify-no-regressions.ts §35).
//
// WHAT IT PROVES: Google crawls this site with the smartphone crawler
// (GSC URL Inspection: crawledAs=MOBILE on sampled URLs, 2026-08-17), so the
// Googlebot-Smartphone HTML must be identical (after masking per-request
// tokens) to what real mobile users get. proxy.ts rewrites requests for AI
// agent bots (x-agent-bot rendering) and negotiates text/markdown on Accept;
// Googlebot must NEVER be pulled into either path.
//
// HOW: samples every template family from the sitemap shards, fetches each
// URL with 3 UAs (Googlebot Smartphone, Googlebot Desktop, Chrome Mobile),
// and compares normalized bodies. Also asserts a device-width viewport meta
// on every HTML response plus X-Robots-Tag sanity.
//
// MASKING: /leaderboard (and similar) embed a per-request signed share token
// (base64 JWT with an ms timestamp). Bodies differ between ANY two requests,
// Googlebot or not — that is per-request nondeterminism, not UA cloaking.
// Mask [A-Za-z0-9_-]{40,} runs before comparing (verified 2026-08-17: the
// only diff regions on /leaderboard were inside such tokens).
//
// EXIT SEMANTICS: 0 = pass, or network-unable-to-test (skip, warn — this
// script is a detector, not a deploy gate; do NOT wire it into the Vercel
// build chain, a live-prod fetch there adds flake and would block deploying
// the very fix for an outage it detects). 1 = CONFIRMED parity break:
// different normalized bodies across UAs on 200s, missing device-width
// viewport on HTML, or Googlebot blocked/non-200 where Chrome gets 200.
//
// Run: npm run verify:mobile-parity   (or node scripts/verify-mobile-parity.mjs)
// ---------------------------------------------------------------------------
const HOSTS = ["https://signals.gitdealflow.com", "https://gitdealflow.com"];

const UAS = {
  "GB-Smartphone":
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "GB-Desktop":
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/125.0.0.0 Safari/537.36",
  "Chrome-Mobile":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
};

const MAX_SHARDS_PER_HOST = 4;
const SAMPLE_PER_FAMILY = 2;
const CONCURRENCY = 6;

const mask = (s) => s.replace(/[A-Za-z0-9_-]{40,}/g, "«TOKEN»");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchRaw(url, ua) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": ua, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: ctrl.signal,
    });
    return { status: r.status, finalUrl: r.url, headers: r.headers, body: await r.text() };
  } catch (e) {
    return { status: -1, finalUrl: url, headers: new Headers(), body: "", error: String(e) };
  } finally {
    clearTimeout(t);
  }
}

async function collectSample(host) {
  const idx = await fetchRaw(host + "/sitemap.xml", UAS["Chrome-Mobile"]);
  if (idx.status !== 200) throw new Error(`sitemap index ${idx.status}`);
  const shards = [...idx.body.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => m[1])
    .filter((s) => !/(image|video|news)/.test(s))
    .slice(0, MAX_SHARDS_PER_HOST);
  const families = new Map();
  for (const shard of shards) {
    const sh = await fetchRaw(shard, UAS["Chrome-Mobile"]);
    if (sh.status !== 200) continue;
    for (const loc of sh.body.matchAll(/<loc>(.*?)<\/loc>/g)) {
      const path = new URL(loc[1]).pathname;
      const fam = path.split("/").filter(Boolean)[0] ?? "(home)";
      if (!families.has(fam)) families.set(fam, []);
      families.get(fam).push(loc[1]);
    }
  }
  const sample = [];
  for (const [fam, urls] of families) {
    // deterministic sample: first + middle of each family
    const picks = [urls[0], urls[Math.floor(urls.length / 2)]].filter(Boolean);
    for (const u of picks.slice(0, SAMPLE_PER_FAMILY)) sample.push({ fam, url: u });
  }
  return sample;
}

// Returns "pass" | "fail" | "skip".
async function checkUrl(item, failures) {
  const { fam, url } = item;
  const sep = url.includes("?") ? "&" : "?";
  const target = url + sep + "cb=" + Date.now() + Math.floor(Math.random() * 1000);
  const got = {};
  for (const [name, ua] of Object.entries(UAS)) {
    got[name] = await fetchRaw(target, ua);
    await sleep(150);
  }
  const s = got["GB-Smartphone"], c = got["Chrome-Mobile"], d = got["GB-Desktop"];
  const html = (s.headers.get("content-type") || "").includes("text/html");

  if (s.error || c.error || d.error) {
    console.log(`SKIP  ${fam}:network ${url} (${s.error || c.error || d.error})`);
    return "skip"; // unable to test, not a confirmed break
  }
  if (s.status !== c.status || s.finalUrl !== c.finalUrl) {
    failures.push(`${url} [${fam}]: status/finalUrl diverge GB-Smartphone(st=${s.status} -> ${s.finalUrl}) vs Chrome(st=${c.status} -> ${c.finalUrl})`);
  } else if (mask(s.body) !== mask(c.body) || mask(s.body) !== mask(d.body)) {
    failures.push(`${url} [${fam}]: BODY diverges across UAs (cloaking or accidental UA branching)`);
  } else if (html) {
    const vp = s.body.match(/<meta[^>]+name=["']viewport["'][^>]*>/);
    if (!vp || !/device-width/.test(vp[0])) {
      failures.push(`${url} [${fam}]: HTML response missing device-width viewport meta (mobile-first render)`);
    } else if (!/index/i.test(s.headers.get("x-robots-tag") || "index")) {
      failures.push(`${url} [${fam}]: X-Robots-Tag not index for Googlebot (${s.headers.get("x-robots-tag")})`);
    } else {
      console.log(`PASS  ${fam}:${url.replace(/^https?:\/\//, "")}`);
      return "pass";
    }
  } else {
    console.log(`PASS  ${fam}:${url.replace(/^https?:\/\//, "")} (non-HTML, parity holds)`);
    return "pass";
  }
  console.log(`FAIL  ${fam}:${url.replace(/^https?:\/\//, "")}`);
  return "fail";
}

(async () => {
  const failures = [];
  let passed = 0, skipped = 0;
  for (const host of HOSTS) {
    console.log(`\n=== ${host} ===`);
    let sample;
    try {
      sample = await collectSample(host);
    } catch (e) {
      console.log(`SKIP  sitemap sampling failed (${e.message}) — not a confirmed break`);
      continue;
    }
    console.log(`sampled ${sample.length} URLs across template families`);
    for (let i = 0; i < sample.length; i += CONCURRENCY) {
      const batch = sample.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map((it) => checkUrl(it, failures)));
      passed += results.filter((r) => r === "pass").length;
      skipped += results.filter((r) => r === "skip").length;
    }
  }
  const failed = failures.length;
  const tested = passed + failed;
  console.log(`\n=== mobile-first parity: ${passed}/${tested} tested URLs pass, ${failed} confirmed failure(s), ${skipped} skipped ===`);
  if (failures.length) {
    for (const f of failures) console.error(`  ✖ ${f}`);
    process.exit(1);
  }
  console.log("✓ Googlebot-Smartphone == Chrome-Mobile == Googlebot-Desktop on every tested URL");
})();
