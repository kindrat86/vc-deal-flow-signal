import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordCustomerHealthEvent, type CustomerHealthEvent } from "@/lib/customer-health";

const EVENTS = new Set([
  "dashboard_viewed",
  "signal_opened",
  "watchlist_created",
  "export_downloaded",
  "billing_portal_opened",
  "support_request_created",
]);

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { event?: unknown } | null;
  const event = typeof body?.event === "string" ? body.event : "";
  if (!EVENTS.has(event)) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  try {
    await recordCustomerHealthEvent({
      email: session.email,
      tier: session.tier,
      customerId: session.customerId,
      event: event as CustomerHealthEvent,
    });
  } catch (error) {
    // Health tracking must never block the dashboard.
    console.error("customer health state write failed", error);
  }
  return NextResponse.json({ ok: true });
}
