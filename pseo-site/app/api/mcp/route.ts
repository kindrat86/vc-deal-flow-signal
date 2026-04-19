import { NextResponse } from "next/server";
import { slugify } from "@/lib/slugify";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  getDataLastModified,
  getAllStartupSlugs,
  getStartupProfile,
} from "@/lib/data";

const BASE_URL = "https://signals.gitdealflow.com";

/**
 * Lightweight hosted MCP-like endpoint.
 *
 * This is not a full MCP transport (which requires bidirectional streaming),
 * but a simple JSON-RPC-style API that AI agents can call directly.
 *
 * Supported actions via ?tool= query parameter:
 *   - get_trending: Top 20 startups by engineering acceleration
 *   - get_sector&sector=ai-ml: Startups in a specific sector
 *   - get_startup&name=skypilot-org: Individual startup profile
 *   - get_summary: High-level data summary
 *   - list_tools: List available tools and their descriptions
 *
 * For full MCP stdio transport, use: npx tsx mcp/server.ts
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const tool = url.searchParams.get("tool") ?? "list_tools";

  const period = getCurrentPeriod();
  const sectors = getAllSectors();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);

  switch (tool) {
    case "list_tools": {
      return NextResponse.json({
        name: "vc-deal-flow-signal",
        version: "1.0.0",
        description:
          "Startup engineering acceleration data from public GitHub activity. Query trending startups, sector rankings, and individual startup profiles.",
        tools: [
          {
            name: "get_trending",
            description:
              "Top 20 startups by commit velocity change across all sectors.",
            parameters: {},
          },
          {
            name: "get_sector",
            description:
              "Startups ranked by engineering acceleration for a specific sector.",
            parameters: {
              sector: {
                type: "string",
                required: true,
                description: "Sector slug",
                enum: activeSectors.map((s) => s.slug),
              },
            },
          },
          {
            name: "get_startup",
            description:
              "Signal profile for a specific startup with current and historical metrics.",
            parameters: {
              name: {
                type: "string",
                required: true,
                description: "Startup name or slug",
              },
            },
          },
          {
            name: "get_summary",
            description:
              "High-level summary: sectors, startup count, period, update schedule, available data formats.",
            parameters: {},
          },
        ],
        formats: {
          json: `${BASE_URL}/api/signals.json`,
          csv: `${BASE_URL}/api/signals.csv`,
          openapi: `${BASE_URL}/api/openapi.json`,
          mcp_stdio: "npx tsx mcp/server.ts",
          llms_txt: `${BASE_URL}/llms.txt`,
        },
      });
    }

    case "get_trending": {
      const allStartups = activeSectors.flatMap((s) =>
        s.periods[period.slug].startups.map((st) => ({
          ...st,
          sectorName: s.name,
        }))
      );
      const top20 = getSortedStartups(allStartups).slice(0, 20) as (typeof allStartups[number])[];
      return NextResponse.json({
        period: period.name,
        count: top20.length,
        startups: top20.map((s, i) => ({
          rank: i + 1,
          name: s.name,
          sector: s.sectorName,
          commitVelocityChange: s.commitVelocityChange,
          contributors: s.contributors,
          signalType: s.signalType,
          stage: s.stage,
          geography: s.geography,
          ...(s.websiteUrl ? { websiteUrl: s.websiteUrl } : {}),
          ...(s.linkedinUrl ? { linkedinUrl: s.linkedinUrl } : {}),
          profile: `${BASE_URL}/startup/${slugify(s.name)}`,
        })),
        citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
      });
    }

    case "get_sector": {
      const sectorSlug = url.searchParams.get("sector");
      if (!sectorSlug) {
        return NextResponse.json(
          {
            error: "Missing 'sector' parameter",
            available: activeSectors.map((s) => s.slug),
          },
          { status: 400 }
        );
      }
      const sector = activeSectors.find((s) => s.slug === sectorSlug);
      if (!sector) {
        return NextResponse.json(
          {
            error: `Sector "${sectorSlug}" not found`,
            available: activeSectors.map((s) => s.slug),
          },
          { status: 404 }
        );
      }
      const snapshot = sector.periods[period.slug];
      const sorted = getSortedStartups(snapshot.startups);
      return NextResponse.json({
        sector: sector.name,
        slug: sector.slug,
        period: period.name,
        description: sector.description,
        count: sorted.length,
        startups: sorted.map((s, i) => ({
          rank: i + 1,
          name: s.name,
          description: s.description,
          commitVelocityChange: s.commitVelocityChange,
          commitVelocity14d: s.commitVelocity14d,
          contributors: s.contributors,
          contributorGrowth: s.contributorGrowth,
          signalType: s.signalType,
          stage: s.stage,
          geography: s.geography,
          githubUrl: s.githubUrl,
          ...(s.websiteUrl ? { websiteUrl: s.websiteUrl } : {}),
          ...(s.linkedinUrl ? { linkedinUrl: s.linkedinUrl } : {}),
        })),
        url: `${BASE_URL}/startups-to-watch/${sector.slug}-${period.slug}`,
      });
    }

    case "get_startup": {
      const inputName = url.searchParams.get("name");
      if (!inputName) {
        return NextResponse.json(
          {
            error: "Missing 'name' parameter",
            hint: "Use startup name or slug, e.g., ?tool=get_startup&name=skypilot-org",
          },
          { status: 400 }
        );
      }
      const slug = inputName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const profile = getStartupProfile(slug);
      if (!profile) {
        const available = getAllStartupSlugs().slice(0, 20);
        return NextResponse.json(
          {
            error: `Startup "${inputName}" not found`,
            hint: "Some example slugs: " + available.join(", "),
          },
          { status: 404 }
        );
      }
      return NextResponse.json({
        name: profile.name,
        description: profile.description,
        githubUrl: profile.githubUrl,
        ...(profile.websiteUrl ? { websiteUrl: profile.websiteUrl } : {}),
        ...(profile.linkedinUrl ? { linkedinUrl: profile.linkedinUrl } : {}),
        stage: profile.latestStage,
        geography: profile.latestGeography,
        sectors: profile.sectors,
        history: profile.history.map((h) => ({
          period: h.periodName,
          sector: h.sectorName,
          commitVelocity14d: h.commitVelocity14d,
          commitVelocityChange: h.commitVelocityChange,
          contributors: h.contributors,
          contributorGrowth: h.contributorGrowth,
          newRepos: h.newRepos,
          signalType: h.signalType,
        })),
        url: `${BASE_URL}/startup/${slug}`,
      });
    }

    case "get_summary": {
      const lastModified = getDataLastModified();
      const totalStartups = activeSectors.reduce(
        (sum, s) => sum + s.periods[period.slug].startups.length,
        0
      );
      return NextResponse.json({
        name: "VC Deal Flow Signal",
        description:
          "Startup engineering acceleration data from public GitHub activity.",
        period: period.name,
        sectorsActive: activeSectors.length,
        startupsTracked: totalStartups,
        lastUpdated: lastModified.toISOString(),
        updateFrequency: "Weekly (Mondays)",
        formats: {
          json: `${BASE_URL}/api/signals.json`,
          csv: `${BASE_URL}/api/signals.csv`,
          openapi: `${BASE_URL}/api/openapi.json`,
          changelog: `${BASE_URL}/api/changelog.json`,
          mcp_hosted: `${BASE_URL}/api/mcp?tool=list_tools`,
          mcp_stdio: "npx tsx mcp/server.ts",
          llms_txt: `${BASE_URL}/llms.txt`,
          llms_full: `${BASE_URL}/llms-full.txt`,
          ai_txt: `${BASE_URL}/ai.txt`,
          rss: `${BASE_URL}/feed.xml`,
        },
        citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
      });
    }

    default:
      return NextResponse.json(
        {
          error: `Unknown tool: "${tool}"`,
          available: [
            "list_tools",
            "get_trending",
            "get_sector",
            "get_startup",
            "get_summary",
          ],
        },
        { status: 400 }
      );
  }
}
