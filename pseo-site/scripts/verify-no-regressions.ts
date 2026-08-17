/**
 * Prebuild regression guard, makes a REGRESSED TREE UNDEPLOYABLE.
 *
 * Why this exists
 * ---------------
 * signals.gitdealflow.com is deployed to ONE alias-pinned Vercel project
 * (`pseo-site`) from MORE THAN ONE git lineage, `main`
 * (~/Downloads/vc-deal-flow-signal) and `worldclass-signals`
 * (~/signals-worldclass), plus a third checkout on `internal-link-engine`.
 * Whichever deploys last wins, so a fix landed on one lineage is silently
 * reverted by a deploy from another. That happened on 2026-08-03/04 and put
 * these P0 revenue defects back into production:
 *
 *   - deactivated Stripe payment links (clicks bounced, no checkout)
 *   - relative checkout success_url (paying buyers landed on a 404)
 *   - `color: revert` in ux.css (money CTAs repainted UA-blue on brand bg)
 *
 * Content assertions are lineage-agnostic: any tree missing a fix fails
 * `next build`, so it cannot be deployed by ANY path, scheduled task,
 * agent, temp-worktree deploy, or manual. Prefer adding a check here over
 * re-fixing the same defect a third time.
 *
 * Adding a check: assert the FIXED state, keep the failure message
 * actionable, and cite the date/reason. Only assert things that are cheap
 * and unambiguous, this runs on every build.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { createHash } from "node:crypto";
import { runAncestryGuard } from "./verify-ancestry";
import {
  deriveBestRedirects,
  loadStartupsData,
  type BestRedirect,
} from "./best-redirect-lib";
import { getCanonicalCompetitorVsSlugs } from "../content/competitor-vs";

const ROOT = process.cwd();
const failures: string[] = [];

function read(rel: string): string | null {
  const p = join(ROOT, rel);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

/** Assert `rel` exists and its contents satisfy `ok`. */
function check(rel: string, label: string, ok: (s: string) => boolean, hint: string) {
  const s = read(rel);
  if (s === null) {
    failures.push(`${label}\n    file not found: ${rel}`);
    return;
  }
  if (!ok(s)) failures.push(`${label}\n    file: ${rel}\n    fix:  ${hint}`);
}

/** Landing-tree variant: `rel` is landing/-relative; skips silently when the
 *  landing tree is absent from this checkout (CI standalone clone), matching
 *  the §1 CWV-beacon landing read pattern. */
function landingCheck(rel: string, label: string, ok: (s: string) => boolean, hint: string) {
  const p = join(ROOT, "..", "landing", rel);
  if (!existsSync(p)) return; // landing/ absent in this checkout
  const s = readFileSync(p, "utf8");
  if (!ok(s)) failures.push(`${label}\n    file: landing/${rel}\n    fix:  ${hint}`);
}

