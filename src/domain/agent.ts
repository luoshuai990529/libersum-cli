export type AgentId = "claude-code" | "codex" | "pi";

export interface AgentDescriptor {
  readonly id: AgentId;
  readonly displayName: string;
  readonly globalSkillDir: string;
}

export interface AgentRegistry {
  list(): readonly AgentDescriptor[];
  get(id: string): AgentDescriptor;
}
