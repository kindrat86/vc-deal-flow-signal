/**
 * /.well-known/mta-sts.txt, MTA Strict Transport Security policy.
 *
 * F38 (2026-05-08). RFC 8461. Tells sending mail servers that messages
 * destined for our domain MUST be delivered over TLS to one of the
 * advertised MX hosts, otherwise the SMTP transaction must be aborted.
 *
 * Companion DNS records (managed outside this repo):
 *   _mta-sts.gitdealflow.com TXT "v=STSv1; id=20260508T120000Z"
 *   _smtp._tls.gitdealflow.com TXT "v=TLSRPTv1; rua=mailto:tls-rua@gitdealflow.com"
 *
 * The HTTP file at THIS path must be served over HTTPS only (handled by
 * Vercel HSTS + the platform's TLS termination).
 */

export const runtime = "nodejs";
export const dynamic = "force-static";

const POLICY = `version: STSv1
mode: enforce
mx: feedback-smtp.us-east-1.amazonses.com
mx: feedback-smtp.eu-west-1.amazonses.com
mx: mx1.resend.com
mx: mx2.resend.com
max_age: 604800
`;

export async function GET() {
  return new Response(POLICY, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=604800",
      "x-robots-tag": "noindex",
    },
  });
}
