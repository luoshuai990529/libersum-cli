#!/usr/bin/env node

import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { Command } from "commander";
import { createInstallPlans } from "./application/create-install-plan.js";
import { executeInstallPlansWithManifest } from "./application/execute-install-plan.js";
import type { AgentRegistry } from "./domain/agent.js";
import type { InstallMethod, InstallSkillCommand } from "./domain/skill.js";
import { createDefaultAgentRegistry } from "./infrastructure/agents/agent-registry.js";
import { executeInstallPlans } from "./infrastructure/filesystem/atomic-install.js";
import { CompositeSkillSourceResolver } from "./infrastructure/sources/github-source.js";
import { getBundledSkillsDirectory } from "./infrastructure/sources/bundled-source.js";
import type { SkillSourceResolver } from "./infrastructure/sources/source-resolver.js";
import { JsonManifestStore } from "./infrastructure/state/json-manifest-store.js";
import type { ManifestStore } from "./infrastructure/state/manifest-store.js";
import { runInteractiveWizard } from "./interaction/wizard.js";
import { defaultPromptRunner } from "./interaction/prompts.js";
import { errorResponse, okResponse } from "./output/response.js";
import { renderResponse, resolveOutputFormat } from "./output/render.js";

const VERSION = "0.1.0";

export interface CliDependencies {
  readonly homeDir?: string;
  readonly registry?: AgentRegistry;
  readonly resolver?: SkillSourceResolver;
  readonly manifestStore?: ManifestStore;
}

export async function main(
  argv = process.argv.slice(2),
  dependencies: CliDependencies = {},
): Promise<number> {
  const homeDir = dependencies.homeDir ?? os.homedir();
  const stateDir = path.join(homeDir, ".libersum-cli");
  const bundledSource = getBundledSkillsDirectory();
  const registry = dependencies.registry ?? createDefaultAgentRegistry(homeDir);
  const resolver = dependencies.resolver ?? new CompositeSkillSourceResolver();
  const manifestStore = dependencies.manifestStore ?? new JsonManifestStore(path.join(stateDir, "manifest.json"));

  if (argv.length === 0 && process.stdin.isTTY && process.stdout.isTTY) {
    try {
      const result = await runInteractiveWizard({
        prompts: defaultPromptRunner,
        resolver,
        registry,
        manifestStore,
        homeDir,
        stateDir,
        source: bundledSource,
      });
      if (result.status === "cancelled") {
        process.stderr.write("已取消安装。\n");
      } else {
        process.stdout.write(`已安装 ${result.result.changedTargets.length} 个 Agent 目标。\n`);
      }
      return 0;
    } catch (error) {
      return reportError(error);
    }
  }

  if (argv.length === 0) {
    return reportError(new CliError("INTERACTIVE_REQUIRED", "当前环境不是 TTY，请使用 skill install 的显式参数。"));
  }

  const program = createProgram({ homeDir, stateDir, registry, resolver, manifestStore }, bundledSource);
  try {
    await program.parseAsync(["node", "libersum-cli", ...argv]);
    return 0;
  } catch (error) {
    return reportError(error);
  }
}

