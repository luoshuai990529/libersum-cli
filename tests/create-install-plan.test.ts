import { test } from "node:test";
import assert from "node:assert/strict";
import { createDefaultAgentRegistry } from "../src/infrastructure/agents/agent-registry.js";
import { createInstallPlans } from "../src/application/create-install-plan.js";
import type { InstallSkillCommand } from "../src/domain/skill.js";
import type { ResolvedSkillSource, SkillSourceResolver } from "../src/infrastructure/sources/source-resolver.js";

const resolvedSkills: readonly ResolvedSkillSource[] = [
  {
    directory: "/tmp/skills/first-skill",
    skill: {
      name: "first-skill",
      description: "First skill",
      source: "/tmp/skills",
      contentDigest: "sha256:first",
    },
  },
  {
    directory: "/tmp/skills/second-skill",
    skill: {
      name: "second-skill",
      description: "Second skill",
      source: "/tmp/skills",
      contentDigest: "sha256:second",
    },
  },
];

const resolver: SkillSourceResolver = {
  discover: async () => resolvedSkills,
  resolve: async (_source, name) => resolvedSkills.filter((item) => item.skill.name === name),
};

function command(overrides: Partial<InstallSkillCommand> = {}): InstallSkillCommand {
  return {
    source: "/tmp/skills",
    skillNames: [],
    agents: [],
    scope: "global",
    method: "symlink",
    dryRun: false,
    force: false,
    ...overrides,
  };
}

test("creates plans for all Skills and all default Agents", async () => {
  const plans = await createInstallPlans(
    command(),
    resolver,
    createDefaultAgentRegistry("/Users/example"),
    { homeDir: "/Users/example" },
  );

  assert.equal(plans.length, 2);
  assert.deepEqual(plans[0].targets.map((target) => target.agentId), ["claude-code", "codex", "pi"]);
  assert.equal(plans[0].canonicalDirectory, "/Users/example/.libersum-cli/skills/first-skill");
});

test("restricts plans to explicit Skill and Agent selections", async () => {
  const plans = await createInstallPlans(
    command({ skillNames: ["second-skill"], agents: ["codex"] }),
    resolver,
    createDefaultAgentRegistry("/Users/example"),
    { homeDir: "/Users/example" },
  );

  assert.equal(plans.length, 1);
  assert.equal(plans[0].skill.name, "second-skill");
  assert.deepEqual(plans[0].targets.map((target) => target.directory), [
    "/Users/example/.codex/skills/second-skill",
  ]);
});

test("rejects unknown Agents before producing plans", async () => {
  await assert.rejects(
    () => createInstallPlans(command({ agents: ["unknown-agent"] }), resolver, createDefaultAgentRegistry()),
    /Unknown agent/,
  );
});
