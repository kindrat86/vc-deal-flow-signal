"use client";

import { useState } from "react";

const SECTORS = [
  "AI/ML",
  "AI infrastructure",
  "Climate tech",
  "Cybersecurity",
  "Data infrastructure",
  "Developer tools",
  "Fintech",
  "Healthtech",
  "Robotics",
  "SaaS infrastructure",
  "Vertical AI",
] as const;

const INVESTOR_TYPES = ["solo_gp", "scout", "seed_fund", "angel", "other"] as const;

type Props = {
  checkoutSessionId: string;
  paidEmail: string;
};

type FormState = {
  name: string;
  email: string;
  investor_type: (typeof INVESTOR_TYPES)[number] | "";
  sectors: string[];
  preferred_delivery_email: string;
  note: string;
};

export default function SignalDeskIntakeForm({ checkoutSessionId, paidEmail }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: paidEmail,
    investor_type: "",
    sectors: [],
    preferred_delivery_email: paidEmail,
    note: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function toggleSector(sector: string) {
    setForm((current) => ({
      ...current,
      sectors: current.sectors.includes(sector)
        ? current.sectors.filter((value) => value !== sector)
        : [...current.sectors, sector],
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/signal-desk/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkout_session_id: checkoutSessionId, ...form }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || "We could not save your intake.");

      const posthog = (window as Window & {
        posthog?: { capture?: (event: string, properties?: Record<string, unknown>) => void };
      }).posthog;
      posthog?.capture?.("signal_desk_intake_submitted", {
        offer: "signal_desk_pilot",
        price_eur: 250,
        credit_toward_dashboard_eur: 490,
        seat_limit: 5,
        investor_type: form.investor_type,
        sector_count: form.sectors.length,
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "We could not save your intake.");
    }
  }

  if (status === "sent") {
    return (
      <section className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Intake received</p>
        <h2 className="text-xl font-bold text-gray-100">Your Monday brief is in the manual queue.</h2>
        <p className="text-sm leading-relaxed text-gray-300">
          We will use the sectors and delivery email you gave us. The first issue is prepared manually and sent on the next Monday after review.
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-label="Signal Desk pilot intake">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm text-gray-200">
          <span className="font-semibold">Name</span>
          <input required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-gray-100" />
        </label>
        <label className="space-y-1.5 text-sm text-gray-200">
          <span className="font-semibold">Email used for the pilot</span>
          <input required type="email" maxLength={200} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-gray-100" />
        </label>
      </div>
      <label className="block space-y-1.5 text-sm text-gray-200">
        <span className="font-semibold">Fund or investor type</span>
        <select required value={form.investor_type} onChange={(event) => setForm({ ...form, investor_type: event.target.value as FormState["investor_type"] })} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-gray-100">
          <option value="">Choose one</option>
          <option value="solo_gp">Solo GP</option>
          <option value="scout">Scout</option>
          <option value="seed_fund">Seed fund or emerging manager</option>
          <option value="angel">Angel</option>
          <option value="other">Other investor</option>
        </select>
      </label>
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-gray-200">Sectors to match, choose at least one</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {SECTORS.map((sector) => (
            <label key={sector} className="flex items-center gap-2 rounded border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-gray-300">
              <input type="checkbox" checked={form.sectors.includes(sector)} onChange={() => toggleSector(sector)} />
              {sector}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block space-y-1.5 text-sm text-gray-200">
        <span className="font-semibold">Preferred Monday delivery email</span>
        <input required type="email" maxLength={200} value={form.preferred_delivery_email} onChange={(event) => setForm({ ...form, preferred_delivery_email: event.target.value })} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-gray-100" />
      </label>
      <label className="block space-y-1.5 text-sm text-gray-200">
        <span className="font-semibold">Optional note about your sourcing workflow</span>
        <textarea maxLength={1000} rows={4} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} className="w-full resize-y rounded border border-slate-700 bg-slate-950 px-3 py-2 text-gray-100" />
      </label>
      {status === "error" ? <p className="text-sm text-rose-300">{error}</p> : null}
      <button disabled={status === "sending" || form.sectors.length === 0} type="submit" className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
        {status === "sending" ? "Saving intake…" : "Save my Monday intake"}
      </button>
      <p className="text-xs leading-relaxed text-slate-500">We do not ask for payment-card details. Stripe handled payment. Your free-form note is used only for manual fulfillment and is not sent to analytics.</p>
    </form>
  );
}
