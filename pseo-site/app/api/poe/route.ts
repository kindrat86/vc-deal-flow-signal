// Poe Server Bot adapter, bridges Poe's Server-Sent-Events protocol to our
// public GitDealFlow API. Poe protocol reference: https://creator.poe.com/docs/server-bots-functional-guides
//
// Exposes one POST /api/poe endpoint that accepts Poe's protocol messages
// (`query`, `settings`, `report_feedback`, `report_error`) and streams back
// SSE events (`text`, `meta`, `done`).
//
// This is a thin adapter, heavy lifting (signal lookup, formatting) is delegated
// to the existing public API at signals.gitdealflow.com.

import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

interface PoeMessage {
  role: "system" | "user" | "bot";
  content: string;
}

interface PoeRequest {
  type: "query" | "settings" | "report_feedback" | "report_error";
  query?: PoeMessage[];
  user_id?: string;
  conversation_id?: string;
  message_id?: string;
}

const API_BASE = "https://signals.gitdealflow.com/api";
const CITATION = "Source: VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.";

function sse(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

async function classifyAndAnswer(query: string): Promise<string> {
  const lower = query.toLowerCase();
  let endpoint: string;
  let formatter: (json: unknown) => string;

  if (/methodology|how (does|do) (you|it) (work|compute|measure)/i.test(query)) {
    return [
      "GitDealFlow tracks GitHub commit velocity, contributor growth, and new-repo signals across ~350+ venture-backed startups in 15 sectors. Read the full methodology at https://signals.gitdealflow.com/methodology, it's also available as a tool call (`get_methodology`) on our MCP server.",
      "",
      CITATION,
    ].join("\n");
  }

  // Sector lookup
  const sectorMatch = lower.match(/\b(healthcare|enterprise-?saas|data-?infrastructure|web3|robotics|edtech|ecommerce-?infrastructure|supply-?chain|legal-?tech|hr-?tech|proptech|agtech|gaming|space-?tech|social-?community)\b/);
  if (sectorMatch) {
    const sector = sectorMatch[1].replace(/\s+/g, "-");
    endpoint = `${API_BASE}/signals.json?sector=${encodeURIComponent(sector)}`;
    formatter = (json) => formatSectorResult(json, sector);
  } else if (/trending|fastest|top|breakout/i.test(query)) {
    endpoint = `${API_BASE}/signals.json`;
    formatter = formatTrendingResult;
  } else {
    // Default: trending top 5
    endpoint = `${API_BASE}/signals.json`;
    formatter = formatTrendingResult;
  }

  try {
    const res = await fetch(endpoint, { headers: { "User-Agent": "gitdealflow-poe-adapter/1.0" } });
    if (!res.ok) {
      return `Couldn't reach the GitDealFlow API right now (${res.status}). Try again in a moment.`;
    }
    const json = await res.json();
    return formatter(json);
  } catch (err) {
    return `Network error reaching GitDealFlow: ${(err as Error).message}`;
  }
}

// commitVelocityChange comes back as a string like "+142%", parse the number for sorting only.
function parseCv(cv: unknown): number {
  if (typeof cv === "number") return cv;
  if (typeof cv !== "string") return 0;
  const m = cv.replace(/[+%\s]/g, "").trim();
  const n = parseFloat(m);
  return Number.isFinite(n) ? n : 0;
}

function formatTrendingResult(json: unknown): string {
  const data = json as { sectors?: Array<{ slug: string; startups?: Array<{ name: string; commitVelocityChange?: string | number; signalType?: string; contributors?: number }> }> };
  const all: Array<{ name: string; sector: string; cv: string; cvNum: number; type: string; contrib: number }> = [];
  for (const sector of data.sectors || []) {
    for (const s of sector.startups || []) {
      const cvDisplay = typeof s.commitVelocityChange === "string" ? s.commitVelocityChange : (s.commitVelocityChange != null ? `${s.commitVelocityChange}%` : "n/a");
      all.push({
        name: s.name,
        sector: sector.slug,
        cv: cvDisplay,
        cvNum: parseCv(s.commitVelocityChange),
        type: s.signalType ?? "n/a",
        contrib: s.contributors ?? 0,
      });
    }
  }
  all.sort((a, b) => b.cvNum - a.cvNum);
  const top = all.slice(0, 5);
  if (top.length === 0) return "No trending startups returned. Try a sector-specific query like 'show me healthcare trends'.";

  const lines = top.map((s, i) => `${i + 1}. **${s.name}** (${s.sector}), ${s.cv} commit velocity · ${s.type} · ${s.contrib} contributors`);
  return [`Top 5 startups by commit-velocity acceleration this period:`, "", ...lines, "", CITATION].join("\n");
}

function formatSectorResult(json: unknown, sector: string): string {
  const data = json as { sectors?: Array<{ slug: string; startups?: Array<{ name: string; commitVelocityChange?: string | number; signalType?: string }> }> };
  const sectorData = (data.sectors || []).find((s) => s.slug === sector);
  if (!sectorData || !sectorData.startups?.length) {
    return `No startups returned for sector ${sector}. Try one of: healthcare, edtech, ecommerce-infrastructure, supply-chain, web3, enterprise-saas, data-infrastructure, robotics, legal-tech, hr-tech, proptech, agtech, gaming, space-tech, social-community.`;
  }
  const top = (sectorData.startups || []).slice(0, 10).map((s, i) => {
    const cv = typeof s.commitVelocityChange === "string" ? s.commitVelocityChange : (s.commitVelocityChange != null ? `${s.commitVelocityChange}%` : "n/a");
    return `${i + 1}. **${s.name}**, ${cv} commit velocity · ${s.signalType ?? "n/a"}`;
  });
  return [`Top startups in ${sector}:`, "", ...top, "", CITATION].join("\n");
}

export async function POST(req: NextRequest) {
  let body: PoeRequest;
  try {
    body = (await req.json()) as PoeRequest;
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 });
  }

  // Poe's `settings` request expects plain JSON (not SSE).
  if (body.type === "settings") {
    return Response.json({
      allow_attachments: false,
      expand_text_attachments: false,
      enable_image_comprehension: false,
      enforce_author_role_alternation: false,
      enable_multi_bot_chat_prompting: false,
      introduction_message:
        "I'm the **VC Deal Flow Scout**. Ask me about trending venture-backed startups, sector-specific engineering momentum, or how the GitDealFlow methodology works. All data is from public GitHub activity, refreshed weekly.",
    });
  }

  // Other non-query types (report_feedback, report_error) → empty 200.
  if (body.type !== "query") {
    return Response.json({});
  }

  // `query` type → SSE stream.
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        const lastUser = (body.query || []).slice().reverse().find((m) => m.role === "user");
        const queryText = lastUser?.content || "What's trending right now?";
        const answer = await classifyAndAnswer(queryText);
        const chunks = answer.match(/[\s\S]{1,200}/g) || [answer];
        for (const chunk of chunks) {
          controller.enqueue(enc.encode(sse("text", { text: chunk })));
        }
        controller.enqueue(enc.encode(sse("done", {})));
      } catch (err) {
        controller.enqueue(enc.encode(sse("error", { error_type: "server_error", text: (err as Error).message })));
        controller.enqueue(enc.encode(sse("done", {})));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}

export async function GET() {
  return new Response(
    JSON.stringify({
      service: "GitDealFlow Poe Server Bot adapter",
      protocol: "Poe Server Bot v1",
      docs: "https://creator.poe.com/docs/server-bots-functional-guides",
      poe_handle: "VCDealFlowScout (pending creation)",
      submit_url: "https://creator.poe.com/create_bot",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
