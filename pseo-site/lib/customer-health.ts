import "server-only";

import { pickAudienceId } from "@/lib/resend-audience";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const STATE_PREFIX = "gdf-health-v1:";

export type CustomerHealthEvent =
  | "dashboard_viewed"
  | "signal_opened"
  | "watchlist_created"
  | "export_downloaded"
  | "magic_link_requested"
  | "billing_portal_opened"
  | "support_request_created";

type StoredHealth = {
  v: 1;
  tier?: "dashboard" | "insider";
  customerId?: string;
  purchasedAt?: string;
  startedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  winback90SentAt?: string;
  lastEventAt?: string;
  lastEventType?: CustomerHealthEvent;
  lastMeaningfulActivityAt?: string;
  billingPortalOpenedAt?: string;
  supportRequestCreatedAt?: string;
};

const MEANINGFUL_EVENTS = new Set<CustomerHealthEvent>([
  "dashboard_viewed",
  "signal_opened",
  "watchlist_created",
  "export_downloaded",
]);

function encodeHealth(state: StoredHealth): string {
  return `${STATE_PREFIX}${JSON.stringify(state)}`;
}

function decodeHealth(value: string | null | undefined): StoredHealth {
  if (!value?.startsWith(STATE_PREFIX)) return { v: 1 };
  try {
    const parsed = JSON.parse(value.slice(STATE_PREFIX.length)) as StoredHealth;
    return parsed?.v === 1 ? parsed : { v: 1 };
  } catch {
    return { v: 1 };
  }
}

async function audienceId(): Promise<string | null> {
  if (!RESEND_API_KEY) return null;
  const res = await fetch("https://api.resend.com/audiences", {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return pickAudienceId(await res.json()) ?? null;
}

async function findContact(audience: string, email: string): Promise<{ last_name?: string } | null> {
  if (!RESEND_API_KEY) return null;
  const res = await fetch(`https://api.resend.com/audiences/${audience}/contacts?limit=100`, {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const body = await res.json() as { data?: Array<{ email?: string; last_name?: string }> };
  return body.data?.find((contact) => contact.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function patchHealth(email: string, update: (state: StoredHealth) => StoredHealth): Promise<void> {
  const audience = await audienceId();
  if (!audience || !RESEND_API_KEY) return;
  const contact = await findContact(audience, email);
  if (!contact) return;
  const res = await fetch(
    `https://api.resend.com/audiences/${audience}/contacts/${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      // Resend's audience API returns only names, not arbitrary properties.
      // The versioned state token is deliberately stored in last_name, leaving
      // the existing first_name attribution untouched and readable by the cron.
      body: JSON.stringify({ last_name: encodeHealth(update(decodeHealth(contact.last_name))) }),
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`customer-health state write failed: ${res.status}`);
}

export function newBuyerHealthState(input: {
  tier: "dashboard" | "insider";
  customerId: string;
}): string {
  const now = new Date().toISOString();
  return encodeHealth({ v: 1, tier: input.tier, customerId: input.customerId, purchasedAt: now, startedAt: now });
}

export async function recordCustomerHealthEvent(input: {
  email: string;
  tier?: string;
  customerId?: string;
  event: CustomerHealthEvent;
}): Promise<void> {
  const now = new Date().toISOString();
  await patchHealth(input.email, (state) => ({
    ...state,
    tier: input.tier === "dashboard" || input.tier === "insider" ? input.tier : state.tier,
    customerId: input.customerId || state.customerId,
    lastEventAt: now,
    lastEventType: input.event,
    ...(MEANINGFUL_EVENTS.has(input.event) ? { lastMeaningfulActivityAt: now } : {}),
    ...(input.event === "billing_portal_opened" ? { billingPortalOpenedAt: now } : {}),
    ...(input.event === "support_request_created" ? { supportRequestCreatedAt: now } : {}),
  }));
}

export async function firstValueStatusForCustomer(email: string): Promise<"reached" | "not_reached" | "unknown"> {
  const audience = await audienceId();
  if (!audience) return "unknown";
  const contact = await findContact(audience, email);
  if (!contact) return "unknown";
  return decodeHealth(contact.last_name).lastMeaningfulActivityAt ? "reached" : "not_reached";
}

export async function markCustomerCancelled(input: { email: string; reason: string }): Promise<void> {
  const now = new Date().toISOString();
  await patchHealth(input.email, (state) => ({
    ...state,
    cancelledAt: now,
    cancellationReason: input.reason,
    winback90SentAt: undefined,
  }));
}

export async function markCustomerReactivated(email: string): Promise<void> {
  await patchHealth(email, (state) => ({
    ...state,
    cancelledAt: undefined,
    cancellationReason: undefined,
    winback90SentAt: undefined,
  }));
}

export async function markWinback90Sent(email: string): Promise<void> {
  const now = new Date().toISOString();
  await patchHealth(email, (state) => ({ ...state, winback90SentAt: now }));
}

export async function alertFounderOnBillingPortal(email: string): Promise<void> {
  if (!RESEND_API_KEY) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: "signals@gitdealflow.com",
      bcc: "sales@sipiteno.com",
      reply_to: FROM_EMAIL,
      subject: `Billing portal opened: ${email}`,
      html: `<p><strong>A paid customer opened the billing portal.</strong></p><p>Email: ${escapeHtml(email)}</p><p>Time: ${new Date().toISOString()}</p>`,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`billing portal alert failed: ${res.status}`);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character);
}
