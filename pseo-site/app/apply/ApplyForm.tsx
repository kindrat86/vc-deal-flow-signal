"use client";

import { useState } from "react";

interface FormState {
  fund_name: string;
  contact_name: string;
  email: string;
  aum: string;
  thesis: string;
  how_heard: string;
  quarterly_question: string;
}

const INITIAL: FormState = {
  fund_name: "",
  contact_name: "",
  email: "",
  aum: "",
  thesis: "",
  how_heard: "",
  quarterly_question: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ApplyForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrMsg("");
    try {
      const res = await fetch("/api/sharp-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Network error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-emerald-950/30 border border-emerald-700/40 rounded-lg p-5 space-y-2">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          Received
        </p>
        <p className="text-gray-100 text-base">
          Application logged. The founder will reply to{" "}
          <strong className="text-emerald-200">{form.email}</strong> within 48
          business hours with either a Stripe invoice or a written decline.
        </p>
        <p className="text-gray-400 text-sm">
          If you don&rsquo;t see a reply by Wednesday next week, check spam, then
          reply to your most recent email from{" "}
          <code className="text-emerald-200 bg-emerald-900/40 px-1.5 py-0.5 rounded text-xs">
            signal@gitdealflow.com
          </code>{" "}
          to bump it.
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Fund / syndicate name"
          required
          id="fund_name"
          value={form.fund_name}
          onChange={(v) => update("fund_name", v)}
          placeholder="e.g. Atlas Seed Capital"
        />
        <Field
          label="Your name (or initials)"
          required
          id="contact_name"
          value={form.contact_name}
          onChange={(v) => update("contact_name", v)}
          placeholder="e.g. M.K. or full name"
        />
      </div>
      <Field
        label="Email"
        required
        id="email"
        type="email"
        value={form.email}
        onChange={(v) => update("email", v)}
        placeholder="you@yourfund.com"
      />
      <Field
        label="AUM or deals/year (rough)"
        required
        id="aum"
        value={form.aum}
        onChange={(v) => update("aum", v)}
        placeholder="e.g. €25M AUM, ~12 checks/yr"
      />
      <FieldArea
        label="Thesis focus"
        required
        id="thesis"
        value={form.thesis}
        onChange={(v) => update("thesis", v)}
        placeholder="One or two sentences on the sectors and stage you focus on. Specific is better than broad."
        rows={3}
      />
      <Field
        label="How did you hear about us"
        id="how_heard"
        value={form.how_heard}
        onChange={(v) => update("how_heard", v)}
        placeholder="e.g. Hacker News, Substack, a friend's portfolio, the SSRN paper"
      />
      <FieldArea
        label="Why Sharp Tier specifically (vs. Insider)"
        required
        id="quarterly_question"
        value={form.quarterly_question}
        onChange={(v) => update("quarterly_question", v)}
        placeholder="What's the one thing you'd want from the white-labeled API or quarterly call that makes Sharp worth €497/mo over Insider's €97/mo?"
        rows={3}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-purple-500/30 transition-colors"
      >
        {submitting ? "Submitting…" : "Submit application"}
        {!submitting && <span aria-hidden="true">→</span>}
      </button>

      {status === "error" && (
        <p className="text-rose-300 text-sm" role="alert">
          Couldn&rsquo;t submit: {errMsg}. Reply directly to{" "}
          <a
            href="mailto:signal@gitdealflow.com?subject=Sharp%20Tier%20Application"
            className="underline decoration-dotted"
          >
            signal@gitdealflow.com
          </a>{" "}
          if this persists.
        </p>
      )}

      <p className="text-gray-500 text-xs leading-relaxed">
        By submitting you agree the founder may reply to your email with a
        Stripe invoice or a decline. Your data is not added to any list,
        sold, or shared — it lives only in the application email until the
        decision is made.
      </p>
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-gray-300 text-sm font-medium">
        {label}
        {required && <span className="text-purple-300 ml-1">*</span>}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg bg-slate-950/60 border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-gray-100 placeholder-gray-600 text-sm outline-none transition-colors"
      />
    </label>
  );
}

function FieldArea({
  label,
  id,
  value,
  onChange,
  required,
  placeholder,
  rows = 3,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-gray-300 text-sm font-medium">
        {label}
        {required && <span className="text-purple-300 ml-1">*</span>}
      </span>
      <textarea
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 rounded-lg bg-slate-950/60 border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-gray-100 placeholder-gray-600 text-sm outline-none transition-colors resize-y"
      />
    </label>
  );
}
