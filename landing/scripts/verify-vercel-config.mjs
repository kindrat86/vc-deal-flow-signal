#!/usr/bin/env node
/**
 * Landing-side config guards for gitdealflow.com (static, vercel.json-routed).
 *
 * Sibling of pseo-site's scripts/verify-no-regressions.ts, scoped to what this
 * deploy unit controls: vercel.json. The landing site has no build pipeline of
 * its own beyond the vercel.json buildCommand, so a config regression (a
 * dropped redirect, a deleted header block) can only be caught by asserting
 * the config file itself BEFORE `vercel deploy` ships it.
 *
 * Assert the FIXED state, keep the failure message actionable, cite the date.
 * Usage: node scripts/verify-vercel-config.mjs   (exit 1 on any failure)
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const cfg = readFileSync("vercel.json", "utf8");
const parsed = JSON.parse(cfg);
const failures = [];

function fail(msg) {
  failures.push(msg);
}

// ---------------------------------------------------------------------------
// /contact must redirect to /about, not 404 (2026-08-15)
// ---------------------------------------------------------------------------
// The site never had a /contact page; investors and AI crawlers probing the
// conventional contact URL hit a 404 trust leak. Contact happens via
// signals@gitdealflow.com, which /about surfaces. A tree missing this
// redirect must not deploy.
const contactRedirect = (parsed.redirects || []).find(
  (r) => r.source === "/contact",
);
if (!contactRedirect || contactRedirect.destination !== "/about") {
  fail(
    '/contact 404s again: the { "source": "/contact", "destination": "/about", "permanent": true } redirect is missing from vercel.json redirects[].',
  );
}

// ---------------------------------------------------------------------------
// de/es fake-i18n trees must 308 to the English canonical (2026-08-15)
// ---------------------------------------------------------------------------
// The de/ and es/ directories shipped ~414 English-content pages (German
// titles only) under lang="de"/"es" + hreflang, plus thin duplicate-intent
// vs/alternatives slugs. Translation was never completed and is not viable
// without native review, so the whole de/ and es/ trees redirect to English.
// A tree missing these catch-all redirects must not deploy.
const localeCatchAlls = {
  "/de": "/",
  "/es": "/",
  "/de/:path*": "/:path*",
  "/es/:path*": "/:path*",
};
for (const [src, dst] of Object.entries(localeCatchAlls)) {
  const r = (parsed.redirects || []).find((x) => x.source === src);
  if (!r || r.destination !== dst || r.permanent !== true) {
    fail(
      `fake-i18n locale "${src}" no longer 308-redirects to "${dst}": the de/es -> English consolidation redirect is missing from vercel.json redirects[].`,
    );
  }
}

// ---------------------------------------------------------------------------
// /api/badge must rewrite to signals, not 404 (2026-08-16)
// ---------------------------------------------------------------------------
// The /stats hub's 20 stat cards embed gitdealflow.com/api/badge/stats-m<N>.svg.
// The landing is static with no API routes; without this rewrite every one of
// those badge requests 404s (broken image + layout shift on a buyer-intent
// page). A tree missing the rewrite must not deploy.
const badgeRewrite = (parsed.rewrites || []).find(
  (r) => r.source === "/api/badge/:path*",
);
if (
  !badgeRewrite ||
  badgeRewrite.destination !== "https://signals.gitdealflow.com/api/badge/:path*"
) {
  fail(
    '/api/badge/stats-m*.svg 404s again: the { "source": "/api/badge/:path*", "destination": "https://signals.gitdealflow.com/api/badge/:path*" } rewrite is missing from vercel.json rewrites[].',
  );
}

// ---------------------------------------------------------------------------
// /best/ duplicate-canonical consolidation (2026-08-16)
// ---------------------------------------------------------------------------
// best/best-crunchbase-alternatives.html and best/best-pitchbook-alternatives.html
// duplicate the alternatives-to/* intent under different URLs. They must
// canonicalize to the /alternatives-to/ counterparts so Google consolidates
// ranking signals instead of splitting them (crunchbase-alternatives was stuck
// at position 76 with the /best/ page self-canonical).
const canonPairs = [
  ["best/best-crunchbase-alternatives.html", "https://gitdealflow.com/alternatives-to/crunchbase-alternatives"],
  ["best/best-pitchbook-alternatives.html", "https://gitdealflow.com/alternatives-to/pitchbook-alternatives"],
];
for (const [file, target] of canonPairs) {
  let html;
  try {
    html = readFileSync(file, "utf8");
  } catch {
    fail(`${file} is missing: the /best/ duplicate page must exist and canonicalize to ${target}.`);
    continue;
  }
  if (!html.includes(`rel="canonical" href="${target}"`)) {
    fail(`${file} no longer canonicalizes to ${target}: duplicate-content cannibalization has returned.`);
  }
}


// ---------------------------------------------------------------------------
// Topical-authority hubs must exist and be wired (2026-08-15)
// ---------------------------------------------------------------------------
// /faq, /for, /integrations had spokes in the sitemap but no hub (404), and
// /learn was a dead end. Any tree missing the hubs or the mesh must not deploy.
import { existsSync, readFileSync as _rf } from "node:fs";
const hubChecks = [
  ["faq/index.html", "https://gitdealflow.com/faq"],
  ["for/index.html", "https://gitdealflow.com/for"],
  ["integrations/index.html", "https://gitdealflow.com/integrations"],
];
for (const [file, url] of hubChecks) {
  if (!existsSync(file)) {
    fail(`${file} missing: the ${url} topical hub 404s again (2026-08-15 hub-and-spoke build).`);
  }
}
const learnIdx = readFileSync("learn/index.html", "utf8");
if (!learnIdx.includes("ItemList")) {
  fail("learn/index.html lost its ItemList guide index (2026-08-15 pillar rebuild).");
}
for (const spoke of ["learn/deal-flow/index.html", "faq/what-is-seed-funding.html", "for/angel-investors/index.html"]) {
  if (existsSync(spoke) && !readFileSync(spoke, "utf8").includes("topical-mesh")) {
    fail(`${spoke} lost its topical-mesh cross-links (2026-08-15).`);
  }
}

// ---------------------------------------------------------------------------
// Grounded precision claims: no invented 82% raise-rate (2026-08-16)
// ---------------------------------------------------------------------------
// cheatsheet.html and perfect-webinar.html (plus the de/es tree copies) claimed
// the three-signal pattern "preceded a raise 82% of the time" in the research
// panel. The SSRN-published finding is a median lead time of 5.4 weeks with
// ~65% top-decile precision; 82% appears nowhere in the methodology. A tree
// that reintroduces the invented number must not deploy.
const claimFiles = [
  "cheatsheet.html",
  "perfect-webinar.html",
  "de/cheatsheet.html",
  "de/perfect-webinar.html",
  "es/cheatsheet.html",
  "es/perfect-webinar.html",
];
for (const f of claimFiles) {
  let html;
  try {
    html = readFileSync(f, "utf8");
  } catch {
    fail(`${f} is missing: the grounded-stats funnel page must exist (2026-08-16).`);
    continue;
  }
  if (html.includes("82%")) {
    fail(`${f} reintroduced the ungrounded 82% raise-rate claim (2026-08-16 grounding: 5.4 weeks median lead, ~65% top-decile precision).`);
  }
  if (!html.includes("top-decile precision of ~65%")) {
    fail(`${f} lost the grounded lead-time wording (median 5.4 weeks, ~65% top-decile precision).`);
  }
}
{
  let txt;
  try {
    txt = readFileSync("llms-full.src.txt", "utf8");
  } catch {
    fail("llms-full.txt is missing (2026-08-16).");
    txt = "";
  }
  if (txt.includes("82%")) {
    fail("llms-full.txt reintroduced the ungrounded 82% raise-rate claim (2026-08-16).");
  }
}

// ---------------------------------------------------------------------------
// llms.txt pricing must be CURRENT (2026-08-16). Founding rates (EUR 9.97 /
// 97) closed 2026-06-30; presenting them as current prices misleads agents
// that quote llms.txt. A stale-tree landing deploy must fail closed.
// ---------------------------------------------------------------------------
{
  let l;
  try {
    l = readFileSync("llms.src.txt", "utf8");
  } catch {
    fail("llms.src.txt is missing (2026-08-16; renamed from llms.txt by the crawl-proxy commit f8f7e45e).");
    l = "";
  }
  if (l.includes("- Dashboard Beta: EUR 9.97/month") || l.includes("- Insider Circle: EUR 97/month,")) {
    fail("llms.txt presents founding rates (9.97/97) as current (2026-08-16). Current: EUR 49/mo Dashboard, EUR 197/mo Insider Circle; founding rates closed 2026-06-30.");
  }
  if (!l.includes("- Dashboard: EUR 49/month") || !l.includes("- Insider Circle: EUR 197/month")) {
    fail("llms.txt lost current pricing lines (EUR 49/197) (2026-08-16).");
  }
}

// ---------------------------------------------------------------------------
// /teardown must redirect to signals, not 404 (2026-08-17)
// ---------------------------------------------------------------------------
// Outreach emails and preflight-health-check.py link gitdealflow.com/teardown,
// but the teardown offer page only exists on signals.gitdealflow.com (Next.js).
// Every human click from those emails (RUM: /teardown?utm_source=outreach,
// 5 clicks/30d) landed on a 404. A tree missing this redirect must not deploy.
const teardownRedirect = (parsed.redirects || []).find(
  (r) => r.source === "/teardown",
);
if (
  !teardownRedirect ||
  teardownRedirect.destination !==
    "https://signals.gitdealflow.com/teardown" ||
  teardownRedirect.permanent !== true
) {
  fail(
    '/teardown 404s again: the { "source": "/teardown", "destination": "https://signals.gitdealflow.com/teardown", "permanent": true } redirect is missing from vercel.json redirects[] (outreach emails link this URL; 2026-08-17 fix).',
  );
}

// ---------------------------------------------------------------------------
// /citations must redirect to the canonical identity map, not 404 (2026-08-19)
// ---------------------------------------------------------------------------
// Brand-SERP win: the canonical citations/identity-map page lives on signals
// (5k words, self-canonical, linked from /about and llms.txt). The apex 404
// split the brand surface: Wikidata P973 and outreach copy point at
// signals.gitdealflow.com/citations while humans typing gitdealflow.com/citations
// hit a dead end. Single-hop 308, canonical stays on signals.
const citationsRedirect = (parsed.redirects || []).find(
  (r) => r.source === "/citations",
);
if (
  !citationsRedirect ||
  citationsRedirect.destination !==
    "https://signals.gitdealflow.com/citations" ||
  citationsRedirect.permanent !== true
) {
  fail(
    '/citations 404s again: the { "source": "/citations", "destination": "https://signals.gitdealflow.com/citations", "permanent": true } redirect is missing from vercel.json redirects[] (canonical identity map must stay reachable from the apex; 2026-08-19 fix).',
  );
}

// ---------------------------------------------------------------------------
// Organization logo on the apex home JSON-LD (2026-08-19)
// ---------------------------------------------------------------------------
// Knowledge-Panel eligibility: logo is a recommended Organization field and
// the apex home org node shipped without one (about.html had it; the home
// node did not, so the two definitions of #organization disagreed). A tree
// that loses the home-page logo must not deploy.
{
  let home;
  try {
    home = readFileSync("index.html", "utf8");
  } catch {
    home = "";
  }
  const orgAt = home.indexOf('"https://gitdealflow.com/#organization"');
  const window = home.slice(orgAt, orgAt + 2500);
  if (orgAt === -1 || !window.includes('"logo"')) {
    fail(
      'index.html Organization node (#organization) lost its "logo" ImageObject (Knowledge-Panel recommended field; 2026-08-19 fix).',
    );
  }
}

// ---------------------------------------------------------------------------
// Mobile tap-target floor in ux.css (2026-08-17)
// ---------------------------------------------------------------------------
// The 375px/360px rendered audit found structural anchors (breadcrumbs, footer
// rows, related-lists, network tiles) at 15-18px tall on this static site,
// under the WCAG 2.5.8 / Google 24px minimum. The fix lives in ux.css (the
// only stylesheet every page family loads). A tree that drops the block
// re-ships undersized tap targets on ~360 pages.
{
  const css = (() => {
    try {
      return readFileSync("ux.css", "utf8");
    } catch {
      return "";
    }
  })();
  if (!css.includes("@media (max-width: 767px)") ||
      !css.includes("min-height: 24px") ||
      !css.includes(":where(footer a") ||
      !css.includes("body > ul a,") ||
      !css.includes(".network-grid a)")) {
    fail("ux.css lost the mobile tap-target floor block (:where(footer a, header nav a, ... .network-grid a) min-height 24px, 2026-08-17); footer/breadcrumb/related anchors drop back to 15-18px on phones.");
  }
}

// ---------------------------------------------------------------------------
// Header nav must wrap on mobile — no old non-wrapping nav (2026-08-16)
// ---------------------------------------------------------------------------
// A 390px mobile render sweep found datasets.html (EN/DE/ES) still carrying
// the pre-fix header: justify-content:space-between with NO flex-wrap and
// nowrap links, pushing the "Get free signal" CTA 6px past the viewport.
// Every other page family already ships the fixed header (gap:1rem;
// flex-wrap:wrap on the <nav> + min-height:44px on its links). A tree that
// lets any page regress to the old signature re-ships horizontal overflow to
// the mobile-first indexed render.
{
  const OLD_NAV = 'justify-content:space-between"';
  const walk = (dir) => {
    let out = [];
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith(".")) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) out = out.concat(walk(p));
      else if (e.name.endsWith(".html")) out.push(p);
    }
    return out;
  };
  const offenders = [];
  for (const f of walk(".")) {
    try {
      if (readFileSync(f, "utf8").includes(OLD_NAV)) offenders.push(f);
    } catch {
      /* unreadable file — not a header regression */
    }
  }
  if (offenders.length) {
    fail(
      `Non-wrapping header nav regressed in: ${offenders.join(", ")}. The mobile header needs gap:1rem;flex-wrap:wrap on the <nav> and min-height:44px on its links (2026-08-16 fix), or the "Get free signal" CTA overflows the 360-390px viewport.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Code/CTA blocks must wrap on mobile (2026-08-16)
// ---------------------------------------------------------------------------
// Long unbreakable tokens (API URLs, citation strings) inside <pre>/<code> and
// the /dataset <section class="cta"> overflowed the 360-390px viewport. The
// fix lives in inline.css (the only stylesheet the /dataset + /mcp + /sectors
// page families load). A tree that drops it re-ships horizontal overflow.
{
  const css = (() => {
    try {
      return readFileSync("inline.css", "utf8");
    } catch {
      return "";
    }
  })();
  if (
    !css.includes("MOBILE CODE/CTA OVERFLOW REPAIR") ||
    !css.includes("section.cta") ||
    !css.includes("white-space: pre-wrap")
  ) {
    fail(
      "inline.css lost the code/CTA overflow repair (pre/code overflow-wrap:anywhere + pre white-space:pre-wrap + section.cta flex-wrap, 2026-08-16); /dataset, /mcp and /sectors code blocks re-overflow the 360-390px viewport.",
    );
  }
}

// ---------------------------------------------------------------------------
// HSTS preload header must survive any vercel.json rewrite (2026-08-18)
// ---------------------------------------------------------------------------
// gitdealflow.com serves
// Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
// on every HTTPS response class (verified live: pages, 404s, assets, XML,
// llms.txt), and the domain is status=pending on hstspreload.org. The header
// was added 2026-08-16 by the traffic-audit SSL/HTTPS follow-up; this repo
// has already once orphaned a live fix through a config refactor (the §39
// CWV TTFB beacon). Getting OFF the preload list afterwards takes months of
// deliberate effort, so a tree that drops or weakens the header must not
// deploy. If the header is ever intentionally consolidated to ONE source
// block, update this check in the same commit with a reason.
{
  const HSTS = "max-age=63072000; includeSubDomains; preload";
  const entries = (parsed.headers || []).flatMap((b) =>
    (b.headers || []).map((x) => ({ src: b.source, key: x.key, value: x.value })),
  );
  const hsts = entries.filter((x) => x.key === "Strict-Transport-Security");
  if (!hsts.some((x) => x.src === "/(.*)" && x.value === HSTS)) {
    fail(
      `Strict-Transport-Security lost or misplaced: vercel.json headers[] must keep a { "source": "/(.*)" } block with Strict-Transport-Security: "${HSTS}" (hstspreload.org submission pending 2026-08-18; preload removal costs months).`,
    );
  }
  const weakened = hsts.filter((x) => x.value !== HSTS);
  if (weakened.length) {
    fail(
      `Strict-Transport-Security weakened: found ${weakened.map((x) => `"${x.src}" -> "${x.value}"`).join(", ")}, but the preload-compliant value is exactly "${HSTS}".`,
    );
  }
}

// ---------------------------------------------------------------------------
// Every verify-all step script must be re-included in .vercelignore
// (2026-08-17). scripts/* is excluded from uploads; a gate script missing its
// !scripts/ re-include passes locally (git archive ships everything) and then
// fails the Vercel build with ENOENT at that step. Bitten 2026-08-17: the
// verify-author-identity re-include was missing, so every landing deploy died
// at verify-all step 8 while all gates passed locally.
// ---------------------------------------------------------------------------
{
  try {
    const ignore = readFileSync(".vercelignore", "utf8");
    const allSrc = readFileSync("scripts/verify-all.mjs", "utf8");
    const steps = [
      ...allSrc.matchAll(/['"]scripts\/(verify-[\w.-]+\.mjs)['"]/g),
    ].map((m) => m[1]);
    for (const script of steps) {
      const re = new RegExp("^!scripts/" + script.replace(/\./g, "\\.") + "$", "m");
      if (!re.test(ignore)) {
        fail(
          `.vercelignore does not re-include scripts/${script}: scripts/* excludes it from the Vercel upload, so verify-all.mjs fails with ENOENT at that step on the build machine (passes locally where git archive ships it). Add !scripts/${script} next to the other !scripts/verify-*.mjs lines.`,
        );
      }
    }
  } catch {
    // .vercelignore absent (e.g. not in the upload): nothing to check here.
  }
}

// ---------------------------------------------------------------------------
// text/markdown content negotiation must survive (2026-08-17)
// ---------------------------------------------------------------------------
// The apex is static (framework null), so "Accept: text/markdown" cannot be
// answered by a static file. A rewrite (has: header accept ~ text/markdown)
// routes markdown-asking clients to api/markdown.js, which answers
// Content-Type: text/markdown instead of forcing an assistant to parse browser
// HTML (seofixprompt AIO/LLMO finding 2026-08-17: home page returned text/html
// for Accept: text/markdown). A tree missing either the rewrite or the
// function silently re-sends HTML to every assistant that asks for markdown.
{
  const mdRewrite = (parsed.rewrites || []).find(
    (r) => r.source === "/:path*" && Array.isArray(r.has),
  );
  const hasAcceptMd =
    mdRewrite &&
    mdRewrite.has.some(
      (h) => h.type === "header" && h.key === "accept" && h.value === "text/markdown",
    );
  if (!mdRewrite || !hasAcceptMd || mdRewrite.destination !== "/api/markdown?path=:path") {
    fail(
      'text/markdown negotiation lost: vercel.json rewrites[] must keep { "source": "/:path*", "has": [{ "type": "header", "key": "accept", "value": "text/markdown" }], "destination": "/api/markdown?path=:path" } (2026-08-17 AIO/LLMO fix).',
    );
  }
  const mdFn = (() => {
    try {
      return readFileSync("api/markdown.js", "utf8");
    } catch {
      return "";
    }
  })();
  if (!mdFn.includes("text/markdown; charset=utf-8") || !mdFn.includes("content-type")) {
    fail("api/markdown.js missing or lost its text/markdown content-type (2026-08-17 AIO/LLMO fix).");
  }
}

if (failures.length) {
  console.error(
    `\n❌ verify-vercel-config: ${failures.length} config regression(s) detected:`,
  );
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("✓ verify-vercel-config: vercel.json guards pass");
