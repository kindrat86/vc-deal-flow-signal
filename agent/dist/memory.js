/**
 * Signal Analyst Agent — Memory Layer
 *
 * Persists agent state, signal history, briefs, decisions, and approvals
 * in Supabase. Provides a clean async API for all persistence operations.
 */
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
let supabase = null;
let supabaseAvailable = false;
export function getSupabase() {
    if (!SUPABASE_URL) {
        return null;
    }
    if (!supabase) {
        try {
            supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY, {
                db: { schema: "public" },
            });
            supabaseAvailable = true;
        }
        catch (err) {
            console.warn("[memory] Supabase client creation failed:", err);
            supabaseAvailable = false;
            return null;
        }
    }
    return supabase;
}
export function isSupabaseAvailable() {
    getSupabase(); // trigger availability check
    return supabaseAvailable;
}
// ─── Agent State ──────────────────────────────────────────────────────
export async function getAgentState() {
    const db = getSupabase();
    if (!db)
        return null;
    const { data, error } = await db
        .from("agent_state")
        .select("*")
        .eq("id", 1)
        .single();
    if (error) {
        console.error("[memory] Failed to get agent state:", error.message);
        return null;
    }
    return data;
}
export async function setAgentStatus(status, error) {
    const db = getSupabase();
    if (!db)
        return;
    const update = {
        status,
        updated_at: new Date().toISOString(),
    };
    if (status === "running")
        update.last_run_at = new Date().toISOString();
    if (error)
        update.last_error = error;
    const { error: dbError } = await db
        .from("agent_state")
        .update(update)
        .eq("id", 1);
    if (dbError)
        console.error("[memory] Failed to set agent status:", dbError.message);
}
export async function updateAgentConfig(config) {
    const db = getSupabase();
    if (!db)
        return;
    const { data } = await db
        .from("agent_state")
        .select("config")
        .eq("id", 1)
        .single();
    const existing = (data?.config || {});
    const merged = { ...existing, ...config };
    await db
        .from("agent_state")
        .update({ config: merged, updated_at: new Date().toISOString() })
        .eq("id", 1);
}
export async function setNextRun(time) {
    const db = getSupabase();
    if (!db)
        return;
    await db
        .from("agent_state")
        .update({ next_run_at: time.toISOString(), updated_at: new Date().toISOString() })
        .eq("id", 1);
}
// ─── Cycle Logging ────────────────────────────────────────────────────
export async function startCycle(type) {
    const db = getSupabase();
    if (!db) {
        console.log(`[memory] Dry-run: cycle ${type} started (no persistence)`);
        return Date.now(); // Return a synthetic ID for dry-run mode
    }
    const { data, error } = await db
        .from("agent_cycles")
        .insert({
        cycle_type: type,
        status: "started",
        log: [{ stage: "started", timestamp: new Date().toISOString(), message: `Cycle ${type} started` }],
    })
        .select("id")
        .single();
    if (error)
        throw new Error(`Failed to start cycle: ${error.message}`);
    return data.id;
}
export async function updateCycleStage(cycleId, stage, message, detail) {
    const db = getSupabase();
    if (!db) {
        console.log(`[memory] Dry-run: cycle ${cycleId} → ${stage}: ${message}`);
        return;
    }
    const entry = {
        stage: stage,
        timestamp: new Date().toISOString(),
        message,
        detail,
    };
    const { data } = await db
        .from("agent_cycles")
        .select("log")
        .eq("id", cycleId)
        .single();
    const log = [...(data?.log || []), entry];
    await db
        .from("agent_cycles")
        .update({ status: stage, log })
        .eq("id", cycleId);
}
export async function completeCycle(cycleId, signalsCount, newSignals, briefsCount) {
    const db = getSupabase();
    if (!db) {
        console.log(`[memory] Dry-run: cycle ${cycleId} completed (${signalsCount} signals, ${newSignals} new, ${briefsCount} briefs)`);
        return;
    }
    const { data } = await db
        .from("agent_cycles")
        .select("log")
        .eq("id", cycleId)
        .single();
    const log = [
        ...(data?.log || []),
        {
            stage: "completed",
            timestamp: new Date().toISOString(),
            message: `Completed: ${signalsCount} signals (${newSignals} new), ${briefsCount} briefs`,
        },
    ];
    await db
        .from("agent_cycles")
        .update({
        status: "completed",
        signals_count: signalsCount,
        new_signals: newSignals,
        briefs_count: briefsCount,
        completed_at: new Date().toISOString(),
        log,
    })
        .eq("id", cycleId);
}
export async function failCycle(cycleId, errorMessage) {
    const db = getSupabase();
    if (!db) {
        console.error(`[memory] Dry-run: cycle ${cycleId} FAILED: ${errorMessage}`);
        return;
    }
    const { data } = await db
        .from("agent_cycles")
        .select("log")
        .eq("id", cycleId)
        .single();
    const log = [
        ...(data?.log || []),
        {
            stage: "failed",
            timestamp: new Date().toISOString(),
            message: `Failed: ${errorMessage}`,
        },
    ];
    await db
        .from("agent_cycles")
        .update({
        status: "failed",
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
        log,
    })
        .eq("id", cycleId);
}
// ─── Signal History ───────────────────────────────────────────────────
function normalizeName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
export async function getLastSignalSnapshot() {
    const db = getSupabase();
    if (!db)
        return new Map();
    const { data, error } = await db
        .from("agent_signals")
        .select("name_norm, acceleration_score, signal_type")
        .eq("is_active", true);
    if (error || !data)
        return new Map();
    const map = new Map();
    for (const row of data) {
        map.set(row.name_norm, { score: row.acceleration_score, signalType: row.signal_type });
    }
    return map;
}
export async function upsertSignals(startups, period) {
    const db = getSupabase();
    if (!db) {
        console.log(`[memory] Dry-run: would upsert ${startups.length} signals`);
        return { newCount: startups.length, updatedCount: 0 };
    }
    let newCount = 0;
    let updatedCount = 0;
    for (const s of startups) {
        const nameNorm = normalizeName(s.name);
        const { data: existing } = await db
            .from("agent_signals")
            .select("id, is_active")
            .eq("name_norm", nameNorm)
            .maybeSingle();
        const row = {
            name: s.name,
            name_norm: nameNorm,
            sector: s.sectorSlug,
            stage: s.stage,
            geography: s.geography,
            signal_type: s.signalType,
            acceleration_score: s.score.accelerationScore,
            commit_velocity_14d: s.commitVelocity14d,
            commit_velocity_change: s.commitVelocityChange,
            contributors: s.contributors,
            contributor_growth: s.contributorGrowth,
            new_repos: s.newRepos,
            github_url: s.githubUrl,
            website_url: s.websiteUrl || null,
            description: s.description,
            last_seen_at: new Date().toISOString(),
            is_active: true,
            raw_data: s,
        };
        if (existing) {
            await db
                .from("agent_signals")
                .update(row)
                .eq("id", existing.id);
            updatedCount++;
        }
        else {
            await db
                .from("agent_signals")
                .insert({ ...row, first_seen_at: new Date().toISOString() });
            newCount++;
        }
    }
    return { newCount, updatedCount };
}
// ─── Briefs ───────────────────────────────────────────────────────────
export async function saveBrief(brief, cycle, status = "draft") {
    const db = getSupabase();
    if (!db) {
        console.log(`[memory] Dry-run: would save brief "${brief.title}" (${status})`);
        return Date.now(); // synthetic ID
    }
    const { data, error } = await db
        .from("agent_briefs")
        .insert({
        cycle,
        title: brief.title,
        summary: brief.summary,
        highlights: brief.highlights,
        full_content: JSON.stringify(brief),
        content_html: "",
        status,
        meta: {
            period: brief.period,
            citation: brief.citation,
            highlightCount: brief.highlights.length,
        },
    })
        .select("id")
        .single();
    if (error)
        throw new Error(`Failed to save brief: ${error.message}`);
    return data.id;
}
export async function publishBrief(id, deliveryMethods) {
    const db = getSupabase();
    if (!db) {
        console.log(`[memory] Dry-run: would publish brief #${id} via ${deliveryMethods.join(", ")}`);
        return;
    }
    await db
        .from("agent_briefs")
        .update({
        status: "published",
        published_at: new Date().toISOString(),
        delivery_method: deliveryMethods,
        updated_at: new Date().toISOString(),
    })
        .eq("id", id);
}
export async function getRecentBriefs(limit = 10) {
    const db = getSupabase();
    if (!db)
        return [];
    const { data, error } = await db
        .from("agent_briefs")
        .select("id, cycle, title, status, published_at, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);
    if (error)
        return [];
    return data;
}
// ─── Decisions (Audit Log) ────────────────────────────────────────────
export async function logDecision(decisionType, action, detail) {
    const db = getSupabase();
    if (!db) {
        console.log(`[memory] Dry-run: decision ${decisionType}/${action}${detail?.rationale ? ` — ${detail.rationale}` : ""}`);
        return;
    }
    await db
        .from("agent_decisions")
        .insert({
        decision_type: decisionType,
        entity_type: detail?.entityType || null,
        entity_id: detail?.entityId || null,
        action,
        rationale: detail?.rationale || null,
        detail: detail?.extra || null,
    });
}
// ─── Approvals ────────────────────────────────────────────────────────
export async function createApproval(approvalType, entityId, entityType, summary, detail) {
    const db = getSupabase();
    if (!db) {
        console.log(`[memory] Dry-run: would create approval: ${approvalType} — ${summary}`);
        return Date.now();
    }
    const { data, error } = await db
        .from("agent_approvals")
        .insert({
        approval_type: approvalType,
        entity_id: entityId,
        entity_type: entityType,
        summary,
        detail: detail || null,
    })
        .select("id")
        .single();
    if (error)
        throw new Error(`Failed to create approval: ${error.message}`);
    return data.id;
}
export async function getPendingApprovals() {
    const db = getSupabase();
    if (!db)
        return [];
    const { data, error } = await db
        .from("agent_approvals")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
    if (error)
        return [];
    return data;
}
export async function resolveApproval(id, approved) {
    const db = getSupabase();
    if (!db) {
        console.log(`[memory] Dry-run: would resolve approval #${id} → ${approved ? "approved" : "rejected"}`);
        return;
    }
    await db
        .from("agent_approvals")
        .update({
        status: approved ? "approved" : "rejected",
        resolved_at: new Date().toISOString(),
    })
        .eq("id", id);
}
// ─── Dashboard Queries ──────────────────────────────────────────────
export async function getLatestBrief() {
    const db = getSupabase();
    if (!db)
        return null;
    const { data, error } = await db
        .from("agent_briefs")
        .select("full_content, highlights, title, created_at")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error || !data)
        return null;
    try {
        return JSON.parse(data.full_content);
    }
    catch {
        return {
            title: data.title,
            period: "unknown",
            summary: "",
            highlights: (data.highlights || []),
            methodologyUrl: "",
            citation: "",
            generatedAt: data.created_at,
        };
    }
}
export async function getTopSignals(limit = 5) {
    const db = getSupabase();
    if (!db)
        return [];
    const { data, error } = await db
        .from("agent_signals")
        .select("*")
        .eq("is_active", true)
        .order("acceleration_score", { ascending: false })
        .limit(limit);
    if (error || !data)
        return [];
    return data.map((row) => {
        const s = (row.raw_data || {});
        return {
            name: row.name,
            description: s.description || "",
            stage: row.stage || "",
            geography: row.geography || "",
            commitVelocity14d: row.commit_velocity_14d,
            commitVelocityChange: row.commit_velocity_change || "",
            contributors: row.contributors,
            contributorGrowth: row.contributor_growth || "",
            newRepos: row.new_repos,
            signalType: row.signal_type,
            githubUrl: row.github_url || "",
            websiteUrl: row.website_url || undefined,
            score: {
                accelerationScore: row.acceleration_score,
                raiseLikelihood: "moderate",
                estimatedWindow: "",
                confidence: "moderate",
                breakdown: { velocity: 0, contributorGrowth: 0, newRepos: 0, signalType: 0, total: row.acceleration_score },
                velocityChangePct: null,
                contributorGrowthPct: null,
            },
            sectorName: row.sector,
            sectorSlug: row.sector,
            scoreDelta: null,
            isNew: false,
            isSurging: false,
        };
    });
}
//# sourceMappingURL=memory.js.map