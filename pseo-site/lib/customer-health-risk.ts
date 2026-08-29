const STATE_PREFIX = "gdf-health-v1:";
const DAY_MS = 86_400_000;

export type CustomerHealthSnapshot = {
  v: 1;
  tier?: "dashboard" | "insider";
  customerId?: string;
  purchasedAt?: string;
  startedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  lastEventAt?: string;
  lastEventType?: string;
  lastMeaningfulActivityAt?: string;
  billingPortalOpenedAt?: string;
  supportRequestCreatedAt?: string;
};

export type CustomerRisk = {
  level: "healthy" | "at_risk" | "critical" | "excluded";
  reasons: string[];
};

function dateOrNull(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function ageInDays(value: string | undefined, now: Date): number | null {
  const parsed = dateOrNull(value);
  if (!parsed) return null;
  return Math.floor((now.getTime() - parsed.getTime()) / DAY_MS);
}

export function decodeCustomerHealth(value: string | null | undefined): CustomerHealthSnapshot {
  if (!value?.startsWith(STATE_PREFIX)) return { v: 1 };
  try {
    const parsed = JSON.parse(value.slice(STATE_PREFIX.length)) as CustomerHealthSnapshot;
    return parsed?.v === 1 ? parsed : { v: 1 };
  } catch {
    return { v: 1 };
  }
}

export function classifyCustomerRisk(state: CustomerHealthSnapshot, now = new Date()): CustomerRisk {
  if (state.cancelledAt) {
    return { level: "excluded", reasons: ["subscription already cancelled"] };
  }

  const startedDays = ageInDays(state.startedAt || state.purchasedAt, now);
  if (startedDays !== null && startedDays < 7) {
    return { level: "healthy", reasons: ["inside seven-day activation grace period"] };
  }

  const billingPortalDays = ageInDays(state.billingPortalOpenedAt, now);
  if (billingPortalDays !== null && billingPortalDays <= 7) {
    return { level: "critical", reasons: ["opened the billing portal in the last seven days"] };
  }

  const supportDays = ageInDays(state.supportRequestCreatedAt, now);
  const meaningfulDays = ageInDays(state.lastMeaningfulActivityAt, now);
  if (supportDays !== null && supportDays <= 7 && (meaningfulDays === null || meaningfulDays >= supportDays)) {
    return { level: "critical", reasons: ["asked for support without a later first-value event"] };
  }

  if (meaningfulDays === null && startedDays !== null && startedDays >= 7) {
    return { level: "critical", reasons: ["has not reached first value after seven days"] };
  }

  if (meaningfulDays !== null && meaningfulDays >= 21) {
    return { level: "at_risk", reasons: ["no meaningful product activity for 21 days"] };
  }

  return { level: "healthy", reasons: ["recent meaningful product activity"] };
}
