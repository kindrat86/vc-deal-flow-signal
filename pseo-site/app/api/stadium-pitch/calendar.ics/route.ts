/**
 * Stadium Pitch, recurring monthly .ics calendar invite.
 *
 * Returns an RFC 5545 VCALENDAR with a single VEVENT carrying an
 * RRULE=FREQ=MONTHLY;BYDAY=1WE rule. Once the user imports this once, every
 * future first-Wednesday-of-the-month drop appears in their calendar
 * automatically, no need to re-download.
 *
 * Why force-static: the body is fully deterministic. DTSTART is anchored to
 * a fixed past instance (the May 2026 drop, the first one in the series);
 * the RRULE generates every future instance. The output never changes, so
 * the route bakes once at build, ships from CDN, and the client's calendar
 * app handles all future timestamps.
 *
 * The 90-min duration is intentional: covers the Brunson "doors open" arc
 * (the 90-second video, the 12-minute address, plus headroom for inbox
 * skim time inside the recipient's calendar block).
 */

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";
const FIRST_INSTANCE_UTC = "20260506T090000Z"; // Wed 06 May 2026 · 09:00 UTC
const DURATION = "PT1H30M"; // 90 minutes

function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function fold(line: string): string {
  // RFC 5545 §3.1: lines longer than 75 octets must be folded with
  // CRLF + space. Short folder, assumes UTF-8 ≈ 1 byte per ascii char.
  const limit = 75;
  if (line.length <= limit) return line;
  const parts: string[] = [];
  for (let i = 0; i < line.length; i += limit) {
    const chunk = line.slice(i, i + limit);
    parts.push(i === 0 ? chunk : ` ${chunk}`);
  }
  return parts.join("\r\n");
}

export async function GET() {
  // Observability note: this route is force-static, so it executes once at
  // build time and ships from the CDN forever after. There is no
  // request-time failure path, any error here would surface as a build
  // failure, not a user-visible 500. The try/catch below is a defense
  // against future edits that introduce non-deterministic content (e.g.,
  // a date constant typo), it logs with enough context to debug from CI.
  try {
    const summary = escapeIcs(
      "VC Deal Flow Signal, State of GitHub Engineering Velocity",
    );
    const description = escapeIcs(
      [
        "Monthly Stadium Pitch, written address + 90-second synthetic-voice video.",
        "",
        "Three sector-level shifts to plan around. Methodology delta from prior month.",
        "One structural call for any investor reading code-side momentum signals.",
        "",
        "Read at " + SITE + "/state-of-github",
      ].join("\n"),
    );
    const url = SITE + "/state-of-github";
    const location = escapeIcs(url);
    const uid = "stadium-pitch-monthly@gitdealflow.com";

    const now = new Date();
    const dtStamp = now
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//VC Deal Flow Signal//Stadium Pitch//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${FIRST_INSTANCE_UTC}`,
      `DURATION:${DURATION}`,
      "RRULE:FREQ=MONTHLY;BYDAY=1WE",
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `URL:${url}`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "END:VEVENT",
      "END:VCALENDAR",
    ].map(fold);

    const body = lines.join("\r\n") + "\r\n";

    console.log(
      `[stadium-pitch:ics] generated len=${body.length} dtstart=${FIRST_INSTANCE_UTC}`,
    );

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="state-of-github-monthly.ics"',
        "Cache-Control": "public, s-maxage=86400, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[stadium-pitch:ics] generation failed", err);
    // Re-throw so the build surfaces the failure rather than shipping an
    // empty/broken ics file to subscribers' calendars.
    throw err;
  }
}
