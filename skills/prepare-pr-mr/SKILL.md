---
name: prepare-pr-mr
description: Use when preparing local code for a commit, GitHub Pull Request, or GitLab Merge Request, especially when commit history may need review or squash, the target branch must be fetched safely, or unrelated Markdown plans and local debug hardcode must be excluded.
---

# Prepare PR/MR

## Overview

审查当前 Git worktree、提交历史和改动范围，形成只包含本次功能或修复的干净提交，并生成中文 PR/MR 描述。把 `push`、创建 PR/MR 和远程历史改写作为独立门禁；没有证据时停止，不用“先发出去再整理”替代检查。

## 工作模式

根据用户意图选择模式；不明确时先执行 `review`，不要直接发布。

- `review`：只读核验 worktree、目标分支、commit tree、diff、范围风险和测试缺口。
- `prepare`：在范围确认后整理暂存区、创建本地 commit、生成中文 PR/MR 描述；不 push、不创建 PR/MR。
- `submit`：在 `prepare` 证据完整且用户明确确认后 push、创建 Draft PR/MR，并检查远程结果。

## 1. 建立安全基线

先确认实际 checkout，不把用户的文字描述当作 Git 事实：

```bash
git rev-parse --show-toplevel
git branch --show-current
git status --short --branch
git worktree list
git remote -v
git log -1 --oneline --decorate
```

立即停止并报告以下情况：detached HEAD、当前分支是目标分支或受保护分支、不是预期 worktree、存在无法区分归属的混合改动、没有 Git 仓库，或远程信息不足以安全发布。

保存并分别查看三类状态：

```bash
git diff --stat
git diff --cached --stat
git ls-files --others --exclude-standard
```

不要自动执行 `git reset --hard`、`git clean`、删除分支、丢弃 stash 或自动 stash。不要用 `git add .`、`git add -A` 或 `git commit -a` 处理混合工作树；只对确认属于本次功能的明确路径执行 `git add -- <paths>` 或 `git add -p`。

## 2. 确定目标分支并安全 fetch

按以下顺序确定目标分支：

1. 用户明确指定的目标分支。
2. 当前已有 PR/MR 的 base/target branch。
3. 当前分支的 upstream 对应的目标分支。
4. 远程仓库声明的默认分支。

如果有多个候选、只有本地 `main` 但没有远程证据，或用户只说“直接发出去”，停止并询问；不能凭习惯默认 `main`。

识别远程平台和目标引用后，只更新远程引用，不自动合并：

```bash
git ls-remote --exit-code --heads <remote> <target-branch>
git fetch --no-tags <remote> <target-branch>:refs/remotes/<remote>/<target-branch>
```

记录 fetch 前后的目标 SHA。fetch 后重新检查当前分支和工作树。如果目标分支在审查或测试期间发生变化，重新计算 merge-base、diff、commit 审查和测试范围。

## 3. 审查改动范围

需要同时检查工作树改动和相对目标分支的提交范围：

```bash
git diff --name-status <remote>/<target-branch>...HEAD
git diff --stat <remote>/<target-branch>...HEAD
git diff --check <remote>/<target-branch>...HEAD
git log --reverse --format='%h %an %ad %s' --date=short <remote>/<target-branch>..HEAD
git show --stat --oneline <commit>
```

先取得本次功能或修复的意图：用户描述、issue、需求、已有 PR/MR 说明或代码中清晰可验证的功能边界。意图不明确且 diff 不能自解释时，列出“需要确认”的文件，不把猜测写成影响范围。

将每个变更分类为：

- **明确相关**：实现、测试、必要配置、必要文档和迁移。
- **明确无关**：与本次功能无关的计划/方案/临时 Markdown、个人笔记、生成图表、调试脚本。
- **需要确认**：可能是功能契约、测试 fixture、兼容性配置或发布资料的文档/配置。

明确无关的文件不能进入提交。不能为了“干净”擅自删除用户文件；优先从暂存区排除，若已在历史中则提出清理历史的方案并等待确认。

