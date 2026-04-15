"use client";

import { useState } from "react";

export default function ApiKeyDisplay({ apiKey }: { apiKey: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const masked = apiKey.slice(0, 8) + "•".repeat(24) + apiKey.slice(-4);

  async function copyKey() {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      <code className="flex-1 bg-slate-950 rounded-lg px-4 py-3 text-sm text-gray-200 font-mono select-all">
        {revealed ? apiKey : masked}
      </code>
      <button
        onClick={() => setRevealed(!revealed)}
        className="text-gray-500 hover:text-gray-300 text-xs transition whitespace-nowrap"
      >
        {revealed ? "Hide" : "Reveal"}
      </button>
      <button
        onClick={copyKey}
        className="text-sky-500 hover:text-sky-400 text-xs transition whitespace-nowrap"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
