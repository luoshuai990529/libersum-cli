# Pressure Scenarios

These are behavior tests for the Skill. They are written before the Skill itself so a generic answer can be compared with the intended behavior.

## Scenario 1: Gameplay is not decided

**Prompt:**

> 我想做一个微信小游戏，轻量肉鸽，玩法还没想好。请给我一个可以两周做出原型的方案。

**Required behavior after the Skill exists:**

- State the default constraints: portrait, single-hand, node-based, 5–15 minute run, one core interaction.
- Compare at least three candidate loops rather than silently choosing one.
- Select one loop using explicit criteria: moment-to-moment feel, content cost, balance risk, touch suitability, and prototype time.
- Produce a first vertical-slice scope and a test question.
- Do not design a complete content catalog or promise procedural generation before the handcrafted loop is fun.

**Failure traps:**

- Writing a large GDD before choosing a core loop.
- Assuming an open-world or long campaign structure.
- Treating randomness as replayability without player agency.
- Giving book-summary prose without prototype acceptance criteria.

## Scenario 2: Economy and reward choice

**Prompt:**

> 每次战斗后给玩家三选一：强化当前武器、获得新武器、获得金币。怎么设计才不会出现“永远选金币”或“某个流派必胜”？

**Required behavior after the Skill exists:**

- Define the decision purpose and the resource sinks before assigning numbers.
- Separate run resources from meta-progression resources.
- Describe at least two viable strategies and the conditions under which each choice is valuable.
- Specify a simulation or spreadsheet test, plus a player-facing readability test.
- Guard against hard counters, dead rewards, and a single dominant strategy.

**Failure traps:**

- Inventing arbitrary values with no sink, source, or test.
- Calling all rewards equally useful without considering run context.
- Using meta-progression to hide a losing run.
- Claiming balance from simulation alone.

## Scenario 3: Low-budget visual and UI production

**Prompt:**

> 我只有一个美术，想做像素风轻量肉鸽。请列出第一版最小资源和 UI/动画方案。

**Required behavior after the Skill exists:**

- Recommend a constrained palette, silhouette-first design, reusable Tile/parts, and a small high-value animation set.
- Separate world, HUD, reward-choice, and modal layers.
- Include touch states, non-color-only status encoding, and feedback channels.
- Give a naming/folder/asset-budget rule and an acceptance check on a target phone.
- Do not invent a WeChat byte limit from the books; record platform limits as `[项目验收]` items with a live verification method.

**Failure traps:**

- Recommending a full production pipeline for a large console game.
- Listing dozens of unique characters and environments.
- Treating UI as decoration rather than information and feedback.
- Stating unsupported platform limits as facts.

## Scenario 4: First-minute feel specification

**Prompt:**

> 我想做一个轻量肉鸽，核心动作还在候选阶段。请为候选玩法比较并为选中的核心动作写第一分钟手感规格，要求覆盖输入、响应、空间/威胁上下文、动画、特效、镜头、声音、恢复和可测量指标。

**Required behavior after the Skill exists:**

- Compare at least three core-loop candidates before selecting one.
- Decompose the interaction into intent, input, response, context, polish, metaphor, and rules.
- Produce or fill `templates/feel-spec.md` with an event table and measurement plan.
- Distinguish project measurements from book principles; do not invent universal latency, FPS, or human-performance thresholds.
- Include a first-minute player test and a low-end fallback for feedback assets.

**Failure traps:**

- Calling animation, particles, camera shake, and sound “polish” without linking them to a player-facing event.
- Giving a single feedback number as a universal rule.
- Listing assets without input/response timing or recovery behavior.

## Scenario 5: Visual direction and asset handoff

**Prompt:**

> 我只有一个美术，要做低成本 2D 肉鸽。请从零建立视觉方向和第一版资产生产规范，要求能交付给美术和程序，并能在目标设备上验收。

**Required behavior after the Skill exists:**

- Produce or fill `templates/art-direction.md` with audience, player promise, vision board, negative references, visual hierarchy, shape language, palette, light, character model sheet, multistate assets, props, scope, and handoff.
- Separate concept decisions from runtime export and device acceptance.
- Define reusable asset layers and a small first-slice matrix.
- Include gameplay-size, thumbnail, low-brightness, and target-device readability checks.
- Do not infer engine limits or platform package limits from the art book.

**Failure traps:**

- Delivering only a mood board or color palette.
- Recommending unique assets for every enemy, room, and effect.
- Treating exact frame counts, atlas size, or memory limits as book facts.

## Scenario 6: Numerical model and review

**Prompt:**

> 每次战斗后给玩家三选一：强化当前构筑、获得新能力、获得资源。请建立一个可版本化的数值模型，覆盖准备、战斗、经济、复盘和模块化，并判断是否存在主导策略。

**Required behavior after the Skill exists:**

- Produce or fill `templates/numerical-model.md`.
- Separate parameters, formulas, data inputs, model dependencies, content versions, seeds, and experiments.
- Show source/sink/opportunity-cost ledgers and at least two viable routes.
- Define simulation cases for dominant strategy, dead reward, resource exhaustion, recovery, and hard counter.
- Compare model results with player choice and comprehension data.

**Failure traps:**

- Providing arbitrary probabilities or prices without assumptions.
- Treating a simulation win rate as proof that the game is fun or readable.
- Mixing run resources and meta progression.

## Scenario 7: Platform-neutral boundary

**Prompt:**

> 我想先做 Web 版本，之后可能移植到微信和抖音小游戏。请给出第一版肉鸽设计边界，不要把微信平台当作 Skill 的前提。

**Required behavior after the Skill exists:**

- Use a platform/profile field and keep shared design constraints separate from platform facts.
- Preserve short-run, low-cost, readable, reusable-content assumptions as `[设计默认]` unless supplied by the user.
- Mark package, API, performance, audio, monetization, and device claims `[项目验收]`, including object, method, pass criterion, and owner/time.
- Produce a profile-ready design brief rather than a WeChat-specific architecture.

**Failure traps:**

- Triggering only for WeChat wording.
- Inventing universal package or frame-rate limits.
- Removing mobile constraints entirely instead of making them configurable.
