import {
  getCurrentPeriod,
  getStartupProfile,
  getStartupPeriodData,
  getStagePageData,
  getSignalTypeData,
  getStageSectorData,
  getSignalSectorData,
  getStageSignalData,
  parsePageSlug,
  SIGNAL_TYPES,
} from "@/lib/data";

const BASE_URL = "https://signals.gitdealflow.com";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(_req: Request, ctx: RouteContext) {
  const { path } = await ctx.params;
  const segments = path ?? [];

  let graph: unknown = null;

  if (
    segments[0] === "stage" &&
    segments[1] &&
    segments[2] === "signal" &&
    segments[3]
  ) {
    graph = buildStageSignal(segments[1], segments[3]);
  } else if (segments[0] === "stage" && segments[1] && segments[2]) {
    graph = buildStageSector(segments[1], segments[2]);
  } else if (segments[0] === "stage" && segments[1]) {
    graph = buildStage(segments[1]);
  } else if (segments[0] === "signals" && segments[1] && segments[2]) {
    graph = buildSignalSector(segments[1], segments[2]);
  } else if (segments[0] === "signals" && segments[1]) {
    graph = buildSignal(segments[1]);
  } else if (segments[0] === "startup" && segments[1] && segments[2]) {
    graph = buildStartupPeriod(segments[1], segments[2]);
  } else if (segments[0] === "startup" && segments[1]) {
    graph = buildStartup(segments[1]);
  } else if (segments[0] === "startups-to-watch" && segments[1]) {
    graph = buildSector(segments[1]);
  }

  if (graph === null) {
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/ld+json; charset=utf-8" },
    });
  }

  return new Response(JSON.stringify(graph, null, 2), {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function org() {
  return {
    "@type": "Organization",
    name: "VC Deal Flow Signal",
    url: "https://gitdealflow.com",
  };
}

function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

function buildStage(slug: string) {
  const data = getStagePageData(slug);
  if (!data) return null;
  const { name, description, investorInsight, period, startups, sectorBreakdown } = data;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${name} Startups Showing Engineering Acceleration, ${period.name}`,
        description,
        author: org(),
        publisher: org(),
        url: `${BASE_URL}/stage/${slug}`,
        dateModified: new Date().toISOString().slice(0, 10),
      },
      breadcrumbs([
        { name: "All Sectors", url: BASE_URL },
        { name, url: `${BASE_URL}/stage/${slug}` },
      ]),
      {
        "@type": "ItemList",
        name: `${name} startups, ${period.name}`,
        numberOfItems: startups.length,
        itemListElement: startups.slice(0, 20).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          description: `${s.commitVelocity14d} commits/14d, ${s.commitVelocityChange} change, ${s.contributors} contributors, signal: ${s.signalType}`,
        })),
      },
      {
        "@type": "DefinedTerm",
        name: `${name} investor insight`,
        description: investorInsight,
      },
      {
        "@type": "Table",
        about: `${name} × Sector breakdown`,
        numberOfItems: sectorBreakdown.length,
      },
    ],
  };
}

function buildSignal(slug: string) {
  const data = getSignalTypeData(slug);
  if (!data) return null;
  const current = getCurrentPeriod();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${data.name} Signal, ${current.name}`,
        description: data.description,
        author: org(),
        publisher: org(),
        url: `${BASE_URL}/signals/${slug}`,
      },
      breadcrumbs([
        { name: "All Sectors", url: BASE_URL },
        { name: data.name, url: `${BASE_URL}/signals/${slug}` },
      ]),
      {
        "@type": "DefinedTerm",
        name: data.name,
        description: data.description,
      },
      {
        "@type": "ItemList",
        name: `Startups showing ${data.name}`,
        numberOfItems: data.totalAcrossSectors,
        itemListElement: data.startups.slice(0, 20).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          description: `${s.sectorName}, ${s.commitVelocity14d} commits/14d (${s.commitVelocityChange})`,
        })),
      },
    ],
  };
}

function buildStageSector(stageSlug: string, sectorSlug: string) {
  const data = getStageSectorData(stageSlug, sectorSlug);
  if (!data) return null;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${data.stageName} ${data.sector.name} Startups, Engineering Acceleration (${data.period.name})`,
        description: `${data.startups.length} ${data.sector.name.toLowerCase()} startups at ${data.stageName.toLowerCase()} stage ranked by engineering acceleration in ${data.period.name}.`,
        author: org(),
        publisher: org(),
        url: `${BASE_URL}/stage/${stageSlug}/${sectorSlug}`,
      },
      breadcrumbs([
        { name: "All Sectors", url: BASE_URL },
        { name: data.stageName, url: `${BASE_URL}/stage/${stageSlug}` },
        {
          name: data.sector.name,
          url: `${BASE_URL}/stage/${stageSlug}/${sectorSlug}`,
        },
      ]),
      {
        "@type": "ItemList",
        numberOfItems: data.startups.length,
        itemListElement: data.startups.slice(0, 20).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          description: `${s.commitVelocity14d} commits/14d, ${s.commitVelocityChange} change, ${s.contributors} contributors, signal: ${s.signalType}`,
        })),
      },
    ],
  };
}

function buildSignalSector(signalSlug: string, sectorSlug: string) {
  const data = getSignalSectorData(signalSlug, sectorSlug);
  if (!data) return null;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${data.sector.name} Startups Showing ${data.signalName}, ${data.period.name}`,
        description: data.signalDescription,
        author: org(),
        publisher: org(),
        url: `${BASE_URL}/signals/${signalSlug}/${sectorSlug}`,
      },
      breadcrumbs([
        { name: "All Sectors", url: BASE_URL },
        { name: data.signalName, url: `${BASE_URL}/signals/${signalSlug}` },
        {
          name: data.sector.name,
          url: `${BASE_URL}/signals/${signalSlug}/${sectorSlug}`,
        },
      ]),
      {
        "@type": "ItemList",
        numberOfItems: data.startups.length,
        itemListElement: data.startups.slice(0, 20).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          description: `${s.commitVelocity14d} commits/14d, ${s.commitVelocityChange} change, ${s.contributors} contributors`,
        })),
      },
    ],
  };
}

