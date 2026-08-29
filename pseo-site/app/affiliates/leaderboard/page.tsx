import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/affiliates" },
};

/**
 * /affiliates/leaderboard was retired 2026-08-29.
 *
 * The old page published unsupported top-earner, commission, and conversion
 * claims. The program has no publishable partner earnings history yet. If real
 * results accumulate in Refgrow, a leaderboard can return backed by data that
 * can be read back.
 */
export default function AffiliateLeaderboardPage() {
  redirect("/affiliates");
}
