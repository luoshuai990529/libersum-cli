import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { LocalSkillSourceResolver } from "./local-source.js";
import type { ResolvedSkillSource, SkillSourceResolver } from "./source-resolver.js";

const execFileAsync = promisify(execFile);

export interface GitHubSourceSpec {
  readonly repository: string;
  readonly ref?: string;
  readonly subpath?: string;
}

export function isGitHubSource(source: string): boolean {
  if (/^[^/\s]+\/[^/\s]+$/.test(source)) {
    return true;
  }

  try {
    return new URL(source).hostname === "github.com";
  } catch {
    return false;
  }
}

export function parseGitHubSource(source: string): GitHubSourceSpec {
  if (/^[^/\s]+\/[^/\s]+$/.test(source)) {
    const [owner, repository] = source.split("/");
    return { repository: `https://github.com/${owner}/${repository}.git`, ref: undefined, subpath: undefined };
  }

  let url: URL;
  try {
    url = new URL(source);
  } catch {
    throw new Error("Invalid GitHub source");
  }

  if (url.hostname !== "github.com" || url.username || url.password) {
    throw new Error("Invalid GitHub source");
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length < 2 || (segments.length > 2 && segments[2] !== "tree")) {
    throw new Error("GitHub source must be owner/repository or a tree URL");
  }

  const owner = segments[0];
  const repository = segments[1].replace(/\.git$/, "");
  if (segments.length === 2) {
    return { repository: `https://github.com/${owner}/${repository}.git`, ref: undefined, subpath: undefined };
  }

  const ref = segments[3];
  if (!ref) {
    throw new Error("GitHub tree URL is missing a ref");
  }

  return {
    repository: `https://github.com/${owner}/${repository}.git`,
    ref,
    subpath: segments.slice(4).join("/") || undefined,
  };
}

export class GitHubSkillSourceResolver implements SkillSourceResolver {
  constructor(private readonly localResolver = new LocalSkillSourceResolver()) {}

  async discover(source: string): Promise<readonly ResolvedSkillSource[]> {
    const spec = parseGitHubSource(source);
    const checkout = await cloneRepository(spec);
    const sourceDirectory = spec.subpath ? path.join(checkout.directory, spec.subpath) : checkout.directory;

    try {
      const resolvedRef = await gitRevision(checkout.directory);
      const discovered = await this.localResolver.discover(sourceDirectory);
      let cleaned = false;
      const cleanup = async () => {
        if (!cleaned) {
          cleaned = true;
          await rm(checkout.tempDirectory, { recursive: true, force: true });
        }
      };

      return discovered.map((item) => ({
        directory: item.directory,
        skill: { ...item.skill, source, resolvedRef },
        cleanup,
      }));
    } catch (error) {
      await rm(checkout.tempDirectory, { recursive: true, force: true });
      throw error;
    }
  }

  async resolve(source: string, skillName?: string): Promise<readonly ResolvedSkillSource[]> {
    const discovered = await this.discover(source);
    if (!skillName) {
      return discovered;
    }

    const matches = discovered.filter((item) => item.skill.name === skillName);
    if (matches.length === 0) {
      await cleanupAll(discovered);
      throw new Error(`Skill not found: ${skillName}`);
    }
    return matches;
  }
}

export class CompositeSkillSourceResolver implements SkillSourceResolver {
  constructor(
    private readonly localResolver = new LocalSkillSourceResolver(),
    private readonly githubResolver = new GitHubSkillSourceResolver(localResolver),
  ) {}

  discover(source: string): Promise<readonly ResolvedSkillSource[]> {
    return this.resolverFor(source).discover(source);
  }

  resolve(source: string, skillName?: string): Promise<readonly ResolvedSkillSource[]> {
    return this.resolverFor(source).resolve(source, skillName);
  }

  private resolverFor(source: string): SkillSourceResolver {
    if (existsSync(path.resolve(source))) {
      return this.localResolver;
    }
    return isGitHubSource(source) ? this.githubResolver : this.localResolver;
  }
}

async function cloneRepository(spec: GitHubSourceSpec): Promise<{ tempDirectory: string; directory: string }> {
  const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "libersum-github-"));
  const directory = path.join(tempDirectory, "repository");
  const args = ["clone", "--depth", "1"];
  if (spec.ref) {
    args.push("--branch", spec.ref);
  }
  args.push(spec.repository, directory);

  try {
    await execFileAsync("git", args, { maxBuffer: 1024 * 1024 });
    return { tempDirectory, directory };
  } catch {
    await rm(tempDirectory, { recursive: true, force: true });
    throw new Error("Unable to clone GitHub source. Check the repository, ref, and Git authentication.");
  }
}

async function gitRevision(directory: string): Promise<string> {
  try {
    const result = await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: directory, maxBuffer: 1024 * 1024 });
    return result.stdout.trim();
  } catch {
    throw new Error("Unable to resolve the GitHub source revision");
  }
}

async function cleanupAll(items: readonly ResolvedSkillSource[]): Promise<void> {
  const cleanups = items.map((item) => item.cleanup?.());
  await Promise.all(cleanups);
}
