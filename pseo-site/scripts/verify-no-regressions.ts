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

// ---------------------------------------------------------------------------
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
console.log("✓ verify-no-regressions: all regression guards pass");
