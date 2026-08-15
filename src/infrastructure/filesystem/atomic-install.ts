import { cp, lstat, mkdir, mkdtemp, readlink, rename, rm, symlink } from "node:fs/promises";
import path from "node:path";
import type { InstallMethod } from "../../domain/skill.js";
import type { InstallPlan } from "../../application/install-skill.js";

export interface AtomicInstallOptions {
  readonly stateDir: string;
  readonly method: InstallMethod;
  readonly dryRun: boolean;
  readonly force: boolean;
}

export interface AtomicInstallResult {
  readonly changedTargets: readonly string[];
  readonly warnings: readonly string[];
}

interface Backup {
  readonly original: string;
  readonly backup: string;
}

export async function executeInstallPlans(
  plans: readonly InstallPlan[],
  options: AtomicInstallOptions,
): Promise<AtomicInstallResult> {
  const changedTargets: string[] = [];
  const warnings: string[] = [];

  for (const plan of plans) {
    const result = await executeInstallPlan(plan, options);
    changedTargets.push(...result.changedTargets);
    warnings.push(...result.warnings);
  }

  return { changedTargets, warnings };
}

async function executeInstallPlan(
  plan: InstallPlan,
  options: AtomicInstallOptions,
): Promise<AtomicInstallResult> {
  if (options.dryRun) {
    return { changedTargets: plan.targets.map((target) => target.directory), warnings: [] };
  }

  await mkdir(path.join(options.stateDir, "skills"), { recursive: true });
  const stagingRoot = await mkdtemp(path.join(options.stateDir, ".staging-"));
  const stagedDirectory = path.join(stagingRoot, plan.skill.name);
  const canonicalBackup = `${plan.canonicalDirectory}.backup-${path.basename(stagingRoot)}`;
  const backups: Backup[] = [];
  const createdTargets: string[] = [];
  let canonicalPromoted = false;

  try {
    await cp(plan.sourceDirectory, stagedDirectory, { recursive: true, force: true });

    if (await exists(plan.canonicalDirectory)) {
      await rename(plan.canonicalDirectory, canonicalBackup);
      backups.push({ original: plan.canonicalDirectory, backup: canonicalBackup });
    }
    await mkdir(path.dirname(plan.canonicalDirectory), { recursive: true });
    await rename(stagedDirectory, plan.canonicalDirectory);
    canonicalPromoted = true;

    for (const target of plan.targets) {
      const existingKind = await existingTargetKind(target.directory);
      if (existingKind !== "missing" && !(existingKind === "managed-link" && await pointsTo(target.directory, plan.canonicalDirectory))) {
        if (!options.force) {
          throw new Error(`Target already exists and is unmanaged: ${target.directory}`);
        }
        const backup = `${target.directory}.backup-${path.basename(stagingRoot)}`;
        await rename(target.directory, backup);
        backups.push({ original: target.directory, backup });
      } else if (existingKind === "managed-link") {
        await rm(target.directory, { recursive: true, force: true });
      }

      await mkdir(path.dirname(target.directory), { recursive: true });
      if (options.method === "symlink") {
        await symlink(plan.canonicalDirectory, target.directory, "dir");
      } else {
        await cp(plan.canonicalDirectory, target.directory, { recursive: true, force: true });
      }
      createdTargets.push(target.directory);
    }

    for (const backup of backups) {
      await rm(backup.backup, { recursive: true, force: true });
    }
    return { changedTargets: createdTargets, warnings: [] };
  } catch (error) {
    for (const target of createdTargets) {
      await rm(target, { recursive: true, force: true });
    }
    if (canonicalPromoted) {
      await rm(plan.canonicalDirectory, { recursive: true, force: true });
    }
    for (const backup of backups.reverse()) {
      if (await exists(backup.backup)) {
        await mkdir(path.dirname(backup.original), { recursive: true });
        await rename(backup.backup, backup.original);
      }
    }
    throw error;
  } finally {
    await rm(stagingRoot, { recursive: true, force: true });
  }
}

async function exists(filePath: string): Promise<boolean> {
  return lstat(filePath).then(() => true).catch(() => false);
}

async function existingTargetKind(filePath: string): Promise<"missing" | "managed-link" | "other"> {
  if (!(await exists(filePath))) {
    return "missing";
  }
  const info = await lstat(filePath);
  if (info.isSymbolicLink()) {
    return "managed-link";
  }
  return "other";
}

async function pointsTo(linkPath: string, targetPath: string): Promise<boolean> {
  try {
    return path.resolve(path.dirname(linkPath), await readlink(linkPath)) === path.resolve(targetPath);
  } catch {
    return false;
  }
}
