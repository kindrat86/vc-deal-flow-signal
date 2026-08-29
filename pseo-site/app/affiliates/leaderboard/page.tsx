import { redirect } from "next/navigation";

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
