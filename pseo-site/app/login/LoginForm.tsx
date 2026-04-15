"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  expired: "That link has expired. Please request a new one.",
  invalid: "Invalid login link. Please try again.",
  no_subscription: "No active subscription found for that email.",
  server: "Something went wrong. Please try again.",
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-sky-500/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-3">Check your email</h2>
        <p className="text-gray-400 mb-2">
          If <span className="text-gray-200">{email}</span> has an active subscription,
          we just sent you a login link.
        </p>
        <p className="text-gray-500 text-sm">The link expires in 15 minutes.</p>
        <button
          onClick={() => { setSent(false); setLoading(false); }}
          className="mt-6 text-sky-500 hover:text-sky-400 text-sm transition"
        >
          Try a different email
        </button>
      </div>
    );
  }

  return (
    <div>
      {urlError && ERROR_MESSAGES[urlError] && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
          {ERROR_MESSAGES[urlError]}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Sending..." : "Send Login Link"}
        </button>
      </form>

      <p className="text-gray-600 text-xs mt-4 text-center">
        We&apos;ll email you a magic link — no password needed.
      </p>
    </div>
  );
}
