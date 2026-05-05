#!/usr/bin/env node
/**
 * submit-hashnode.mjs — publish the SSRN paper announcement on Hashnode.
 *
 * Uses the Hashnode GraphQL API at https://gql.hashnode.com/.
 *
 * Requires env vars:
 *   HASHNODE_PAT             — Personal Access Token (Settings → Developer)
 *   HASHNODE_PUBLICATION_ID  — ID of the gitdealflow Hashnode publication
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const STATUS_PATH = path.join(
  ROOT,
  "distribution",
  "research-paper",
  "amplification-status.json"
);
const BODY_PATH = path.join(
  ROOT,
  "distribution",
  "research-paper",
  "submissions",
  "12-devto-article.md"
);

const PAT = process.env.HASHNODE_PAT;
const publicationId = process.env.HASHNODE_PUBLICATION_ID;

if (!PAT || !publicationId) {
  console.error(
    "ERROR: HASHNODE_PAT and HASHNODE_PUBLICATION_ID must both be set."
  );
  process.exit(2);
}

const source = fs.readFileSync(BODY_PATH, "utf-8");
const match = source.match(/```markdown\n([\s\S]*?)\n```/);
if (!match) {
  console.error("Could not find a ```markdown body fence in the draft.");
  process.exit(3);
}
const body = match[1].trim();

const query = `
  mutation Publish($input: PublishPostInput!) {
    publishPost(input: $input) {
      post { url id slug }
    }
  }
`;

const input = {
  title:
    "I released a public dataset on startup engineering velocity (219 obs across 55 VC-backed startups)",
  subtitle:
    "An SSRN preprint + CC BY 4.0 dataset on GitHub alt-data signals in venture capital.",
  contentMarkdown: body,
  publicationId,
  tags: [
    { slug: "opensource", name: "Open Source" },
    { slug: "data-science", name: "Data Science" },
    { slug: "github", name: "GitHub" },
    { slug: "startup", name: "Startup" },
  ],
  originalArticleURL: "https://ssrn.com/abstract=6606558",
};

const res = await fetch("https://gql.hashnode.com/", {
  method: "POST",
  headers: {
    Authorization: PAT,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query, variables: { input } }),
});

if (!res.ok) {
  console.error(`Hashnode POST failed: ${res.status} ${await res.text()}`);
  process.exit(4);
}

const data = await res.json();
if (data.errors) {
  console.error("Hashnode errors:", JSON.stringify(data.errors, null, 2));
  process.exit(5);
}

const post = data.data.publishPost.post;
console.log(`✅ Published: ${post.url}`);

const status = JSON.parse(fs.readFileSync(STATUS_PATH, "utf-8"));
status.hashnode_article = {
  published_at: new Date().toISOString(),
  url: post.url,
  id: post.id,
};
fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2) + "\n");
console.log(`Updated ${path.relative(ROOT, STATUS_PATH)}.`);
