import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "../..");
const repoRoot = path.resolve(appRoot, "..");
const read = (relative) => fs.readFileSync(path.join(repoRoot, relative), "utf8");

function json(relative) {
  return JSON.parse(read(relative));
}

test("customer support route answers operational buyer questions", () => {
  const support = read("pseo-site/app/support/page.tsx");
  for (const phrase of [
    "within one business day",
    "signals@gitdealflow.com",
    "Cancel or pause",
    "Invoices and receipts",
    "30-day refund",
    "Magic-link login",
    "API keys",
    "Support channels",
  ]) {
    assert.match(support, new RegExp(phrase, "i"), `support page missing: ${phrase}`);
  }
});

test("help and customer-facing landing routes converge on support", () => {
  const pseo = json("pseo-site/vercel.json");
  assert.ok(pseo.redirects.some((r) => r.source === "/help" && r.destination === "/support"));

  const landing = json("landing/vercel.json");
  for (const route of ["/help", "/support", "/contact", "/status", "/status.html"]) {
    assert.ok(
      landing.redirects.some((r) => r.source === route && r.destination === "https://signals.gitdealflow.com/support"),
      `${route} must redirect to the public support route`,
    );
  }
});

test("the internal portfolio status page is not deployable", () => {
  for (const relative of ["landing/status.html", "landing/de/status.html", "landing/es/status.html"]) {
    assert.equal(fs.existsSync(path.join(repoRoot, relative)), false, `${relative} still exists`);
  }
});

test("support expectations are published where buyers see them", () => {
  const about = read("pseo-site/app/about/page.tsx");
  const footer = read("pseo-site/components/Footer.tsx");
  const digest = read("pseo-site/lib/digest-email.ts");
  for (const source of [about, footer, digest]) {
    assert.match(source, /within one business day/i);
    assert.match(source, /\/support/);
  }
});

test("search corpus covers the core customer support intents", () => {
  const faqs = read("pseo-site/content/standalone-faqs.ts");
  for (const question of [
    "How do I cancel or pause my GitDealFlow subscription?",
    "How do I get a GitDealFlow invoice or receipt?",
    "What is GitDealFlow's refund policy?",
    "How do I fix a GitDealFlow magic-link login problem?",
    "How do I recover or reset a GitDealFlow API key?",
    "How quickly does GitDealFlow support reply?",
    "Which GitDealFlow channels provide customer support?",
    "What should I include in a GitDealFlow support request?",
  ]) {
    assert.match(faqs, new RegExp(question.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("higher-value buyers receive a human onboarding offer", () => {
  const webhook = read("pseo-site/app/api/webhook/stripe/route.ts");
  assert.match(webhook, /onboardingDripForTier/);
  assert.match(webhook, /20-minute setup/i);
  assert.match(webhook, /tier === "insider"/);
  assert.match(webhook, /within one business day/i);
});

test("a weekly customer-health cron detects risk without auto-emailing customers", () => {
  const config = json("pseo-site/vercel.json");
  assert.ok(config.crons.some((c) => c.path === "/api/cron/customer-health" && c.schedule === "0 8 * * 1"));
  const route = read("pseo-site/app/api/cron/customer-health/route.ts");
  assert.match(route, /findAtRiskCustomers/);
  assert.match(route, /to: "signals@gitdealflow.com"/);
  assert.match(route, /Draft for review/);
  assert.doesNotMatch(route, /to: customer\.email/);
});
