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
  "org-count regressed: canonical AI-description block must claim '350+ venture-backed startups', not 369/~400.",
  (s) =>
    s.includes("350+ venture-backed startups") &&
    !s.includes("369 venture-backed startups") &&
    !s.includes("~400"),
  "restore '350+ venture-backed startups' in the /about canonical AI-description block",
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

check(
  "app/glossary/page.tsx",
  "glossary page no longer renders the snippet as the first answer paragraph under each 'What is X?' heading.",
  (s) => s.includes("{t.snippet}") && s.includes("t.snippet ?? t.definition"),
  "render {t.snippet} right after each question h2 and use t.snippet ?? t.definition in the FAQPage schema",
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
{
  // Every removed cross pair must 301 to its /vs/ twin, and must NOT be
  // regenerated in comparisons.ts.
  const CONSOLIDATED: [string, string][] = [
    ["/compare/pitchbook-vs-cb-insights", "/vs/pitchbook-vs-cb-insights"],
    ["/compare/crunchbase-vs-cb-insights", "/vs/crunchbase-vs-cb-insights"],
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
    ["/compare/crunchbase-vs-cb-insights", "/vs/crunchbase-vs-cb-insights"],
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
    "app/benchmarks/[metric]/page.tsx",
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
  // (b) template emits real Question/Answer nodes wired to the AskAction refs
  check(
    "app/answers/[slug]/page.tsx",
    "§23 /answers template no longer emits the #question/#answer schema nodes the AskAction references",
    (s) =>
      s.includes('`${url}#question`') &&
      s.includes('`${url}#answer`') &&
      s.includes('"@type": "Question"') &&
      s.includes('"@type": "Answer"') &&
      s.includes("text: q.tldr"),
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
// 74 of 96 locale topic pages are short hand-written summaries (98-262 body
// words) that were competing with the English canonical for thin/duplicate
// content. They are now NOINDEXED + canonicalized to English, and dropped from
// hreflang + the i18n sitemap; only the 22 full long-form translations
// (ja/ko all-8, zh methodology/signals/research/about, es/fr signals) and the
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
    s.includes('"fr/signals"'),
  "restore FULL_TRANSLATION_TOPICS (22 full translations) + isLocaleTopicSummary() in content/locale-topics.ts",
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
