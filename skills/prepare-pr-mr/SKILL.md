---
name: prepare-pr-mr
description: Use only when the user explicitly asks to create a GitLab merge request (MR), including 开 MR, 提 MR, or 创建 Draft MR.
---

# 创建 GitLab Draft MR

用户明确要求创建 GitLab MR 时执行这条流程。单独提交代码、起草正文、审查代码和创建 GitHub PR 各自按原任务处理。

唯一需要用户介入的情况是缺少本次 MR 的目标分支。目标明确后，自行完成准备、推送、创建和审查。遇到问题先尝试安全的恢复或替代路径，确实无法继续时说明已完成的步骤和具体阻塞。

## 1. 确认目标

- 使用用户为本次 MR 指定的目标分支。缺少目标时直接问「这次 MR 要合到哪个分支？」。默认分支、upstream 和现有 MR 可提供候选，用户回答后再执行 rebase、暂存、提交或推送。
- 核对当前仓库、worktree、源分支、GitLab 目标项目和推送 remote。跨 fork 时用 Git 和 GitLab 信息核实源、目标项目。使用可写的功能分支作为源分支。在目标分支或 detached HEAD 上时，从明确的提交点建立功能分支。已有 Git 操作正在进行时，保留现场，能隔离本次工作时使用独立 worktree。
- 读取仓库适用于本次改动的工程文档。用 `git status --short --branch`、暂存和工作区 diff、未跟踪文件列表确认要保留的状态。

## 2. Rebase 到远端目标分支

- Fetch 指定的目标分支，记录取得的目标 SHA。检查源分支已有提交的范围。如果夹有无关提交，先把能确定属于本次 MR 的提交隔离到专用源分支。若无法确认隔离后仍包含完整改动，保留原分支并报告阻塞。
- 工作区有未提交内容时，先完整保存暂存、未暂存和未跟踪文件，再 rebase。使用 `git stash push --include-untracked` 时记录自己创建的条目的 SHA，完成 rebase 后用 `git stash apply --index <stash-sha>` 恢复。核对状态和文件后，只清理本次创建的快照。无法可靠保存时，保护现场并报告阻塞。
- 将功能分支 rebase 到该目标 SHA，再恢复保存的改动。根据本次需求、测试和目标分支上的现有行为解决两步中出现的冲突。若取舍会改变需求且缺少依据，保留可恢复状态，报告冲突文件和无法安全继续的原因。
- 进入下一步前，用 `git merge-base --is-ancestor <target-sha> HEAD` 验证基线，并确认 rebase 已结束、无未解决冲突、原有未提交内容已恢复。

## 3. 准备提交和 MR 正文

- 检查目标 SHA 到 `HEAD` 的 diff、已有提交和待提交文件，确保 MR 只包含本次改动。按路径或补丁暂存相关内容，保留其他本地改动及其暂存状态。无关内容已暂存时，只有目标文件整份属于本次 MR 才用 `git commit --only -- <paths>`。需提交部分补丁时，先隔离对应补丁，无法可靠隔离时保留现状并报告阻塞。真实凭据和仅适用于本机的调试配置留在提交范围之外。
- 如需新提交，先检查本次将提交的 diff，并按仓库规范写 commit message。已有提交覆盖本次改动时，直接使用。完成后用最终 diff 和 `git diff --check <target-sha>...HEAD` 核对范围。diff 为空时，告知用户没有可创建 MR 的改动。按仓库要求执行与改动直接相关的检查。本地无关改动会影响检查结果时，在最终提交的干净 checkout 中验证。
- 根据最终 diff 和实际测试结果写中文 MR 正文。依次使用四个二级标题：`背景` 说明用户遇到的问题，`修改内容` 用 `1.`、`2.`、`3.` 这样的有序列表逐条写关键变更，`影响模块` 写到具体功能或接口，`测试覆盖` 说明实际命令、覆盖点、结果和有影响的未验证项。每条只讲一件事，用团队熟悉的词。

## 4. 推送并创建 Draft MR

- 推送前核对远端源分支和关联的开放 MR。如果推送无法快进，或会改动本次 Draft 之外的 MR，从已验证的提交新建一个未被占用的专用源分支，再继续正常推送。用户明确限定源分支且无法安全推送时，报告具体阻塞。
- 正常推送指定远端和源分支，例如 `git push "$push_remote" HEAD:"refs/heads/$source_branch"`。推送成功后，如有相同源、目标的开放 Draft，直接复用现有 MR 和正文。如无，则用 `glab mr create --draft --yes --repo "$target_project" --source-branch "$source_branch" --target-branch "$target_branch" --title "$title" --description-file "$body_file"` 创建 Draft，跨 fork 时补 `--head` 指定源项目。优先使用当前工具支持的文件或结构化参数传入正文。
- 从 GitLab 核实 URL、Draft 状态、源与目标项目和分支，确认 MR head SHA 等于本次推送的 SHA。若命令结果不明，先读取远端分支和现有 MR 状态，再决定是否重试。

## 5. 让子 agent 审查本次 MR

- 默认派一名只读子 agent，等待它完成。提供实际 MR 地址、GitLab 返回的 diff base/head SHA 和改动文件、适用的工程文档入口，以及本次变更意图。用这组 SHA 固定审查范围，优先用对应的完整 diff。GitLab 正在生成 diff 时短暂重查；若仍拿不到完整范围，或 diff head 与推送的 SHA 不一致，报告审查阻塞及原因。
- 审查本次 diff 引入的回归风险、功能阻塞、可说明触发条件的性能问题，以及违反明确工程文档规范的地方。可沿调用链读少量上下文来验证影响。只报告有文件位置、触发条件和实际影响的可行动发现。约定不明确的风格偏好、无关存量问题和纯假设风险到此为止。
- 主 agent 核对 findings 与对应 diff，合并重复项。审查结果写在当前对话中。子 agent 不可用时，说明实际状态；若主 agent 完成了同范围的审查，明确注明。

## 6. 交付

第一行给出可点击的 Draft MR 地址及源 → 目标分支。随后写 `Code review`，按影响从高到低列问题，每条包含严重程度、文件和行号、触发条件、影响以及建议。没有有效发现时写「在本次 MR diff 中未发现需要处理的问题」。审查未完成时，给出已核实的 MR 链接和具体阻塞。

## 示例

以下为同一个虚构场景。实际输出使用本次 MR 的内容、测试证据和审查结果。

### Draft MR 正文

```markdown
## 背景

归档项目列表翻页时会丢掉搜索词，第二页开始可能混入无关项目。

## 修改内容

1. 翻页时读取当前生效的搜索词。
2. 请求列表接口时同时传入搜索词和分页游标。
3. 没有搜索词时沿用原有的分页请求。

## 影响模块

归档项目列表的搜索和分页。

## 测试覆盖

`pnpm vitest run src/projects/archive-list.test.ts` 通过，覆盖带搜索词翻页和无搜索词的普通分页。未执行浏览器端到端测试。
```

### 最终报告

```markdown
Draft MR [!42 修复归档项目搜索后翻页丢失筛选条件](https://gitlab.example.com/acme/portal/-/merge_requests/42) · `fix/archive-search-pagination` → `dev`

**Code review · 1 项发现**

- **[P2] 修改搜索词时沿用了旧游标** · `src/projects/archive-list.ts:87`
  在第 2 页输入新搜索词时，请求会从旧查询的游标位置继续读取，可能跳过新查询的首批结果。建议在搜索词变化时清空游标，并补一条覆盖该操作的测试。
```
