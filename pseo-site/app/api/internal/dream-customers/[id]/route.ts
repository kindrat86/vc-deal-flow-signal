import { getSession, isAdmin } from "@/lib/auth";
import {
  updateDreamCustomer,
  deleteDreamCustomer,
  STAGES,
  type Stage,
  type UpdateInput,
} from "@/lib/dream-customers";
import type { Segment, Confidence } from "@/lib/dream-customers-seed";

export const dynamic = "force-dynamic";

const NOT_FOUND = () =>
  new Response(JSON.stringify({ error: "not_found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });

const SEGMENTS: Segment[] = ["A", "B", "D", "F"];
const CONFIDENCES: Confidence[] = ["HIGH", "MEDIUM", "LOW"];

function isStage(v: unknown): v is Stage {
  return typeof v === "string" && (STAGES as readonly string[]).includes(v);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!isAdmin(session)) return NOT_FOUND();

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;

  const patch: UpdateInput = {};
  if (isStage(b.stage)) patch.stage = b.stage;
  if (typeof b.notes === "string") patch.notes = b.notes;
  if (typeof b.comment_count === "number") patch.comment_count = b.comment_count;
  if (b.commentIncrement === 1 || b.commentIncrement === -1) {
    patch.commentIncrement = b.commentIncrement;
  }
  if (b.last_engaged_at === null || typeof b.last_engaged_at === "string") {
    patch.last_engaged_at = b.last_engaged_at;
  }
  if (typeof b.name === "string") patch.name = b.name;
  if (typeof b.firm === "string") patch.firm = b.firm;
  if (typeof b.role === "string") patch.role = b.role;
  if (typeof b.url === "string") patch.url = b.url;
  if (typeof b.segment === "string" && (b.segment === "" || SEGMENTS.includes(b.segment as Segment))) {
    patch.segment = b.segment as Segment | "";
  }
  if (
    typeof b.confidence === "string" &&
    (b.confidence === "" || CONFIDENCES.includes(b.confidence as Confidence))
  ) {
    patch.confidence = b.confidence as Confidence | "";
  }

  try {
    const record = await updateDreamCustomer(id, patch);
    return Response.json({ record });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: "update_failed", detail: msg }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!isAdmin(session)) return NOT_FOUND();

  const { id } = await params;
  try {
    await deleteDreamCustomer(id);
    return new Response(null, { status: 204 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: "delete_failed", detail: msg }, { status: 400 });
  }
}
