const bundledSummaries: Readonly<Record<string, string>> = {
  "analyze-project-architecture": "输出简洁的中文项目架构分析与核心链路图",
  "prepare-pr-mr": "整理代码改动并安全准备 GitHub PR/MR",
  "roguelike-game-design": "设计和迭代轻量 Roguelike 游戏系统",
};

const MAX_SUMMARY_LENGTH = 64;

export function summarizeSkillDescription(name: string, description: string): string {
  const bundledSummary = bundledSummaries[name];
  if (bundledSummary) {
    return bundledSummary;
  }

  const normalized = description.replace(/\s+/gu, " ").trim();
  if (normalized.length <= MAX_SUMMARY_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_SUMMARY_LENGTH - 1).trimEnd()}…`;
}
