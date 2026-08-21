import { NextRequest, NextResponse } from "next/server";
import { pb } from "@/lib/pocketbase";
import { aggregateDailyMetrics, type ReferralEvent } from "@/lib/refgrow-analytics";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET;
const COLLECTION = "referral_events";

type StoredEvent = {
  event_id: string;
  event_type: ReferralEvent["eventType"];
  affiliate_id?: string;
  referral_id?: string;
  referral_status?: string;
  conversion_id?: string;
  conversion_value?: number;
  currency?: string;
  occurred_at: string;
  cancellation_state?: string;
};

type PbList<T> = { items: T[]; totalItems: number };

function dayBounds(day: string): { start: string; end: string } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error("invalid_day");
  return { start: `${day} 00:00:00.000Z`, end: `${day} 23:59:59.999Z` };
}

function toEvent(item: StoredEvent): ReferralEvent {
  return {
    eventId: item.event_id,
    eventType: item.event_type,
    affiliateId: item.affiliate_id || undefined,
    referralId: item.referral_id || undefined,
    status: item.referral_status || undefined,
    conversionId: item.conversion_id || undefined,
    conversionValue: typeof item.conversion_value === "number" ? item.conversion_value : undefined,
    currency: item.currency || undefined,
    occurredAt: item.occurred_at,
    cancellationState: item.cancellation_state || undefined,
  };
}

export async function GET(request: NextRequest): Promise<Response> {
  const authorization = request.headers.get("authorization");
  if (!CRON_SECRET || authorization !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const day = request.nextUrl.searchParams.get("day") ?? new Date().toISOString().slice(0, 10);
  let bounds: { start: string; end: string };
  try {
    bounds = dayBounds(day);
  } catch {
    return NextResponse.json({ error: "invalid_day" }, { status: 400 });
  }
  const records = await pb<PbList<StoredEvent>>(`/api/collections/${COLLECTION}/records`, {
    query: {
      filter: `occurred_at >= ${JSON.stringify(bounds.start)} && occurred_at <= ${JSON.stringify(bounds.end)}`,
      perPage: 500,
      sort: "+occurred_at",
    },
  });
  return NextResponse.json({ day, observedEvents: records.totalItems, ...aggregateDailyMetrics(records.items.map(toEvent)) });
}
