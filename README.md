# libersum-cli

<p align="center">
  <img src="https://img.shields.io/badge/LiberSum99-E84A5F?style=flat-square&labelColor=1A1A2E" alt="LiberSum99 Spider Red" />
  <img src="https://img.shields.io/badge/AI%20%26%20Tools-2B7FD8?style=flat-square&labelColor=FEFCF6" alt="Technology Blue" />
  <img src="https://img.shields.io/badge/Explore-F4D758?style=flat-square&labelColor=FEFCF6" alt="Chip Yellow" />
</p>

`libersum-cli` 是 LiberSum99 的个人 Agent 工具宝典安装脚手架。

它把内置 Skill 安装到 Codex、Claude Code 或 Pi 的全局 Skill 目录中。

> 🕸️ 🕷 · AI · 连接 · 探索

## 内置 Skill

| Skill | 用途 |
| --- | --- |
| `analyze-project-architecture` | 基于项目文档和代码，输出简洁的中文架构、技术栈、场景、核心链路和竞品分析。 |
| `prepare-pr-mr` | 提交 PR/MR 前检查分支、改动、测试和敏感信息，并排除无关内容。 |
| `roguelike-game-design` | 设计和比较轻量肉鸽游戏的循环、房间、路线、构筑、奖励和成长系统。 |

Skill 源文件已随 CLI 发布包内置，使用者不需要先准备 `~/.codex/skills/`。

## 使用

交互安装：

```bash
npx libersum-cli
```

按向导选择 Skill 和 Agent，多选时使用 Space，使用 Enter 确认。
Skill 默认不选，完成选择后会先显示安装预览，提交确认后才执行安装。

直接安装：

```bash
npx libersum-cli skill install \
  --skill analyze-project-architecture \
  --agent codex \
  --yes
```

可重复传入 `--skill` 和 `--agent` 安装多个 Skill 或 Agent：

```bash
npx libersum-cli skill install \
  --skill analyze-project-architecture \
  --skill prepare-pr-mr \
  --skill roguelike-game-design \
  --agent codex \
  --agent claude-code \
  --agent pi \
  --yes \
  --format json
```

默认使用 symlink，也可以使用 `--copy`；执行前可用 `--dry-run` 预览安装计划。

支持的全局目录：

- Codex：`~/.codex/skills/`
- Claude Code：`~/.claude/skills/`
- Pi：`~/.pi/agent/skills/`

## 其他功能

也可以从本地目录或 GitHub 仓库安装外部 Skill：

```bash
npx libersum-cli skill install ./my-skills \
  --skill my-skill \
  --agent codex \
  --yes
```

查看 Agent 和本地安装状态：

```bash
npx libersum-cli agent list
npx libersum-cli doctor
```

## 本地开发

```bash
pnpm install
pnpm dev
pnpm check
```
