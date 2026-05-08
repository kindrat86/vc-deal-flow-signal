import { defineMetadata } from "@/lib/metadata";
import AccountBalanceClient from "./AccountBalanceClient";

// Per-account dashboard — gated by user-supplied API key, no public content
// to index. Marked noindex so Google doesn't surface the empty form as a
// match for "agent credits balance" queries.
export const metadata = defineMetadata({
  title: "Account · Agent Credits Balance",
  description:
    "Check your Agent Credits balance with the API key from your purchase confirmation email. Per-account dashboard for VC Deal Flow Signal.",
  path: "/account",
  noindex: true,
});

export default function AccountPage() {
  return <AccountBalanceClient />;
}
