import type { ResolvedSkillSource } from "../infrastructure/sources/source-resolver.js";
import type { PromptRunner } from "./prompts.js";

export async function selectSkills(
  prompts: PromptRunner,
  skills: readonly ResolvedSkillSource[],
): Promise<readonly ResolvedSkillSource[]> {
  const selectedNames = await prompts.checkbox(
    "请选择要安装的 Skill（Space 选中，Enter 确认）",
    skills.map((item) => ({
      name: `${item.skill.name} - ${item.skill.description}`,
      value: item.skill.name,
      checked: true,
    })),
  );
  if (selectedNames.length === 0) {
    throw new Error("至少选择一个 Skill");
  }
  return skills.filter((item) => selectedNames.includes(item.skill.name));
}
