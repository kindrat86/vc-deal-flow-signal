#!/usr/bin/env node
/**
 * Configure Stripe webhook + Customer Portal so the new billing flow works.
 *
 * Idempotent:
 *  - finds the existing webhook endpoint (by URL match)
 *    and adds checkout.session.completed + customer.subscription.deleted
 *    if missing
 *  - reads/updates the Customer Portal configuration to allow
 *    subscription cancellation (enable if not already)
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Stripe from "stripe";

const envCandidates = [".env.production.local", ".env.local"];
let envPath = null;
for (const candidate of envCandidates) {
  const tryPath = resolve(process.cwd(), candidate);
  try {
    const text = readFileSync(tryPath, "utf8");
    if (/^STRIPE_SECRET_KEY=/m.test(text)) { envPath = tryPath; break; }
  } catch { /* missing */ }
}
for (const raw of readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq < 0) continue;
  const key = line.slice(0, eq).trim();
  let val = line.slice(eq + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  val = val.replace(/\\n/g, "\n").replace(/\\"/g, '"').trim();
  if (!process.env[key]) process.env[key] = val;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SITE = process.env.SITE_URL || "https://signals.gitdealflow.com";
const WEBHOOK_URL = `${SITE}/api/webhook/stripe`;

const REQUIRED_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.deleted",
];

console.log("--- Webhook configuration ---");
const webhooks = await stripe.webhookEndpoints.list({ limit: 100 });
let endpoint = webhooks.data.find((w) => w.url === WEBHOOK_URL);

if (!endpoint) {
  console.log(`No webhook found at ${WEBHOOK_URL}, creating...`);
  endpoint = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: REQUIRED_EVENTS,
    description: "GitDealFlow billing, checkout + subscription lifecycle",
  });
  console.log(`Created ${endpoint.id}`);
  console.log(`SECRET (set as STRIPE_WEBHOOK_SECRET): ${endpoint.secret}`);
} else {
  console.log(`Found existing webhook ${endpoint.id} (${endpoint.url})`);
  const have = new Set(endpoint.enabled_events);
  const missing = REQUIRED_EVENTS.filter((e) => !have.has(e) && !have.has("*"));
  if (missing.length === 0) {
    console.log("All required events already enabled.");
  } else {
    console.log(`Adding missing events: ${missing.join(", ")}`);
    const merged = Array.from(new Set([...endpoint.enabled_events, ...REQUIRED_EVENTS]));
    await stripe.webhookEndpoints.update(endpoint.id, { enabled_events: merged });
    console.log("Webhook updated.");
  }
  console.log(`Currently enabled: ${endpoint.enabled_events.join(", ")}`);
}

console.log("\n--- Customer Portal configuration ---");
const portalCfgs = await stripe.billingPortal.configurations.list({
  is_default: true,
  limit: 1,
});
let portalCfg = portalCfgs.data[0];

const desiredFeatures = {
  customer_update: { enabled: true, allowed_updates: ["email", "address", "tax_id"] },
  invoice_history: { enabled: true },
  payment_method_update: { enabled: true },
  subscription_cancel: {
    enabled: true,
    mode: "at_period_end",
    proration_behavior: "none",
  },
  subscription_update: {
    enabled: false, // we don't expose plan switches yet
  },
};

if (!portalCfg) {
  console.log("No default portal configuration found, creating...");
  portalCfg = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: "Manage your VC Deal Flow Signal subscription",
      privacy_policy_url: `${SITE}/privacy`,
      terms_of_service_url: `${SITE}/terms`,
    },
    features: desiredFeatures,
    default_return_url: `${SITE}/dashboard/billing`,
  });
  console.log(`Created portal config ${portalCfg.id}`);
} else {
  const cancelEnabled = portalCfg.features.subscription_cancel?.enabled;
  const updateAllowed = portalCfg.features.payment_method_update?.enabled;
  if (cancelEnabled && updateAllowed) {
    console.log(`Default portal config ${portalCfg.id} already has cancel + payment-method update enabled.`);
  } else {
    console.log(`Updating portal config ${portalCfg.id} to enable cancel + payment-method update...`);
    await stripe.billingPortal.configurations.update(portalCfg.id, {
      features: desiredFeatures,
    });
    console.log("Portal config updated.");
  }
}

console.log("\nDone.");
