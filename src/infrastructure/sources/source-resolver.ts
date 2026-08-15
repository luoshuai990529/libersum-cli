import type { SkillDescriptor } from "../../domain/skill.js";

export interface ResolvedSkillSource {
  readonly directory: string;
  readonly skill: SkillDescriptor;
  readonly cleanup?: () => Promise<void>;
}

export interface SkillSourceResolver {
  discover(source: string): Promise<readonly ResolvedSkillSource[]>;
  resolve(source: string, skillName?: string): Promise<readonly ResolvedSkillSource[]>;
}
