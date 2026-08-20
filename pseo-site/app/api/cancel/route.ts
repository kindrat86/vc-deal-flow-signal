import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSession } from "@/lib/auth";
import { getAllSectors, getCurrentPeriod, getSortedStartups } from "@/lib/data";
import { listUnsubscribeHeaders } from "@/lib/list-unsubscribe";
import {
  cancellationReasonLabel,
  isCancellationReason,
  saveActionForReason,
} from "@/lib/retention-policy";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const POSTHOG_KEY = "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX";
const SITE_ORIGIN = "https://signals.gitdealflow.com";

type CancelBody = {
  action?: unknown;
  reason?: unknown;
  sector?: unknown;
  geography?: unknown;
  checkSize?: unknown;
  thesis?: unknown;
  feedback?: unknown;
};

function text(value: unknown, limit = 500): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char);
}

async function capture(event: string, email: string, properties: Record<string, unknown>) {
  await fetch("https://eu.i.posthog.com/capture/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event,
      distinct_id: email,
      properties: { $host: "signals.gitdealflow.com", product: "gitdealflow", ...properties },
    }),
  }).catch(() => undefined);
}

async function activeSubscription(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 20,
    expand: ["data.items.data.price"],
  });
  return subscriptions.data.find((subscription: Stripe.Subscription) => ["active", "trialing", "past_due"].includes(subscription.status)) || null;
}

function startingSignal(sectorQuery: string) {
  const query = sectorQuery.toLowerCase();
  const sector = getAllSectors().find((item) => item.name.toLowerCase().includes(query) || item.slug.includes(query));
  if (!sector) return null;
  const snapshot = sector.periods[getCurrentPeriod().slug];
  const signal = snapshot ? getSortedStartups(snapshot.startups)[0] : null;
  if (!signal) return null;
  return { sector: sector.name, name: signal.name, signalType: signal.signalType, url: signal.githubUrl };
}

async function sendBuyerEmail(email: string, subject: string, html: string, scheduledAt?: string) {
  if (!RESEND_API_KEY) throw new Error("Email is temporarily unavailable");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      bcc: "sales@sipiteno.com",
      reply_to: FROM_EMAIL,
      subject,
      html,
      headers: listUnsubscribeHeaders(email),
      ...(scheduledAt ? { scheduled_at: scheduledAt } : {}),
    }),
  });
  if (!response.ok) throw new Error(`Email failed: ${response.status}`);
}

