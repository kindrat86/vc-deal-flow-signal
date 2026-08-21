export type RedditPageview = {
  event: "reddit_organic_pageview";
  distinct_id: string;
  properties: {
    $host: "signals.gitdealflow.com";
    $pathname: string;
    $current_url: string;
    $referring_domain: "reddit";
    $ip: string;
    utm_source: "reddit";
    utm_medium: "organic";
    utm_campaign: string;
    utm_content: string;
    source: "first-party-reddit-attribution";
  };
};

const CAMPAIGN = /^[a-z0-9_]+-\d{4}-\d{2}-\d{2}$/;
const CONTENT = /^(?:t3_[a-z0-9]+|prepost-[a-z0-9-]+)$/;

export function buildRedditPageview(url: URL, ip: string): RedditPageview | null {
  const source = url.searchParams.get("utm_source");
  const medium = url.searchParams.get("utm_medium");
  const campaign = url.searchParams.get("utm_campaign") || "";
  const content = url.searchParams.get("utm_content") || "";
  const clientIp = (ip || "").split(",")[0].trim();
  if (
    url.hostname !== "signals.gitdealflow.com" ||
    source !== "reddit" ||
    medium !== "organic" ||
    !CAMPAIGN.test(campaign) ||
    !CONTENT.test(content) ||
    !clientIp
  ) {
    return null;
  }
  return {
    event: "reddit_organic_pageview",
    distinct_id: `reddit:${clientIp}`,
    properties: {
      $host: "signals.gitdealflow.com",
      $pathname: url.pathname,
      $current_url: url.toString(),
      $referring_domain: "reddit",
      $ip: clientIp,
      utm_source: "reddit",
      utm_medium: "organic",
      utm_campaign: campaign,
      utm_content: content,
      source: "first-party-reddit-attribution",
    },
  };
}

export async function captureRedditPageview(
  event: RedditPageview | null,
  captureUrl: string,
  apiKey: string,
): Promise<boolean> {
  if (!event || !captureUrl || !apiKey) return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    const response = await fetch(captureUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, ...event }),
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
