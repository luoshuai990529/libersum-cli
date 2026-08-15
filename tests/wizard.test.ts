import { test } from "node:test";
import assert from "node:assert/strict";
import { runInteractiveWizard } from "../src/interaction/wizard.js";
import type { PromptRunner } from "../src/interaction/prompts.js";
import type { AgentRegistry } from "../src/domain/agent.js";
import type { SkillSourceResolver, ResolvedSkillSource } from "../src/infrastructure/sources/source-resolver.js";

const registry: AgentRegistry = {
  list: () => [
    { id: "claude-code", displayName: "Claude Code", globalSkillDir: "/tmp/claude/skills" },
    { id: "codex", displayName: "Codex", globalSkillDir: "/tmp/codex/skills" },
    { id: "pi", displayName: "Pi", globalSkillDir: "/tmp/pi/skills" },
  ],
  get: (id) => {
    const agent = registry.list().find((item) => item.id === id);
    if (!agent) throw new Error(`Unknown agent: ${id}`);
    return agent;
  },
};

const skills: readonly ResolvedSkillSource[] = [
  {
    directory: "/tmp/source/first",
    skill: { name: "first-skill", description: "First", source: "/tmp/source" },
  },
  {
    directory: "/tmp/source/second",
    skill: { name: "second-skill", description: "Second", source: "/tmp/source" },
  },
];

const resolver: SkillSourceResolver = {
  discover: async () => skills,
  resolve: async (_source, name) => skills.filter((item) => item.skill.name === name),
};

test("wizard collects action, multiple Skills, multiple Agents, method, and confirmation", async () => {
  const calls: unknown[] = [];
  const prompts: PromptRunner = {
    select: async (message) => {
      calls.push(message);
      return calls.length === 1 ? "install-skill" : "symlink";
    },
    input: async () => "/tmp/source",
    checkbox: async (message, choices) => {
      calls.push(message);
      if (message.includes("Agent")) {
        assert.deepEqual(choices.map((choice) => choice.value), ["claude-code", "codex", "pi"]);
        assert.equal(choices.every((choice) => choice.checked === true), true);
      }
      return message.includes("Skill") ? ["first-skill"] : ["codex", "pi"];
    },
    confirm: async () => true,
  };

  let executed = false;
  const result = await runInteractiveWizard({
    prompts,
    resolver,
    registry,
    homeDir: "/Users/example",
    execute: async (plans) => {
      executed = true;
      assert.equal(plans.length, 1);
      assert.equal(plans[0].skill.name, "first-skill");
      assert.deepEqual(plans[0].targets.map((target) => target.agentId), ["codex", "pi"]);
      return { changedTargets: [], warnings: [] };
    },
  });

  assert.equal(result.status, "installed");
  assert.equal(executed, true);
});

test("wizard cancellation does not execute an install", async () => {
  let executed = false;
  const prompts: PromptRunner = {
    select: async (message) => (message.includes("安装方式") ? "symlink" : "install-skill"),
    input: async () => "/tmp/source",
    checkbox: async (message) => (message.includes("Skill") ? ["first-skill"] : ["codex"]),
    confirm: async () => false,
  };

  const result = await runInteractiveWizard({
    prompts,
    resolver,
    registry,
    execute: async () => {
      executed = true;
      return { changedTargets: [], warnings: [] };
    },
  });

  assert.equal(result.status, "cancelled");
  assert.equal(executed, false);
});
