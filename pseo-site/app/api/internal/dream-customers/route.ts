import { getSession, isAdmin } from "@/lib/auth";
import {
  listDreamCustomers,
  createDreamCustomer,
  STAGES,
  type Stage,
} from "@/lib/dream-customers";
import type { Segment, Confidence } from "@/lib/dream-customers-seed";

export const dynamic = "force-dynamic";

const NOT_FOUND = () =>
  new Response(JSON.stringify({ error: "not_found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });

export async function GET() {
  const session = await getSession();
  if (!isAdmin(session)) return NOT_FOUND();

  const items = await listDreamCustomers();
  return Response.json({ items });
}

const SEGMENTS: Segment[] = ["A", "B", "D", "F"];
const CONFIDENCES: Confidence[] = ["HIGH", "MEDIUM", "LOW"];

function isStage(v: unknown): v is Stage {
  return typeof v === "string" && (STAGES as readonly string[]).includes(v);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!isAdmin(session)) return NOT_FOUND();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const handle = typeof b.handle === "string" ? b.handle.trim().replace(/^@/, "") : "";
  if (!name || !handle) {
    return Response.json({ error: "name_and_handle_required" }, { status: 400 });
  }

  try {
    const record = await createDreamCustomer({
      name,
      handle,
      firm: typeof b.firm === "string" ? b.firm : "",
      role: typeof b.role === "string" ? b.role : "",
      url: typeof b.url === "string" ? b.url : `https://x.com/${handle}`,
      segment:
        typeof b.segment === "string" && SEGMENTS.includes(b.segment as Segment)
          ? (b.segment as Segment)
          : undefined,
      confidence:
        typeof b.confidence === "string" && CONFIDENCES.includes(b.confidence as Confidence)
          ? (b.confidence as Confidence)
          : undefined,
      stage: isStage(b.stage) ? b.stage : undefined,
      notes: typeof b.notes === "string" ? b.notes : "",
    });
    return Response.json({ record }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Unique-handle violations bubble up from PB as 400 with a validation
    // message; surface the raw error so the UI can show "handle taken".
    return Response.json({ error: "create_failed", detail: msg }, { status: 400 });
  }
}