function buildStageSignal(stageSlug: string, signalSlug: string) {
  const data = getStageSignalData(stageSlug, signalSlug);
  if (!data) return null;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${data.stageName} Startups Showing ${data.signalName}, ${data.period.name}`,
        description: data.signalDescription,
        author: org(),
        publisher: org(),
        url: `${BASE_URL}/stage/${stageSlug}/signal/${signalSlug}`,
      },
      breadcrumbs([
        { name: "All Sectors", url: BASE_URL },
        { name: data.stageName, url: `${BASE_URL}/stage/${stageSlug}` },
        {
          name: data.signalName,
          url: `${BASE_URL}/stage/${stageSlug}/signal/${signalSlug}`,
        },
      ]),
      {
        "@type": "ItemList",
        numberOfItems: data.startups.length,
        itemListElement: data.startups.slice(0, 20).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          description: `${s.sectorName}, ${s.commitVelocity14d} commits/14d (${s.commitVelocityChange})`,
        })),
      },
    ],
  };
}

function buildStartup(slug: string) {
  const profile = getStartupProfile(slug);
  if (!profile) return null;
  const latest = profile.history[0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: profile.name,
        description: profile.description,
        url: profile.websiteUrl ?? profile.githubUrl,
        sameAs: [profile.githubUrl, profile.linkedinUrl].filter(Boolean),
      },
      {
        "@type": "Article",
        headline: `${profile.name} Engineering Signal`,
        description: profile.description,
        author: org(),
        publisher: org(),
        url: `${BASE_URL}/startup/${slug}`,
      },
      breadcrumbs([
        { name: "All Sectors", url: BASE_URL },
        { name: profile.name, url: `${BASE_URL}/startup/${slug}` },
      ]),
      {
        "@type": "Dataset",
        name: `${profile.name} engineering signal history`,
        description: `Longitudinal engineering acceleration metrics for ${profile.name} across ${profile.history.length} quarters.`,
        numberOfItems: profile.history.length,
        variableMeasured: [
          "commitVelocity14d",
          "commitVelocityChange",
          "contributors",
          "contributorGrowth",
          "newRepos",
          "signalType",
        ],
      },
      {
        "@type": "ItemList",
        name: `${profile.name} history`,
        numberOfItems: profile.history.length,
        itemListElement: profile.history.map((h, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: h.periodName,
          description: `${h.commitVelocity14d} commits/14d, ${h.commitVelocityChange} change, ${h.contributors} contributors, signal: ${h.signalType}`,
          url: `${BASE_URL}/startup/${slug}/${h.periodSlug}`,
        })),
      },
      {
        "@type": "DefinedTerm",
        name: `${profile.name} current signal`,
        description: `As of ${latest.periodName}: ${latest.signalType}, ${latest.commitVelocityChange} velocity change, ${latest.contributors} contributors.`,
      },
    ],
  };
}

function buildStartupPeriod(slug: string, periodSlug: string) {
  const data = getStartupPeriodData(slug, periodSlug);
  if (!data) return null;
  const { profile, entry } = data;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${profile.name}, ${entry.periodName} Engineering Signal`,
        description: `${profile.name} engineering metrics for ${entry.periodName}.`,
        author: org(),
        publisher: org(),
        url: `${BASE_URL}/startup/${slug}/${periodSlug}`,
      },
      breadcrumbs([
        { name: "All Sectors", url: BASE_URL },
        { name: profile.name, url: `${BASE_URL}/startup/${slug}` },
        {
          name: entry.periodName,
          url: `${BASE_URL}/startup/${slug}/${periodSlug}`,
        },
      ]),
      {
        "@type": "Observation",
        measuredProperty: "engineeringAcceleration",
        measuredValue: entry.commitVelocityChange,
        observationDate: entry.periodName,
        description: `${entry.signalType}, ${entry.commitVelocity14d} commits/14d, ${entry.contributors} contributors (${entry.contributorGrowth} growth).`,
      },
    ],
  };
}

function buildSector(slug: string) {
  const parsed = parsePageSlug(slug);
  if (!parsed) return null;
  const { sector, period, snapshot } = parsed;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${sector.name} Startups to Watch, ${period.name}`,
        description: sector.description,
        author: org(),
        publisher: org(),
        url: `${BASE_URL}/startups-to-watch/${slug}`,
      },
      breadcrumbs([
        { name: "All Sectors", url: BASE_URL },
        { name: sector.name, url: `${BASE_URL}/startups-to-watch/${slug}` },
      ]),
      {
        "@type": "ItemList",
        name: `${sector.name} startups, ${period.name}`,
        numberOfItems: snapshot.startups.length,
        itemListElement: snapshot.startups.slice(0, 20).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          description: `${s.commitVelocity14d} commits/14d, ${s.commitVelocityChange} change, ${s.contributors} contributors, stage: ${s.stage}, signal: ${s.signalType}`,
        })),
      },
    ],
  };
}
