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
// 4. Suspended X account in the author entity (2026-07-31). x.com/data_nerd
//    renders "Account suspended"; a dead profile in sameAs/rel=me is a
//    negative trust signal to Google and to AI engines reconciling the author.
// ---------------------------------------------------------------------------
check(
  "lib/data-nerd.ts",
  "Suspended x.com/data_nerd is back in the canonical author sameAs.",
  (s) => !s.includes("x.com/data_nerd"),
  "remove it from DATA_NERD_AUTHOR_SAMEAS; only re-add X once a live handle exists",
);

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
