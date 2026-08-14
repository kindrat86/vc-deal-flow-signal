/**
 * /.well-known/change-password, RFC 8615 + draft-ietf-httpapi-change-password
 *
 * Password managers (1Password, Bitwarden, iCloud Keychain, Chrome) probe
 * this URL to deep-link a user to the password-reset flow. Without it,
 * "change my password on this site" → manual hunt. 308 redirect to the
 * canonical magic-link login flow keeps password managers happy and adds
 * a small trust signal to vulnerability scanners.
 */

export const runtime = "nodejs";

export async function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      Location: "https://signals.gitdealflow.com/login",
      "Cache-Control": "public, max-age=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
