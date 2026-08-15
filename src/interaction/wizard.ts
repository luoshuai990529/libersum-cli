import type { AgentRegistry } from "../domain/agent.js";
import type { InstallMethod, InstallSkillCommand } from "../domain/skill.js";
import { createInstallPlans } from "../application/create-install-plan.js";
import { executeInstallPlansWithManifest } from "../application/execute-install-plan.js";
import type { InstallPlan } from "../application/install-skill.js";
import type { AtomicInstallResult } from "../infrastructure/filesystem/atomic-install.js";
import type { ManifestStore } from "../infrastructure/state/manifest-store.js";
import type { SkillSourceResolver } from "../infrastructure/sources/source-resolver.js";
import { getBundledSkillsDirectory } from "../infrastructure/sources/bundled-source.js";
import { selectAction } from "./action-menu.js";
import { selectAgents } from "./agent-selector.js";
import { defaultPromptRunner, type PromptRunner } from "./prompts.js";
import { selectSkills } from "./skill-selector.js";

export interface InteractiveWizardDependencies {
  readonly prompts?: PromptRunner;
  readonly resolver: SkillSourceResolver;
  readonly registry: AgentRegistry;
  readonly manifestStore?: ManifestStore;
  readonly homeDir?: string;
  readonly stateDir?: string;
  readonly source?: string;
  readonly execute?: (plans: Awaited<ReturnType<typeof createInstallPlans>>) => Promise<AtomicInstallResult>;
}

export type InteractiveWizardResult =
  | { readonly status: "cancelled" }
  | { readonly status: "installed"; readonly result: AtomicInstallResult };

export async function runInteractiveWizard(
  dependencies: InteractiveWizardDependencies,
): Promise<InteractiveWizardResult> {
  const prompts = dependencies.prompts ?? defaultPromptRunner;
  const action = await selectAction(prompts);
  if (action !== "install-skill") {
    throw new Error(`Unsupported action: ${action}`);
  }

  const source = dependencies.source ?? getBundledSkillsDirectory();
  const discovered = await dependencies.resolver.discover(source);
  const selectedSkills = await selectSkills(prompts, discovered);
  const selectedAgents = await selectAgents(prompts, dependencies.registry);
  const method = await prompts.select<InstallMethod>("请选择安装方式", [
    { name: "symlink（推荐）", value: "symlink" },
    { name: "copy（复制文件）", value: "copy" },
  ], "symlink");

  const command: InstallSkillCommand = {
    source,
    skillNames: selectedSkills.map((item) => item.skill.name),
    agents: selectedAgents,
    scope: "global",
    method,
    dryRun: false,
    force: false,
  };
  const plans = await createInstallPlans(command, dependencies.resolver, dependencies.registry, {
    homeDir: dependencies.homeDir,
    stateDir: dependencies.stateDir,
  });

  process.stderr.write(formatInteractiveInstallSummary(plans, method));
  const submitted = await prompts.confirm("提交安装？", false);
  if (!submitted) {
    return { status: "cancelled" };
  }

  const execute = dependencies.execute ?? ((installPlans) => {
    if (!dependencies.manifestStore) {
      throw new Error("manifestStore is required when using the default executor");
    }
    return executeInstallPlansWithManifest(installPlans, {
      stateDir: dependencies.stateDir ?? `${dependencies.homeDir ?? process.env.HOME ?? "."}/.libersum-cli`,
      method,
      dryRun: false,
      force: false,
      manifestStore: dependencies.manifestStore,
      installerVersion: "0.1.0",
    });
  });

  return { status: "installed", result: await execute(plans) };
}

export function formatInteractiveInstallSummary(
  plans: readonly InstallPlan[],
  method: InstallMethod,
): string {
  const skills = [...new Set(plans.map((plan) => plan.skill.name))].join(", ");
  const agents = [...new Map(
    plans.flatMap((plan) => plan.targets.map((target) => [target.agentId, target.agent.displayName] as const)),
  ).values()].join(", ");
  const targetCount = plans.reduce((count, plan) => count + plan.targets.length, 0);

  return `\n安装预览\n  Skill  ${skills}\n  Agent  ${agents}\n  方式   ${method}\n  目标   ${targetCount} 个安装位置\n`;
}
