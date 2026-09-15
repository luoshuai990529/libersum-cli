import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { main } from "../src/cli.js";

test("installs the bundled WeChat article compliance review Skill", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "wechat-compliance-skill-"));
  try {
    const code = await main([
      "skill", "install", "--skill", "wechat-article-compliance-review", "--agent", "codex", "--copy", "--yes", "--format", "json",
    ], { homeDir: root, stateDir: path.join(root, "state") });

    assert.equal(code, 0);
    const installed = path.join(root, ".codex/skills/wechat-article-compliance-review");
    assert.match(await readFile(path.join(installed, "SKILL.md"), "utf8"), /name: wechat-article-compliance-review/);
    assert.match(await readFile(path.join(installed, "references/policy-baseline.md"), "utf8"), /微信公众平台运营规范/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
