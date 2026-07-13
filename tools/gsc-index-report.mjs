#!/usr/bin/env node
/**
 * GSC Index-Coverage Report — the real "Discovered – not indexed" picture.
 *
 * Replaces the `site:` proxy used in marketing/seo-authority-and-indexation-2026-05-30.md
 * with API-backed ground truth from Google Search Console's URL Inspection API.
 *
 * WHY URL Inspection (not Search Analytics): the index-coverage *states*
 * ("Submitted and indexed", "Crawled – currently not indexed",
 * "Discovered – currently not indexed", "Duplicate without user-selected
 * canonical", …) are only exposed per-URL via urlInspection.index.inspect.
 * The Search Analytics API returns clicks/impressions, not coverage state,
 * and the Index Coverage report has no bulk API. So we SAMPLE: pull the live
 * sitemap, group URLs by route family, inspect N per family, and bucket the
 * results by coverageState. Quota is 2000 inspections/day, 600/min — the
 * defaults stay well under both.
 *
 * Zero npm dependencies: Node ≥18 global fetch + node:crypto for the RS256
 * service-account JWT. No `googleapis`, no install step.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * AUTH (preferred = OAuth2 verified owner):
 *   GSC's "Add user" UI rejects service-account emails, and a domain property
 *   (sc-domain:) cannot grant Owner to a service account — so SA auth 403s with
 *   "You do not own this site." The reliable path is OAuth2 as the verified
 *   owner (signals@gitdealflow.com):
 *     1. Run:  node tools/gsc-oauth-setup.mjs   (see that file's header for the
 *        ~3-min Cloud Console "Desktop app" OAuth client setup).
 *     2. Run:  node tools/gsc-index-report.mjs --all
 *   This script auto-prefers tools/.gsc-oauth-token.json when present, and
 *   falls back to a service-account key (tools/.gsc-service-account.json) only
 *   if no OAuth token exists (works only where the SA is a real property user).
 *
 * ENV / FLAGS:
 *   GSC_OAUTH_JSON=/path/to/token.json  override the OAuth token path
 *   GSC_SA_JSON=/path/to/key.json     override the SA key path
 *   GSC_SITE_URL=sc-domain:gitdealflow.com   GSC property (default; domain
 *                                     property covers all subdomains). For a
 *                                     URL-prefix property use e.g.
 *                                     https://signals.gitdealflow.com/
 *   --sample=20                       URLs inspected per route family (default 20)
 *   --max=500                         global cap on inspections (default 500)
 *   --sitemap=<url>                   sitemap index (default signals sitemap.xml)
 *   --family=showdown,signal,sector   restrict to specific families
 *   --all                            inspect every sampled URL (ignore --sample)
 * ──────────────────────────────────────────────────────────────────────────
 */

import { createSign } from "node:crypto";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const OUT_PATH = resolve(REPO_ROOT, "pseo-site/data/audit/gsc-index-report.json");

// ── arg parsing ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : dflt;
};
const has = (name) => args.includes(`--${name}`);

const SA_PATH =
  process.env.GSC_SA_JSON ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  resolve(__dirname, ".gsc-service-account.json");
// OAuth2 (verified-owner) token produced by `gsc-oauth-setup.mjs`. Preferred
// over the SA key because the URL Inspection API authorizes against the
// property's owners/users, and a domain property can't grant access to a
// service account. See gsc-oauth-setup.mjs header.
const OAUTH_PATH =
  process.env.GSC_OAUTH_JSON || resolve(__dirname, ".gsc-oauth-token.json");
