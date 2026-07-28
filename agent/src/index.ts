/**
 * Signal Analyst Agent — Main Entry Point
 *
 * Autonomous agent lifecycle:
 *   1. Monitor  — fetch latest signals, compute diffs
 *   2. Analyze  — score, rank, classify, select highlights
 *   3. Brief    — generate investor-ready briefs (template + optional LLM)
 *   4. Validate — run guardrails and content checks
 *   5. Publish  — deliver via email, Telegram, site update
 *   6. Sleep    — wait for next scheduled cycle
 *
 * Usage:
 *   npm start          — Run as long-lived daemon with scheduler
 *   npm run dev        — Development mode with file watching
 *   npm test           — Run a single cycle and exit (--once flag)
 */

import * as memory from "./memory.js";
import * as monitor from "./monitor.js";
import * as analyst from "./analyst.js";
import * as briefer from "./briefer.js";
import * as guardrails from "./guardrails.js";
import * as publisher from "./publisher.js";
import { startScheduler } from "./scheduler.js";
import { startServer } from "./server.js";
import type { CycleType } from "./types.js";

// ─── Agent Lifecycle ───────────────────────────────────────────────────

/**
 * Run one full agent cycle: Monitor → Analyze → Brief → Validate → Publish
 */
export async function runAgentCycle(type: CycleType): Promise<void> {
  const cycleId = await memory.startCycle(type);
  console.log(`\n[agent] ═══ Cycle ${cycleId} (${type}) started ═══`);

  try {
    // ── Stage 1: Monitor ──────────────────────────────────────────────
    await memory.setAgentStatus("running");
    await memory.updateCycleStage(cycleId, "monitoring", "Fetching latest signals data");

    const data = await monitor.fetchSignalsData();
    const startups = monitor.flattenStartups(data);
    console.log(`[agent] 📡 Monitor: ${startups.length} startups across ${data.sectors.length} sectors`);

    const diff = await monitor.computeDiff(startups);
    const breakouts = monitor.detectBreakouts(diff, startups);

    console.log(
      `[agent] Diff: ${diff.newStartups.length} new, ${diff.signalTypeChanges.length} type changes, ` +
      `${diff.scoreSurges.length} surges, ${breakouts.length} breakouts`
    );

    // ── Stage 2: Analyze ──────────────────────────────────────────────
    await memory.updateCycleStage(cycleId, "analyzing", "Scoring and ranking startups");

    const enriched = await analyst.enrichStartups(startups);
    const top10 = analyst.rankByScore(enriched).slice(0, 10);

    console.log(`[agent] 🔬 Analysis: top score ${top10[0]?.score.accelerationScore || 0}/100`);
    console.log(`[agent] Tiers: ${enriched.filter(s => analyst.classifyTier(s.score) === "breakout").length} breakout, ` +
      `${enriched.filter(s => analyst.classifyTier(s.score) === "accelerating").length} accelerating`);

    // Persist signal state
    const { newCount, updatedCount } = await memory.upsertSignals(enriched, data.meta.period.name);
    console.log(`[agent] 💾 Persisted: ${newCount} new, ${updatedCount} updated`);

    // ── Stage 3: Select Highlights ────────────────────────────────────
    const highlights = analyst.selectHighlights(enriched, {
      maxCount: 5,
      minScore: type === "midweek" ? 50 : 25, // Higher bar for mid-week
      preferNew: true,
      preferSurging: true,
      diversityAcrossSectors: true,
    });

    console.log(`[agent] 🎯 Selected ${highlights.length} highlights`);

    // ── Stage 4: Brief ────────────────────────────────────────────────
    await memory.updateCycleStage(cycleId, "briefing", "Generating investor briefs");

    const summary = analyst.generateSummary(enriched, highlights);
    const useLLM = type === "weekly"; // Only use LLM for weekly (cost control)
    const brief = await briefer.buildWeeklyBrief(highlights, summary, data.meta.period.name, useLLM);

    console.log(`[agent] ✍️ Brief: "${brief.title}" with ${brief.highlights.length} highlights`);

    // ── Stage 5: Validate ─────────────────────────────────────────────
    const validation = guardrails.validateBrief(brief);

    if (!validation.valid) {
      console.warn(`[agent] ⚠️ Validation issues:`, validation.issues);
      if (type !== "midweek") {
        // For weekly, log issues but proceed (they're warnings, not blocks)
        await memory.logDecision("validate_brief", "issues_found", {
          entityType: "brief",
          rationale: validation.issues.join("; "),
        });
      }
    }

    const hasDisclaimer = guardrails.validateDisclaimer(brief);
    if (!hasDisclaimer) {
      console.warn("[agent] ⚠️ Brief missing disclaimer — adding");
      brief.summary += " Derived from public GitHub engineering-acceleration signals. This is not investment advice.";
    }

    // ── Stage 6: Save ─────────────────────────────────────────────────
    const savedBriefId = await memory.saveBrief(
      brief,
      type,
      type === "weekly" ? "pending_approval" : "draft"
    );

    console.log(`[agent] 💾 Brief saved (id=${savedBriefId})`);

    // ── Stage 7: Publish ──────────────────────────────────────────────
    await memory.updateCycleStage(cycleId, "publishing", "Delivering brief");

    const state = await memory.getAgentState();
    const autoPublish = state?.config?.autoPublish ?? false;

    // Determine delivery channels
    const configuredChannels = state?.config?.deliveryChannels ?? ["email"];
    // Also try Telegram if env vars are configured
    const channels: ("email" | "telegram")[] = [...configuredChannels];
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID && !channels.includes("telegram")) {
      channels.push("telegram");
      console.log("[agent] Telegram configured — adding to delivery channels");
    }

    // For weekly: always try to publish if auto-publish is on
    // For midweek: only publish if there are breakouts
    const shouldPublish =
      type === "weekly" ? autoPublish :
      type === "midweek" ? (breakouts.length > 0 && autoPublish) :
      true; // manual always publishes

    if (shouldPublish) {
      const result = await publisher.publishBrief(brief, savedBriefId, channels);
      console.log(`[agent] 📨 Publish: email=${result.email.success}, telegram=${result.telegram.success}`);
    } else if (type === "weekly" && !autoPublish) {
      console.log(`[agent] ⏸️ Auto-publish disabled — brief saved as pending_approval`);
      await memory.createApproval(
        "publish_brief",
        savedBriefId,
        "brief",
        `Weekly brief ready: "${brief.title}" — ${brief.highlights.length} highlights`,
        { period: brief.period }
      );
    }

    // ── Stage 8: Complete ─────────────────────────────────────────────
    await memory.completeCycle(cycleId, enriched.length, newCount, brief.highlights.length);

    console.log(`[agent] ✅ Cycle ${cycleId} completed successfully`);
    console.log(`[agent]    ${enriched.length} signals · ${newCount} new · ${brief.highlights.length} briefs\n`);

  } catch (err) {
    console.error(`[agent] ❌ Cycle ${cycleId} failed:`, err);
    await memory.failCycle(cycleId, String(err));
    await memory.setAgentStatus("error", String(err));
    throw err;
  }
}

