import assert from "node:assert/strict";
import test from "node:test";

import {
  chooseAuthenticatedUserTool,
  runGitHubFirstCall,
  summarizeGitHubUser,
} from "../src/github-first-call.mjs";

test("asks for GitHub authorization before executing any tool", async () => {
  let executed = false;
  const adapter = {
    async isConnected() {
      return false;
    },
    async authorize() {
      return { redirectUrl: "https://connect.composio.dev/link/test" };
    },
    async listTools() {
      throw new Error("tools must not be listed before authorization");
    },
    async execute() {
      executed = true;
    },
  };

  const result = await runGitHubFirstCall(adapter);

  assert.deepEqual(result, {
    status: "needs_connection",
    redirectUrl: "https://connect.composio.dev/link/test",
  });
  assert.equal(executed, false);
});

test("discovers and executes a safe authenticated-user lookup", async () => {
  const calls = [];
  const tools = [
    {
      slug: "GITHUB_WRITE_SOMETHING",
      name: "Create an issue",
      description: "Creates data in GitHub",
      tags: ["openWorldHint"],
    },
    {
      slug: "GITHUB_SAFE_IDENTITY_LOOKUP",
      name: "Get the authenticated user",
      description: "Returns the profile for the currently authenticated GitHub user",
      tags: ["readOnlyHint"],
    },
  ];
  const adapter = {
    async isConnected() {
      return true;
    },
    async authorize() {
      throw new Error("already connected");
    },
    async listTools() {
      return tools;
    },
    async execute(slug, input) {
      calls.push({ slug, input });
      return {
        successful: true,
        data: {
          login: "kindrat86",
          name: "Maryan",
          html_url: "https://github.com/kindrat86",
        },
        logId: "log_test_123",
      };
    },
  };

  const result = await runGitHubFirstCall(adapter);

  assert.deepEqual(calls, [
    { slug: "GITHUB_SAFE_IDENTITY_LOOKUP", input: {} },
  ]);
  assert.deepEqual(result, {
    status: "success",
    toolSlug: "GITHUB_SAFE_IDENTITY_LOOKUP",
    user: {
      login: "kindrat86",
      name: "Maryan",
      url: "https://github.com/kindrat86",
    },
    logId: "log_test_123",
  });
});

test("authenticated-user discovery rejects mutating lookalikes", () => {
  assert.throws(
    () =>
      chooseAuthenticatedUserTool([
        {
          slug: "GITHUB_UPDATE_AUTHENTICATED_USER",
          name: "Update the authenticated user",
          description: "Updates the authenticated user profile",
          tags: ["destructiveHint"],
        },
      ]),
    /No safe GitHub authenticated-user lookup tool was discovered/,
  );
});

test("summarizes nested Composio responses without leaking extra fields", () => {
  const summary = summarizeGitHubUser({
    data: {
      login: "kindrat86",
      name: "Maryan",
      html_url: "https://github.com/kindrat86",
      email: "private@example.com",
      token: "do-not-return",
    },
  });

  assert.deepEqual(summary, {
    login: "kindrat86",
    name: "Maryan",
    url: "https://github.com/kindrat86",
  });
});
