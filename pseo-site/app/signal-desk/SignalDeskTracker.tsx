"use client";

import { useEffect } from "react";

type EventName = "signal_desk_offer_viewed" | "signal_desk_checkout_completed";

type Props = {
  event: EventName;
  investorType?: string;
  sectorCount?: number;
};

type PostHog = {
  capture?: (event: string, properties?: Record<string, unknown>) => void;
};

const BASE_PROPERTIES = {
  offer: "signal_desk_pilot",
  price_eur: 250,
  credit_toward_dashboard_eur: 490,
  seat_limit: 5,
};

export default function SignalDeskTracker({ event, investorType, sectorCount }: Props) {
  useEffect(() => {
    const posthog = (window as Window & { posthog?: PostHog }).posthog;
    posthog?.capture?.(event, {
      ...BASE_PROPERTIES,
      ...(investorType ? { investor_type: investorType } : {}),
      ...(typeof sectorCount === "number" ? { sector_count: sectorCount } : {}),
    });
  }, [event, investorType, sectorCount]);

  return null;
}

export { BASE_PROPERTIES };
