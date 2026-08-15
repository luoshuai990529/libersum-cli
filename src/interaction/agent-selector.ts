import type { AgentRegistry } from "../domain/agent.js";
import type { PromptRunner } from "./prompts.js";

export async function selectAgents(
  prompts: PromptRunner,
  registry: AgentRegistry,
): Promise<readonly string[]> {
  const selected = await prompts.checkbox(
    "请选择要安装的 Agent（Space 选中，Enter 确认）",
    registry.list().map((agent) => ({
      name: `${agent.displayName} - ${agent.globalSkillDir}`,
      value: agent.id,
      checked: true,
    })),
  );
  if (selected.length === 0) {
    throw new Error("至少选择一个 Agent");
  }
  return selected;
}
