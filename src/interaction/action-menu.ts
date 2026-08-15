import type { PromptRunner } from "./prompts.js";

export type InteractiveAction = "install-skill";

export function selectAction(prompts: PromptRunner): Promise<InteractiveAction> {
  return prompts.select("请选择操作", [
    { name: "安装 Skill", value: "install-skill" },
  ], "install-skill");
}
