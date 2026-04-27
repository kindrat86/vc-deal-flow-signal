import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { sql } from "@/lib/db";
import { alertDigestEmail, type TriggeredAlert } from "@/lib/emails";

const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const SIGNALS_API = "https://signals.gitdealflow.com/api/signals.json";

interface SignalStartup {
  name: string;
  signalType: string;
  commitVelocityChange: string;
}

interface SignalsPayload {
  sectors: { startups: SignalStartup[] }[];
}

interface WatchlistRow {
  id: number;
  email: string;
  startup_name: string;
  last_signal_type: string | null;
  last_velocity_change: number | null;
  alert_on_accelerating: boolean;
  alert_on_new_peak: boolean;
}

function parseVelocityPct(raw: string): number {
  const n = parseInt(raw.replace(/[^0-9-]/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

async function sendEmail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    }),
  });
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch signals
  const signalsRes = await fetch(SIGNALS_API, { next: { revalidate: 0 } });
  if (!signalsRes.ok) {
    return NextResponse.json({ error: "Failed to fetch signals" }, { status: 502 });
  }
  const signalsData = (await signalsRes.json()) as SignalsPayload;

  // Build name -> startup map
  const byName = new Map<string, SignalStartup>();
  for (const sector of signalsData.sectors) {
    for (const s of sector.startups) {
      byName.set(s.name.toLowerCase(), s);
    }
  }

  // Load all watchlist items
  const rows = (await sql`SELECT * FROM watchlist_items`) as unknown as WatchlistRow[];

  // Evaluate alert rules per item
  const alertsByEmail = new Map<string, TriggeredAlert[]>();

  for (const row of rows) {
    const signal = byName.get(row.startup_name.toLowerCase());
    if (!signal) continue;

    const currentVelocity = parseVelocityPct(signal.commitVelocityChange);
    const prevVelocity = row.last_velocity_change ?? null;
    const prevSignalType = row.last_signal_type ?? null;

    const reasons: string[] = [];

    if (
      row.alert_on_accelerating &&
      (signal.signalType === "acceleration" || signal.signalType === "breakout") &&
      prevSignalType !== signal.signalType
    ) {
      reasons.push(`Signal flipped to ${signal.signalType}`);
    }

    if (
      row.alert_on_accelerating &&
      currentVelocity >= 50 &&
      (prevVelocity === null || currentVelocity > prevVelocity)
    ) {
      if (!reasons.some((r) => r.startsWith("Signal flipped"))) {
        reasons.push("Velocity ≥ 50% and accelerating");
      }
    }

    if (
      row.alert_on_new_peak &&
      prevVelocity !== null &&
      currentVelocity > prevVelocity
    ) {
      if (reasons.length === 0) {
        reasons.push("New velocity peak");
      }
    }

    if (reasons.length === 0) continue;

    const alert: TriggeredAlert = {
      startup_name: row.startup_name,
      reason: reasons[0],
      current_signal_type: signal.signalType,
      current_velocity_change: signal.commitVelocityChange,
    };

    const list = alertsByEmail.get(row.email) ?? [];
    list.push(alert);
    alertsByEmail.set(row.email, list);
  }

  const queueCount = [...alertsByEmail.values()].reduce((s, a) => s + a.length, 0);

  // Respond quickly; send emails and update DB in after()
  after(async () => {
    const now = new Date().toISOString();

    for (const [email, triggered] of alertsByEmail) {
      try {
        const { subject, html } = alertDigestEmail({ email, triggered });
        await sendEmail(email, subject, html);
      } catch {
        // best-effort; don't block DB updates
      }
    }

    // Update last_* for all items that had a live signal match
    for (const row of rows) {
      const signal = byName.get(row.startup_name.toLowerCase());
      if (!signal) continue;
      const currentVelocity = parseVelocityPct(signal.commitVelocityChange);
      const hadAlert = (alertsByEmail.get(row.email) ?? []).some(
        (a) => a.startup_name === row.startup_name
      );
      await sql`
        UPDATE watchlist_items SET
          last_signal_type = ${signal.signalType},
          last_velocity_change = ${currentVelocity},
          last_notified_at = ${hadAlert ? now : sql`last_notified_at`}
        WHERE id = ${row.id}
      `;
    }
  });

  return NextResponse.json({
    ok: true,
    usersAlerted: alertsByEmail.size,
    alertsQueued: queueCount,
  });
}
