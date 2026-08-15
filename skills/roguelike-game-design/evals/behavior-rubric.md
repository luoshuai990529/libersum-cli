# Roguelike Skill Behavior Rubric

Use this rubric with the trigger queries and pressure scenarios. It evaluates output behavior, not prose similarity.

## Required behavior

Score each item `0` (missing), `1` (partial), or `2` (clear and actionable):

1. Chooses or compares at least three core-loop candidates before expanding content.
2. Uses only the seven whitelist labels, separates `[项目约束]`, `[设计默认]`, `[待决策]`, `[测试结论]`, `[项目验收]`, and `[证据缺口]` correctly, and does not invent `[待测试]`-style variants.
3. Routes only the relevant reference/template files instead of loading every source.
4. Produces a concrete artifact, one prototype question, acceptance criteria, and next decision.
5. Covers run state, route/node structure, controlled randomness, rewards, economy, progression, and failure recovery when the task requires them.
6. Uses `feel-spec.md` for input/response/feedback questions and `art-direction.md` plus acceptance checklist for visual-production questions.
7. Keeps platform facts as actionable acceptance items: object, method, pass criterion, owner/time.
8. Does not claim that simulation proves fun, fairness, or player comprehension.
9. Does not add permanent progression, monetization, procedural generation, or content volume without a test question and scope cost.
10. Keeps a first slice small enough to prototype and names what is explicitly out of scope.

## Suggested gates

- 16–20: ready for routine use;
- 12–15: usable but needs targeted revision;
- below 12: revise the Skill before relying on it for production decisions.

Record the prompt, Skill version, model/client, score, missed requirement, and next change. Do not treat a single successful sample as proof of generalization.
