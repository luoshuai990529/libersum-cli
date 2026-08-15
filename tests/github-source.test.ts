import { test } from "node:test";
import assert from "node:assert/strict";
import { parseGitHubSource } from "../src/infrastructure/sources/github-source.js";

test("parses GitHub shorthand and tree URLs", () => {
  assert.deepEqual(parseGitHubSource("owner/repository"), {
    repository: "https://github.com/owner/repository.git",
    ref: undefined,
    subpath: undefined,
  });

  assert.deepEqual(
    parseGitHubSource("https://github.com/owner/repository/tree/main/skills/example"),
    {
      repository: "https://github.com/owner/repository.git",
      ref: "main",
      subpath: "skills/example",
    },
  );
});

test("does not include credentials in source parsing errors", () => {
  const token = "ghs_super-secret-token";

  assert.throws(
    () => parseGitHubSource(`https://${token}@github.com/not-valid`),
    (error: Error) => !error.message.includes(token),
  );
});