async function createPortal(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${SITE_ORIGIN}/dashboard` });
  return session.url;
}

export async function POST(request: NextRequest) {
  const account = await getSession();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as CancelBody | null;
  const action = body?.action;
  if (action === "start") {
    await capture("cancellation_started", account.email, { tier: account.tier, customer_id: account.customerId });
    return NextResponse.json({ ok: true });
  }
  const reason = body?.reason;
  if ((action !== "accept_save" && action !== "continue") || !isCancellationReason(reason)) {
    return NextResponse.json({ error: "Choose a cancellation reason." }, { status: 400 });
  }

  const sector = text(body?.sector);
  const geography = text(body?.geography);
  const checkSize = text(body?.checkSize);
  const thesis = text(body?.thesis);
  const feedback = text(body?.feedback, 2_000);
  const saveAction = saveActionForReason(reason);
  const eventProperties = { tier: account.tier, customer_id: account.customerId, reason, feedback, sector, geography, check_size: checkSize, thesis, save_action: saveAction };

  if (action === "continue") {
    await capture("cancellation_continue", account.email, eventProperties);
    const subscription = await activeSubscription(account.customerId);
    if (subscription) {
      await stripe.subscriptions.update(subscription.id, {
        metadata: {
          ...subscription.metadata,
          cancellation_reason: reason,
          cancellation_feedback: feedback,
        },
      });
    }
    const portalUrl = await createPortal(account.customerId);
    return NextResponse.json({ portalUrl });
  }

  if (saveAction === "pause_30d") {
    if (!sector) return NextResponse.json({ error: "Add a sector so we can send a relevant signal before restart." }, { status: 400 });
    const subscription = await activeSubscription(account.customerId);
    if (!subscription) return NextResponse.json({ error: "No active subscription was found. You can cancel in Stripe." }, { status: 409 });
    const signal = startingSignal(sector);
    if (!signal) return NextResponse.json({ error: "We could not match that sector. Try one of the tracked sector names." }, { status: 400 });
    const resumesAt = Math.floor(Date.now() / 1_000) + 30 * 86_400;
    await stripe.subscriptions.update(subscription.id, { pause_collection: { behavior: "void", resumes_at: resumesAt } });
    const sendAt = new Date((resumesAt - 86_400) * 1_000).toISOString();
    await sendBuyerEmail(
      account.email,
      `Your ${signal.sector} signal before GitDealFlow restarts`,
      `<p>Your 30-day pause ends tomorrow.</p><p>One current ${escapeHtml(signal.sector)} starting point: <strong>${escapeHtml(signal.name)}</strong>, ${escapeHtml(signal.signalType)}.</p><p><a href="${escapeHtml(signal.url)}">Review the public GitHub signal</a> or <a href="https://signals.gitdealflow.com/dashboard">open GitDealFlow</a>.</p>`,
      sendAt,
    );
    await capture("cancellation_saved", account.email, { ...eventProperties, save_action: "pause_30d", resume_at: new Date(resumesAt * 1_000).toISOString() });
    return NextResponse.json({ message: "Your subscription is paused for 30 days. We scheduled one current sector signal for the day before it restarts." });
  }

  if (saveAction === "one_month_37") {
    const subscription = await activeSubscription(account.customerId);
    if (!subscription) return NextResponse.json({ error: "No active subscription was found. You can cancel in Stripe." }, { status: 409 });
    const amount = subscription.items.data[0]?.price.unit_amount;
    if (amount !== 4_900 || subscription.currency !== "eur") {
      return NextResponse.json({ error: "The €37 save is available only on the current €49 monthly plan. You can still cancel cleanly in Stripe." }, { status: 409 });
    }
    const coupon = await stripe.coupons.create({ amount_off: 1_200, currency: "eur", duration: "once", name: "GitDealFlow one-month save", metadata: { source: "cancellation_save", reason } });
    await stripe.subscriptions.update(subscription.id, { discounts: [{ coupon: coupon.id }] });
    await capture("cancellation_saved", account.email, { ...eventProperties, save_action: "one_month_37", coupon_id: coupon.id });
    return NextResponse.json({ message: "The next monthly invoice is €37. After that single invoice, your plan returns to €49 per month." });
  }

  if (saveAction === "tailored_starting_point") {
    if (!sector) return NextResponse.json({ error: "Add a sector so we can send one useful starting point." }, { status: 400 });
    const signal = startingSignal(sector);
    if (!signal) return NextResponse.json({ error: "We could not match that sector. Try one of the tracked sector names." }, { status: 400 });
    await sendBuyerEmail(
      account.email,
      `A ${signal.sector} starting point for your thesis`,
      `<p>You said GitDealFlow felt ${escapeHtml(cancellationReasonLabel(reason).toLowerCase())}.</p><p>Start with <strong>${escapeHtml(signal.name)}</strong>, a current ${escapeHtml(signal.signalType)} signal in ${escapeHtml(signal.sector)}.</p><p>Context received: geography ${escapeHtml(geography || "not specified")}, check size ${escapeHtml(checkSize || "not specified")}, thesis ${escapeHtml(thesis || "not specified")}.</p><p><a href="${escapeHtml(signal.url)}">Review the public GitHub signal</a> or <a href="https://signals.gitdealflow.com/dashboard">open GitDealFlow</a>.</p>`,
    );
    await capture("cancellation_saved", account.email, { ...eventProperties, save_action: "tailored_starting_point", signal: signal.name });
    return NextResponse.json({ message: "We sent one current sector signal to your inbox. You can still cancel if it is not useful." });
  }

  return NextResponse.json({ error: "Use Continue cancelling to finish in Stripe." }, { status: 400 });
}
