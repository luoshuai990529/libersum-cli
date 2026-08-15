# Skill Results

## First GREEN run

The agent loaded `SKILL.md` and answered all three pressure scenarios. It successfully:

- constrained the proposal to a short, node-based, single-hand prototype;
- separated must-build items from premature systems;
- included a test question, acceptance criteria, and explicit platform `[项目验收]` items;
- treated currency as a situational flexibility resource rather than an automatically superior reward;
- separated run and meta resources;
- supplied UI layers, touch/feedback states, low-cost pixel assets, and a small animation list;
- preserved the incomplete-source boundary for procedural generation and platform limits.

## Loopholes found

- The agent selected an action/auto-battle shape without displaying the required three-candidate score table.
- The economy section described sources and sinks conceptually but did not always show a concrete ledger or simulation inputs.
- Asset maintainability was mentioned, but a concrete source/runtime naming rule was not shown.
- Some book-principle labels referred to the Skill or source map rather than naming the local book file and chapter.

## Refactor applied

`SKILL.md` and `references/evidence-policy.md` now require the comparison table, concrete economy ledger and simulation inputs, explicit asset naming/export rules, and file/chapter-qualified book labels. A second regression run is required after this refactor.

## Second GREEN run

The regression agent loaded the refactored Skill and satisfied the new requirements:

- It displayed a four-row candidate-loop comparison and selected one with a stated trade-off.
- It showed a concrete currency ledger with source, sink, conversion, and trade, plus simulation inputs and player-readability checks.
- It supplied source/runtime asset naming examples, atlas grouping, export rules, and target-device acceptance items.
- It used qualified evidence labels, `[项目验收]` for platform facts, and `[证据缺口]` for the incomplete procedural-generation source.

## Verification conclusion

The Skill passes the three pressure scenarios after refactoring. Remaining implementation facts—engine behavior, WeChat limits, device performance, package loading, and audio strategy—remain intentionally outside the book-derived guarantee and must be verified in the real project.

## Final contract closure

After the next regression pass identified template-level gaps, the Skill was tightened again:

- `design-brief.md` now requires separate moment-to-moment-feel and prototype-time scores, with an explicit scale;
- `content-schema.md` and `numerical-model.md` now require `run/meta`, trade, and reset/persistence fields;
- `numerical-model.md` now separates model, content/rules, parameter, seed/replay, and experiment versions;
- `design-brief.md` now separates shared constraints, profile overrides, and platform facts to verify;
- `art-direction.md` now contains production budget, character model sheet, prop taxonomy, and folder/asset quantity rules;
- `feel-spec.md` now exposes Metaphor and Rules as independent event-table fields.

Final verification: the Skill Creator validator returned `Skill is valid!`; all required templates and reference files exist; the final contract fields are present; and the legacy WeChat-specific Skill path is absent from the active Skill directory. Platform/runtime claims are represented as actionable `[项目验收]` items by design.

## Current evaluation assets

- `evals/trigger-queries.json`：20 条触发/不触发查询，按 10/10 平衡，用于后续触发率回归。
- `evals/behavior-rubric.md`：10 项行为评分量表，用于检查资源路由、证据边界、设计产物和首个可玩切片是否落地。
