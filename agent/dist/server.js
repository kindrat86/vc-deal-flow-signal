/**
 * Signal Analyst Agent — Agent HQ Server
 *
 * Express server providing:
 * - REST API for dashboard consumption
 * - Agent control endpoints (trigger, pause, approve)
 * - Static file serving for the Agent HQ web dashboard
 * - Health check endpoint
 */
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as memory from "./memory.js";
import * as scheduler from "./scheduler.js";
import * as guardrails from "./guardrails.js";
import { listTools } from "./tools.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DASHBOARD_DIR = path.resolve(__dirname, "..", "dashboard");
// ─── Express App ───────────────────────────────────────────────────────
const app = express();
app.use(express.json());
// CORS for local development
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (_req.method === "OPTIONS") {
        res.sendStatus(200);
        return;
    }
    next();
});
// ─── Static Dashboard ──────────────────────────────────────────────────
app.use(express.static(DASHBOARD_DIR));
// ─── Health Check ──────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        agent: "signal-analyst-agent",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});
// ─── Agent Status ──────────────────────────────────────────────────────
app.get("/api/agent/status", async (_req, res) => {
    try {
        const state = await memory.getAgentState();
        const schedStatus = scheduler.getSchedulerStatus();
        const pendingApprovals = await memory.getPendingApprovals();
        const topSignals = await memory.getTopSignals(5);
        const recentBriefs = await memory.getRecentBriefs(5);
        const cycleStats = guardrails.getCycleStats();
        res.json({
            agent: {
                status: state?.status || "unknown",
                cycle: state?.cycle || "unknown",
                lastRunAt: state?.lastRunAt,
                nextRunAt: state?.nextRunAt,
                lastError: state?.lastError,
                config: state?.config || {},
            },
            scheduler: schedStatus,
            pendingApprovals: pendingApprovals.length,
            approvals: pendingApprovals.slice(0, 5).map((a) => ({
                id: a.id,
                type: a.approvalType,
                summary: a.summary,
                createdAt: a.createdAt,
            })),
            topSignals: topSignals.map((s) => ({
                name: s.name,
                sector: s.sectorName,
                score: s.score.accelerationScore,
                raiseLikelihood: s.score.raiseLikelihood,
                signalType: s.signalType,
            })),
            recentBriefs: recentBriefs.map((b) => ({
                id: b.id,
                cycle: b.cycle,
                title: b.title,
                status: b.status,
                publishedAt: b.published_at,
                createdAt: b.created_at,
            })),
            cycleBudget: cycleStats,
        });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
// ─── Trigger Manual Cycle ──────────────────────────────────────────────
app.post("/api/agent/trigger", async (_req, res) => {
    try {
        const result = await scheduler.triggerManualCycle();
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
// ─── Pause / Resume ────────────────────────────────────────────────────
app.post("/api/agent/pause", async (_req, res) => {
    try {
        scheduler.stopScheduler();
        await memory.setAgentStatus("paused");
        await memory.updateAgentConfig({ pausedUntil: null });
        res.json({ success: true, message: "Agent paused" });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
app.post("/api/agent/resume", async (_req, res) => {
    try {
        scheduler.startScheduler();
        await memory.setAgentStatus("idle");
        await memory.updateAgentConfig({ pausedUntil: null });
        res.json({ success: true, message: "Agent resumed" });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
// ─── Approvals ─────────────────────────────────────────────────────────
app.get("/api/approvals", async (_req, res) => {
    try {
        const approvals = await memory.getPendingApprovals();
        res.json({ count: approvals.length, approvals });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
app.post("/api/approvals/:id/resolve", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { approved } = req.body;
        await memory.resolveApproval(id, !!approved);
        res.json({ success: true, id, approved: !!approved });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
// ─── Tools ─────────────────────────────────────────────────────────────
app.get("/api/tools", (_req, res) => {
    res.json({ tools: listTools() });
});
// ─── Briefs ────────────────────────────────────────────────────────────
app.get("/api/briefs", async (_req, res) => {
    try {
        const briefs = await memory.getRecentBriefs(20);
        res.json({ count: briefs.length, briefs });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
app.get("/api/briefs/latest", async (_req, res) => {
    try {
        const brief = await memory.getLatestBrief();
        if (!brief) {
            res.json({ found: false });
            return;
        }
        res.json({ found: true, brief });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
// ─── Preview ───────────────────────────────────────────────────────────
app.get("/api/preview", async (_req, res) => {
    try {
        const { previewPublish } = await import("./publisher.js");
        const signals = await memory.getTopSignals(5);
        const { buildWeeklyBrief } = await import("./briefer.js");
        const brief = await buildWeeklyBrief(signals.map((s) => ({ ...s, score: s.score, sectorName: s.sectorName, sectorSlug: s.sectorSlug })), "Preview of this week's top signals.", "Preview", false);
        const preview = await previewPublish(brief);
        res.json(preview);
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
// ─── Start ─────────────────────────────────────────────────────────────
export function startServer(port = 3400) {
    app.listen(port, () => {
        console.log(`[server] Agent HQ Dashboard running at http://localhost:${port}`);
        console.log(`[server] API endpoints:`);
        console.log(`[server]   GET  /api/health`);
        console.log(`[server]   GET  /api/agent/status`);
        console.log(`[server]   POST /api/agent/trigger`);
        console.log(`[server]   POST /api/agent/pause`);
        console.log(`[server]   POST /api/agent/resume`);
        console.log(`[server]   GET  /api/approvals`);
        console.log(`[server]   POST /api/approvals/:id/resolve`);
        console.log(`[server]   GET  /api/briefs`);
        console.log(`[server]   GET  /api/briefs/latest`);
        console.log(`[server]   GET  /api/preview`);
        console.log(`[server]   GET  /api/tools`);
    });
}
export { app };
//# sourceMappingURL=server.js.map