import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getCustomerHealthSnapshot } from "@/lib/customer-health";
import {
  classifyCustomerRisk,
  type CustomerHealthSnapshot,
  type CustomerRisk,
} from "@/lib/customer-health-risk";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const RESEND_AUTHORIZATION = ["Bearer", RESEND_API_KEY || ""].join(" ");
const GDF_PRODUCT_NAMES = new Set(["dashboard", "insider circle"]);

type AtRiskCustomer = {
  email: string;
  tier: "dashboard" | "insider";
  subscriptionId: string;
  risk: CustomerRisk;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character);
}

async function productName(subscription: Stripe.Subscription): Promise<string | null> {
  const productRef = subscription.items.data[0]?.price.product;
  const productId = typeof productRef === "string" ? productRef : productRef?.id;
  if (!productId) return null;
  const product = await stripe.products.retrieve(productId);
  return product.deleted ? null : product.name.toLowerCase();
}

function tierFromSubscription(subscription: Stripe.Subscription): "dashboard" | "insider" {
  const amount = subscription.items.data[0]?.price.unit_amount || 0;
  return amount >= 9_700 ? "insider" : "dashboard";
}

export async function findAtRiskCustomers(now = new Date()): Promise<AtRiskCustomer[]> {
  const found: AtRiskCustomer[] = [];
  let startingAfter: string | undefined;

  do {
    const page = await stripe.subscriptions.list({
      status: "active",
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const subscription of page.data) {
      const name = await productName(subscription).catch(() => null);
      if (!name || !GDF_PRODUCT_NAMES.has(name)) continue;

      const customerId = typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted || !customer.email) continue;

      const tier = tierFromSubscription(subscription);
      const stored = await getCustomerHealthSnapshot(customer.email).catch(() => null);
      const snapshot: CustomerHealthSnapshot = {
        v: 1,
        tier,
        customerId,
        startedAt: new Date(subscription.created * 1000).toISOString(),
        ...stored,
      };
      const risk = classifyCustomerRisk(snapshot, now);
      if (risk.level === "critical" || risk.level === "at_risk") {
        found.push({ email: customer.email, tier, subscriptionId: subscription.id, risk });
      }
    }

    startingAfter = page.has_more ? page.data.at(-1)?.id : undefined;
  } while (startingAfter);

  return found;
}

function draftForReview(customer: AtRiskCustomer): string {
  const setupLine = customer.tier === "insider"
    ? "If useful, reply with three times for a 20-minute setup and I will help build your first watchlist."
    : "If useful, reply with your sector and stage focus and I will point you to the quickest first win.";
  return `Hi,\n\nI wanted to check that GitDealFlow is giving you a useful signal, not another tab to manage. ${setupLine}\n\nIf something is blocked, tell me what you expected to happen and I will help.\n\nThe Data Nerd`;
}

async function sendFounderAlert(customers: AtRiskCustomer[]): Promise<void> {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
  const rows = customers.map((customer) => `
    <section style="margin:0 0 24px;padding:16px;border:1px solid #cbd5e1;border-radius:8px">
      <p><strong>${escapeHtml(customer.email)}</strong> · ${escapeHtml(customer.tier)} · ${escapeHtml(customer.risk.level)}</p>
      <p>Reason: ${escapeHtml(customer.risk.reasons.join("; "))}</p>
      <p>Subscription: ${escapeHtml(customer.subscriptionId)}</p>
      <p><strong>Draft for review, do not auto-send:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(draftForReview(customer))}</pre>
    </section>`).join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: RESEND_AUTHORIZATION, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: "signals@gitdealflow.com",
      bcc: "sales@sipiteno.com",
      reply_to: FROM_EMAIL,
      subject: `GitDealFlow customer-health review: ${customers.length} at risk`,
      html: `<p>Weekly paid-customer health review. No customer was contacted.</p>${rows}`,
    }),
  });
  if (!response.ok) throw new Error(`customer-health alert failed: ${response.status}`);
}

export async function GET(request: NextRequest): Promise<Response> {
  const expectedAuthorization = ["Bearer", CRON_SECRET || ""].join(" ");
  if (!CRON_SECRET || request.headers.get("authorization") !== expectedAuthorization) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const customers = await findAtRiskCustomers();
  if (customers.length) await sendFounderAlert(customers);
  return NextResponse.json({ checked: true, atRisk: customers.length, alerted: customers.length > 0 });
}
