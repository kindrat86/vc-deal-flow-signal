/**
 * Engine Room — iCalendar feed (RFC 5545).
 *
 * Brunson DotCom Secrets Ch 11, Phase 6 — second channel of the
 * environment shift. Subscribe URL pastes into iCal / Google Calendar /
 * Outlook / Fantastical and the monthly Stadium Pitch + quarterly
 * State-of-the-Engine post-mortem land as scheduled events.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 3600;

const SITE = "https://signals.gitdealflow.com";
const FEED_URL = `${SITE}/post-90/calendar.ics`;
const PRODID = "-//VC Deal Flow Signal//Engine Room//EN";
const CALNAME = "Engine Room — VC Deal Flow Signal";
const CALDESC =
  "Cohort calendar for the post-90 signal rhythm. Monthly founder talk (first Tuesday at 16:00 UTC) and quarterly State-of-the-Engine post-mortem (Day 90 / 180 / 270 / 365). Subscribe once — calendar apps auto-refresh.";

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function ical(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let i = 0;
  while (i < line.length) {
    const slice = line.slice(i, i + 75);
    parts.push(slice);
    i += 75;
  }
  return parts.join("\r\n ");
}

function firstTuesdayOfMonth(year: number, month0: number): Date {
  const d = new Date(Date.UTC(year, month0, 1, 16, 0, 0));
  while (d.getUTCDay() !== 2) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return d;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d.getTime());
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d.getTime());
  r.setUTCMonth(r.getUTCMonth() + n);
  return r;
}

type Event = {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description: string;
  url: string;
};

function buildEvents(now: Date): Event[] {
  const events: Event[] = [];

  for (let i = 0; i < 12; i++) {
    const ref = addMonths(now, i);
    const t = firstTuesdayOfMonth(ref.getUTCFullYear(), ref.getUTCMonth());
    if (t.getTime() < now.getTime() - 24 * 3600 * 1000) continue;
    const end = new Date(t.getTime() + 30 * 60 * 1000);
    const monthLabel = t.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
    events.push({
      uid: `stadium-${t.toISOString().slice(0, 7)}@gitdealflow.com`,
      start: t,
      end,
      summary: `Founder talk — ${monthLabel}`,
      description: `Monthly address from VC Deal Flow Signal. What the panel showed across 4,200+ venture-backed orgs this month, what shifted in the false-positive rate, and one falsifiable prediction on the record. Drops as a synthetic-voice video on the Engine Room podcast feed and the State of GitHub archive at signals.gitdealflow.com/state-of-github.`,
      url: `${SITE}/state-of-github`,
    });
  }

  const QUARTERS = [
    { days: 90, label: "Day 90" },
    { days: 180, label: "Day 180" },
    { days: 270, label: "Day 270" },
    { days: 365, label: "Day 365" },
  ];
  for (const q of QUARTERS) {
    const start = addDays(now, q.days);
    start.setUTCHours(16, 0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    events.push({
      uid: `post-mortem-${start.toISOString().slice(0, 10)}@gitdealflow.com`,
      start,
      end,
      summary: `State-of-the-Engine post-mortem — ${q.label}`,
      description: `Quarterly post-mortem. Reports back on the previous quarter's specific prediction (resolved on the public Receipts ledger at signals.gitdealflow.com/wins, append-only, no opinions) and lays a fresh falsifiable prediction for the next 90 days.`,
      url: `${SITE}/wins`,
    });
  }

  return events;
}

function renderEvent(e: Event, now: Date): string {
  const lines: string[] = [];
  lines.push("BEGIN:VEVENT");
  lines.push(`UID:${e.uid}`);
  lines.push(`DTSTAMP:${ical(now)}`);
  lines.push(`DTSTART:${ical(e.start)}`);
  lines.push(`DTEND:${ical(e.end)}`);
  lines.push(fold(`SUMMARY:${escapeText(e.summary)}`));
  lines.push(fold(`DESCRIPTION:${escapeText(e.description)}`));
  lines.push(fold(`URL:${e.url}`));
  lines.push("STATUS:CONFIRMED");
  lines.push("TRANSP:OPAQUE");
  lines.push("END:VEVENT");
  return lines.join("\r\n");
}

export async function GET() {
  const now = new Date();
  const events = buildEvents(now);

  const body =
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:${PRODID}`,
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${escapeText(CALNAME)}`,
      `X-WR-CALDESC:${escapeText(CALDESC)}`,
      "X-WR-TIMEZONE:UTC",
      "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
      "X-PUBLISHED-TTL:PT1H",
      ...events.map((e) => renderEvent(e, now)),
      "END:VCALENDAR",
    ].join("\r\n") + "\r\n";

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="engine-room.ics"',
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      Link: `<${FEED_URL}>; rel="canonical"`,
    },
  });
}
