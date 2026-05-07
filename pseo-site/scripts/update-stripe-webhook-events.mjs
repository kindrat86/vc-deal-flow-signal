#!/usr/bin/env node
// One-shot: ensure the live Stripe webhook listener for /api/webhook/stripe
// has the events the new one-click OTO flow needs.
//
// Reads STRIPE_SECRET_KEY from process.env (loaded from .env.local via
// `dotenv-cli`/`vercel env run` or set inline). Adds:
//   - payment_intent.succeeded   (Sector Sweep OTO)
//   - invoice.paid               (Insider OTO subscription)
// without dropping any events that were already enabled.
//
// Usage:
//   npx dotenv -e .env.local -- node scripts/update-stripe-webhook-events.mjs

import Stripe from "stripe";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2];
    if (v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1).replace(/\\n/g, "\n").replace(/\\"/g, '"');
    }
    process.env[m[1]] = v;
  }
} catch {
  // Fall back to whatever's in process.env already.
}

const REQUIRED_EVENTS = [
  "checkout.session.completed",
  "payment_intent.succeeded",
  "invoice.paid",
];

const ENDPOINT_PATH_HINT = "/api/webhook/stripe";

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("STRIPE_SECRET_KEY missing.");
    process.exit(2);
  }
  const stripe = new Stripe(key.trim());

  const list = await stripe.webhookEndpoints.list({ limit: 100 });
  const candidates = list.data.filter((e) => e.url.includes(ENDPOINT_PATH_HINT));

  if (candidates.length === 0) {
    console.error(
      `No webhook endpoint found whose URL contains "${ENDPOINT_PATH_HINT}".`
    );
    console.error("Available endpoints:");
    for (const e of list.data) console.error("  -", e.id, e.url);
    process.exit(3);
  }

  for (const ep of candidates) {
    const before = new Set(ep.enabled_events);
    const after = new Set([...before, ...REQUIRED_EVENTS]);
    const added = REQUIRED_EVENTS.filter((e) => !before.has(e));

    console.log(`Webhook ${ep.id}  →  ${ep.url}`);
    console.log(`  before: ${[...before].sort().join(", ")}`);
    console.log(`  to add: ${added.length ? added.join(", ") : "(none — already up to date)"}`);

    if (added.length === 0) continue;

    const updated = await stripe.webhookEndpoints.update(ep.id, {
      enabled_events: [...after],
    });
    console.log(`  after:  ${updated.enabled_events.sort().join(", ")}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
