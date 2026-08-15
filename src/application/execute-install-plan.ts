import type { InstallPlan } from "./install-skill.js";
import { executeInstallPlans, type AtomicInstallOptions, type AtomicInstallResult } from "../infrastructure/filesystem/atomic-install.js";
import type { InstalledSkillRecord, ManifestStore } from "../infrastructure/state/manifest-store.js";

export interface ExecuteInstallOptions extends AtomicInstallOptions {
  readonly manifestStore: ManifestStore;
  readonly installerVersion: string;
}

export async function executeInstallPlansWithManifest(
  plans: readonly InstallPlan[],
  options: ExecuteInstallOptions,
): Promise<AtomicInstallResult> {
  try {
    const result = await executeInstallPlans(plans, options);
    if (!options.dryRun) {
      for (const plan of plans) {
        const record: InstalledSkillRecord = {
          name: plan.skill.name,
          source: plan.skill.source,
          resolvedRef: plan.skill.resolvedRef,
          contentDigest: plan.skill.contentDigest,
          targets: plan.targets.map((target) => target.agentId),
          method: options.method,
          installedAt: new Date().toISOString(),
          installerVersion: options.installerVersion,
        };
        await options.manifestStore.save(record);
      }
    }
    return result;
  } finally {
    await cleanupPlans(plans);
  }
}

async function cleanupPlans(plans: readonly InstallPlan[]): Promise<void> {
  const cleanups = new Set<() => Promise<void>>();
  for (const plan of plans) {
    if (plan.cleanup) {
      cleanups.add(plan.cleanup);
    }
  }
  await Promise.all([...cleanups].map((cleanup) => cleanup()));
}
