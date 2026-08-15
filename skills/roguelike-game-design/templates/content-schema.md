# Content and Economy Schema

Use this as a design contract before implementation. Fields marked `required` must be filled before content enters a playable pool.

## Reward

```yaml
id: reward.example
schema_version: 1
type: ability|weapon|resource|reroll|heal
phase: early|mid|late|all
tags: [damage, control]
effect: ""
current_use: ""
future_use: ""
eligible_builds: []
alternative_sources: []
counterplay: ""
opportunity_cost: ""
synergies: []
conflicts: []
rarity: common|uncommon|rare
weight: 0
telemetry_key: ""
```

## Enemy or encounter

```yaml
id: enemy.example
schema_version: 1
phase: early|mid|late
threat_type: contact|projectile|area|resource|time
telegraph: ""
weakness: ""
avoidance_options: []
required_builds: []
hard_counter: false
pressure_model: ""
```

## Event or node

```yaml
id: node.example
schema_version: 1
type: combat|shop|heal|event|elite|boss
phase: early|mid|late
risk: ""
cost: ""
possible_rewards: []
eligibility_rules: []
choices:
  - id: choice.example
    consequence: ""
    warning: ""
    reversible: false
```

## Currency ledger

| Currency | Scope (run/meta) | Produced by | Consumed by | Conversion | Trade | Reset/persistence | Recovery/alternative | Dominant-strategy test |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## Review inputs

- Model assumptions:
- Formula/version:
- Parameter version:
- Seed/replay version:
- Experiment version:
- Simulation cases:
- Seed set:
- Expected phase goals:
- Player-readability question:

## Content gate

- Does this item change a later decision rather than only increase a number?
- Does it have a current or future use?
- Does it have at least one alternative route or counterplay?
- Does adding it dilute a required capability?
- Can its effect be explained before selection?
