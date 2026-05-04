"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReceiptsForm({ initialUsername = "" }: { initialUsername?: string }) {
  const router = useRouter();
  const [username, setUsername] = useState(initialUsername);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleaned = username.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?github\.com\//i, "").split("/")[0];
    if (!cleaned) {
      setError("Enter a GitHub username");
      return;
    }
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(cleaned)) {
      setError("That doesn't look like a valid GitHub username");
      return;
    }
    setLoading(true);
    router.push(`/receipts/${encodeURIComponent(cleaned)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm pointer-events-none">
          github.com/
        </span>
        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your-username"
          className="w-full pl-28 pr-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-gray-100 font-mono text-sm placeholder-gray-600"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-sky-700 hover:bg-sky-600 disabled:bg-slate-700 disabled:cursor-wait text-white font-medium text-sm transition-colors whitespace-nowrap"
      >
        {loading ? "Pulling stars…" : "Show my receipts →"}
      </button>
      {error ? (
        <p className="sm:absolute sm:-bottom-6 text-rose-400 text-xs mt-1 sm:mt-0">{error}</p>
      ) : null}
    </form>
  );
}
