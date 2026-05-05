# Hashnode — paper announcement cross-post

**Target URL:** https://hashnode.com/

**Rationale:** Hashnode is the developer blogging platform with strong
organic reach via the hashnode.dev subdomain. Existing cross-post
pattern (per memory `reference_hashnode_article`) already works with
canonical URL pointing to dev.to.

## Pre-existing account

- Profile: `gitdealflow.hashnode.dev` (per memory).
- Canonical-URL pattern: use the dev.to article as canonical.

## Article

Same body as `12-devto-article.md`. **Canonical URL** on Hashnode:
point to the dev.to version once published:
```
https://dev.to/data_nerd/i-released-a-public-dataset-on-startup-engineering-velocity
```

(Or point to SSRN directly if the dev.to publish slips.)

## Tags

```
opensource, datascience, github, startup, venture-capital
```

## Automation

Hashnode has a GraphQL API at `https://gql.hashnode.com/`.

```bash
curl -X POST https://gql.hashnode.com/ \
  -H "Authorization: $HASHNODE_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Publish($input: PublishPostInput!) { publishPost(input: $input) { post { url } } }",
    "variables": {
      "input": {
        "title": "...",
        "contentMarkdown": "...",
        "publicationId": "<HASHNODE_PUBLICATION_ID>",
        "tags": [],
        "originalArticleURL": "<dev.to canonical URL>"
      }
    }
  }'
```

`HASHNODE_PAT` = Personal Access Token. Generate at
https://hashnode.com/settings/developer.

See `scripts/submit-hashnode.mjs`.