检查本地调试和疑似敏感值时结合上下文，不进行机械误报。重点核验：

- 本机绝对路径、`localhost`、临时端口、临时 socket、个人目录。
- 调试开关、注释掉的临时代码、`debug`/`scratch`/`temp` 文件。
- token、API key、密码、私钥、真实凭据或看起来像凭据的硬编码值。

测试 fixture、示例配置、平台兼容代码只有在能说明用途且不含真实凭据时才可保留。疑似真实凭据时停止提交，并提示轮换/撤销，不把值复制进终端输出或 PR/MR 描述。不要未经用户授权运行不受信任的第三方安全扫描器。

## 4. Agent 审查 commit tree 和 squash

必须提供独立的 commit 审查结果，至少覆盖：提交顺序、每个 commit 的功能边界、空提交、`wip`/`fix review`/`address comment`、重复修复、跨功能混合和 merge commit。

如果有多 Agent 能力，派一个只读 reviewer，只给它原始 Git 证据和目标，不给预设结论；主 Agent 复核其输出。没有多 Agent 能力时，先完成一次“范围/历史审查”，再用另一遍“发布安全审查”复核，明确标记为单 Agent 双角色。

按以下规则提出 squash 建议：

- 同一功能内的实现、测试和紧随其后的 review 修补可合并。
- 空提交、纯 typo、重复修复、`wip` 提交通常应合入相邻功能提交。
- 不同功能、不同风险或不同发布目的必须保留为独立提交。
- 非当前用户或非当前 feature 分支产生的提交、共享分支提交和无法确认归属的 merge commit 不自动改写。

未经明确确认，不执行 rebase、reset、commit 历史重写或远程强制推送。确认后优先使用交互式 rebase，并在完成后重新检查 diff、commit tree 和测试；不要用 `git reset --soft <target>` 把未经审查的历史一键打包。

已发布分支如必须改写，先 fetch 并记录远程旧 SHA，确认远程没有新提交，再使用带期望旧 SHA 的 `--force-with-lease`。远程分支发生分叉、包含他人提交或 lease 不匹配时停止，不能改用裸 `--force`。

## 5. 测试、commit 和证据

从仓库的 `AGENTS.md`、`CONTRIBUTING.md`、CI 配置、项目脚本和已变更模块确定测试命令；优先运行与改动直接相关的 lint、typecheck、单元测试和集成测试。不要把“测试以后再说”当作完成条件，也不要安装依赖或运行大范围命令而不说明成本。

记录每个真实执行的命令、范围和结果：通过、失败、未执行、环境阻塞分别列出。命令成功不等于 CI 成功；只有实际读取到远程检查结果才能报告 CI 状态。

提交前必须再次确认：

```bash
git diff --cached --check
git diff --cached --name-status
git status --short --branch
```

只提交已确认路径。遵循仓库已有的 commit 标题规范；除非用户另有要求，不为了中文 PR/MR 描述强行改变 commit 标题语言。不要使用 `--no-verify` 绕过 hooks；hook 失败时修复问题或报告阻塞。

commit 后再次检查 `git show --stat --oneline HEAD`、目标分支 diff、工作树和测试结果。任何测试、格式化或生成步骤改变了文件，都要重新分类并复核暂存范围。

## 6. 生成中文 PR/MR 描述

正文固定只使用以下三块，每条提炼一个核心要点，不写未经验证的推测：

```markdown
## 改动范围
- [文件/模块]：完成什么实现或修复。
- [必要配置/迁移/测试]：为什么属于本次提交。

## 影响功能范围
- [用户功能/接口/后台任务/部署行为]：影响是什么。
- [兼容性或风险]：只有有证据时填写；没有则写“未发现额外影响”。

## 测试覆盖情况
- 通过：`<实际命令>`，覆盖 `<范围>`。
- 失败：`<实际命令>`，失败原因 `<事实>`。
- 未执行：`<实际命令或范围>`，原因 `<事实>`。
- CI：仅在实际检查结果存在时填写；否则写“待远程 CI 执行”。
```

