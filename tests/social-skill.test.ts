import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { main } from "../src/cli.js";
import { getBundledSkillsDirectory } from "../src/infrastructure/sources/bundled-source.js";
const exec = promisify(execFile);

test("copied social skill prepares both scenes outside its source and protects existing output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "social-portability-"));
  try {
    const code = await main(["skill", "install", "--skill", "libersum99-social-publishing", "--agent", "codex", "--copy", "--yes", "--format", "json"], { homeDir: root, stateDir: path.join(root, "state") });
    assert.equal(code, 0);
    const installed = path.join(root, ".codex/skills/libersum99-social-publishing");
    for (const scene of ["cards", "wechat"]) {
      const output = path.join(root, `output ${scene}`);
      await exec("python3", [path.join(installed, "scripts/prepare.py"), scene, output], { cwd: os.tmpdir() });
      assert.deepEqual(await readFile(path.join(output, "assets/avatar.png")), await readFile(path.join(getBundledSkillsDirectory(), "libersum99-social-publishing/assets/avatar.png")));
      assert.ok((await readFile(path.join(output, "index.html"))).length > 0);
      const before = await readFile(path.join(output, "index.html"));
      await assert.rejects(exec("python3", [path.join(installed, "scripts/prepare.py"), scene, output]));
      assert.deepEqual(await readFile(path.join(output, "index.html")), before);
    }
  } finally { await rm(root, { recursive: true, force: true }); }
});
