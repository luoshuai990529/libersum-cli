import type { AgentRegistry } from "../domain/agent.js";
import type { PromptRunner } from "./prompts.js";

export async function selectAgents(
  prompts: PromptRunner,
  registry: AgentRegistry,
): Promise<readonly string[]> {
  const selected = await prompts.checkbox(
    "选择 Agent（空格选择，Enter 继续）",
    registry.list().map((agent) => ({
      name: agent.displayName,
      value: agent.id,
      checked: true,
    })),
  );
  if (selected.length === 0) {
    throw new Error("至少选择一个 Agent");
  }
  return selected;
}
