import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const read = (path) => readFileSync(resolve(root, path), "utf8");

const firstLookIntent = read("app/api/firstlook/intent/route.ts");
const landingPixels = read("../landing/pixels.js");
const pseoPixels = read("components/PixelManager.tsx");
const landingCsp = read("../landing/vercel.json");
const pseoCsp = read("next.config.ts");
const dashboardPage = read("../landing/dashboard.html");
const insiderPage = read("../landing/insider.html");
const pricingPage = read("../landing/pricing.html");
const pricingPageDe = read("../landing/de/pricing.html");
const pricingPageEs = read("../landing/es/pricing.html");
const confirmedPage = read("../landing/confirmed.html");
const webhook = read("app/api/webhook/stripe/route.ts");
const firstLookPage = read("app/firstlook/page.tsx");
const sectorIntent = read("components/SectorIntent.tsx");
const liveSectors = read("lib/live-sectors.ts");
const pseoInsider = read("app/insider/page.tsx");
const pricingApi = read("app/api/v1/pricing.json/route.ts");
const checkoutDistinctId = read("components/CheckoutDistinctId.tsx");

const LIVE_SECTOR_SLUGS = [
  "healthcare",
  "edtech",
  "ecommerce-infrastructure",
  "supply-chain",
  "web3",
  "enterprise-saas",
  "data-infrastructure",
  "robotics",
  "legal-tech",
  "hr-tech",
  "proptech",
  "agtech",
  "gaming",
  "space-tech",
  "social-community",
];

const CANONICAL_DASHBOARD_ANNUAL = "https://buy.stripe.com/aFa5kC34DeZOawC6vS0x20c";
const CANONICAL_INSIDER_ANNUAL = "https://buy.stripe.com/cNieVc34DbNCcEK2fC0x20e";
const STALE_DASHBOARD_ANNUAL = "https://buy.stripe.com/5kQ8wO48H3h6cEKdYk0x20I";
const STALE_INSIDER_ANNUAL = "https://buy.stripe.com/bJe3cu48H3h6awC3jG0x20J";

test("First Look intent never reactivates or audience-adds a contact before explicit permission", () => {
  assert.doesNotMatch(firstLookIntent, /unsubscribed:\s*false/);
  assert.doesNotMatch(firstLookIntent, /await addToAudience\(/);
});

test("GitDealFlow ships no Meta or LinkedIn tracker or CSP allowance by default", () => {
  for (const source of [landingPixels, pseoPixels, landingCsp, pseoCsp]) {
    assert.doesNotMatch(source, /connect\.facebook\.net|snap\.licdn\.com/);
  }
});

test("GA4 mirrors PostHog events without replacing the SDK capture method", () => {
  assert.match(pseoPixels, /ph\.on\("eventCaptured"/);
  assert.doesNotMatch(pseoPixels, /ph\.capture=function/);
  assert.match(pseoPixels, /!ph\.__loaded/);
});

test("Dashboard checkout sends the browser PostHog ID to the server-side purchase join", () => {
  assert.match(dashboardPage, /function gdfDistinctId\(\)/);
  assert.match(dashboardPage, /ph_distinct_id:\s*gdfDistinctId\(\)/);
});

test("Checkout forms wait for the deferred PostHog tracker before reading the browser ID", () => {
  assert.match(checkoutDistinctId, /window\.setInterval/);
  assert.match(checkoutDistinctId, /window\.clearInterval/);
  assert.match(checkoutDistinctId, /posthog\?\.get_distinct_id\?\.\(\)/);
});

test("First Look uses the live 15-sector taxonomy everywhere it asks for a sector", () => {
  const actual = [...liveSectors.matchAll(/slug: "([a-z0-9-]+)"/g)].map((match) => match[1]);
  assert.deepEqual(actual, LIVE_SECTOR_SLUGS);
  assert.match(firstLookIntent, /import \{ LIVE_SECTOR_SET, LIVE_SECTOR_SLUGS \} from "@\/lib\/live-sectors"/);
  assert.match(sectorIntent, /import \{ LIVE_SECTORS \} from "@\/lib\/live-sectors"/);
  assert.doesNotMatch(firstLookPage, /19 tracked sectors|pre-Crunchbase/i);
});

test("all annual CTAs use the verified ten-month prices, not the stale nine-month links", () => {
  for (const page of [dashboardPage, pricingPage, pricingPageDe, pricingPageEs]) {
    assert.doesNotMatch(page, new RegExp(STALE_DASHBOARD_ANNUAL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(page, new RegExp(CANONICAL_DASHBOARD_ANNUAL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.doesNotMatch(page, /€441\/yr|&euro;441\/yr/);
  }
  for (const page of [insiderPage, pricingPage, pricingPageDe, pricingPageEs]) {
    assert.doesNotMatch(page, new RegExp(STALE_INSIDER_ANNUAL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(page, new RegExp(CANONICAL_INSIDER_ANNUAL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.doesNotMatch(page, /€1,773\/yr|&euro;1,773\/yr/);
  }
});

test("Dashboard and Insider describe current delivery without invented field counts or value anchors", () => {
  for (const page of [dashboardPage, pricingPage, pricingPageDe, pricingPageEs]) {
    assert.doesNotMatch(page, /140\+ startups|60\+ \/ 20/i);
  }
  for (const page of [dashboardPage, insiderPage]) {
    assert.doesNotMatch(page, /worth &euro;|Total value|&euro;157\/mo|&euro;236\/mo/i);
  }
  for (const page of [pseoInsider, pricingApi]) {
    assert.doesNotMatch(page, /€1,200\/yr value|€1,200 per year value/i);
  }
  assert.doesNotMatch(pseoInsider, /price:\s*97\b/);
  assert.match(pseoInsider, /price:\s*197\b/);
});

test("a verified subscriber can open a sample immediately without raw-email analytics", () => {
  assert.match(confirmedPage, /id="sample-issue-link" href="\/report"/);
  assert.match(confirmedPage, /sample_issue_opened/);
  assert.doesNotMatch(confirmedPage, /posthog\.identify\(identEmail\)/);
});

test("purchase analytics are emitted only with the browser distinct ID and never fall back to raw email", () => {
  assert.doesNotMatch(webhook, /distinct_id:\s*utm\.ph_distinct_id\s*\|\|\s*email/);
  assert.match(webhook, /if \(utm\.ph_distinct_id\)\s*\{/);
  assert.match(webhook, /distinct_id:\s*utm\.ph_distinct_id/);
});
