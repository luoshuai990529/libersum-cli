import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

const execFileAsync = promisify(execFile);
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("packed CLI installs the bundled WeChat article compliance review Skill", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "packed-wechat-compliance-skill-"));
  const packDirectory = path.join(root, "pack");
  const unpackDirectory = path.join(root, "unpack");
  try {
    await Promise.all([mkdir(packDirectory), mkdir(unpackDirectory)]);
    const packed = await execFileAsync("npm", ["pack", "--json", "--pack-destination", packDirectory], {
      cwd: packageRoot,
      env: { ...process.env, NPM_CONFIG_CACHE: path.join(root, "npm-cache") },
    });
    const report = JSON.parse(packed.stdout) as Array<{ filename: string }>;
    const archive = path.join(packDirectory, report[0].filename);
    await execFileAsync("tar", ["-xzf", archive, "-C", unpackDirectory]);
    const packedPackage = path.join(unpackDirectory, "package");
    await symlink(path.join(packageRoot, "node_modules"), path.join(packedPackage, "node_modules"), "dir");
    const { main } = await import(pathToFileURL(path.join(packedPackage, "dist", "cli.js")).href);

    const code = await main([
      "skill", "install", "--skill", "wechat-article-compliance-review", "--agent", "codex", "--copy", "--yes", "--format", "json",
    ], { homeDir: root, stateDir: path.join(root, "state") });
    assert.equal(code, 0);

    const installed = path.join(root, ".codex", "skills", "wechat-article-compliance-review");
    assert.match(await readFile(path.join(installed, "SKILL.md"), "utf8"), /name: wechat-article-compliance-review/);
    assert.match(await readFile(path.join(installed, "references", "policy-baseline.md"), "utf8"), /微信公众平台运营规范/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
