import { NextRequest, NextResponse } from "next/server";
import { pb } from "@/lib/pocketbase";
import {
  normalizeRefgrowEvent,
  verifyRefgrowSignature,
  type ReferralEvent,
} from "@/lib/refgrow-analytics";

export const dynamic = "force-dynamic";

const REFGROW_WEBHOOK_SECRET = process.env.REFGROW_WEBHOOK_SECRET;
const COLLECTION = "referral_events";

type PbList<T> = { items: T[] };

async function ensureReferralEventCollection(): Promise<void> {
  try {
    await pb(`/api/collections/${COLLECTION}`);
    return;
  } catch {
    // The collection is intentionally event-only: no names, emails, IPs, or customer records.
    await pb("/api/collections", {
      method: "POST",
      body: {
        name: COLLECTION,
        type: "base",
        schema: [
          { name: "event_id", type: "text", required: true, unique: true },
          { name: "event_type", type: "text", required: true },
          { name: "affiliate_id", type: "text" },
          { name: "referral_id", type: "text" },
          { name: "referral_status", type: "text" },
          { name: "conversion_id", type: "text" },
          { name: "conversion_value", type: "number" },
          { name: "currency", type: "text" },
          { name: "occurred_at", type: "text", required: true },
          { name: "cancellation_state", type: "text" },
        ],
      },
    });
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const rawBody = await request.text();
  const signature = request.headers.get("x-refgrow-signature") ?? request.headers.get("refgrow-signature");
  if (!verifyRefgrowSignature(rawBody, signature, REFGROW_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const event = normalizeRefgrowEvent(payload);
  if (!event) return NextResponse.json({ received: true, ignored: true });

  await ensureReferralEventCollection();
  const existing = await pb<PbList<{ id: string }>>(`/api/collections/${COLLECTION}/records`, {
    query: { filter: `event_id = ${JSON.stringify(event.eventId)}`, perPage: 1 },
  });
  if (existing.items.length) return NextResponse.json({ received: true, duplicate: true });

  // Do not add sender, customer, or referrer email. This is the full analytics record.
  await pb(`/api/collections/${COLLECTION}/records`, {
    method: "POST",
    body: {
      event_id: event.eventId,
      event_type: event.eventType,
      affiliate_id: event.affiliateId ?? "",
      referral_id: event.referralId ?? "",
      referral_status: event.status ?? "",
      conversion_id: event.conversionId ?? "",
      conversion_value: event.conversionValue ?? null,
      currency: event.currency ?? "",
      occurred_at: event.occurredAt,
      cancellation_state: event.cancellationState ?? "",
    },
  });
  return NextResponse.json({ received: true });
}