// ─── Main ──────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   GitDealFlow — Signal Analyst Agent v1.0   ║");
  console.log("║   Autonomous engineering signal detection   ║");
  console.log("║   for VC deal flow.                         ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");

  // Check for required environment
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn("[agent] ⚠️  SUPABASE_URL not set — memory persistence will fail");
    console.warn("[agent]    Set SUPABASE_URL and SUPABASE_SERVICE_KEY in environment");
  }

  // Check for --once flag (single cycle, then exit)
  const args = process.argv.slice(2);
  const onceMode = args.includes("--once");

  if (onceMode) {
    console.log("[agent] Running single cycle (--once mode)");
    const type: CycleType = args.includes("--midweek") ? "midweek" : "manual";
    await runAgentCycle(type);
    console.log("[agent] Single cycle complete. Exiting.");
    process.exit(0);
  }

  // Start the scheduler (weekly + midweek cron)
  startScheduler();

  // Start the Agent HQ dashboard server
  const port = parseInt(process.env.AGENT_PORT || "3400", 10);
  startServer(port);

  // Keep the process alive
  console.log("[agent] Agent running. Press Ctrl+C to stop.");
  console.log(`[agent] Dashboard: http://localhost:${port}\n`);

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n[agent] Shutting down...");
    const { stopScheduler } = await import("./scheduler.js");
    stopScheduler();
    await memory.setAgentStatus("idle");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\n[agent] Received SIGTERM, shutting down...");
    const { stopScheduler } = await import("./scheduler.js");
    stopScheduler();
    await memory.setAgentStatus("idle");
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("[agent] Fatal error:", err);
  process.exit(1);
});
