import { execFile } from "node:child_process";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { test } from "node:test";
import assert from "node:assert/strict";

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("CLI starts when launched through an npm-style symlink", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "libersum-cli-entrypoint-test-"));
  const linkedBin = path.join(directory, "libersum-cli");
  try {
    await symlink(path.join(projectRoot, "src/cli.ts"), linkedBin);
    const result = await execFileAsync(
      process.execPath,
      ["--import", "tsx/esm", linkedBin, "--help"],
      { cwd: projectRoot },
    );

    assert.match(result.stdout, /Usage: libersum-cli/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
