import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCustomerBalanceCents } from "@/lib/stripe";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const cents = await getCustomerBalanceCents(session.customerId);
    return NextResponse.json({
      balanceCents: cents,
      balanceEur: (cents / 100).toFixed(2),
      tier: session.tier,
    });
  } catch (err) {
    console.error("Balance fetch failed:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
