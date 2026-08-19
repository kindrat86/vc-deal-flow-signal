"use client";
import { useState } from "react";

const initial = { fund_name:"", contact_name:"", email:"", aum_or_deal_count:"", thesis:"", sectors:"", team_size:"", intended_use:"", budget_range:"sharp_tier", buyer_type:"fund", requested_tier:"sharp_tier", urgency:"" };
type Form = typeof initial;

export default function ApplyForm() {
  const [form, setForm] = useState<Form>(initial);
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");
  const [deadline, setDeadline] = useState("");
  const set = (key: keyof Form, value: string) => setForm((prev) => ({...prev, [key]:value}));
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setStatus("sending");
    try { const r=await fetch("/api/sharp-application", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}); const data=await r.json(); if(!r.ok) throw new Error(data.error||"Could not submit"); setDeadline(data.deadline.display); setStatus("success"); } catch { setStatus("error"); }
  }
  if(status === "success") return <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 p-6 space-y-3"><p className="text-emerald-300 font-semibold">Inquiry received.</p><p className="text-gray-200">Check <strong>{form.email}</strong> now for your confirmation. Your written decision arrives <strong>{deadline}</strong>.</p><p className="text-gray-400 text-sm">We will either confirm fit and offer a 20-minute intro, ask one or two questions, or point you to a better starting tier.</p></div>;
  const field=(label:keyof Form, text:string, required=true, type="text") => <label className="block space-y-1"><span className="text-gray-300 text-sm">{text}{required&&<b className="text-purple-300"> *</b>}</span><input required={required} type={type} value={form[label]} onChange={e=>set(label,e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-gray-100" /></label>;
  return <form onSubmit={submit} className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">{field("fund_name","Fund or syndicate name")}{field("email","Email",true,"email")}</div>
    <div className="grid gap-4 sm:grid-cols-2">{field("aum_or_deal_count","AUM, annual deal count, or current raise")}{field("team_size","Team size")}</div>
    {field("thesis","One-sentence thesis")}{field("sectors","Sectors or verticals")}{field("intended_use","How will you use GitDealFlow?")}
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-gray-300 text-sm">Buyer type<select value={form.buyer_type} onChange={e=>set("buyer_type",e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5"><option value="fund">Fund</option><option value="syndicate">Syndicate</option><option value="family_office">Family office</option><option value="corporate">Corporate</option><option value="other">Other</option></select></label><label className="text-gray-300 text-sm">Budget range<select value={form.budget_range} onChange={e=>set("budget_range",e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5"><option value="sharp_tier">Sharp Tier</option><option value="enterprise">Enterprise</option><option value="exploring">Just exploring</option></select></label></div>
    {field("contact_name","Your name",false)}{field("urgency","Deadline or event driving urgency",false)}
    <button disabled={status==="sending"} className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white">{status==="sending"?"Sending…":"Submit inquiry"}</button>{status==="error"&&<p className="text-rose-300">Could not submit. Email signals@gitdealflow.com.</p>}<p className="text-gray-400 text-xs">We review each Sharp Tier inquiry personally and send a written response within 48 hours. You will receive an instant confirmation when you submit.</p>
  </form>;
}
