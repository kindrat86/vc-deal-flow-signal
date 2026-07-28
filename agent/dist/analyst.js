/**
 * Signal Analyst Agent — Analyst
 *
 * Core analysis engine. Scores every startup using the same transparent
 * algorithm as the MCP server, ranks them within sectors and globally,
 * classifies into tiers, and detects week-over-week changes.
 *
 * All scoring is deterministic — the same input always produces the same
 * output, making it auditable and citable.
 */
import * as memory from "./memory.js";
// ─── Signal Type Weights (mirrors MCP server's SIGNAL_TYPE_WEIGHT) ─────
const SIGNAL_TYPE_WEIGHT = {
    "deploy frequency spike": 20,
    "engineering hiring burst": 17,
    "infrastructure buildout": 14,
    "framework migration": 8,
    // Legacy / alternate labels
    breakout: 20,
    acceleration: 14,
    steady: 6,
    cooling: 0,
};
// ─── Scoring Engine ────────────────────────────────────────────────────
function parsePercent(raw) {
    const m = /^\s*([+-]?\d+(?:\.\d+)?)/.exec(String(raw ?? ""));
    return m ? Number(m[1]) : null;
}
function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
}
/**
 * Score a single startup using the transparent, auditable algorithm.
 * Same scoring as the MCP server's predict_funding / shortlist_signals.
 */
