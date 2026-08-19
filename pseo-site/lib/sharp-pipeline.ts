export const PIPELINE_STATUSES = [
  "applied",
  "qualified",
  "call_booked",
  "call_held",
  "checkout_sent",
  "won",
  "lost",
] as const;

export const DECISIONS = ["fit", "unclear", "not_a_fit"] as const;
export const BUYER_TYPES = ["fund", "syndicate", "family_office", "corporate", "other"] as const;
export const REQUESTED_TIERS = ["sharp_tier", "enterprise", "sector_sweep", "unsure"] as const;
export const BUDGET_RANGES = ["sharp_tier", "enterprise", "exploring"] as const;

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];
export type Decision = (typeof DECISIONS)[number];
export type BuyerType = (typeof BUYER_TYPES)[number];
export type RequestedTier = (typeof REQUESTED_TIERS)[number];
export type BudgetRange = (typeof BUDGET_RANGES)[number];

export interface SharpApplicationInput {
  fund_name: string;
  contact_name?: string;
  email: string;
  aum_or_deal_count: string;
  thesis: string;
  sectors: string;
  team_size: string;
  intended_use: string;
  budget_range: BudgetRange;
  buyer_type: BuyerType;
  requested_tier: RequestedTier;
  urgency?: string;
  source?: string;
}

export interface SharpPipelineRecord {
  submitted_at: string;
  replied_at: null;
  decision: "unclear";
  owner: string;
  fund_name: string;
  contact_name: string;
  email: string;
  aum_or_deal_count: string;
  thesis: string;
  sectors: string;
  team_size: string;
  intended_use: string;
  budget_range: BudgetRange;
  requested_tier: RequestedTier;
  source: string;
  buyer_type: BuyerType;
  intent_note: string;
  urgency: string;
  reply_body: string;
  booked_call_at: null;
  checkout_sent_at: null;
  status: "applied";
  created_by: "form_submission";
  loss_reason: string;
  expected_value: number | null;
  next_step: string;
  next_step_date: string;
  call_notes: string;
  won_at: null;
  lost_at: null;
}

export interface SharpReplyDeadline {
  iso: string;
  display: string;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function assertOneOf<T extends readonly string[]>(
  name: string,
  value: string,
  allowed: T,
): asserts value is T[number] {
  if (!allowed.includes(value)) {
    throw new Error(`${name} must be one of: ${allowed.join(", ")}`);
  }
}

export function computeSharpReplyDeadline(submittedAt: Date = new Date()): SharpReplyDeadline {
  const deadline = new Date(submittedAt.getTime() + 48 * 60 * 60 * 1000);
  const display = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Europe/Athens",
    timeZoneName: "short",
  }).format(deadline);

  return { iso: deadline.toISOString(), display: `by ${display}` };
}

export function normalizeSharpApplication(
  input: SharpApplicationInput,
  submittedAt: Date = new Date(),
): SharpPipelineRecord {
  const fund_name = clean(input.fund_name, 200);
  const contact_name = clean(input.contact_name, 120);
  const email = clean(input.email, 200).toLowerCase();
  const aum_or_deal_count = clean(input.aum_or_deal_count, 200);
  const thesis = clean(input.thesis, 1000);
  const sectors = clean(input.sectors, 500);
  const team_size = clean(input.team_size, 100);
  const intended_use = clean(input.intended_use, 1000);
  const urgency = clean(input.urgency, 500);
  const source = clean(input.source, 100) || "sharp-apply";
  const budget_range = clean(input.budget_range, 40);
  const buyer_type = clean(input.buyer_type, 40);
  const requested_tier = clean(input.requested_tier, 40);

  if (!fund_name || !email || !aum_or_deal_count || !thesis || !sectors || !team_size || !intended_use) {
    throw new Error("fund_name, email, AUM or deal count, thesis, sectors, team size, and intended use are required");
  }
  assertOneOf("budget_range", budget_range, BUDGET_RANGES);
  assertOneOf("buyer_type", buyer_type, BUYER_TYPES);
  assertOneOf("requested_tier", requested_tier, REQUESTED_TIERS);

  const deadline = computeSharpReplyDeadline(submittedAt);
  const intent_note = `${intended_use}${urgency ? ` Urgency: ${urgency}` : ""}`;

  return {
    submitted_at: submittedAt.toISOString(),
    replied_at: null,
    decision: "unclear",
    owner: "Maryan K.",
    fund_name,
    contact_name,
    email,
    aum_or_deal_count,
    thesis,
    sectors,
    team_size,
    intended_use,
    budget_range,
    requested_tier,
    source,
    buyer_type,
    intent_note,
    urgency,
    reply_body: "",
    booked_call_at: null,
    checkout_sent_at: null,
    status: "applied",
    created_by: "form_submission",
    loss_reason: "",
    expected_value: null,
    next_step: "Review application and send a written decision.",
    next_step_date: deadline.iso,
    call_notes: "",
    won_at: null,
    lost_at: null,
  };
}
