import type { InstallMethod } from "../../domain/skill.js";

export interface InstalledSkillRecord {
  readonly name: string;
  readonly source: string;
  readonly resolvedRef?: string;
  readonly contentDigest?: string;
  readonly targets: readonly string[];
  readonly method: InstallMethod;
  readonly installedAt: string;
  readonly installerVersion: string;
}

export interface ManifestStore {
  list(): Promise<readonly InstalledSkillRecord[]>;
  save(record: InstalledSkillRecord): Promise<void>;
}
