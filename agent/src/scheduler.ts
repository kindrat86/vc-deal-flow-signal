/**
 * Signal Analyst Agent — Scheduler
 *
 * Cron-based autonomous trigger. Runs the agent on a weekly cycle
 * (Sunday at 06:00 UTC for the Sunday Digest) plus a mid-week pulse
 * (Wednesday at 06:00 UTC) for breakout detection.
 *
 * Also supports manual triggers via the Agent HQ dashboard.
 */

import cron from "node-cron";
import * as memory from "./memory.js";
import { runAgentCycle } from "./index.js";

// ─── Schedule Configuration ────────────────────────────────────────────

// Sunday 06:00 UTC — full weekly cycle (Sunday Digest goes out)
const WEEKLY_CRON = "0 6 * * 0"; // minute=0, hour=6, day-of-week=0 (Sunday)

// Wednesday 06:00 UTC — mid-week pulse (check for breakouts)
const MIDWEEK_CRON = "0 6 * * 3"; // minute=0, hour=6, day-of-week=3 (Wednesday)

let weeklyTask: cron.ScheduledTask | null = null;
let midweekTask: cron.ScheduledTask | null = null;
let isRunning = false;
let shutdownRequested = false;

// ─── Cycle Runner ──────────────────────────────────────────────────────

async function runWeekly(): Promise<void> {
  if (isRunning) {
    console.log("[scheduler] Skipping weekly cycle — previous cycle still running");
    return;
  }
  console.log("[scheduler] ★ Starting weekly cycle (Sunday Digest)");
  await executeCycle("weekly");
}

async function runMidweek(): Promise<void> {
  if (isRunning) {
    console.log("[scheduler] Skipping midweek pulse — cycle already running");
    return;
  }
  console.log("[scheduler] ► Starting midweek pulse");
  await executeCycle("midweek");
}

async function executeCycle(type: "weekly" | "midweek" | "manual"): Promise<void> {
  isRunning = true;
  try {
    await runAgentCycle(type);
  } catch (err) {
    console.error(`[scheduler] Cycle ${type} failed:`, err);
    await memory.setAgentStatus("error", String(err));
  } finally {
    isRunning = false;

    // Schedule next run
    if (!shutdownRequested) {
      const nextRun = type === "weekly"
        ? getNextWeeklyRun()
        : getNextMidweekRun();
      await memory.setNextRun(nextRun);
    }
  }
}

// ─── Next-Run Calculation ──────────────────────────────────────────────

function getNextWeeklyRun(): Date {
  const now = new Date();
  const next = new Date(now);
  // Set to next Sunday 06:00 UTC
  next.setUTCDate(next.getUTCDate() + ((7 - next.getUTCDay()) % 7 || 7));
  next.setUTCHours(6, 0, 0, 0);
  if (next <= now) next.setUTCDate(next.getUTCDate() + 7);
  return next;
}

function getNextMidweekRun(): Date {
  const now = new Date();
  const next = new Date(now);
  // Set to next Wednesday 06:00 UTC
  const daysUntilWednesday = (3 - next.getUTCDay() + 7) % 7 || 7;
  next.setUTCDate(next.getUTCDate() + daysUntilWednesday);
  next.setUTCHours(6, 0, 0, 0);
  if (next <= now) next.setUTCDate(next.getUTCDate() + 7);
  return next;
}

// ─── Start / Stop ──────────────────────────────────────────────────────

export function startScheduler(): void {
  console.log("[scheduler] Starting Signal Analyst Agent scheduler");
  console.log(`[scheduler] Weekly cycle:  Sunday 06:00 UTC (${WEEKLY_CRON})`);
  console.log(`[scheduler] Midweek pulse: Wednesday 06:00 UTC (${MIDWEEK_CRON})`);

  weeklyTask = cron.schedule(WEEKLY_CRON, runWeekly, {
    timezone: "UTC",
    scheduled: true,
  });

  midweekTask = cron.schedule(MIDWEEK_CRON, runMidweek, {
    timezone: "UTC",
    scheduled: true,
  });

  // Set initial next-run times
  memory.setNextRun(getNextWeeklyRun());
  memory.setAgentStatus("idle");

  const nextWeekly = getNextWeeklyRun();
  const nextMidweek = getNextMidweekRun();
  console.log(`[scheduler] Next weekly run:  ${nextWeekly.toISOString()}`);
  console.log(`[scheduler] Next midweek run: ${nextMidweek.toISOString()}`);
}

export function stopScheduler(): void {
  console.log("[scheduler] Stopping scheduler...");
  shutdownRequested = true;

  if (weeklyTask) {
    weeklyTask.stop();
    weeklyTask = null;
  }
  if (midweekTask) {
    midweekTask.stop();
    midweekTask = null;
  }

  console.log("[scheduler] Scheduler stopped");
}

export function getSchedulerStatus(): {
  running: boolean;
  weeklyEnabled: boolean;
  midweekEnabled: boolean;
  isExecuting: boolean;
  nextWeeklyRun: Date;
  nextMidweekRun: Date;
} {
  return {
    running: weeklyTask !== null,
    weeklyEnabled: weeklyTask !== null,
    midweekEnabled: midweekTask !== null,
    isExecuting: isRunning,
    nextWeeklyRun: getNextWeeklyRun(),
    nextMidweekRun: getNextMidweekRun(),
  };
}

/**
 * Trigger a manual cycle (from Agent HQ dashboard).
 */
export async function triggerManualCycle(): Promise<{ success: boolean; message: string }> {
  if (isRunning) {
    return { success: false, message: "A cycle is already running" };
  }

  console.log("[scheduler] Manual cycle triggered");
  // Run asynchronously so the HTTP response can return immediately
  executeCycle("manual").catch(console.error);

  return { success: true, message: "Manual cycle started" };
}
