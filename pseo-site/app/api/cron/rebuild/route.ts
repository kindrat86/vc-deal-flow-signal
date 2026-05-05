import { NextResponse } from "next/server";
import { getAllPageSlugs, getAllGeoPageSlugs, getAllStartupSlugs } from "@/lib/data";
import { getAllPostSlugs } from "@/content/posts";
import { getAllComparisonSlugs } from "@/content/comparisons";
import { getAllPredictionWeekSlugs } from "@/lib/predictions";
import { getAllFindingSlugs } from "@/content/research-findings";
import { getAllAlternativeSlugs } from "@/content/alternatives";
import { getAllUseCaseSlugs } from "@/content/use-cases";
import { getAllCompetitorVsSlugs } from "@/content/competitor-vs";
import { agentQueries } from "@/content/agent-queries";
import { getAllPrimitiveSlugs } from "@/content/signal-primitives";
import { getAllAuthors } from "@/content/authors";
import { getAllFrameworkSlugs } from "@/lib/a2a-frameworks";

const BASE_URL = "https://signals.gitdealflow.com";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

async function pingIndexNow() {
  if (!INDEXNOW_KEY) return { skipped: true, reason: "INDEXNOW_KEY not set" };

  const urls = [
    BASE_URL,
    `${BASE_URL}/trending`,
    `${BASE_URL}/methodology`,
    `${BASE_URL}/glossary`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/compare`,
    `${BASE_URL}/predicted`,
    `${BASE_URL}/challenge`,
    `${BASE_URL}/research`,
    `${BASE_URL}/alternatives`,
    `${BASE_URL}/answers`,
    `${BASE_URL}/use-cases`,
    `${BASE_URL}/vs`,
    `${BASE_URL}/pricing`,
    `${BASE_URL}/faq`,
    `${BASE_URL}/enterprise`,
    `${BASE_URL}/leaderboard`,
    `${BASE_URL}/changelog`,
    ...getAllPredictionWeekSlugs().map((s) => `${BASE_URL}/predicted/${s}`),
    ...getAllPageSlugs().map((s) => `${BASE_URL}/startups-to-watch/${s}`),
    ...getAllGeoPageSlugs().map((s) => `${BASE_URL}/startups-to-watch/geo/${s}`),
    ...getAllStartupSlugs().map((s) => `${BASE_URL}/startup/${s}`),
    ...getAllPostSlugs().map((s) => `${BASE_URL}/blog/${s}`),
    ...getAllComparisonSlugs().map((s) => `${BASE_URL}/compare/${s}`),
    ...getAllFindingSlugs().map((s) => `${BASE_URL}/research/${s}`),
    ...getAllAlternativeSlugs().map((s) => `${BASE_URL}/alternatives/${s}`),
    ...getAllUseCaseSlugs().map((s) => `${BASE_URL}/use-cases/${s}`),
    ...getAllCompetitorVsSlugs().map((s) => `${BASE_URL}/vs/${s}`),
    ...agentQueries.map((q) => `${BASE_URL}/answers/${q.slug}`),
    ...getAllPrimitiveSlugs().map((s) => `${BASE_URL}/signals/define/${s}`),
    ...getAllAuthors().map((a) => `${BASE_URL}/authors/${a.slug}`),
    ...getAllFrameworkSlugs().map((s) => `${BASE_URL}/a2a/${s}`),
    ...["hiring-burst", "infrastructure-buildout", "deploy-frequency-spike", "framework-migration"].map(
      (s) => `${BASE_URL}/signals/${s}`
    ),
  ];

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "signals.gitdealflow.com",
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });

  return { status: res.status, urlCount: urls.length };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK;
  if (!hookUrl) {
    return NextResponse.json(
      { error: "VERCEL_DEPLOY_HOOK not configured" },
      { status: 500 }
    );
  }

  const res = await fetch(hookUrl, { method: "POST" });
  const data = await res.json();

  const indexNowResult = await pingIndexNow();

  return NextResponse.json({
    ok: true,
    message: "Rebuild triggered",
    vercel: data,
    indexNow: indexNowResult,
  });
}
