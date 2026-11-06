/**
 * gitdealflow.com (apex): For-funds sample-report generator API.
 *
 * Directive gdf-for-funds phase 2 (Maryan-approved 2026-11-04 t643u +
 * 2026-11-05 t723u): the /for-funds page sells done-for-you thesis-matched
 * deal flow (Thesis Scout EUR 300/mo, Thesis Desk EUR 500/mo). Funds ask the
 * obvious question before paying: "what would MY thesis look like in your
 * data?" This endpoint answers it with a live, deterministic sample built from
 * the repo's real public signal data.
 *
 * GET /api/for-funds-sample
 *   -> the full sample bank (all theses + matches), for the page picker.
 * POST /api/for-funds-sample {thesis:"...", email:"...", name:"...", fund:"...", variant?}
 *   -> {matches:[{name,sector,velocity_score,delta_velocity,delta_contributors,
 *                signal,profile,why_matched,evidence}], method, thesis_label,
 *      queue_id, internal_only:true}
 *
 * Matching is deterministic: the same thesis text always yields the same
 * sample (the page tells the fund this). It scores the curated thesis bank in
 * data/for-funds-samples/data.json (real rows from the public Top 100 velocity
 * and breakout boards) by keyword overlap with the submitted thesis, then
 * returns that thesis's matches, ordered by velocity score.
 *
 * NO EMAIL IS EVER SENT by this endpoint. A request queues the report for a
 * human: it appends one line to the sample-request queue on the mountable
 * /qstore volume (never served), logs to stdout for Vercel logs, and emits a
 * best-effort for_funds_sample_generated event to PostHog (via the signals
 * relay, same pattern as api/crawl-proxy.js). Auto-emailing a fund would
 * violate the directive ("queue the request; do not auto-email anyone") and
 * the loop's no-outbound guardrail. When a human sends the sample, they reply
 * from signals@gitdealflow.com to the email given.
 *
 * Inputs are size-capped and sanitized; nothing is echoed back unescaped into
 * HTML contexts (JSON only). No secrets in this file.
 */

const RELAY_URL = "https://signals.gitdealflow.com/__relay/bot-crawl";
const RELAY_SECRET = process.env.APEX_RELAY_SECRET || "";
const POSTHOG_KEY = "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX";

import { readFileSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

let cachedData = null;
function loadBank() {
  if (cachedData) return cachedData;
  // includeFiles (vercel.json) makes this file available at runtime.
  const raw = readFileSync(join(process.cwd(), "data/for-funds-samples/data.json"), "utf8");
  cachedData = JSON.parse(raw);
  return cachedData;
}

const MAX_THESIS = 2000;
const MAX_GENERAL = 200;

function clamp(s, max) {
  return String(s == null ? "" : s).replace(/\s+/g, " ").trim().slice(0, max);
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---- deterministic thesis -> bank thesis scoring -------------------------
const TOPIC_KEYWORDS = {
  "devtools-open-source": [
    "developer", "devtool", "dev tool", "open source", "open-source", "opensource",
    "infrastructure", "infra", "api", "platform engineering", "devops", "database",
    "data infrastructure", "observability", "cli", "sdk", "framework",
  ],
  "ai-automation-agents": [
    "ai", "agent", "agents", "llm", "automation", "workflow", "n8n", "copilot",
    "rag", "genai", "generative", "inference", "fine-tun", "foundation model",
    "crypto", "web3", "token", "blockchain", "defi",
  ],
  "applied-ai-healthcare": [
    "healthcare", "health", "medical", "clinical", "biotech", "bio", "patient",
    "regulat", "hipaa", "fda", "diagnostic", "life science",
  ],
  "fintech-infrastructure": [
    "fintech", "payment", "payments", "banking", "lending", "checkout", "commerce",
    "e-commerce", "ecommerce", "merchant", "billing", "treasury", "back office",
  ],
  "climate-industrial": [
    "climate", "agtech", "agriculture", "farming", "industrial", "energy",
    "supply chain", "logistics", "manufactur", "sustainability", "carbon",
    "hardtech", "hardware",
  ],
  "security-devops": [
    "security", "compliance", "privacy", "devsecops", "identity", "sso",
    "threat", "vulnerab", "audit", "soc2", "zero trust",
  ],
  "vertical-saas-europe": [
    "vertical saas", "vertical", "saas", "b2b saas", "enterprise saas",
    "europe", "european", "industry software", "workflow software",
  ],
  "emerging-frontier": [
    "space", "satellite", "aerospace", "robotics", "robots", "frontier",
    "deep tech", "deeptech", "moonshot", "defense", "orbital",
  ],
};

function normalize(s) {
  return " " + String(s || "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim() + " ";
}

function scoreThesis(thesisText, bankThesis) {
  const t = normalize(thesisText);
  const kws = TOPIC_KEYWORDS[bankThesis.id] || [];
  let hits = 0;
  const hitList = [];
  for (const kw of kws) {
    if (t.includes(kw)) {
      hits += 1;
    }
    if (t.includes(" " + kw + " ")) hitList.push(kw);
  }
  // sector name itself is a strong signal
  const sectorHit = t.includes(bankThesis.sector.toLowerCase().replace(/ & /g, " "));
  return { score: hits + (sectorHit ? 2 : 0), hitList };
}

function pickThesis(thesisText, bank) {
  const scored = bank.theses
    .map((th) => ({ th, ...scoreThesis(thesisText, th) }))
    .sort((a, b) => b.score - a.score);
  if (scored[0] && scored[0].score > 0) return scored[0];
  return { th: bank.theses[0], score: 0, hitList: [] };
}

function matchedVariant(v) {
  const s = String(v || "").toLowerCase();
  if (s.includes("desk")) return "thesis_desk";
  if (s.includes("scout")) return "thesis_scout";
  return "free_sample";
}

// ---- queue (never auto-email) --------------------------------------------
const QUEUE_MARKER = "/qstore";

function queueRequest(payload) {
  const id = randomUUID().slice(0, 8);
  const line = JSON.stringify({
    id,
    at: new Date().toISOString(),
    thesis: payload.thesis,
    email: payload.email || null,
    name: payload.name || null,
    fund: payload.fund || null,
    variant: payload.variant,
    matched_thesis: payload.thesis_label,
  }) + "\n";
  // Vercel functions get a read-only FS except /tmp, and /tmp is per-invocation
  // ephemeral. The DURABLE record on Vercel is the function log, so the queue
  // line is ALWAYS console.log'd as well; the file append is a local-dev
  // convenience (QS_DIR volume when self-hosted). Never served either way.
  console.log("[for-funds-sample-queue] " + line.trim());
  for (const dir of [process.env.QS_DIR, "/qstore", "/tmp"].filter(Boolean)) {
    try {
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      appendFileSync(join(dir, "for-funds-sample-queue.jsonl"), line, "utf8");
      return { queued: true, via: dir === "/tmp" ? "tmp" : "volume", queue_id: id };
    } catch {
      /* try next */
    }
  }
  return { queued: false, via: "stdout", queue_id: id };
}

// ---- best-effort analytics (same relay pattern as crawl-proxy) -----------
function emitAnalytics(event, props) {
  if (!RELAY_SECRET) return; // relay unconfigured: skip silently
  try {
    fetch(RELAY_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-relay-secret": RELAY_SECRET },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        properties: Object.assign({ token: POSTHOG_KEY }, props),
      }),
    }).catch(() => {});
  } catch {}
}

