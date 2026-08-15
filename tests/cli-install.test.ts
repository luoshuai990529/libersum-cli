import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import { main } from "../src/cli.js";
import type { AgentRegistry } from "../src/domain/agent.js";
import type { ResolvedSkillSource, SkillSourceResolver } from "../src/infrastructure/sources/source-resolver.js";
import { JsonManifestStore } from "../src/infrastructure/state/json-manifest-store.js";

test("skill install command performs a non-interactive local installation", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "libersum-cli-test-"));
  try {
    const source = path.join(directory, "source");
    const targetRoot = path.join(directory, "codex", "skills");
    const stateDir = path.join(directory, "state");
    await mkdir(source, { recursive: true });
    await writeFile(path.join(source, "SKILL.md"), "skill");

    const skill: ResolvedSkillSource = {
      directory: source,
      skill: {
        name: "example-skill",
        description: "Example",
        source,
        contentDigest: "sha256:example",
      },
    };
    const registry: AgentRegistry = {
      list: () => [{ id: "codex", displayName: "Codex", globalSkillDir: targetRoot }],
      get: (id) => {
        if (id !== "codex") throw new Error(`Unknown agent: ${id}`);
        return registry.list()[0];
      },
    };
    const resolver: SkillSourceResolver = {
      discover: async () => [skill],
      resolve: async () => [skill],
    };

    const exitCode = await main([
      "skill",
      "install",
      source,
      "--skill",
      "example-skill",
      "--agent",
      "codex",
      "--yes",
      "--format",
      "json",
    ], {
      homeDir: directory,
      registry,
      resolver,
      manifestStore: new JsonManifestStore(path.join(stateDir, "manifest.json")),
    });

    assert.equal(exitCode, 0);
    assert.equal(await readFile(path.join(targetRoot, "example-skill", "SKILL.md"), "utf8"), "skill");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("skill install uses the bundled catalog when source is omitted", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "libersum-cli-bundled-test-"));
  try {
    const targetRoot = path.join(directory, "codex", "skills");
    const stateDir = path.join(directory, "state");
    const registry: AgentRegistry = {
      list: () => [{ id: "codex", displayName: "Codex", globalSkillDir: targetRoot }],
      get: (id) => {
        if (id !== "codex") throw new Error(`Unknown agent: ${id}`);
        return registry.list()[0];
      },
    };

    const exitCode = await main([
      "skill",
      "install",
      "--skill",
      "roguelike-game-design",
      "--agent",
      "codex",
      "--yes",
      "--format",
      "json",
    ], {
      homeDir: directory,
      registry,
      manifestStore: new JsonManifestStore(path.join(stateDir, "manifest.json")),
    });

    assert.equal(exitCode, 0);
    assert.match(
      await readFile(path.join(targetRoot, "roguelike-game-design", "SKILL.md"), "utf8"),
      /name: roguelike-game-design/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
