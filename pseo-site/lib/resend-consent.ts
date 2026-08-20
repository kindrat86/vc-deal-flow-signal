export type ResendConsentStatus =
  | "clear"
  | "suppressed"
  | "unsubscribed"
  | "unknown";

type FetchLike = typeof fetch;

/**
 * Check both Resend consent layers before adding a contact or scheduling mail.
 *
 * A 404 means the address is absent from that layer. Any other unexpected
 * response fails closed so a temporary API problem cannot re-add or mail a
 * contact whose consent state we could not prove.
 */
export async function getResendConsentStatus(
  email: string,
  apiKey: string,
  fetchImpl: FetchLike = fetch,
): Promise<ResendConsentStatus> {
  const encodedEmail = encodeURIComponent(email);
  const headers = { Authorization: `Bearer ${apiKey}` };

  try {
    const suppressionResponse = await fetchImpl(
      `https://api.resend.com/suppressions/${encodedEmail}`,
      { headers },
    );
    if (suppressionResponse.ok) return "suppressed";
    if (suppressionResponse.status !== 404) return "unknown";

    const contactResponse = await fetchImpl(
      `https://api.resend.com/contacts/${encodedEmail}`,
      { headers },
    );
    if (contactResponse.status === 404) return "clear";
    if (!contactResponse.ok) return "unknown";

    const contact = (await contactResponse.json()) as {
      unsubscribed?: unknown;
    };
    return contact.unsubscribed === true ? "unsubscribed" : "clear";
  } catch {
    return "unknown";
  }
}