// ---- handlers -------------------------------------------------------------
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  let bank;
  try {
    bank = loadBank();
  } catch (e) {
    console.error("[for-funds-sample] cannot load data bank:", e && e.message);
    return res.status(500).json({ ok: false, error: "data_unavailable" });
  }

  if (req.method === "GET") {
    // Minimal bank for the page picker: no emails, just labels + ids.
    return res.status(200).json({
      ok: true,
      updated: bank.updated,
      max_matches: bank.max_matches,
      theses: bank.theses.map((t) => ({ id: t.id, label: t.label })),
    });
  }

  // POST: generate a sample for a submitted thesis.
  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const thesis = clamp(body.thesis, MAX_THESIS);
  if (thesis.length < 20) {
    return res.status(400).json({
      ok: false,
      error: "thesis_too_short",
      hint: "Describe your thesis in at least 20 characters (sectors, stage, geography).",
    });
  }
  const email = clamp(body.email, MAX_GENERAL);
  const name = clamp(body.name, MAX_GENERAL);
  const fund = clamp(body.fund, MAX_GENERAL);
  const variant = matchedVariant(body.variant);

  const picked = pickThesis(thesis, bank);
  const th = picked.th;
  const matches = th.matches.map((m) => ({
    name: m.name,
    sector: m.sector,
    velocity_score: m.velocity,
    delta_velocity: m.delta_velocity,
    delta_contributors: m.delta_contributors,
    signal: m.signal,
    profile: m.profile,
    why_matched: m.why,
    evidence: m.evidence,
  }));

  const payload = {
    thesis,
    email,
    name,
    fund,
    variant,
    thesis_label: th.label,
  };
  const queued = queueRequest(payload);

  emitAnalytics("for_funds_sample_generated", {
    matched_thesis: th.id,
    keyword_score: picked.score,
    match_count: matches.length,
    variant,
    has_email: Boolean(email),
  });

  return res.status(200).json({
    ok: true,
    internal_only: true,
    note: "Sample generated locally. Nothing was emailed: a human reviews the queue and replies from signals@gitdealflow.com within a few business days.",
    queue_id: queued.queue_id,
    queued_via: queued.via,
    data_updated: bank.updated,
    thesis_label: th.label,
    method: th.method,
    matched_keywords: picked.hitList.slice(0, 6),
    matches,
  });
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
