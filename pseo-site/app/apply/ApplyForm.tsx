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
  // Brunson high-ticket diligence (DotCom Secrets Ch 22 — async equivalent
  // of the phone-close five-question script). Replaces the live-call closer
  // with a written diligence questionnaire to preserve founder anonymity.
  dream_state: string;
  current_state: string;
  gap: string;
  money_value: string;
  urgency: string;
}

const INITIAL: FormState = {
  fund_name: "",
  contact_name: "",
  email: "",
  aum: "",
  thesis: "",
  how_heard: "",
  quarterly_question: "",
  dream_state: "",
  current_state: "",
  gap: "",
  money_value: "",
  urgency: "",
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
    // Brunson DotCom Secrets Ch 12 — application thank-you. Manage the
    // wait window: tell the buyer exactly what's happening between now
    // and the reply, give them a single sub-step CTA so the moment of
    // momentum doesn't dissipate, and pre-empt the "did it get there?"
    // anxiety with the inline bump-it instruction.
    const stops: Array<{ when: string; who: string; what: string }> = [
      {
        when: "Now",
        who: "Pipeline",
        what: "Your application was logged and forwarded to the founder's review queue. You'll see a confirmation email in the next 5 minutes from signals@gitdealflow.com — that one is automated, the human reply is not.",
      },
      {
        when: "Within 12 hours",
        who: "Founder",
        what: "I read every Sharp application personally. The first read happens today (or first thing tomorrow if you submitted after 22:00 UTC). I check fund fit against the 8-fund 2026 cap, and your specific quarterly question against what the methodology can actually deliver.",
      },
      {
        when: "Within 24–36 hours",
        who: "Founder",
        what: "If accepted, I draft a Stripe Sharp Tier invoice and an Insider Circle invitation. If declined, I write a one-paragraph reason — never a form letter. Either reply lands inside 48 business hours of submission.",
      },
      {
        when: "After acceptance",
        who: "Founder pipeline",
        what: "The first quarterly call gets scheduled (anonymity-preserving — initials only on the founder side). The white-labeled API sub-domain is set up the same week. Methodology source code repo gets shared on day one of paid.",
      },
    ];

    return (
      <div className="bg-emerald-950/30 border border-emerald-700/40 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="space-y-2">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Received · Reply window opens now
          </p>
          <p className="text-gray-100 text-base sm:text-lg leading-snug">
            Application logged. The founder reply lands at{" "}
            <strong className="text-emerald-200">{form.email}</strong> within
            48 business hours.
          </p>
        </div>

        <ol className="space-y-3.5 border-l-2 border-emerald-700/40 pl-4">
          {stops.map((s) => (
            <li key={s.when} className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="font-mono text-[11px] sm:text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  {s.when}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                  {s.who}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{s.what}</p>
            </li>
          ))}
        </ol>

        <div className="rounded-lg bg-slate-950/40 border border-slate-800 p-4 space-y-2">
          <p className="text-gray-300 text-sm font-semibold">
            While the review runs — one useful 12 minutes
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            If you haven&rsquo;t already, the{" "}
            <a
              href="/walkthrough"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              12-minute walkthrough
            </a>{" "}
            is the document I assume every Sharp applicant has read before
            the first quarterly call. It saves us the first ten minutes of
            the call and makes the rest of it sharper.
          </p>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-emerald-900/40 pt-3">
          If you don&rsquo;t see a reply by the end of the second business
          day, check spam, then reply to your most recent message from{" "}
          <code className="text-emerald-200 bg-emerald-900/40 px-1.5 py-0.5 rounded text-xs">
            signals@gitdealflow.com
          </code>{" "}
          with the word <em>bump</em> to surface it. No application has gone
          un-replied; if yours is the first, it&rsquo;s a delivery issue, not
          a decline.
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

      <div className="rounded-xl border border-purple-700/40 bg-purple-950/20 p-5 space-y-5">
        <div>
          <p className="text-purple-300 text-[11px] font-semibold uppercase tracking-wider">
            Diligence — 5 questions, 90 seconds each
          </p>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
            These replace what would normally be a 30-minute phone close. Async
            and anonymity-preserving. The founder reads every answer before
            replying — short and specific beats long and polished.
          </p>
        </div>

        <FieldArea
          label="1 · Dream state — where do you want your sourcing to be 12 months from now?"
          required
          id="dream_state"
          value={form.dream_state}
          onChange={(v) => update("dream_state", v)}
          placeholder="e.g. 'Seeing 3 of every 5 of our Series A deals before any other fund is talking to them' / '50% of new portfolio adds sourced from data, not warm intros'"
          rows={2}
        />
        <FieldArea
          label="2 · Current state — where are you actually today on that axis?"
          required
          id="current_state"
          value={form.current_state}
          onChange={(v) => update("current_state", v)}
          placeholder="e.g. '~80% of deals are warm intro, ~10% inbound, ~10% other' / 'We have an analyst running Crunchbase queries but no GitHub layer'"
          rows={2}
        />
        <FieldArea
          label="3 · Gap — what's between the two? What's blocking dream state?"
          required
          id="gap"
          value={form.gap}
          onChange={(v) => update("gap", v)}
          placeholder="e.g. 'Nobody on the team reads commit graphs / no time to build the regression / no API to plug into our CRM'"
          rows={2}
        />
        <FieldArea
          label="4 · Money — what's that gap worth to your fund this year?"
          required
          id="money_value"
          value={form.money_value}
          onChange={(v) => update("money_value", v)}
          placeholder="e.g. 'One missed Series A is ~€800k of foregone fees + ~€4M of unrealized markups over 4 years' / 'We size around 12 deals/year — a 1-deal sourcing improvement is ~5% of the fund's vintage outcome'"
          rows={2}
        />
        <FieldArea
          label="5 · Urgency — why now, vs. waiting six months?"
          required
          id="urgency"
          value={form.urgency}
          onChange={(v) => update("urgency", v)}
          placeholder="e.g. 'Cohort closes 8 funds for 2026 / our Q3 allocation cycle is locked by July / we're losing 1 deal a quarter to faster competitors'"
          rows={2}
        />
      </div>

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
            href="mailto:signals@gitdealflow.com?subject=Sharp%20Tier%20Application"
            className="underline decoration-dotted"
          >
            signals@gitdealflow.com
          </a>{" "}
          if this persists.
        </p>
      )}

      <p className="text-gray-400 text-xs leading-relaxed">
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
