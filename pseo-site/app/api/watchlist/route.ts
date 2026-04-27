import { NextRequest, NextResponse } from "next/server";
import { getEmailFromRequest } from "@/lib/auth";
import { sql } from "@/lib/db";

export interface WatchlistItem {
  id: number;
  email: string;
  startup_name: string;
  added_at: string;
  last_signal_type: string | null;
  last_velocity_change: number | null;
  last_notified_at: string | null;
  alert_on_accelerating: boolean;
  alert_on_new_peak: boolean;
}

export async function GET(req: NextRequest) {
  const user = await getEmailFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await sql`
    SELECT * FROM watchlist_items
    WHERE email = ${user.email}
    ORDER BY added_at DESC
  `;
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getEmailFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    startup_name?: string;
    alert_on_accelerating?: boolean;
    alert_on_new_peak?: boolean;
  };

  const { startup_name, alert_on_accelerating = true, alert_on_new_peak = true } = body;

  if (!startup_name || typeof startup_name !== "string") {
    return NextResponse.json({ error: "startup_name is required" }, { status: 400 });
  }

  const safeName = startup_name.slice(0, 200);

  const rows = await sql`
    INSERT INTO watchlist_items (email, startup_name, alert_on_accelerating, alert_on_new_peak)
    VALUES (${user.email}, ${safeName}, ${alert_on_accelerating}, ${alert_on_new_peak})
    ON CONFLICT (email, startup_name) DO UPDATE SET
      alert_on_accelerating = EXCLUDED.alert_on_accelerating,
      alert_on_new_peak = EXCLUDED.alert_on_new_peak
    RETURNING *
  `;

  return NextResponse.json({ item: rows[0] });
}
