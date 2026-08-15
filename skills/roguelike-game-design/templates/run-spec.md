# Run and State Specification

## State machine

```text
RUN_START → ROUTE_SELECT → NODE_ACTIVE → REWARD_SELECT → BUILD_UPDATE
BUILD_UPDATE → ROUTE_SELECT
NODE_ACTIVE → ELITE_OR_BOSS → RUN_RESULT
RUN_RESULT → RESTART | META_UNLOCK | MENU
```

## Phase and experience contract

| Phase | Player capability taught | Build decision | Pressure/test | Target emotion | Transition signal |
|---|---|---|---|---|---|
| Early |  |  |  |  |  |
| Middle |  |  |  |  |  |
| Late |  |  |  |  |  |

## State table

| State | Entry condition | Player choice | Resource change | Exit condition | Failure recovery |
|---|---|---|---|---|---|
| RUN_START |  |  |  |  |  |
| ROUTE_SELECT |  |  |  |  |  |
| NODE_ACTIVE |  |  |  |  |  |
| REWARD_SELECT |  |  |  |  |  |
| BUILD_UPDATE |  |  |  |  |  |
| ELITE_OR_BOSS |  |  |  |  |  |
| RUN_RESULT |  |  |  |  |  |

## Node contract

| Node ID | Type | Phase eligibility | Risk | Reward | Anchor or random | Reachability rule |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## Randomness contract

- Seed:
- Eligible pool:
- Excluded combinations:
- Required function alternatives:
- Player-visible risk/consequence:
- Reproducibility/debugging rule:
- Impossible-run prevention:

## Version contract

- Rules version:
- Content-pool version:
- Parameter/model version:
- Seed/replay version:
- Migration or compatibility note:

## Run acceptance

- A new player can identify the next goal:
- Every key node is reachable:
- At least two viable build paths exist:
- A failure explains a change for the next run:
- Target run duration:
