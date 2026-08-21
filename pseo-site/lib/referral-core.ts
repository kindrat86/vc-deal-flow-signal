/**
 * Custom checkout referral codes are disabled until their issuer, reward, and
 * fraud controls are implemented and tested. Refgrow remains the live
 * affiliate attribution system.
 */
export function isReferralEligibleTier(_tier: string): boolean {
  return false;
}
