# libersum-cli

<p align="center">
  <img src="https://img.shields.io/badge/LiberSum99-E84A5F?style=flat-square&labelColor=1A1A2E" alt="LiberSum99 Spider Red" />
  <img src="https://img.shields.io/badge/AI%20%26%20Tools-2B7FD8?style=flat-square&labelColor=FEFCF6" alt="Technology Blue" />
  <img src="https://img.shields.io/badge/Explore-F4D758?style=flat-square&labelColor=FEFCF6" alt="Chip Yellow" />
</p>

`libersum-cli` 是一个将 Agent Skill 安装到本地 Agent（Claude Code、Codex、Pi）的 CLI。

> 🕸️ 🕷 · AI · 连接 · 探索

## 使用

交互模式：

```bash
npx libersum-cli
```

通过向导选择操作、Skill、Agent 和安装方式；多选时使用 Space，使用 Enter 确认。

非交互模式：

```bash
npx libersum-cli skill install ./skills \
  --skill analyze-project-architecture \
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
