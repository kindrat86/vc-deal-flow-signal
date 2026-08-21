import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const read = (file) => readFileSync(resolve(root, file), "utf8");
const firstLookIntent = read("app/api/firstlook/intent/route.ts");
const landingPixels = read("../landing/pixels.js");
const pseoPixels = read("components/PixelManager.tsx");
const landingCsp = read("../landing/vercel.json");
const pseoCsp = read("next.config.ts");
const dashboardPage = read("../landing/dashboard.html");
const landingAbout = read("../landing/about.html");
const mechanismPage = read("app/mechanism/page.tsx");
const insiderPage = read("app/insider/page.tsx");
const affiliatesPage = read("app/affiliates/page.tsx");
const landingInsider = read("../landing/insider.html");
const annualOfferSources = [
  "../landing/pricing.html",
  "../landing/de/pricing.html",
  "../landing/es/pricing.html",
  "../landing/insider.html",
  "components/PricingLadder.tsx",
  "app/pricing/page.tsx",
  "app/api/v1/pricing.json/route.ts",
].map(read);

const LIVE_SECTORS = [
  "healthcare", "edtech", "ecommerce-infrastructure", "supply-chain", "web3",
  "enterprise-saas", "data-infrastructure", "robotics", "legal-tech", "hr-tech",
  "proptech", "agtech", "gaming", "space-tech", "social-community",
];

test("First Look preserves suppression and only accepts the public 15-sector taxonomy", () => {
  assert.doesNotMatch(firstLookIntent, /unsubscribed:\s*false/);
  assert.doesNotMatch(firstLookIntent, /addToAudience/);
  const block = firstLookIntent.match(/const VALID_SECTORS = new Set\(\[([\s\S]*?)\]\);/);
  assert.ok(block, "VALID_SECTORS must remain explicit and auditable");
  const sectors = [...block[1].matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sectors, LIVE_SECTORS);
});

test("GitDealFlow does not load paid pixels and does not grant them in CSP", () => {
  assert.match(landingPixels, /meta:\s*""/);
  assert.match(landingPixels, /linkedin:\s*""/);
  assert.match(pseoPixels, /const meta = ""/);
  assert.match(pseoPixels, /const linkedin = ""/);
  for (const source of [landingCsp, pseoCsp]) {
    assert.doesNotMatch(source, /connect\.facebook\.net|snap\.licdn\.com/);
  }
});

test("Inactive annual links and stale annual price paths stay absent", () => {
  for (const source of annualOfferSources) {
    assert.doesNotMatch(source, /aFa5kC34DeZOawC6vS0x20c|cNieVc34DbNCcEK2fC0x20e/);
  }
  assert.doesNotMatch(dashboardPage, /aFa5kC34DeZOawC6vS0x20c|€490\/yr|5kQ8wO48H3h6cEKdYk0x20I|€441\/yr/);
});

test("Dashboard checkout sends the browser PostHog ID to the server-side purchase join", () => {
  assert.match(dashboardPage, /function gdfDistinctId\(\)/);
  assert.match(dashboardPage, /ph_distinct_id:\s*gdfDistinctId\(\)/);
});

test("Expert Secrets public copy stays evidence-led", () => {
  assert.doesNotMatch(landingAbout, /Engineer for fifteen years|angel-checker since deal #5|219<\/strong> fundraises|fires before the round exists/);
  assert.match(landingAbout, /219 startup-period observations across 55 startups/);
  assert.match(mechanismPage, /diligence signal, not a financing forecast/);
  assert.doesNotMatch(mechanismPage, /19 sectors|19 tracked|3\.4×|0\.95 on the labeled cohort|top 25 ranked orgs|pre-Crunchbase/);
});

test("Insider and affiliate routes do not sell unverified delivery or performance", () => {
  assert.match(insiderPage, /Insider enrollment is not open/);
  assert.doesNotMatch(insiderPage, /€4,206|locked forever|same-day response|Sunday 09:00 UTC/);
  assert.match(landingInsider, /Insider enrollment is not open/);
  assert.doesNotMatch(landingInsider, /€197\/mo|private discussion|monthly briefings|capacity|Checkout/);
  assert.match(affiliatesPage, /Affiliate enrollment is not open/);
  assert.doesNotMatch(affiliatesPage, /€5,200\+ Platinum|11\.3% top CVR|20% lifetime/);
});
