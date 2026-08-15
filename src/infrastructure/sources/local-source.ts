import { lstat, readdir } from "node:fs/promises";
import path from "node:path";
import type { ResolvedSkillSource, SkillSourceResolver } from "./source-resolver.js";
import { readSkillMetadata } from "./skill-metadata.js";

const SKIP_DIRECTORIES = new Set([".git", "node_modules", "dist", ".staging"]);

export class LocalSkillSourceResolver implements SkillSourceResolver {
  async discover(source: string): Promise<readonly ResolvedSkillSource[]> {
    const root = await normalizeSourceDirectory(source);
    const directories = await findSkillDirectories(root);
    if (directories.length === 0) {
      throw new Error(`No valid SKILL.md found under ${root}`);
    }

    const resolved = await Promise.all(
      directories.map(async (directory) => ({
        directory,
        skill: await readSkillMetadata(directory, root),
      })),
    );

    return resolved.sort((left, right) => left.skill.name.localeCompare(right.skill.name));
  }

  async resolve(source: string, skillName?: string): Promise<readonly ResolvedSkillSource[]> {
    const discovered = await this.discover(source);
    if (!skillName) {
      return discovered;
    }

    const matches = discovered.filter((item) => item.skill.name === skillName);
    if (matches.length === 0) {
      throw new Error(`Skill not found: ${skillName}`);
    }
    return matches;
  }
}

async function normalizeSourceDirectory(source: string): Promise<string> {
  const candidate = path.resolve(source);
  const info = await lstat(candidate).catch(() => undefined);
  if (!info) {
    throw new Error(`Skill source not found: ${candidate}`);
  }
  if (info.isFile() && path.basename(candidate) === "SKILL.md") {
    return path.dirname(candidate);
  }
  if (!info.isDirectory()) {
    throw new Error(`Skill source must be a directory: ${candidate}`);
  }
  return candidate;
}

async function findSkillDirectories(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const results: string[] = [];
  const hasSkillFile = entries.some((entry) => entry.isFile() && entry.name === "SKILL.md");
  if (hasSkillFile) {
    results.push(directory);
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || SKIP_DIRECTORIES.has(entry.name)) {
      continue;
    }
    results.push(...(await findSkillDirectories(path.join(directory, entry.name))));
  }

  return results;
}