const SITE_URL = process.env.GSC_SITE_URL || "sc-domain:gitdealflow.com";
const SITEMAP_URL = flag("sitemap", "https://signals.gitdealflow.com/sitemap.xml");
const SAMPLE_PER_FAMILY = has("all") ? Infinity : parseInt(flag("sample", "20"), 10);
const MAX_INSPECTIONS = parseInt(flag("max", "500"), 10);
const FAMILY_FILTER = (flag("family", "") || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── service-account JWT → access token ──────────────────────────────────────
function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: sa.token_uri || "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const signingInput = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  // private_key may carry literal "\n" if sourced from an env var; normalize.
  const key = String(sa.private_key).replace(/\\n/g, "\n");
  const signature = signer
    .sign(key, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch(sa.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()).access_token;
}

// ── OAuth2 refresh-token → access token (verified-owner auth) ────────────────
async function getAccessTokenViaOAuth(oauth) {
  const res = await fetch(oauth.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: oauth.client_id,
      client_secret: oauth.client_secret,
      refresh_token: oauth.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    throw new Error(`OAuth refresh failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()).access_token;
}

// Prefer OAuth (verified owner) over the SA key. Returns { token, mode, who }.
async function resolveToken() {
  if (existsSync(OAUTH_PATH)) {
    const oauth = JSON.parse(readFileSync(OAUTH_PATH, "utf8"));
    return {
      token: await getAccessTokenViaOAuth(oauth),
      mode: "oauth (verified owner)",
      who: `client ${String(oauth.client_id).split("-")[0]}…`,
    };
  }
  if (existsSync(SA_PATH)) {
    const sa = JSON.parse(readFileSync(SA_PATH, "utf8"));
    return {
      token: await getAccessToken(sa),
      mode: "service account",
      who: sa.client_email,
    };
  }
  return null;
}

// ── sitemap harvest ─────────────────────────────────────────────────────────
async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "gsc-index-report/1.0" } });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.text();
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function harvestUrls(sitemapUrl) {
  const xml = await fetchText(sitemapUrl);
  const locs = extractLocs(xml);
  // sitemap index → recurse one level into <sitemap> children
  const isIndex = /<sitemapindex/i.test(xml);
  if (!isIndex) return locs;
  const all = [];
  for (const child of locs) {
    if (!/\.xml$/i.test(child)) continue;
    try {
      all.push(...extractLocs(await fetchText(child)));
    } catch (e) {
      console.warn(`  ⚠️  skip ${child}: ${e.message}`);
    }
  }
  return all;
}

// Route family = first non-empty path segment (entity slug stripped).
function familyOf(url) {
  try {
    const p = new URL(url).pathname.replace(/\/+$/, "");
    if (p === "" ) return "(home)";
    const seg = p.split("/").filter(Boolean);
    return seg[0];
  } catch {
    return "(invalid)";
  }
}

function sampleByFamily(urls) {
  const byFamily = new Map();
  for (const u of urls) {
    const f = familyOf(u);
    if (FAMILY_FILTER.length && !FAMILY_FILTER.includes(f)) continue;
    if (!byFamily.has(f)) byFamily.set(f, []);
    byFamily.get(f).push(u);
  }
  // deterministic, spread sample: every k-th URL so we don't bias to the
  // alphabetical head of each family.
  const picked = [];
  for (const [f, list] of byFamily) {
    const n = Math.min(SAMPLE_PER_FAMILY, list.length);
    if (n === list.length) {
      picked.push(...list.map((url) => ({ url, family: f })));
    } else {
      const step = list.length / n;
      for (let i = 0; i < n; i++) {
        picked.push({ url: list[Math.floor(i * step)], family: f });
      }
    }
  }
  return picked.slice(0, MAX_INSPECTIONS);
}

// ── URL inspection ──────────────────────────────────────────────────────────
async function inspect(token, inspectionUrl) {
  const res = await fetch(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inspectionUrl,
        siteUrl: SITE_URL,
        languageCode: "en-US",
      }),
    }
  );
  if (res.status === 429) return { _retry: true };
  // 401 = the OAuth access token expired mid-run (they live ~60 min). Signal
  // the caller to re-mint a token and retry — otherwise a long census silently
  // mislabels every post-expiry URL as not-indexed.
  if (res.status === 401) return { _authExpired: true };
  if (!res.ok) {
    return { _error: `${res.status}: ${(await res.text()).slice(0, 200)}` };
  }
  const json = await res.json();
  const r = json.inspectionResult?.indexStatusResult || {};
  return {
    coverageState: r.coverageState || "(none)",
    verdict: r.verdict || "(none)",
    robotsTxtState: r.robotsTxtState,
    indexingState: r.indexingState,
    pageFetchState: r.pageFetchState,
    lastCrawlTime: r.lastCrawlTime || null,
    googleCanonical: r.googleCanonical || null,
    userCanonical: r.userCanonical || null,
  };
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const auth = await resolveToken();
  if (!auth) {
    console.error(
      `\n❌ No GSC credentials found. Expected one of:\n` +
        `   • OAuth token: ${OAUTH_PATH}\n` +
        `       run  node tools/gsc-oauth-setup.mjs  (verified-owner flow — preferred)\n` +
        `   • Service-account key: ${SA_PATH}\n` +
        `       (works only if the SA is a property user; domain properties can't grant this)\n\n` +
        `Until then, the indexation picture in the audit is the (undercounting)\n` +
        `site: proxy, not GSC ground truth.\n`
    );
    process.exit(2);
  }
  console.log(`GSC Index-Coverage Report`);
  console.log(`========================`);
  console.log(`Property:   ${SITE_URL}`);
  console.log(`Auth:       ${auth.mode} — ${auth.who}`);
  console.log(`Sitemap:    ${SITEMAP_URL}`);
  console.log(
    `Sampling:   ${SAMPLE_PER_FAMILY === Infinity ? "ALL" : SAMPLE_PER_FAMILY}/family, max ${MAX_INSPECTIONS}\n`
  );

  let token = auth.token;
  const allUrls = await harvestUrls(SITEMAP_URL);
  console.log(`Harvested ${allUrls.length} sitemap URLs.`);
  const sample = sampleByFamily(allUrls);
  console.log(`Inspecting ${sample.length} sampled URLs…\n`);

  const results = [];
  const byCoverage = new Map();
  const byFamily = new Map();
  let done = 0;

  for (const { url, family } of sample) {
    let r = await inspect(token, url);
    if (r._retry) {
      await sleep(5000);
      r = await inspect(token, url);
    }
    // OAuth access tokens expire ~60 min; a long census outlives one token.
    // Re-mint and retry so post-expiry URLs aren't silently mislabeled.
    if (r._authExpired) {
      token = (await resolveToken()).token;
      r = await inspect(token, url);
    }
    done++;
    const state = r._error ? `ERROR ${r._error}` : r._authExpired ? "ERROR 401 (auth)" : r.coverageState;
    byCoverage.set(state, (byCoverage.get(state) || 0) + 1);
    if (!byFamily.has(family)) byFamily.set(family, new Map());
    const fam = byFamily.get(family);
    fam.set(state, (fam.get(state) || 0) + 1);
    results.push({ url, family, ...r });
    if (done % 25 === 0) console.log(`  …${done}/${sample.length}`);
    await sleep(120); // ~500/min, under the 600/min ceiling
  }

  // ── summary ────────────────────────────────────────────────────────────────
  console.log(`\n── Coverage state (sampled) ─────────────────────────`);
  const sortedCov = [...byCoverage.entries()].sort((a, b) => b[1] - a[1]);
  for (const [state, n] of sortedCov) {
    const pct = ((n / sample.length) * 100).toFixed(1);
    console.log(`  ${String(n).padStart(4)}  ${pct.padStart(5)}%  ${state}`);
  }

  console.log(`\n── By route family ─────────────────────────────────`);
  for (const [fam, states] of [...byFamily.entries()].sort()) {
    const total = [...states.values()].reduce((a, b) => a + b, 0);
    const indexed = states.get("Submitted and indexed") || 0;
    const idxPct = ((indexed / total) * 100).toFixed(0);
    console.log(`  ${fam.padEnd(22)} ${String(total).padStart(3)} sampled · ${idxPct}% indexed`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    property: SITE_URL,
    sitemap: SITEMAP_URL,
    sitemapUrlCount: allUrls.length,
    sampled: sample.length,
    config: { samplePerFamily: SAMPLE_PER_FAMILY, maxInspections: MAX_INSPECTIONS, familyFilter: FAMILY_FILTER },
    coverageStates: Object.fromEntries(sortedCov),
    byFamily: Object.fromEntries(
      [...byFamily.entries()].map(([f, m]) => [f, Object.fromEntries(m)])
    ),
    results,
  };
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(report, null, 2));
  console.log(`\n✅ Report written to ${OUT_PATH}`);
  console.log(
    `\nNote: this is a SAMPLE (not a census). To inspect every URL in a family,\n` +
      `run e.g.  node tools/gsc-index-report.mjs --family=showdown --all  (mind the\n` +
      `2000/day quota). "Discovered – currently not indexed" + "Crawled – currently\n` +
      `not indexed" + "Duplicate without user-selected canonical" are the buckets the\n` +
      `noindex/uniqueness work is meant to shrink.`
  );
}

main().catch((e) => {
  console.error(`\n❌ ${e.stack || e.message}`);
  process.exit(1);
});
