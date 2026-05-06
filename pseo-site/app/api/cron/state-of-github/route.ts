import { NextResponse } from "next/server";
import {
  getAllSectors,
  getCurrentPeriod,
  getTopMoversThisWeek,
  getTotalTrackedThisWeek,
} from "@/lib/data";

/**
 * GET /api/cron/state-of-github
 *
 * Vercel Cron schedule: 0 9 1-7 * 3 (09:00 UTC every Wednesday whose
 * day-of-month falls in 1-7 — i.e. the FIRST Wednesday of every month).
 *
 * Drafts next month's "State of GitHub Engineering Velocity" address
 * from the live current period of /api/v1/signals.json. Returns a
 * structured JSON the founder pastes into ADDRESSES[] in
 * app/state-of-github/page.tsx, plus the underlying numbers used.
 *
 * The cron is intentionally read-only — it does NOT push to the page,
 * because every monthly address gets a human-edited "single sentence I
 * would give a partner" line that is the linchpin of the pitch and
 * cannot be auto-generated. The cron exists so:
 *   1. The address is always anchored to live numbers, not stale memory.
 *   2. The video pipeline (tools/video) consumes the same JSON to render
 *      the synthetic-narration version on the same cadence.
 *   3. There is a permanent, callable, observable artifact even if the
 *      founder is offline on a 1st-Wednesday morning.
 *
 * Auth: Vercel Cron auto-injects `?cron=1` and the Authorization header
 * `Bearer <CRON_SECRET>`; both are accepted. Manual triggers must pass
 * `?secret=<CRON_SECRET>`.
 *
 * See:
 *   - vercel.json crons array
 *   - app/state-of-github/page.tsx (consumer)
 *   - tools/video/scripts/* (synthetic-narration pipeline)
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Draft {
  generatedAt: string;
  forMonth: string;
  forSlug: string;
  publishDate: string;
  panel: {
    sectorsTracked: number;
    orgsTracked: number;
    period: { slug: string; name: string };
  };
  topMovers: Array<{
    sector: string;
    org: string;
    velocityChangePct: number;
    commitVelocity14d: number;
  }>;
  sectorAcceleration: Array<{
    sector: string;
    medianVelocityChangePct: number;
    orgs: number;
  }>;
  draftSections: {
    heading: string;
    body: string[];
  }[];
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function nextFirstWednesday(from = new Date()): Date {
  // Roll forward to the next 1st-of-month, then forward to the first Wed.
  const y = from.getUTCFullYear();
  const m = from.getUTCMonth();
  // Candidate = current month's 1st-of-month.
  let candidate = new Date(Date.UTC(y, m, 1));
  // If that 1st-Wed has already passed this month, jump to next month.
  const firstWed = (() => {
    const d = new Date(candidate);
    while (d.getUTCDay() !== 3) d.setUTCDate(d.getUTCDate() + 1);
    return d;
  })();
  if (firstWed.getTime() <= from.getTime()) {
    candidate = new Date(Date.UTC(y, m + 1, 1));
    while (candidate.getUTCDay() !== 3) {
      candidate.setUTCDate(candidate.getUTCDate() + 1);
    }
    return candidate;
  }
  return firstWed;
}

function monthName(d: Date): string {
  return d.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function checkAuth(req: Request): { ok: boolean; reason?: string } {
  const url = new URL(req.url);
  // Vercel Cron path identifier — when invoked by Vercel Cron the request
  // includes the Vercel cron header. We accept either explicit header,
  // bearer secret, or query secret for manual triggers.
  const cronHeader = req.headers.get("x-vercel-cron");
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (cronHeader === "1") return { ok: true };
  if (secret) {
    if (auth === `Bearer ${secret}`) return { ok: true };
    if (url.searchParams.get("secret") === secret) return { ok: true };
    return { ok: false, reason: "missing or invalid CRON_SECRET" };
  }
  // No CRON_SECRET configured — only accept Vercel cron header.
  if (cronHeader === "1") return { ok: true };
  return { ok: false, reason: "CRON_SECRET not configured" };
}

export async function GET(req: Request) {
  const startedAt = Date.now();
  const reqId =
    req.headers.get("x-vercel-id") ??
    `local-${Math.random().toString(36).slice(2, 10)}`;
  const triggeredBy = req.headers.get("x-vercel-cron") === "1" ? "cron" : "manual";

  const auth = checkAuth(req);
  if (!auth.ok) {
    console.warn(
      JSON.stringify({
        route: "/api/cron/state-of-github",
        reqId,
        triggeredBy,
        event: "unauthorized",
        reason: auth.reason ?? "unauthorized",
      })
    );
    return NextResponse.json(
      { ok: false, error: auth.reason ?? "unauthorized" },
      { status: 401 }
    );
  }

  try {
    const period = getCurrentPeriod();
    const sectors = getAllSectors();
    const totalTracked = getTotalTrackedThisWeek();
    const topMovers = getTopMoversThisWeek(10);

    // Per-sector median velocity change for the current period — feeds the
    // "three sector-level shifts you should plan around" section.
    const sectorAcceleration = sectors
      .map((sector) => {
        const snap = sector.periods[period.slug];
        if (!snap || !snap.startups || snap.startups.length === 0) {
          return null;
        }
        const pcts = snap.startups
          .map((s) => parseInt(s.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0)
          .filter((p) => Number.isFinite(p));
        return {
          sector: sector.name,
          medianVelocityChangePct: median(pcts),
          orgs: snap.startups.length,
        };
      })
      .filter((x): x is { sector: string; medianVelocityChangePct: number; orgs: number } => x !== null)
      .sort((a, b) => b.medianVelocityChangePct - a.medianVelocityChangePct);

    const target = nextFirstWednesday();
    const forMonth = monthName(target);
    const forSlug = forMonth.toLowerCase().replace(/\s+/g, "-");

    const top3 = sectorAcceleration.slice(0, 3);
    const draft: Draft = {
      generatedAt: new Date().toISOString(),
      forMonth,
      forSlug,
      publishDate: target.toISOString().slice(0, 10),
      panel: {
        sectorsTracked: sectors.length,
        orgsTracked: totalTracked,
        period: { slug: period.slug, name: period.name },
      },
      topMovers: topMovers.map((m) => ({
        sector: m.sectorName,
        org: m.name,
        velocityChangePct: m.velocityChangePct,
        commitVelocity14d: m.commitVelocity14d,
      })),
      sectorAcceleration: sectorAcceleration.slice(0, 12),
      draftSections: [
        {
          heading: "The single sentence I would give a partner this month",
          body: [
            // Linchpin sentence — must be human-edited before publish.
            "[HUMAN-EDIT REQUIRED] Replace this with the single sentence the partner needs to remember from " +
              forMonth +
              ". Source from the top-acceleration sector above; bias toward structural calls (sustained 2+ quarter trends) over weekly noise.",
          ],
        },
        {
          heading: "What the panel showed",
          body: [
            `Across ${totalTracked.toLocaleString("en-US")} venture-backed startup GitHub organizations and the ${period.slug} observation window, the panel ranked the following sector medians by velocity-change percentile: ${top3.map((s) => `${s.sector} (${s.medianVelocityChangePct}% median, n=${s.orgs})`).join("; ")}.`,
            "[HUMAN-EDIT] Add the false-positive fraction this quarter against the SSRN baseline (38%). Add the IQR for fundraise lead time across stages.",
          ],
        },
        {
          heading: "Three sector-level shifts you should plan around",
          body: top3.map(
            (s, i) =>
              `${i === 0 ? "First" : i === 1 ? "Second" : "Third"}, ${s.sector}: median commit-velocity change of ${s.medianVelocityChangePct}% across ${s.orgs} tracked orgs in the ${period.slug} window. [HUMAN-EDIT] Add the structural read — contributor-influx profile, Gini trend, or new-repo creation rate — that explains why this sector is moving the way it is.`
          ),
        },
        {
          heading: "What I changed about the methodology this month",
          body: [
            "[HUMAN-EDIT] List the methodology deltas shipped to /methodology since the last monthly address. Two changes is the typical cadence. Each change should specify how many false positives it eliminates against the panel.",
          ],
        },
        {
          heading: "What I'm watching next month",
          body: [
            "[HUMAN-EDIT] Three watches on a 30-day horizon. One should be a saturation check on the hottest sector above, one should be a crossover prediction between two sectors, one should be a structural sector that should pass a milestone if its trajectory holds.",
          ],
        },
        {
          heading: "Closing — the standing offer",
          body: [
            "Every monthly address ends with the same standing offer to readers who've made it this far. If you want the fundraise-precursor org names from this month — the ones that scored 5 of 6 on the composite and whose 90-day window is still open — they're inside the Insider Circle private Telegram, which is €97/month founding price, locked forever. The free Sunday digest gets you five names a week. The Custom Sector Sweep, €1,997 once, gets you a deep written report on any one of the sectors above.",
            `I publish this address on the first Wednesday of every month. Permanent canonical at /state-of-github with the previous twelve months indexed below. The synthetic-narration video at the top of the page is rendered from the same data — no founder face, no founder voice, no live broadcast. Text and synthetic narration only, both reproducible from the public panel.`,
            "Talk soon — The Data Nerd",
          ],
        },
      ],
    };

    const durationMs = Date.now() - startedAt;
    console.log(
      JSON.stringify({
        route: "/api/cron/state-of-github",
        reqId,
        triggeredBy,
        event: "draft_generated",
        forMonth: draft.forMonth,
        forSlug: draft.forSlug,
        publishDate: draft.publishDate,
        sectorsTracked: draft.panel.sectorsTracked,
        orgsTracked: draft.panel.orgsTracked,
        topMoversCount: draft.topMovers.length,
        sectorAccelerationCount: draft.sectorAcceleration.length,
        durationMs,
      })
    );

    return NextResponse.json(
      {
        ok: true,
        draft,
        instructions: {
          consume:
            "Paste the draft into the ADDRESSES array at app/state-of-github/page.tsx, replace [HUMAN-EDIT] markers, render the synthetic-narration video from tools/video against the same /api/v1/signals.json snapshot, then deploy.",
          videoPipeline:
            "tools/video/scripts/02-render.mjs reads the draft via stdin and emits the Remotion+Cartesia render. tools/video/scripts/05-upload.mjs publishes to YouTube channel UCSK4ZC9EJAHjHyncb5cSh8w with PUBLIC privacy.",
          authForRetrigger: process.env.CRON_SECRET
            ? "GET /api/cron/state-of-github?secret=$CRON_SECRET"
            : "set CRON_SECRET env var, then GET ?secret=$CRON_SECRET",
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex",
        },
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    const durationMs = Date.now() - startedAt;
    console.error(
      JSON.stringify({
        route: "/api/cron/state-of-github",
        reqId,
        triggeredBy,
        event: "draft_failed",
        error: msg,
        stack,
        durationMs,
      })
    );
    return NextResponse.json(
      { ok: false, error: msg, generatedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
