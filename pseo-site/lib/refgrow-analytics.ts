import crypto from "node:crypto";

export const REFGROW_EVENT_TYPES = new Set([
  "referral_signed_up",
  "referral_converted",
  "referral_canceled",
  "referral_updated",
]);

export type ReferralEventType =
  | "referral_signed_up"
  | "referral_converted"
  | "referral_canceled"
  | "referral_updated";

export type ReferralEvent = {
  eventId: string;
  eventType: ReferralEventType;
  affiliateId?: string;
  referralId?: string;
  status?: string;
  conversionId?: string;
  conversionValue?: number;
  currency?: string;
  occurredAt: string;
  cancellationState?: string;
};

export type DailyReferralMetrics = {
  activeReferrers: number;
  referralsCreated: number;
  acceptedReferrals: number;
  paidConversions: number;
  referralConversionRate: number;
  invitesPerActiveReferrer: number;
  kFactor: number;
  referredRevenue: Record<string, number>;
};

function signatureCandidates(header: string): string[] {
  return header
    .split(",")
    .flatMap((part) => part.trim().split("="))
    .filter((part) => /^[a-f0-9]{64}$/i.test(part));
}

export function verifyRefgrowSignature(
  rawBody: string,
  header: string | null,
  secret: string | undefined,
): boolean {
  if (!header || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBytes = Buffer.from(expected, "hex");
  return signatureCandidates(header).some((candidate) => {
    const candidateBytes = Buffer.from(candidate, "hex");
    return candidateBytes.length === expectedBytes.length && crypto.timingSafeEqual(candidateBytes, expectedBytes);
  });
}

function isAccepted(event: ReferralEvent): boolean {
  return event.status === "accepted" || event.status === "signed_up" || event.status === "paid";
}

export function aggregateDailyMetrics(events: ReferralEvent[]): DailyReferralMetrics {
  const deduped = [...new Map(events.map((event) => [event.eventId, event])).values()];
  const created = deduped.filter((event) => event.eventType === "referral_signed_up");
  const activeReferrers = new Set(created.map((event) => event.affiliateId).filter(Boolean)).size;
  const acceptedReferrals = new Set(created.filter(isAccepted).map((event) => event.referralId).filter(Boolean)).size;
  const cancelledConversions = new Set(
    deduped
      .filter((event) => event.eventType === "referral_canceled" || event.cancellationState === "canceled")
      .map((event) => event.conversionId)
      .filter(Boolean),
  );
  const conversions = deduped.filter(
    (event) => event.eventType === "referral_converted" && event.conversionId && !cancelledConversions.has(event.conversionId),
  );
  const referredRevenue: Record<string, number> = {};
  for (const conversion of conversions) {
    if (typeof conversion.conversionValue !== "number" || !conversion.currency) continue;
    const currency = conversion.currency.toUpperCase();
    referredRevenue[currency] = (referredRevenue[currency] ?? 0) + conversion.conversionValue;
  }
  const referralsCreated = new Set(created.map((event) => event.referralId || event.eventId)).size;
  const paidConversions = new Set(conversions.map((event) => event.conversionId)).size;
  const referralConversionRate = referralsCreated ? paidConversions / referralsCreated : 0;
  const invitesPerActiveReferrer = activeReferrers ? referralsCreated / activeReferrers : 0;
  return {
    activeReferrers,
    referralsCreated,
    acceptedReferrals,
    paidConversions,
    referralConversionRate,
    invitesPerActiveReferrer,
    kFactor: invitesPerActiveReferrer * referralConversionRate,
    referredRevenue,
  };
}

export function normalizeRefgrowEvent(payload: unknown): ReferralEvent | null {
  if (!payload || typeof payload !== "object") return null;
  const source = payload as Record<string, unknown>;
  const data = source.data && typeof source.data === "object" ? source.data as Record<string, unknown> : source;
  const eventType = typeof source.type === "string" ? source.type : typeof source.event === "string" ? source.event : "";
  if (!REFGROW_EVENT_TYPES.has(eventType)) return null;
  const text = (value: unknown) => typeof value === "string" && value.length ? value : undefined;
  const number = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : undefined;
  const eventId = text(source.id) ?? text(source.event_id) ?? text(data.id);
  if (!eventId) return null;
  return {
    eventId,
    eventType: eventType as ReferralEventType,
    affiliateId: text(data.affiliate_id) ?? text(data.referrer_id),
    referralId: text(data.referral_id) ?? text(data.referral?.toString()),
    status: text(data.status),
    conversionId: text(data.conversion_id),
    conversionValue: number(data.value) ?? number(data.amount),
    currency: text(data.currency)?.toUpperCase(),
    occurredAt: text(data.occurred_at) ?? text(source.created_at) ?? new Date().toISOString(),
    cancellationState: text(data.cancellation_state) ?? (eventType === "referral_canceled" ? "canceled" : undefined),
  };
}
