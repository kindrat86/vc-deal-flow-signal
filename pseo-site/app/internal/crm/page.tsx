import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import { listDreamCustomers } from "@/lib/dream-customers";
import KanbanBoard from "@/components/internal/KanbanBoard";

export const metadata: Metadata = {
  title: "Dream Customers CRM",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DreamCustomersCRM() {
  const session = await getSession();
  if (!isAdmin(session)) {
    // Same response shape as a logged-out user — don't leak that this route
    // exists.
    redirect("/login");
  }

  const items = await listDreamCustomers();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Dream Customers</h1>
          <p className="text-xs text-neutral-400">
            {items.length} contacts · drag cards between columns · click ✎ to edit
          </p>
        </div>
        <div className="text-xs text-neutral-500">
          Signed in as {session?.email}
        </div>
      </header>
      <KanbanBoard initial={items} />
    </main>
  );
}