function createProgram(
  dependencies: Required<CliDependencies> & { stateDir: string },
  bundledSource: string,
): Command {
  const program = new Command();
  program
    .name("libersum-cli")
    .description("Install and manage Agent Skills for local AI coding agents.")
    .version(VERSION);

  const agentCommand = program.command("agent").description("Inspect supported Agents.");
  agentCommand
    .command("list")
    .description("List supported Agents and their global Skill directories.")
    .option("--format <format>", "Output format: json or table")
    .action((options: { format?: string }) => {
      const response = okResponse("agent.list", {
        agents: dependencies.registry.list().map((agent) => ({
          id: agent.id,
          displayName: agent.displayName,
          globalSkillDir: agent.globalSkillDir,
          directoryExists: existsSync(agent.globalSkillDir),
        })),
      });
      renderResponse(response, resolveOutputFormat(options.format));
    });

  program
    .command("doctor")
    .description("Check local Agent Skill directories without changing files.")
    .option("--format <format>", "Output format: json or table")
    .action(async (options: { format?: string }) => {
      const response = okResponse("doctor", {
        homeDir: dependencies.homeDir,
        stateDir: dependencies.stateDir,
        agents: dependencies.registry.list().map((agent) => ({
          id: agent.id,
          globalSkillDir: agent.globalSkillDir,
          directoryExists: existsSync(agent.globalSkillDir),
        })),
        installedSkills: await dependencies.manifestStore.list(),
      });
      renderResponse(response, resolveOutputFormat(options.format));
    });

  const skillCommand = program.command("skill").description("Discover and install Skills.");
  skillCommand
    .command("install [source]")
    .description("Install built-in or external Skills to selected Agents.")
    .option("--skill <name>", "Skill name; repeat for multiple Skills", collect, [])
    .option("--agent <agent>", "Agent ID; repeat for multiple Agents", collect, [])
    .option("--copy", "Copy the Skill instead of creating symlinks")
    .option("--dry-run", "Show the installation plan without writing files")
    .option("--force", "Replace existing unmanaged targets")
    .option("--yes", "Skip the confirmation prompt")
    .option("--format <format>", "Output format: json or table")
    .action(async (source: string | undefined, options: InstallOptions) => {
      const effectiveSource = source ?? bundledSource;
      if (!options.yes && !process.stdin.isTTY) {
        throw new CliError("CONFIRMATION_REQUIRED", "非交互安装必须显式提供 --yes。 ");
      }
      if (!process.stdin.isTTY && options.agent.length === 0) {
        throw new CliError("AGENT_REQUIRED", "非交互安装必须至少提供一个 --agent。 ");
      }

      const method: InstallMethod = options.copy ? "copy" : "symlink";
      const command: InstallSkillCommand = {
        source: effectiveSource,
        skillNames: options.skill,
        agents: options.agent,
        scope: "global",
        method,
        dryRun: Boolean(options.dryRun),
        force: Boolean(options.force),
      };
      const plans = await createInstallPlans(command, dependencies.resolver, dependencies.registry, {
        homeDir: dependencies.homeDir,
        stateDir: dependencies.stateDir,
      });

      if (!options.yes && process.stdin.isTTY) {
        process.stderr.write(formatInstallSummary(plans, method));
        const confirmed = await defaultPromptRunner.confirm("确认安装？", true);
        if (!confirmed) {
          process.stderr.write("已取消安装。\n");
          return;
        }
      }

      const result = await executeInstallPlansWithManifest(plans, {
        stateDir: dependencies.stateDir,
        method,
        dryRun: Boolean(options.dryRun),
        force: Boolean(options.force),
        manifestStore: dependencies.manifestStore,
        installerVersion: VERSION,
      });
      renderResponse(okResponse("skill.install", {
        dryRun: Boolean(options.dryRun),
        skills: plans.map((plan) => plan.skill.name),
        agents: [...new Set(plans.flatMap((plan) => plan.targets.map((target) => target.agentId)))],
        changedTargets: result.changedTargets,
        warnings: result.warnings,
      }), resolveOutputFormat(options.format));
    });

  return program;
}

interface InstallOptions {
  readonly skill: string[];
  readonly agent: string[];
  readonly copy?: boolean;
  readonly dryRun?: boolean;
  readonly force?: boolean;
  readonly yes?: boolean;
  readonly format?: string;
}

class CliError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
  }
}

function collect(value: string, previous: string[]): string[] {
  return [...previous, value];
}

function formatInstallSummary(
  plans: Awaited<ReturnType<typeof createInstallPlans>>,
  method: InstallMethod,
): string {
  const skills = plans.map((plan) => plan.skill.name).join(", ");
  const agents = [...new Set(plans.flatMap((plan) => plan.targets.map((target) => target.agent.displayName)))].join(", ");
  return `\n安装摘要\n  Skill: ${skills}\n  Agent: ${agents}\n  方式: ${method}\n`;
}

function reportError(error: unknown): number {
  if (error instanceof Error && error.name === "ExitPromptError") {
    process.stderr.write("已取消操作。\n");
    return 130;
  }
  const code = error instanceof CliError ? error.code : "COMMAND_FAILED";
  const message = error instanceof Error ? error.message : String(error);
  renderResponse(errorResponse(code, message), "json");
  return 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((exitCode) => {
    process.exitCode = exitCode;
  });
}
