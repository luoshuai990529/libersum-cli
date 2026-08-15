export interface SkillDescriptor {
  readonly name: string;
  readonly description: string;
  readonly source: string;
  readonly resolvedRef?: string;
  readonly contentDigest?: string;
}

export type InstallMethod = "symlink" | "copy";

export interface InstallSkillCommand {
  readonly source: string;
  readonly skillNames: readonly string[];
  readonly agents: readonly string[];
  readonly scope: "global";
  readonly method: InstallMethod;
  readonly dryRun: boolean;
  readonly force: boolean;
}
