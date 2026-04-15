import type { MetadataRoute } from "next";
import { getAllPageSlugs, getAllGeoPageSlugs, getAllStartupSlugs, getDataLastModified, SIGNAL_TYPES, getAllBestSectorSlugs, getAllTrendSlugs } from "@/lib/data";
import { getAllPostSlugs } from "@/content/posts";
import { getAllComparisonSlugs } from "@/content/comparisons";

const BASE_URL = "https://signals.gitdealflow.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getDataLastModified();

  const sectorPages = getAllPageSlugs().map((slug) => ({
    url: `${BASE_URL}/startups-to-watch/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = getAllPostSlugs().map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/trending`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/methodology`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/glossary`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/weekly`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    ...sectorPages,
    ...blogPages,
    ...getAllComparisonSlugs().map((slug) => ({
      url: `${BASE_URL}/compare/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getAllGeoPageSlugs().map((slug) => ({
      url: `${BASE_URL}/startups-to-watch/geo/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...getAllStartupSlugs().map((slug) => ({
      url: `${BASE_URL}/startup/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...SIGNAL_TYPES.map((s) => ({
      url: `${BASE_URL}/signals/${s.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getAllBestSectorSlugs().map((slug) => ({
      url: `${BASE_URL}/best/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getAllTrendSlugs().map((slug) => ({
      url: `${BASE_URL}/trends/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
