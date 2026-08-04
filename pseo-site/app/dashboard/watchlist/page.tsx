import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import WatchlistManager from "./WatchlistManager";

export const metadata: Metadata = {
  title: "Watchlist",
  robots: { index: false },
};

export default async function WatchlistPage() {
  const session = await getSession();

  if (!session) redirect("/login");
  if (session.tier !== "insider") redirect("/dashboard");

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
        <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Watchlist</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-100 mb-2">Your Watchlist</h1>
      <p className="text-gray-400 mb-8">
        Startups you&apos;re tracking. Star companies in the dashboard table to add them here.
        Request email alerts when their signals change.
      </p>

      <WatchlistManager email={session.email} />
    </div>
  );
}
