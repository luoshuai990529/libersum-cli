import { test } from "node:test";
import assert from "node:assert/strict";
import { summarizeSkillDescription } from "../src/interaction/skill-summary.js";

test("uses concise summaries for bundled Skills", () => {
  assert.equal(
    summarizeSkillDescription(
      "analyze-project-architecture",
      "long source description",
    ),
    "输出简洁的中文项目架构分析与核心链路图",
  );
  assert.equal(
    summarizeSkillDescription("prepare-pr-mr", "long source description"),
    "整理代码改动并安全准备 GitHub PR/MR",
  );
  assert.equal(
    summarizeSkillDescription("roguelike-game-design", "long source description"),
    "设计和迭代轻量 Roguelike 游戏系统",
  );
  assert.equal(
    summarizeSkillDescription("wechat-article-compliance-review", "long source description"),
    "审核公众号文稿的导流、广告、版权与内容风险",
  );
});

test("normalizes and bounds external Skill descriptions to one line", () => {
  const summary = summarizeSkillDescription(
    "external-skill",
    "First line\nsecond line with a very long explanation that should be shortened.",
  );

  assert.equal(summary.includes("\n"), false);
  assert.equal(summary.length <= 64, true);
  assert.match(summary, /…$/);
});