// ---------------------------------------------------------------------------
// 0. CWV single-source invariant (amended 2026-08-17, revised 2026-08-19).
//    posthog-js 1.417 auto-captures $web_vitals natively for LCP/FCP/CLS/INP
//    ONLY: it does NOT capture TTFB (verified in project 143861 on
//    2026-08-17: zero native-shape TTFB values on any of 10+ hosts in 28d;
//    the SDK's metric set excludes TTFB). The original 2026-08-16 guard
//    below enforced a blanket no-op on the reporter, which silently killed
//    the field TTFB stream for days (25 events/7d, 12 of them junk zeros).
//    2026-08-19 revision: the reporter now captures LCP + FCP + TTFB. The
//    native SDK's DESKTOP LCP/FCP carry background-tab dwell (email/X/HN
//    links cmd-clicked open; paint fires only on tab focus: measured apex
//    LCP p75 3016ms / FCP 3110ms vs true mobile ~489ms) because the SDK
//    lacks web-vitals' firstHiddenTime guard. The reporter's LCP/FCP run
//    through useReportWebVitals (web-vitals v4 drops dwell-deferred paints)
//    and carry beacon='dwell-filtered'. CLS/INP stay forbidden here: they
//    are not dwell-contaminated and a second path double-counts. See §39.
// ---------------------------------------------------------------------------
{
  const reporter = read("components/WebVitalsReporter.tsx");
  if (reporter && /capture\(\s*["']\$web_vitals["']/.test(reporter)) {
    // CLS/INP must stay on the native SDK (not dwell-contaminated; a second
    // capture path double-counts). LCP/FCP/TTFB are the reporter's job (§39).
    if (/metric\.name\s*===\s*["'](CLS|INP)["']/.test(reporter)) {
      failures.push(
        `WebVitalsReporter captures SDK-covered metrics (CLS/INP): the native SDK already collects these cleanly, a second path double-counts.\n    file: components/WebVitalsReporter.tsx\n    fix:  keep CLS/INP out of the reporter (report LCP/FCP/TTFB only; see §39)`,
      );
    }
  }
  try {
    const landingPixels = readFileSync(join(ROOT, "..", "landing", "pixels.js"), "utf8");
    if (/PH_URL\s*=\s*"https:\/\/eu\.i\.posthog\.com\/i\/v2\/e\//.test(landingPixels)) {
      failures.push(
        `CWV beacon posts to 404 endpoint eu.i.posthog.com/i/v2/e/.\n    file: ../landing/pixels.js\n    fix:  posthog-js native collection is the single source; the beacon only forwards to GA4`,
      );
    }
    if (/sendBeacon\(PH_URL/.test(landingPixels)) {
      failures.push(
        `CWV beacon still POSTs directly to PostHog: double-counts native SDK events.\n    file: ../landing/pixels.js\n    fix:  remove the direct send (2026-08-16), keep the GA4 gtag forward only`,
      );
    }
  } catch {
    // landing/ absent in this checkout (CI standalone clone).
  }
}

// ---------------------------------------------------------------------------
// 0.5 GA4 qualified-visitor mirror (2026-08-16). GA4 is the acquisition and
//     remarketing mirror of the PostHog north-star. The qualifier bridge fires
//     a once-per-session qualified_visit event and forwards the qualifying
//     conversion/engagement events (via a wrapped posthog.capture) so GA4's
//     "Qualified Visitors" audience + Looker Studio mirror the PostHog number.
//     A lineage that drops it silently reverts GA4 to raw activeUsers (no
//     qualified set, no retargeting audience). BOTH surfaces must carry it:
//     the static landing (pixels.js) and the pSEO app (PixelManager.tsx).
// ---------------------------------------------------------------------------
check(
  "components/PixelManager.tsx",
  "GA4 qualified-visitor qualifier missing from PixelManager: GA4 reverts to raw activeUsers, no qualified_visit event, no retargeting audience.",
  (s) => s.includes("qualified_visit") && s.includes("__gdfMirrorWrapped"),
  "restore the gdf-ga4-qualifier script (qualified_visit + posthog.capture mirror) in components/PixelManager.tsx",
);
landingCheck(
  "pixels.js",
  "GA4 qualified-visitor qualifier missing from landing/pixels.js: the apex site stops mirroring qualified visits into GA4.",
  (s) => s.includes("qualified_visit") && s.includes("__gdfMirrorWrapped"),
  "restore the GA4 qualified-visitor bridge at the end of landing/pixels.js",
);

// ---------------------------------------------------------------------------
// 1. Deactivated Stripe payment links (2026-07-31). These five links are
//    switched off in Stripe: a click 3s-redirects to a homepage with no
//    checkout, so every one is a silently lost sale.
// ---------------------------------------------------------------------------
const DEAD_STRIPE_LINKS = [
  "bJe14m34DbNC6gm1by0x204", // Sector Sweep EUR 1,997
  "28E6oGdJh18YgV04nK0x203", // First Look EUR 7
  "9B628q8oX7xmcEK9I40x207", // annual Insider
  "aFa28qgVt3h65ci8E00x206", // annual Dashboard
  "cNi5kCax52d29sy1by0x208", // book
];
{
  const globAll = ["app", "lib", "content", "components"];
  const hits: string[] = [];
  const { execSync } = require("node:child_process") as typeof import("node:child_process");
  for (const id of DEAD_STRIPE_LINKS) {
    try {
      const out = execSync(
        `grep -rl ${id} ${globAll.join(" ")} 2>/dev/null || true`,
        { cwd: ROOT, encoding: "utf8" },
      ).trim();
      if (out) hits.push(`${id} -> ${out.split("\n").join(", ")}`);
    } catch {
      /* grep found nothing */
    }
  }
  if (hits.length) {
    failures.push(
      `Deactivated Stripe payment link(s) present, these bounce paying buyers.\n    ${hits.join(
        "\n    ",
      )}\n    fix:  replace with /api/checkout/session?tier=<tier> (GET handler creates a live session)`,
    );
  }
}

// ---------------------------------------------------------------------------
// 2. Checkout success URLs must be absolute (2026-07-31). They are relative
//    per-tier paths that only exist on gitdealflow.com; resolved against the
//    signals origin they 404 the buyer immediately after payment.
// ---------------------------------------------------------------------------
// Only these four are the problem: they are pages on gitdealflow.com, so a
// relative value resolves against the signals origin and 404s. `/summit/thanks`
// is deliberately relative, that page DOES exist on signals (verified 200).
const ORIGIN_MISMATCHED_THANKS = [
  "firstlook-thanks",
  "dashboard-thanks",
  "insider-thanks",
  "sector-sweep-thanks",
];
check(
  "lib/stripe-tiers.ts",
  "Checkout successUrl is relative for a thank-you page that does not exist on the signals origin, buyers 404 after paying.",
  (s) => !ORIGIN_MISMATCHED_THANKS.some((p) => new RegExp(`successUrl:\\s*"/${p}`).test(s)),
  'make these absolute, e.g. successUrl: "https://gitdealflow.com/dashboard-thanks?session_id={CHECKOUT_SESSION_ID}"',
);

// The GET handler is what replaced the dead payment links; without it every
// `<a href="/api/checkout/session?tier=…">` 405s.
check(
  "app/api/checkout/session/route.ts",
  "Checkout route lost its GET handler, tier links will 405.",
  (s) => /export\s+async\s+function\s+GET/.test(s),
  "restore `export async function GET(req: NextRequest)` that 303-redirects to a live Stripe session",
);

// ---------------------------------------------------------------------------
// 3. ux.css `color: revert` (portfolio-wide bug, fixed 2026-07-31). `revert`
//    rolls colour back to the USER-AGENT origin, discarding Tailwind's
//    text-* utility, so link-buttons render UA-blue (and visited-purple) on
//    their brand background. Measured as low as 1.10:1 contrast.
// ---------------------------------------------------------------------------
check(
  "public/ux.css",
  "ux.css reintroduced `color: revert`, repaints money CTAs UA-blue/visited-purple.",
  (s) => !/color:\s*revert/.test(s),
  "delete the rule; the `a:not([class*=\"bg-\"]):not([role=\"button\"])` guard already excludes link-buttons",
);

// ---------------------------------------------------------------------------
// 4. Suspended X account in the author entity (2026-07-31). x.com/sipiteno
//    renders "Account suspended"; a dead profile in sameAs/rel=me is a
//    negative trust signal to Google and to AI engines reconciling the author.
// ---------------------------------------------------------------------------
// Tree-wide, not just lib/data-nerd.ts: the handle was reintroduced from 16
// other files (llms.txt, entities.json, knowledge-graph.json, citations,
// wikidata mirrors, RootIdentitySchema, agents.md ...), all of which feed the
// entity graph. Browser-verified 2026-08-04: the profile renders
// "Account suspended". Checking one file is not enough.
{
  const { execSync } = require("node:child_process") as typeof import("node:child_process");
  let hits = "";
  try {
    hits = execSync(
      `grep -rl "x\\.com/data_nerd" app lib components content public 2>/dev/null || true`,
      { cwd: ROOT, encoding: "utf8" },
    ).trim();
  } catch {
    /* nothing found */
  }
  if (hits) {
    failures.push(
      `Suspended x.com/sipiteno is back in the entity graph (dead profile = negative trust signal).\n    ${hits
        .split("\n")
        .join("\n    ")}\n    fix:  remove the sameAs/rel=me/profile reference; only re-add X once a LIVE handle exists`,
    );
  }
}

// ---------------------------------------------------------------------------
// 5. /compare hub must list the programmatic comparisons (2026-07-31).
//    The hub mapped only the editorial array, orphaning the 11 programmatic
//    pages that hold the family's highest impressions (696 impr on one URL).
// ---------------------------------------------------------------------------
check(
  "content/comparisons.ts",
  "programmaticComparisons is no longer exported, /compare hub cannot list them.",
  (s) => /export\s+const\s+programmaticComparisons/.test(s),
  "keep the `export` keyword on programmaticComparisons",
);
check(
  "app/compare/page.tsx",
  "/compare hub stopped listing programmatic comparisons, 11 pages become orphans.",
  (s) => s.includes("programmaticComparisons"),
  "map over [...comparisons, ...programmaticComparisons]",
);

// ---------------------------------------------------------------------------
// 6. QAPage on site-authored answers (2026-07-31). Google: "Don't use QAPage
//    markup for content authored by the site." Invalid across ~91 /answers.
// ---------------------------------------------------------------------------
check(
  "app/answers/[slug]/page.tsx",
  "QAPage markup is back on /answers, invalid for site-authored answers.",
  (s) => !s.includes('"QAPage"'),
  "use FAQPage only; see the comment block in that file",
);

// ---------------------------------------------------------------------------
// 7. AIO-ready flagship answer (2026-08-15 traffic audit, AIO item). The
//    "how to find startups before they raise" answer must keep its 40-60 word
//    definition block, semantic step list, and HowTo schema. A lineage that
//    regresses this loses the extraction surface the page was rebuilt for.
// ---------------------------------------------------------------------------
check(
  "content/agent-queries.ts",
  "how-to-find-startups-before-they-fundraise lost its AIO structure (definition + steps + exact phrase).",
  (s) => {
    const i = s.indexOf('slug: "how-to-find-startups-before-they-fundraise"');
    if (i === -1) return false;
    const chunk = s.slice(i, i + 11000);
    return (
      chunk.includes("definition:") &&
      chunk.includes("steps:") &&
      chunk.includes("before they raise")
    );
  },
  "restore the definition block, the 5 steps, and the phrase 'before they raise' on that entry",
);
check(
  "app/answers/[slug]/page.tsx",
  "answers template lost the direct-answer block or HowTo rendering.",
  (s) => s.includes("data-direct-answer") && s.includes("HowToStep"),
  "re-add the definition block, the semantic <ol> steps, and the HowTo JSON-LD subgraph",
);

// ---------------------------------------------------------------------------
// N. Shared send-gate wiring (2026-08-04). A 14-day audit found real
//    subscribers receiving 3-4 emails in one day: ~6 independent systems mail
//    the same people and each only tracked its own state. Every MARKETING
//    sender must claim a slot in the shared one-per-day gate before sending.
//    A lineage that lacks this wiring silently reintroduces the pile-on.
//
//    Deliberately NOT asserted: lib/sector-sweep-setter.ts is EXEMPT by owner
//    decision, it is a conversational reply to a form the prospect just
//    submitted, and its T+0/T+2h/T+12h cadence shares a calendar day, so a
//    daily cap would drop all but one. Do not "helpfully" gate it here.
// ---------------------------------------------------------------------------
check(
  "lib/send-gate.ts",
  "Shared send-gate helper is missing, marketing senders cannot enforce the one-email-per-recipient-per-day cap.",
  (s) => /export\s+async\s+function\s+gateAllows/.test(s),
  "restore lib/send-gate.ts exporting gateAllows(email, sender, day?), it must FAIL CLOSED when the gate is unreachable",
);

for (const [file, label] of [
  ["app/api/cron/drip-sender/route.ts", "drip-sender"],
  ["app/api/cron/daily-seinfeld/route.ts", "daily-seinfeld"],
  ["lib/soap-opera-scout.ts", "scout soap-opera (days 2-5)"],
] as const) {
  check(
    file,
    `${label} sends without claiming the shared daily send-gate slot, recipients can be mailed multiple times a day.`,
    (s) => s.includes("gateAllows("),
    "call `await gateAllows(<recipient>, '<sender-label>'[, deliveryDay])` before sending and skip when it returns false",
  );
}

// daily-seinfeld must stay a per-recipient fan-out: a Resend BROADCAST targets a
// whole audience and cannot exclude individuals, so reverting to it silently
// defeats the cap no matter what the gate says.
check(
  "app/api/cron/daily-seinfeld/route.ts",
  "daily-seinfeld is back on Resend broadcasts, a broadcast cannot exclude individuals, so the daily cap cannot apply.",
  (s) => !s.includes("api.resend.com/broadcasts"),
  "send per recipient via /emails (gated), using injectUnsubscribeLink + listUnsubscribeHeaders, {{{RESEND_UNSUBSCRIBE_URL}}} only expands on broadcasts",
);

// IndexNow: a status-only log is why a 422 sat unexplained in the build output.
check(
  "scripts/submit-indexnow.ts",
  "IndexNow submitter no longer reports WHY a submission was rejected, a failure will be silent again.",
  (s) => s.includes("IndexNow body") && s.includes("IndexNow SKIPPED"),
  "log the response body on non-2xx, and preflight the key file by CONTENT (this host serves soft-404s that a status check reads as valid)",
);

// ---------------------------------------------------------------------------
// 7. Newsletter widget publisher attribution (2026-08-13). /embed/weekly is
//    the co-branded "Signal of the Week" block pitched to VC newsletters.
//    The ?pub= parameter is how each publisher's clicks are attributed -
//    losing it silently blinds the whole newsletter-distribution funnel.
// ---------------------------------------------------------------------------
check(
  "app/embed/weekly/route.ts",
  "/embed/weekly lost the ?pub= publisher-attribution script, newsletter embeds stop attributing clicks.",
  (s) => s.includes('get("pub")') && s.includes("utm_campaign"),
  "restore the inline script that reads ?pub= from the iframe URL and appends utm_campaign/pub to the CTA link",
);

// Chrome-extensions listicle (2026-08-13, Play #6 distribution). Published to
// BOTH lineages the same day; a lineage that lacks it silently 404s the URL
// that the /chrome page, X thread, and LinkedIn syndication link to.
check(
  "content/posts.ts",
  "Blog post best-chrome-extensions-vc-deal-flow-2026 is missing, its inbound distribution links 404.",
  (s) => s.includes('slug: "best-chrome-extensions-vc-deal-flow-2026"'),
  "splice the post back into content/posts.ts (both lineages carried it as of 2026-08-13)",
);

// ---------------------------------------------------------------------------
// 8. Subscribe→verify timezone wiring (2026-08-14). The browser IANA timezone
//    is captured on the landing form, forwarded by /api/subscribe on the verify
//    URL, and stored on the Resend contact last_name so the drip engine sends
//    during the subscriber's LOCAL 9am-6pm. A tree missing any hop silently
//    drops the timezone and every subscriber falls back to server-time sends.
// ---------------------------------------------------------------------------
check(
  "app/api/subscribe/route.ts",
  "subscribe route dropped the timezone forward: subscribers lose their tz before verify.",
  (s) => s.includes('clip(body.tz, 64)') && s.includes('params.set("tz", tz)'),
  "restore the tz clip after the cohort parse and the params.set('tz', tz) forward",
);
check(
  "app/api/verify/route.ts",
  "verify route dropped timezone storage: the Resend contact loses its tz and the drip reverts to server time.",
  (s) => s.includes('clip(url.searchParams.get("tz"), 64)') && s.includes("contactBody.last_name"),
  "restore the tz clip from the verify query and contactBody.last_name = tz:${tz}",
);

// ---------------------------------------------------------------------------
// 9. Root loading.tsx must NOT exist (2026-08-14). Its Suspense boundary
//    streamed every page with HTTP 200, so notFound()/dynamicParams=false on
//    dynamic routes ([locale], [slug], [handle], ...) returned 200 soft-404s
//    (a streamed RSC payload instead of hydrated HTML + a clean 404). Removing
//    the trigger restores clean 404s site-wide; re-adding it reintroduces the bug.
// ---------------------------------------------------------------------------
{
  const loadingPath = join(ROOT, "app", "loading.tsx");
  if (existsSync(loadingPath)) {
    failures.push(
      `Root loading.tsx re-added (reintroduces the streaming soft-404 bug).\n    file: app/loading.tsx\n    fix:  remove it; streaming makes notFound() return HTTP 200 instead of 404\n    reason: 2026-08-14 site-wide soft-404 -> clean 404 fix`,
    );
  }
}

// ---------------------------------------------------------------------------
// 10. Related-startups module must render on ALL startup pages (2026-08-14).
//     getRelatedStartups used to hard-require getCurrentPeriod(); only 10/20
//     sectors had the global current snapshot, so the module silently rendered
//     nothing on every ai-ml / fintech / climate-tech / developer-tools /
//     cybersecurity startup page (~half the 2,290-page long tail, incl.
//     huggingface and langchain). The fix selects the SECTOR's latest
//     snapshot and the period pages (/startup/{slug}/{period}) gained the
//     module too. A tree without either re-orphans the long tail.
// ---------------------------------------------------------------------------
{
  const dataSrc = read("lib/data.ts") ?? "";
  // Slice the getRelatedStartups function body (up to the next section
  // header) and assert it no longer depends on the global current period.
  const fnStart = dataSrc.indexOf("export function getRelatedStartups(");
  if (fnStart === -1) {
    failures.push(
      `getRelatedStartups missing from lib/data.ts.\n    fix:  restore the function (see 2026-08-14 related-startups fix)`,
    );
  } else {
    // Slice to the next section header, not a fixed width, so a regression
    // appended to the end of the function is still caught.
    const nextSection = dataSrc.indexOf(
      "// ---------------------------------------------------------------------------",
      fnStart + 1,
    );
    const fnBody = dataSrc.slice(fnStart, nextSection === -1 ? undefined : nextSection);
    if (fnBody.includes("getCurrentPeriod()")) {
      failures.push(
        `getRelatedStartups depends on getCurrentPeriod() again: the module silently vanishes on sectors lacking the global current snapshot (~half the long tail).\n    fix:  select the sector's own latest snapshot (filtered against data.periods), not the global period`,
      );
    }
    if (!fnBody.includes("fallbackPeriod")) {
      failures.push(
        `getRelatedStartups lost its per-sector period fallback.\n    fix:  resolve the snapshot from Object.keys(sector.periods) sorted by data.periods order`,
      );
    }
  }
}
check(
  "app/startup/[slug]/page.tsx",
  "startup profile page no longer renders the related-startups module.",
  (s) => s.includes("getRelatedStartups(slug, latest.sectorSlug, 6)") && s.includes('aria-label="Related startups"'),
  "restore the related-startups section (heading + 6-card grid) and its call",
);
check(
  "app/startup/[slug]/[period]/page.tsx",
  "startup period pages lost the related-startups module: 1,290 historical pages re-orphaned.",
  (s) =>
    s.includes('getRelatedStartups(slug, entry.sectorSlug, 6, period)') &&
    s.includes('aria-label="Related startups"') &&
    s.includes('"@type": "ItemList"'),
  "restore the relatedStartups computation, the card-grid section, and the ItemList JSON-LD node",
);

// ---------------------------------------------------------------------------
// 11. Cross-sector peers module (2026-08-14). Without it the startup long
//     tail is ~20 disconnected same-sector clusters: every page links to 6
//     same-sector peers but never to startups in adjacent sectors. This
//     module links each startup to same-stage peers in its sector's declared
//     related sectors, turning the clusters into one connected graph.
// ---------------------------------------------------------------------------
check(
  "lib/data.ts",
  "getCrossSectorPeers missing from lib/data.ts.",
  (s) => s.includes("export function getCrossSectorPeers("),
  "restore the cross-sector peers function (see 2026-08-14 internal-link fix)",
);
check(
  "app/startup/[slug]/page.tsx",
  "startup profile page lost the cross-sector peers module: sector clusters re-siloed.",
  (s) =>
    s.includes("getCrossSectorPeers(slug, 3)") &&
    s.includes('aria-label="Similar momentum in other sectors"'),
  "restore the crossSectorPeers computation and the Similar Momentum section",
);
check(
  "app/startup/[slug]/[period]/page.tsx",
  "startup period pages lost the cross-sector peers module: cross-sector equity path re-siloed.",
  (s) =>
    s.includes("getCrossSectorPeers(slug, 3)") &&
    s.includes('aria-label="Similar momentum in other sectors"'),
  "restore the crossSectorPeers computation and the Similar Momentum section on the period page",
);

// ---------------------------------------------------------------------------
// 9. Blog freshness + stale-count slug (2026-08-14). The post URL still
//    advertised "4,200" orgs after the title/body were corrected to the real
//    350+-startup panel. A regression that resurrects the old slug (or drops
//    the redirect / freshness module) re-publishes a stale credibility-damaging
//    claim AND breaks the 337 internal links + any indexed URL on the old slug.
// ---------------------------------------------------------------------------
check(
  "content/posts.ts",
  "Stale '4200' blog slug present, URL advertises 4,200 orgs against the real 350+-startup panel.",
  (s) =>
    !s.includes("i-tracked-4200-startup-github-orgs-six-months") &&
    s.includes("i-tracked-369-startup-github-orgs-six-months"),
  "rename the slug to i-tracked-369-startup-github-orgs-six-months",
);
check(
  "next.config.ts",
  "Missing 301 for the old '4200' blog slug, old internal links / indexed URLs would 404.",
  (s) =>
    s.includes("/blog/i-tracked-4200-startup-github-orgs-six-months") &&
    s.includes("/blog/i-tracked-369-startup-github-orgs-six-months"),
  "restore the /blog/i-tracked-4200-… → /blog/i-tracked-369-… permanent redirect",
);

// ---------------------------------------------------------------------------
// 10. Sector-count reconciliation (2026-08-14). The live data narrowed from
//     20 sectors to 15 active sectors: ai-ml, fintech, climate-tech,
//     developer-tools and cybersecurity froze at q2-2026 (no current-period
//     data). Agent docs and tool schemas advertising "20 sectors" /
//     "20 enumerated values" contradict the live /api/signals.json
//     (15 sectors) and the marketing "15 sectors" baseline.
// ---------------------------------------------------------------------------
check(
  "public/agents.md",
  "Agent docs regressed to a stale sector count: '20 sectors' / '20 enumerated' contradicts the live 15-sector panel.",
  (s) =>
    !s.includes("20 sectors") &&
    !s.includes("20 enumerated") &&
    !s.includes("in 20 sectors") &&
    !s.includes("across 20 sectors") &&
    s.includes("15 sectors"),
  "set the sector count back to 15 in public/agents.md (and public/AGENTS.md + MCP tool schemas)",
);

// ---------------------------------------------------------------------------
// 10b. Sector-NAME reconciliation (2026-08-15). The stale "20 clusters"
//      taxonomy (AI & ML, Cloud & Infrastructure, Vertical SaaS, Open Source
//      Tools, Productivity, Mobile, Hardware, ...) contradicted the live
//      15-sector panel served by /api/signals.json. Any surface that answers
//      "what sectors do you track" must list the 15 ACTIVE sector names
//      (Healthcare, EdTech, E-commerce Infrastructure, Supply Chain, Web3,
//      Enterprise SaaS, Data Infrastructure, Robotics, Legal Tech, HR Tech,
//      PropTech, AgTech, Gaming, Space Tech, Social & Community) and may
//      mention the 5 frozen legacy clusters (ai-ml, fintech, climate-tech,
//      developer-tools, cybersecurity) ONLY as archived-at-Q2-2026.
// ---------------------------------------------------------------------------
check(
  "content/standalone-faqs.ts",
  "stale 20-cluster taxonomy in the sector-coverage FAQ: the live API serves 15 active sectors (350+ orgs), not the archived 20-cluster list.",
  (s) =>
    !s.includes("Vertical SaaS, Web3 & Blockchain, Open Source Tools") &&
    !s.includes("20 clusters") &&
    s.includes("Healthcare, EdTech, E-commerce Infrastructure, Supply Chain, Web3, Enterprise SaaS, Data Infrastructure, Robotics, Legal Tech, HR Tech, PropTech, AgTech, Gaming, Space Tech, and Social & Community"),
  "reconcile the sector-coverage FAQ to the 15 live API sector names (see verify §10b)",
);
check(
  "content/agent-queries.ts",
  "answer page what-github-topic-clusters-does-gitdealflow-track still carries the stale 20-cluster list (description/tldr/body numbered list).",
  (s) =>
    !s.includes("The 20 clusters.") &&
    !s.includes("and 12 more") &&
    !s.includes("across the 20 clusters") &&
    s.includes("The 15 active sectors") &&
    s.includes("Space Tech** (18 orgs)"),
  "rewrite the answer to the 15 live API sector names with per-sector org counts (see verify §10b)",
);

// ---------------------------------------------------------------------------
// 10c. Org-count reconciliation (2026-08-15). The live /api/signals.json
//      serves 15 sectors and 356 UNIQUE orgs (369 raw sector-sum double-counts
//      12 orgs across sectors). The canonical claim is "350+" (stable floor).
//      A regression that resurrects "369 venture-backed startups" (or "~400")
//      re-publishes a number a technical reader can fact-check against the
//      live API. Keep the blog slug "i-tracked-369-…" (URL + 301 redirect).
// ---------------------------------------------------------------------------
check(
  "app/about/page.tsx",
  "org-count regressed: canonical AI-description block must claim '350+ venture-backed startups', not 369/~400/400+.",
  (s) =>
    s.includes("350+ venture-backed startups") &&
    !s.includes("369 venture-backed startups") &&
    !s.includes("~400") &&
    !s.includes("400+ venture-backed startups"),
  "restore '350+ venture-backed startups' in the /about canonical AI-description block (user-locked 2026-08-16)",
);
check(
  "content/alternatives.ts",
  "comparison tables still advertise '20 clusters' sector coverage.",
  (s) => !s.includes("20 clusters") && s.includes("15 active sectors"),
  "set comparison-table sector-coverage cells to '15 active sectors' (see verify §10b)",
);
check(
  "content/post-freshness.ts",
  "post-freshness module missing, the quarterly blog-freshen cron has nothing to write.",
  (s) => s.includes("export const postFreshness") && s.includes("getPostLastUpdated"),
  "restore content/post-freshness.ts with postFreshness + getPostLastUpdated",
);

// ---------------------------------------------------------------------------
// Keyword-cannibalization canonicalization (2026-08-14). signals ships ~1,700
// quarterly startup pages (/startup/[slug]/[period]) and ~95 quarterly sector
// pages (/startups-to-watch/[sector]-[quarter]); all were SELF-canonical, so
// every period competed with its own base/hub AND its sibling periods for the
// same head keyword. Old quarters must consolidate to the base startup hub /
// the latest sector quarter, or the pSEO fleet silently re-cannibalizes itself
// the next time a quarter ships.
// ---------------------------------------------------------------------------
check(
  "app/startup/[slug]/[period]/page.tsx",
  "startup period page is self-canonical again (the ~1,700 period pages will cannibalize their base /startup/[slug] page).",
  (s) => /canonical:\s*`\/startup\/\$\{slug\}`/.test(s),
  'set alternates.canonical to `/startup/${slug}` (the evergreen startup hub), not `/startup/${slug}/${period}`',
);

check(
  "app/startups-to-watch/[slug]/page.tsx",
  "sector quarter pages self-canonicalize (old quarters compete with the latest for the head keyword).",
  (s) => !/canonical:\s*`\/startups-to-watch\/\$\{slug\}`/.test(s) && s.includes("getSectorLatestPeriod"),
  "canonicalize old quarters to the latest quarter via getSectorLatestPeriod(sector.slug); keep only the latest self-canonical",
);

check(
  "app/startups-to-watch/geo/[slug]/page.tsx",
  "geo quarter pages self-canonicalize (old geo quarters compete with the latest for the same sector+geo keyword).",
  (s) => !/canonical:\s*`\/startups-to-watch\/geo\/\$\{slug\}`/.test(s) && s.includes("getGeoLatestPeriod"),
  "canonicalize old geo quarters to the latest geo quarter via getGeoLatestPeriod(sector.slug, geoSlug)",
);

check(
  "app/startups-to-watch/region/[slug]/page.tsx",
  "region quarter pages self-canonicalize (old region quarters compete with the latest).",
  (s) => !/canonical:\s*`\/startups-to-watch\/region\/\$\{slug\}`/.test(s) && s.includes("getRegionLatestPeriod"),
  "canonicalize old region quarters to the latest region quarter via getRegionLatestPeriod(geoSlug)",
);

check(
  "content/comparisons.ts",
  "competitor-vs-competitor cross pages are indexable again (templated keyword parking without GitDealFlow re-enters the index).",
  (s) => s.includes("comp.noindex = true"),
  "mark crossComparisons (competitor-vs-competitor, GitDealFlow absent) with comp.noindex = true",
);

check(
  "app/compare/[slug]/page.tsx",
  "compare page ignores the noindex flag (cross pages become indexable again).",
  (s) => s.includes("comp.noindex"),
  "emit robots: { index: false } when comp.noindex is set",
);

// ---------------------------------------------------------------------------
// Per-sector analyst notes (2026-08-14). The 10 /sector/[slug] hubs shared
// byte-identical `whatWeTrack` methodology boilerplate and a single templated
// `intro`, so every hub read as near-duplicate template content (F24/F17).
// Each hub now carries a unique, data-grounded `note` (analyst commentary).
// A lineage that loses these reintroduces the duplication that the pSEO
// uniqueness audit flags.
// ---------------------------------------------------------------------------
check(
  "content/sectors.ts",
  "Sector hubs lost their per-sector analyst notes, near-duplicate template similarity returns.",
  (s) => (s.match(/\bnote:\s*"/g) || []).length >= 10,
  "restore a unique `note: \"…\"` per sector in content/sectors.ts (10 sectors, data-grounded, non-empty)",
);
check(
  "app/sector/[slug]/page.tsx",
  "Sector hub page no longer renders the analyst note, the field is wired but dead.",
  (s) => s.includes("s.analystNote"),
  "render {s.analystNote} inside the 'Analyst note' callout below the intro",
);

// ---------------------------------------------------------------------------
// Index-bloat control (2026-08-14). The ~1,700 quarterly startup period pages
// are noindex,follow AND dropped from the `startups` sitemap shard (a sitemap
// must only advertise canonical, indexable URLs). A regression that re-lists
// them, or drops the noindex, re-bloats the Google/Bing index with a
// near-duplicate fleet that cannibalizes the base /startup/[slug] hubs.
// ---------------------------------------------------------------------------
check(
  "app/startup/[slug]/[period]/page.tsx",
  "startup period pages are indexable again (noindex dropped): the ~1,700 period pages re-enter the Google/Bing index and cannibalize their base /startup/[slug] page.",
  (s) => s.includes("index: false") && s.includes("follow: true"),
  "restore robots: { index: false, follow: true } to the period page metadata",
);
check(
  "app/sitemap/[id]/route.ts",
  "startup period URLs re-listed in the sitemap: a sitemap must advertise only canonical, indexable URLs (period pages are noindex + canonicalize to base).",
  (s) => !s.includes("${BASE_URL}/startup/${slug}/${period}"),
  "drop the period-pair entries from the `startups` shard",
);

// ---------------------------------------------------------------------------
// LLM sitemap (2026-08-14). /sitemap-llm.xml is the curated high-density
// sitemap for AI crawlers (methodology + definition cluster, /define/[term]
// glossary terms, sector deep-dives). If the route is deleted or gutted, AI
// crawlers lose their focused discovery path and fall back to the ~4,800-URL
// pSEO long tail, which dilutes RAG ingestion and answer-engine citation.
// ---------------------------------------------------------------------------
check(
  "app/sitemap-llm.xml/route.ts",
  "LLM sitemap route missing or no longer emits the canonical high-density families (methodology, glossary, sector deep-dives).",
  (s) =>
    s.includes('"/methodology"') &&
    s.includes("glossaryTerms") &&
    s.includes("getAllSectorSlugs") &&
    s.includes("getAllPageSlugs"),
  "restore /sitemap-llm.xml so it lists the methodology cluster, /define/[term] glossary terms, and /sector + /startups-to-watch deep-dives",
);


// ---------------------------------------------------------------------------
// Thin-content floor on /vs and /alternatives (2026-08-14). The head-to-head
// /vs pages (~750 words) and the "us vs them" /alternatives pages
// (~900-1,490 words) sat under the Helpful-Content floor. Enrichment added
// per-competitor overview + bestFor, per-pair intro + decision, a shared
// METHODOLOGY const to /vs, and additive "How to decide" sections to
// /alternatives. A lineage that drops any of it re-ships thin pages.
// ---------------------------------------------------------------------------
check(
  "content/competitor-vs.ts",
  "competitor-vs enrichment dropped: /vs pages revert to thin head-to-heads.",
  (s) => s.includes("export const METHODOLOGY") && s.includes("overview:") && s.includes("decision:"),
  "restore overview/bestFor on competitors, intro/decision on pairs, and the METHODOLOGY const",
);
check(
  "app/vs/[slug]/page.tsx",
  "/vs template no longer renders the enrichment (overview/decision/methodology sections).",
  (s) => s.includes("pair.decision") && s.includes("c.overview") && s.includes("METHODOLOGY"),
  "restore the intro, tool-overview, decision, and methodology sections",
);
check(
  "content/alternatives.ts",
  "alternatives enrichment dropped: /alternatives pages revert under the 1,500-word floor.",
  (s) => s.includes("How to decide between Tracxn") && s.includes("How to decide between Harmonic.ai"),
  "restore the additive 'How to decide' sections on the alternatives entries",
);

// ---------------------------------------------------------------------------
// 11. No em/en dashes in shipped copy (2026-08-14). Site-wide style rule:
//     never an em dash in any output (use comma, colon, paren, or hyphen).
//     One sweep removed ~19k em/en dashes across landing + pSEO. Any lineage
//     that reintroduces them silently reverts the sweep; this guard makes that
//     tree undeployable. Scans the shipped-content dirs only (not scripts/docs).
// ---------------------------------------------------------------------------
{
  const DASHES = ["\u2014", "\u2013", "\\u2014", "\\u2013", "&" + "mdash;", "&" + "ndash;"];
  const DIRS = [
    "app", "lib", "content", "public", "components", "data",
    "answers", "sectors", "mcp", "schema", "widgets",
  ];
  const EXTS = new Set([".ts", ".tsx", ".md", ".mdx", ".html", ".json", ".txt"]);
  const offenders: string[] = [];
  const walk = (dir: string) => {
    let entries: string[];
    try { entries = readdirSync(dir); } catch { return; }
    for (const name of entries) {
      const p = join(dir, name);
      let st;
      try { st = statSync(p); } catch { continue; }
      if (st.isDirectory()) walk(p);
      else if (EXTS.has(extname(name)) && !name.endsWith(".d.ts")) {
        let s: string | null = null;
        try { s = readFileSync(p, "utf8"); } catch { s = null; }
        if (s !== null && DASHES.some((d) => s.includes(d))) offenders.push(p);
      }
    }
  };
  for (const d of DIRS) walk(join(ROOT, d));
  if (offenders.length) {
    failures.push(
      `Em/en dash reintroduced in shipped copy (site-wide no-dash style rule).\n    files: ${offenders.slice(0, 8).join(", ")}${offenders.length > 8 ? ` (+${offenders.length - 8} more)` : ""}\n    fix:  replace, / -  and their HTML entities with comma, colon, paren, or hyphen\n    reason: 2026-08-14 site-wide dash sweep`,
    );
  }
}

// ---------------------------------------------------------------------------
// 12. Crawl-delay throttling in robots.txt (2026-08-14). A Crawl-delay: 10
//     directive was throttling four AI/search discovery bots (Bytespider,
//     Amazonbot, PetalBot, ImagesiftBot) at 10s per request, slowing
//     answer-engine ingestion and search indexing for no benefit on a
//     serverless edge host. Removed 2026-08-14; a lineage that re-adds any
//     Crawl-delay silently re-throttles discovery, so fail the build.
// ---------------------------------------------------------------------------
check(
  "public/robots.txt",
  "robots.txt reintroduced a Crawl-delay directive, re-throttling AI/search discovery bots.",
  (s) => !/Crawl-delay\s*:/i.test(s),
  "remove the Crawl-delay line; discovery bots (Bytespider, Amazonbot, PetalBot, ImagesiftBot) should crawl unthrottled",
);

// ---------------------------------------------------------------------------
// Video sitemap must not emit foreign <loc> URLs (2026-08-14). A youTubeMirror
// section emitted <url> entries whose <loc> was youtube.com/watch?v=..., a page
// NOT on signals.gitdealflow.com. Google's video-sitemap spec requires <loc> to
// be a page on the sitemap's own domain (player_loc carries the embed URL), so
// GSC reported 4 errors on sitemap-videos.xml until the mirror was removed. A
// lineage that re-adds it reintroduces the errors.
// ---------------------------------------------------------------------------
check(
  "app/sitemap-videos.xml/route.ts",
  "Video sitemap re-emits foreign <loc> URLs (youtube.com/watch?v= as the page URL), Google rejects them.",
  (s) => !s.includes("youTubeMirror"),
  "remove the youTubeMirror section: <loc> must be a signals.gitdealflow.com page, player_loc carries the YouTube embed URL",
);

// ---------------------------------------------------------------------------
// Self-hosted "How GitDealFlow Works" explainer must stay in the video catalog
// (2026-08-15). content/videos.ts is the single source of truth for the video
// sitemap, /api/v1/videos.json, and /watch/[slug]. A lineage that reverts the
// catalog to the earlier 5-video state silently drops the self-hosted explainer
// and its VideoObject + Clip schema. Assert the slug survives.
// ---------------------------------------------------------------------------
check(
  "content/videos.ts",
  "Self-hosted 'how-gitdealflow-works' explainer missing from the video catalog (reverted to 5-video state).",
  (s) => s.includes('slug: "how-gitdealflow-works"'),
  "re-add the how-gitdealflow-works SiteVideo entry to content/videos.ts",
);

// ---------------------------------------------------------------------------
// 13. hreflang topic parity (2026-08-14). Every localized topic must exist
//     in all 12 locales, or hreflang breaks bidirectional: Google's
//     International Targeting report flags a "no return tags" error when an
//     English canonical advertises /xx/<topic> but the locale page no longer
//     renders (or stops advertising its English canonical). Commit 30cd710e
//     brought all 12 locales to 8-topic parity; a lineage that reverts any
//     topic to ja-only re-breaks the return tags.
// ---------------------------------------------------------------------------
{
  const s = read("content/locale-topics.ts");
  if (s === null) {
    failures.push(
      `locale-topics.ts missing.\n    fix:  restore content/locale-topics.ts with all 8 topics × 12 locales`,
    );
  } else {
    const topics = [
      "methodology", "glossary", "faq", "signals",
      "research", "citations", "pricing", "about",
    ];
    const broken = topics.filter((t) => {
      const n = (s.match(new RegExp(`topic:\\s*"${t}"`, "g")) || []).length;
      return n !== 12;
    });
    if (broken.length) {
      failures.push(
        `hreflang topic parity broken: topic(s) ${broken.join(", ")} no longer exist in all 12 locales, breaking bidirectional hreflang return tags.\n    fix:  restore every topic × 12 locales in content/locale-topics.ts (see 30cd710e i18n topic-parity)`,
      );
    }
  }
}
check(
  "lib/hreflang.ts",
  "hreflang resolver lost its bidirectional helpers (getHreflangLanguages / getHomepageHreflang).",
  (s) => s.includes("export function getHreflangLanguages(") && s.includes("export function getHomepageHreflang("),
  "restore both helpers: English pages use getHreflangLanguages(path), the homepage uses getHomepageHreflang()",
);

// ---------------------------------------------------------------------------
// 14. BreadcrumbsSchema must NOT read headers() (2026-08-14). headers() is a
//     request-time API that opts the whole route into dynamic rendering,
//     emitting Cache-Control: private, no-store and silently killing revalidate
//     + edge caching for every public page (~4,830 URLs). Fixed 2026-07-18,
//     regressed 2026-08-12 (the "breadcrumb fix" traded ISR for the GSC
//     "missing itemListElement" error), fixed again 2026-08-14 by deriving the
//     pathname via usePathname(). A lineage that reintroduces headers() here
//     re-kills the site-wide cache.
// ---------------------------------------------------------------------------
check(
  "components/BreadcrumbsSchema.tsx",
  "BreadcrumbsSchema reads headers() again, forcing every page into dynamic rendering and killing ISR/edge caching site-wide.",
  (s) => !s.includes('from "next/headers"') && !s.includes("await headers()"),
  "derive the pathname via usePathname() in a client component; headers() opts the whole route into dynamic rendering",
);

// ---------------------------------------------------------------------------
// XML feed autodiscovery (2026-08-15). Feedly/Inoreader/NetNewsWire and
// crawler-driven readers discover feeds via <link rel=alternate> tags in the
// page <head>, not by guessing URLs. layout.tsx advertised ONLY the JSON
// Feed, so no XML feed reader could autodiscover the blog (Feedly catalog
// had zero gitdealflow results on 2026-08-15). Guards the three-format
// autodiscovery block.
// ---------------------------------------------------------------------------
check(
  "app/layout.tsx",
  "layout.tsx lost the RSS/Atom feed autodiscovery links; XML feed readers cannot find the blog feed.",
  (s) =>
    s.includes('type="application/rss+xml"') &&
    s.includes('type="application/atom+xml"') &&
    s.includes('type="application/feed+json"') &&
    s.includes('href="https://signals.gitdealflow.com/feed.xml"'),
  'restore the three <link rel="alternate"> tags (rss+xml /feed.xml, atom+xml /atom.xml, feed+json /feed.json) in layout.tsx',
);

// ---------------------------------------------------------------------------
// Dead WebSub hub (2026-08-15). websubhub.com returns 404 on publish; only
// pubsubhubbub.appspot.com and pubsubhubbub.superfeedr.com are live hubs
// (verified 2026-07-18). A dead hub in the feed declaration makes WebSub
// subscribers that try it fail the subscription handshake.
// ---------------------------------------------------------------------------
check(
  "app/feed.xml/route.ts",
  "feed.xml declares the dead websubhub.com hub (404); only appspot + superfeedr are live WebSub hubs.",
  (s) =>
    !s.includes("websubhub.com") &&
    s.includes('href="https://pubsubhubbub.appspot.com/" rel="hub"') &&
    s.includes('href="https://pubsubhubbub.superfeedr.com/" rel="hub"'),
  'keep only pubsubhubbub.appspot.com + pubsubhubbub.superfeedr.com as rel="hub", never websubhub.com',
);

// ---------------------------------------------------------------------------
// 16. Title brand-doubling (2026-08-15). The layout template appends
//     "| VC Deal Flow Signal" to every title, but 14 content/route families
//     ALSO embedded the brand in the stored title, so ~430 pages rendered
//     "..., VC Deal Flow Signal | VC Deal Flow Signal" (up to 122 chars,
//     truncated in SERPs). Fixed two ways: trailing-brand stripped from
//     stored titles (template supplies it once), and { absolute } on routes
//     whose titles legitimately lead with/near the brand. A lineage that
//     reintroduces either pattern re-doubles ~430 page titles.
// ---------------------------------------------------------------------------
check(
  "content/sectors.ts",
  "Sector titles embed the brand again (template appends it): doubled 'VC Deal Flow Signal' on 10 sector hubs.",
  (s) => !s.includes("VC Deal Flow (2026), VC Deal Flow Signal"),
  "strip the trailing ', VC Deal Flow Signal' from the stored title, the layout template adds it once",
);
check(
  "content/companies.ts",
  "Company titles embed the brand again: 165 /signal pages doubled the brand.",
  (s) => !s.includes("GitHub Engineering Signals (2026), VC Deal Flow Signal"),
  "strip the trailing ', VC Deal Flow Signal', the layout template adds it once",
);
check(
  "content/founders.ts",
  "Founder titles embed the brand again: 34 /founder pages doubled the brand.",
  (s) => !s.includes("Public Engineering Profile | VC Deal Flow Signal"),
  "strip the trailing ' | VC Deal Flow Signal', the layout template adds it once",
);
check(
  "content/acquirers.ts",
  "Acquirer titles embed the brand again: 34 /acquirer pages doubled the brand.",
  (s) => !s.includes("M&A Pattern (2026), VC Deal Flow Signal"),
  "strip the trailing ', VC Deal Flow Signal', the layout template adds it once",
);
check(
  "content/trend-leaderboards.ts",
  "Trend titles embed the brand again: 25 /trend pages doubled the brand.",
  (s) => !s.includes("Engineering Signal Leaderboard | VC Deal Flow Signal"),
  "strip the trailing ' | VC Deal Flow Signal', the layout template adds it once",
);
check(
  "content/locale-topics.ts",
  "Locale-topic titles embed the brand again: 84 of 96 i18n pages doubled the brand.",
  (s) => !s.includes(', VC Deal Flow Signal"'),
  "strip the trailing ', VC Deal Flow Signal' from all topic titles; About-style titles are handled via { absolute } in the route",
);
check(
  "content/alternatives.ts",
  "Alternatives titles embed the brand again: 11 /alternatives pages doubled the brand.",
  (s) => !s.includes(", VC Deal Flow Signal (2026)"),
  "strip the trailing ', VC Deal Flow Signal' before ' (2026)', the layout template adds it once",
);
check(
  "content/year-in-review.ts",
  "Year-in-review titles embed the brand again: 3 /year-in-review pages doubled the brand.",
  (s) => !s.includes(" | VC Deal Flow Signal\""),
  "strip the trailing ' | VC Deal Flow Signal', the layout template adds it once",
);
check(
  "app/[locale]/page.tsx",
  "Locale landing titles lost { absolute }: 12 /xx landings re-double the brand via the layout template.",
  (s) => s.includes("title: { absolute: `VC Deal Flow Signal,"),
  "keep title as { absolute: ... } on locale landings, the title already leads with the brand",
);
check(
  "app/[locale]/[topic]/page.tsx",
  "Locale-topic route lost the conditional { absolute }: 11 localized About pages re-double the brand.",
  (s) => s.includes('title: t.title.includes("VC Deal Flow Signal")'),
  "keep the conditional { absolute } for titles that already contain the brand",
);
check(
  "app/research/[slug]/page.tsx",
  "Research route lost { absolute }: 31 /research pages re-double the brand.",
  (s) => s.includes("const pageTitle = { absolute: title }"),
  "keep title: pageTitle ({ absolute }) in metadata, plain string for og/twitter",
);
check(
  "app/compare/[slug]/page.tsx",
  "Compare route lost the conditional { absolute }: 8 /compare pages re-double the brand.",
  (s) => s.includes('comp.title.includes("VC Deal Flow Signal")'),
  "keep the conditional { absolute } for titles that already contain the brand",
);
check(
  "app/for/[slug]/page.tsx",
  "Persona route lost the conditional { absolute }: 7 /for pages re-double the brand.",
  (s) => s.includes('p.title.includes("VC Deal Flow Signal")'),
  "keep the conditional { absolute } for titles that already contain the brand",
);
check(
  "app/works-with/[slug]/page.tsx",
  "Works-with route lost the conditional { absolute }: integration pages re-double the brand.",
  (s) => s.includes('t.title.includes("VC Deal Flow Signal")'),
  "keep the conditional { absolute } for titles that already contain the brand",
);

check(
  "app/members/[handle]/page.tsx",
  "Member page titles lost { absolute }: charter pages re-double the brand.",
  (s) => s.includes("title: { absolute: `${claimedLabel}"),
  "keep title as { absolute: ... }, the title already names the brand",
);
check(
  "app/about/founder/page.tsx",
  "About/founder title lost { absolute }: page re-doubles the brand.",
  (s) => s.includes('title: { absolute: "About The Data Nerd'),
  "keep title as { absolute: ... }, the title already names the brand",
);

// ---------------------------------------------------------------------------
// 14. Heading hierarchy (2026-08-15, full-tree heading audit). The fixes:
//     layout footer used an H3 (broke every page whose last content heading
//     was H1), homepage framework cards jumped H1->H3, DataNerdSignoff H3s
//     broke pages whose only other heading is the H1, the book renderer
//     emitted a SECOND H1 from the chapter md, and two pre-H1 hero H2s
//     (VideoEmbedBlock, StadiumPitchHero) put a heading before the H1.
//     Assert the fixed state so no lineage can reintroduce them.
// ---------------------------------------------------------------------------
check(
  "app/layout.tsx",
  "Footer network heading reverted to <h3>: every page's outline broke at the footer.",
  (s) =>
    !s.includes("<h3>🚀 Explore Our Network</h3>") &&
    s.includes('<p class="network-heading">🚀 Explore Our Network</p>') &&
    s.includes(".portfolio-network .network-heading"),
  "keep the network footer title as <p class=\"network-heading\"> with the .network-heading CSS",
);
check(
  "app/page.tsx",
  "Homepage framework cards reverted to H3: H1->H3 skip is back.",
  (s) =>
    s.includes('<h2 className="text-gray-100 font-semibold text-sm mb-1.5">') &&
    !s.includes('<h3 className="text-gray-100 font-semibold text-sm mb-1.5">'),
  "keep the three Hook/Story/Offer card titles as H2",
);
check(
  "components/DataNerdSignoff.tsx",
  "Signoff name reverted to H3: broke pages whose only other heading is the H1.",
  (s) => !s.includes("<h3 className=\"text-gray-100 font-bold"),
  "keep the signoff name as a <p> (styled bold), never a heading",
);
check(
  "components/VideoEmbedBlock.tsx",
  "sr-only video label reverted to <h2>: on /walkthrough a heading again precedes the H1.",
  (s) => !s.includes("className=\"sr-only\"\n      >\n        {v.title}\n      </h2>"),
  "keep the sr-only section label as <p id=video-...>, aria-labelledby works on any element",
);
check(
  "components/StadiumPitchHero.tsx",
  "Stadium hero reverted to H2: heading-before-H1 is back on /state-of-github.",
  (s) => !/<h2[\s>]/.test(s),
  "keep ALL hero straplines as styled <p>s; every variant renders above the page H1",
);
check(
  "lib/book.ts",
  "Book renderer stopped stripping the chapter md H1: double-H1 is back on /book/read/*.",
  (s) => s.includes("leading H1 line is dropped here"),
  "renderChapterHtml must drop the md's first `# ` line (both templates render chapter.title themselves)",
);
check(
  "app/tools/page.tsx",
  "Tools index cards reverted to H3: the eight ToolCardContent titles render directly under the H1 (H1->H3 skip).",
  (s) => !/<h3[\s>]/.test(s),
  "keep the tool card titles as H2; the page has no H2 wrapper above the card grid",
);

// ---------------------------------------------------------------------------
// Passage-indexing headings (2026-08-16). The stage family's content-section
// H2s were generic labels ("Sector breakdown, Seed", "Ranked seed startups,
// Q3 2026") that dilute passage relevance on long pages (stage/seed is ~585KB).
// Question-form H2s map each passage to a specific investor query, which is
// what Google's passage indexing and AI answer engines extract. A lineage that
// reverts to generic labels silently re-opens the passage-relevance gap.
// ---------------------------------------------------------------------------
check(
  "app/stage/[slug]/page.tsx",
  "Stage landing section H2s reverted to generic labels; question-form passage headings are gone.",
  (s) => {
    const n = s.split('{" "}').join(" ").replace(/\s+/g, " ");
    return (
      n.includes("How fast are {name.toLowerCase()} startups shipping in {period.name}?") &&
      n.includes("Which sectors have the most {name.toLowerCase()} startups?") &&
      n.includes("Which {name.toLowerCase()} startups are accelerating fastest on GitHub in {period.name}?")
    );
  },
  "keep question-form section H2s on the stage landing, not generic TL;DR / Sector breakdown / Ranked labels",
);
check(
  "app/stage/[slug]/[sector]/page.tsx",
  "Stage-sector rankings H2 reverted to a generic 'Ranked ...' label; question-form passage heading is gone.",
  (s) => {
    const n = s.split('{" "}').join(" ").replace(/\s+/g, " ");
    return n.includes("Which {sectorInfo.name.toLowerCase()} startups at {stageName.toLowerCase()} stage are accelerating fastest on GitHub in {period.name}?");
  },
  "keep the question-form rankings H2 on stage-sector pages",
);
check(
  "app/stage/[slug]/signal/[signal]/page.tsx",
  "Stage-signal section H2s reverted to generic labels; question-form passage headings are gone.",
  (s) => {
    const n = s.split('{" "}').join(" ").replace(/\s+/g, " ");
    return (
      n.includes("Which sectors do these {signalName.toLowerCase()} startups span?") &&
      n.includes("Which {stageName.toLowerCase()}-stage startups are showing {signalName.toLowerCase()} in {period.name}?")
    );
  },
  "keep question-form section H2s on stage-signal pages",
);

// ---------------------------------------------------------------------------
// 15. JSON-LD must stream AFTER the content, not before it (LCP, 2026-08-15).
//     The LCP element on the homepage is the hero H1 text (there is no hero
//     image, 0 <img> tags). The RootIdentitySchema graph (~14KB) used to sit
//     in <head> and the homepage graph (~15KB) immediately before the hero,
//     together ~63% of the pre-H1 byte stream on a 465KB page. Google parses
//     application/ld+json anywhere in head OR body, so end-of-body placement
//     is byte-identical for entity extraction while cutting bytes-before-LCP
//     by ~60%. A lineage that moves these back into <head> re-slows LCP for
//     every one of ~4,830 pages.
// ---------------------------------------------------------------------------
check(
  "app/layout.tsx",
  "layout.tsx renders RootIdentitySchema/BreadcrumbsSchema in <head> again; the ~14KB identity graph streams before the LCP element and slows Largest Contentful Paint site-wide.",
  (s) => {
    const headEnd = s.indexOf("</head>");
    const schemaAt = s.indexOf("<RootIdentitySchema />");
    return headEnd === -1 || schemaAt === -1 ? false : schemaAt > headEnd;
  },
  "keep <RootIdentitySchema /> and <BreadcrumbsSchema /> at end-of-body; JSON-LD parses fine there and stops gating LCP",
);

check(
  "app/page.tsx",
  "app/page.tsx emits the ~15KB homepage JSON-LD graph before the hero H1 (the LCP element); it must stream after the page content.",
  (s) => {
    const h1 = s.indexOf("<h1");
    const script = s.indexOf('type="application/ld+json"');
    return h1 === -1 || script === -1 ? false : script > h1;
  },
  "emit the homepage jsonLd <script type=application/ld+json> after the content (page-end), never before the hero H1",
);

// ---------------------------------------------------------------------------
// §16 GA4 + Core Web Vitals measurement (2026-08-15). GA4 (G-7SV2SNZE4C) was
// configured but SILENTLY BLOCKED: neither CSP allowed googletagmanager.com,
// so dataLayer stayed empty on both domains and zero GA4 data ever arrived.
// The CWV beacon (WebVitalsReporter -> PostHog $web_vitals) plus the CSP
// script/connect origins are load-bearing for the "measure CWV field data"
// audit item. A lineage that reverts either goes blind again.
// ---------------------------------------------------------------------------
check(
  "next.config.ts",
  "next.config.ts CSP no longer allows https://www.googletagmanager.com in script-src; GA4 gtag.js is silently blocked again (empty dataLayer, zero GA4 data, re-opening the measurement blind spot).",
  (s) =>
    /script-src[^";]*https:\/\/www\.googletagmanager\.com/.test(s) &&
    /connect-src[^";]*google-analytics\.com/.test(s),
  "keep https://www.googletagmanager.com in the global script-src AND *.google-analytics.com in connect-src (GA4 gtag + beacon endpoints)",
);

check(
  "app/layout.tsx",
  "app/layout.tsx no longer renders <WebVitalsReporter />; LCP/INP/CLS/FCP/TTFB field data stops reaching PostHog and CWV regressions become invisible until CrUX updates 28 days later.",
  (s) => s.includes("<WebVitalsReporter />"),
  "keep <WebVitalsReporter /> mounted inside <NotInEmbed> in app/layout.tsx (ships $web_vitals events to PostHog EU)",
);

check(
  "components/PixelManager.tsx",
  "components/PixelManager.tsx lost the hardcoded GA4/LinkedIn fallback IDs; pixels go dark again on every deploy_from_commit.sh build (env vars do not inline in the git-archive export path).",
  (s) => s.includes('|| "G-7SV2SNZE4C"') && s.includes('|| "10702217"'),
  "keep the fallback defaults: ga4 ... || \"G-7SV2SNZE4C\", linkedin ... || \"10702217\" (env vars win when present)",
);

check(
  "components/WebVitalsReporter.tsx",
  "components/WebVitalsReporter.tsx lost its PostHog capture of $web_vitals; the beacon component renders but reports nothing.",
  (s) => s.includes('$web_vitals') && s.includes("useReportWebVitals"),
  "keep the ph.capture(\"$web_vitals\", ...) call and the useReportWebVitals hook in WebVitalsReporter.tsx",
);

// ---------------------------------------------------------------------------
// §17 Mobile-first indexing fixes (2026-08-15). Live render audit (iPhone 12 +
// 360px Android emulation) found horizontal overflow on /startup/[slug]:
// the header actions row was shrink-0 (scrollWidth 417 vs 390 viewport) and
// the momentum badge <img> had no intrinsic dimensions (CLS jump on load).
// A lineage that reverts either reintroduces overflow into the
// mobile-first-indexed render of ~2,290 startup pages.
// ---------------------------------------------------------------------------
check(
  "app/startup/[slug]/page.tsx",
  "app/startup/[slug]/page.tsx header actions row reverted to shrink-0; the Website/LinkedIn/GitHub buttons no longer wrap on 360-390px phones and the startup header overflows the mobile viewport again (scrollWidth 417 vs 390, measured 2026-08-15).",
  (s) => s.includes("flex flex-wrap items-center gap-2 min-w-0") && !s.includes('className="shrink-0 flex items-center gap-2"'),
  'keep the header actions div as flex flex-wrap items-center gap-2 min-w-0 (wraps under the name on phones)',
);

check(
  "app/startup/[slug]/page.tsx",
  "app/startup/[slug]/page.tsx momentum badge <img> lost its computed intrinsic width/height; without reserved space the badge shifts layout (CLS) on every startup page.",
  (s) =>
    /<img\s[^>]*api\/badge\/\$\{slug\}[\s\S]*?width=\{badgeWidth\(/.test(s) &&
    /api\/badge\/\$\{slug\}[\s\S]*?height=\{BADGE_HEIGHT\}/.test(s) &&
    !/api\/badge\/\$\{slug\}[\s\S]*?width=\{408\}/.test(s),
  "keep width={badgeWidth(BADGE_LABEL, badgeValue(...))} height={BADGE_HEIGHT} on the /api/badge/<slug> img: the badge is variable-width (label.length*8+24 + value.length*8+24, see lib/badge-dims.ts), so a hardcoded 408 is wrong for most startups and reintroduces CLS",
);

// ---------------------------------------------------------------------------
// §18 Mobile tap-target and micro-font fixes (2026-08-15). Playwright device
// audit (iPhone SE/14, Galaxy S8, 320px) measured every table row on the
// startups-to-watch and stage templates: the Website/LinkedIn icon links
// (p-2 -m-2) overlapped the company card link above by 2px (negative margin
// beating mt-1.5) and their hit boxes sat only 4px apart (gap-5 minus 2x8px
// negative margins), so fat-finger taps hit the wrong target. Also fixed:
// the CuriosityGate disclaimer at 10px, its Insider-preview chip at 10px,
// the SignalDistribution donut label at 8px, and the site header 'signals'
// badge at 10px, all below the 12px mobile readability floor. A lineage
// that reverts any of these re-introduces overlapping tap targets or
// micro-fonts.
// ---------------------------------------------------------------------------
check(
  "components/StartupTable.tsx",
  "StartupTable icon row reverted: Website/LinkedIn links overlap the company card link and each other again (tap-target overlap, measured 2026-08-15).",
  (s) => s.includes("mt-3 flex items-center gap-8"),
  "keep the icon container as mt-3 flex items-center gap-8 (4px clear of the card link above, 16px between the two icon hit boxes)",
);

check(
  "components/CuriosityGate.tsx",
  "CuriosityGate reverted to 10px text (below the 12px mobile readability floor, measured 2026-08-15).",
  (s) => !s.includes("text-[10px]"),
  "keep the projections disclaimer at text-xs (12px) and the Insider-preview chip at text-[11px] or larger",
);

check(
  "components/charts/SignalDistribution.tsx",
  "SignalDistribution donut label reverted to 8px (below the 12px mobile readability floor, measured 2026-08-15).",
  (s) => !s.includes("fontSize={8}"),
  "keep the 'startups' donut sub-label at fontSize={10} or larger",
);

check(
  "components/Header.tsx",
  "Header 'signals' badge reverted to 10px (site-wide font floor, measured 2026-08-15).",
  (s) => !s.includes("text-[10px]"),
  "keep the 'signals' brand badge at text-[11px] or larger",
);

// ---------------------------------------------------------------------------
// FCP fix 2026-08-16: /ux.css must load asynchronously. The load-bearing base
// rules live in app/critical.css (generated from public/ux.css). A blocking
// <link> makes every first paint wait on a 33KB stylesheet; a stale
// critical.css lets a future ux.css edit drift visually from first paint.
// ---------------------------------------------------------------------------
check(
  "app/layout.tsx",
  "app/layout.tsx regressed to a render-blocking /ux.css <link>; first paint waits on a 33KB stylesheet every visit (FCP fix 2026-08-16).",
  (s) =>
    s.includes('id="ux-css"') &&
    s.includes('media="print"') &&
    s.includes('import "./critical.css"'),
  "keep the async ux.css pattern (link id=ux-css with media=print, load-swap script, noscript fallback) and the critical.css import in the root layout",
);

{
  const ux = read("public/ux.css");
  const crit = read("app/critical.css");
  if (ux && crit) {
    const hash = createHash("sha1").update(ux).digest("hex").slice(0, 16);
    if (!crit.includes(`source-sha1: ${hash}`)) {
      failures.push(
        `app/critical.css is STALE vs public/ux.css (FCP fix 2026-08-16)\n    file: app/critical.css\n    fix:  run node scripts/gen-critical-css.mjs and commit the regenerated file`,
      );
    }
  }
  if (crit && (!crit.includes("--ux-accent") || !crit.includes("margin-inline: auto !important"))) {
    failures.push(
      `app/critical.css lost a load-bearing rule (FCP fix 2026-08-16)\n    file: app/critical.css\n    fix:  run node scripts/gen-critical-css.mjs to regenerate from public/ux.css`,
    );
  }
}

// ---------------------------------------------------------------------------
// §18 Featured-snippet answer blocks (2026-08-15). The SERP-feature audit
// fix: every glossary term carries a 40-55 word `snippet` direct answer,
// rendered as the first paragraph under each question heading on /glossary
// and /define/[term], and the methodology page answers with question-form
// h2s plus visible 40-55 word direct answers synced to its FAQPage schema.
// A lineage that loses these reverts the featured-snippet / PAA surface.
// ---------------------------------------------------------------------------
check(
  "content/glossary.ts",
  "glossary terms lost their featured-snippet `snippet` field, or snippets drifted outside the 40-55 word extraction window.",
  (s) => {
    const snips = [...s.matchAll(/snippet:\s*\n\s*"([\s\S]*?)",/g)].map(
      (m) => m[1],
    );
    return (
      snips.length >= 130 &&
      snips.every((t) => {
        const wc = t.split(/\s+/).filter(Boolean).length;
        return wc >= 40 && wc <= 55;
      })
    );
  },
  "keep a 40-55 word `snippet` on every glossary term in content/glossary.ts",
);





// DELETED 2026-08-16 (§22 retirement): this check asserted the /define/[term]
// snippet-lede on a template that §22 intentionally deletes in the same
// changeset (125 URLs, 2,940 imps, 1 click, pos 57-93). The snippet-backed
// direct-answer intent lives on at the hub: the app/glossary/page.tsx check
// above still requires {t.snippet} as the first answer paragraph and the
// glossary.jsonl check below still exposes the snippet field, so the
// extractable-answer invariant survives the template's retirement.

check(
  "app/methodology/page.tsx",
  "methodology page reverted to declarative section headings and lost the visible direct-answer paragraphs (featured-snippet blocks).",
  (s) =>
    s.includes("What data sources does VC Deal Flow Signal use?") &&
    s.includes("What are the four signal types?") &&
    s.includes("How often is the data updated?") &&
    s.includes("Each accelerated startup is classified into one of four signal"),
  "keep question-form h2s plus visible 40-55 word direct-answer paragraphs on the methodology page",
);

check(
  "app/api/v1/glossary.jsonl/route.ts",
  "glossary.jsonl no longer exposes the snippet field for RAG pipelines.",
  (s) => s.includes("snippet: t.snippet ?? null"),
  "include snippet: t.snippet ?? null in each jsonl line",
);

// ---------------------------------------------------------------------------
// §18 Title CTR patterns (2026-08-15). Traffic audit item: titles were
// descriptive but CTR-flat ("AI & ML Startups to Watch, Q2 2026"). The fix
// leads every scaled template with a REAL count rendered from the same
// snapshot the page table shows (never hardcoded), adds bracketed quarters,
// and puts live proof numbers in /startup titles. Counts in titles lift SERP
// CTR; because they render from data, they stay truthful as data refreshes.
// ---------------------------------------------------------------------------
check(
  "app/startups-to-watch/[slug]/page.tsx",
  "startups-to-watch titles lost the leading count + Accelerating-on-GitHub CTR pattern (reverted to the flat 'X Startups to Watch, Y' form).",
  (s) =>
    s.includes("Accelerating on GitHub") &&
    s.includes("countLead(snapshot.startups.length"),
  "keep countLead(snapshot.startups.length, `${sector.name} Startups`) + ' Accelerating on GitHub (${period.name})' (countLead drops the number below 5 so thin snapshots never ship '1 Fintech Startups')",
);

check(
  "app/startups-to-watch/geo/[slug]/page.tsx",
  "geo startups-to-watch titles lost the leading count + geo CTR pattern.",
  (s) => s.includes("Accelerating in ${geoName}") && s.includes("countLead("),
  "keep countLead(parsed.startups.length, ...) + ' Accelerating in ${geoName} (${period.name})'",
);

check(
  "app/startups-to-watch/region/[slug]/page.tsx",
  "region startups-to-watch titles lost the leading count CTR pattern.",
  (s) => s.includes("`${geoName} Startups`") && s.includes("Accelerating on GitHub") && s.includes("countLead("),
  "keep countLead(parsed.startups.length, ${geoName} Startups) + Accelerating on GitHub in the title",
);

check(
  "app/stage/[slug]/page.tsx",
  "stage titles lost the leading cohort count + Accelerating-on-GitHub CTR pattern.",
  (s) => s.includes("`${data.name} Startups`") && s.includes("Accelerating on GitHub") && s.includes("countLead("),
  "keep countLead(data.startups.length, ${data.name} Startups) + Accelerating on GitHub in the title",
);

check(
  "app/stage/[slug]/[sector]/page.tsx",
  "stage-sector titles lost the leading count CTR pattern.",
  (s) => s.includes("${data.stageName} ${data.sector.name} Startups") && s.includes("countLead("),
  "keep countLead(data.startups.length, ${data.stageName} ${data.sector.name} Startups) in the title",
);

check(
  "app/stage/[slug]/signal/[signal]/page.tsx",
  "stage-signal titles lost the leading count CTR pattern.",
  (s) => s.includes("${data.stageName} Startups") && s.includes("countLead("),
  "keep countLead(data.startups.length, `${data.stageName} Startups`) in the title",
);

check(
  "app/startup/[slug]/page.tsx",
  "startup titles lost the live proof numbers (14-day commits + contributors) that made SERP snippets carry data.",
  (s) => s.includes("${latest.commitVelocity14d} Commits in 14 Days, ${latest.contributors} Contributors"),
  "keep `${profile.name}: ${latest.commitVelocity14d} Commits in 14 Days, ${latest.contributors} Contributors` (absolute velocity, never the possibly-negative % change)",
);

check(
  "content/sectors.ts",
  "sector hub titles lost the leading companies+funds counts CTR pattern.",
  (s) => s.includes("${companyCount} ${s.name} Companies & ${fundCount} Active Funds"),
  "keep `${companyCount} ${s.name} Companies & ${fundCount} Active Funds: Engineering Signals (2026)`",
);

// ---------------------------------------------------------------------------
// §17 TTFB / edge-cache for sitemap'd tool pages + public data feeds
// (2026-08-15). Ten sitemap'd routes (/predict + 8 /tools/* calculators)
// awaited searchParams server-side, forcing per-request dynamic rendering
// (private, no-store): every crawl was a full function invocation at
// 0.85-1.35s TTFB instead of an edge PRERENDER/HIT at ~0.2s. The URL
// prefill now reads the query client-side behind Suspense; metadata is
// static. /api/signals.json and /api/signals.csv lose their handler-set
// s-maxage to the framework's must-revalidate override, so the middleware
// (deterministic last writer) pins 1h edge caching with an Authorization
// Vary split (paid callers get enriched payloads, they must not share a
// cache entry with anonymous ones).
// ---------------------------------------------------------------------------
check(
  "proxy.ts",
  "proxy.ts no longer pins the 1h edge-cache policy for /api/signals.json and /api/signals.csv; every bot fetch of the public data feeds regresses to a full function invocation (p95 1.35s, 100% MISS) instead of an edge HIT.",
  (s) =>
    s.includes('pathname === "/api/signals.json"') &&
    s.includes('pathname === "/api/signals.csv"') &&
    s.includes("s-maxage=3600") &&
    s.includes('"Vary", "Authorization"') &&
    s.includes("private, no-store"),
  "keep the /api/signals.json + /api/signals.csv cache branch in proxy.ts: anonymous -> public, max-age=0, s-maxage=3600, stale-while-revalidate=600 with Vary: Authorization; Bearer -> private, no-store",
);

check(
  "app/predict/page.tsx",
  "app/predict/page.tsx awaits searchParams again; /predict regresses from static prerender to private, no-store dynamic rendering on every crawl.",
  (s) =>
    !s.includes("await searchParams") &&
    s.includes("PredictFormUrlPrefill") &&
    s.includes("ScoutCallFormUrlPrefill") &&
    s.includes("<Suspense"),
  "keep /predict static: prefill via PredictFormUrlPrefill / ScoutCallFormUrlPrefill (useSearchParams client-side inside Suspense), never await searchParams on the server",
);

for (const tool of [
  "burn-multiple-calculator",
  "cac-payback-calculator",
  "dilution-stack",
  "ltv-calculator",
  "magic-number-calculator",
  "quick-ratio-calculator",
  "runway-calculator",
  "safe-calculator",
]) {
  check(
    `app/tools/${tool}/page.tsx`,
    `app/tools/${tool}/page.tsx awaits searchParams again; the calculator regresses from static prerender to private, no-store dynamic rendering on every crawl.`,
    (s) =>
      !s.includes("await searchParams") &&
      s.includes("generateMetadata(): Metadata"),
    "keep generateMetadata(): Metadata static (no searchParams); the client calculator already reads URL params via useSearchParams inside its Suspense boundary",
  );
}

// ---------------------------------------------------------------------------
// /contact must 308 to /about, not 404 (2026-08-15)
// ---------------------------------------------------------------------------
// The site never had a /contact page; investors and AI crawlers probing the
// conventional contact URL got a 404 trust leak. The fix is a single
// next.config.ts redirect. This assertion makes a tree that lacks it
// undeployable, so no other lineage can silently bring the 404 back.
check(
  "next.config.ts",
  "/contact 404s again: the /contact -> /about permanent redirect is missing from next.config.ts redirects().",
  (s) => s.includes('source: "/contact"') && s.includes('destination: "/about"'),
  'restore the { source: "/contact", destination: "/about", permanent: true } entry in redirects()',
);

// ---------------------------------------------------------------------------
// Google Ads "harmonic" campaign must point at the live slug (2026-08-15).
// lib/paid-acquisition.ts routed /r/harmonic to /alternatives/harmonic, which
// 404s (the real slug is harmonic-ai). Every 308 that lands on a 404 wastes a
// paid click, so this makes a stale-slug tree undeployable.
// ---------------------------------------------------------------------------
check(
  "lib/paid-acquisition.ts",
  "harmonic campaign destination is stale: /r/harmonic redirects to the 404 /alternatives/harmonic (live slug is harmonic-ai).",
  (s) =>
    s.includes('destination: "/alternatives/harmonic-ai"') &&
    !s.includes('destination: "/alternatives/harmonic"'),
  'point the harmonic campaign destination at "/alternatives/harmonic-ai" (and fix the agent-queries sourceUrl + experiments/hooks surfaces in the same sweep)',
);

// ---------------------------------------------------------------------------
// Google Discover breakout roundup (2026-08-15). /breakout-startups-this-week
// is the weekly story-driven editorial that Discover surfaces. It must keep
// its Discover gate: news_keywords + article:tag (openGraph.tags) metadata and
// an Article ImageObject (1200x630) in the JSON-LD, plus a core-sitemap entry
// so crawlers can find it. A tree missing any of these is Discover-blind.
// ---------------------------------------------------------------------------
check(
  "app/breakout-startups-this-week/page.tsx",
  "Google Discover breakout roundup lost its gate: news_keywords / article:tag / ImageObject missing from app/breakout-startups-this-week/page.tsx.",
  (s) =>
    s.includes("news_keywords") &&
    s.includes("tags: discoverTags") &&
    s.includes('"@type": "ImageObject"'),
  "restore the news_keywords + openGraph.tags (article:tag) + Article ImageObject block in the breakout roundup page",
);
check(
  "app/sitemap/[id]/route.ts",
  "/breakout-startups-this-week is missing from the core sitemap shard (crawlers cannot discover it).",
  (s) => s.includes("/breakout-startups-this-week"),
  're-add { url: `${BASE_URL}/breakout-startups-this-week`, lastmod, changefreq: "weekly", priority: 0.9 } to the core shard',
);

// ---------------------------------------------------------------------------
// §19 Image SEO: startup OG image URL in JSON-LD (2026-08-16). The startup
//    and period pages pointed their primaryImageOfPage / Article.image /
//    ImageObject at /api/og/startup/<slug>.png, a route that does not exist
//    (404). Google crawled a dead image URL on ~2,290 startup pages plus
//    every quarterly variant. The real OG card lives at the Next.js
//    opengraph-image route (/startup/<slug>/opengraph-image and
//    .../[period]/opengraph-image). A lineage that re-points the schema at
//    the dead /api/og/startup path reintroduces the 404 and breaks image
//    discovery.
// ---------------------------------------------------------------------------
check(
  "app/startup/[slug]/page.tsx",
  "startup page ImageObject re-pointed at the dead /api/og/startup/<slug>.png route (404); Google would crawl a broken primary image on ~2,290 pages.",
  (s) =>
    s.includes("startup/${slug}/opengraph-image") &&
    !s.includes("api/og/startup/"),
  "keep primaryImageOfPage.url and Article.image.url on /startup/<slug>/opengraph-image (the live Next.js OG route), not /api/og/startup/<slug>.png",
);
check(
  "app/startup/[slug]/[period]/page.tsx",
  "period page ImageObject re-pointed at the dead /api/og/startup/<slug>.png route (404); Google would crawl a broken primary image on every quarterly startup variant.",
  (s) =>
    s.includes("startup/${slug}/${period}/opengraph-image") &&
    !s.includes("api/og/startup/"),
  "keep image.url on /startup/<slug>/<period>/opengraph-image (the live Next.js OG route), not /api/og/startup/<slug>.png",
);

// ---------------------------------------------------------------------------
// Full-text feed items (2026-08-15). Flipboard's RSS guidelines require
// full-text content, not excerpts; excerpt-only feeds fail their human
// review. feed.xml must carry content:encoded and atom.xml a <content>
// element, both powered by the shared lib/feed-content.ts renderer.
check(
  "app/feed.xml/route.ts",
  "feed.xml lost full-text items: no content:encoded element. Flipboard/Publisher review rejects excerpt-only feeds.",
  (s) =>
    s.includes("content:encoded") &&
    s.includes("renderPostBodyHtml") &&
    s.includes('xmlns:content="http://purl.org/rss/1.0/modules/content/"'),
  "keep <content:encoded> from lib/feed-content.ts renderPostBodyHtml and the content-module namespace on <rss>",
);
check(
  "app/atom.xml/route.ts",
  "atom.xml lost full-text entries: no <content type=\"html\"> element. Feed readers and Flipboard would see excerpt-only.",
  (s) =>
    s.includes('<content type="html">') &&
    s.includes("renderPostBodyHtml"),
  "keep <content type=\"html\"> built from renderPostBodyHtml in every atom entry",
);
check(
  "lib/feed-content.ts",
  "shared full-text feed renderer deleted; feed routes would need duplication or silently drop back to excerpts.",
  (s) =>
    s.includes("export function renderPostBodyHtml") &&
    s.includes("Flipboard"),
  "keep lib/feed-content.ts exporting renderPostBodyHtml (shared by feed.xml + atom.xml)",
);

// ---------------------------------------------------------------------------
// §20 Badge CLS + stats badges (2026-08-16). Two fixes live here:
//   (a) every img rendering a badge SVG must carry intrinsic width/height so
//       the browser reserves the box pre-load (CLS contribution zero). The
//       dims come from lib/badge-dims.ts, the SAME math the badge API uses.
//   (b) /api/badge/stats-m<N> serves real citable stat badges (the /stats
//       hub's 20 cards referenced them via the landing vercel.json rewrite,
//       which used to 404 and even on signals rendered the grey
//       "not tracked" fallback). Keep STAT_BADGES in sync with
//       landing/stats/index.html stat cards.
check(
  "lib/badge-dims.ts",
  "shared badge dimension math lost a helper, every badge img would need hand-rolled widths again.",
  (s) =>
    s.includes("export function badgeWidth") &&
    s.includes("export function smallBadgeWidth") &&
    s.includes("export function builtWithWidth") &&
    s.includes("export const SMALL_BADGE_HEIGHT = 20") &&
    s.includes("export const BADGE_HEIGHT = 28"),
  "keep badgeWidth/badgeValue (h28 [name] family), smallBadgeWidth/approxTextWidth/builtWithWidth (h20 badge-svg family) in lib/badge-dims.ts",
);

check(
  "app/api/badge/[name]/route.tsx",
  "stats badges regressed: STAT_BADGES map or the .svg-suffix strip was dropped, /stats hub cards 404 again.",
  (s) =>
    s.includes("const STAT_BADGES") &&
    (s.match(/"stats-m\d+":/g) || []).length === 20 &&
    s.includes("/\\.svg$/i") &&
    s.includes("esc("),
  "keep the 20-entry STAT_BADGES map, the .svg suffix strip, and the esc() XML-escape in the [name] badge route",
);

check(
  "app/badge-builder/BadgeBuilderClient.tsx",
  "badge-builder previews lost intrinsic dims (h-5 class alone), typing a handle re-introduces layout shift.",
  (s) =>
    s.includes('width={smallBadgeWidth("scout score", "100 oracle")}') &&
    s.includes('width={smallBadgeWidth("momentum", "breakout +999%")}') &&
    s.includes("width={builtWithWidth(builtWithVariant)}") &&
    s.includes("height={SMALL_BADGE_HEIGHT}") &&
    !/className="h-5"/.test(s),
  'keep width={smallBadgeWidth(...)} / builtWithWidth(...) + height={SMALL_BADGE_HEIGHT} on all three preview imgs (add w-auto)',
);

check(
  "app/badge-builder/page.tsx",
  "badge-builder sample grid lost intrinsic dims, the sample badge imgs shift on load.",
  (s) =>
    s.includes("width={badgeWidth(BADGE_LABEL, badgeValue(s.velocity, s.signal))}") &&
    s.includes("height={BADGE_HEIGHT}"),
  "keep width={badgeWidth(BADGE_LABEL, badgeValue(s.velocity, s.signal))} height={BADGE_HEIGHT} on the sample-grid badge imgs (map over samples)",
);

check(
  "app/built-with/page.tsx",
  "built-with variant previews lost intrinsic dims, the three badge imgs shift on load.",
  (s) =>
    s.includes("width={builtWithWidth(v.name)}") &&
    s.includes("height={SMALL_BADGE_HEIGHT}") &&
    !/className="h-5"/.test(s),
  "keep width={builtWithWidth(v.name)} height={SMALL_BADGE_HEIGHT} on the VARIANTS preview imgs (add w-auto)",
);

check(
  "app/embed/page.tsx",
  "embed catalog previews lost previewW/previewH, OG cards shift ~255px post-load again.",
  (s) =>
    s.includes("previewW") &&
    s.includes("previewH") &&
    /width=\{e\.previewW(?: \?\? 1200)?\}/.test(s) &&
    /height=\{e\.previewH(?: \?\? 630)?\}/.test(s),
  "keep previewW/previewH on every embed entry and width={e.previewW} height={e.previewH} on the img (fallbacks ?? 1200/630)",
);

// ---------------------------------------------------------------------------
// GA4 `generate_lead` event must fire on the two lead-capture surfaces
// (2026-08-15). Without it, Google Ads has no "lead" conversion to import,
// so Quality Score / CPA are unmeasurable for the Reddit -> /firstlook and
// Google -> /alternatives paid campaigns. `purchase` already fires on
// /firstlook/thanks; this covers the free-signup and pre-checkout leads.
// ---------------------------------------------------------------------------
check(
  "components/LeadConversionEvent.tsx",
  "LeadConversionEvent missing: Google Ads has no generate_lead conversion to import for paid campaigns.",
  (s) => s.includes('gtag("event", "generate_lead")'),
  "restore components/LeadConversionEvent.tsx (fires gtag generate_lead with the gtag-wait poll)",
);
check(
  "components/SqueezeSuccess.tsx",
  "Free-signup lead event dropped: SqueezeSuccess no longer mounts LeadConversionEvent.",
  (s) => s.includes("LeadConversionEvent") && s.includes("<LeadConversionEvent />"),
  "mount <LeadConversionEvent /> in SqueezeSuccess",
);
check(
  "components/SectorIntent.tsx",
  "Pre-checkout lead event dropped: SectorIntent no longer mounts LeadConversionEvent.",
  (s) => s.includes("LeadConversionEvent") && s.includes("<LeadConversionEvent />"),
  "mount <LeadConversionEvent /> in SectorIntent's success branch",
);

// ---------------------------------------------------------------------------
// CTR-hooked /vs titles + /compare-to-/vs consolidation (2026-08-16).
// GSC 90d: generic "X vs Y, Deal Flow Platform Comparison (2026)" titles
// drew 0.09-0.23% CTR on positions 4-8 (dealroom-vs-pitchbook 4,274 imps /
// 4 clicks; harmonic-ai-vs-pitchbook 3,466 / 8) while price-hooked titles
// on this site drew 1.2-2.0%. A lineage losing this reverts to the
// click-starved generic titles and re-splits ranking signals with the
// noindex /compare mirrors.
// ---------------------------------------------------------------------------
check(
  "content/competitor-vs.ts",
  "VS_TITLE_HOOKS dropped: /vs titles revert to the 0.09% CTR generic pattern.",
  (s) =>
    s.includes("VS_TITLE_HOOKS") &&
    s.includes('"dealroom-vs-pitchbook"') &&
    s.includes('"harmonic-ai-vs-pitchbook"') &&
    s.includes("competitorPriceNote"),
  "restore VS_TITLE_HOOKS (with the two highest-impression hooks) + competitorPriceNote in content/competitor-vs.ts",
);
check(
  "app/vs/[slug]/page.tsx",
  "/vs generateMetadata no longer uses the CTR hooks (titles revert to generic).",
  (s) =>
    s.includes("VS_TITLE_HOOKS[canonicalSlug]") &&
    s.includes("hook ?? fallbackTitle") &&
    s.includes("const title =\n    baseTitle.length + 7 > 60"),
  "import VS_TITLE_HOOKS + competitorPriceNote and build titles from them (see 2026-08-16 CTR fix)",
);
check(
  "app/vs/[slug]/page.tsx",
  "/vs meta description re-injected GDF's own EUR 49/mo price as a competitor's price (false attribution, 2026-08-16).",
  (s) =>
    s.includes("const priceClause = priceA && priceB") &&
    !s.includes("const priceLead"),
  "restore the both-prices-only priceClause; never append ' vs EUR 49/mo' to a single-price pair (17 pages were mislabelled)",
);
{
  // Every removed cross pair must 301 to its /vs/ twin, and must NOT be
  // regenerated in comparisons.ts.
  const CONSOLIDATED: [string, string][] = [
    ["/compare/pitchbook-vs-cb-insights", "/vs/pitchbook-vs-cb-insights"],
    ["/compare/crunchbase-vs-cb-insights", "/vs/cb-insights-vs-crunchbase"],
    ["/compare/pitchbook-vs-crunchbase", "/vs/crunchbase-vs-pitchbook"],
    ["/compare/crunchbase-vs-dealroom", "/vs/dealroom-vs-crunchbase"],
    ["/compare/pitchbook-vs-dealroom", "/vs/dealroom-vs-pitchbook"],
    ["/compare/harmonic-ai-vs-dealroom", "/vs/harmonic-ai-vs-dealroom"],
    ["/compare/harmonic-ai-vs-forager-ai", "/vs/harmonic-ai-vs-forager-ai"],
  ];
  const cfg = read("next.config.ts");
  const comps = read("content/comparisons.ts");
  for (const [src, dst] of CONSOLIDATED) {
    if (cfg && !cfg.includes(`source: "${src}"`)) {
      failures.push(
        `Consolidation redirect missing: ${src} -> ${dst}\n    file: next.config.ts\n    fix:  restore the 301 (thin noindex mirror was removed from generation, without the redirect it 404s)`,
      );
    }
  }
  // The cross pairs are generated from slug tuples, not literal slugs, so
  // detect regeneration by the tuple entries inside the crossPairs array.
  if (comps) {
    const block = comps.slice(
      comps.indexOf("const crossPairs"),
      comps.indexOf("];", comps.indexOf("const crossPairs")),
    );
    const REMOVED_TUPLES = [
      '["pitchbook", "crunchbase"]',
      '["pitchbook", "cb-insights"]',
      '["harmonic-ai", "dealroom"]',
      '["crunchbase", "dealroom"]',
      '["harmonic-ai", "forager-ai"]',
      '["pitchbook", "dealroom"]',
      '["crunchbase", "cb-insights"]',
    ];
    for (const t of REMOVED_TUPLES) {
      if (block.includes(t)) {
        const slug = t.match(/"([^"]+)"[^"]*"([^"]+)"/);
        failures.push(
          `Cross pair regenerated: ${t} (would create /compare/${slug?.[1]}-vs-${slug?.[2]}, a thin noindex mirror that splits the /vs/ twin)\n    file: content/comparisons.ts\n    fix:  remove it from crossPairs; the /compare/ URL 301s to its /vs/ twin (see next.config.ts)`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Data-derived historical /best/ redirects (2026-08-16 data-derived form +
// 2026-08-19 hardening). /best/<sector>-<year> pages generate only for
// sectors with a CURRENT-period snapshot; a freeze or a year rollover turns
// the URL into a 404 while it still holds GSC equity. Redirects are DERIVED
// from data/startups.json into data/best-redirects.json at prebuild
// (scripts/generate-best-redirects.ts) and spread into next.config.ts. The
// 08-19 incident: hardcoded 308s in next.config.ts kept serving stale Q2
// snapshots after newer data had Q3 for those sectors (shadowing live
// pages). Hardcoded /best/ redirects are therefore BANNED; the derivation is
// the single source of truth. NOTE for the future: when the data pipeline
// commits q3-2026 snapshots for the five frozen sectors, the derivation
// stops emitting their 2026-slug redirects and the §44 ledger sentinel
// (pattern "destination": "/startups-to-watch/climate-tech-q2-2026") must be
// marked supersededBy in scripts/ancestry-ledger.json in the SAME commit.
// ---------------------------------------------------------------------------
{
  const data = loadStartupsData();
  const expected = deriveBestRedirects(data);
  let committed: BestRedirect[] | null = null;
  try {
    committed =
      JSON.parse(read("data/best-redirects.json") ?? "null")?.redirects ??
      null;
  } catch {
    committed = null;
  }
  if (committed === null || JSON.stringify(committed) !== JSON.stringify(expected)) {
    failures.push(
      `data/best-redirects.json drifted from data/startups.json\n    expected ${expected.length} derived entries, found ${committed === null ? "unparseable or missing file" : committed.length}\n    file: data/best-redirects.json\n    fix:  npx tsx scripts/generate-best-redirects.ts (prebuild does this; never hand-edit the JSON)`,
    );
  }
  const cfg = read("next.config.ts");
  if (cfg && !cfg.includes("...bestRedirects.map(")) {
    failures.push(
      `next.config.ts does not spread the data-derived best redirects\n    file: next.config.ts\n    fix:  restore the ...bestRedirects.map((r) => ...) entry inside redirects()`,
    );
  }
  if (cfg && /source:\s*"\/best\//.test(cfg)) {
    failures.push(
      `next.config.ts hardcodes a /best/ redirect (banned since 2026-08-19: hardcodes shadowed live Q3 pages)\n    file: next.config.ts\n    fix:  delete the hardcoded entry; the prebuild derivation owns every /best/ redirect`,
    );
  }
  const lib = read("scripts/best-redirect-lib.ts");
  if (lib === null || !lib.includes("DESTINATION_OVERRIDES")) {
    failures.push(
      `best-redirect-lib.ts lost the frozen destination override\n    file: scripts/best-redirect-lib.ts\n    fix:  restore DESTINATION_OVERRIDES (/best/developer-tools-2026 -> /sectors/developer-tools)`,
    );
  }
  const current = data.periods.find((p) => p.current) ?? data.periods[0];
  const curYear = current.name.match(/\d{4}/)?.[0] ?? "";
  const generating = new Set(
    data.sectors
      .filter((s) => s.periods[current.slug])
      .map((s) => `/best/${s.slug}-${curYear}`),
  );
  for (const r of expected) {
    if (generating.has(r.source)) {
      failures.push(
        `Derived /best/ redirect shadows a generating page: ${r.source} -> ${r.destination}\n    fix:  derivation bug in scripts/best-redirect-lib.ts (a redirect must never cover a slug the data still generates)`,
      );
    }
    const snapTarget = r.destination.match(/^\/startups-to-watch\/([a-z0-9-]+)-(q\d-\d{4})$/);
    const hubTarget = r.destination.match(/^\/sectors\/([a-z0-9-]+)$/);
    if (!snapTarget && !hubTarget) {
      failures.push(
        `Derived /best/ redirect target invalid: ${r.source} -> ${r.destination}`,
      );
      continue;
    }
    if (snapTarget) {
      const [, sectorSlug, periodSlug] = snapTarget;
      const sector = data.sectors.find((s) => s.slug === sectorSlug);
      if (!sector || !sector.periods[periodSlug]) {
        failures.push(
          `Derived /best/ redirect target missing in data: ${r.source} -> ${r.destination}\n    fix:  the target snapshot must exist in data/startups.json (redirecting to a 404 is worse than the 404 it replaces)`,
        );
      }
    } else if (hubTarget) {
      const sector = data.sectors.find((s) => s.slug === hubTarget[1]);
      if (!sector) {
        failures.push(
          `Derived /best/ redirect hub target unknown: ${r.source} -> ${r.destination}`,
        );
      }
    }

  }
}

// ---------------------------------------------------------------------------
// Quarterly citeAs period tokens (2026-08-19, same freshness pass). The
// enterprise + receipts AgentSummary citeAs strings hardcoded "Q2 2026" and
// froze as the data period advanced to Q3. The quarter must derive from
// getCurrentPeriod(), like every other data-period surface on the site.
// ---------------------------------------------------------------------------
{
  check(
    "app/enterprise/page.tsx",
    "enterprise citeAs quarter derives from the data period",
    (s) => !s.includes('"Q2 2026') && s.includes("retrieved ${period.name}"),
    "fix: derive the citeAs quarter from getCurrentPeriod(); never hardcode a quarter in citeAs copy",
  );
  check(
    "app/receipts/page.tsx",
    "receipts citeAs quarter derives from the data period",
    (s) => !s.includes('"Q2 2026') && s.includes("${period.name}"),
    "fix: derive the citeAs quarter from getCurrentPeriod(); never hardcode a quarter in citeAs copy",
  );
}

// ---------------------------------------------------------------------------
// Sitemap core shard must list each URL exactly once (2026-08-16). /origin
// was hand-listed twice (priorities 0.75 and 0.8), emitting a duplicate
// <loc> inside sitemap/core.xml. The render-time dedupe filter in the route
// masks runtime duplicates, so this guard asserts the SOURCE stays clean
// too: exactly one literal /origin entry in the entries list. A lineage
// that re-adds the duplicate (or drops /origin entirely) fails here.
// ---------------------------------------------------------------------------
{
  const src = read("app/sitemap/[id]/route.ts");
  if (src !== null) {
    const matches = src.match(/BASE_URL}\/origin`/g) || [];
    if (matches.length !== 1) {
      failures.push(
        `core sitemap lists /origin ${matches.length}x (must be exactly 1).\n` +
          `    fix:  keep the single E-E-A-T block entry (priority 0.75); the render-time\n` +
          `          dedupe filter is a safety net, not a license to list URLs twice`,
      );
    }
    if (!src.includes("entries = entries.filter(")) {
      failures.push(
        `core sitemap render-time dedupe filter was removed.\n` +
          `    fix:  restore the entries.filter() first-occurrence-wins dedupe before\n` +
          `          urlsXml is rendered (2026-08-16 sitemap hygiene)`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 2026-08-16 CTR title hooks — template families (home, from-stars-to-seed,
// faq, glossary, markets, acquirer, from-stars-to-seed leaves)
// GSC 90d baseline: 21 clicks / 7,455 imps. These pages held 4,712 imps with
// 7 clicks (0.15%) on truncated or zero-information titles. Guards assert the
// FIX IS PRESENT (new title shape), not absence of the old string, so the
// guard never trips on its own comments.
{
  const read = (p: string) => {
    try {
      return readFileSync(p, "utf8");
    } catch {
      return "";
    }
  };

  // Home (layout.tsx): default title must lead with the timing hook.
  {
    const s = read("app/layout.tsx");
    if (!s.includes("GitHub Momentum 3-6 Weeks Pre-Round")) {
      failures.push(
        `home default title reverted to the low-CTR descriptive form.\n` +
          `    fix:  restore "GitHub Momentum 3-6 Weeks Pre-Round | VC Deal Flow Signal" in app/layout.tsx`,
      );
    }
  }

  // /from-stars-to-seed hub: computed count hook, absolute (old was 105ch + suffix).
  {
    const s = read("app/from-stars-to-seed/page.tsx");
    if (
      !(s.includes("GitHub Stars to Startup Funding") && s.includes("${starsCases.length} Case Studies"))
    ) {
      failures.push(
        `from-stars-to-seed hub title lost its count hook or computed length.\n` +
          `    fix:  restore pageTitle = \`GitHub Stars to Startup Funding: \${starsCases.length} Case Studies (2026)\` with title: { absolute: pageTitle }`,
      );
    }
    if (!s.includes("title: { absolute: pageTitle }")) {
      failures.push(
        `from-stars-to-seed hub title is template-suffixed again (would re-truncate).\n` +
          `    fix:  keep title: { absolute: pageTitle } in app/from-stars-to-seed/page.tsx`,
      );
    }
  }

  // /faq: keyword-bearing absolute title (old: "Frequently Asked Questions" + suffix).
  {
    const s = read("app/faq/page.tsx");
    if (!s.includes("FAQ: GitHub Signals, Commit Velocity & VC Deal Sourcing")) {
      failures.push(
        `faq title reverted to the zero-information "Frequently Asked Questions" form.\n` +
          `    fix:  restore the absolute keyword-bearing title in app/faq/page.tsx`,
      );
    }
  }

  // /glossary: computed count hook (134 terms), absolute.
  {
    const s = read("app/glossary/page.tsx");
    if (
      !(s.includes("VC & Startup Glossary") && s.includes("${glossaryTerms.length} Terms"))
    ) {
      failures.push(
        `glossary title lost its computed count hook.\n` +
          `    fix:  restore pageTitle from glossaryTerms.length in app/glossary/page.tsx`,
      );
    }
  }

  // /markets: hook title, absolute.
  {
    const s = read("app/markets/page.tsx");
    // Hook title must survive in either year form: the original hardcoded
    // "(2026)" or the FRESH_YEAR_STR interpolation (auto-year rollover
    // 2026-08-16; what must NOT come back is the generic
    // "Open Prediction Markets" form).
    const hookOk =
      s.includes("Startup Funding Prediction Markets: Live Odds (2026)") ||
      s.includes("Startup Funding Prediction Markets: Live Odds ${FRESH_YEAR_STR}");
    if (!hookOk) {
      failures.push(
        `markets title reverted to the generic "Open Prediction Markets" form.\n` +
          `    fix:  restore the hook title in app/markets/page.tsx`,
      );
    }
  }

  // Acquirer family (21 pages): count hook in build(), absolute in [slug].
  {
    const s = read("content/acquirers.ts");
    if (!s.includes("${a.name} Acquisitions: ${acqCount} Notable Deals")) {
      failures.push(
        `acquirer titles lost the deal-count hook ("& M&A Pattern" form reverted).\n` +
          `    fix:  restore title: \`\${a.name} Acquisitions: \${acqCount} Notable Deals (2026)\` in content/acquirers.ts build()`,
      );
    }
    const leaf = read("app/acquirer/[slug]/page.tsx");
    if (!leaf.includes("title: { absolute: a.title }")) {
      failures.push(
        `acquirer leaf title is template-suffixed again (22ch suffix re-truncates).\n` +
          `    fix:  keep title: { absolute: a.title } in app/acquirer/[slug]/page.tsx`,
      );
    }
  }

  // from-stars-to-seed leaves (48 pages): absolute so funding-figure hooks render in full.
  {
    const s = read("app/from-stars-to-seed/[slug]/page.tsx");
    if (!s.includes("title: { absolute: c.headline }")) {
      failures.push(
        `from-stars-to-seed leaf titles are template-suffixed again (91ch, truncated).\n` +
          `    fix:  keep title: { absolute: c.headline } in app/from-stars-to-seed/[slug]/page.tsx`,
      );
    }
  }
}

// §21 Research-paper search-intent fix (2026-08-16). GSC 90d: /research-paper/
// leaves drew ~19K impressions at ~0 clicks on citation-hunter queries
// (author-year-venue strings, "bibtex", page-number lookups): the arriving
// audience is ML researchers, not the investor ICP. Fix: investor-angle lede
// ("Why investors care", grounded in ourContext) top-of-page + sector-aware
// CTA routing into /sector/[slug] deal-flow hubs. If a lineage reverts the
// template or drops the investorAngle content field, the lede block renders
// empty or TS fails; this makes such a tree undeployable.
{
  const content = read("content/research-papers.ts");
  if (content === null) {
    failures.push("research-papers.ts missing entirely");
  } else {
    if (!content.includes("investorAngle: string;")) {
      failures.push(
        `research-paper investorAngle field dropped from the ResearchPaper interface.\n` +
          `    fix:  restore investorAngle: string; in content/research-papers.ts (required on every paper)`,
      );
    }
    const instances = content.split("investorAngle:").length - 1;
    if (instances < 10) {
      failures.push(
        `research-paper investorAngle instances: ${instances} (need 10 = interface + 9 papers).\n` +
          `    fix:  every RESEARCH_PAPERS entry must carry a grounded investorAngle lede`,
      );
    }
  }
  const leaf = read("app/research-paper/[slug]/page.tsx");
  if (leaf === null) {
    failures.push("research-paper leaf template missing");
  } else {
    if (!(leaf.includes("paper.investorAngle") && leaf.includes("Why investors care"))) {
      failures.push(
        `research-paper leaf lost the investor-angle lede box (search-intent fix reverted).\n` +
          `    fix:  restore the "Why investors care" aside rendering paper.investorAngle above the venue line`,
      );
    }
    if (
      !(leaf.includes("See who is building on this") && leaf.includes("/sector/"))
    ) {
      failures.push(
        `research-paper leaf lost the sector-aware CTA module.\n` +
          `    fix:  restore the relatedSectors CTA section linking /sector/[slug] before SeoCta`,
      );
    }
  }
}

// §37 Research-paper cluster bridge from /research hub (2026-08-17). The
// /research-paper/* leaves earn ~19K impressions on citation-hunter queries
// (§21 lede + CTA converts arrivals); this bridge gives the hub's investor
// audience a visible path into the cluster and the cluster crawl context,
// not just the internal-links.json data edges. Fails closed if the section
// or any of its three links is dropped from the hub template.
{
  const hub = read("app/research/page.tsx");
  if (hub === null) {
    failures.push("app/research/page.tsx missing entirely");
  } else {
    const needles = [
      "Foundational papers",
      'href="/research-paper"',
      'href="/research-paper/forsgren-2018-accelerate-dora-research"',
      'href="/research-paper/vaswani-2017-attention-is-all-you-need"',
    ];
    for (const n of needles) {
      if (!hub.includes(n)) {
        failures.push(
          `§37 /research hub lost the research-paper bridge (missing ${n}).\n` +
            `    fix:  restore the "Foundational papers" section in app/research/page.tsx linking /research-paper`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// §21 /compare vs /vs cannibalization consolidation (2026-08-16). GSC 90d
// showed the same entity-pairs split across both templates (7 mirror pairs,
// e.g. /compare/pitchbook-vs-cb-insights 868 imps @ pos 22.7 competing with
// /vs/pitchbook-vs-cb-insights; /compare/harmonic-ai-vs-dealroom 97 imps
// vs /vs/ twin at 478). Consolidation: generation removed from
// content/comparisons.ts, next.config.ts 301s every retired URL to its
// /vs/ twin, sitemaps advertise only the /vs/ twins, and the internal-link
// graph (data/internal-links.json) points at the /vs/ URLs only.
// A reverted tree would resurrect duplicate pages competing for the same
// queries (or resurrect internal links through the 301s, wasting crawl).
// ---------------------------------------------------------------------------
{
  const RETIRED: Array<[string, string]> = [
    ["/compare/pitchbook-vs-cb-insights", "/vs/pitchbook-vs-cb-insights"],
    ["/compare/crunchbase-vs-cb-insights", "/vs/cb-insights-vs-crunchbase"],
    ["/compare/pitchbook-vs-crunchbase", "/vs/crunchbase-vs-pitchbook"],
    ["/compare/crunchbase-vs-dealroom", "/vs/dealroom-vs-crunchbase"],
    ["/compare/pitchbook-vs-dealroom", "/vs/dealroom-vs-pitchbook"],
    ["/compare/harmonic-ai-vs-dealroom", "/vs/harmonic-ai-vs-dealroom"],
    ["/compare/harmonic-ai-vs-forager-ai", "/vs/harmonic-ai-vs-forager-ai"],
  ];
  const cfg = read("next.config.ts");
  if (cfg === null) {
    failures.push("§21 next.config.ts missing");
  } else {
    for (const [oldUrl, newUrl] of RETIRED) {
      if (!cfg.includes(`"${oldUrl}"`) || !cfg.includes(`"${newUrl}"`)) {
        failures.push(
          `§21 /compare→/vs consolidation redirect missing for ${oldUrl} → ${newUrl}\n` +
            `    file: next.config.ts\n` +
            `    fix:  restore the permanent redirect pair (see §21 comment block)`,
        );
      }
    }
  }
  const comparisons = read("content/comparisons.ts");
  if (comparisons !== null && RETIRED.some(([o]) => comparisons.includes(`slug: "${o.replace("/compare/", "")}"`))) {
    failures.push(
      `§21 retired /compare mirror pages re-added to content/comparisons.ts\n` +
        `    fix:  remove the mirror comparison objects; the head-to-head lives on /vs/ only`,
    );
  }
  const linksRaw = read("data/internal-links.json");
  if (linksRaw !== null) {
    for (const [oldUrl] of RETIRED) {
      if (linksRaw.includes(`"${oldUrl}"`)) {
        failures.push(
          `§21 internal-link graph still routes through retired ${oldUrl}\n` +
            `    file: data/internal-links.json\n` +
            `    fix:  point the link at the canonical /vs/ URL (rerun scripts/build-internal-links.ts against the clean sitemap)`,
        );
      }
    }
    if (linksRaw.includes('"/compare/vc-deal-flow-signal-vs-affinity"')) {
      failures.push(
        `§21 internal-link graph still routes through the retired thin Affinity twin\n` +
          `    file: data/internal-links.json\n` +
          `    fix:  point the link at /compare/vc-deal-flow-signal-vs-affinity-relationship-intelligence`,
      );
    }
  }
  // Thin programmatic twin of the rich editorial Affinity head-to-head. The
  // competitors-array generator must keep excluding `affinity` or both pages
  // come back and split "vc deal flow signal vs affinity" again (90d: twin
  // pos 20.7/16 imps vs editorial pos 7.9/284 imps).
  const comparisonsSrc = read("content/comparisons.ts");
  if (comparisonsSrc !== null) {
    if (!comparisonsSrc.includes("programmaticVsExcluded")) {
      failures.push(
        `§21 programmaticVsExcluded set missing from content/comparisons.ts\n` +
          `    fix:  restore the exclusion set so the thin /compare/vc-deal-flow-signal-vs-affinity twin is not generated next to the rich editorial page`,
      );
    }
    if (cfg !== null && !cfg.includes('"/compare/vc-deal-flow-signal-vs-affinity"')) {
      failures.push(
        `§21 redirect for the retired thin Affinity twin missing\n` +
          `    file: next.config.ts\n` +
          `    fix:  restore the permanent redirect /compare/vc-deal-flow-signal-vs-affinity → /compare/vc-deal-flow-signal-vs-affinity-relationship-intelligence`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Auto-year title rollover (2026-08-16, traffic audit "content freshness 55").
// "(YEAR)" tokens in SERP titles decay the moment the calendar rolls: a stale
// year is both a CTR liability and an intent mismatch (queries carry the
// current year). Every ROTATABLE title/h1/og year token now interpolates
// FRESH_YEAR_STR / FRESH_YEAR_PLAIN from lib/freshness-year.ts (build-time
// year, NEXT_PUBLIC_FRESH_YEAR override for proof builds / hold-backs).
// FROZEN years (citations "The Data Nerd. (2026).", named editions like
// "Series A Race 2026" / "Charter Cohort 2026" / "2026 State of Engineering
// Velocity", year-bound pricing claims) must NOT be rolled automatically.
// ---------------------------------------------------------------------------
check(
  "lib/freshness-year.ts",
  "Freshness-year single source of truth lost or broken: rotatable titles fall back to hardcoded years and decay on Jan 1.",
  (s) =>
    s.includes("export function freshYear") &&
    s.includes("NEXT_PUBLIC_FRESH_YEAR") &&
    s.includes("export const FRESH_YEAR_STR") &&
    s.includes("export const FRESH_YEAR_PLAIN"),
  "restore lib/freshness-year.ts (freshYear + FRESH_YEAR_STR + FRESH_YEAR_PLAIN) and re-wire the ROTATABLE list below",
);
{
  const ROTATABLE = [
    "content/alternatives.ts",
    "content/comparisons.ts",
    "content/use-cases.ts",
    "content/sectors.ts",
    "content/companies.ts",
    "content/acquirers.ts",
    "content/funds.ts",
    "content/works-with.ts",
    "app/city/[slug]/page.tsx",
    "app/sector/[slug]/in/[city]/page.tsx",
    "app/fund/[slug]/portfolio/page.tsx",
    "app/trend/page.tsx",
    "app/best/page.tsx",
    "app/markets/page.tsx",
    "app/from-stars-to-seed/page.tsx",
    "app/startup-ideas/page.tsx",
    "app/llms-search.json/route.ts",
  ];
  for (const rel of ROTATABLE) {
    const s = read(rel);
    if (s === null) {
      failures.push(`auto-year: rotatable file missing: ${rel}`);
      continue;
    }
    if (!s.includes('from "@/lib/freshness-year"')) {
      failures.push(
        `auto-year: ${rel} no longer imports freshness-year; its title year is hardcoded again (decays on Jan 1).\n` +
          `    fix:  import { FRESH_YEAR_STR } (or FRESH_YEAR_PLAIN) from "@/lib/freshness-year" and interpolate the year token`,
      );
    }
  }
  // Registry files: a double-quoted title/h1 with a literal "(2026)" is the
  // pre-rollover form. Interpolated template literals are required.
  for (const rel of [
    "content/alternatives.ts",
    "content/comparisons.ts",
    "content/use-cases.ts",
  ]) {
    const s = read(rel);
    if (s === null) continue;
    if (/^\s*(title|h1):\s*"[^"\n]*\(202\d\)"/m.test(s)) {
      failures.push(
        `auto-year: ${rel} has a hardcoded "(YEAR)" title/h1 literal again.\n` +
          `    fix:  interpolate \${FRESH_YEAR_STR} from @/lib/freshness-year`,
      );
    }
  }
  // Frozen-year sentinels: citation / edition years must NEVER roll. If one
  // of these files ever imports freshness-year, someone "finished" the
  // rollout onto immutable years.
  const FROZEN = [
    "app/citation-guide/page.tsx",
    "app/citations/page.tsx",
    "app/dataset/page.tsx",
    "app/research/page.tsx",
    "app/wikipedia/page.tsx",
    "app/api/cite/[format]/[slug]/route.ts",
    "content/state-of-engineering-velocity.ts",
    "app/members/page.tsx",
    "app/markets/series-a-race-2026/page.tsx",
  ];
  for (const rel of FROZEN) {
    const s = read(rel);
    if (s !== null && s.includes('from "@/lib/freshness-year"')) {
      failures.push(
        `auto-year: ${rel} imports freshness-year but its years are FROZEN (citation/edition years must not roll).\n` +
          `    fix:  remove the import; keep the literal year and re-verify the claim manually`,
      );
    }
  }
  // /vs template: keep deriving its year from content freshness, not a literal.
  check(
    "app/vs/[slug]/page.tsx",
    "/vs titles regressed to a hardcoded year (was: lastModified.getFullYear()).",
    (s) => s.includes("lastModified.getFullYear()"),
    "keep const year = lastModified.getFullYear() in the /vs generateMetadata",
  );
}

// ---------------------------------------------------------------------------
// 11. Thin-content word-floor guard wired into postbuild (2026-08-15 audit,
//     "Thin-content risk 40/100"). No indexable prerendered page under 400
//     visible words; pre-existing thin pages pinned in
//     data/thin-content-baseline.json. These assertions make a tree that
//     silently DROPS the guard undeployable (multi-lineage protection).
// ---------------------------------------------------------------------------
{
  const guard = read("scripts/verify-word-floor.mjs");
  if (guard === null) {
    failures.push(
      `Word-floor guard deleted (thin-content protection gone).\n    file not found: scripts/verify-word-floor.mjs\n    fix:  restore it from git history (commit that wired it into postbuild, 2026-08-15)`,
    );
  } else {
    if (!/const FLOOR = 400/.test(guard)) {
      failures.push(
        `Word-floor guard FLOOR changed from 400.\n    file: scripts/verify-word-floor.mjs\n    fix:  raising the floor requires enriching every family it would strand; land the enrichment first, then update the baseline in the same commit`,
      );
    }
    if (!/--update-baseline/.test(guard)) {
      failures.push(
        `Word-floor guard lost its --update-baseline maintenance path.\n    file: scripts/verify-word-floor.mjs\n    fix:  keep baseline regeneration available so enrichments can retire pinned rows`,
      );
    }
  }
  check(
    "package.json",
    "postbuild no longer runs the word-floor guard (thin pages would ship silently).",
    (s) => {
      try {
        return /verify-word-floor\.mjs/.test(JSON.parse(s).scripts.postbuild);
      } catch {
        return false;
      }
    },
    `keep "node scripts/verify-word-floor.mjs" as the FIRST step of postbuild`,
  );
  check(
    "data/thin-content-baseline.json",
    "Thin-content baseline file missing (unregistered thin pages would hard-fail the build).",
    (s) => {
      try {
        const j = JSON.parse(s);
        return j.floor === 400 && j.pages && typeof j.pages === "object";
      } catch {
        return false;
      }
    },
    `regenerate with: node scripts/verify-word-floor.mjs --update-baseline`,
  );
}

// ---------------------------------------------------------------------------
// §22 Weakest-template retirement, /define + /idea-of-the-day (2026-08-16).
// GSC 90d evidence: /define/* = 125 URLs, 2,940 impressions, 1 click, avg
// positions 57-93 on dictionary head terms owned by Investopedia/Wikipedia;
// the /glossary hub already renders every term as an anchored DefinedTerm.
// /idea-of-the-day/* = hub + ~105 archive pages, 129 impressions, 0 clicks.
// Both templates' generation was deleted (app/define, app/idea-of-the-day,
// lib/ideas-of-the-day.ts, scripts/generate-idea-of-the-day.mjs,
// app/api/og/define) and every retired URL 301s to /glossary#<term> or
// /startup-ideas. A tree that regenerates either template reintroduces
// ~240 thin pages that split crawl budget and dilute the glossary hub.
// ---------------------------------------------------------------------------
{
  const cfg = read("next.config.ts");
  if (cfg === null) {
    failures.push("§22 next.config.ts missing");
  } else {
    for (const pair of [
      ['"/define"', '"/glossary"'],
      ['"/define/:term"', '"/glossary#:term"'],
      ['"/idea-of-the-day"', '"/startup-ideas"'],
      ['"/idea-of-the-day/:date"', '"/startup-ideas"'],
    ] as const) {
      if (!cfg.includes(pair[0]) || !cfg.includes(pair[1])) {
        failures.push(
          `§22 retirement redirect missing: ${pair[0]} → ${pair[1]}\n` +
            `    file: next.config.ts\n` +
            `    fix:  restore the permanent §22 redirects (see the §22 comment block)`,
        );
      }
    }
  }
  // Generation must stay deleted. existsSync on the template dirs /
  // data file catches a lineage that still carries them.
  for (const gone of [
    "app/define",
    "app/idea-of-the-day",
    "app/api/og/define",
    "lib/ideas-of-the-day.ts",
    "data/ideas-of-the-day.json",
    "scripts/generate-idea-of-the-day.mjs",
  ]) {
    if (existsSync(join(ROOT, gone))) {
      failures.push(
        `§22 retired template still present: ${gone}\n` +
          `    fix:  delete it (GDEALFLOW §22 retirement, 2026-08-16; /define deep pages were 1-click thin twins of /glossary anchors, idea-of-the-day was 0-click)`,
      );
    }
  }
  // Sitemaps must not advertise retired URLs (would re-submit 301 targets
  // to Google and burn crawl on redirects).
  const sm = read("app/sitemap/[id]/route.ts");
  if (sm !== null && /url: `\$\{BASE_URL\}\/(define|idea-of-the-day)/.test(sm)) {
    failures.push(
      `§22 sitemap still lists retired /define or /idea-of-the-day URLs\n` +
        `    file: app/sitemap/[id]/route.ts\n` +
        `    fix:  remove the retired template entries (old URLs 301; sitemap lists canonicals only)`,
    );
  }
  const smllm = read("app/sitemap-llm.xml/route.ts");
  if (smllm !== null && /url: `\$\{BASE_URL\}\/define\//.test(smllm)) {
    failures.push(
      `§22 LLM sitemap still lists retired /define/ URLs\n` +
        `    fix:  the glossary hub (with #anchors) is the citable unit; drop per-term entries`,
    );
  }
  // Internal-link graph must not route through retired URLs.
  const linksRaw = read("data/internal-links.json");
  if (linksRaw !== null) {
    if (linksRaw.includes('"#/define/') || /"\/define\//.test(linksRaw)) {
      failures.push(
        `§22 internal-link graph still routes through retired /define/ URLs\n` +
          `    file: data/internal-links.json\n` +
          `    fix:  repoint entries to /glossary#<term> and rerun scripts/build-internal-links.ts`,
      );
    }
    if (/"\/idea-of-the-day/.test(linksRaw)) {
      failures.push(
        `§22 internal-link graph still routes through retired /idea-of-the-day URLs\n` +
          `    file: data/internal-links.json\n` +
          `    fix:  rerun scripts/build-internal-links.ts against the cleaned sitemap`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// §23 Machine-readable /stats.json endpoint (2026-08-16). RAG-readiness fix:
// the key statistics (21-47 day lead time, panel size, velocity distribution,
// signal mix, live coverage) must exist as structured, citation-ready JSON at
// /stats.json, referenced from llms.txt and llms-full.txt so LLMs and answer
// engines can fetch one URL and quote the numbers with attribution. Guards
// both directions: the route must exist AND every LLM surface that advertises
// it must keep advertising it (advertised-URL-must-exist invariant).
{
  const statsRoute = read("app/stats.json/route.ts");
  if (statsRoute === null) {
    failures.push(
      `§23 /stats.json route deleted\n` +
        `    file: app/stats.json/route.ts\n` +
        `    fix:  restore it (RAG-readiness: machine-readable key statistics endpoint; llms.txt + llms-full.txt advertise it)`,
    );
  } else {
    const required = [
      "leadTimeRangeDays",
      "21 to 47",
      "219",
      "medianVelocityCommits14d",
      "frameworkMigrationPct",
      "keyStatistics",
      "headlineStatistic",
      "currentCoverage",
      '"@type": "Dataset"',
      "Access-Control-Allow-Origin",
      "X-Robots-Tag",
      "stale-while-revalidate",
    ];
    for (const needle of required) {
      if (!statsRoute.includes(needle)) {
        failures.push(
          `§23 /stats.json route lost required content: ${needle}\n` +
            `    file: app/stats.json/route.ts\n` +
            `    fix:  keep the ${needle} field/claim (RAG payload integrity: LLMs quote these numbers verbatim)`,
        );
      }
    }
    // Live counts must be computed from lib/data, never hardcoded, or the
    // endpoint drifts from /api/signals.json the next weekly refresh.
    if (
      !statsRoute.includes("getAllSectors") ||
      !statsRoute.includes("getCurrentPeriod") ||
      !statsRoute.includes("getDataLastModified")
    ) {
      failures.push(
        `§23 /stats.json live coverage not derived from lib/data\n` +
          `    file: app/stats.json/route.ts\n` +
          `    fix:  keep getAllSectors/getCurrentPeriod/getDataLastModified so tracked-org and sector counts track the weekly refresh`,
      );
    }
  }

  const llmsTxtRoute = read("app/llms.txt/route.ts");
  if (llmsTxtRoute !== null && !llmsTxtRoute.includes("stats.json")) {
    failures.push(
      `§23 llms.txt no longer references /stats.json\n` +
        `    file: app/llms.txt/route.ts\n` +
        `    fix:  keep the [stats.json] bullet in the machine-readable section (agents discover the endpoint through llms.txt)`,
    );
  }

  const llmsFullRoute = read("app/llms-full.txt/route.ts");
  if (llmsFullRoute !== null && !llmsFullRoute.includes("stats.json")) {
    failures.push(
      `§23 llms-full.txt no longer references /stats.json\n` +
        `    file: app/llms-full.txt/route.ts\n` +
        `    fix:  keep the /stats.json line in Machine-Readable Surfaces`,
    );
  }
}

// ---------------------------------------------------------------------------
// §31 /md markdown Vary: Accept (2026-08-16, LLM-optimization cache fix).
// The /md route handlers serve text/markdown via Accept negotiation (proxy.ts
// rewrites Accept: text/markdown to /md/<path>). Next.js overwrites a
// middleware-set Vary on the final response, so the HTML and markdown
// representations of the same URL shared one edge-cache entry and could
// cross-serve within the 1h s-maxage window. Fix sets "Vary": "Accept" on the
// route handlers' own Responses (the response origin), which Next.js preserves
// (verified live: the transcripts route pattern survives; the middleware-set
// one does not). A reverted tree that only sets Vary in proxy.ts (or not at
// all) re-enables the cross-serve, so assert the authoritative header lives in
// both /md handlers.
// ---------------------------------------------------------------------------
check(
  "app/md/route.ts",
  "§31 /md route lost its Vary: Accept header: HTML and markdown representations can cross-serve from the shared edge cache (Next.js drops the middleware-set Vary).",
  (s) => s.includes('"Vary": "Accept"'),
  'restore "Vary": "Accept" on the route handler Response in app/md/route.ts (set at the response origin, not in proxy.ts)',
);
check(
  "app/md/[...path]/route.ts",
  "§31 /md/[...path] route lost its Vary: Accept header: HTML and markdown representations can cross-serve from the shared edge cache (Next.js drops the middleware-set Vary).",
  (s) => s.includes('"Vary": "Accept"'),
  'restore "Vary": "Accept" on the route handler Response in app/md/[...path]/route.ts (set at the response origin, not in proxy.ts)',
);

// ---------------------------------------------------------------------------
// §24 Verdict-first leads on /vs H2 sections (2026-08-16). Quotable-structure
// fix from the traffic audit: three H2s (feature table, FAQ, other
// comparisons) dropped straight into a table, FAQ cards, or link chips with
// zero extractable sentence, so answer engines lifting those sections got raw
// markup instead of an answer. Every H2 now opens with a data-derived verdict
// sentence BEFORE the structured block. The remaining H2s (What is X?, Which
// one should you choose?, How we evaluate) already open with overview /
// pair.decision / METHODOLOGY prose.
// ---------------------------------------------------------------------------
check(
  "app/vs/[slug]/page.tsx",
  "§24 verdict-first leads dropped: /vs feature-table, FAQ, and other-comparisons H2s no longer open with an extractable sentence (answer engines get raw table/card markup).",
  (s) =>
    s.includes("The core difference in one sentence") &&
    s.includes(
      "Direct answers: most of these comparisons come down to budget",
    ) &&
    s.includes("If neither {a.name} nor {b.name} fits"),
  "restore the verdict-first lead paragraphs under the feature-table, FAQ, and other-comparisons H2s (see §24, 2026-08-16)",
);

// ---------------------------------------------------------------------------
// §23 AEO direct-answer blocks (2026-08-16). Audit 08-15 scored AEO 66:
// FAQPage present everywhere but answer pages were not THE extractable
// answer. Fix has three legs, all guarded here:
//   a) every /answers tldr is a 40-60 word direct answer (was 25-98);
//   b) the template emits real #question / #answer nodes (the AskAction had
//      referenced them since F37 without the nodes existing);
//   c) the core Q→A is mirrored as FAQPage mainEntity[0].
// One tldr, three surfaces (visible TL;DR block, Answer node, FAQPage
// mirror) so schema, page, and Speakable selector all agree.
// ---------------------------------------------------------------------------
{
  const aq = read("content/agent-queries.ts");
  if (aq !== null) {
    // (a) word window: match tldr: "..." across newlines, unescape \" only
    const re = /tldr:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
    let m: RegExpExecArray | null;
    const out: string[] = [];
    let n = 0;
    while ((m = re.exec(aq)) !== null) {
      n += 1;
      const words = m[1].replace(/\\(.)/g, "$1").split(/\s+/).filter(Boolean).length;
      if (words < 40 || words > 60) out.push(`${words}w`);
    }
    if (n < 90) {
      failures.push(
        `§23 tldr regex matched only ${n} entries in content/agent-queries.ts (expected 92)\n` +
          `    fix:  the tldr field format changed; update this guard's regex`,
      );
    }
    if (out.length) {
      failures.push(
        `§23 ${out.length} /answers tldrs outside the 40-60 word direct-answer window\n` +
          `    file: content/agent-queries.ts\n` +
          `    fix:  rewrite each tldr into 40-60 words (compress from the entry's own facts)\n` +
          `          without inventing claims; the tldr is the extractable answer on three surfaces`,
      );
    }
  }
  // (b) template emits real Question/Answer nodes wired to the AskAction refs.
  // 2026-08-16 featured-snippet rebuild: the Answer text source moved from
  // q.tldr to q.definition ?? q.tldr (definition = the 40-60w snippet target,
  // coverage enforced by scripts/verify-direct-answers.ts; tldr remains the
  // fallback). The invariant is unchanged: the node carries the same text the
  // [data-direct-answer] block renders and the Speakable spec selects.
  check(
    "app/answers/[slug]/page.tsx",
    "§23 /answers template no longer emits the #question/#answer schema nodes the AskAction references",
    (s) =>
      s.includes('`${url}#question`') &&
      s.includes('`${url}#answer`') &&
      s.includes('"@type": "Question"') &&
      s.includes('"@type": "Answer"') &&
      s.includes("text: q.definition ?? q.tldr"),
    "restore the §23 Question/Answer node pair (see the §23 comment block in the template)",
  );
  // (c) FAQPage mirrors the core Q→A as mainEntity[0]
  check(
    "app/answers/[slug]/page.tsx",
    "§23 FAQPage no longer mirrors the core question as mainEntity[0]",
    (s) =>
      /mainEntity:\s*\[\s*\{\s*"@type": "Question",\s*name: q\.h1/.test(s),
    "restore the §23 core-question mirror at the head of FAQPage mainEntity",
  );
}

// ---------------------------------------------------------------------------
// §24 Stats-hub badge + claim integrity (2026-08-16). Three invariants:
//   (a) the /stats hub (signals) references exactly the badges that exist:
//       every stats-s<N> img in public/stats/index.html must be a key in
//       STAT_BADGES, or the card renders the grey "not tracked" fallback.
//   (b) the same for the landing hub's stats-m<N> family (which the §20
//       count check covers structurally; here we assert the cross-file sync
//       invariant for the labels this fix corrected).
//   (c) the "72% correlation" claim is retired everywhere: it is not
//       grounded in the SSRN panel language. The grounded numbers are
//       ~65% top-decile precision / 219 observations / 55 startups. Any
//       stats surface reintroducing it must be updated to the grounded
//       claim, not re-added verbatim.
{
  const hubStats = read("public/stats/index.html");
  const badgeRoute = read("app/api/badge/[name]/route.tsx");
  const statsJson = read("app/stats.json/route.ts");
  if (hubStats !== null && badgeRoute !== null) {
    // (a) advertised badges must exist in STAT_BADGES
    const hubBadgeIds = [...hubStats.matchAll(/stats-(s\d+)\.svg/g)].map(
      (m) => `stats-${m[1] as string}`,
    );
    const uniqueHubBadgeIds = [...new Set(hubBadgeIds)];
    if (uniqueHubBadgeIds.length !== 10) {
      failures.push(
        `§24 /stats hub badge set changed: expected 10 stats-s<N> badge refs, found ${uniqueHubBadgeIds.length}`,
      );
    }
    for (const id of uniqueHubBadgeIds) {
      if (!badgeRoute.includes(`"${id}":`)) {
        failures.push(
          `§24 /stats hub badge ${id} not in STAT_BADGES: the card renders the grey "not tracked" fallback`,
        );
      }
    }
    // (b) landing hub family stays wired (§20 counts the 20 m-entries; here we
    // spot-assert the entries this fix corrected stay present and grounded.
    const advertisedIdsInMap = ["stats-m1", "stats-m19", "stats-m20"];
    for (const id of advertisedIdsInMap) {
      if (!badgeRoute.includes(`"${id}":`)) {
        failures.push(
          `§24 STAT_BADGES lost the ${id} entry the landing /stats hub advertises`,
        );
      }
    }
    if (!badgeRoute.includes('"stats-m19": { label: "Tracked sectors for deal signals", value: "15"')) {
      failures.push(
        `§24 stats-m19 must say 15 sectors (live /api/signals.json truth), not a stale count`,
      );
    }
    // (c) the ungrounded "72% correlation" claim stays retired. Grounded
    // language: ~65% top-decile precision, 219 obs / 55 startups, SSRN 6606558.
    if (hubStats.includes("72% correlation") || badgeRoute.includes("72%")) {
      failures.push(
        `§24 ungrounded "72% correlation" claim reappeared: use ~65% top-decile precision (219 obs / 55 startups, SSRN 6606558)`,
      );
    }
    if (
      !badgeRoute.includes(
        '"stats-s4": { label: "Top-decile signal precision", value: "~65%"',
      )
    ) {
      failures.push(
        `§24 stats-s4 badge must carry the grounded ~65% top-decile precision, not a correlation rate`,
      );
    }
    if (statsJson !== null && !statsJson.includes("topDecilePrecisionPct: 65")) {
      failures.push(
        `§24 stats.json PANEL lost topDecilePrecisionPct: 65, the canonical grounded precision constant`,
      );
    }
    // Landing mirrors (read() resolves ../ outside ROOT; skipped silently in
    // deploy archives where only the pseo-site subtree exists.
    for (const rel of [
      "../landing/stats/index.html",
      "../landing/de/stats/index.html",
      "../landing/es/stats/index.html",
    ]) {
      const s = read(rel);
      if (s !== null && s.includes("72% correlation")) {
        failures.push(
          `§24 ungrounded "72% correlation" claim reappeared in ${rel}`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// §25 stats.json surface completion, wave 2 (2026-08-16, git 3a898791):
//   a) apex llms-full.txt must carry the Key Statistics machine-readable JSON
//      section (llms.txt has had it since 56e9c778; llms-full is the
//      deep-crawl surface where agents that read only llms-full discover it);
//   b) public/agents.md (served at /agents.md) must list /stats.json under
//      Other agent-readable formats;
//   c) the stats pages re-grounded in 3258b029 must not regress to a stale
//      freshness date: dateModified/last-updated move with every re-grounding.
// ---------------------------------------------------------------------------
// Null-guarded: commit-scoped exports (deploy_from_commit.sh REF:pseo-site)
// contain only the pseo-site subtree, so ../landing/* is absent there; the
// check then runs in full-repo contexts only (same pattern as §24).
if (read("../landing/llms-full.txt") !== null) {
  check(
    "../landing/llms-full.txt",
    "§25 apex llms-full.txt lost the Key Statistics machine-readable JSON section (agents that deep-crawl only llms-full can no longer discover /stats.json)",
    (s) =>
      s.includes("https://signals.gitdealflow.com/stats.json") &&
      s.includes("Key Statistics, machine-readable JSON"),
    "restore the '# Key Statistics, machine-readable JSON' section at the end of llms-full.txt (see git 3a898791)",
  );
}
check(
  "public/agents.md",
  "§25 agents.md no longer lists the /stats.json key-statistics endpoint under Other agent-readable formats",
  (s) => s.includes("https://signals.gitdealflow.com/stats.json"),
  "restore the 'Key statistics JSON' bullet under Other agent-readable formats (see git 3a898791)",
);
if (read("../landing/stats/index.html") !== null) {
  check(
    "../landing/stats/index.html",
    "§25 landing /stats hub carries a stale freshness date: stat cards were re-grounded 2026-08-16 (3258b029/3a898791), dateModified/last-updated must move with re-groundings",
    (s) => !s.includes('"dateModified": "2026-07-19"'),
    "refresh dateModified and the last-updated line whenever stat cards are re-grounded",
  );
}
check(
  "public/stats/index.html",
  "§25 signals /stats hub carries a stale freshness date: stat cards were re-grounded 2026-08-16, dateModified/last-updated must move with re-groundings",
  (s) => !s.includes('"dateModified": "2026-07-19"'),
  "refresh dateModified and the last-updated line whenever stat cards are re-grounded",
);

// §26 template-family enrichment (2026-08-17, audit thin-content follow-up):
// the four remaining English thin families were enriched with computed,
// data-interpolated sections. These checks pin the enrichment so a lineage
// that lacks it cannot build (reverting them re-thins 54 pages below the
// 400-word floor and drops them back into baseline debt).
{
  const fam = (label, file, needles) => {
    const s = read(file);
    const missing = needles.filter((n) => !s.includes(n));
    if (missing.length) {
      failures.push(
        `§26 ${label} lost its enrichment section(s): ${missing.join(", ")} (audit 08-15 thin-content follow-up; reverting re-thins the family below the 400-word floor)`,
      );
    }
  };
  fam(
    "from-stars-to-seed leaf",
    "app/from-stars-to-seed/[slug]/page.tsx",
    ['aria-label="How the timeline read"', "Read them side by side"],
  );
  fam("topics hub", "app/topics/[slug]/page.tsx", [
    "How this pillar fits together",
    "newest first below",
  ]);
  fam("a2a framework leaf", "app/a2a/[framework]/page.tsx", [
    "Endpoint facts for",
    "When to pick which path",
  ]);
  fam("continuity drop leaf", "app/continuity/[slug]/page.tsx", [
    "What this drop format ships",
    "nextFormatLabel",
    "FORMAT_MEANING",
  ]);
}

// §27 harmonic entity-cluster internal linking (2026-08-17, audit PA-30 win):
// 5 of the 12 /vs/harmonic-ai-* pages had <=4 in-links (specter/signalrank/
// cb-insights had 1) because token-overlap linking cannot see entity
// relationships, and the donor templates (compare/answers/alternatives/blog)
// never rendered the link graph at all. Fix: equity-aware entity-cluster
// pass in build-internal-links.ts (weakest /vs/ pages get link slots first)
// + RelatedLinks rendered on the four donor templates. A reverted tree
// starves the harmonic cluster back to 1-4 in-links and drops page authority
// on the highest-value comparison cluster (harmonic-vs-pitchbook alone holds
// 3.4K impressions @ pos 4.7).
{
  const builder = read("scripts/build-internal-links.ts");
  if (builder === null) {
    failures.push("§27 scripts/build-internal-links.ts missing");
  } else {
    for (const needle of ["ENTITY_TOKENS", "Head-to-head comparisons"]) {
      if (!builder.includes(needle)) {
        failures.push(
          `§27 entity-cluster pass lost from build-internal-links.ts (needle: ${needle})\n` +
            `    fix:  restore the equity-aware entity-cluster layer (audit PA-30 win, 2026-08-17)`,
        );
      }
    }
  }

  // The four donor templates carry the harmonic-adjacent pages
  // (/alternatives/harmonic-ai, /answers/free-harmonic-ai-*, /compare/*-harmonic-*,
  // /blog/source-startup-deals-before-crunchbase) and must render the graph.
  const donorRender = (rel: string, pathPrefix: string) => {
    const s = read(rel);
    if (s === null) {
      failures.push(`§27 ${rel} missing`);
      return;
    }
    if (!s.includes("RelatedLinks") || !s.includes(`getRelatedGroups(\`${pathPrefix}`)) {
      failures.push(
        `§27 ${rel} no longer renders RelatedLinks for ${pathPrefix}\n` +
          `    fix:  restore the RelatedLinks render call (audit PA-30 win, 2026-08-17)`,
      );
    }
  };
  donorRender("app/compare/[slug]/page.tsx", "/compare/");
  donorRender("app/answers/[slug]/page.tsx", "/answers/");
  donorRender("app/alternatives/[slug]/page.tsx", "/alternatives/");
  donorRender("app/blog/[slug]/page.tsx", "/blog/");

  // In-degree floor: every live /vs/harmonic-ai-* page must hold >=10 in-links
  // in the committed graph. Measured after the fix: weakest = 16. Before the
  // fix, five pages sat at 1-4. (harmonic-ai-vs-affinity is excluded: it is
  // canonicalized to affinity-vs-harmonic-ai and not in the sitemap.)
  const linksRaw = read("data/internal-links.json");
  if (linksRaw !== null) {
    try {
      const graph = JSON.parse(linksRaw) as Record<string, Array<{ links?: Array<{ href: string }> }>>;
      const HARMONIC_VS = [
        "/vs/fund-momentum-vs-harmonic-ai",
        "/vs/harmonic-ai-vs-crunchbase",
        "/vs/harmonic-ai-vs-pitchbook",
        "/vs/harmonic-ai-vs-forager-ai",
        "/vs/harmonic-ai-vs-dealroom",
        "/vs/harmonic-ai-vs-tracxn",
        "/vs/openvc-vs-harmonic-ai",
        "/vs/affinity-vs-harmonic-ai",
        "/vs/specter-vs-harmonic-ai",
        "/vs/signalrank-vs-harmonic-ai",
        "/vs/harmonic-ai-vs-cb-insights",
      ];
      const indeg: Record<string, number> = {};
      for (const groups of Object.values(graph)) {
        if (!Array.isArray(groups)) continue;
        for (const g of groups) {
          for (const l of g.links || []) indeg[l.href] = (indeg[l.href] || 0) + 1;
        }
      }
      for (const h of HARMONIC_VS) {
        if ((indeg[h] || 0) < 10) {
          failures.push(
            `§27 ${h} dropped to ${indeg[h] || 0} in-links (floor: 10)\n` +
              `    file: data/internal-links.json\n` +
              `    fix:  rerun scripts/build-internal-links.ts (entity-cluster pass must survive regeneration)`,
          );
        }
      }
    } catch {
      failures.push("§27 data/internal-links.json is not valid JSON");
    }
  }
}

// ---------------------------------------------------------------------------
// §53 internal-link graph /vs/ coverage (2026-08-16, programmatic-internal-
// linking execution): data/internal-links.json is a COMMITTED artifact that
// only regenerates when scripts/build-internal-links.ts is run manually
// against the live sitemap. Nothing in the deploy path rebuilds it, so the
// moment a NEW /vs/ pair ships in content/competitor-vs.ts (without a graph
// rebuild) that page goes live with ZERO in-links and no equity from the
// link graph, silently. The §27 in-degree floor only pins 11 hardcoded
// harmonic pages. This guard derives the canonical /vs/ set from the SAME
// source function (getCanonicalCompetitorVsSlugs) and fails the build if any
// canonical /vs/ page is absent from the graph or holds 0 in-links, so a new
// pair, or a lost/stale graph, cannot deploy. Verified green on 2026-08-16
// tree: 36 canonical /vs/ pages, 0 missing, 0 orphaned.
// ---------------------------------------------------------------------------
{
  const vsSlugs = getCanonicalCompetitorVsSlugs();
  const linksRaw = read("data/internal-links.json");
  if (linksRaw !== null) {
    try {
      const graph = JSON.parse(linksRaw) as Record<
        string,
        Array<{ links?: Array<{ href: string }> }>
      >;
      const indeg: Record<string, number> = {};
      for (const groups of Object.values(graph)) {
        if (!Array.isArray(groups)) continue;
        for (const g of groups) {
          for (const l of g.links || []) indeg[l.href] = (indeg[l.href] || 0) + 1;
        }
      }

      const missing: string[] = [];
      const orphaned: string[] = [];
      for (const slug of vsSlugs) {
        const href = `/vs/${slug}`;
        if (!(href in graph)) missing.push(href);
        else if ((indeg[href] || 0) < 1) orphaned.push(href);
      }

      if (missing.length > 0) {
        failures.push(
          `§53 internal-link graph missing ${missing.length} canonical /vs/ page(s):\n` +
            `    file: data/internal-links.json\n` +
            `    missing: ${missing.join(", ")}\n` +
            `    fix:  rerun scripts/build-internal-links.ts against the live sitemap and commit the regenerated graph (a new /vs/ pair shipped without a graph rebuild)`,
        );
      }
      if (orphaned.length > 0) {
        failures.push(
          `§53 internal-link graph orphans ${orphaned.length} canonical /vs/ page(s) (0 in-links):\n` +
            `    file: data/internal-links.json\n` +
            `    orphaned: ${orphaned.join(", ")}\n` +
            `    fix:  rerun scripts/build-internal-links.ts (equity-aware passes must link every canonical /vs/ page)`,
        );
      }
    } catch {
      failures.push("§53 data/internal-links.json is not valid JSON (coverage guard)");
    }
  }
}

// ---------------------------------------------------------------------------
// §27 embed widget brand (2026-08-15, brand-search win): the POPULATED
// Engineering Acceleration Watch widget must render the GitDealFlow brand and
// a branded CTA. Verified live 2026-08-15: the populated state showed only
// "Engineering Acceleration Watch" with no brand, so a newsletter cross-promo
// placement would drive zero brand searches. (The empty state already had it.)
// ---------------------------------------------------------------------------
check(
  "app/embed/weekly/route.ts",
  "embed widget populated state must show the GitDealFlow brand + branded CTA",
  (s) =>
    s.includes(
      '<span class="brand">GitDealFlow · Engineering Acceleration Watch</span>',
    ) &&
    s.includes("See the full 10 + scorecard at GitDealFlow →"),
  "restore the GitDealFlow brand span and branded CTA in the populated widget header/footer",
);

// ---------------------------------------------------------------------------
// §28 footer hub block (2026-08-17, internal-link graph win): the site-wide
// Footer must link all 8 hub routes (/glossary /faq /for /tools /answers
// /use-cases /integrations /research). Before this, /for /tools /integrations
// had no home-nav or footer path (only 25/348 sitemap URLs were reachable
// from home). A reverted tree re-orphans those three hubs and re-opens the
// internal-link-graph gap (audit score 48).
// ---------------------------------------------------------------------------
check(
  "components/Footer.tsx",
  "Footer hub block lost a hub link; one or more of /glossary /faq /for /tools /answers /use-cases /integrations /research is orphaned again.",
  (s) =>
    [
      "/glossary",
      "/faq",
      "/for",
      "/tools",
      "/answers",
      "/use-cases",
      "/integrations",
      "/research",
    ].every((h) => s.includes(`href="${h}"`)),
  "restore all 8 hub links (href=\"/glossary\" etc.) in the site-wide Footer (internal-link-graph win)",
);

// ---------------------------------------------------------------------------
// §29 locale-topic summary noindex (2026-08-17, hreflang/i18n audit win).
// 74 of 96 locale topic pages are short hand-written summaries (98-397 body
// words) that were competing with the English canonical for thin/duplicate
// content. They are now NOINDEXED + canonicalized to English, and dropped from
// hreflang + the i18n sitemap; only the 22 full long-form translations
// (ja all-8, ko all-8, zh methodology/signals/research/about, es/signals,
// fr/signals: the last two enriched 2026-08-16 past the word floor) and the
// 12 hand-curated homepages stay indexable. A reverted tree re-indexes 74 thin
// pages and re-opens the canonical ambiguity the site's own /translations
// policy warns against.
// ---------------------------------------------------------------------------
check(
  "content/locale-topics.ts",
  "locale-topic summary allowlist/helper missing (FULL_TRANSLATION_TOPICS or isLocaleTopicSummary)",
  (s) =>
    s.includes("export const FULL_TRANSLATION_TOPICS") &&
    s.includes("export function isLocaleTopicSummary") &&
    s.includes('"ja/methodology"') &&
    s.includes('"ko/signals"') &&
    s.includes('"zh/about"') &&
    s.includes('"es/signals"') &&
    s.includes('"fr/signals"') &&
    s.includes('"ko/citations"'),
  "restore FULL_TRANSLATION_TOPICS (22 full translations incl. enriched es/signals, fr/signals, ko/citations) + isLocaleTopicSummary() in content/locale-topics.ts",
);
check(
  "app/[locale]/[topic]/page.tsx",
  "locale-topic page lost the summary noindex + canonical-to-English + hreflang filter",
  (s) =>
    s.includes("isLocaleTopicSummary") &&
    s.includes("robots: { index: false, follow: true }") &&
    s.includes("canonical: summary && enPath ? enPath"),
  "restore the summary noindex, English canonical, and full-translation-only hreflang map in the locale-topic page",
);
check(
  "lib/hreflang.ts",
  "hreflang / i18n-sitemap no longer filter summary topics",
  (s) =>
    s.includes("isLocaleTopicSummary") &&
    s.includes("!isLocaleTopicSummary(t.locale, t.topic)"),
  "filter summary topics out of getHreflangLanguages + getI18nSitemapEntries via isLocaleTopicSummary",
);

// ---------------------------------------------------------------------------
// §30 paginated startup directory (2026-08-17, audit "Pagination 60" win).
// The ~495 live /startup/[slug] profiles had no paginated hub discovery: the
// sector/city hubs pointed at the curated /signal corpus, and the ranked
// lists rendered one giant un-paginated table. This shipped a paginated
// /startups/[sector]/[page] + /startups/region/[geo]/[page] directory with
// rel=next/prev, wired from the ranked lists, the footer, and the sitemap. A
// reverted tree re-orphans the long tail, so assert every load-bearing piece.
// ---------------------------------------------------------------------------
check(
  "lib/directory.ts",
  "lib/directory.ts missing: paginated directory helpers gone, /startups re-orphans the startup long tail.",
  (s) =>
    s.includes("getSectorDirectory") &&
    s.includes("getRegionDirectory") &&
    s.includes("getAllSectorDirectoryPages") &&
    s.includes("getAllRegionDirectoryPages") &&
    s.includes("DIRECTORY_PAGE_SIZE"),
  "restore lib/directory.ts (sector + region directory helpers with pagination)",
);
check(
  "lib/data.ts",
  "lib/data.ts lost getAllRegionGeos: directory region enumeration has no source of truth.",
  (s) => s.includes("export function getAllRegionGeos"),
  "restore getAllRegionGeos() in lib/data.ts (returns GEO_DEFINITIONS slugs + names)",
);
check(
  "components/StartupDirectory.tsx",
  "StartupDirectory lost its rel=prev/rel=next pagination links: the long tail has no bounded crawl path again.",
  (s) => s.includes('rel="prev"') && s.includes('rel="next"'),
  "restore rel=prev / rel=next <link> emission in components/StartupDirectory.tsx",
);
check(
  "app/startups/[sector]/page.tsx",
  "app/startups/[sector]/page.tsx missing: sector directory page 1 gone.",
  (s) => s.includes("StartupDirectory") && s.includes("getSectorDirectory"),
  "restore app/startups/[sector]/page.tsx",
);
check(
  "app/startups/[sector]/[page]/page.tsx",
  "app/startups/[sector]/[page]/page.tsx missing: sector directory pagination gone.",
  (s) => s.includes("getAllSectorDirectoryPages"),
  "restore app/startups/[sector]/[page]/page.tsx",
);
check(
  "app/startups/region/[geo]/page.tsx",
  "app/startups/region/[geo]/page.tsx missing: region directory page 1 gone.",
  (s) => s.includes("StartupDirectory") && s.includes("getRegionDirectory"),
  "restore app/startups/region/[geo]/page.tsx",
);
check(
  "app/startups/region/[geo]/[page]/page.tsx",
  "app/startups/region/[geo]/[page]/page.tsx missing: region directory pagination gone.",
  (s) => s.includes("getAllRegionDirectoryPages"),
  "restore app/startups/region/[geo]/[page]/page.tsx",
);
check(
  "app/startups/page.tsx",
  "app/startups/page.tsx missing: directory index gone.",
  (s) => s.includes("getAllDirectorySectors") && s.includes("getAllDirectoryRegions"),
  "restore app/startups/page.tsx (sector + region directory index)",
);
check(
  "app/startups-to-watch/[slug]/page.tsx",
  "Sector ranked list lost its link to the /startups directory: the long tail is orphaned from the ranked pages.",
  (s) => s.includes("/startups/"),
  "restore the 'Browse the full {sector} directory' link to /startups/[sector]",
);
check(
  "app/startups-to-watch/region/[slug]/page.tsx",
  "Region ranked list lost its link to the /startups region directory.",
  (s) => s.includes("/startups/region/"),
  "restore the 'Browse all {geo} startups' link to /startups/region/[geo]",
);
check(
  "components/Footer.tsx",
  "Footer lost the /startups directory link: the directory index is orphaned from site-wide navigation.",
  (s) => s.includes('href="/startups"'),
  "restore the 'Startup Directory' link (href=\"/startups\") in the Footer Browse column",
);
check(
  "app/sitemap/[id]/route.ts",
  "Sitemap lost the /startups directory entries: new directory pages are no longer directly discoverable.",
  (s) => s.includes("getAllDirectorySectors") && s.includes("getAllDirectoryRegions"),
  "restore getAllDirectorySectors/getAllDirectoryRegions sitemap entries in the sectors shard",
);

// ---------------------------------------------------------------------------
// Momentum page section headings (2026-08-16 traffic audit, HTML-semantics
// item). The /momentum/[org]/[repo] template's content cards (tier, metrics,
// tracked-as, untracked status) carried NO H2s, only the CTA cards were
// headed, so the page read as a flat stack with no sectioning for crawlers
// or answer engines. Each content card must keep its H2.
// ---------------------------------------------------------------------------
check(
  "app/momentum/[org]/[repo]/page.tsx",
  "Momentum pages lost their section H2s (Momentum tier / Signal metrics / Tracked as / Not yet tracked); the template reverted to a flat card stack.",
  (s) =>
    s.includes("Momentum tier") &&
    s.includes("Signal metrics") &&
    s.includes("Tracked as") &&
    s.includes("Not yet tracked") &&
    (s.match(/<h2/g) ?? []).length >= 7,
  "re-section the page: add H2s for the tier card, metrics grid, tracked-as card, and untracked status card",
);


// ---------------------------------------------------------------------------
// Dead WebSub hub + missing JSON Feed ping (2026-08-16). websubhub.com
// returns 404 on publish; only pubsubhubbub.appspot.com and
// pubsubhubbub.superfeedr.com are functioning hubs. A declared-but-dead hub
// in feed discovery makes strict WebSub readers fail subscription instead of
// falling back to a live hub. The generator
// (~/portfolio/scripts/websub-feed-generator.py) was fixed the same day;
// these checks keep any lineage from reintroducing either defect.
// ---------------------------------------------------------------------------
check(
  "app/feed.json/route.ts",
  "Dead WebSub hub websubhub.com re-declared in /feed.json hub discovery",
  (s) => !s.includes("websubhub.com"),
  "remove the websubhub.com entry; keep only pubsubhubbub.appspot.com + pubsubhubbub.superfeedr.com",
);
check(
  "scripts/submit-websub.ts",
  "WebSub publish ping no longer covers /feed.json (the agent-native feed)",
  (s) => s.includes("${BASE_URL}/feed.json"),
  "add `${BASE_URL}/feed.json` to the TOPICS array so JSON Feed subscribers receive publish notifications",
);

// ---------------------------------------------------------------------------
// §32 query-matched FAQ rich results + single BreadcrumbList on /vs+/compare
// (2026-08-17, audit "rich-result eligibility 65" execution). GSC 90d showed
// "does harmonic integrate with affinity?" at 121 impressions / position 6.7 /
// 0 clicks with the token "integrate" absent from every /vs page; and /vs +
// /compare URLs emitted TWO BreadcrumbList nodes (curated + auto), a GSC
// duplicate-breadcrumb rich-result error. Reverting either re-opens the gap.
// ---------------------------------------------------------------------------
check(
  "content/competitor-vs.ts",
  "§32 the query-matched integration FAQ on affinity-vs-harmonic-ai was dropped (the GSC top-10 question query loses its only extractable answer on this domain)",
  (s) =>
    s.includes("Does Harmonic.ai integrate with Affinity?") &&
    s.includes("faqs?: { question: string; answer: string }[]"),
  "restore the faqs? field on CompetitorVs and the sourced integration FAQ on the affinity-vs-harmonic-ai pair",
);
check(
  "app/vs/[slug]/page.tsx",
  "§32 the /vs template no longer renders per-pair FAQs (pair.faqs orphaned in data, query-matched Q&A invisible to users and FAQPage JSON-LD)",
  (s) => s.includes("[...(pair.faqs ?? []), ...faqs]") && s.includes("mergedFaqs.map"),
  "restore the mergedFaqs merge and render both the FAQPage mainEntity and the visible FAQ list from mergedFaqs",
);
check(
  "components/BreadcrumbsSchema.tsx",
  "§32 the auto BreadcrumbList no longer yields to curated breadcrumb families (duplicate-breadcrumb rich-result error returns: every /vs, /compare, /answers, /alternatives, /best, /city, /sector, /tools, /faq URL would emit two BreadcrumbList nodes)",
  (s) =>
    s.includes("CURATED_BREADCRUMB_FAMILIES") &&
    s.includes('"/vs"') &&
    s.includes('"/faq"') &&
    s.includes("pathname === f || pathname.startsWith(f + \"/\")"),
  "restore the CURATED_BREADCRUMB_FAMILIES list and the exact-or-child skip in BreadcrumbsSchema.tsx",
);

check(
  "app/pricing/page.tsx",
  "§33 pricing rich-result schema (2026-08-17, audit item \"Add Product/Offer with price on /pricing\"): the offers-bearing SoftwareApplication must carry image (GSC merchant-listing CRITICAL field, 08-06 incident) and priceValidUntil must derive from FRESH_YEAR, never a hardcoded year",
  (s) =>
    s.includes('image: "https://signals.gitdealflow.com/opengraph-image"') &&
    s.includes("FRESH_YEAR + 1") &&
    !s.includes('"2026-12-31"') &&
    s.includes('import { FRESH_YEAR } from "@/lib/freshness-year"'),
  "restore the opengraph-image on the #softwareapplication node and the FRESH_YEAR-derived priceValidUntil (both offer sites)",
);
check(
  "components/RootIdentitySchema.tsx",
  "§33 the site-wide #software node (offers 0/49/197) must carry image (merchant-listing critical field)",
  (s) => s.includes("image: [`${SITE}/opengraph-image`],"),
  "restore image: [`${SITE}/opengraph-image`] on the #software SoftwareApplication node",
);

// ---------------------------------------------------------------------------
// §34 CWV trim 2026-08-16 (audit item "CWV 62: trim signals home"). Two
// defects found by live PSI + source inspection, both layout-level (hit all
// ~3,000 pages). A lineage that reverts either re-ships the perf cost:
//   1. LaunchBanner: deadline 2026-06-25 passed; the client component
//      rendered null for every visitor while still shipping its chunk,
//      hydration, and a 30s interval. If a future banner is needed, write a
//      NEW component with fresh deadline logic; do not resurrect this one.
//   2. GA4 gtag: afterInteractive made Next inject a <link rel=preload> for
//      gtag.js into <head>, pulling a third-party script into the LCP
//      window. lazyOnload keeps the gtag.js LIBRARY (gtag-loader) out of the
//      critical path. The gtag-init CONFIG push is now afterInteractive (not
//      lazyOnload): it must precede the qualified_visit event or gtag.js drops
//      the event for having no prior config (qualifier-ordering fix 08-19).
//      PostHog (north star) remains the primary tracker.
// ---------------------------------------------------------------------------
check(
  "app/layout.tsx",
  "§34 CWV trim: LaunchBanner was re-added after its 2026-06-25 deadline passed; it renders null for all visitors while shipping its client chunk, hydration, and a 30s interval on every page",
  (s) => !s.includes("import LaunchBanner") && !s.includes("<LaunchBanner />"),
  "keep LaunchBanner out of the root layout (deadline passed 2026-06-25); build a fresh banner component for future campaigns",
);
check(
  "components/PixelManager.tsx",
  "§34 CWV trim + GA4 qualifier ordering: gtag-loader must stay lazyOnload (afterInteractive re-injects the gtag.js <link rel=preload> into the LCP window), but gtag-init must be afterInteractive so the config command lands in dataLayer BEFORE the qualifier's qualified_visit event (a lazyOnload config is pushed after the event, and gtag.js silently drops an event with no prior config).",
  (s) =>
    /id="gtag-loader"[\s\S]{0,120}?strategy="lazyOnload"/.test(s) &&
    /id="gtag-init"[\s\S]{0,120}?strategy="afterInteractive"/.test(s),
  "keep gtag-loader on lazyOnload (library out of the LCP window) and gtag-init on afterInteractive (config must precede the qualified_visit event push)",
);

// ---------------------------------------------------------------------------
// §36 Mobile tap-target floor (2026-08-17, audit item "mobile-friendliness").
// Live 375px/360px rendered audit found structural link rows (footer column
// navs, breadcrumbs, aside lists, RelatedLinks cards) at 15-20px tall, under
// the WCAG 2.5.8 / Google 24px minimum. Two layers hold the fix:
//   1. globals.css :where(footer nav a, nav[aria-label="Breadcrumb"] a,
//      aside ul a) media block (mobile-only, zero-specificity lift).
//   2. RelatedLinks.tsx min-h-[24px] py-1 on card links (outside footer/aside
//      scope, so it needs the utility classes).
// A lineage that reverts either re-ships undersized tap targets on ~3,000 pages.
check(
  "app/globals.css",
  "§36 mobile tap-target floor: the :where(footer nav a, nav[Breadcrumb] a, aside ul a) mobile media block was dropped, re-shipping 15-20px structural link rows",
  (s) =>
    s.includes('nav[aria-label="Breadcrumb"] a') &&
    s.includes("min-height: 24px") &&
    s.includes("@media (max-width: 767px)") &&
    s.includes("section .flex a") &&
    s.includes("table a") &&
    s.includes("aside a"),
  "restore the mobile tap-target floor block in app/globals.css (see §36 comment)",
);
check(
  "components/RelatedLinks.tsx",
  "§36 mobile tap-target floor: RelatedLinks card links lost min-h-[24px] py-1",
  (s) => s.includes("min-h-[24px] py-1"),
  "restore min-h-[24px] py-1 on the RelatedLinks card Link className",
);

// ---------------------------------------------------------------------------
// §41 SERP feature coverage: definition+list answer for "what is deal flow
// signal" (2026-08-17). GSC 90d: "vc deal flow signal" = 144 imps pos 8.4,
// split across /faq (72 imps), /blog/what-is-deal-flow-signal (52 imps,
// pos 13.8), home, and others. The blog post is the snippet vehicle: it must
// keep the 46-word direct definition immediately under the title, the
// four-type ordered list directly after it (before "Why Is Traditional"),
// and the exact-phrase FAQ question. A tree that loses any of these
// silently forfeits the featured-snippet / PAA capture this fix buys.
// ---------------------------------------------------------------------------
{
  const s = read("content/posts.ts");
  if (s !== null) {
    const slugAt = s.indexOf('slug: "what-is-deal-flow-signal"');
    if (slugAt === -1) {
      failures.push(
        `§41 snippet post missing: content/posts.ts lacks slug "what-is-deal-flow-signal".\n    fix:  restore the post (definition + four-type ordered list + exact-phrase FAQ).`,
      );
    } else {
      const nextAt = s.indexOf('slug: "', slugAt + 10);
      const post = s.slice(slugAt, nextAt > -1 ? nextAt : slugAt + 9000);
      const defAt = post.indexOf("A deal flow signal is any data-driven indicator");
      const typesAt = post.indexOf("## What Are the Main Types of Deal Flow Signal?");
      const whyAt = post.indexOf("## Why Is Traditional Deal Flow Not Enough?");
      const listOk = [
        "1. Engineering signals (6-12 weeks lead time)",
        "2. Hiring signals (4-8 weeks)",
        "3. Web traffic signals (4-6 weeks)",
        "4. Social signals (1-2 weeks)",
      ].every((n) => post.includes(n));
      const faqExact = post.includes('question: "What is a deal flow signal?"');
      if (
        !(defAt > -1 && typesAt > -1 && whyAt > -1 && defAt < typesAt &&
          typesAt < whyAt && listOk && faqExact)
      ) {
        failures.push(
          `§41 definition+list structure degraded on what-is-deal-flow-signal.\n    file: content/posts.ts\n    fix:  keep the 46-word definition under the title, the four-type ordered list immediately after it (before "Why Is Traditional"), and the exact-phrase FAQ question "What is a deal flow signal?".`,
        );
      }
    }
  }
}
check(
  "content/post-freshness.ts",
  "§41 postFreshness revision entry for what-is-deal-flow-signal missing.",
  (s) => s.includes('"what-is-deal-flow-signal"') && s.includes('lastUpdated: "2026-08-17"'),
  "restore the 2026-08-17 revision entry (snippet restructure) in postFreshness",
);

// §35 Mobile-first indexing parity (2026-08-17). GSC URL Inspection confirms
// crawledAs=MOBILE on both hosts; a 237-URL live sweep proved byte-identical
// responses for Googlebot Smartphone / Desktop / Chrome Mobile (only diff:
// per-request signed share tokens, not UA-based). The regressions that could
// silently end this, and must never ship:
//   a) "googlebot" added to AGENT_BOT_TOKENS (would fork Google's crawler
//      into the agent-aware rendering path via x-agent-bot),
//   b) proxy.ts branching on a Googlebot UA anywhere outside the PostHog
//      bot_crawl monitoring table,
//   c) the viewport export dropped from the root layout (mobile-first render),
//   d) the live parity detector deleted or unwired.
// Live proof tool: npm run verify:mobile-parity (detector, NOT a build gate).
// ---------------------------------------------------------------------------
check(
  "lib/agent-bots.ts",
  "§35 mobile-first indexing: a Googlebot token was added to AGENT_BOT_TOKENS, which routes Google's crawler into the x-agent-bot rendering path. Googlebot must see exactly what mobile Chrome sees (crawledAs=MOBILE, verified 2026-08-17); AI-agent rendering is for GPTBot/ClaudeBot/etc. only.",
  (s) => {
    const m = s.match(/AGENT_BOT_TOKENS\s*=\s*\[([\s\S]*?)\]\s*as const/);
    return m !== null && !/googlebot/i.test(m[1]);
  },
  "remove the Googlebot entry from AGENT_BOT_TOKENS in lib/agent-bots.ts (bot-crawl monitoring belongs in proxy.ts SEARCH_AND_GENERIC_BOTS, which never branches rendering)",
);

check(
  "proxy.ts",
  "§35 mobile-first indexing: proxy.ts now branches on a Googlebot UA outside the bot_crawl monitoring table. Googlebot must never be rewritten, agent-rendered, or content-negotiated differently from a mobile browser.",
  (s) => {
    if (!s.includes("const detectedBot = detectAgentBot(ua);")) return false;
    const withoutMonitoringRow = s.split('["googlebot", "Googlebot"],').join("");
    return !/googlebot/i.test(withoutMonitoringRow);
  },
  "keep agent-aware branching sourced ONLY from detectAgentBot() (AI bots), and keep the sole Googlebot reference as the PostHog monitoring row [\"googlebot\", \"Googlebot\"]",
);

check(
  "app/layout.tsx",
  "§35 mobile-first indexing: the root layout viewport export lost width: \"device-width\". Without it the mobile-first-indexed render degenerates to desktop layout on phones.",
  (s) => /viewport[\s\S]{0,400}width:\s*["']device-width["']/.test(s),
  'restore the Next.js viewport export with width: "device-width" (and initialScale) in app/layout.tsx',
);

check(
  "scripts/verify-mobile-parity.mjs",
  "§35 mobile-first indexing: the live 3-UA parity detector was deleted or gutted (it proves Googlebot-Smartphone == Chrome-Mobile == Googlebot-Desktop across every template family).",
  (s) =>
    s.includes("Googlebot/2.1") &&
    s.includes("device-width") &&
    s.includes("process.exit(1)") &&
    s.includes("«TOKEN»"),
  "restore scripts/verify-mobile-parity.mjs (3-UA fetch + JWT masking + viewport assertion, exit 1 only on confirmed divergence)",
);

check(
  "package.json",
  "§35 mobile-first indexing: the verify:mobile-parity npm script (live parity detector wiring) is missing.",
  (s) => s.includes("verify:mobile-parity"),
  'restore the "verify:mobile-parity" script pointing at scripts/verify-mobile-parity.mjs',
);

// ---------------------------------------------------------------------------
// §38 Working search surface (2026-08-16, audit item "sitelinks 55").
// The WebSite SearchAction + opensearch.xml had a dead human path: browsers
// registering the site as a search engine were sent to /?q=... which the
// homepage ignored, and Google deprecated the sitelinks search box in Nov
// 2024 anyway. This guard pins the 2026-correct stack:
//   1. /search SSR page (server component, plain GET form, noindex).
//   2. proxy.ts NOINDEX_PREFIXES carries "/search" (header mirrors meta).
//   3. opensearch.xml text/html template points at /search (not /?q=).
//   4. WebSite schema carries a human SearchAction (Desktop+Mobile web
//      platforms) whose urlTemplate matches /search?q={search_term_string}.
//   5. Header renders a visible search affordance on desktop + mobile and
//      SiteNavigationElement includes Search + /search.
//   6. JSON agent search and /search share ONE corpus (lib/search-index.ts)
//      so results can never drift between surfaces.
// A lineage that reverts any layer re-ships a broken search path that
// browsers and OpenSearch consumers will discover via opensearch.xml.
// ---------------------------------------------------------------------------
check(
  "app/search/page.tsx",
  "§38 working search surface: the /search SSR results page was deleted or gutted (dead human search path returns)",
  (s) =>
    s.includes('action="/search"') &&
    s.includes('method="get"') &&
    s.includes("searchCorpus") &&
    s.includes("index: false"),
  "restore app/search/page.tsx (server component, plain GET form, searchCorpus results, noindex metadata)",
);
check(
  "proxy.ts",
  "§38 working search surface: \"/search\" was dropped from NOINDEX_PREFIXES, so the utility page would send mixed signals (meta noindex vs header index)",
  (s) => /NOINDEX_PREFIXES[^;]*"[^"]*\/search"/.test(s.replace(/\s+/g, " ")),
  'add "/search" to NOINDEX_PREFIXES in proxy.ts (keep header-level X-Robots-Tag aligned with the page meta robots)',
);
check(
  "app/opensearch.xml/route.ts",
  "§38 working search surface: the opensearch.xml text/html template no longer points at the /search results page",
  (s) => s.includes("/search?q={searchTerms}"),
  "point the opensearch.xml text/html template at ${SITE}/search?q={searchTerms}",
);
check(
  "components/RootIdentitySchema.tsx",
  "§38 working search surface: the human-path SearchAction (Desktop+Mobile web platforms, /search target) was dropped from the WebSite node",
  (s) =>
    s.includes("DesktopWebPlatform") &&
    s.includes("MobileWebPlatform") &&
    s.includes("/search?q={search_term_string}"),
  "keep both SearchActions on the WebSite node: /search (human, actionPlatform) and /api/llms-search (agents, contentType JSON)",
);
check(
  "components/Header.tsx",
  "§38 working search surface: the header search affordance or the SiteNavigationElement Search entry was dropped",
  (s) =>
    s.includes('href="/search"') &&
    s.includes('aria-label="Search the site"') &&
    s.includes('"Search"') &&
    s.includes("${SITE}/search"),
  "restore the /search link (desktop icon + mobile row) and the SiteNavigationElement Search entry in components/Header.tsx",
);
check(
  "lib/search-index.ts",
  "§38 working search surface: the shared search corpus was deleted, desynchronizing /api/llms-search from /search",
  (s) => s.includes("export function searchCorpus") && s.includes("export function normalizeQuery"),
  "keep lib/search-index.ts as the single corpus shared by the JSON endpoint and the SSR page",
);
check(
  "app/api/llms-search/route.ts",
  "§38 working search surface: the JSON endpoint no longer uses the shared corpus (results will drift from /search)",
  (s) => s.includes("searchCorpus"),
  "import { searchCorpus } from @/lib/search-index in app/api/llms-search/route.ts",
);


// ---------------------------------------------------------------------------
// §39 Field CWV beacon must survive every deploy (2026-08-17, revised
// 2026-08-19). The native posthog-js SDK does NOT capture TTFB (verified in
// project 143861: zero native-shape TTFB values on any host in 28d), and its
// DESKTOP LCP/FCP carry background-tab dwell (the SDK lacks web-vitals'
// firstHiddenTime guard: measured apex LCP p75 3016ms / FCP 3110ms vs true
// mobile ~489ms). components/WebVitalsReporter.tsx is therefore the ONLY
// clean field source for TTFB + desktop LCP/FCP on signals; the regression
// checks (field_ttfb_check.py n>=500/wk gate + cwv_field.py lcp_basis/
// fcp_basis) depend on it. Fails closed if a lineage reverts it to a no-op,
// drops the LCP/FCP/TTFB filter, drops the dwell-filtered/ttfb-v2 markers,
// or removes the junk-zero/prerender skip that keeps the field p75 meaningful.
// ---------------------------------------------------------------------------
{
  const b = read("components/WebVitalsReporter.tsx");
  if (b === null) {
    failures.push("components/WebVitalsReporter.tsx missing entirely");
  } else {
    if (!b.includes('metric.name !== "LCP" && metric.name !== "FCP" && metric.name !== "TTFB"')) {
      failures.push(
        `§39 beacon lost the LCP/FCP/TTFB filter (it must capture LCP, FCP and TTFB, nothing else).\n` +
          `    fix:  restore the "if (metric.name !== \"LCP\" && metric.name !== \"FCP\" && metric.name !== \"TTFB\") return;" guard`,
      );
    }
    if (!b.includes('"ttfb-v2"')) {
      failures.push(
        `§39 TTFB beacon lost the beacon='ttfb-v2' marker (field_ttfb_check.py keys on it).\n` +
          `    fix:  restore beacon: "ttfb-v2" in the capture properties`,
      );
    }
    if (!b.includes('"dwell-filtered"')) {
      failures.push(
        `§39 beacon lost the beacon='dwell-filtered' marker for LCP/FCP (cwv_field.py lcp_basis/fcp_basis keys on the clean beacon). ` +
          `    fix:  restore beacon: "dwell-filtered" for LCP/FCP in the capture properties`,
      );
    }
    if (!b.includes('"prerender"') || !b.includes('"back-forward"')) {
      failures.push(
        `§39 TTFB beacon lost the prerender/bfcache skip (zeros pollute the field p75).\n` +
          `    fix:  restore SKIP_NAV with "prerender" and "back-forward"`,
      );
    }
    if (!/\.capture\(\s*["']\$web_vitals["']/.test(b)) {
      failures.push(
        `§39 TTFB beacon lost the posthog capture path ($web_vitals event).\n` +
          `    fix:  restore the (window as { posthog? }).posthog.capture("$web_vitals", ...) call`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// §40 Verbatim PAA/GSC questions as on-page H3s (2026-08-16, audit item
// "People Also Ask 30"). Harvest: 13 live Google SERPs (headed Chrome,
// consent-dismissed, hl=en&gl=us) -> 30 unique verbatim PAA questions,
// cross-referenced with 28d GSC query+page data (14 question-shaped queries,
// ~450 impressions, positions 3.4-9.8, ZERO clicks -> the exact SERP feature
// this content targets). Answers: entity facts verified vs 3+ independent
// sources each (two-Harmonics disambiguation, Affinity valuation-undisclosed,
// CB Insights independent/Sanwal, harmonic.ai founders Casey+Sohmshetty).
// The /vs template renders FAQ questions as <h3> + FAQPage JSON-LD from
// mergedFaqs, so these are simultaneously human-visible H3s and machine-
// extractable Question/Answer pairs. Reverting drops the only on-domain
// verbatim match for Google's actual PAA/GSC questions.
// ---------------------------------------------------------------------------
check(
  "content/competitor-vs.ts",
  "§40 PAA: the verbatim question cluster was dropped from harmonic-ai-vs-pitchbook (6 questions, ~200 impressions/28d, the single largest question-demand pool on the domain)",
  (s) =>
    s.includes("How does Harmonic.ai compare to PitchBook?") &&
    s.includes("How does Harmonic's pricing compare to PitchBook's?") &&
    s.includes("How does Harmonic's data quality compare to PitchBook's?") &&
    s.includes("How does Harmonic's Scout AI compare to PitchBook's search?") &&
    s.includes("How does PitchBook's data freshness compare to Harmonic's?") &&
    s.includes("Which has better people data: Harmonic or PitchBook?"),
  "restore the 6 verbatim question FAQs on the harmonic-ai-vs-pitchbook pair (GSC 28d + PAA harvest 2026-08-17)",
);
check(
  "content/competitor-vs.ts",
  "§40 PAA: the CB Insights entity questions (reputable / cost per year / who owns / what kind of company) were dropped; they appear verbatim as PAA on 2 SERPs and are entity-SEO surface",
  (s) => {
    // Slug-bound since 2026-08-16: the questions must live on the CANONICAL
    // pair block (cb-insights-vs-crunchbase). A direction-consolidation 308
    // (next.config.ts) stranded them on the redirected crunchbase-vs-cb-insights
    // block once, rendering them nowhere. This binding makes that fail-closed.
    const blk = s.slice(s.indexOf('slug: "cb-insights-vs-crunchbase"'), s.indexOf('slug: "', s.indexOf('slug: "cb-insights-vs-crunchbase"') + 10));
    return blk.includes("Is CB Insights reputable?") &&
      blk.includes("How much does CB Insights cost per year?") &&
      blk.includes("Who owns CB Insights?") &&
      blk.includes("What kind of company is CB Insights?");
  },
  "restore the 4 CB Insights entity-question FAQs on the cb-insights-vs-crunchbase pair (facts: independent, Sanwal-founded, ~$35k+/yr enterprise)",
);
check(
  "content/competitor-vs.ts",
  "§40 PAA: the free-alternatives and PitchBook-competitors questions were dropped (verbatim PAA on 4 SERPs each, the highest-frequency cross-SERP questions)",
  (s) =>
    s.includes("Is there a free alternative to PitchBook?") &&
    s.includes("Who are PitchBook's main competitors?") &&
    s.includes("What is better, PitchBook or Crunchbase?") &&
    s.includes("Is a PitchBook worth it?"),
  "restore the 4 PitchBook-vs-Crunchbase PAA FAQs (crunchbase-vs-pitchbook pair)",
);
check(
  "content/competitor-vs.ts",
  "§40 PAA: the affinity-vs-harmonic-ai pricing and founders-disambiguation questions were dropped (harmonic ai pricing SERP PAA; the founders question disambiguates the two Harmonic companies)",
  (s) =>
    s.includes("How much does Harmonic.ai cost?") &&
    s.includes("Who are the founders of Harmonic.ai?") &&
    s.includes("What are some alternatives to Harmonic.ai?"),
  "restore the 3 appended FAQs on affinity-vs-harmonic-ai (pricing, alternatives, founders-disambiguation)",
);
check(
  "content/competitor-vs.ts",
  "§40 PAA: the remaining verbatim cluster questions were dropped (dealroom/specter/tracxn/crunchbase comparisons, PitchBook free version, Tracxn-vs-PitchBook, Affinity valuation + free-alternatives, PitchBook reputable)",
  (s) =>
    s.includes("How does Harmonic compare to Dealroom?") &&
    s.includes("How does Harmonic compare to Specter?") &&
    s.includes("How does Harmonic compare to Tracxn?") &&
    s.includes("How does Harmonic compare to Crunchbase for startup data?") &&
    s.includes("What is Affinity.co's valuation?") &&
    s.includes("Is there a free version of PitchBook?") &&
    s.includes("Is Tracxn better than PitchBook?") &&
    s.includes("Is PitchBook reputable?") &&
    s.includes("What are some free alternatives to PitchBook?"),
  "restore the remaining verbatim comparison FAQs across harmonic-ai-vs-dealroom, specter-vs-harmonic-ai, harmonic-ai-vs-tracxn, harmonic-ai-vs-crunchbase, dealroom-vs-pitchbook, pitchbook-vs-tracxn, affinity-vs-pitchbook",
);

check(
  "content/agent-queries.ts",
  "§40 PAA: the verbatim early-stage-startups question was dropped from the how-to-find answer page (verbatim PAA on the seed SERP for the repo's core TOFU query)",
  (s) =>
    s.includes("How to find early stage startups?") &&
    s.includes("how-to-find-startups-before-they-fundraise"),
  "restore the verbatim 'How to find early stage startups?' FAQ on how-to-find-startups-before-they-fundraise",
);

check(
  "content/alternatives.ts",
  "§40 PAA wave-2: the third-party Harmonic-comparison Q&As (Grata/Eilla/SourceScrub/Synaptic) were dropped from the harmonic-ai alternatives entry (verbatim PAA on 4 page-1 SERPs, ~36 imps/28d, 0 clicks pre-wave-2)",
  (s) =>
    s.includes("How does Harmonic compare to Grata for deal sourcing?") &&
    s.includes("How does Harmonic compare to Eilla AI?") &&
    s.includes("How does Harmonic compare to SourceScrub?") &&
    s.includes("How does Harmonic compare to Synaptic?"),
  "restore the 4 appended third-party Harmonic-comparison FAQs on the harmonic-ai alternatives entry",
);
check(
  "app/acquirer/[slug]/page.tsx",
  "§40 PBA: the conditional Vista Equity operational-changes question was dropped (top question-shaped GSC query on /acquirer, 18 imps/28d pos 13.1)",
  (s) =>
    s.includes("vista-equity-partners") &&
    s.includes("What kind of operational changes does Vista Equity Partners make after acquiring a software company?"),
  "restore the conditional Vista PAA FAQ in the acquirer template",
);


// ---------------------------------------------------------------------------
// §42 CTR title hooks site-wide (2026-08-16, audit item "Title/meta CTR
// levers 25"). Phase 2 of the SERP-CTR win: the proven /vs/ price-hook
// pattern extended to /compare/, /alternatives/, research-paper leaves,
// from-stars-to-seed leaves, /methodology, and /answers. Figures come ONLY
// from the site's own published pricing (competitor-vs.ts) and the GDF
// ladder. Years render via FRESH_YEAR_STR, never hardcoded. A lineage that
// loses these reverts every hooked <title> to the generic catalog form
// that earned 21 clicks / 7,455 impressions (0.28% CTR).
// ---------------------------------------------------------------------------
check(
  "content/comparisons.ts",
  "§42 CTR: the COMPARE_TITLE_HOOKS map was dropped (per-slug price/verdict hooks for /compare listicles)",
  (s) =>
    s.includes("export const COMPARE_TITLE_HOOKS") &&
    s.includes("Best AI Deal Sourcing Tools: Free to $35k+") &&
    s.includes("EUR 49 vs $49/mo"),
  "restore COMPARE_TITLE_HOOKS in content/comparisons.ts (48 slug hooks)",
);
check(
  "app/compare/[slug]/page.tsx",
  "§42 CTR: the compare builder no longer consumes the hook map (title falls back to generic)",
  (s) =>
    s.includes("COMPARE_TITLE_HOOKS[slug]") &&
    s.includes("hookedTitle} ${FRESH_YEAR_STR}`") &&
    !s.includes("(${FRESH_YEAR_STR})"),
  "restore hook-map consumption in app/compare/[slug]/page.tsx generateMetadata",
);
check(
  "content/alternatives.ts",
  "§42 CTR: the ALTERNATIVES_TITLE_HOOKS map was dropped",
  (s) => s.includes("export const ALTERNATIVES_TITLE_HOOKS"),
  "restore ALTERNATIVES_TITLE_HOOKS in content/alternatives.ts",
);
check(
  "app/alternatives/[slug]/page.tsx",
  "§42 CTR: the alternatives builder no longer consumes the hook map",
  (s) => s.includes("ALTERNATIVES_TITLE_HOOKS[slug]") && !s.includes("(${FRESH_YEAR_STR})"),
  "restore hook-map consumption in app/alternatives/[slug]/page.tsx generateMetadata",
);
check(
  "content/comparisons.ts",
  "\u00a767 BOFU compare: a GDF-vs-competitor head-to-head was dropped (tracxn / forager-ai / specter / signalrank)",
  (s) =>
    s.includes('slug: "vc-deal-flow-signal-vs-tracxn"') &&
    s.includes('slug: "vc-deal-flow-signal-vs-forager-ai"') &&
    s.includes('slug: "vc-deal-flow-signal-vs-specter"') &&
    s.includes('slug: "vc-deal-flow-signal-vs-signalrank"') &&
    s.includes('"vc-deal-flow-signal-vs-signalrank": "VC Deal Flow Signal vs SignalRank: $0 vs Index Fund"') &&
    s.includes('"vc-deal-flow-signal-vs-specter": "VC Deal Flow Signal vs Specter: Free Tier vs Tiered"') &&
    s.includes('"vc-deal-flow-signal-vs-tracxn": "VC Deal Flow Signal vs Tracxn: Free Tier vs Tiered"'),
  "restore the 4 BOFU GDF-vs-competitor comparison entries + their COMPARE_TITLE_HOOKS in content/comparisons.ts",
);
check(
  "content/research-papers.ts",
  "§42 CTR: research-paper metaTitles reverted to catalog form (the 19.6K-impression pool's only CTR lever)",
  (s) =>
    s.includes("LoRA Paper Explained: Low-Rank Adaptation (Hu et al., 2021)") &&
    s.includes("GPT-3 Paper Explained: Language Models Are Few-Shot Learners") &&
    s.includes("RAG Paper Explained: Retrieval-Augmented Generation (Lewis 2020)") &&
    s.includes("Constitutional AI Explained: Harmlessness (Bai et al., 2022)"),
  "restore the Explained-hook metaTitles across content/research-papers.ts (9 papers)",
);
check(
  "content/from-stars-to-seed.ts",
  "§42 CTR: from-stars-to-seed headlines lost their $ / star figures",
  (s) =>
    s.includes("Linear to a $35M Series B: Signal in Integrations, Not Stars") &&
    s.includes("Remotion: React Programmatic Video, 0 to 17K Stars") &&
    s.includes("Ollama: Local LLM Runtime, ~50K Stars to Series A"),
  "restore the figure-bearing headlines in content/from-stars-to-seed.ts",
);
check(
  "app/methodology/page.tsx",
  "§42 CTR: the methodology title lost its 21-47 day validated-claim hook",
  (s) =>
    s.includes("GitDealFlow Methodology: Signals 21-47 Days Before the Round"),
  "restore the hooked methodology title",
);
check(
  "content/agent-queries.ts",
  "§42 CTR: the answers metaTitle override field or its first use was dropped",
  (s) =>
    s.includes("metaTitle?: string") &&
    s.includes("GitHub Data for Startup Investors: Free Weekly Signals"),
  "restore metaTitle support in content/agent-queries.ts",
);
check(
  "app/answers/[slug]/page.tsx",
  "§42 CTR: the answers builder no longer consumes metaTitle",
  (s) => s.includes("? { title: { absolute: q.metaTitle } }") &&
    s.includes("q.metaTitle ?? q.h1"),
  "restore metaTitle consumption in app/answers/[slug]/page.tsx generateMetadata",
);

check(
  "app/best/[slug]/page.tsx",
  "\u00a742 CTR: the /best/ sector builder lost its 'Free Weekly Rankings' hook + absolute-title form",
  (s) =>
    s.includes("Free Weekly Rankings") &&
    s.includes("title: { absolute: title }"),
  "restore the hooked + absolute title in app/best/[slug]/page.tsx generateMetadata",
);
landingCheck(
  "vs/pitchbook/index.html",
  "\u00a742 CTR: apex vs/pitchbook title reverted to the generic pre-hook form",
  (s) =>
    /<title>GitDealFlow vs PitchBook: EUR 49 vs \$20k\+\/yr \(2026\)<\/title>/.test(s),
  "restore the 2026-08-16 hooked apex title + 2026-08-18 year token (44-file landing wave)",
);
landingCheck(
  "vs/gitdealflow-vs-crunchbase/index.html",
  "\u00a742 CTR: apex gitdealflow-vs-crunchbase lost its 21-47d lead-time hook",
  (s) => /<title>GitDealFlow vs Crunchbase: 21-47 Days Earlier<\/title>/.test(s),
  "restore the hooked title on the duplicate-pair primary",
);
landingCheck(
  "alternatives-to/crunchbase-alternatives/index.html",
  "\u00a742 CTR: apex crunchbase-alternatives lost its price-band hook",
  (s) =>
    /<title>Best Crunchbase Alternatives: 4 Under \$50\/mo<\/title>/.test(s) ||
    /<title>Crunchbase Alternatives: Free GitHub Signals<\/title>/.test(s),
  "restore the hooked apex alternatives-to title",
);
landingCheck(
  "best/best-deal-flow-tools.html",
  "\u00a742 CTR: apex best-deal-flow-tools lost its price-comparison hook",
  (s) =>
    /<title>Best Deal Flow Tools 2026: EUR 49 vs \$20k\+ \(Compared\)<\/title>/.test(s),
  "restore the hooked apex best/ title",
);

landingCheck(
  "vs/tracxn/index.html",
  "\u00a742 CTR: apex year-token sweep reverted (9 static /vs/ titles lost (2026))",
  (s) => /<title>GitDealFlow vs Tracxn: EUR 49 vs \$6k\+\/yr \(2026\)<\/title>/.test(s),
  "restore the year token on the static apex /vs/ fleet (freshness watchdog apex family)",
);
landingCheck(
  "best/best-venture-data-platforms.html",
  "\u00a742 CTR: apex best-listicle year token reverted",
  (s) =>
    /<title>Best Venture Data Platforms: \$0 to \$50k \(2026\)<\/title>/.test(s),
  "restore the year token on the static apex best/ listicles",
);
landingCheck(
  "best/best-free-deal-flow-tools.html",
  "\u00a742 CTR: apex best-free-deal-flow-tools lost its free-tier hook",
  (s) => {
    const m = s.match(/<title>([^<]*)<\/title>/);
    return !!m && /vs \$|EUR |Free|\$\d/.test(m[1]);
  },
  "restore the hooked apex free-tools title",
);


// §43 striking-distance cohort internal linking (2026-08-16, audit item
// "Average position 40"): 56 URLs at pos 6.5-12.5 held 38.7K impressions with
// whole families at ZERO in-links (acquirer/from-stars-to-seed/signal/best;
// single-token slugs can never win token-overlap links, and the §27 equity
// pass only fired on 11 competitor entities). Fix: pass-3 striking-distance
// floors + same-section fallback in build-internal-links.ts (RENDER_SECTIONS),
// RelatedLinks on 4 templates, 3 consolidation 308s, footer hub links.
// A reverted tree re-orphans ~40 pages holding 30K+ impressions.
{
  const builder = read("scripts/build-internal-links.ts");
  if (builder === null) {
    failures.push("§43 scripts/build-internal-links.ts missing");
  } else {
    for (const needle of ["striking-distance.json", "RENDER_SECTIONS", "equity tie-break"]) {
      if (!builder.includes(needle)) {
        failures.push(
          `§43 striking-distance pass lost from build-internal-links.ts (needle: ${needle})\n` +
            `    fix:  restore pass-3 floors + same-section fallback (audit avg-position-40 win, 2026-08-16)`,
        );
      }
    }
  }

  const cohortRender = (rel: string, pathPrefix: string) => {
    const s = read(rel);
    if (s === null) {
      failures.push(`§43 ${rel} missing`);
      return;
    }
    if (!s.includes("RelatedLinks")) {
      failures.push(
        `§43 ${rel} no longer renders RelatedLinks\n` +
          `    fix:  restore the RelatedLinks render (audit avg-position-40 win, 2026-08-16)`,
      );
    }
  };
  cohortRender("app/signal/[slug]/page.tsx");
  cohortRender("app/from-stars-to-seed/[slug]/page.tsx");
  cohortRender("app/best/[slug]/page.tsx");
  cohortRender("app/research/[slug]/page.tsx");

  const nextcfg = read("next.config.ts");
  if (nextcfg === null) {
    failures.push("§43 next.config.ts missing");
  } else {
    for (const needle of [
      "/vs/harmonic-ai-vs-affinity",
      "/vs/crunchbase-vs-cb-insights",
      // NOTE 2026-08-19: the old "/best/developer-tools-2026" needle was
      // REMOVED on purpose. That 308 (and the other four frozen-sector
      // /best/ 308s) is now DATA-DERIVED by scripts/generate-best-redirects.ts
      // and spread into next.config.ts; hardcoding it back would shadow the
      // live page once data catches up. The "Data-derived historical /best/
      // redirects" guard block owns that surface now.
    ]) {
      if (!nextcfg.includes(needle)) {
        failures.push(
          `§43 consolidation 308 lost from next.config.ts (needle: ${needle})\n` +
            `    fix:  restore the 308 (conflicting-canonical / 404 leak fix, 2026-08-16)`,
        );
      }
    }
  }

  const footer = read("components/Footer.tsx");
  if (footer === null) {
    failures.push("§43 components/Footer.tsx missing");
  } else {
    for (const needle of ["/markets", "/predict", "/receipts"]) {
      if (!footer.includes(needle)) {
        failures.push(
          `§43 footer hub link lost (needle: ${needle})\n` +
            `    fix:  restore the footer link to the near-orphan hub (2026-08-16)`,
        );
      }
    }
  }

  // In-degree floors: every cohort page must hold >= its floor in the
  // committed graph. Measured after the fix: all 56 met (worst = 2 on
  // /receipts, which matches its honest floor). Before: 40+ pages at 0.
  const linksRaw = read("data/internal-links.json");
  if (linksRaw !== null) {
    try {
      const graph = JSON.parse(linksRaw) as Record<string, Array<{ links?: Array<{ href: string }> }>>;
      const cohortRaw = read("data/striking-distance.json");
      if (cohortRaw !== null) {
        const cohort = JSON.parse(cohortRaw) as Array<{ href: string; floor: number }>;
        const indeg: Record<string, number> = {};
        for (const groups of Object.values(graph)) {
          if (!Array.isArray(groups)) continue;
          for (const g of groups) {
            for (const l of g.links || []) indeg[l.href] = (indeg[l.href] || 0) + 1;
          }
        }
        for (const c of cohort) {
          if ((indeg[c.href] || 0) < c.floor) {
            failures.push(
              `§43 ${c.href} dropped to ${indeg[c.href] || 0} in-links (floor: ${c.floor})\n` +
                `    file: data/internal-links.json\n` +
                `    fix:  rerun scripts/build-internal-links.ts (pass-3 floors must survive regeneration)`,
            );
          }
        }
      }
    } catch {
      failures.push("§43 data/internal-links.json is not valid JSON");
    }
  }
}


// ---------------------------------------------------------------------------
// §44 Lineage-ancestry sentinels (2026-08-16, lineage-reset hazard, bitten
// twice: 2026-08-16 definitions drop, 2026-08-03/04 Stripe/payment links).
// A swarm sibling's reset/ff silently dropped committed fixes from main; the
// tree still built and deployed, regressing production. §44 makes that ritual
// mechanical: every sentinel in scripts/ancestry-ledger.json must (a) be an
// ancestor of HEAD and (b) survive at HEAD as content needles (read via
// `git show`, never the worktree). Ledger protocol: add an entry in the SAME
// commit as the fix it protects. Full docs: scripts/verify-ancestry.ts.
{
  const ancestry = runAncestryGuard();
  if (ancestry.failures.length > 0) {
    for (const f of ancestry.failures) failures.push(f);
  } else {
    console.log(`  §44 ${ancestry.summary}`);
  }
}

// §45 Partner-recommendation slot in the Sunday digest (2026-08-16, email-as-
// traffic-source swap play). Three surfaces must stay wired: the renderer
// template, the generator's loading logic, and the rotation data file. A tree
// that drops any of them silently removes the reciprocal real estate every
// newsletter swap offer promises partners.
{
  const de = readFileSync("lib/digest-email.ts", "utf8");
  const gen = readFileSync("scripts/generate-signal-digest-email.ts", "utf8");
  const pdata = readFileSync("data/partner-recommendations.json", "utf8");
  const needles45: ReadonlyArray<[string, string, string]> = [
    [de, "This week we're reading", "renderer partner-slot header"],
    [de, "DigestPartner", "renderer DigestPartner type"],
    [de, "data.partnerPick", "renderer partnerPick render gate"],
    [gen, "partner-recommendations.json", "generator partner data load"],
    [gen, 'p.status === "featured"', "generator featured-first rotation"],
    [pdata, '"status": "featured"', "data file has a featured entry"],
    [pdata, "confluencevcweekly.beehiiv.com", "data file live partner URL"],
  ];
  for (const [src, needle, label] of needles45) {
    if (!src.includes(needle)) {
      failures.push(`§45 partner-slot ${label} lost (needle: ${needle})`);
    }
  }
}

// §46 Free-tool-count claims must stay count-free (2026-08-16, HackerNoon
// editorial fact-check surface). The tool roster grows across surfaces
// (npm 10-free, hosted MCP 11-free, function API 7-free) and hardcoded
// counts drift stale within weeks. Any surface that names a specific
// free-tool count invites a one-click contradiction for an editor or
// reader comparing surfaces. Count-free phrasing only.
{
  const surfaces: ReadonlyArray<[string, string]> = [
    ["app/agents/credits/page.tsx", "credits page"],
    ["app/llms-full.txt/route.ts", "llms-full.txt"],
    ["app/api/webhook/stripe/route.ts", "stripe webhook email"],
    ["app/api/agent/tools/route.ts", "agent tools API"],
  ];
  for (const [p, label] of surfaces) {
    let src: string | null = null;
    try { src = readFileSync(p, "utf8"); } catch { src = null; }
    if (src === null) {
      failures.push(`§46 count-free claims: ${label} file missing (${p})`);
      continue;
    }
    // any "N free" phrasing with a hardcoded digit is the regression
    if (/\b\d+ free (MCP )?tools?\b/i.test(src) || /\bthe \d+ free\b/i.test(src)) {
      failures.push(`§46 count-free claims: ${label} still hardcodes a free-tool count (${p})`);
    }
    // positive needles: the corrected phrasing must be present
    if (p === "app/agents/credits/page.tsx" && !src.includes("The free MCP tools stay free")) {
      failures.push("§46 count-free claims: credits page corrected phrase lost");
    }
  }
}

// ---------------------------------------------------------------------------
// HSTS preload header on both config surfaces (2026-08-16)
// ---------------------------------------------------------------------------
// signals.gitdealflow.com serves
// Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
// (verified live across 200/404/API/XML/embed response classes), and the
// parent domain gitdealflow.com is status=pending on hstspreload.org with
// includeSubDomains, so this host must keep the exact preload-compliant
// value on BOTH surfaces that can emit it: vercel.json headers[] (applies
// to every route, including static) and next.config.ts headers() (Next
// route responses). Dropping or weakening either re-ships an HSTS-less
// site, and getting off the preload list afterwards takes months. If these
// are ever intentionally consolidated to ONE surface, update this check in
// the same commit with a reason — do not bypass it.
{
  const HSTS = "max-age=63072000; includeSubDomains; preload";
  const vj = read("vercel.json");
  let vjOk = false;
  const vjBad: string[] = [];
  if (vj === null) {
    vjBad.push("vercel.json not found");
  } else {
    try {
      const parsed = JSON.parse(vj) as { headers?: { source?: string; headers?: { key?: string; value?: string }[] }[] };
      const entries = (parsed.headers || []).flatMap((b) =>
        (b.headers || []).map((x) => ({ src: b.source, key: x.key, value: x.value })),
      );
      const hsts = entries.filter((x) => x.key === "Strict-Transport-Security");
      vjOk = hsts.some((x) => x.src === "/(.*)" && x.value === HSTS);
      for (const x of hsts.filter((x) => x.value !== HSTS)) {
        vjBad.push(`"${x.src}" -> "${x.value}"`);
      }
    } catch (e) {
      vjBad.push(`vercel.json does not parse as JSON (${e})`);
    }
  }
  if (!vjOk) {
    failures.push(
      `HSTS lost from vercel.json: headers[] must keep a "/(.*)" block with Strict-Transport-Security: "${HSTS}" (2026-08-16; hstspreload.org submission pending on the parent domain, weakening costs months to undo).`,
    );
  }
  if (vjBad.length) {
    failures.push(
      `HSTS invalid or weakened entries in vercel.json: ${vjBad.join("; ")}; the only accepted value is "${HSTS}".`,
    );
  }
  check(
    "next.config.ts",
    "next.config.ts HSTS header",
    (s) =>
      s.includes('key: "Strict-Transport-Security"') &&
      s.includes(`value: "${HSTS}"`),
    `keep the headers() entry Strict-Transport-Security: "${HSTS}" in next.config.ts (2026-08-16 belt-and-braces with vercel.json; if intentionally consolidated, update this check with a reason)`,
  );
}

// ---------------------------------------------------------------------------
// §47 Robots-directive integrity + 404 noindex (2026-08-16, headless/rendering
// audit row). Two defects found live: (a) proxy.ts (middleware = deterministic
// LAST header writer) overwrote vercel.json's rich X-Robots-Tag with bare
// "index, follow", silently dropping max-snippet:-1 / max-image-preview:large /
// max-video-preview:-1 from every signals page (the apex had them, the subdomain
// did not — AI-Overview extraction length depends on max-snippet); (b) 404 HTML
// carried "index, follow" header + no noindex meta (soft-404 risk).
// [§47, renumbered from §46: the count-free-claims guard landed as §46 the same
// day from a sibling session — this block keeps the unique §47 label.]
// ---------------------------------------------------------------------------
{
  const proxy = read("proxy.ts");
  if (proxy) {
    const full = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    if (!proxy.includes(full)) {
      failures.push(
        `§47 proxy.ts lost the full index robots directive (${full}).\n    file: proxy.ts\n    fix:  keep INDEX_ROBOTS_DIRECTIVE exactly as the vercel.json global directive; middleware is the last writer and a bare "index, follow" silently drops max-snippet:-1 site-wide`,
      );
    }
    const setSites = (proxy.match(/headers\.set\(\s*"X-Robots-Tag"/g) || []).length;
    const helperSites = (proxy.match(/headers\.set\("X-Robots-Tag", robotsDirectiveFor\(pathname\)\)/g) || []).length;
    // Two set-sites in proxy.ts (markdown rewrite + default branch); both must
    // route through robotsDirectiveFor so noindex paths keep their directive.
    if (setSites !== 2 || helperSites !== 2) {
      failures.push(
        `§47 proxy.ts X-Robots-Tag set-sites drifted: ${helperSites}/${setSites} use robotsDirectiveFor(pathname).\n    file: proxy.ts\n    fix:  every X-Robots-Tag set in proxy.ts must use robotsDirectiveFor(pathname) (noindex split + full directive); found ${helperSites} helper calls across ${setSites} set-sites`,
      );
    }
    if (/headers\.set\(\s*"X-Robots-Tag",\s*"index, follow"\s*\)/.test(proxy)) {
      failures.push(
        `§47 proxy.ts sets a literal bare "index, follow" X-Robots-Tag.\n    file: proxy.ts\n    fix:  use robotsDirectiveFor(pathname) so the full directive (max-snippet:-1 etc.) survives the middleware overwrite`,
      );
    }
    // vercel.json is the documented source of the directive; keep both in sync.
    const vercelJson = read("vercel.json");
    if (vercelJson && !vercelJson.includes("max-snippet:-1")) {
      failures.push(
        `§47 vercel.json global X-Robots-Tag lost max-snippet:-1 — proxy.ts INDEX_ROBOTS_DIRECTIVE and the vercel.json header must stay identical.\n    file: vercel.json\n    fix:  restore "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" on the /(.*?) source`,
      );
    }
  }
  const notFound = read("app/not-found.tsx");
  if (notFound && !notFound.includes('<meta name="robots" content="noindex, follow" />')) {
    failures.push(
      `§47 app/not-found.tsx lost its noindex meta tag (404 HTML was indexable HTML with an "index, follow" header).\n    file: app/not-found.tsx\n    fix:  keep the raw <meta name="robots" content="noindex, follow" /> in the component (React 19 hoists it to <head>; not-found.tsx has no Metadata export)`,
    );
  }
}

// ---------------------------------------------------------------------------
// §49 Zero-click wave 5 (2026-08-16): figure-hook titles for the missed gap
// pool. /acquirer/* was the largest un-hooked family (4,455 imps/90d, 0.34%
// CTR at pos 8-13); the biggest-deal figure (WhatsApp $19B, Red Hat $34B,
// VMware $69B) must stay in the title build, not just the count. Signals
// /pricing mirrors the apex price-ladder form. Glama answer carries a
// metaTitle hook.
{
  {
    const s = read("content/acquirers.ts");
    const needles = [
      "const big =",
      "candidates.find((t) => t.length <= 60) || countTitle",
      "Acquisitions: ${big.name} ${amt}",
    ];
    for (const n of needles) {
      if (!s.includes(n)) {
        failures.push(
          `§49 acquirer figure-hook title reverted to count-only form.\n    file: content/acquirers.ts\n    fix:  restore the wave-5 builder (biggest-deal hook, unit-aware num(), 60ch ladder, count fallback): ${n}`,
        );
      }
    }
    // Unit-aware comparator: a bare parseFloat picks $500M over $32B.
    if (s === null || !s.includes("? v * 1000 :")) {
      failures.push(
        `§49 acquirer builder lost the unit-aware amount comparator.\n    file: content/acquirers.ts\n    fix:  keep the K/M/B-aware num(); without it the title cites the wrong "biggest" deal`,
      );
    }
  }
  {
    const s = read("app/pricing/page.tsx");
    if (
      !s.includes("GitDealFlow Pricing: Free Weekly Digest, EUR 49 Dashboard, EUR 197 Insider")
    ) {
      failures.push(
        `§49 signals /pricing title reverted to the generic "Start free" form.\n    file: app/pricing/page.tsx\n    fix:  keep the absolute price-ladder title (mirrors the apex twin that already earns the clicks)`,
      );
    }
  }
  {
    const s = read("content/agent-queries.ts");
    if (!s.includes('metaTitle: "What Is Glama MCP? The npm of AI Servers (A-F Tiers)"')) {
      failures.push(
        `§49 glama answer lost its metaTitle CTR hook.\n    file: content/agent-queries.ts\n    fix:  keep metaTitle on slug what-is-glama-mcp-and-how-do-i-use-it`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// §48 Niche-down index-prune policy (2026-08-16, audit "content pruning 55").
// Ground truth: fresh GSC 90d page-filtered pull (2026-08-16): 200 leaves,
// 109 rows, 828 imps, 1 click; cluster live since 2026-05-22 (86d seasoning).
// Policy (content/niches.ts NICHE_PRUNE_2026_08): KEEP a leaf with clicks>0
// OR imps>=10 OR pos<=30; NOINDEX the rest. Kept 94 leaves carry 91% of leaf
// impressions; pruned 106 carry ZERO clicks. Pages stay LIVE (200, follow);
// they exit only the index (robots meta) and the sitemap. Hub + 20 sector
// hubs always indexable. Re-run quarterly with fresh GSC.
{
  const niches = read("content/niches.ts");
  if (niches === null) {
    failures.push("§48 content/niches.ts missing");
  } else {
    if (!/export const NICHE_PRUNE_2026_08/.test(niches)) {
      failures.push(
        "§48 NICHE_PRUNE_2026_08 set missing from content/niches.ts\n    fix:  restore the index-prune policy (audit content-pruning-55, 2026-08-16)",
      );
    }
    // exact-size canary: a format change or mass un-prune must fail loudly,
    // never pass vacuously on a regex that stopped matching
    const setStart = niches.indexOf("export const NICHE_PRUNE_2026_08");
    const setEnd = niches.indexOf("]);", setStart);
    if (setStart >= 0 && setEnd > setStart) {
      const body = niches.slice(setStart, setEnd);
      const n = (body.match(/"[a-z0-9-]+\/[a-z0-9-]+"/g) || []).length;
      if (n !== 106) {
        failures.push(
          "§48 NICHE_PRUNE_2026_08 size drift: expected 106 entries, found " + n + ".\n    fix:  data-driven policy; refresh the GSC pull, recompute tiers, update the Set AND this count together",
        );
      }
      // malformed slugs must fail the build instead of silently noindexing nothing
      const slugs = body.match(/"([^"]+)"/g) || [];
      const bad = slugs.filter((s) => s.slice(1, -1).split("/").length !== 2);
      if (bad.length > 0) {
        failures.push(
          "§48 NICHE_PRUNE_2026_08 contains malformed slugs (need sector/sub): " + bad.slice(0, 3).join(", "),
        );
      }
    }
    if (!/isNichePruned\(/.test(niches)) {
      failures.push("§48 isNichePruned helper missing from content/niches.ts");
    }
  }

  // leaf template wiring: import + conditional robots noindex
  const leaf = read("app/niche-down/[sector]/[subniche]/page.tsx");
  if (leaf === null) {
    failures.push("§48 app/niche-down/[sector]/[subniche]/page.tsx missing");
  } else {
    for (const needle of ["isNichePruned", "robots: { index: false, follow: true }"]) {
      if (!leaf.includes(needle)) {
        failures.push(
          "§48 leaf template lost the prune wiring (needle: " + needle + ").\n    file: app/niche-down/[sector]/[subniche]/page.tsx\n    fix:  restore import isNichePruned + the conditional robots spread",
        );
      }
    }
    if (!/const pruned = isNichePruned\(sectorSlug, nicheSlug\);/.test(leaf)) {
      failures.push("§48 leaf pruned-variable wiring changed form; update §48 needles");
    }
    if (!/\.\.\.\(pruned \? \{ robots: \{ index: false, follow: true \} \} : \{\}\)/.test(leaf)) {
      failures.push("§48 leaf conditional-robots spread changed form; update §48 needles");
    }
    // pruned pages keep self-canonical (live + canonical, no consolidation)
    if (!leaf.includes("canonical: `/niche-down/${sector.slug}/${niche.slug}`")) {
      failures.push("§48 leaf lost self-canonical (pruned pages stay live+canonical, no redirect consolidation)");
    }
  }

  // sitemap builder: pruned leaves absent, hubs present
  const smRoute = read("app/sitemap/[id]/route.ts");
  if (smRoute === null) {
    failures.push("§48 app/sitemap/[id]/route.ts missing");
  } else {
    if (!smRoute.includes("isNichePruned")) {
      failures.push(
        "§48 sitemap builder lost the prune filter: index-pruned leaves must not be listed",
      );
    }
    if (!/getAllNicheDownPairs\(\)\s*\.filter\(\(\{ sector, subniche \}\) => !isNichePruned\(sector, subniche\)\)/.test(smRoute)) {
      failures.push("§48 sitemap builder filter changed form; update §48 needles (or the filter was removed)");
    }
    if (!smRoute.includes("nicheSectors.map((s) => ({")) {
      failures.push("§48 sitemap sector-hub mapping lost (hubs must stay listed)");
    }
  }
}

// ---------------------------------------------------------------------------
// §49 TOFU pillar cluster (funnel-coverage win, 2026-08-16)
// 10 TOFU pillar posts in content/posts.ts (TOFU_POSTS array), pillar-wired in
// content/pillars.ts. A tree that loses them re-opens the audit item
// "funnel coverage TOFU/MOFU/BOFU 60: TOFU weakest". Guard asserts:
//  (a) all 10 slugs exist in posts.ts inside the TOFU_POSTS array,
//  (b) each body >= 700 words (thin TOFU was the audit complaint),
//  (c) each has >= 3 FAQs (AEO surface),
//  (d) each body carries >= 3 internal links (money-page wiring),
//  (e) no em/en dashes anywhere in the cluster (site-wide style rule),
//  (f) all 10 pillar assignments present in pillars.ts,
//  (g) no link to a known-dead target (/mcp, install-vc-deal-flow post).
// ---------------------------------------------------------------------------
{
  const posts = read("content/posts.ts");
  if (posts) {
    const TOFU_SLUGS = [
      "venture-scout-programs-how-to-join",
      "pre-seed-vs-seed-vs-series-a",
      "what-is-deal-flow-in-venture-capital",
      "investing-in-open-source-startups",
      "vc-signals-signal-vs-noise",
      "emerging-manager-deal-sourcing-playbook",
      "free-vc-data-sources-guide",
      "github-due-diligence-checklist-20-minutes",
      "ai-in-vc-deal-sourcing-practical-guide",
      "how-to-track-startups-before-they-announce",
    ];
    const clusterStart = posts.indexOf("TOFU_POSTS: BlogPost[] = [");
    if (clusterStart === -1) {
      failures.push(
        `§49 content/posts.ts lost the TOFU_POSTS array (10 pillar posts, funnel-coverage win 2026-08-16).\n    file: content/posts.ts\n    fix:  restore the TOFU_POSTS array + allPosts.push(...TOFU_POSTS) splice; do not delete pillar posts to shrink the file`,
      );
    } else {
      // window from cluster start to the closing "];" of TOFU_POSTS
      const windowEnd = posts.indexOf("\n];", clusterStart);
      const cluster = posts.slice(clusterStart, windowEnd);
      const slugRe = /slug:\s*"([^"]+)"/g;
      const found: string[] = [];
      let m: RegExpExecArray | null;
      while ((m = slugRe.exec(cluster)) !== null) found.push(m[1]);
      const missing = TOFU_SLUGS.filter((s) => !found.includes(s));
      if (missing.length) {
        failures.push(
          `§49 TOFU cluster lost post(s): ${missing.join(", ")}.\n    file: content/posts.ts\n    fix:  restore the missing TOFU_POSTS entries (they are pillar-interlinked; partial removal orphans the money-page links)`,
        );
      }
      if (found.length > 10) {
        failures.push(
          `§49 TOFU_POSTS array carries ${found.length} slugs (expected 10): extra entries blur the pillar boundary.\n    file: content/posts.ts\n    fix:  keep TOFU_POSTS to the 10 funnel-coverage posts; new posts go to the main posts array`,
        );
      }
      // per-post body checks: body string literal + word floor + link floor + FAQ floor
      for (const slug of TOFU_SLUGS) {
        const at = cluster.indexOf(`slug: "${slug}"`);
        if (at === -1) continue;
        // find this post's body field (between this slug and the next slug or array end)
        const nextSlug = cluster.indexOf('slug: "', at + 10);
        const seg = cluster.slice(at, nextSlug === -1 ? undefined : nextSlug);
        const bodyMatch = seg.match(/body:\s*"((?:[^"\\]|\\.)*)"/);
        if (!bodyMatch) {
          failures.push(
            `§49 TOFU post ${slug} lost its body field.\n    file: content/posts.ts\n    fix:  restore the post body; a post without body renders empty`,
          );
          continue;
        }
        const body = JSON.parse(`"${bodyMatch[1]}"`) as string;
        const words = body.trim().split(/\s+/).length;
        if (words < 700) {
          failures.push(
            `§49 TOFU post ${slug} body fell to ${words} words (floor 700; thin TOFU was the audit complaint).\n    file: content/posts.ts\n    fix:  restore pillar depth or remove the post entirely; a thin pillar post is index-bloat, not coverage`,
          );
        }
        const links = (body.match(/\]\((\/[^)]+|https:\/\/gitdealflow\.com[^)]*)\)/g) || []).length;
        if (links < 3) {
          failures.push(
            `§49 TOFU post ${slug} carries only ${links} internal links (floor 3; the win is TOFU→money-page wiring).\n    file: content/posts.ts\n    fix:  restore contextual links to /vs/, /answers/, /best/ or /blog/ money pages`,
          );
        }
        if (/]\(\/mcp\)/.test(body) || body.includes("](/blog/install-vc-deal-flow-signal-mcp-in-any-agent-runtime)")) {
          failures.push(
            `§49 TOFU post ${slug} links a dead target (/mcp or the unpublished install post 404 live).\n    file: content/posts.ts\n    fix:  use /agents or /mcp-demo for MCP references`,
          );
        }
        const faqCount = (seg.match(/question:\s*"/g) || []).length;
        if (faqCount < 3) {
          failures.push(
            `§49 TOFU post ${slug} has only ${faqCount} FAQs (floor 3; FAQPage JSON-LD is the AEO surface).\n    file: content/posts.ts\n    fix:  restore the FAQs; they are the answer-engine extraction surface`,
          );
        }
        // style: no em/en dashes inside the post segment (titles, body, faqs)
        if (/[\u2014\u2013]/.test(seg)) {
          failures.push(
            `§49 TOFU post ${slug} contains an em/en dash (site-wide style rule, verify-no-dashes).\n    file: content/posts.ts\n    fix:  replace with commas, colons, or parentheses`,
          );
        }
      }
    }
    // cluster-wide style scan
    if (posts.includes("\u2014") && posts.indexOf("\u2014") > posts.indexOf("TOFU_POSTS")) {
      // only flag if the em dash is inside our cluster window
      const wEnd = posts.indexOf("\n];", posts.indexOf("TOFU_POSTS"));
      const wStart = posts.indexOf("TOFU_POSTS");
      if (wStart !== -1 && wEnd !== -1 && posts.slice(wStart, wEnd).includes("\u2014")) {
        failures.push(
          `§49 TOFU cluster contains an em dash (verify-no-dashes blocks HEAD anyway; this names the cluster).\n    file: content/posts.ts\n    fix:  strip em dashes from the TOFU_POSTS window`,
        );
      }
    }
    // pillars wiring
    const pillarsSrc = read("content/pillars.ts");
    if (pillarsSrc) {
      const needed: Array<[string, string]> = [
        ["venture-scout-programs-how-to-join", "venture-scouting"],
        ["pre-seed-vs-seed-vs-series-a", "deal-sourcing-workflow"],
        ["what-is-deal-flow-in-venture-capital", "deal-flow-management"],
        ["investing-in-open-source-startups", "alternative-data"],
        ["vc-signals-signal-vs-noise", "github-signals-methodology"],
        ["emerging-manager-deal-sourcing-playbook", "deal-sourcing-workflow"],
        ["free-vc-data-sources-guide", "alternative-data"],
        ["github-due-diligence-checklist-20-minutes", "startup-due-diligence"],
        ["ai-in-vc-deal-sourcing-practical-guide", "deal-sourcing-workflow"],
        ["how-to-track-startups-before-they-announce", "deal-sourcing-workflow"],
      ];
      for (const [slug, pillar] of needed) {
        const needle = `"${slug}": "${pillar}"`;
        if (!pillarsSrc.includes(needle)) {
          failures.push(
            `§49 pillars.ts lost the pillar assignment ${needle}.\n    file: content/pillars.ts\n    fix:  restore the assignment; unwired posts lose articleSection, pillar related-posts, and topics-page grouping`,
          );
        }
      }
    }
  }
}



// ---------------------------------------------------------------------------
// §50 Static-page mesh links (2026-08-19, audit item "programmatic internal
// linking"): public/ statics (learn, free, tools, sectors, guide, network,
// stats) cannot import the RelatedLinks graph, so
// scripts/build-static-mesh-links.mjs injects a curated "Related resources"
// block from data/static-mesh-links.json into each serving file. Guard fails
// closed on any serving static that loses the block or a curated link.
{
  const manifestRaw = read("data/static-mesh-links.json");
  if (manifestRaw === null) {
    failures.push(
      `§50 static mesh manifest missing.\n    file: data/static-mesh-links.json\n    fix: restore the committed manifest (30 static URLs)`,
    );
  } else {
    let manifest: Record<string, string[]> = {};
    try {
      manifest = JSON.parse(manifestRaw) as Record<string, string[]>;
    } catch {
      failures.push(
        `§50 static mesh manifest is not valid JSON.\n    file: data/static-mesh-links.json`,
      );
    }
    for (const [path, hrefs] of Object.entries(manifest)) {
      const rel = path.replace(/^\//, "");
      const s = read(`public/${rel}/index.html`) ?? read(`public/${rel}.html`);
      if (s === null) {
        failures.push(
          `§50 static mesh: no serving file for ${path}.\n    fix: restore public/${rel}/index.html (or ${rel}.html) and run node scripts/build-static-mesh-links.mjs`,
        );
        continue;
      }
      if (!s.includes('data-mesh="v2"')) {
        failures.push(
          `§50 static mesh block missing on ${path}.\n    fix: node scripts/build-static-mesh-links.mjs`,
        );
        continue;
      }
      const start = s.indexOf("<!--MESH:v2:START-->");
      const end = s.indexOf("<!--MESH:v2:END-->");
      const block = start >= 0 && end > start ? s.slice(start, end) : "";
      const count = (block.match(/href="\//g) || []).length;
      if (count < 5) {
        failures.push(
          `§50 static mesh on ${path} has only ${count} internal links (floor 5).\n    fix: extend the manifest entry in data/static-mesh-links.json`,
        );
      }
      for (const h of hrefs) {
        if (!s.includes(`href="${h}"`)) {
          failures.push(
            `§50 static mesh on ${path} lost curated link ${h}.\n    fix: node scripts/build-static-mesh-links.mjs`,
          );
        }
      }
      if (/[—–]/.test(block)) {
        failures.push(
          `§50 static mesh on ${path} contains an em/en dash.\n    fix: clean the manifest labels or target titles, then re-run node scripts/build-static-mesh-links.mjs`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 51. Landing claim lock (2026-08-16 user decision). Canonical panel claim =
//     "350+ startups/orgs across 15 sectors" (stable floor). "400+" and exact
//     counts (369/411) as CURRENT size are BANNED on all landing surfaces:
//     398 deduped unique orgs < 400, so "400+" overclaims, and exact counts
//     break on weekly panel churn. Re-introduced 08-16 via a stale deploy +
//     unswept generators; this guard makes such a tree undeployable.
//     Exempt: third-party product claims ("400+ integrations" for n8n) and
//     the frozen blog slug i-tracked-369- (URL identifier, not a count).
// ---------------------------------------------------------------------------
{
  const BANNED = [
    "400+ startups",
    "400+ venture-backed",
    "400+ startup",
    "400+ tracked",
    "400+ orgs",
    "Tracks 400+",
    "369 startups",
    "411 startups",
  ];
  const EXTS = new Set([".html", ".py", ".txt", ".md", ".json", ".xml"]);
  const SKIP = new Set([".vercel", ".git", "node_modules", ".DS_Store"]);
  const walk = (dir: string, out: string[] = []): string[] => {
    let names: string[];
    try {
      names = readdirSync(dir);
    } catch {
      return out;
    }
    for (const name of names) {
      if (SKIP.has(name)) continue;
      const p = join(dir, name);
      let isDir = false;
      try {
        isDir = statSync(p).isDirectory();
      } catch {
        continue;
      }
      if (isDir) walk(p, out);
      else if (EXTS.has(extname(name).toLowerCase())) out.push(p);
    }
    return out;
  };
  const landingRoot = join(ROOT, "..", "landing");
  if (existsSync(landingRoot)) {
    for (const p of walk(landingRoot)) {
      let s: string;
      try {
        s = readFileSync(p, "utf8");
      } catch {
        continue;
      }
      for (const banned of BANNED) {
        if (s.includes(banned)) {
          failures.push(
            `§51 landing claim lock: banned panel claim "${banned}" (canonical = "350+ / 15 sectors", user lock 2026-08-16).\n    file: ${p}\n    fix:  sweep to "350+" (panel) or the product-tier truth (pricing Dashboard = 140+); see AGENTS.md "Canonical claims (LOCKED)"`,
          );
          break; // one failure per file is enough
        }
      }
    }
    // pricing tier truth: the Dashboard product line must stay product-accurate
    const pricing = read("../../../landing/pricing.html");
    if (pricing && !pricing.includes("140+ startups, 15 sectors")) {
      failures.push(
        `§51 pricing Dashboard tier lost the product-truth line "140+ startups, 15 sectors".\n    file: landing/pricing.html\n    fix:  restore the tier line; the paid Dashboard field is ~140 startups, NOT the 350+ panel`,
      );
    }
  }
  // pSEO static surfaces (public/guide/* etc.) obey the SAME claim lock. The
  // landing walk above only covers the gitdealflow.com static tree; the
  // Next.js public/ dir is a separate surface and leaked "400+ startup orgs"
  // into two guide pages uncaught until 2026-08-16. Sweep it here too.
  const publicRoot = join(ROOT, "public");
  if (existsSync(publicRoot)) {
    for (const p of walk(publicRoot)) {
      let s: string;
      try {
        s = readFileSync(p, "utf8");
      } catch {
        continue;
      }
      for (const banned of BANNED) {
        if (s.includes(banned)) {
          failures.push(
            `§51 pSEO static claim lock: banned panel claim "${banned}" (canonical = "350+ / 15 sectors", user lock 2026-08-16).\n    file: ${p}\n    fix:  sweep to "350+" (panel); see AGENTS.md "Canonical claims (LOCKED)"`,
          );
          break; // one failure per file is enough
        }
      }
    }
  }
}

// §52 MOFU hubs (2026-08-16, audit "content gaps 45"): two missing
// middle-of-funnel hubs from the gap-keywords autocomplete mine.
// /answers/best-startup-database targets the "startup database" family
// (best startup database / startup database API / startup database free /
// VC startup database / Crunchbase alternative free); /answers/deal-flow-crm
// targets "deal flow crm" / "vc deal flow crm". Both must keep the direct
// answer, the HowTo steps, the 5 FAQs, and the family head terms.
{
  {
    const s = read("content/agent-queries.ts");
    const needles: Array<[string, string]> = [
      ['slug: "best-startup-database"', "best-startup-database entry missing"],
      ['slug: "deal-flow-crm"', "deal-flow-crm entry missing"],
            // NOTE (2026-08-16): needle corrected, the leading quote was a typo in\n      // the original commit; the definition string in agent-queries.ts never\n      // carried a quote before "Crunchbase" (live text verified at the\n      // best-startup-database entry, definition field).\n      ['Crunchbase Pro ($49/month) is the broadest', "database definition reverted"],
      ['"A deal flow CRM is pipeline software', "CRM definition reverted"],
      ['"What is the best free startup database?"', "database FAQ head question lost"],
      ['"Do solo angels need a deal flow CRM?"', "CRM FAQ head question lost"],
      ['name: "Define the coverage you need"', "database HowTo steps reverted"],
      ['name: "Pick the shape: native CRM, flexible CRM, or DIY board"', "CRM HowTo steps reverted"],
      ['"best startup database"', "database keywords lost the family head term"],
      ['"deal flow CRM"', "CRM keywords lost the family head term"],
      ['ctaUrl: "/dataset"', "database CTA reverted"],
      ['ctaUrl: "/compare/gitdealflow-vs-affinity-for-discovery-vs-crm"', "CRM CTA reverted"],
    ];
    for (const [needle, msg] of needles) {
      if (s === null || !s.includes(needle)) {
        failures.push(
          `§52 MOFU hub: ${msg}\n    file: content/agent-queries.ts\n    fix: restore the entry (audit content-gaps-45, 2026-08-16): ${needle}`,
        );
      }
    }
  }
}


// 54. Research-paper cluster noindex machinery (audit: search-intent match
//     42, "if CTR stays ~0, noindex the pure-bibliography leaves"). Ground
//     truth 08-16: 28d = 20,085 imps / 3 clicks / 0.015% CTR (pre-lede). The
//     investor lede went live 08-15 evening; verdict = post-lede CTR.
//     This guard pins the MACHINERY (all three layers wired to the single
//     policy file), not the decision. Decision = "retain" today; the
//     evaluator cron flips it on the pre-registered rule (>= 3000 post-lede
//     imps AND < 0.20% CTR -> noindex, keepIndexable leaves exempt). A tree
//     missing any layer is undeployable in BOTH states, so the flip can
//     never land half-wired.
// ---------------------------------------------------------------------------
{
  const policy = read("content/research-paper-policy.ts");
  if (!policy) {
    failures.push(
      `§54 research-paper policy: content/research-paper-policy.ts is missing.\n    fix:  restore it from git; the noindex decision cannot be data-driven without it`,
    );
  } else {
    // Policy file must carry the pre-registered rule + both keepIndexable
    // leaves (DORA = methodology lineage; Vaswani = §37 hub-bridge href).
    // NOTE: the decision field itself is validated as EITHER state (the
    // evaluator cron flips it on GSC data; the guard pins the machinery,
    // not the state, or the flip could never deploy).
    for (const needle of [
      "minImpressions: 3000",
      "maxCtr: 0.002",
      '"forsgren-2018-accelerate-dora-research"',
      '"vaswani-2017-attention-is-all-you-need"',
    ]) {
      if (!policy.includes(needle)) {
        failures.push(
          `§54 research-paper policy lost needle "${needle}".\n    file: content/research-paper-policy.ts\n    fix:  restore the pre-registered rule / keepIndexable set (evaluator cron + guard depend on the exact literals)`,
        );
      }
    }
    if (!/decision: "(retain|noindex)",/.test(policy)) {
      failures.push(
        `§54 research-paper policy lost the decision field (must be "retain" or "noindex").\n    fix:  restore the decision literal; only the evaluator cron may change it`,
      );
    }
    if (/"retain"\s*\|\s*"noindex"/.test(policy) === false) {
      failures.push(
        `§54 research-paper policy lost the ResearchPaperDecision union ("retain" | "noindex").\n    fix:  restore the type union; a single-state policy cannot be flipped`,
      );
    }
    // Layer 1: leaf metadata robots wired to the policy.
    const leaf = read("app/research-paper/[slug]/page.tsx");
    if (
      !leaf ||
      !leaf.includes("researchPaperLeafIndexable") ||
      !leaf.includes("{ index: false, follow: true }")
    ) {
      failures.push(
        `§54 research-paper leaf metadata not wired to the policy.\n    file: app/research-paper/[slug]/page.tsx\n    fix:  restore robots: researchPaperLeafIndexable(slug) ? index : noindex,follow in generateMetadata`,
      );
    }
    // Layer 2: proxy X-Robots-Tag slug-driven noindex wired.
    const proxy = read("proxy.ts");
    if (
      !proxy ||
      !proxy.includes("researchPaperLeafNoindexByPath") ||
      !proxy.includes("researchPaperNoindex(pathname)")
    ) {
      failures.push(
        `§54 proxy.ts lost the research-paper slug-driven noindex hook.\n    fix:  restore researchPaperNoindex() + the shouldNoindex delegation in proxy.ts`,
      );
    }
    // Layer 3: sitemap membership filtered by the policy.
    const sitemap = read("app/sitemap/[id]/route.ts");
    if (
      !sitemap ||
      !sitemap.includes("researchPaperLeafIndexable") ||
      !sitemap.includes(".filter((slug) => researchPaperLeafIndexable(slug))")
    ) {
      failures.push(
        `§54 sitemap content-shard lost the research-paper indexability filter.\n    file: app/sitemap/[id]/route.ts\n    fix:  restore .filter((slug) => researchPaperLeafIndexable(slug)) on the leaf spread`,
      );
    }
    // keepIndexable entries must be REAL slugs (guards against typos in the
    // exempt set: a typo silently noindexes a keep-leaf on flip, or worse,
    // exempts nothing).
    const papers = read("content/research-papers.ts");
    if (papers) {
      for (const slug of [
        "forsgren-2018-accelerate-dora-research",
        "vaswani-2017-attention-is-all-you-need",
      ]) {
        if (!papers.includes(`slug: "${slug}"`)) {
          failures.push(
            `§54 keepIndexable slug "${slug}" does not exist in content/research-papers.ts.\n    fix:  correct the slug in content/research-paper-policy.ts`,
          );
        }
      }
    }
  }
}


// ---------------------------------------------------------------------------
// 55. Sitemap zero-impression prune (2026-08-16, audit items "technical SEO",
//     "index-bloat control", "content pruning at scale"): 474 leaf URLs with
//     ZERO GSC impressions/clicks over 90d leave the sitemaps. Prune =
//     sitemap removal ONLY (pages stay live, internally linked, crawlable;
//     same convention as §48 niche-down). content/pruned-pages.ts is the
//     generated source of truth (scripts/build-pruned-pages.ts); the [id]
//     shard route and sitemap.txt must consume it or the index re-inflates.
// ---------------------------------------------------------------------------
{
  const src = read("content/pruned-pages.ts");
  const gen = read("scripts/build-pruned-pages.ts");
  const shard = read("app/sitemap/[id]/route.ts");
  const txt = read("app/sitemap.txt/route.ts");
  if (src === null) {
    failures.push(
      `§55 pruned-pages module missing.\n    file: content/pruned-pages.ts\n    fix: run npx tsx scripts/build-pruned-pages.ts from pseo-site`,
    );
  } else {
    if (
      !src.includes("PRUNED_PAGE_PATHS") ||
      !src.includes("isPagePruned") ||
      !src.includes("PRUNE_COUNT")
    ) {
      failures.push(
        `§55 pruned-pages module lost its exports.\n    fix: restore content/pruned-pages.ts (generated by scripts/build-pruned-pages.ts)`,
      );
    }
    const m = /PRUNE_COUNT\s*=\s*(\d+)/.exec(src);
    const count = m ? Number(m[1]) : 0;
    if (count < 350 || count > 700) {
      failures.push(
        `§55 PRUNE_COUNT ${count} outside the 350..700 band.\n    fix: re-run npx tsx scripts/build-pruned-pages.ts and inspect the family split`,
      );
    }
    const IN_SET = [
      "/city/athens",
      "/stage/growth/agtech",
      "/signals/deploy-frequency-spike/data-infrastructure",
      "/startup/3d-vision-world",
      "/trends/agtech-q1-2026-vs-q4-2025",
    ];
    for (const p of IN_SET) {
      if (!src.includes(`"${p}"`)) {
        failures.push(
          `§55 prune canary ${p} missing from PRUNED_PAGE_PATHS.\n    fix: re-run the generator; a stale generated file must not deploy`,
        );
      }
    }
    const NOT_IN = [
      "/",
      "/ja",
      "/vs/harmonic-ai-vs-pitchbook",
      "/startups",
      "/research-paper",
      "/answers/how-to-find-startups-before-they-fundraise",
      "/summit",
      "/blog/i-tracked-369-startup-github-orgs-six-months",
      "/blog/free-vc-data-sources-guide",
      "/signals/define/contributor-growth",
    ];
    for (const p of NOT_IN) {
      if (src.includes(`"${p}"`)) {
        failures.push(
          `§55 protected path ${p} must never be pruned.\n    fix: re-run the generator (protection lists regressed)`,
        );
      }
    }
    const young = /2026-08|2026-w3\d|-q3-2026/;
    const pathRe = /"(\/[^"]+)"/g;
    let pm: RegExpExecArray | null;
    while ((pm = pathRe.exec(src)) !== null) {
      if (young.test(pm[1])) {
        failures.push(
          `§55 young path ${pm[1]} in PRUNED_PAGE_PATHS.\n    fix: re-run the generator (young-token guard regressed)`,
        );
      }
    }
  }
  if (gen === null) {
    failures.push(
      `§55 prune generator script missing.\n    file: scripts/build-pruned-pages.ts\n    fix: restore it from git history`,
    );
  }
  if (shard === null || !shard.includes("isPagePruned")) {
    failures.push(
      `§55 sitemap shard route must consume isPagePruned.\n    file: app/sitemap/[id]/route.ts\n    fix: re-apply the §55 filter after the render-time dedupe`,
    );
  }
  if (txt === null || !txt.includes("isPagePruned")) {
    failures.push(
      `§55 sitemap.txt route must consume isPagePruned.\n    file: app/sitemap.txt/route.ts\n    fix: re-apply the §55 filter at render`,
    );
  }
  const proxy = read("proxy.ts");
  if (proxy === null) {
    failures.push(
      `§55b proxy.ts missing (prune noindex).\n    file: proxy.ts\n    fix: restore it from git history`,
    );
  } else if (!proxy.includes("isPagePruned(pathname)")) {
    failures.push(
      `§55b proxy.ts shouldNoindex no longer delegates to isPagePruned(pathname).\n    file: proxy.ts\n    fix: add isPagePruned(pathname) to shouldNoindex() so pruned pages get X-Robots-Tag: noindex, follow (not just sitemap removal)`,
    );
  }
}

// ---------------------------------------------------------------------------
// §56 Claim reconciliation (2026-08-16, audit "claim consistency" win #6).
// The canonical panel-size claim is the STABLE FLOOR "350+" (user decision,
// AGENTS.md + CLAIMS-LEDGER.md). Raw sector-sum row counts (411, 540) drift
// weekly and OVERSTATE the deduped unique-org count (< 400), so any surface
// that states panel size must use the floor, never a raw/computed count.
// Banned tokens: 400+, ~400, 4,200+/4,800 orgs, exact counts as claims
// (369, 411, 540). Live data readouts (API meta, per-sector tables, sourced
// claim rows) are exempt: they are data, not marketing claims.
// ---------------------------------------------------------------------------
{
  // 1. The canonical-claims module must exist with the locked floor + guard fn.
  const cc = readFileSync(join(ROOT, "lib", "canonical-claims.ts"), "utf8");
  if (!cc.includes('export const PANEL_CLAIM = "350+"') || !cc.includes("export function panelClaimFloor")) {
    failures.push(
      "§56 lib/canonical-claims.ts lost the locked claim floor (PANEL_CLAIM / panelClaimFloor).\n    file: lib/canonical-claims.ts\n    fix:  restore 350+ floor + panelClaimFloor(); user-locked 2026-08-16, see AGENTS.md",
    );
  }

  // 2. Claim surfaces must phrase panel size via the floor.
  const claimSurfaces: Array<[string, string]> = [
    ["app/page.tsx", "panelClaimFloor(totalTracked)"],
    ["app/llms.txt/route.ts", "panelClaimFloor(totalStartups)"],
    ["app/llms-full.txt/route.ts", "panelClaimFloor(totalStartups)"],
    ["app/md/route.ts", "panelClaimFloor(totalStartups)"],
    ["app/md/[...path]/route.ts", "panelClaimFloor(totalStartups)"],
    ["app/startups/page.tsx", "PANEL_CLAIM"],
    ["app/startups/region/page.tsx", "PANEL_CLAIM"],
    ["scripts/generate-signal-report.ts", "panelClaim = allStartups.length >= 350"],
    ["scripts/generate-signal-digest-email.ts", "panelClaim = allStartups.length >= 350"],
  ];
  for (const [file, needle] of claimSurfaces) {
    const src = readFileSync(join(ROOT, file), "utf8");
    if (!src.includes(needle)) {
      failures.push(
        `§56 ${file} dropped the claim-floor phrasing (${needle}).\n    file: ${file}\n    fix:  restore lib/canonical-claims usage; panel size is the locked 350+ floor, never the raw sector-sum`,
      );
    }
  }

  // 3. No banned exact-count tokens in claim copy. Anchored on claim language
  //    so live-data readouts stay exempt; this file is self-exempt.
  const bannedExact = /\b(?:400\+|~400|4,200\+|4,800)\s+(?:venture-backed\s+)?(?:startup|org|tracked|GitHub)/i;
  const bannedClaimCtx = /(?:tracks?|across|of|von)\s+(?:400\+|369|411|540)\s+(?:startups?|orgs?|Unternehmen)/i;
  const bannedHits: string[] = [];
  function scanClaims(relDir: string) {
    const abs = join(ROOT, relDir);
    if (!existsSync(abs)) return;
    for (const ent of readdirSync(abs)) {
      const rel = join(relDir, ent);
      const absEnt = join(ROOT, rel);
      if (statSync(absEnt).isDirectory()) {
        scanClaims(rel);
      } else if ([".ts", ".tsx", ".md", ".json", ".html", ".js", ".mjs"].includes(extname(ent)) && ent !== "verify-no-regressions.ts") {
        const src = readFileSync(absEnt, "utf8");
        if (bannedExact.test(src) || bannedClaimCtx.test(src)) {
          bannedHits.push(rel);
        }
      }
    }
  }
  scanClaims("app");
  scanClaims("content");
  scanClaims("lib");
  scanClaims("components");
  scanClaims("scripts");
  if (bannedHits.length) {
    failures.push(
      `§56 banned exact-count panel claims found in: ${bannedHits.join(", ")}\n    file: (multiple)\n    fix:  replace with the locked 350+ floor (lib/canonical-claims.ts); live data readouts are exempt`,
    );
  }

  // 4. The committed weekly-report copy must not carry a stale claim while it
  //    sits in the tree between deploys (prebuild regenerates it anyway).
  try {
    const srl = readFileSync(join(ROOT, "content", "signal-report-latest.ts"), "utf8");
    if (/Data from 400\+ tracked startups|Data from 4[0-9]{2} tracked startups|across 20 sectors showed measurable/.test(srl)) {
      failures.push(
        "§56 content/signal-report-latest.ts carries a banned/stale panel claim (exact count or 20 sectors).\n    file: content/signal-report-latest.ts\n    fix:  re-run npx tsx scripts/generate-signal-report.ts (prebuild does this on every deploy)",
      );
    }
  } catch {
    // file absent = fine, prebuild regenerates it
  }
}


// §57 CTR wave 6b (2026-08-16): portfolio count hooks, 3 founder handles,
// 5 answers metaTitles, 11 hub titles, 2 startup-idea titles. Every figure
// derives from the same content files (portfolio length, public roles, page
// copy), never invented. Fails closed if any lineage reverts a wave-6b title.
{
  {
    const pf = read("../app/fund/[slug]/portfolio/page.tsx");
    if (pf) {
      for (const needle of [
        "Portfolio: ${nCompanies} Tracked",
        "title: { absolute: title }",
        "nCompanies === 1 ? \"company\" : \"companies\"",
      ]) {
        if (!pf.includes(needle)) {
          failures.push(
            `§57 portfolio title hook reverted (missing needle: ${needle.slice(0, 60)}...).\n    file: app/fund/[slug]/portfolio/page.tsx\n    fix:  restore the wave-6b count hook + absolute title + plural fix`,
          );
        }
      }
      if (pf.includes("Portfolio, Companies We Track")) {
        failures.push(
          `§57 portfolio title regressed to the generic form.\n    file: app/fund/[slug]/portfolio/page.tsx\n    fix:  restore the wave-6b count-hook title`,
        );
      }
    }
    const founders = read("../content/founders.ts");
    if (founders) {
      for (const needle of [
        'tj: "TJ Holowaychuk (@tj): Express.js Author"',
        '"transitive-bullshit": "Travis Fischer (@transitive-bullshit): Agentic Founder"',
        'ezyang: "Edward Z. Yang (@ezyang): PyTorch Core Engineer"',
      ]) {
        if (!founders.includes(needle)) {
          failures.push(
            `§57 founder handle hook lost (missing needle: ${needle.slice(0, 60)}...).\n    file: content/founders.ts\n    fix:  restore the wave-6b founder handles`,
          );
        }
      }
    }
    const answers = read("content/agent-queries.ts");
    if (answers) {
      for (const needle of [
        "metaTitle: `Best VC Deal Sourcing Tools: 3-Bucket Stack ${FRESH_YEAR_STR}`",
        "metaTitle: `How Angels Use GitHub Signals: No Code Needed ${FRESH_YEAR_STR}`",
        "metaTitle: `Find Stealth Startups: 5 Public Signals ${FRESH_YEAR_STR}`",
        "metaTitle: `Best VC Deal Flow Software by Fund Size ${FRESH_YEAR_STR}`",
        // 2026-08-17: "AI Investing Tools: 4 Categories Compared" removed — its slug
        // (ai-investing-tools-2026) was pruned to 404 by the 08-16 zero-imp leaf
        // prune; the needle would permanently fail on a page that no longer exists.
      ]) {
        if (!answers.includes(needle)) {
          failures.push(
            `§57 answers metaTitle hook lost: ${needle.slice(9, 60)}...\n    file: content/agent-queries.ts\n    fix:  restore the wave-6b metaTitle on the matching answers entry`,
          );
        }
      }
    }
    const hubNeedles: Array<[string, string]> = [
      ["app/founder/page.tsx", "33 Founders: Public Engineering Profiles ${FRESH_YEAR_STR}"],
      ["app/integrations/page.tsx", "Integrations: MCP, Telegram, Email, RSS, Free API ${FRESH_YEAR_STR}"],
      ["app/wikipedia/page.tsx", "Wikipedia Citation Helper: Ready Citations"],
      ["app/citations/page.tsx", "Citations: The Cross-Graph Identity Map"],
      ["app/predicted/page.tsx", "10 Predicted Breakouts Weekly, Graded at 60 Days ${FRESH_YEAR_STR}"],
      ["app/developers/page.tsx", "Developers: Free Deal Flow API, MCP, JSON & CSV ${FRESH_YEAR_STR}"],
      ["app/standards/page.tsx", "Standards: Schema.org, OpenAPI 3.1, MCP, A2A, FAIR ${FRESH_YEAR_STR}"],
      ["app/data-sources/page.tsx", "Data Sources: GitHub API, Enrichment, Cadence ${FRESH_YEAR_STR}"],
      ["app/alternatives/page.tsx", "Alternatives to Harmonic.ai, Dealroom, Crunchbase ${FRESH_YEAR_STR}"],
      ["app/predict/page.tsx", "Predict Startup Breakouts: Free Signal, 2 Seconds ${FRESH_YEAR_STR}"],
      ["app/startup-ideas/page.tsx", "52 Startup Ideas ${FRESH_YEAR_PLAIN}: Buildable, Live Repos"],
      ["app/blog/page.tsx", "VC Deal Flow Blog: GitHub Signals & Startup Data ${FRESH_YEAR_STR}"],
      ["app/answers/page.tsx", "98 Citation-Ready Answers on VC Deal Flow ${FRESH_YEAR_STR}"],
    ];
    for (const [path, needle] of hubNeedles) {
      const src = read(`../${path}`);
      if (src && !src.includes(needle)) {
        failures.push(
          `§57 hub title hook reverted.\n    file: ${path}\n    fix:  restore the wave-6b title "${needle}"`,
        );
      }
    }
    const ideas = read("../content/startup-ideas.ts");
    if (ideas) {
      for (const needle of [
        'title: "Open-Source Funding Platforms: 3 Repos"',
        'title: "AI Code Review: Under 3 Comments per PR"',
      ]) {
        if (!ideas.includes(needle)) {
          failures.push(
            `§57 startup-idea title hook lost (missing needle: ${needle.slice(0, 60)}...).\n    file: content/startup-ideas.ts\n    fix:  restore the wave-6b idea titles`,
          );
        }
      }
    }
  }
}

// §59 Price-ladder + stale-era panel-count drift (2026-08-16, audit follow-up).
// Live truth (api/v1/pricing.json): Dashboard €49/mo, Insider €197/mo; the
// €9.97/€97 founding rates closed 2026-06-30 (grandfathered for life). Agent
// surfaces (llms.txt, llms-full), API strings, and current-offer funnel pages
// quote the CURRENT ladder. Historical/grandfathering narrative is exempt.
{
  {
    const priceNeedles: Array<[string, string]> = [
      ["../app/llms.txt/route.ts", "€49/mo Dashboard, €197/mo Insider Circle"],
      ["../app/llms-full.txt/route.ts", "Dashboard, €49/month"],
      ["../app/alternatives/page.tsx", "&euro;49/mo Dashboard"],
      ["../app/api/scout/predict/route.ts", "EUR 49/mo"],
      ["../app/api/webhook/stripe/route.ts", "&euro;49/mo"],
      ["../app/start-here/page.tsx", 'price: "€49/mo"'],
      ["../app/vsl/page.tsx", "€49/mo</p>"],
      ["../app/pitch/page.tsx", "350+ startups, 15 sectors"],
      ["../app/code-side-sourcing/page.tsx", "350+ ranked orgs"],
      ["../app/page.tsx", "claim: `${panelClaim} startup signals across"],
      ["../app/opengraph-image.tsx", "panelClaimFloor(totalStartups)"],
      ["../app/llms.txt/route.ts", "the 350+ ranked startups"],
    ];
    for (const [path, needle] of priceNeedles) {
      const src = read(path);
      if (src && !src.includes(needle)) {
        failures.push(
          `§59 current-price/panel needle missing: ${needle.slice(0, 50)} in ${path}.\n    fix:  restore the 2026-08-16 price-ladder sweep (Dashboard €49/mo, Insider €197/mo, founding closed 2026-06-30)`,
        );
      }
    }
    const priceBans: Array<[string, RegExp]> = [
      ["../content/agent-queries.ts", /EUR 19\/mo|EUR 19\/month|100-1000x/],
      ["../content/standalone-faqs.ts", /EUR 19\/mo|EUR 19\/month|100-1000×/],
      ["../app/llms.txt/route.ts", /€9\.97\/mo Dashboard|€97\/mo Insider/],
      ["../app/llms-full.txt/route.ts", /Paid \(€9\.97\/mo Dashboard\)/],
      ["../app/api/scout/predict/route.ts", /EUR 9\.97\/mo/],
      ["../app/api/webhook/stripe/route.ts", /&euro;9\.97\/mo is locked in forever/],
      ["../app/tweet-teardown/thanks/page.tsx", /four thousand two hundred/],
      ["../app/pitch/page.tsx", /140 startups/],
      ["../app/code-side-sourcing/page.tsx", /109\+ ranked orgs/],
      ["../app/page.tsx", /\$\{totalTracked\} startup signals/],
      ["../app/opengraph-image.tsx", /\{totalStartups\}\+/],
      ["../app/llms.txt/route.ts", /140 ranked startups/],
      ["../app/research/[slug]/page.tsx", /20\+ startup sectors/],
      ["../content/comparisons.ts", /20 startup sectors/],
      ["../content/comparisons.ts", /EUR 9\.97\/month/],
      ["../app/integrations/page.tsx", /140 ranked/],
      ["../app/api/v1/pricing.json/route.ts", /140 ranked/],
      ["../app/origin/your-journey/page.tsx", /140 ranked/],
      ["../app/alternatives/[slug]/page.tsx", /140 ranked/],
      ["../app/data-sources/page.tsx", /140 ranked/],
      ["../app/pricing/page.tsx", /140 ranked/],
      ["../content/vsl-script.json", /140 ranked/],
      ["../content/standalone-faqs.ts", /140 ranked/],
      ["../content/use-cases.ts", /140 ranked/],
      ["../content/comparisons.ts", /140 ranked/],
      ["../components/HomeOfferStack.tsx", /140 ranked/],
    ];
    for (const [path, rx] of priceBans) {
      const src = read(path);
      if (src && rx.test(src)) {
        failures.push(
          `§59 stale price/era-count token in ${path} (${rx.source}).\n    fix:  current ladder is €49/mo Dashboard / €197/mo Insider; founding closed 2026-06-30; panel claim is 350+`,
        );
      }
    }
  }
}





  // §58 wave-6 title hooks (2026-08-16, union w/ §57 wave-6b): founder role hooks, signal
  // momentum verdicts, fund stage hooks, 3 answers metaTitles, 3 hub
  // titles. All strings are derived from the same content files' public
  // fields (role/affiliation/momentum/stage/page copy), never invented
  // figures. Fails closed if any lineage reverts a wave-6 title.
  {
    const answers = read("content/agent-queries.ts");
    if (answers) {
      for (const needle of [
        "metaTitle: `Best MCP Servers for VC Research: 4 Are Free ${FRESH_YEAR_STR}`",
        "metaTitle: \"Best PitchBook Alternative for Solos: Under EUR 150/mo\"",
        "metaTitle: `How to Add an MCP Server to Cursor: 3 Steps ${FRESH_YEAR_STR}`",
      ]) {
        if (!answers.includes(needle)) {
          failures.push(
            `§58 answers metaTitle hook lost: ${needle.slice(9, 60)}...\n    file: content/agent-queries.ts\n    fix:  restore the wave-6 metaTitle on the matching answers entry`,
          );
        }
      }
    }
    const hubNeedles: Array<[string, string]> = [
      ["app/wins/page.tsx", "Underwriting Receipts: Validated GitHub Signals Ledger (2026)"],
      ["app/reproducibility/page.tsx", "Reproducibility: Open Data, Verifiable Methods"],
    ];
    for (const [path, needle] of hubNeedles) {
      const src = read(`../${path}`);
      if (src && !src.includes(needle)) {
        failures.push(
          `§58 hub title hook reverted.\n    file: ${path}\n    fix:  restore the wave-6 title "${needle}"`,
        );
      }
    }
    const leaderboard = read("../app/affiliates/leaderboard/page.tsx");
    if (leaderboard && leaderboard.includes("(May 2026)")) {
      failures.push(
        `§58 affiliate leaderboard title carries the stale month again.\n    file: app/affiliates/leaderboard/page.tsx\n    fix:  keep "(2026)" (dynamic-ish); "(May 2026)" decays within weeks`,
      );
    }
    // 2026-08-17 regression repair: sibling 9d659655 (citable-stat sweep) reverted
    // the wave-6 /signal/ momentum conditional on 62 accelerating profiles; nothing
    // asserted companies.ts so the revert shipped silently. These needles pin the
    // restored conditional so any future lineage that drops it fails the build.
    const companies = read("content/companies.ts");
    if (companies) {
      for (const needle of [
        'c.momentum === "accelerating"',
        '`${c.name} GitHub Engineering Signals: Accelerating`.length <= 60',
        '? ": Accelerating"',
      ]) {
        if (!companies.includes(needle)) {
          failures.push(
            `§58 /signal/ momentum title conditional reverted (missing needle: ${needle.slice(0, 50)}...).\n    file: content/companies.ts\n    fix:  restore the wave-6 conditional suffix (62 accelerating profiles lost it once via 9d659655)`,
          );
        }
      }
    }
  }

// §56 "How VCs source deals" cluster (topical-authority win, 2026-08-16)
// 10 sourcing-cluster posts in content/posts-sourcing-cluster.ts, spliced into
// allPosts and pillar-wired in content/pillars.ts. Closes the audit item
// "topical authority 48: deep on the GitHub-signals island, thin across the
// wider VC-sourcing topic graph". Guard asserts:
//  (a) the file exists and carries all 10 slugs,
//  (b) each body >= 700 words, >= 3 internal links, >= 4 FAQs, no em/en dash,
//  (c) every internal href target is a known live route family,
//  (d) all 10 pillar assignments present in pillars.ts postPillars,
//  (e) posts.ts still imports SOURCING_POSTS and pushes it into allPosts.
{
  const SRC = read("content/posts-sourcing-cluster.ts");
  const SLUGS = [
    "how-do-vcs-source-deals",
    "how-vc-firms-find-startups-before-everyone-else",
    "proprietary-deal-flow-what-it-actually-means",
    "vc-deal-pipeline-stages-explained",
    "warm-introductions-startup-fundraising",
    "how-do-demo-days-work-for-investors",
    "deal-sourcing-network-how-to-build-one",
    "vc-sourcing-analyst-playbook",
    "deal-sourcing-best-practices-vc",
    "inbound-vs-outbound-deal-sourcing",
  ];
  if (!SRC) {
    failures.push(
      "§56 content/posts-sourcing-cluster.ts missing (10-post 'how VCs source deals' cluster, topical-authority win 2026-08-16).\n    fix: restore the cluster file; do not delete sourcing posts to shrink the codebase",
    );
  } else {
    const found = SLUGS.filter((x) => SRC.includes(`slug: "${x}"`));
    const missing = SLUGS.filter((x) => !found.includes(x));
    if (missing.length) {
      failures.push(
        `§56 sourcing cluster lost post(s): ${missing.join(", ")}.\n    file: content/posts-sourcing-cluster.ts\n    fix: restore the missing entries (they are cross-interlinked; partial removal orphans the cluster)`,
      );
    }
    // per-post window checks: split on '  {' at slug boundaries
    for (const slug of SLUGS) {
      const start = SRC.indexOf(`slug: "${slug}"`);
      if (start < 0) continue;
      const nextSlug = SRC.indexOf("slug: \"", start + 10);
      const window = SRC.slice(start, nextSlug > 0 ? nextSlug : undefined);
      const bodyMatch = window.match(/body: "([\s\S]*?)",\n    relatedSectors/);
      if (!bodyMatch) {
        failures.push(
          `§56 sourcing post ${slug} lost its body field.\n    file: content/posts-sourcing-cluster.ts\n    fix: restore the post body; a post without body renders empty`,
        );
        continue;
      }
      const body = bodyMatch[1];
      const words = body.split(/\s+/).filter(Boolean).length;
      if (words < 700) {
        failures.push(
          `§56 sourcing post ${slug} body fell to ${words} words (floor 700; thin cluster posts are index-bloat).\n    file: content/posts-sourcing-cluster.ts\n    fix: restore depth or remove the post entirely`,
        );
      }
      const links = [...body.matchAll(/\]\((\/[^)]+)\)/g)].map((m) => m[1]);
      if (links.length < 3) {
        failures.push(
          `§56 sourcing post ${slug} carries only ${links.length} internal links (floor 3; the win is cluster-to-money-page wiring).\n    file: content/posts-sourcing-cluster.ts\n    fix: restore contextual links to /blog/, /vs/, /answers/, /methodology or /startups`,
        );
      }
      const faqCount = (window.match(/question: "/g) || []).length;
      if (faqCount < 4) {
        failures.push(
          `§56 sourcing post ${slug} has only ${faqCount} FAQs (floor 4; FAQPage JSON-LD is the AEO surface).\n    file: content/posts-sourcing-cluster.ts\n    fix: restore the FAQs; they are the answer-engine extraction surface`,
        );
      }
      if (/[\u2014\u2013]/.test(window)) {
        failures.push(
          `§56 sourcing post ${slug} contains an em/en dash (site-wide style rule).\n    file: content/posts-sourcing-cluster.ts\n    fix: replace with commas, colons, or parentheses`,
        );
      }
      // internal link targets must be live route families
      const bad = links.filter(
        (h) =>
          !/^\/($|blog\/|vs\/|answers\/|best\/|methodology|startups|learn\/|guide\/|compare\/|alternatives\/)/.test(
            h,
          ),
      );
      if (bad.length) {
        failures.push(
          `§56 sourcing post ${slug} links unknown route family: ${bad.join(", ")}.\n    file: content/posts-sourcing-cluster.ts\n    fix: point at a live signals route family`,
        );
      }
    }
    if (/[\u2014\u2013]/.test(SRC)) {
      failures.push(
        "§56 sourcing cluster contains an em/en dash anywhere in the file.\n    file: content/posts/posts-sourcing-cluster.ts\n    fix: strip em/en dashes",
      );
    }
  }
  const postsSrc = read("content/posts.ts");
  if (postsSrc) {
    if (!postsSrc.includes('import { SOURCING_POSTS } from "@/content/posts-sourcing-cluster"')) {
      failures.push(
        "§56 posts.ts lost the SOURCING_POSTS import (the cluster would vanish from allPosts).\n    file: content/posts.ts\n    fix: restore the import + allPosts.push(...SOURCING_POSTS)",
      );
    }
    if (!postsSrc.includes("allPosts.push(...SOURCING_POSTS)")) {
      failures.push(
        "§56 posts.ts lost the allPosts.push(...SOURCING_POSTS) splice.\n    file: content/posts.ts\n    fix: restore the push; without it the 10 posts 404",
      );
    }
  }
  const pillarsSrc = read("content/pillars.ts");
  if (pillarsSrc) {
    const missingP = [
      "how-do-vcs-source-deals",
      "how-vc-firms-find-startups-before-everyone-else",
      "proprietary-deal-flow-what-it-actually-means",
      "vc-deal-pipeline-stages-explained",
      "warm-introductions-startup-fundraising",
      "how-do-demo-days-work-for-investors",
      `deal-sourcing-network-how-to-build-one`,
      "vc-sourcing-analyst-playbook",
      "deal-sourcing-best-practices-vc",
      "inbound-vs-outbound-deal-sourcing",
    ].filter((x) => !pillarsSrc.includes(`"${x}":`));
    if (missingP.length) {
      failures.push(
        `§56 pillars.ts lost postPillars mapping(s): ${missingP.join(", ")}.\n    file: content/pillars.ts\n    fix: restore the cluster-to-pillar wiring (deal-sourcing-workflow / deal-flow-management)`,
      );
    }
  }
}


// ---------------------------------------------------------------------------
// §57 Citable-stat blocks (2026-08-16, audit "LLMO" fix). Every pSEO template
// must render one quotable stat block (single number + source + URL) so AI
// engines can cite GitDealFlow instead of merely crawling it. Numbers come
// only from lib/citable-stats.ts (live content counts or locked canonical
// claims), never a raw panel size. Assert the data module, the render
// component, and the per-template wiring all survive a lineage revert.
// ---------------------------------------------------------------------------
{
  const templates: Array<[string, string]> = [
    ["vs", "app/vs/[slug]/page.tsx"],
    ["compare", "app/compare/[slug]/page.tsx"],
    ["alternatives", "app/alternatives/[slug]/page.tsx"],
    ["best", "app/best/[slug]/page.tsx"],
    ["city", "app/city/[slug]/page.tsx"],
    ["sector", "app/sector/[slug]/page.tsx"],
    ["startup", "app/startup/[slug]/page.tsx"],
    ["acquirer", "app/acquirer/[slug]/page.tsx"],
    ["glossary", "app/glossary/page.tsx"],
    ["faq", "app/faq/page.tsx"],
    ["blog", "app/blog/[slug]/page.tsx"],
    ["research", "app/research/[slug]/page.tsx"],
    ["research-paper", "app/research-paper/[slug]/page.tsx"],
    ["startups", "components/StartupDirectory.tsx"],
  ];

  const cc = read("lib/citable-stats.ts");
  if (cc === null) {
    failures.push("§57 lib/citable-stats.ts missing entirely.");
  } else {
    if (!cc.includes("export function citableStat(")) {
      failures.push(
        "§57 lib/citable-stats.ts lost the citableStat() getter.\n    file: lib/citable-stats.ts\n    fix: restore citableStat(template) (LLMO citable-stat fix, 2026-08-16)",
      );
    }
    for (const [key] of templates) {
      if (!cc.includes(`case "${key}":`)) {
        failures.push(
          `§57 lib/citable-stats.ts missing the "${key}" template case.\n    file: lib/citable-stats.ts\n    fix: restore the "${key}" citable stat`,
        );
      }
    }
    for (const tok of ["400+", "~400", "411", "540", "20 sectors", "140 ranked", "369", "4,200+", "4,800"]) {
      if (cc.includes(tok)) {
        failures.push(
          `§57 lib/citable-stats.ts contains banned claim token "${tok}".\n    file: lib/citable-stats.ts\n    fix: use the locked floor (350+) or a live content count, never a raw/exact claim`,
        );
      }
    }
  }

  const component = read("components/CitableStat.tsx");
  if (component === null) {
    failures.push("§57 components/CitableStat.tsx missing entirely.");
  } else if (!component.includes("data-citable-stat={template}")) {
    failures.push(
      "§57 components/CitableStat.tsx lost the data-citable-stat attribute.\n    file: components/CitableStat.tsx\n    fix: restore data-citable-stat={template} (guard hook + extraction surface)",
    );
  }

  for (const [key, file] of templates) {
    const s = read(file);
    if (s === null) continue;
    if (!s.includes(`citableStat("${key}")`)) {
      failures.push(
        `§57 ${file} lost its citable-stat block (template "${key}").\n    fix: restore <CitableStat {...citableStat("${key}")} template="${key}" />`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// §58 Source-truth Dataset node on data pages (2026-08-16, audit "RAG-readiness
// 72"). Every page whose primary content is dataset-derived numbers must carry
// a schema.org Dataset node with provenance, so RAG/answer engines can extract
// a grounded stat and trace it to the canonical dataset via isBasedOn ->
// https://signals.gitdealflow.com/dataset#dataset. New pages use the shared
// buildSourceTruthDataset() builder (lib/dataset-schema.ts); the pre-existing
// hand-rolled nodes carry the isBasedOn backlink inline. The builder itself
// must keep its provenance fields or every data page loses traceability.
// ---------------------------------------------------------------------------
{
  const dataPages = [
    "app/sector/[slug]/page.tsx",
    "app/city/[slug]/page.tsx",
    "app/startup/[slug]/page.tsx",
    "app/acquirer/[slug]/page.tsx",
    "app/best/[slug]/page.tsx",
  ];
  for (const rel of dataPages) {
    check(
      rel,
      "§58 data page lost its source-truth Dataset node",
      (s) => s.includes("buildSourceTruthDataset(") || s.includes("isBasedOn"),
      "restore the Dataset node (buildSourceTruthDataset) with isBasedOn -> dataset#dataset provenance",
    );
  }

}

// ---------------------------------------------------------------------------
// §58 Quotable verdict table on the p4 AIO comparison (2026-08-16). The AI
// Overview probe set (signals-gitdealflow/ai-citations) shows GitDealFlow at
// mention position 4-5 on "PitchBook vs Harmonic vs Crunchbase: which is best
// for deal sourcing?" behind 6 incumbents. Fix: a compact multi-tool verdict
// table on /vs/harmonic-ai-vs-pitchbook that answer engines can lift verbatim,
// with GitDealFlow as a first-class column and a summary that names it.
// ---------------------------------------------------------------------------
{
  const cvs = read("content/competitor-vs.ts");
  if (cvs !== null) {
    if (!cvs.includes("verdictTable?: {")) {
      failures.push(
        "§58 CompetitorVs interface lost the optional verdictTable field.\n    file: content/competitor-vs.ts\n    fix: restore the verdictTable field on the CompetitorVs interface",
      );
    }
    if (
      !cvs.includes(
        'headers: ["Harmonic.ai", "PitchBook", "Crunchbase", "GitDealFlow"]',
      )
    ) {
      failures.push(
        "§58 p4 verdict table lost its four-column header (Harmonic.ai, PitchBook, Crunchbase, GitDealFlow).\n    file: content/competitor-vs.ts\n    fix: restore the four-column quotable verdict table on harmonic-ai-vs-pitchbook",
      );
    }
    if (!cvs.includes("3-6 weeks pre-fundraise")) {
      failures.push(
        "§58 p4 verdict table lost the 3-6 weeks pre-fundraise lead-time cell.\n    file: content/competitor-vs.ts\n    fix: restore the canonical lead-time cell (3-6 weeks pre-fundraise, from stats.json 21-47 day headline)",
      );
    }
    if (!cvs.includes("EUR 49/mo, free tier")) {
      failures.push(
        "§58 p4 verdict table lost the EUR 49/mo price cell.\n    file: content/competitor-vs.ts\n    fix: restore the canonical price cell (EUR 49/mo, free tier)",
      );
    }
  }
  check(
    "app/vs/[slug]/page.tsx",
    "§58 /vs template no longer renders the quotable verdict table (answer engines lose the extractable multi-tool comparison).",
    (s) =>
      s.includes("pair.verdictTable") &&
      s.includes("The verdict at a glance") &&
      s.includes("Quote-ready: if you cite this comparison"),
    "restore the verdictTable render block in the /vs template (see §58, 2026-08-16)",
  );
}

// ---------------------------------------------------------------------------
// §59 Author identity in the global footer (2026-08-16, audit "E-E-A-T 72").
// Every page on signals.gitdealflow.com, including every dataset-derived
// "data page" (§58 dataPages), renders components/Footer.tsx, so the author
// identity anchor belongs there ONCE rather than per page. This is the
// anonymity-safe E-E-A-T reconciliation: the pseudonymous handle "The Data
// Nerd" resolves to a persistent ORCID and the SSRN methodology preprint.
// Never a real name (see lib/data-nerd.ts anonymity pillar + §40).
// ---------------------------------------------------------------------------
{
  check(
    "components/Footer.tsx",
    "§59 global footer lost the author-identity (The Data Nerd -> ORCID -> SSRN) anchor",
    (s) =>
      s.includes("DATA_NERD_NAME") &&
      s.includes("DATA_NERD_ORCID") &&
      s.includes('rel="me author"') &&
      s.includes("https://ssrn.com/abstract=6606558"),
    'restore the "By <The Data Nerd>" + ORCID (rel="me author") + SSRN anchors in components/Footer.tsx, imported from @/lib/data-nerd',
  );
  check(
    "lib/data-nerd.ts",
    "§59 data-nerd module lost the canonical ORCID identifier",
    (s) => s.includes("DATA_NERD_ORCID") && s.includes("0009-0002-2222-4112"),
    'restore DATA_NERD_ORCID = "0009-0002-2222-4112" in lib/data-nerd.ts',
  );
}

// ---------------------------------------------------------------------------
// §57 Quotable definition pattern on every template head (2026-08-19).
//    Audit item "quotable/extractable structure 68": every indexable template
//    head must carry ONE 40-60 word, self-contained, AI-extractable definition
//    (data-direct-answer). Component templates import DefinitionBlock; the
//    content-marked templates carry the attribute inline. This is the citation
//    / featured-snippet lift, so a template that loses it becomes unquotable.
// ---------------------------------------------------------------------------
{
  const defBlock = read("components/DefinitionBlock.tsx");
  if (!defBlock || !defBlock.includes("data-direct-answer")) {
    failures.push(
      "§57 DefinitionBlock component missing or lost its data-direct-answer marker.\n    file: components/DefinitionBlock.tsx\n    fix: restore the component emitting data-direct-answer + data-speakable + data-agent-summary",
    );
  }
  const importTemplates = [
    "app/vs/[slug]/page.tsx",
    "app/compare/[slug]/page.tsx",
    "app/alternatives/[slug]/page.tsx",
    "app/best/[slug]/page.tsx",
    "app/city/[slug]/page.tsx",
    "app/sector/[slug]/page.tsx",
    "app/startup/[slug]/page.tsx",
    "app/acquirer/[slug]/page.tsx",
    "app/research-paper/[slug]/page.tsx",
    "app/faq/page.tsx",
    "app/glossary/page.tsx",
  ];
  for (const rel of importTemplates) {
    const s = read(rel);
    if (s && !s.includes("DefinitionBlock")) {
      failures.push(
        `§57 ${rel} lost the DefinitionBlock head definition.\n    fix: restore the DefinitionBlock render under the H1`,
      );
    }
  }
  const markedTemplates = [
    "app/blog/[slug]/page.tsx",
    "app/research/[slug]/page.tsx",
    "components/StartupDirectory.tsx",
    "app/answers/[slug]/page.tsx",
  ];
  for (const rel of markedTemplates) {
    const s = read(rel);
    if (s && !s.includes("data-direct-answer")) {
      failures.push(
        `§57 ${rel} lost the data-direct-answer marker on its quotable lead.\n    fix: restore data-direct-answer on the definition/summary/abstract block`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// §60 Article landmark on the quotable data/editorial templates (2026-08-16,
//     audit item "HTML semantics 82"). blog already wraps its body in
//     <article>; the four highest-citation-value templates (startup profile,
//     startups-to-watch ranking, methodology, alternatives roundup) rendered as
//     bare <section>s directly under <main>. Readability.js (Perplexity /
//     ChatGPT / Gemini / Claude browsing) and RAG pipelines use <article> to
//     locate the self-contained citable content, so a template that loses the
//     wrapper becomes unquotable — the site's #1 discovery deficit (citation
//     share 25/100). Assert each wraps its body in <article>.
// ---------------------------------------------------------------------------
{
  const articleWrapped = [
    "app/startup/[slug]/page.tsx",
    "app/startups-to-watch/[slug]/page.tsx",
    "app/methodology/page.tsx",
    "app/alternatives/[slug]/page.tsx",
  ];
  for (const rel of articleWrapped) {
    const s = read(rel);
    if (s && (!s.includes("<article>") || !s.includes("</article>"))) {
      failures.push(
        `§60 ${rel} lost its <article> wrapper.\n    fix: wrap the quotable body (after the breadcrumb <nav>) in <article>…</article> so answer-engine extractors can find the citable content`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// §61 Product/Offer rich-result integrity (2026-08-19, audit item "schema 88").
//     Both pricing surfaces nested a free price:0 offer INSIDE the
//     AggregateOffer, which forces lowPrice:0. A $0 aggregate offer is how
//     Google suppresses or drops the price-based rich result (Product on the
//     apex, SoftwareApplication on the pSEO host). The free tier stays visible
//     on the page but is excluded from the offer aggregate: lowPrice must equal
//     the lowest PAID price and offerCount must equal the paid-offer count.
// ---------------------------------------------------------------------------
{
  // pSEO /pricing (signals.gitdealflow.com): SoftwareApplication AggregateOffer
  check(
    "app/pricing/page.tsx",
    "§61 pSEO /pricing reintroduced a $0 offer in the AggregateOffer (lowPrice:0 suppresses the price rich result)",
    (s) =>
      !s.includes("const lowPrice = 0") &&
      s.includes("const paidTiers = tiers.filter") &&
      s.includes("offerCount: paidTiers.length") &&
      s.includes("paidTiers.map(tierToOffer)"),
    "exclude the Free tier from the offer aggregate: compute paidTiers, map only paidTiers to offers, lowPrice = min(paid), offerCount = paidTiers.length",
  );

  // apex /pricing (gitdealflow.com): Product AggregateOffer
  const pricing = read("../../../landing/pricing.html");
  if (pricing) {
    if (pricing.includes('"lowPrice": 0')) {
      failures.push(
        '§61 landing /pricing AggregateOffer lowPrice reverted to 0.\n    file: landing/pricing.html\n    fix:  restore "lowPrice": 1 (lowest PAID rung, EUR 1 Tweet Teardown); keep the free digest out of the offers array',
      );
    }
    if (pricing.includes('"price": 0')) {
      failures.push(
        '§61 landing /pricing reintroduced a free $0 offer inside the AggregateOffer.\n    file: landing/pricing.html\n    fix:  remove the price:0 Offer from the aggregate offers array (the free tier stays visible on-page only)',
      );
    }
  }
}


// §62 Founder + blog title hooks (2026-08-16, SERP CTR wave 2). The generic
//     "Public Engineering Profile" title suffix drew 0.00% CTR across 219
//     impressions / 28d (founder family, GSC 28d). Hooks surface each person's
//     already-vetted public role + primary affiliation in the SERP title.
//     The /blog hub title was a bare "Blog". A lineage that loses either
//     reverts to the 0.00%-CTR form.
// ---------------------------------------------------------------------------



// §64 gap-hub fleet (2026-08-16, audit "content gaps 45" follow-on; RESTORED
// 08-16 after a claims-union merge reverted commit 14e27c65). Seven /answers/
// entries shipped from the honest gap queue (51 gaps -> 8 clusters: 7 pages +
// 1 glossary anchor). Pins each slug, its 40-60w definition head, and the
// family head-term keyword so the fleet can't be silently dropped or thinned.
// Entry-count ratchet: >= 105.
{
  const s = read("content/agent-queries.ts");
  const needles: Array<[string, string]> = [
    ['slug: "cybersecurity-deal-flow"', "cybersecurity-deal-flow entry missing"],
    ['slug: "companies-like-crunchbase"', "companies-like-crunchbase entry missing"],
    ['slug: "affinity-integrations"', "affinity-integrations entry missing"],
    ['slug: "data-infrastructure-startups-to-watch"', "data-infrastructure-startups-to-watch entry missing"],
    ['slug: "dealroom-api-and-funding-data"', "dealroom-api-and-funding-data entry missing"],
    ['slug: "deal-sourcing-automation"', "deal-sourcing-automation entry missing"],
    ['slug: "affordable-pitchbook-alternatives-for-small-funds"', "affordable-pitchbook-alternatives entry missing"],
    ['"Cybersecurity deal flow is the stream of investable security-startup opportunities', "cyber definition reverted"],
    ['"The main companies like Crunchbase are Dealroom for European depth', "companies-like definition reverted"],
    ['"The Affinity integrations that matter for deal sourcing are email and calendar capture', "affinity-integrations definition reverted"],
    ['"Data infrastructure startups to watch are ranked by GitHub engineering signals', "data-infra definition reverted"],
    ['"The Dealroom API provides programmatic access', "dealroom-api definition reverted"],
    ['"Deal sourcing automation connects discovery feeds', "deal-sourcing-automation definition reverted"],
    ['"Affordable PitchBook alternatives for small funds are Crunchbase Pro at $49/month', "pitchbook-alts definition reverted"],
    ['"cybersecurity deal flow"', "cyber head-term keyword lost"],
    ['"companies like crunchbase"', "companies-like head-term keyword lost"],
    ['"deal sourcing automation"', "deal-sourcing-automation head-term keyword lost"],
    ['"pitchbook alternatives"', "pitchbook-alts head-term keyword lost"],
    ['"data infrastructure startups to watch"', "data-infra head-term keyword lost"],
  ];
  for (const [needle, msg] of needles) {
    if (s === null || !s.includes(needle)) {
      failures.push(
        `§64 gap-hub fleet: ${msg}\n    file: content/agent-queries.ts\n    fix: restore the entry (gap-queue 2026-08-16): ${needle}`,
      );
    }
  }
  const slugCount = s === null ? 0 : (s.match(/slug: "/g) || []).length;
  if (s !== null && slugCount < 105) {
    failures.push(
      `§64 gap-hub fleet: agent-queries entry count fell below 105 (${slugCount}).\n    file: content/agent-queries.ts\n    fix: entries are append-only; restore removed entries or lower the floor in the same commit that documents why`,
    );
  }
}


// ---------------------------------------------------------------------------
// 60. Static-surface claim lock completion (2026-08-16, audit follow-up).
//     The 08-16 sweeps (12ee6195, 956bb30c) fixed dynamic surfaces but missed
//     static ones: public/guide/* ("400+ startup orgs"), enterprise FAQ
//     ("109+ orgs"), and nine "20 startup sectors" surfaces (live panel = 15
//     active sectors, 5 archived at Q2; committed data q3-2026: 15 active,
//     411 raw / 398 deduped orgs, so "400+" overclaims and 350+ is the floor).
//     This section bans those tokens across ALL pseo-site source dirs
//     (including public/, which §56 skipped) and pins landing/llms.txt
//     pricing to current rates with founding rates marked closed.
// ---------------------------------------------------------------------------
{
  const bannedTokens60 = [
    "400+ startup orgs",
    "109+ venture-backed startup orgs",
    "109+ venture-backed startup organizations",
  ];
  const sectorClaim60 =
    /(?:across|track|tracks|universe of|Curate)\s+20\s+(?:startup\s+)?sectors/i;
  const exts60 = new Set([".ts", ".tsx", ".md", ".json", ".html", ".js", ".mjs", ".txt"]);
  const skip60 = new Set([".vercel", ".git", "node_modules", ".DS_Store"]);
  const walk60 = (dir: string, out: string[] = []): string[] => {
    let names: string[];
    try {
      names = readdirSync(dir);
    } catch {
      return out;
    }
    for (const name of names) {
      if (skip60.has(name)) continue;
      const fp = join(dir, name);
      let isDir = false;
      try {
        isDir = statSync(fp).isDirectory();
      } catch {
        continue;
      }
      if (isDir) walk60(fp, out);
      else if (exts60.has(extname(name).toLowerCase())) out.push(fp);
    }
    return out;
  };
  const hits60: string[] = [];
  // Derived-count check: homepage Dataset JSON-LD must derive the ACTIVE
  // sector count (activeSectorCount), never raw sectors.length (counts the
  // 5 archived clusters -> renders "20 startup sectors" in schema output).
  {
    const hp = join(ROOT, "app", "page.tsx");
    if (existsSync(hp)) {
      const hs = readFileSync(hp, "utf8");
      if (hs.includes("sectors.length +\n          \" startup sectors")) {
        hits60.push("app/page.tsx (derived sector count: sectors.length in Dataset description)");
      }
    }
  }
  for (const dir of ["app", "content", "lib", "components", "scripts", "public"]) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const fp of walk60(abs)) {
      if (fp.endsWith("verify-no-regressions.ts")) continue;
      let src: string;
      try {
        src = readFileSync(fp, "utf8");
      } catch {
        continue;
      }
      const tok = bannedTokens60.find((t) => src.includes(t));
      if (tok || sectorClaim60.test(src)) {
        hits60.push(`${fp} (${tok ?? "20-sector claim"})`);
      }
    }
  }
  if (hits60.length) {
    failures.push(
      `§60 static-surface claim lock: banned panel/sector claims found in: ${hits60.join("; ")}\n    file: (multiple)\n    fix:  sweep to PANEL_CLAIM ("350+") via lib/canonical-claims.ts and "15 startup sectors"; legacy clusters are archived at Q2 2026 (user lock 2026-08-16, AGENTS.md)`,
    );
  }
  // landing/llms.txt must present CURRENT pricing with founding rates closed.
  const llmsPath = join(ROOT, "..", "landing", "llms.txt");
  if (existsSync(llmsPath)) {
    const ls = readFileSync(llmsPath, "utf8");
    const stalePrice =
      ls.includes("- Dashboard Beta: EUR 9.97/month") ||
      ls.includes("- Insider Circle: EUR 97/month,");
    const hasCurrent =
      ls.includes("- Dashboard: EUR 49/month") &&
      ls.includes("- Insider Circle: EUR 197/month");
    if (stalePrice || !hasCurrent) {
      failures.push(
        "§60 landing/llms.txt pricing stale: founding rates (9.97/97) must be marked closed; current rates 49/197 required.\n    file: landing/llms.txt\n    fix:  mirror the live /pricing ladder (founding window closed 2026-06-30)",
      );
    }
  }
  // -------------------------------------------------------------------------
  // §61 forward-copy claim lock (user lock 2026-08-16): launch drafts,
  //     outreach emails, and affiliate recruiting copy must quote CURRENT
  //     facts only: panel "350+", 15 sectors, EUR 49/197. Founding-era rates
  //     (9.97/97) may appear only with the closed-window framing. These
  //     files are future-facing: stale numbers become public claims the
  //     moment they are posted or sent.
  // -------------------------------------------------------------------------
  {
    const fwdFiles61: Array<[string, string]> = [
      ["AEO-producthunt-launch-draft.md", "PH launch draft"],
      ["AEO-hn-show-hn-draft.md", "HN Show HN draft"],
      ["marketing/launch-plan.md", "launch plan"],
      ["marketing/outreach-emails-final.md", "outreach emails"],
      ["marketing/alternatives-cluster-geo-2026-05-31/assets/listicle-outreach-email.md", "listicle outreach"],
      ["marketing/twitter-post-launch-week.md", "launch-week tweets"],
      ["tools/campaign/drafts/affiliate-recruit-01-pragmatic-engineer.txt", "affiliate draft 01"],
      ["tools/campaign/drafts/affiliate-recruit-06-devtools-fyi.txt", "affiliate draft 06"],
      ["tools/campaign/drafts/affiliate-recruit-08-lenny-newsletter.txt", "affiliate draft 08"],
    ];
    const banned61 = [
      "9.97",
      "€97/mo",
      "EUR 97/mo",
      "€19.40",
      "109+",
      "~400",
      "400+ startup",
      "20 sectors",
      "thousands of",
      "140 ranked",
      "4,200",
      "4,800 orgs",
    ];
    const exempt61 = /closed|2026-06-30|founding|Founding|archived/i;
    const hits61: string[] = [];
    for (const [rel, label] of fwdFiles61) {
      const fp = join(ROOT, "..", rel);
      if (!existsSync(fp)) continue;
      const ls = readFileSync(fp, "utf8").split(/\r?\n/);
      ls.forEach((line, idx) => {
        if (exempt61.test(line)) return;
        for (const tok of banned61) {
          if (line.includes(tok)) {
            hits61.push(`${label} (${rel}:${idx + 1}): "${tok}"`);
            break;
          }
        }
      });
    }
    if (hits61.length) {
      failures.push(
        `§61 forward-copy claim violations in: ${hits61.join("; ")}\n    file: (multiple)\n    fix:  sweep launch/outreach/affiliate drafts to PANEL_CLAIM (350+), 15 sectors, EUR 49/197; founding rates only with closed-window framing`,
      );
    }
  }
  // -------------------------------------------------------------------------
  // §62 homepage/funnel current-rate lock (user lock 2026-08-16): sales
  //     surfaces must present the CURRENT ladder (EUR 49/197). Founding-era
  //     rates (9.97/97) may appear only in closed-window grandfather
  //     framing, never as a buyable offer. The homepage schema counter
  //     must use the numeric floor, never the raw sector-sum count.
  // -------------------------------------------------------------------------
  {
    const req62: Array<[string, string, string]> = [
      [join(ROOT, "app", "page.tsx"), "userInteractionCount: PANEL_FLOOR_NUM", "homepage counter floor"],
    ];
    for (const [fp, needle, label] of req62) {
      if (existsSync(fp) && !readFileSync(fp, "utf8").includes(needle)) {
        failures.push(
          `§62 ${label} missing in app/page.tsx\n    fix:  schema counters must use PANEL_FLOOR_NUM (350), never raw counts`,
        );
      }
    }
    const banned62: Array<[string, string]> = [
      ["components/HomeOfferStack.tsx", "€9.97 / month, locked forever"],
      ["lib/data-nerd.ts", "€9.97/mo is a feature"],
      ["lib/data-nerd.ts", "price is €9.97/mo"],
      ["app/about/founder/page.tsx", "€9.97/mo is a feature"],
      ["app/walkthrough/5min/page.tsx", "€9.97/mo"],
      ["app/walkthrough/page.tsx", "€9.97/mo"],
      ["app/roadmap/page.tsx", "€9.97/mo founding price"],
      ["app/start-here/page.tsx", "Founding-member price locked forever"],
      ["app/state-of-github/page.tsx", "€97/month founding price"],
      ["app/pitch/page.tsx", "Founding-member price"],
      ["app/tweet-teardown/thanks/page.tsx", "cohort closing in days"],
      ["app/quiz/QuizForm.tsx", "Lock €9.97/mo founder price"],
      ["components/FastActionBonuses.tsx", "€9.97 founding-member checkout is paused"],
      ["components/FastActionBonuses.tsx", "Founding-rate ratchet"],
      ["components/BuyerRoadmap.tsx", "Lock €9.97/mo founding price"],
      ["components/BuyerRoadmap.tsx", "€119.64"],
      ["app/walkthrough/page.tsx", "picked €9.97"],
      ["app/walkthrough/page.tsx", "€119.64"],
      ["app/walkthrough/90s/page.tsx", "€119.64"],
      ["app/walkthrough/5min/page.tsx", "€119.64"],
      ["app/firstlook/page.tsx", "€119.64 / yr"],
      ["content/launches.ts", "Lock €9.97/mo"],
    ];
    const hits62: string[] = [];
    for (const [rel, tok] of banned62) {
      const fp = join(ROOT, rel);
      if (!existsSync(fp)) continue;
      if (readFileSync(fp, "utf8").includes(tok)) hits62.push(`${rel}: "${tok}"`);
    }
    if (hits62.length) {
      failures.push(
        `§62 stale founding-rate offers in: ${hits62.join("; ")}\n    file: (multiple)\n    fix:  present the current ladder (49/197); founding rates only in closed-window grandfather framing`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// §63 Article landmark on the quotable data/editorial templates (2026-08-16,
//     audit item "HTML semantics 82"). blog already wraps its body in
//     <article>; the four highest-citation-value templates (startup profile,
//     startups-to-watch ranking, methodology, alternatives roundup) rendered as
//     bare <section>s directly under <main>. Readability.js (Perplexity /
//     ChatGPT / Gemini / Claude browsing) and RAG pipelines use <article> to
//     locate the self-contained citable content, so a template that loses the
//     wrapper becomes unquotable. Assert each wraps its body in <article>.
// ---------------------------------------------------------------------------
{
  const articleWrapped = [
    "app/startup/[slug]/page.tsx",
    "app/startups-to-watch/[slug]/page.tsx",
    "app/methodology/page.tsx",
    "app/alternatives/[slug]/page.tsx",
  ];
  for (const rel of articleWrapped) {
    const s = read(rel);
    if (s && (!s.includes("<article>") || !s.includes("</article>"))) {
      failures.push(
        `§63 ${rel} lost its <article> wrapper.\n    fix: wrap the quotable body (after the breadcrumb <nav>) in <article></article> so answer-engine extractors can find the citable content`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// §64 Product/Offer rich-result integrity (2026-08-19, audit item "schema 88").
//     Both pricing surfaces nested a free price:0 offer INSIDE the
//     AggregateOffer, which forces lowPrice:0. A $0 aggregate offer is how
//     Google suppresses or drops the price-based rich result (Product on the
//     apex, SoftwareApplication on the pSEO host). The free tier stays visible
//     on the page but is excluded from the offer aggregate: lowPrice must equal
//     the lowest PAID price and offerCount must equal the paid-offer count.
// ---------------------------------------------------------------------------
{
  // pSEO /pricing (signals.gitdealflow.com): SoftwareApplication AggregateOffer
  check(
    "app/pricing/page.tsx",
    "§64 pSEO /pricing reintroduced a $0 offer in the AggregateOffer (lowPrice:0 suppresses the price rich result)",
    (s) =>
      !s.includes("const lowPrice = 0") &&
      s.includes("const paidTiers = tiers.filter") &&
      s.includes("offerCount: paidTiers.length") &&
      s.includes("paidTiers.map(tierToOffer)"),
    "exclude the Free tier from the offer aggregate: compute paidTiers, map only paidTiers to offers, lowPrice = min(paid), offerCount = paidTiers.length",
  );

  // apex /pricing (gitdealflow.com): Product AggregateOffer
  const pricingPath = join(ROOT, "..", "landing", "pricing.html");
  if (existsSync(pricingPath)) {
    const pricing = readFileSync(pricingPath, "utf8");
    if (pricing.includes('"lowPrice": 0')) {
      failures.push(
        '§64 landing /pricing AggregateOffer lowPrice reverted to 0.\n    file: landing/pricing.html\n    fix:  restore "lowPrice": 1 (lowest PAID rung, EUR 1 Tweet Teardown); keep the free digest out of the offers array',
      );
    }
    if (pricing.includes('"price": 0')) {
      failures.push(
        '§64 landing /pricing reintroduced a free $0 offer inside the AggregateOffer.\n    file: landing/pricing.html\n    fix:  remove the price:0 Offer from the aggregate offers array (the free tier stays visible on-page only)',
      );
    }
  }
}

// ---------------------------------------------------------------------------
// §53 Reddit $20 probe guard (2026-08-16). Three invariants:
//   a) The six Reddit /r/ campaigns carry the probe cohort tag
//      utm_campaign=reddit-probe-2026-08 (the May tags vc-2026-05/dev-2026-05
//      were stale before any spend ever ran and would split the probe's GA4
//      cohort into two mislabeled months).
//   b) PaidTrafficBanner copy never claims a banned panel count. "219" may
//      appear ONLY as "219 startup-period observations" (the honest form;
//      "219-startup panel" overstates the SSRN panel, which is 55 startups).
//   c) The banner stays mounted on /firstlook (paid traffic needs the
//      channel-scent headline; a lineage that drops the mount wastes clicks).
// ---------------------------------------------------------------------------
{
  const pa = read("lib/paid-acquisition.ts");
  if (pa) {
    const probeCount = (pa.match(/campaign: "reddit-probe-2026-08"/g) || []).length;
    if (probeCount !== 6) {
      failures.push(
        `§53 Reddit probe tags: expected 6 campaigns with utm_campaign "reddit-probe-2026-08", found ${probeCount}.\n    file: lib/paid-acquisition.ts\n    fix:  restore the probe cohort tag on all six Reddit campaigns (vc/angel/startups/devtools/programming/ml); the May tags were never live-spent and are stale`,
      );
    }
    if (pa.includes('campaign: "vc-2026-05"') || pa.includes('campaign: "dev-2026-05"')) {
      failures.push(
        `§53 Reddit probe tags: stale May campaign tags (vc-2026-05/dev-2026-05) are back in lib/paid-acquisition.ts.\n    fix:  all six Reddit campaigns share "reddit-probe-2026-08"; utm_content segments the subreddit`,
      );
    }
  }
  const banner = read("components/PaidTrafficBanner.tsx");
  if (banner) {
    if (/219-startup panel/.test(banner)) {
      failures.push(
        `§53 banner claim: PaidTrafficBanner says "219-startup panel" (banned overstatement; the SSRN panel is 55 startups, 219 is the observation count).\n    file: components/PaidTrafficBanner.tsx\n    fix:  use "219 startup-period observations" or the "350+ orgs" panel floor`,
      );
    }
  }
  const firstlook = read("app/firstlook/page.tsx");
  if (firstlook && !firstlook.includes("<PaidTrafficBanner />")) {
    failures.push(
      `§53 banner mount: PaidTrafficBanner is no longer mounted on /firstlook. Paid traffic loses the channel-scent headline (Brunson scent rule).\n    file: app/firstlook/page.tsx\n    fix:  restore the import + <PaidTrafficBanner /> node`,
    );
  }
}

// ---------------------------------------------------------------------------
// §65 Digest email UTM attribution (2026-08-16, audit item "email as traffic
//     source 58"). The Sunday digest's outbound links to OUR OWN domain must
//     carry utm_source=email so the north-star (fetch_north_star.py) classifies
//     digest clicks as "email" rather than "direct". Email clients strip the
//     referrer, so without the tag every digest click is miscounted as direct
//     and the newsletter-swap play's only success metric reads zero. The
//     track() helper tags only gitdealflow.com/signals.gitdealflow.com links
//     and leaves external links (partner slot, social footer) untouched.
// ---------------------------------------------------------------------------
{
  const de = read("lib/digest-email.ts");
  if (de !== null) {
    if (!de.includes("function track(href: string): string")) {
      failures.push(
        "§65 digest email lost the track() UTM helper.\n    file: lib/digest-email.ts\n    fix: restore the track(href) function that appends utm_source=email&utm_medium=email&utm_campaign=signal-digest to gitdealflow.com links",
      );
    }
    if (!de.includes("utm_source=email&utm_medium=email&utm_campaign=signal-digest")) {
      failures.push(
        "§65 digest email UTM params lost from track().\n    file: lib/digest-email.ts\n    fix: restore the utm_source=email&utm_medium=email&utm_campaign=signal-digest query in track()",
      );
    }
    if (!de.includes('track(`https://signals.gitdealflow.com/startup/${escape(s.slug)}`)')) {
      failures.push(
        "§65 digest startup cards lost UTM tagging.\n    file: lib/digest-email.ts\n    fix: wrap the startup-card href in track() so email clicks attribute to the email source",
      );
    }
  }
}

// §66 Apex bot-crawl relay (2026-08-17). gitdealflow.com (static Vercel
//     project) cannot land bot_crawl events directly in PostHog 143861: its
//     Node-function egress is ACKed "200 Ok" but silently dropped by
//     ingestion (proven 2026-08-16; only edge-runtime-origin captures land).
//     The apex api/crawl-proxy.js relays its detections to
//     /__relay/bot-crawl in this middleware, which emits them via the proven
//     capture path with source="apex-relay". Guards both sides.
// ---------------------------------------------------------------------------
{
  check(
    "proxy.ts",
    "§66 apex bot-crawl relay: the /__relay/bot-crawl branch was dropped from proxy.ts (the apex gitdealflow.com crawl blind spot reopens silently: zero bot_crawl events with host=gitdealflow.com).",
    (s) =>
      s.includes('pathname === "/__relay/bot-crawl"') &&
      s.includes('source: "apex-relay"') &&
      s.includes("APEX_RELAY_SECRET") &&
      s.includes("relayed"),
    "restore the /__relay/bot-crawl branch at the TOP of proxy() (secret-gated, emits bot_crawl with source=apex-relay via the proven capture path)",
  );
  // Soft check: landing/ may be absent in a pseo-site-only checkout
  // (same semantics as landingCheck). When the apex function IS present it
  // must relay, never egress directly.
  {
    const apex = read("../landing/api/crawl-proxy.js");
    if (apex !== null) {
      if (
        !apex.includes("signals.gitdealflow.com/__relay/bot-crawl") ||
        !apex.includes("x-relay-secret") ||
        !apex.includes("APEX_RELAY_SECRET")
      ) {
        failures.push(
          `§66 apex side: landing/api/crawl-proxy.js lost the relay call (direct PostHog egress is silently dropped from non-edge sources, proven 2026-08-16).\n    file: landing/api/crawl-proxy.js\n    fix:  restore the relay fetch (GET signals.gitdealflow.com/__relay/bot-crawl with x-relay-secret from env APEX_RELAY_SECRET)`,
        );
      }
    }
  }
}
// ---------------------------------------------------------------------------
// §68 Assistant-originated traffic instrumentation (2026-08-16, audit item
//     "agent-surface distribution 65": track assistant-originated traffic as
//     its own north-star source). The four agent-programmable POST surfaces
//     (MCP / A2A / NLWeb / function-calling API) must emit the `agent_request`
//     PostHog event so the north-star can measure real agent adoption
//     separately from human qualified visitors and from bot_crawl. A tree that
//     drops the capture silently zeroes the metric.
// ---------------------------------------------------------------------------
{
  const libSrc = read("lib/agent-traffic.ts");
  if (!libSrc || !libSrc.includes('event: "agent_request"')) {
    failures.push(
      "§68 lib/agent-traffic.ts missing or lost the agent_request event.\n    fix: restore lib/agent-traffic.ts (PostHog agent_request capture for the agent surfaces)",
    );
  }
  const surfaces: Array<[string, string]> = [
    ["app/api/mcp/rpc/route.ts", 'await captureAgentRequest("mcp", request)'],
    ["app/api/a2a/route.ts", 'await captureAgentRequest("a2a", request)'],
    ["app/api/nlweb/route.ts", 'await captureAgentRequest("nlweb", request)'],
    ["app/api/agent/call/route.ts", 'await captureAgentRequest("function_api", request)'],
  ];
  for (const [rel, needle] of surfaces) {
    const s = read(rel);
    if (s && !s.includes(needle)) {
      failures.push(
        `§68 ${rel} lost the ${needle} capture call.\n    fix: restore await captureAgentRequest(...) at the top of the POST handler (void = fire-and-forget that Vercel freezes before the PostHog POST lands)`,
      );
    }
  }
}

if (failures.length) {
  console.error(
    `\n✖ verify-no-regressions: ${failures.length} regression(s) detected.\n` +
      `  This tree is missing fixes that are already live. Deploying it would\n` +
      `  revert them (see scripts/verify-no-regressions.ts header for why).\n`,
  );
  for (const f of failures) console.error(`  ✖ ${f}\n`);
  console.error(
    `  If a check is genuinely obsolete, delete it here with a reason, \n` +
      `  do not bypass the guard.\n`,
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// §65 Research-paper quotable definitions (2026-08-17, audit win #3
//     striking-distance push). The /research-paper/ cluster holds ~20K
//     impressions/28d at position 8-10 with near-zero clicks. This section
//     pins the two halves of the fix: every paper carries a 40-60 word
//     `definition` (the snippet/AIO extraction window) distinct from the
//     metaTitle, and the leaf renders it in the DefinitionBlock head.
//     Cohort floors: data/striking-distance.json converged to builder-
//     sustained values on 2026-08-17 (§43 measures the regenerated graph;
//     never hand-edit the graph to satisfy a floor the builder cannot
//     reproduce, lower the floor with a note instead).
// ---------------------------------------------------------------------------
{
  const content = read("content/research-papers.ts");
  const leaf = read("app/research-paper/[slug]/page.tsx");
  if (content && leaf) {
    const defs = [...content.matchAll(/^\s{4}definition:\s*\n\s*"([^"]*)"/gm)].map(
      (m) => m[1],
    );
    const slugs = [...content.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
    const metaTitles = [...content.matchAll(/metaTitle:\s*\n?\s*"([^"]*)"/g)].map(
      (m) => m[1],
    );

    if (defs.length !== slugs.length) {
      failures.push(
        `§65 research-paper definitions: ${defs.length} definition fields for ${slugs.length} papers. Every paper needs exactly one 40-60 word definition.`,
      );
    }
    for (const d of defs) {
      const wc = d.trim().split(/\s+/).filter(Boolean).length;
      if (wc < 40 || wc > 60) {
        failures.push(
          `§65 research-paper definition outside the 40-60 word snippet window (${wc} words): "${d.slice(0, 60)}..."`,
        );
      }
      if (metaTitles.some((mt) => mt.trim() === d.trim())) {
        failures.push(
          `§65 research-paper definition identical to a metaTitle (redundant extraction): "${d.slice(0, 60)}..."`,
        );
      }
    }
    if (
      !leaf.includes("<DefinitionBlock text={paper.definition}") ||
      !leaf.includes('label="What this paper is"')
    ) {
      failures.push(
        "§65 research-paper leaf lost the DefinitionBlock head render (paper.definition, label \"What this paper is\").",
      );
    }
    if (/data-direct-answer/.test(leaf)) {
      failures.push(
        "§65 research-paper leaf carries a bare data-direct-answer outside the DefinitionBlock; keep ONE extraction anchor per page.",
      );
    }
  }
}

console.log("✓ verify-no-regressions: all regression guards pass");
