import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import { executeInstallPlans } from "../src/infrastructure/filesystem/atomic-install.js";
import type { InstallPlan } from "../src/application/install-skill.js";

async function withTempDirectory(run: (directory: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(path.join(os.tmpdir(), "libersum-install-test-"));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function plan(sourceDirectory: string, canonicalDirectory: string, targetDirectory: string): InstallPlan {
  return {
    sourceDirectory,
    canonicalDirectory,
    skill: {
      name: "example-skill",
      description: "Example skill",
      source: sourceDirectory,
      contentDigest: "sha256:example",
    },
    targets: [
      {
        agentId: "codex",
        agent: {
          id: "codex",
          displayName: "Codex",
          globalSkillDir: path.dirname(targetDirectory),
        },
        directory: targetDirectory,
      },
    ],
  };
}

test("dry-run produces a plan without writing files", async () => {
  await withTempDirectory(async (directory) => {
    const source = path.join(directory, "source");
    const canonical = path.join(directory, "state", "skills", "example-skill");
    const target = path.join(directory, "agent", "example-skill");
    await writeFile(path.join(await createSource(source), "SKILL.md"), "skill");

    const result = await executeInstallPlans([plan(source, canonical, target)], {
      stateDir: path.join(directory, "state"),
      method: "symlink",
      dryRun: true,
      force: false,
    });

    assert.deepEqual(result.changedTargets, [target]);
    await assert.rejects(() => stat(canonical));
    await assert.rejects(() => stat(target));
  });
});

test("symlink installation promotes a canonical copy", async () => {
  await withTempDirectory(async (directory) => {
    const source = await createSource(path.join(directory, "source"));
    await writeFile(path.join(source, "SKILL.md"), "skill");
    const canonical = path.join(directory, "state", "skills", "example-skill");
    const target = path.join(directory, "agent", "example-skill");

    await executeInstallPlans([plan(source, canonical, target)], {
      stateDir: path.join(directory, "state"),
      method: "symlink",
      dryRun: false,
      force: false,
    });

    assert.equal(await readFile(path.join(canonical, "SKILL.md"), "utf8"), "skill");
    assert.equal(await readFile(path.join(target, "SKILL.md"), "utf8"), "skill");
  });
});

test("copy installation rejects an unmanaged existing target", async () => {
  await withTempDirectory(async (directory) => {
    const source = await createSource(path.join(directory, "source"));
    const canonical = path.join(directory, "state", "skills", "example-skill");
    const target = path.join(directory, "agent", "example-skill");
    await writeFile(path.join(await createSource(target), "old.txt"), "old");

    await assert.rejects(
      () => executeInstallPlans([plan(source, canonical, target)], {
        stateDir: path.join(directory, "state"),
        method: "copy",
        dryRun: false,
        force: false,
      }),
      /Target already exists/,
    );
    assert.equal(await readFile(path.join(target, "old.txt"), "utf8"), "old");
  });
});

async function createSource(directory: string): Promise<string> {
  await import("node:fs/promises").then(({ mkdir }) => mkdir(directory, { recursive: true }));
  return directory;
}
