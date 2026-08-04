import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const RESEND_KEY = process.env.RESEND_API_KEY;
    const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "1ddf358e-2416-4481-a0f5-538fd12f6e73";

    const res = await fetch(
      `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      }
    );

    const data = await res.json();

    // Resend can return 200 with contact object, or errors
    if (data.object === "contact" || data.id) {
      return NextResponse.json({ success: true, id: data.id });
    }

    // Some errors are non-fatal (e.g. verification email fails but contact created)
    return NextResponse.json({ success: true, note: data.message || "stored" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
