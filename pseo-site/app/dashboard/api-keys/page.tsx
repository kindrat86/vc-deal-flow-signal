import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { generateApiKey } from "@/lib/api-key";
import ApiKeyDisplay from "./ApiKeyDisplay";

export const metadata: Metadata = {
  title: "API Keys — VC Deal Flow Signal",
  robots: { index: false },
};

export default async function ApiKeysPage() {
  const session = await getSession();

  if (!session) redirect("/login");
  if (session.tier !== "insider") redirect("/dashboard");

  const apiKey = generateApiKey(session.customerId, session.email);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">API Keys</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-100 mb-2">API Access</h1>
      <p className="text-gray-400 mb-8">
        Use your API key to integrate signal data into your own tools, CRM, or spreadsheets.
      </p>

      {/* API Key */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Your API Key</h2>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Insider
          </span>
        </div>
        <ApiKeyDisplay apiKey={apiKey} />
        <p className="text-gray-600 text-xs mt-3">
          Keep this key secret. Do not share it or commit it to public repositories.
        </p>
      </div>

      {/* Usage examples */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Usage</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-gray-200 text-sm font-medium mb-2">JSON endpoint</h3>
            <pre className="bg-slate-950 rounded-lg px-4 py-3 text-xs text-gray-300 overflow-x-auto">
{`curl -H "Authorization: Bearer ${apiKey}" \\
  https://signals.gitdealflow.com/api/signals.json`}
            </pre>
          </div>

          <div>
            <h3 className="text-gray-200 text-sm font-medium mb-2">CSV endpoint</h3>
            <pre className="bg-slate-950 rounded-lg px-4 py-3 text-xs text-gray-300 overflow-x-auto">
{`curl -H "Authorization: Bearer ${apiKey}" \\
  https://signals.gitdealflow.com/api/signals.csv`}
            </pre>
          </div>

          <div>
            <h3 className="text-gray-200 text-sm font-medium mb-2">Python</h3>
            <pre className="bg-slate-950 rounded-lg px-4 py-3 text-xs text-gray-300 overflow-x-auto">
{`import requests

resp = requests.get(
    "https://signals.gitdealflow.com/api/signals.json",
    headers={"Authorization": "Bearer ${apiKey}"}
)
startups = resp.json()["startups"]

for s in startups[:10]:
    print(f"{s['name']}: {s['commitVelocityChange']}")`}
            </pre>
          </div>
        </div>
      </div>

      {/* Rate limits */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Limits</h2>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-center gap-2">
            <span className="text-sky-500">&#8226;</span>
            100 requests per hour
          </li>
          <li className="flex items-center gap-2">
            <span className="text-sky-500">&#8226;</span>
            Data refreshes weekly (every Monday)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-sky-500">&#8226;</span>
            Includes enrichment data (funding, team size)
          </li>
        </ul>
      </div>
    </div>
  );
}
