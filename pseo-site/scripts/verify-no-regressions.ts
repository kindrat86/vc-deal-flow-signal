/**
 * Prebuild regression guard — makes a REGRESSED TREE UNDEPLOYABLE.
 *
 * Why this exists
 * ---------------
 * signals.gitdealflow.com is deployed to ONE alias-pinned Vercel project
 * (`pseo-site`) from MORE THAN ONE git lineage — `main`
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
 * `next build`, so it cannot be deployed by ANY path — scheduled task,
 * agent, temp-worktree deploy, or manual. Prefer adding a check here over
 * re-fixing the same defect a third time.
 *
 * Adding a check: assert the FIXED state, keep the failure message
 * actionable, and cite the date/reason. Only assert things that are cheap
 * and unambiguous — this runs on every build.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

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
      `Deactivated Stripe payment link(s) present — these bounce paying buyers.\n    ${hits.join(
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
// is deliberately relative — that page DOES exist on signals (verified 200).
const ORIGIN_MISMATCHED_THANKS = [
  "firstlook-thanks",
  "dashboard-thanks",
  "insider-thanks",
  "sector-sweep-thanks",
];
check(
  "lib/stripe-tiers.ts",
  "Checkout successUrl is relative for a thank-you page that does not exist on the signals origin — buyers 404 after paying.",
  (s) => !ORIGIN_MISMATCHED_THANKS.some((p) => new RegExp(`successUrl:\\s*"/${p}`).test(s)),
  'make these absolute, e.g. successUrl: "https://gitdealflow.com/dashboard-thanks?session_id={CHECKOUT_SESSION_ID}"',
);

// The GET handler is what replaced the dead payment links; without it every
// `<a href="/api/checkout/session?tier=…">` 405s.
check(
  "app/api/checkout/session/route.ts",
  "Checkout route lost its GET handler — tier links will 405.",
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
  "ux.css reintroduced `color: revert` — repaints money CTAs UA-blue/visited-purple.",
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
  "programmaticComparisons is no longer exported — /compare hub cannot list them.",
  (s) => /export\s+const\s+programmaticComparisons/.test(s),
  "keep the `export` keyword on programmaticComparisons",
);
check(
  "app/compare/page.tsx",
  "/compare hub stopped listing programmatic comparisons — 11 pages become orphans.",
  (s) => s.includes("programmaticComparisons"),
  "map over [...comparisons, ...programmaticComparisons]",
);

// ---------------------------------------------------------------------------
// 6. QAPage on site-authored answers (2026-07-31). Google: "Don't use QAPage
//    markup for content authored by the site." Invalid across ~91 /answers.
// ---------------------------------------------------------------------------
check(
  "app/answers/[slug]/page.tsx",
  "QAPage markup is back on /answers — invalid for site-authored answers.",
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
//    decision — it is a conversational reply to a form the prospect just
//    submitted, and its T+0/T+2h/T+12h cadence shares a calendar day, so a
//    daily cap would drop all but one. Do not "helpfully" gate it here.
// ---------------------------------------------------------------------------
check(
  "lib/send-gate.ts",
  "Shared send-gate helper is missing — marketing senders cannot enforce the one-email-per-recipient-per-day cap.",
  (s) => /export\s+async\s+function\s+gateAllows/.test(s),
  "restore lib/send-gate.ts exporting gateAllows(email, sender, day?) — it must FAIL CLOSED when the gate is unreachable",
);

for (const [file, label] of [
  ["app/api/cron/drip-sender/route.ts", "drip-sender"],
  ["app/api/cron/daily-seinfeld/route.ts", "daily-seinfeld"],
  ["lib/soap-opera-scout.ts", "scout soap-opera (days 2-5)"],
] as const) {
  check(
    file,
    `${label} sends without claiming the shared daily send-gate slot — recipients can be mailed multiple times a day.`,
    (s) => s.includes("gateAllows("),
    "call `await gateAllows(<recipient>, '<sender-label>'[, deliveryDay])` before sending and skip when it returns false",
  );
}

// daily-seinfeld must stay a per-recipient fan-out: a Resend BROADCAST targets a
// whole audience and cannot exclude individuals, so reverting to it silently
// defeats the cap no matter what the gate says.
check(
  "app/api/cron/daily-seinfeld/route.ts",
  "daily-seinfeld is back on Resend broadcasts — a broadcast cannot exclude individuals, so the daily cap cannot apply.",
  (s) => !s.includes("api.resend.com/broadcasts"),
  "send per recipient via /emails (gated), using injectUnsubscribeLink + listUnsubscribeHeaders — {{{RESEND_UNSUBSCRIBE_URL}}} only expands on broadcasts",
);

// IndexNow: a status-only log is why a 422 sat unexplained in the build output.
check(
  "scripts/submit-indexnow.ts",
  "IndexNow submitter no longer reports WHY a submission was rejected — a failure will be silent again.",
  (s) => s.includes("IndexNow body") && s.includes("IndexNow SKIPPED"),
  "log the response body on non-2xx, and preflight the key file by CONTENT (this host serves soft-404s that a status check reads as valid)",
);

// ---------------------------------------------------------------------------
// 7. Newsletter widget publisher attribution (2026-08-13). /embed/weekly is
//    the co-branded "Signal of the Week" block pitched to VC newsletters.
//    The ?pub= parameter is how each publisher's clicks are attributed —
//    losing it silently blinds the whole newsletter-distribution funnel.
// ---------------------------------------------------------------------------
check(
  "app/embed/weekly/route.ts",
  "/embed/weekly lost the ?pub= publisher-attribution script — newsletter embeds stop attributing clicks.",
  (s) => s.includes('get("pub")') && s.includes("utm_campaign"),
  "restore the inline script that reads ?pub= from the iframe URL and appends utm_campaign/pub to the CTA link",
);

// Chrome-extensions listicle (2026-08-13, Play #6 distribution). Published to
// BOTH lineages the same day; a lineage that lacks it silently 404s the URL
// that the /chrome page, X thread, and LinkedIn syndication link to.
check(
  "content/posts.ts",
  "Blog post best-chrome-extensions-vc-deal-flow-2026 is missing — its inbound distribution links 404.",
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
if (failures.length) {
  console.error(
    `\n✖ verify-no-regressions: ${failures.length} regression(s) detected.\n` +
      `  This tree is missing fixes that are already live. Deploying it would\n` +
      `  revert them (see scripts/verify-no-regressions.ts header for why).\n`,
  );
  for (const f of failures) console.error(`  ✖ ${f}\n`);
  console.error(
    `  If a check is genuinely obsolete, delete it here with a reason —\n` +
      `  do not bypass the guard.\n`,
  );
  process.exit(1);
}
console.log("✓ verify-no-regressions: all regression guards pass");
