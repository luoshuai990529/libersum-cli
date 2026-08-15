# Lightweight Roguelike Art Direction

This is a compact visual bible for a small team. It is a production contract, not a mood board that exists without runtime checks.

## Contents

- [Product and audience](#product-and-audience)
- [Production budget](#production-budget)
- [Vision board](#vision-board)
- [Visual hierarchy](#visual-hierarchy)
- [Design tokens](#design-tokens)
- [Asset matrix](#asset-matrix)
- [Character model sheet contract](#character-model-sheet-contract)
- [Prop taxonomy](#prop-taxonomy)
- [Handoff and review](#handoff-and-review)

## Product and audience

- Player/audience:
- Player promise:
- Intended emotion:
- Platform/profile and display size:
- Art budget and team capacity:
- Visual out of scope:

### Production budget

| Asset group | Required count for first slice | Reusable variants | Max states/animations | Budget owner | Cut order |
|---|---:|---:|---:|---|---|
| Player |  |  |  |  |  |
| Enemy classes |  |  |  |  |  |
| Props/tiles |  |  |  |  |  |
| Rewards/UI |  |  |  |  |  |
| VFX/audio support assets |  |  |  |  |  |

## Vision board

| Field | Decision | Positive references | Negative references / do not copy |
|---|---|---|---|
| Theme/world |  |  |  |
| Shape language |  |  |  |
| Material/texture |  |  |  |
| Color/palette |  |  |  |
| Light/shadow |  |  |  |
| Motion/energy |  |  |  |
| UI relationship |  |  |  |

## Visual hierarchy

Rank each item at gameplay size, thumbnail size, and low-brightness view:

1. player and player health/state;
2. enemy threat and telegraph;
3. interactable or reward;
4. route/risk information;
5. background and decoration.

| Element | Shape/silhouette rule | Color/contrast rule | Motion/telegraph rule | Readability test |
|---|---|---|---|---|
| Player |  |  |  |  |
| Enemy class |  |  |  |  |
| Reward |  |  |  |  |
| Hazard |  |  |  |  |
| Route/node |  |  |  |  |

## Design tokens

- Palette and semantic colors:
- Shadow steps:
- Global light direction:
- Pixel/grid/unit scale:
- Outline/edge rule:
- Typography/icon rule:
- Reusable UI components:

## Asset matrix

| Domain | Entity | Required states | Layers/reuse | Source file | Runtime export | Owner/reviewer |
|---|---|---|---|---|---|---|
| Player |  | idle/move/attack/hit/death |  |  |  |  |
| Enemy |  | idle/telegraph/attack/hit/death |  |  |  |  |
| Prop/Tile |  | intact/used/destroyed |  |  |  |  |
| Reward/UI |  | default/pressed/selected/disabled |  |  |  |  |
| VFX |  | telegraph/contact/status/cleanup |  |  |  |  |

### Character model sheet contract

| Character/entity | Proportion/silhouette | Required views/poses | State frames | Anchor/collision notes | Palette/variant rule |
|---|---|---|---|---|---|
| Player |  | front/side/gameplay | idle/move/attack/hit/death |  |  |
| Enemy class |  | front/side/gameplay | idle/telegraph/attack/hit/death |  |  |

### Prop taxonomy

| Category | Gameplay role | Readability cue | Interaction states | Reuse rule |
|---|---|---|---|---|
| Harvestable |  |  |  |  |
| Destructible |  |  |  |  |
| Interactive |  |  |  |  |
| Reward |  |  |  |  |  |
| Hazard |  |  |  |  |  |
| Background-only |  |  |  |  |  |

## Handoff and review

- Source naming rule:
- Folder/asset quantity rule:
- Runtime naming rule:
- Atlas grouping:
- Export format and scaling:
- Required preview sizes:
- Target-device checks:
- Review gates: concept → graybox → color → runtime → final.
