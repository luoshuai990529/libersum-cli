import type { ResolvedSkillSource } from "../infrastructure/sources/source-resolver.js";
import type { PromptRunner } from "./prompts.js";
import { summarizeSkillDescription } from "./skill-summary.js";

export async function selectSkills(
  prompts: PromptRunner,
  skills: readonly ResolvedSkillSource[],
): Promise<readonly ResolvedSkillSource[]> {
  const selectedNames = await prompts.checkbox(
    "选择 Skill（空格选择，Enter 继续）",
    skills.map((item) => ({
      name: `${item.skill.name} — ${summarizeSkillDescription(item.skill.name, item.skill.description)}`,
      value: item.skill.name,
      checked: false,
    })),
  );
  if (selectedNames.length === 0) {
    throw new Error("至少选择一个 Skill");
  }
  return skills.filter((item) => selectedNames.includes(item.skill.name));
}
