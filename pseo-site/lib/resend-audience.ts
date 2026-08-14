import "server-only";

/**
 * Resolve the GitDealFlow Resend audience id.
 *
 * The Resend team hosts audiences for several products (VoiceLogPro,
 * UnlockSaaS, GitDealFlow, split out 2026-07-03), so `audiences.data[0]`
 * is NOT safe: between 2026-07-05 and 2026-07-13 the daily Seinfeld
 * broadcast went to another product's list because of exactly that.
 *
 * Resolution order:
 *   1. RESEND_AUDIENCE_ID env (pinned in Vercel production)
 *   2. the audience whose name contains "gitdealflow"
 *   3. data[0] as a last resort (single-audience accounts)
 */

interface AudienceList {
  data?: Array<{ id?: string; name?: string }>;
}

export function pickAudienceId(audiences: AudienceList): string | undefined {
  const pinned = process.env.RESEND_AUDIENCE_ID?.trim();
  if (pinned) return pinned;
  const byName = audiences.data?.find((a) =>
    a.name?.toLowerCase().includes("gitdealflow"),
  );
  return byName?.id ?? audiences.data?.[0]?.id;
}

export async function resolveAudienceId(
  apiKey: string,
): Promise<string | undefined> {
  const pinned = process.env.RESEND_AUDIENCE_ID?.trim();
  if (pinned) return pinned;
  const res = await fetch("https://api.resend.com/audiences", {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) return undefined;
  const json: AudienceList = await res.json();
  return pickAudienceId(json);
}
