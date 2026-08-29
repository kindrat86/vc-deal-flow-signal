export type FeedbackVoice = {
  kind: "feedback";
  tryingToDo: string;
  blocker: string;
  frequency: "once" | "monthly" | "weekly" | "every_deal";
  email: string;
  contactOk: boolean;
  source: string;
};

export type SupportVoice = {
  kind: "support";
  email: string;
  topic: "billing" | "login" | "data_quality" | "newsletter" | "other";
  message: string;
  source: string;
};

export type PulseVoice = {
  kind: "pulse";
  score: number;
  usefulLead: "yes" | "not_yet" | "no";
  reason: string;
  raiseOnePoint: string;
  email: string;
  contactOk: boolean;
  source: string;
};

export type CustomerVoice = FeedbackVoice | SupportVoice | PulseVoice;
export type CustomerVoiceResult =
  | { ok: true; value: CustomerVoice }
  | { ok: true; spam: true }
  | { ok: false; error: string };

const EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
const EMAIL_IN_TEXT = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const FREQUENCIES = new Set(["once", "monthly", "weekly", "every_deal"]);
const TOPICS = new Set(["billing", "login", "data_quality", "newsletter", "other"]);
const LEAD_ANSWERS = new Set(["yes", "not_yet", "no"]);

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function email(value: unknown): string {
  const candidate = text(value, 254).toLowerCase();
  return !candidate || EMAIL.test(candidate) ? candidate : "__invalid__";
}

function source(value: unknown): string {
  return text(value, 80).replace(/[^a-zA-Z0-9_.-]/g, "_") || "direct";
}

export function parseCustomerVoice(kind: unknown, raw: unknown): CustomerVoiceResult {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Invalid request." };
  const body = raw as Record<string, unknown>;
  if (text(body.website, 200)) return { ok: true, spam: true };

  if (kind === "feedback") {
    const tryingToDo = text(body.tryingToDo, 1_500);
    const blocker = text(body.blocker, 1_500);
    const frequency = text(body.frequency, 30);
    const replyEmail = email(body.email);
    if (!tryingToDo || !blocker || !FREQUENCIES.has(frequency) || replyEmail === "__invalid__") {
      return { ok: false, error: "Answer the three feedback questions and use a valid email if you add one." };
    }
    return { ok: true, value: {
      kind: "feedback",
      tryingToDo,
      blocker,
      frequency: frequency as FeedbackVoice["frequency"],
      email: replyEmail,
      contactOk: body.contactOk === true,
      source: source(body.source),
    } };
  }

  if (kind === "support") {
    const replyEmail = email(body.email);
    const topic = text(body.topic, 40);
    const message = text(body.message, 4_000);
    if (!replyEmail || replyEmail === "__invalid__" || !TOPICS.has(topic) || !message) {
      return { ok: false, error: "Add a valid reply email, topic, and message." };
    }
    return { ok: true, value: {
      kind: "support",
      email: replyEmail,
      topic: topic as SupportVoice["topic"],
      message,
      source: source(body.source),
    } };
  }

  if (kind === "pulse") {
    const score = typeof body.score === "number" ? body.score : Number(body.score);
    const usefulLead = text(body.usefulLead, 20);
    const reason = text(body.reason, 1_500);
    const raiseOnePoint = text(body.raiseOnePoint, 1_500);
    const replyEmail = email(body.email);
    if (!Number.isInteger(score) || score < 0 || score > 10 || !LEAD_ANSWERS.has(usefulLead) || !reason || !raiseOnePoint || replyEmail === "__invalid__") {
      return { ok: false, error: "Add a 0-10 score and answer the three pulse questions." };
    }
    return { ok: true, value: {
      kind: "pulse",
      score,
      usefulLead: usefulLead as PulseVoice["usefulLead"],
      reason,
      raiseOnePoint,
      email: replyEmail,
      contactOk: body.contactOk === true,
      source: source(body.source),
    } };
  }

  return { ok: false, error: "Unknown customer-voice type." };
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char);
}

export function voiceSubject(record: CustomerVoice): string {
  if (record.kind === "feedback") return `VOC feedback: ${record.frequency} [${record.source}]`;
  if (record.kind === "support") return `VOC support: ${record.topic}`;
  return `VOC pulse: ${record.score}/10 [${record.source}]`;
}

export function posthogProperties(record: CustomerVoice): Record<string, string | number | boolean> {
  const common = { product: "gitdealflow", voice_kind: record.kind, source: record.source };
  const redact = (value: string) => value.replace(EMAIL_IN_TEXT, "[email]");
  if (record.kind === "feedback") return { ...common, trying_to_do: redact(record.tryingToDo), blocker: redact(record.blocker), frequency: record.frequency, contact_ok: record.contactOk };
  if (record.kind === "support") return { ...common, topic: record.topic, message: redact(record.message), contact_ok: true };
  return { ...common, score: record.score, useful_lead: record.usefulLead, reason: redact(record.reason), raise_one_point: redact(record.raiseOnePoint), contact_ok: record.contactOk };
}

export function voiceEmailHtml(record: CustomerVoice): string {
  const props = posthogProperties(record);
  const rows = Object.entries({ ...props, email: record.email || "not provided" }).map(([key, value]) => `<tr><th align="left" style="padding:6px 10px 6px 0;vertical-align:top">${escapeHtml(key)}</th><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("");
  return `<h2>GitDealFlow customer voice</h2><table>${rows}</table><p><strong>Decision rule:</strong> build it, test it, explain it better, or decline it, with a written reason.</p>`;
}
