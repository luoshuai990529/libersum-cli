import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

const execFileAsync = promisify(execFile);

test("npm package contains the built binary and excludes source files", async () => {
  const result = await execFileAsync("npm", ["pack", "--dry-run", "--json"], {
    cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
    maxBuffer: 4 * 1024 * 1024,
  });
  const report = JSON.parse(result.stdout)[0] as { files: Array<{ path: string }> };
  const files = report.files.map((file) => file.path);

  assert.equal(files.includes("dist/cli.js"), true);
  assert.equal(files.includes("README.md"), true);
  assert.equal(files.includes("skills/analyze-project-architecture/SKILL.md"), true);
  assert.equal(files.includes("skills/prepare-pr-mr/SKILL.md"), true);
  assert.equal(files.includes("skills/roguelike-game-design/SKILL.md"), true);
  assert.equal(files.some((file) => file.startsWith("src/")), false);
  assert.equal(files.some((file) => file.startsWith("tests/")), false);
  assert.equal(files.some((file) => file.startsWith("docs/")), false);
});
