# libersum-cli

<p align="center">
  <img src="https://img.shields.io/badge/LiberSum99-E84A5F?style=flat-square&labelColor=1A1A2E" alt="LiberSum99 Spider Red" />
  <img src="https://img.shields.io/badge/AI%20%26%20Tools-2B7FD8?style=flat-square&labelColor=FEFCF6" alt="Technology Blue" />
  <img src="https://img.shields.io/badge/Explore-F4D758?style=flat-square&labelColor=FEFCF6" alt="Chip Yellow" />
</p>

`libersum-cli` 是 LiberSum99 的个人 Agent 工具宝典安装脚手架，负责把常用 Skill 安装到本地 Agent（Claude Code、Codex、Pi）。

> 🕸️ 🕷 · AI · 连接 · 探索

## 当前可安装 Skill

个人 Skill 目录：`~/.codex/skills/`

- `analyze-project-architecture/`：读取项目文档和核心代码，输出简洁的中文架构分析，涵盖技术栈、使用场景、核心链路时序图和竞品/替代方案
- `prepare-pr-mr/`：在提交或创建 PR/MR 前核验分支、改动范围、测试和敏感信息，排除无关文档并生成中文提交说明
- `roguelike-game-design/`：设计和比较轻量肉鸽游戏的核心循环、房间、路线、构筑、奖励、成长、失败循环与低成本内容方案

## 使用

交互模式：

```bash
npx libersum-cli
```

通过向导选择操作、Skill、Agent 和安装方式；多选时使用 Space，使用 Enter 确认。

非交互模式：

```bash
npx libersum-cli skill install ~/.codex/skills/roguelike-game-design \
  --skill roguelike-game-design \
  --agent claude-code \
  --agent codex \
  --agent pi \
  --yes \
  --format json
```

本地开发：

```bash
pnpm install
pnpm dev
```

## 当前功能

- 交互式安装 Skill
- 支持本地目录和 GitHub 来源
- 支持多选 Skill 与 Agent
- 支持 Claude Code、Codex、Pi
- 支持 symlink、copy、dry-run、force 和 JSON 输出
- 自动校验 `SKILL.md`、检测冲突并记录安装状态
