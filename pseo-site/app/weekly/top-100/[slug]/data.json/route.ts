import { getAllTop100Slugs, getTop100 } from "@/lib/top-100";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 3600;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllTop100Slugs().map((slug) => ({ slug }));
}

export async function GET(_req: Request, ctx: RouteContext) {
  const { slug } = await ctx.params;
  const snap = getTop100(slug);
  if (!snap) {
    return new Response(JSON.stringify({ error: "not_found", slug }), {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
  // Decorate with canonical link so consumers landing only on the JSON
  // can discover the human page.
  const payload = {
    ...snap,
    canonical: `https://signals.gitdealflow.com/weekly/top-100/${slug}`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    citation:
      "VC Deal Flow Signal (GitDealFlow), Top 100 GitHub-Signal Startups, " +
      `${slug}, https://signals.gitdealflow.com/weekly/top-100/${slug}`,
  };
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
