import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createDefaultAgentRegistry } from "../src/infrastructure/agents/agent-registry.js";

describe("default Agent registry", () => {
  test("maps Claude Code and Codex to their user-level skill directories", () => {
    const registry = createDefaultAgentRegistry("/Users/example");

    assert.deepEqual(registry.list().map((agent) => agent.id), ["claude-code", "codex", "pi"]);
    assert.equal(registry.get("claude-code").globalSkillDir, "/Users/example/.claude/skills");
    assert.equal(registry.get("codex").globalSkillDir, "/Users/example/.codex/skills");
    assert.equal(registry.get("pi").globalSkillDir, "/Users/example/.pi/agent/skills");
  });

  test("respects the Pi agent directory override", () => {
    const previous = process.env.PI_CODING_AGENT_DIR;
    process.env.PI_CODING_AGENT_DIR = "/Users/example/custom-pi";

    try {
      const registry = createDefaultAgentRegistry("/Users/example");
      assert.equal(registry.get("pi").globalSkillDir, "/Users/example/custom-pi/skills");
    } finally {
      if (previous === undefined) {
        delete process.env.PI_CODING_AGENT_DIR;
      } else {
        process.env.PI_CODING_AGENT_DIR = previous;
      }
    }
  });

  test("rejects unknown Agent identifiers", () => {
    const registry = createDefaultAgentRegistry("/Users/example");

    assert.throws(() => registry.get("unknown-agent"), /Unknown agent/);
  });
});
