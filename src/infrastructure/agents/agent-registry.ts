import os from "node:os";
import path from "node:path";
import type { AgentDescriptor, AgentRegistry } from "../../domain/agent.js";

function resolveCodexHome(homeDir: string): string {
  const configured = process.env.CODEX_HOME;
  if (!configured) {
    return path.join(homeDir, ".codex");
  }

  return path.isAbsolute(configured) ? configured : path.resolve(homeDir, configured);
}

function resolvePiAgentDir(homeDir: string): string {
  const configured = process.env.PI_CODING_AGENT_DIR;
  if (!configured) {
    return path.join(homeDir, ".pi", "agent");
  }

  return path.isAbsolute(configured) ? configured : path.resolve(homeDir, configured);
}

export function createDefaultAgentRegistry(homeDir = os.homedir()): AgentRegistry {
  const agents: readonly AgentDescriptor[] = [
    {
      id: "claude-code",
      displayName: "Claude Code",
      globalSkillDir: path.join(homeDir, ".claude", "skills"),
    },
    {
      id: "codex",
      displayName: "Codex",
      globalSkillDir: path.join(resolveCodexHome(homeDir), "skills"),
    },
    {
      id: "pi",
      displayName: "Pi",
      globalSkillDir: path.join(resolvePiAgentDir(homeDir), "skills"),
    },
  ];

  return {
    list: () => agents,
    get: (id) => {
      const agent = agents.find((candidate) => candidate.id === id);
      if (!agent) {
        throw new Error(`Unknown agent: ${id}. Supported agents: ${agents.map((item) => item.id).join(", ")}`);
      }
      return agent;
    },
  };
}
