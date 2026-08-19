---
name: analyze-project-architecture
description: Use when a repository needs a concise Chinese architecture analysis covering its overview, tech stack, usage scenarios, core-module sequence diagrams, or competitor and alternative research, especially when evidence is split across project docs and source code.
---

# 项目架构分析

## 目标

根据项目已有文档和必要的工程代码，生成一份短而有证据的中文架构分析。默认交付 Markdown 报告和一张核心链路时序图；不要把推断写成事实，也不要用完整依赖清单淹没读者。

**必须遵守：** 用户指定的输出目录、语言和范围优先于本 Skill 的默认值。

## 工作流

### 1. 建立证据边界

先确认项目根目录、当前分支或 commit、分析日期和用户关注的模块。按以下顺序取证：

1. README、`docs/`、ADR、设计文档和 API 文档；
2. `package.json`、`pyproject.toml`、`go.mod`、`Cargo.toml`、`pom.xml` 等包管理文件；
3. Docker/Compose、部署清单、CI 配置、环境示例和数据库迁移；
4. 入口路由、服务/use-case、数据访问、队列/任务和外部服务代码。

用 `[文档]`、`[代码]`、`[推断]`、`[待确认]` 标记证据等级，并在重要结论后附来源路径。文档与代码冲突时并列说明，不自行选择一个“看起来更合理”的版本。

如果项目没有 Git 信息、文档缺失或入口不明确，直接写出缺口；不要填充猜测。

### 2. 输出项目概览和使用场景

按固定顺序写报告，默认控制在一两页内：

```markdown
# 项目架构分析

## 1. 项目简介与技术栈
一句话定位；用少量条目说明语言/框架、运行时、存储、部署和关键基础设施。

## 2. 使用场景
列出 2–3 个通俗场景。优先引用文档；文档不足时，从真实入口和主业务函数推导，并标注 [代码] 或 [推断]。

## 3. 核心模块与时序图
说明为什么选择该模块，列出主链路和图文件路径。

## 4. 竞品或替代方案
先给结论，再给少量直接竞品、相邻方案或替代方式及比较维度。

## 5. 证据边界与待确认项
只列会影响架构判断的版本、依赖、部署、安全、数据、可观测性或故障风险。
```

项目简介只保留读者需要建立心智模型的信息；技术栈按“语言/框架 → 运行方式 → 数据与外部依赖”归纳，不复制完整依赖表。使用场景要解释“谁在什么情况下，用它完成什么事”，避免堆叠抽象名词。

### 3. 选择核心模块并绘制时序图

选择标准按以下优先级排列：用户明确指定的功能、项目最主要的业务价值、能串起入口到结果的最短真实调用链。只画一条主链路，不画全系统地图。

**必须绘制时序图，不要误画成普通架构框图：**

- 参与者控制在 4–8 个，消息控制在 5–10 条；使用中文动作标签；
- 至少包含入口、核心模块、关键数据/外部服务和成功结果；确有证据时再加入失败分支；
- 核心模块用蓝色重点标记，主链路用另一种高对比色，数据存储/外部服务用独立语义色，并放置简短图例；
- 采用单向、低交叉布局，避免长句、重复箭头和无证据的内部细节；
- 每个参与者和关键消息都能回溯到文档、入口文件、类/函数或 API。

**图示工具：**

1. **REQUIRED SUB-SKILL:** 必须使用 `archify` 生成图，不使用 Excalidraw 或 Mermaid 作为默认方案；
2. 默认核心链路使用 Archify 的 `sequence` 类型；用户明确要求系统组件、基础设施或部署架构图时，使用 `architecture` 类型；
3. 按 Archify 的 schema 和 example 创建全新的 JSON 规格，不能把项目事实直接套入示例内容；读者可见文字必须使用中文，但产品名、代码标识、命令、协议和 API 路径保持原文。

必须完成“生成 JSON 规格 → `validate` → `deliver` → `visual-check` → 查看截图并修复”的闭环。最终 `validate` 必须达到 Archify 的 showcase 质量要求：9/9 artifact checks、0 composition errors、0 warnings；`deliver` 和 `visual-check` 任一失败都不能声称图已交付。`visual-check` 的 `visualReview: pending` 仍需要人工查看截图，确认无裁切、重叠、溢出、文字不可读或箭头穿框。图文件与报告放在用户指定目录；未指定时沿用项目已有文档目录，否则使用 `docs/architecture/`。默认交付 Archify JSON 规格和独立 HTML；只有用户要求图片时才额外导出 PNG/SVG。

命令中的 `<archify-skill-root>` 指当前可用的 `archify` skill 目录：

```bash
node <archify-skill-root>/bin/archify.mjs validate sequence <spec>.json --quality showcase --json
node <archify-skill-root>/bin/archify.mjs deliver sequence <spec>.json <output>.html --quality showcase --json
node <archify-skill-root>/bin/archify.mjs visual-check <output>.html --json
```

### 4. 描述竞品和替代方案

先搜索项目文档中的“竞品、对比、替代、生态、兼容性、为什么选择”等信息。文档已有可靠内容时，优先据此输出，不为增加数量而联网搜索。

只有文档没有合适例子、用户明确要求最新竞品，或需要验证当前生态时，才搜索 GitHub。记录检索日期和来源链接；star 数只作为热度线索，不作为质量结论。至少比较：目标用户/定位、核心使用场景、主链路、部署方式、扩展性或生态。将结果分为“直接竞品、相邻方案、替代方式”；没有证据时写“未发现可确认的直接竞品”。

### 5. 做最终检查

交付前逐项确认：

- [ ] 项目简介和技术栈短且一眼可读；
- [ ] 使用场景来自文档或明确标记为代码推断；
- [ ] 核心模块选择有理由，时序图是中文、简洁、低交叉且突出主链路；
- [ ] Archify JSON 规格通过 showcase 校验，HTML 已 deliver，并完成截图视觉检查；
- [ ] 竞品结论有项目文档或 GitHub 来源，并标注时间边界；
- [ ] 版本基准、外部依赖、主要风险和未知项没有被隐去；
- [ ] 报告没有把完整代码、依赖清单或无关历史复制进去。

## 常见错误

- 只读 README 就下结论：继续查入口、服务、数据和部署路径；
- 把技术栈罗列当成架构分析：解释组件之间如何形成主链路；
- 用代码推断冒充产品场景：标记 `[代码]` 或 `[推断]`，并用通俗语言解释；
- 画成全系统大图：回到一个核心模块和一条主链路；
- 只生成 Archify JSON 或只执行 validate：继续执行 deliver、visual-check，并实际查看截图；
- 竞品只报 star：补充定位、场景、链路和部署差异，并标注检索日期。
