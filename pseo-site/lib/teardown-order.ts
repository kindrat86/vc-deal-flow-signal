import { createHash } from "node:crypto";
import type Stripe from "stripe";

import { TESTER_EMAILS } from "./excluded-emails";

export const TEARDOWN_PAYMENT_LINK_ID = "plink_1TU4ZvCwGoUDklReEjuprkH0";
export const TEARDOWN_OFFER_VERSION = "teardown_v2";
export const TEARDOWN_CONFIRMATION_FROM = "The Data Nerd <signals@gitdealflow.com>";
export const TEARDOWN_CONFIRMATION_REPLY_TO = "signals@gitdealflow.com";
export const TEARDOWN_CONFIRMATION_BCC = "sales@sipiteno.com";
export const TEARDOWN_STARTUP_MAX_LENGTH = 200;

const MOJIBAKE_MARKERS = ["‚Ä", "Ã", "Â", "â€", "�"] as const;

export interface TeardownOrder {
  sessionId: string;
  buyerEmail: string;
  startupRaw: string;
  startup: string;
  paymentCreatedAt: string;
  dueAt: string;
  offerVersion: typeof TEARDOWN_OFFER_VERSION;
  ticketRef: string;
}

export type TeardownOrderResult =
  | { status: "ready"; order: TeardownOrder }
  | { status: "needs_clarification"; sessionId: string; buyerEmail: string; dueAt: string; ticketRef: string }
  | { status: "internal_qa"; reason: string }
  | { status: "rejected"; reason: string };

export interface TeardownConfirmationPayload {
  from: typeof TEARDOWN_CONFIRMATION_FROM;
  replyTo: typeof TEARDOWN_CONFIRMATION_REPLY_TO;
  bcc: typeof TEARDOWN_CONFIRMATION_BCC;
  to: string;
  subject: string;
  text: string;
}

function paymentLinkId(session: Stripe.Checkout.Session): string | null {
  return typeof session.payment_link === "string"
    ? session.payment_link
    : session.payment_link?.id ?? null;
}

function customerEmail(session: Stripe.Checkout.Session): string | null {
  const email = session.customer_details?.email?.trim().toLowerCase();
  return email && /^\S+@\S+\.\S+$/.test(email) ? email : null;
}

function isInternalQa(session: Stripe.Checkout.Session, email: string): boolean {
  const marker = session.metadata?.internal_qa?.trim().toLowerCase();
  return marker === "true" || marker === "1" || marker === "yes" || TESTER_EMAILS.has(email);
}

export function parseStartupCustomField(
  customFields: Stripe.Checkout.Session["custom_fields"],
): { raw: string; value: string } | null {
  const field = customFields?.find((candidate) => candidate.key === "startup");
  if (!field || field.type !== "text") return null;
  const raw = field.text?.value;
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (
    !value ||
    value.length > TEARDOWN_STARTUP_MAX_LENGTH ||
    /[\u0000-\u001f\u007f]/.test(raw)
  ) return null;
  return { raw, value };
}

export function teardownDueAt(created: number): string {
  return new Date((created + 24 * 60 * 60) * 1000).toISOString();
}

export function teardownTicketRef(sessionId: string): string {
  const digest = createHash("sha256").update(sessionId).digest("hex").slice(0, 10).toUpperCase();
  return `TT-${digest}`;
}

export function teardownIdempotencyKey(sessionId: string): string {
  return `teardown-confirmation-v2-${sessionId}`;
}

export function assertSafeEmailEncoding(...parts: string[]): void {
  const serialized = parts.join("\n");
  const marker = MOJIBAKE_MARKERS.find((candidate) => serialized.includes(candidate));
  if (marker) throw new Error(`Unsafe email encoding marker: ${marker}`);
}

export function buildTeardownOrder(session: Stripe.Checkout.Session): TeardownOrderResult {
  if (paymentLinkId(session) !== TEARDOWN_PAYMENT_LINK_ID) {
    return { status: "rejected", reason: "payment_link" };
  }
  if (
    session.livemode !== true ||
    session.status !== "complete" ||
    session.payment_status !== "paid" ||
    session.currency?.toLowerCase() !== "eur" ||
    session.amount_total !== 100
  ) {
    return { status: "rejected", reason: "payment_state" };
  }
  const email = customerEmail(session);
  if (!email) return { status: "rejected", reason: "buyer_email" };
  if (isInternalQa(session, email)) return { status: "internal_qa", reason: "owner_or_internal_qa" };
  if (!Number.isInteger(session.created) || session.created <= 0) {
    return { status: "rejected", reason: "created" };
  }

  const dueAt = teardownDueAt(session.created);
  const ticketRef = teardownTicketRef(session.id);
  const startup = parseStartupCustomField(session.custom_fields);
  if (!startup) {
    return { status: "needs_clarification", sessionId: session.id, buyerEmail: email, dueAt, ticketRef };
  }

  return {
    status: "ready",
    order: {
      sessionId: session.id,
      buyerEmail: email,
      startupRaw: startup.raw,
      startup: startup.value,
      paymentCreatedAt: new Date(session.created * 1000).toISOString(),
      dueAt,
      offerVersion: TEARDOWN_OFFER_VERSION,
      ticketRef,
    },
  };
}

export function buildTeardownConfirmation(order: TeardownOrder): TeardownConfirmationPayload {
  const subject = `Tweet Teardown confirmed: ${order.startup}`;
  const text = `Hi,

Payment received for your Tweet Teardown.

Startup: ${order.startup}
Delivery due: ${order.dueAt}

The 24-hour clock started when payment succeeded. No reply is required.

Optional: reply with the public GitHub organization URL or one sentence on whether you are bullish, skeptical, or simply curious.

If no attributable public GitHub organization exists, you will receive a verified coverage verdict and can submit one replacement startup at no charge.

Maryan K.
`;
  assertSafeEmailEncoding(
    TEARDOWN_CONFIRMATION_FROM,
    TEARDOWN_CONFIRMATION_REPLY_TO,
    TEARDOWN_CONFIRMATION_BCC,
    order.buyerEmail,
    subject,
    text,
  );
  return {
    from: TEARDOWN_CONFIRMATION_FROM,
    replyTo: TEARDOWN_CONFIRMATION_REPLY_TO,
    bcc: TEARDOWN_CONFIRMATION_BCC,
    to: order.buyerEmail,
    subject,
    text,
  };
}
