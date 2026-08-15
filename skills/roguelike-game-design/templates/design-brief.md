# Roguelike Game Design Brief

## 1. Boundary

| Field | Decision | Label to use |
|---|---|---|
| Target platform/profile |  | Supplied by user: `[项目约束]`; otherwise `[待决策]` |
| Orientation and input | Portrait, touch-friendly, single-hand by default | Default: `[设计默认]`; user-confirmed: `[项目约束]` |
| Target run length | 5–15 minutes by default | Default: `[设计默认]`; user-confirmed: `[项目约束]` |
| Team/budget |  | Supplied: `[项目约束]`; otherwise `[待决策]` |
| Player promise and intended emotion |  | `[待决策]` until selected |
| Core interaction under test |  | `[待决策]` until selected |
| Resume behavior |  | `[待决策]` until selected; runtime behavior is `[项目验收]` |
| Out of scope for first slice |  | `[项目约束]` after scope is frozen |

### Boundary classification

| Item | Shared design constraint | Profile override | Runtime/platform acceptance item | Decision/owner |
|---|---|---|---|---|
| Input and display |  |  |  |  |
| Run/interruption behavior |  |  |  |  |
| Performance/loading/audio |  |  |  |  |
| Package/API/monetization |  |  |  |  |

For every runtime/platform acceptance item, record: `对象 → 方法 → 通过标准 → 负责人/时间`.

## 2. Candidate loop comparison

| Candidate | First-minute action | Moment-to-moment feel (1–5) | Touch fit (1–5) | Content cost (1–5) | Balance risk (1–5) | Variance potential (1–5) | Prototype time (1–5) | Decision |
|---|---|---:|---:|---:|---:|---:|---:|---|
| Action combat |  |  |  |  |  |  |  |  |
| Card/deck choice |  |  |  |  |  |  |  |  |
| Turn-based tactics |  |  |  |  |  |  |  |  |
| Auto-battle/idle |  |  |  |  |  |  |  |  |

Scoring scale: 1 = poor/expensive/risky, 3 = acceptable, 5 = strong/cheap/low-risk. For cost and risk, document whether a high score means “more favorable” or invert the score consistently before comparing.

## 3. Selected loop

- Player fantasy:
- Moment-to-moment action:
- Route decision:
- Reward decision:
- Failure and restart:
- Why this is the smallest testable loop:

## 4. First slice contract

- One test question:
- Must build:
- Must not build:
- Success evidence:
- Known risks:
