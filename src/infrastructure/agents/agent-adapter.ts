import type { AgentDescriptor } from "../../domain/agent.js";

export interface AgentAdapter {
  readonly descriptor: AgentDescriptor;
  supportsSymlink(): boolean;
  skillPath(skillName: string): string;
}
