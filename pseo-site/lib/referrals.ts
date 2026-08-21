import type Stripe from "stripe";

export type ReferralAttribution = {
  referralCode: string;
  promotionCodeId: string;
  referrerCustomerId: string;
  referrerEmail: string;
};

/**
 * No custom referral code is accepted until the reward contract and fraud
 * controls exist. This safe no-op ensures an arbitrary `ref` query string can
 * never discount checkout or leak referral metadata into Stripe.
 */
export async function getReferralAttribution(
  _stripe: Stripe,
  _referralCode: string | null,
): Promise<ReferralAttribution | null> {
  return null;
}
