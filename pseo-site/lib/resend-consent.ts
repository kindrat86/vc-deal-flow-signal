import "server-only";

export type ResendConsentStatus = "clear" | "suppressed" | "unknown";

/**
 * Fail closed before adding or scheduling mail for an address. Resend returns
 * 404 when no global suppression exists. Any other response, timeout, or
 * network failure is unknown and blocks side effects.
 */
export async function getResendConsentStatus(
  email: string,
  apiKey: string,
): Promise<ResendConsentStatus> {
  if (!email || !apiKey) return "unknown";
  try {
    const response = await fetch(
      `https://api.resend.com/suppressions/${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store" },
    );
    if (response.status === 404) return "clear";
    if (response.ok) return "suppressed";
    return "unknown";
  } catch {
    return "unknown";
  }
}
