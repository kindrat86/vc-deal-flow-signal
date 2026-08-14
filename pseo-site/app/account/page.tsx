import Link from "next/link";
import { defineMetadata } from "@/lib/metadata";
import AccountBalanceClient from "./AccountBalanceClient";

// Per-account dashboard, gated by user-supplied API key, no public content
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
  return (
    <>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-sm text-gray-400">
        Not here for agent credits?{" "}
        <Link
          href="/pricing"
          className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
        >
          See the plans →
        </Link>
      </div>
      <AccountBalanceClient />
    </>
  );
}
