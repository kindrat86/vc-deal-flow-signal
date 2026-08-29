import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { alertFounderOnBillingPortal, recordCustomerHealthEvent } from "@/lib/customer-health";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const SITE_ORIGIN = "https://signals.gitdealflow.com";

/**
 * Billing portal entry point. Opening the portal is the strongest pre-churn
 * signal we can observe: it is recorded to customer health (pre-churn
 * intervention input) and alerts the founder while the customer is still
 * in the product, not after the Stripe email.
 */
export async function GET(_req: NextRequest) {
  const account = await getSession();
  if (!account?.customerId) {
    return NextResponse.redirect(`${SITE_ORIGIN}/login`, 302);
  }

  try {
    await recordCustomerHealthEvent({
      email: account.email,
      tier: account.tier,
      customerId: account.customerId,
      event: "billing_portal_opened",
    });
    await alertFounderOnBillingPortal(account.email);
  } catch (error) {
    // A health-recording outage must never stop a customer from reaching
    // the billing portal.
    console.error("billing portal health/alert failed", error);
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: account.customerId,
      return_url: `${SITE_ORIGIN}/dashboard`,
    });
    return NextResponse.redirect(session.url, 302);
  } catch (error) {
    console.error("billing portal session failed", error);
    return NextResponse.redirect(`${SITE_ORIGIN}/dashboard?billing=error`, 302);
  }
}
