/**
 * Signal Analyst Agent — Monitor
 *
 * Watches the signals.gitdealflow.com API for changes:
 * - New startups entering the tracked universe
 * - Signal type changes (e.g., steady → breakout)
 * - Acceleration score surges (delta > 15pts)
 *
 * Compares current snapshot against persisted state in Supabase.
 */

import type { SignalsData, Startup, SignalDiff, EnrichedStartup } from "./types.js";
import * as memory from "./memory.js";
import * as analyst from "./analyst.js";

// ─── Fetch Current State ───────────────────────────────────────────────

export async function fetchSignalsData(): Promise<SignalsData> {
  const res = await fetch("https://signals.gitdealflow.com/api/signals.json", {
    headers: { "User-Agent": "gitdealflow-signal-analyst-agent/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch signals: HTTP ${res.status}`);
  }

  const data = (await res.json()) as SignalsData;

  if (!data.sectors || !Array.isArray(data.sectors)) {
    throw new Error("Invalid signals data: missing sectors array");
  }

  console.log(`[monitor] Fetched ${data.sectors.length} sectors, ${data.trending?.length || 0} trending`);
  return data;
}

// ─── Flatten all startups from sectors ─────────────────────────────────

export function flattenStartups(data: SignalsData): Array<Startup & { sectorName: string; sectorSlug: string }> {
  const seen = new Set<string>();
  const rows: Array<Startup & { sectorName: string; sectorSlug: string }> = [];

  for (const sector of data.sectors) {
    for (const s of sector.startups) {
      const key = s.name.toLowerCase().trim();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        ...s,
        sectorName: sector.name,
        sectorSlug: sector.slug,
      });
    }
  }

  return rows;
}

// ─── Diff Detection ────────────────────────────────────────────────────

export async function computeDiff(
  current: Array<Startup & { sectorName: string; sectorSlug: string }>
): Promise<SignalDiff> {
  const lastSnapshot = await memory.getLastSignalSnapshot();

  const currentMap = new Map<string, { startup: Startup & { sectorName: string; sectorSlug: string }; score: number }>();
  for (const s of current) {
    const scored = analyst.scoreStartup(s);
    const key = s.name.toLowerCase().trim();
    currentMap.set(key, { startup: s, score: scored.accelerationScore });
  }

  const prevNames = new Set(lastSnapshot.keys());
  const currNames = new Set(currentMap.keys());

  // New startups
  const newStartups: Startup[] = [];
  for (const name of currNames) {
    if (!prevNames.has(name)) {
      const entry = currentMap.get(name);
      if (entry) newStartups.push(entry.startup);
    }
  }

  // Removed startups (partial info — only name is reliable)
  const removedStartups: Startup[] = [];
  for (const name of prevNames) {
    if (!currNames.has(name)) {
      removedStartups.push({
        name,
        description: "",
        stage: "",
        geography: "",
        commitVelocity14d: 0,
        commitVelocityChange: "0%",
        contributors: 0,
        contributorGrowth: "0%",
        newRepos: 0,
        signalType: "unknown",
        githubUrl: "",
      });
    }
  }

  // Signal type changes and score surges
  const signalTypeChanges: SignalDiff["signalTypeChanges"] = [];
  const scoreSurges: SignalDiff["scoreSurges"] = [];

  for (const [name, entry] of currentMap) {
    const prev = lastSnapshot.get(name);
    if (prev) {
      if (prev.signalType !== entry.startup.signalType) {
        signalTypeChanges.push({
          name: entry.startup.name,
          old: prev.signalType,
          new: entry.startup.signalType,
        });
      }

      const delta = entry.score - prev.score;
      if (delta >= 15) {
        scoreSurges.push({
          name: entry.startup.name,
          oldScore: prev.score,
          newScore: entry.score,
          delta,
        });
      }
    }
  }

  console.log(
    `[monitor] Diff: ${newStartups.length} new, ${removedStartups.length} removed, ` +
    `${signalTypeChanges.length} type changes, ${scoreSurges.length} surges`
  );

  return {
    newStartups,
    removedStartups,
    signalTypeChanges,
    scoreSurges,
    totalBefore: lastSnapshot.size,
    totalAfter: currentMap.size,
  };
}

// ─── Breakout Alert ────────────────────────────────────────────────────

export function detectBreakouts(
  diff: SignalDiff,
  startups: Array<Startup & { sectorName: string; sectorSlug: string }>
): Array<{ startup: Startup & { sectorName: string; sectorSlug: string }; reason: string }> {
  const breakouts: Array<{ startup: Startup & { sectorName: string; sectorSlug: string }; reason: string }> = [];

  // New startups that are already scoring high
  for (const s of startups.filter((startup) =>
    diff.newStartups.some((ns) => ns.name === startup.name)
  )) {
    const scored = analyst.scoreStartup(s);
    if (scored.accelerationScore >= 50) {
      breakouts.push({
        startup: s,
        reason: `New entry with high acceleration score (${scored.accelerationScore}/100) — ${scored.raiseLikelihood} raise likelihood`,
      });
    }
  }

  // Surging startups
  for (const surge of diff.scoreSurges) {
    const s = startups.find((startup) => startup.name === surge.name);
    if (s) {
      breakouts.push({
        startup: s,
        reason: `Score surge: +${surge.delta}pts (${surge.oldScore} → ${surge.newScore})`,
      });
    }
  }

  // Signal type upgrades to breakout
  for (const change of diff.signalTypeChanges) {
    if (
      change.new.toLowerCase().includes("breakout") ||
      change.new.toLowerCase().includes("deploy frequency spike") ||
      change.new.toLowerCase().includes("engineering hiring burst")
    ) {
      const s = startups.find((startup) => startup.name === change.name);
      if (s && !breakouts.some((b) => b.startup.name === change.name)) {
        breakouts.push({
          startup: s,
          reason: `Signal upgrade: ${change.old} → ${change.new}`,
        });
      }
    }
  }

  if (breakouts.length > 0) {
    console.log(`[monitor] 🔥 ${breakouts.length} breakout(s) detected:`);
    for (const b of breakouts) {
      console.log(`[monitor]   • ${b.startup.name}: ${b.reason}`);
    }
  }

  return breakouts;
}
