import { redirect } from "next/navigation";

export const runtime = "nodejs";

/**
 * Root-level alias for `/api/agents.json` — some discovery agents expect a
 * top-level descriptor rather than an /api/ path. 308 redirect preserves
 * any query params and signals "permanent" so cachers persist the mapping.
 */
export async function GET() {
  redirect("/api/agents.json");
}
