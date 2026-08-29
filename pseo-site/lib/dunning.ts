type Metadata = Record<string, string | null | undefined>;

type ProductRef = string | { id?: string; name?: string | null } | null | undefined;

type SubscriptionLike = {
  metadata?: Metadata | null;
  items?: {
    data?: Array<{
      price?: { product?: ProductRef } | null;
    }>;
  } | null;
};

type InvoiceLike = {
  subscription?: unknown;
  parent?: {
    subscription_details?: { subscription?: unknown } | null;
  } | null;
  lines?: {
    data?: Array<{
      subscription?: unknown;
      parent?: {
        subscription_item_details?: { subscription?: unknown } | null;
      } | null;
    }>;
  } | null;
};

const GDF_RECURRING_TIERS = new Set(["dashboard", "dashboard_49", "insider", "insider_197"]);
const GDF_CHECKOUT_FLOWS = new Set(["entry_checkout", "entry_checkout_get", "oto_one_click"]);
const GDF_PRODUCT_NAME = /^(GitDealFlow|VC Deal Flow Signal)\b/i;

function objectId(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "string" ? id : null;
  }
  return null;
}

export function subscriptionIdFromInvoice(invoice: InvoiceLike): string | null {
  const direct = objectId(invoice.subscription);
  if (direct) return direct;

  const parent = objectId(invoice.parent?.subscription_details?.subscription);
  if (parent) return parent;

  for (const line of invoice.lines?.data ?? []) {
    const lineDirect = objectId(line.subscription);
    if (lineDirect) return lineDirect;
    const lineParent = objectId(line.parent?.subscription_item_details?.subscription);
    if (lineParent) return lineParent;
  }

  return null;
}

export function isGitDealFlowSubscription(subscription: SubscriptionLike): boolean {
  const metadata = subscription.metadata ?? {};
  const metadataMatches =
    GDF_RECURRING_TIERS.has(metadata.tier ?? "") &&
    GDF_CHECKOUT_FLOWS.has(metadata.flow ?? "");
  if (metadataMatches) return true;

  return (subscription.items?.data ?? []).some((item) => {
    const product = item.price?.product;
    return typeof product === "object" && product !== null && GDF_PRODUCT_NAME.test(product.name ?? "");
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char] ?? char);
}

export function buildFailedPaymentEmail(input: { portalLoginUrl: string }): {
  subject: string;
  html: string;
} {
  const portalUrl = escapeHtml(input.portalLoginUrl);
  return {
    subject: "Action needed: update your GitDealFlow payment method",
    html: `<p>Hi,</p>
<p>Stripe could not collect your GitDealFlow subscription payment.</p>
<p>Your access remains active while Stripe retries the payment.</p>
<p><a href="${portalUrl}">Update your payment method</a></p>
<p>Stripe will email you a secure sign-in link. If you already updated your payment method, no action is needed.</p>
<p>Questions? Reply to this email.</p>
<p>The Data Nerd</p>`,
  };
}
