# Roguelike Numerical Model and Review

Use one model per experience question. Keep formulas, parameters, content pools, seeds, and experiment versions separate.

## Model identity

- Model ID:
- Purpose/decision:
- Scope: combat|reward|economy|growth|run|meta|commercialization
- Model version:
- Content/rules version:
- Parameter version:
- Seed/replay version:
- Experiment version:
- Owner:
- One test question:

## Parameters and formulas

| Parameter | Meaning | Unit | Source/default | Range | Owner |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

```text
Formula:
Assumptions:
Data inputs:
Output:
```

## Flow and module boundary

```text
input data → model calculation → player-visible result → next decision
```

- Upstream model:
- Downstream model:
- Data call/interface:
- What can be tuned without changing other modules:
- What must remain invariant:

## Economy and reward ledger

| Item/currency | Scope (run/meta) | Source | Sink | Conversion | Trade | Reset/persistence | Opportunity cost | Alternative route |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## Phase goals and curves

| Phase | Player goal | Expected build/resources | Combat pressure | Reward/rhythm event | Review signal |
|---|---|---|---|---|---|
| Early |  |  |  |  |  |
| Middle |  |  |  |  |  |
| Late |  |  |  |  |  |

## Simulation and review

- Seed set:
- Player/build distributions:
- Scenario cases: dominant strategy, dead reward, resource exhaustion, recovery, hard counter.
- Run count or scenario count:
- Sensitivity variables:
- Outputs: win rate, time-to-goal, damage pressure, resource balance, reward choice share, dead-run rate.
- Player-readability check:
- `[测试结论]`:
- Change decision:

## Safety checks

- No single reward is required for victory:
- At least two viable build routes exist:
- Sources and sinks are visible:
- Permanent progression does not hide an unwinnable run:
- A simulation result is not presented as proof of fun:
