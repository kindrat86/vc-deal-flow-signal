import { NextResponse } from "next/server";

export const dynamic = "force-static";

/**
 * JSON Schema definition for the markets API response. Referenced as `$schema`
 * in /api/markets/{slug}.json so consumers can validate or codegen against it.
 */
const SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://signals.gitdealflow.com/markets/schema.json",
  title: "VC Deal Flow Signal, Open Prediction Market",
  description:
    "Schema for seeded prediction markets on startup funding events. The market itself is a model output (implied probabilities) over a public candidate set; the page does not operate an exchange or accept wagers.",
  type: "object",
  required: ["generated_at", "license", "cite_as", "market"],
  properties: {
    $schema: { type: "string", format: "uri" },
    generated_at: { type: "string", format: "date-time" },
    license: { type: "string", description: "SPDX-style license tag" },
    cite_as: { type: "string", description: "Suggested citation string" },
    market: {
      type: "object",
      required: [
        "slug",
        "question",
        "short_name",
        "category",
        "opened_on",
        "resolves_on",
        "resolver",
        "methodology_url",
        "source_of_truth",
        "candidates",
        "no_resolution",
        "external_mirrors",
      ],
      properties: {
        slug: { type: "string", pattern: "^[a-z0-9-]+$" },
        question: { type: "string" },
        short_name: { type: "string" },
        category: { type: "string" },
        opened_on: { type: "string", format: "date" },
        resolves_on: { type: "string", format: "date" },
        resolver: {
          type: "string",
          description:
            "Plain-English resolution criteria, including allowed sources and exclusions",
        },
        methodology_url: { type: "string", format: "uri" },
        source_of_truth: { type: "string" },
        candidates: {
          type: "array",
          minItems: 2,
          items: {
            type: "object",
            required: [
              "name",
              "display_name",
              "website_url",
              "github_url",
              "stage",
              "sector",
              "sector_slug",
              "signal_type",
              "commit_velocity_14d",
              "commit_velocity_change",
              "contributors",
              "contributor_growth",
              "new_repos",
              "implied_probability",
              "rationale",
              "profile_url",
            ],
            properties: {
              name: { type: "string" },
              display_name: { type: "string" },
              website_url: { type: "string", format: "uri" },
              github_url: { type: "string", format: "uri" },
              stage: { type: "string" },
              sector: { type: "string" },
              sector_slug: { type: "string" },
              signal_type: { type: "string" },
              commit_velocity_14d: { type: "integer", minimum: 0 },
              commit_velocity_change: {
                type: "string",
                description: "Signed percentage e.g. \"+38%\" or \"-12%\"",
              },
              contributors: { type: "integer", minimum: 0 },
              contributor_growth: { type: "string" },
              new_repos: { type: "integer", minimum: 0 },
              implied_probability: {
                type: "number",
                minimum: 0,
                maximum: 1,
                description:
                  "Softmax-normalized probability across the candidate set",
              },
              rationale: { type: "string" },
              profile_url: { type: "string", format: "uri" },
            },
          },
        },
        no_resolution: {
          type: "object",
          required: ["label", "impliedProbability"],
          properties: {
            label: { type: "string" },
            impliedProbability: { type: "number", minimum: 0, maximum: 1 },
          },
        },
        external_mirrors: {
          type: "array",
          items: {
            type: "object",
            required: ["platform", "status", "note"],
            properties: {
              platform: { type: "string" },
              status: {
                type: "string",
                enum: [
                  "live",
                  "draft",
                  "submitted-as-suggestion",
                  "not-applicable",
                ],
              },
              url: { type: ["string", "null"], format: "uri" },
              playMoneyOnly: { type: "boolean" },
              note: { type: "string" },
            },
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(SCHEMA, {
    headers: {
      "Content-Type": "application/schema+json; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
    },
  });
}
