import { createHash } from "node:crypto";
import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import type { SkillDescriptor } from "../../domain/skill.js";

const SAFE_SKILL_NAME = /^[a-z0-9][a-z0-9-]*$/;

export async function readSkillMetadata(
  directory: string,
  source = directory,
  resolvedRef?: string,
): Promise<SkillDescriptor> {
  const skillFile = path.join(directory, "SKILL.md");
  const content = await readFile(skillFile, "utf8");
  const frontmatter = extractFrontmatter(content);
  const metadata = parseYaml(frontmatter) as unknown;

  if (!metadata || typeof metadata !== "object") {
    throw new Error(`Invalid SKILL.md frontmatter in ${skillFile}`);
  }

  const name = (metadata as Record<string, unknown>).name;
  const description = (metadata as Record<string, unknown>).description;
  if (typeof name !== "string" || !SAFE_SKILL_NAME.test(name)) {
    throw new Error(`Invalid Skill name in ${skillFile}`);
  }
  if (typeof description !== "string" || description.trim().length === 0) {
    throw new Error(`Missing Skill description in ${skillFile}`);
  }

  return {
    name,
    description: description.trim(),
    source,
    resolvedRef,
    contentDigest: await computeContentDigest(directory),
  };
}

export async function computeContentDigest(directory: string): Promise<string> {
  const files = await collectFiles(directory);
  const hash = createHash("sha256");

  for (const file of files.sort()) {
    const relativePath = path.relative(directory, file).split(path.sep).join("/");
    hash.update(relativePath);
    hash.update("\0");
    hash.update(await readFile(file));
    hash.update("\0");
  }

  return `sha256:${hash.digest("hex")}`;
}

function extractFrontmatter(content: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    throw new Error("SKILL.md must start with YAML frontmatter");
  }
  return match[1];
}

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const fullPath = path.join(directory, entry.name);
    const info = await lstat(fullPath);
    if (info.isSymbolicLink()) {
      throw new Error(`Symbolic links are not allowed inside Skill source: ${fullPath}`);
    }
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}
