import type { Metadata } from "next";
import Link from "next/link";

// Server-rendered each request: the page reads the proposed `summary` from
// the URL, displays it for the user to review, and an inline form lets the
// user mint a token via /api/mcp/share-approval. The token is then shown in
// a copy-friendly box. The user pastes it back to the agent, which retries
// share_result with the token included.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Approve Share, VC Deal Flow Signal MCP" },
  description:
    "Review the post the agent wants to compose for you. Nothing is published, this only mints a 10-minute approval token for the share_result MCP tool.",
  robots: { index: false, follow: false },
};

const MAX_LEN = 200;
const MIN_LEN = 10;

interface PageProps {
  searchParams: Promise<{ summary?: string }>;
}

export default async function ShareApprovePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const proposed = (sp.summary ?? "").trim();
  const lenOk = proposed.length >= MIN_LEN && proposed.length <= MAX_LEN;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 text-slate-900">
      <p className="text-xs uppercase tracking-widest text-slate-500">
        VC Deal Flow Signal · MCP approval
      </p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight">
        Review the post your agent wants to compose
      </h1>
      <p className="mt-3 text-slate-700">
        Nothing is published from this page. This step exists so an MCP client
        (Claude, Cursor, Cline, etc.) can&apos;t compose social-media post
        bodies for you without an explicit human checkpoint. After you
        approve, you&apos;ll get a 10-minute one-time token to paste back to
        the agent, only then can it call <code>share_result</code>.
      </p>

      <section className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Proposed summary ({proposed.length} chars)
        </p>
        <blockquote className="mt-2 whitespace-pre-wrap font-mono text-sm text-slate-900">
          {proposed || (
            <span className="italic text-slate-400">
              No summary supplied. Open this page from the URL the agent gave
              you, with a <code>?summary=...</code> query parameter.
            </span>
          )}
        </blockquote>
        {!lenOk && proposed.length > 0 && (
          <p className="mt-3 text-sm text-red-600">
            Summary must be {MIN_LEN}-{MAX_LEN} characters. Ask the agent to
            shorten / expand and retry.
          </p>
        )}
      </section>

      {lenOk && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">If this looks fine, approve:</h2>
          <p className="mt-2 text-sm text-slate-700">
            The token below is signed against a hash of the exact text above.
            If the agent tries to call <code>share_result</code> with a
            different summary, the token will be rejected.
          </p>
          <ApprovalWidget summary={proposed} />
        </section>
      )}

      <section className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">What share_result does</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Composes platform-specific post bodies (Twitter, Bluesky,
            Mastodon, LinkedIn, Telegram).
          </li>
          <li>Returns intent URLs that pre-fill the destination network&apos;s compose UI.</li>
          <li>
            Does <strong>not</strong> publish on your behalf, you still click
            Post in the destination network.
          </li>
        </ul>
        <p className="mt-4">
          <Link href="/api/mcp/rpc" className="underline">
            MCP server endpoint
          </Link>{" "}
          ·{" "}
          <Link href="/methodology" className="underline">
            Methodology
          </Link>
        </p>
      </section>
    </main>
  );
}

function ApprovalWidget({ summary }: { summary: string }) {
  // The widget is rendered server-side and progressively enhanced by the
  // tiny inline script below. If JS is disabled the user can still POST the
  // form directly, we render the resulting JSON as plain text in that case.
  return (
    <div className="mt-4 space-y-4">
      <form
        method="POST"
        action="/api/mcp/share-approval"
        encType="application/x-www-form-urlencoded"
        id="approve-form"
        className="flex flex-col gap-3"
      >
        <input type="hidden" name="summary" value={summary} />
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Approve · mint 10-minute token
        </button>
      </form>

      <div
        id="approve-result"
        className="hidden rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm"
      >
        <p className="font-semibold text-emerald-900">
          Approval token (paste this into the agent chat):
        </p>
        <pre
          id="approve-token"
          className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded bg-white p-3 font-mono text-xs text-slate-900"
        ></pre>
        <p className="mt-2 text-xs text-emerald-900">
          Expires in <span id="approve-ttl">600</span> seconds. Single-purpose:
          only valid for the exact summary above.
        </p>
        <button
          type="button"
          id="approve-copy"
          className="mt-3 rounded bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
        >
          Copy token
        </button>
      </div>

      <noscript>
        <p className="text-xs text-slate-500">
          JavaScript is disabled. Submitting the form will return a JSON
          response containing the token under the <code>approval_token</code>{" "}
          key. Copy that value and paste it back to your agent.
        </p>
      </noscript>

      <script
        // Minimal progressive enhancement, no framework hydration needed.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var form = document.getElementById('approve-form');
              if (!form) return;
              var box = document.getElementById('approve-result');
              var tok = document.getElementById('approve-token');
              var ttl = document.getElementById('approve-ttl');
              var copyBtn = document.getElementById('approve-copy');
              form.addEventListener('submit', async function (ev) {
                ev.preventDefault();
                var fd = new FormData(form);
                var summary = fd.get('summary');
                var res = await fetch('/api/mcp/share-approval', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ summary: summary }),
                });
                if (!res.ok) {
                  var err = await res.text();
                  tok.textContent = 'Error: ' + err;
                  box.classList.remove('hidden');
                  return;
                }
                var data = await res.json();
                tok.textContent = data.approval_token || '';
                if (ttl && typeof data.expires_in === 'number') ttl.textContent = String(data.expires_in);
                box.classList.remove('hidden');
              });
              if (copyBtn) {
                copyBtn.addEventListener('click', function () {
                  var t = (tok.textContent || '').trim();
                  if (!t || !navigator.clipboard) return;
                  navigator.clipboard.writeText(t).then(function () {
                    copyBtn.textContent = 'Copied ✓';
                    setTimeout(function () { copyBtn.textContent = 'Copy token'; }, 1500);
                  });
                });
              }
            })();
          `,
        }}
      />
    </div>
  );
}
