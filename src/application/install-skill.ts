import type { AgentId, AgentDescriptor } from "../domain/agent.js";
import type { InstallSkillCommand, SkillDescriptor } from "../domain/skill.js";
import type { ResolvedSkillSource } from "../infrastructure/sources/source-resolver.js";

export type InstallSkillErrorCode =
  | "SOURCE_NOT_FOUND"
  | "SKILL_INVALID"
  | "TARGET_CONFLICT"
  | "PERMISSION_DENIED"
  | "PARTIAL_INSTALL";

export interface InstallTarget {
  readonly agent: AgentDescriptor;
  readonly agentId: AgentId;
  readonly directory: string;
}

export interface InstallPlan {
  readonly skill: SkillDescriptor;
  readonly sourceDirectory: string;
  readonly canonicalDirectory: string;
  readonly targets: readonly InstallTarget[];
  readonly cleanup?: () => Promise<void>;
}

export interface InstallSkillUseCase {
  plan(command: InstallSkillCommand): Promise<readonly InstallPlan[]>;
  execute(plans: readonly InstallPlan[]): Promise<void>;
}

export type { ResolvedSkillSource };
