import "server-only";
import { pb } from "@/lib/pocketbase";
import type { Segment, Confidence } from "@/lib/dream-customers-seed";
import type { Stage, DreamCustomer } from "@/lib/dream-customers-types";

// Re-export so existing server imports of these from "@/lib/dream-customers"
// keep working without rewrites.
export { STAGES, STAGE_LABELS } from "@/lib/dream-customers-types";
export type { Stage, DreamCustomer } from "@/lib/dream-customers-types";

interface PbList<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

const COLLECTION = "dream_customers";

export async function listDreamCustomers(): Promise<DreamCustomer[]> {
  const all: DreamCustomer[] = [];
  let page = 1;
  const perPage = 200;
  while (true) {
    const res = await pb<PbList<DreamCustomer>>(
      `/api/collections/${COLLECTION}/records`,
      { query: { page, perPage, sort: "name" } },
    );
    all.push(...res.items);
    if (page >= res.totalPages || res.items.length === 0) break;
    page += 1;
  }
  return all;
}

export async function getByHandle(handle: string): Promise<DreamCustomer | null> {
  const res = await pb<PbList<DreamCustomer>>(
    `/api/collections/${COLLECTION}/records`,
    {
      query: {
        filter: `handle = ${JSON.stringify(handle)}`,
        perPage: 1,
      },
    },
  );
  return res.items[0] ?? null;
}

export interface CreateInput {
  name: string;
  handle: string;
  firm?: string;
  role?: string;
  url?: string;
  segment?: Segment;
  confidence?: Confidence;
  stage?: Stage;
  notes?: string;
}

export async function createDreamCustomer(input: CreateInput): Promise<DreamCustomer> {
  return pb<DreamCustomer>(`/api/collections/${COLLECTION}/records`, {
    method: "POST",
    body: {
      name: input.name,
      handle: input.handle,
      firm: input.firm ?? "",
      role: input.role ?? "",
      url: input.url ?? `https://x.com/${input.handle}`,
      segment: input.segment ?? "",
      confidence: input.confidence ?? "",
      stage: input.stage ?? "sourced",
      comment_count: 0,
      notes: input.notes ?? "",
    },
  });
}

export interface UpdateInput {
  stage?: Stage;
  notes?: string;
  comment_count?: number;
  commentIncrement?: 1 | -1;
  last_engaged_at?: string | null;
  name?: string;
  firm?: string;
  role?: string;
  url?: string;
  segment?: Segment | "";
  confidence?: Confidence | "";
}

export async function updateDreamCustomer(
  id: string,
  input: UpdateInput,
): Promise<DreamCustomer> {
  const body: Record<string, unknown> = {};
  if (input.stage !== undefined) body.stage = input.stage;
  if (input.notes !== undefined) body.notes = input.notes;
  if (input.comment_count !== undefined) body.comment_count = Math.max(0, input.comment_count);
  if (input.last_engaged_at !== undefined) body.last_engaged_at = input.last_engaged_at ?? "";
  if (input.name !== undefined) body.name = input.name;
  if (input.firm !== undefined) body.firm = input.firm;
  if (input.role !== undefined) body.role = input.role;
  if (input.url !== undefined) body.url = input.url;
  if (input.segment !== undefined) body.segment = input.segment;
  if (input.confidence !== undefined) body.confidence = input.confidence;

  if (input.commentIncrement === 1) {
    // PB supports atomic increment via "field+" / "field-" body keys.
    body["comment_count+"] = 1;
    body.last_engaged_at = new Date().toISOString();
  } else if (input.commentIncrement === -1) {
    // Read-then-clamp; PB has no "max(0, x-1)" primitive and we don't want
    // to go negative.
    const current = await pb<DreamCustomer>(
      `/api/collections/${COLLECTION}/records/${id}`,
    );
    body.comment_count = Math.max(0, (current.comment_count ?? 0) - 1);
  }

  return pb<DreamCustomer>(`/api/collections/${COLLECTION}/records/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteDreamCustomer(id: string): Promise<void> {
  await pb(`/api/collections/${COLLECTION}/records/${id}`, { method: "DELETE" });
}

/** Used by the seed script — safe to call repeatedly. */
export async function upsertByHandle(input: CreateInput): Promise<{
  record: DreamCustomer;
  created: boolean;
}> {
  const existing = await getByHandle(input.handle);
  if (!existing) {
    const record = await createDreamCustomer(input);
    return { record, created: true };
  }
  // Refresh metadata fields (name/firm/role/url/segment/confidence) but
  // leave stage/comment_count/notes/last_engaged_at alone — those are
  // user-edited live state.
  const record = await updateDreamCustomer(existing.id, {
    name: input.name,
    firm: input.firm ?? "",
    role: input.role ?? "",
    url: input.url ?? `https://x.com/${input.handle}`,
    segment: input.segment ?? "",
    confidence: input.confidence ?? "",
  });
  return { record, created: false };
}
