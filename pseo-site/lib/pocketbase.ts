// Local stub for the PocketBase client.
//
// In this branch the /receipts (Scout Score) feature is not present, but the
// /api/og/scout/[handle] OG route still ships and references getScoutByHandle.
// This stub returns null for every handle so the OG route falls back to its
// "Scout not found" image. Replace with a real PocketBase client when the
// scout feature merges.

export interface Scout {
  handle: string;
  rank: "curious" | "scout" | "sharp" | "elite" | "oracle";
  correct_count: number;
  wrong_count: number;
  pending_count: number;
  points: number;
  founder_scout: boolean;
  score?: number;
}

export async function getScoutByHandle(
  _handle: string,
): Promise<Scout | null> {
  return null;
}
