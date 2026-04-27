import { NextRequest, NextResponse } from "next/server";
import { getEmailFromRequest } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const user = await getEmailFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await params;
  const startupName = decodeURIComponent(name);

  await sql`
    DELETE FROM watchlist_items
    WHERE email = ${user.email} AND startup_name = ${startupName}
  `;

  return NextResponse.json({ ok: true });
}
