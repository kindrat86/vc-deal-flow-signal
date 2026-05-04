import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://signals.gitdealflow.com";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", BASE_URL));
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: session.customerId,
      return_url: `${BASE_URL}/dashboard/billing`,
    });
    return NextResponse.redirect(portal.url, { status: 303 });
  } catch (err) {
    console.error("Stripe portal failed:", err);
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=portal-failed", BASE_URL)
    );
  }
}