不要加入无关计划 Markdown、个人笔记、调试 hardcode、未确认的影响、虚构 issue 链接、虚构 reviewer、虚构测试或本地绝对路径。发现 blocker 时不要生成“看起来可以合并”的正文；先报告 blocker 和证据。

## 7. 受控 push 和创建 PR/MR

发布前明确展示并请求确认：当前仓库、当前分支、目标远程/分支、最终 commit、提交文件范围、是否 squash、是否需要 `--force-with-lease`、测试/CI 状态和 PR/MR 是否 Draft。

确认后再次获取远程 feature 分支旧 SHA，并检查目标分支没有变化。正常发布使用：

```bash
git push <remote> HEAD:<feature-branch>
```

历史改写只使用：

```bash
git push --force-with-lease=<feature-branch>:<expected-old-sha> <remote> HEAD:<feature-branch>
```

根据 remote URL 判断平台：

- GitHub：使用 `gh pr create --draft --base <target-branch> --head <feature-branch> --title <title> --body-file <body-file>`。
- GitLab：使用 `glab mr create --draft --target-branch <target-branch> --source-branch <feature-branch> --title <title> --description <body>`，如版本参数不同先查看 `glab mr create --help`。

如果 remote 不是 GitHub/GitLab、认证失败、CLI 不存在或无法确认 fork/head，停止实际创建，只输出待执行命令和缺少的前置条件。默认创建 Draft；Ready for review、自动添加 reviewer/label/milestone 需要额外确认。创建后读取 PR/MR URL、base/source、文件范围和初始检查状态；没有读取到就写“未验证”，不能声称已创建或 CI 通过。

## 快速门禁

提交或发布前逐项回答“是”才能继续：

| 门禁 | 证据 |
| --- | --- |
| 目标唯一且远程已 fetch | 目标分支 SHA 和 fetch 输出 |
| 当前 worktree/branch 正确 | `git rev-parse`、`git branch`、`git worktree list` |
| 改动只属于本次功能 | 分类后的 name-status 和用户意图 |
| commit 粒度清晰 | commit tree 审查和 squash 决策 |
| 暂存区干净 | cached diff、`git diff --check`、明确路径 |
| 测试事实完整 | 实际命令和结果 |
| 发布动作已确认 | 用户确认内容和最终 SHA |
| 远程结果已验证 | push 输出、PR/MR 元数据和检查状态 |

任一项为“否”或“未知”时停止，不用“问题不大”“先发再说”“force-with-lease 已经安全”“测试之后补”绕过门禁。规则的文字和精神都必须遵守。

## 常见错误与修正

| 诱因 | 正确处理 |
| --- | --- |
| “负责人很急，先发出去” | 先给最小证据报告；时间压力不扩大提交范围。 |
| “直接 `git add .` 最快” | 只 add 明确相关路径；混合工作树先分类。 |
| “用 `reset --soft` 一次 squash” | 先审查每个 commit，再经确认交互式 rebase。 |
| “`--force-with-lease` 可以随便覆盖” | lease 只保护远程指针，不保证内容正确；远程分叉就停止。 |
| “测试以后再补” | PR/MR 诚实标记未执行，必要测试通过前不宣称可合并。 |
| “没有目标分支就用 main” | 从远程事实确定；无法唯一确定就询问。 |
| “PR 已创建，CI 应该会通过” | 读取真实 PR/MR 和 CI 结果，否则标记未验证。 |

## Red Flags：立即停止

- 准备执行 `git add .`、`git add -A` 或 `git commit -a`。
- 准备执行 `git commit --no-verify`、裸 `--force`、`reset --hard` 或 `clean`。
- 目标分支、remote、功能意图或提交归属仍靠猜测。
- diff 中出现无关计划文档、本地 debug hardcode、疑似凭据或个人路径。
- 只看 `git status clean`，没有看相对目标分支的 diff。
- 只因为用户着急就跳过 fetch、commit 审查或测试证据。
- 没有实际命令输出却准备写“测试通过”“CI 通过”“PR/MR 已创建”。
