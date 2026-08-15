import os from "node:os";
import path from "node:path";
import type { AgentRegistry } from "../domain/agent.js";
import type { InstallSkillCommand } from "../domain/skill.js";
import type { SkillSourceResolver } from "../infrastructure/sources/source-resolver.js";
import type { InstallPlan } from "./install-skill.js";

export interface InstallPlanOptions {
  readonly homeDir?: string;
  readonly stateDir?: string;
}

export async function createInstallPlans(
  command: InstallSkillCommand,
  resolver: SkillSourceResolver,
  registry: AgentRegistry,
  options: InstallPlanOptions = {},
): Promise<readonly InstallPlan[]> {
  const homeDir = options.homeDir ?? os.homedir();
  const stateDir = options.stateDir ?? path.join(homeDir, ".libersum-cli");
  const resolved = await resolveSelectedSkills(command, resolver);
  const agents = command.agents.length > 0
    ? command.agents.map((id) => registry.get(id))
    : [...registry.list()];

  return resolved.map((item) => ({
    skill: item.skill,
    sourceDirectory: item.directory,
    canonicalDirectory: path.join(stateDir, "skills", item.skill.name),
    targets: agents.map((agent) => ({
      agent,
      agentId: agent.id,
      directory: path.join(agent.globalSkillDir, item.skill.name),
    })),
    cleanup: item.cleanup,
  }));
}

async function resolveSelectedSkills(
  command: InstallSkillCommand,
  resolver: SkillSourceResolver,
) {
  const discovered = [...(await resolver.discover(command.source))];
  if (command.skillNames.length === 0) {
    return discovered;
  }

  const selected = discovered.filter((item) => command.skillNames.includes(item.skill.name));
  const missing = command.skillNames.filter(
    (skillName) => !selected.some((item) => item.skill.name === skillName),
  );
  if (missing.length > 0) {
    throw new Error(`Skill not found: ${missing.join(", ")}`);
  }
  return selected;
}