export function scoreStartup(s) {
    const vel = parsePercent(s.commitVelocityChange);
    const cg = parsePercent(s.contributorGrowth);
    const repos = Number.isFinite(s.newRepos) ? s.newRepos : 0;
    // Velocity: 0-40 pts, saturates at +300%
    const velocity = vel === null ? 0 : (clamp(vel, 0, 300) / 300) * 40;
    // Contributor growth: 0-25 pts, saturates at +200%
    const contributorGrowth = cg === null ? 0 : (clamp(cg, 0, 200) / 200) * 25;
    // New repos: 0-15 pts, saturates at 10
    const newRepos = (clamp(repos, 0, 10) / 10) * 15;
    // Signal class: 0-20 pts
    const signalType = SIGNAL_TYPE_WEIGHT[(s.signalType ?? "").toLowerCase()] ?? 6;
    const breakdown = {
        velocity: Math.round(velocity * 10) / 10,
        contributorGrowth: Math.round(contributorGrowth * 10) / 10,
        newRepos: Math.round(newRepos * 10) / 10,
        signalType,
        total: 0,
    };
    const total = Math.round(velocity + contributorGrowth + newRepos + signalType);
    breakdown.total = total;
    const raiseLikelihood = total >= 70 ? "high" :
        total >= 45 ? "elevated" :
            total >= 25 ? "moderate" :
                "low";
    const estimatedWindow = raiseLikelihood === "high" ? "3-6 months (heuristic)" :
        raiseLikelihood === "elevated" ? "6-9 months (heuristic)" :
            raiseLikelihood === "moderate" ? "9-12 months (heuristic)" :
                "12+ months or no near-term signal (heuristic)";
    const missing = (vel === null ? 1 : 0) + (cg === null ? 1 : 0);
    let confidence = "moderate";
    if (missing === 0 && (s.contributors ?? 0) >= 5)
        confidence = "high";
    if (missing >= 1 || (s.contributors ?? 0) < 3)
        confidence = "low";
    return {
        accelerationScore: total,
        raiseLikelihood,
        estimatedWindow,
        confidence,
        breakdown,
        velocityChangePct: vel,
        contributorGrowthPct: cg,
    };
}
export function classifyTier(score) {
    if (score.accelerationScore >= 70)
        return "breakout";
    if (score.accelerationScore >= 45)
        return "accelerating";
    if (score.accelerationScore >= 25)
        return "steady";
    return "cooling";
}
// ─── Enrichment (scoring + historical context) ─────────────────────────
export async function enrichStartups(startups) {
    const lastSnapshot = await memory.getLastSignalSnapshot();
    const enriched = startups.map((s) => {
        const score = scoreStartup(s);
        const prev = lastSnapshot.get(s.name.toLowerCase().trim());
        const scoreDelta = prev ? score.accelerationScore - prev.score : null;
        const isNew = prev === undefined;
        const isSurging = scoreDelta !== null && scoreDelta >= 15;
        return {
            ...s,
            score,
            scoreDelta,
            isNew,
            isSurging,
        };
    });
    return enriched;
}
// ─── Ranking ───────────────────────────────────────────────────────────
export function rankByScore(enriched) {
    return [...enriched].sort((a, b) => b.score.accelerationScore - a.score.accelerationScore);
}
export function rankBySector(enriched) {
    const sectors = new Map();
    for (const s of enriched) {
        const key = s.sectorSlug;
        if (!sectors.has(key))
            sectors.set(key, []);
        sectors.get(key).push(s);
    }
    for (const [, list] of sectors) {
        list.sort((a, b) => b.score.accelerationScore - a.score.accelerationScore);
    }
    return sectors;
}
const DEFAULT_CRITERIA = {
    maxCount: 5,
    minScore: 25,
    preferNew: true,
    preferSurging: true,
    diversityAcrossSectors: true,
};
export function selectHighlights(enriched, criteria = {}) {
    const c = { ...DEFAULT_CRITERIA, ...criteria };
    // Filter below threshold
    let candidates = enriched.filter((s) => s.score.accelerationScore >= c.minScore);
    // Priority buckets
    const breakouts = candidates.filter((s) => s.isNew || s.isSurging);
    const topScorers = candidates.filter((s) => !s.isNew && !s.isSurging);
    // Sort each bucket by score
    breakouts.sort((a, b) => b.score.accelerationScore - a.score.accelerationScore);
    topScorers.sort((a, b) => b.score.accelerationScore - a.score.accelerationScore);
    // Build highlights with sector diversity
    const selected = [];
    const seenSectors = new Set();
    // First pass: take breakouts
    for (const s of breakouts) {
        if (selected.length >= c.maxCount)
            break;
        if (c.diversityAcrossSectors && seenSectors.has(s.sectorSlug))
            continue;
        selected.push(s);
        seenSectors.add(s.sectorSlug);
    }
    // Second pass: fill remaining slots with top scorers
    for (const s of topScorers) {
        if (selected.length >= c.maxCount)
            break;
        if (c.diversityAcrossSectors && seenSectors.has(s.sectorSlug))
            continue;
        selected.push(s);
        seenSectors.add(s.sectorSlug);
    }
    // If we still have slots, relax diversity constraint
    if (selected.length < c.maxCount) {
        const remaining = [...breakouts, ...topScorers].filter((s) => !selected.includes(s));
        remaining.sort((a, b) => b.score.accelerationScore - a.score.accelerationScore);
        for (const s of remaining) {
            if (selected.length >= c.maxCount)
                break;
            selected.push(s);
        }
    }
    return selected;
}
// ─── Summary Generation ────────────────────────────────────────────────
export function generateSummary(enriched, highlights) {
    const total = enriched.length;
    const breakoutCount = enriched.filter((s) => classifyTier(s.score) === "breakout").length;
    const newCount = enriched.filter((s) => s.isNew).length;
    const surgingCount = enriched.filter((s) => s.isSurging).length;
    const sectorCount = new Set(enriched.map((s) => s.sectorSlug)).size;
    let summary = `This week, ${total} VC-backed startups across ${sectorCount} sectors were tracked for engineering acceleration. `;
    if (breakoutCount > 0) {
        summary += `${breakoutCount} startup${breakoutCount > 1 ? 's' : ''} hit breakout territory (70+ acceleration score). `;
    }
    if (newCount > 0) {
        summary += `${newCount} new entr${newCount > 1 ? 'ies' : 'y'} joined the tracked universe. `;
    }
    if (surgingCount > 0) {
        summary += `${surgingCount} startup${surgingCount > 1 ? 's' : ''} showed significant week-over-week acceleration (15+ point surge). `;
    }
    if (highlights.length > 0) {
        summary += `Top picks below.`;
    }
    return summary;
}
//# sourceMappingURL=analyst.js.map