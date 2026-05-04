import { NextResponse } from "next/server";
import { getAllPageSlugs, getAllGeoPageSlugs, getAllStartupSlugs } from "@/lib/data";
import { getAllPostSlugs } from "@/content/posts";
import { getAllComparisonSlugs } from "@/content/comparisons";
import { getAllPredictionWeekSlugs } from "@/lib/predictions";

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
    ...getAllPredictionWeekSlugs().map((s) => `${BASE_URL}/predicted/${s}`),
    ...getAllPageSlugs().map((s) => `${BASE_URL}/startups-to-watch/${s}`),
    ...getAllGeoPageSlugs().map((s) => `${BASE_URL}/startups-to-watch/geo/${s}`),
    ...getAllStartupSlugs().map((s) => `${BASE_URL}/startup/${s}`),
    ...getAllPostSlugs().map((s) => `${BASE_URL}/blog/${s}`),
    ...getAllComparisonSlugs().map((s) => `${BASE_URL}/compare/${s}`),
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
