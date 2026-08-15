# Moment-to-Moment Feel Specification

Use this for the core interaction and every high-value event. Do not fill it with universal latency or frame-rate targets; record project measurements instead.

## Contract

- Interaction/event ID:
- Player intent:
- Target emotion: mastery|tension|relief|surprise|completion|other
- Platform/profile/device:
- Build/rules version:
- One test question:

## Closed-loop event

| Layer | Specification | Failure or fallback |
|---|---|---|
| Intent | What the player is trying to do |  |
| Input | Press/release/drag/aim/choice; target and cancellation |  |
| Response | State change, movement, hit, resource, or selection result |  |
| Context | Collision, space, timing window, threat, target, reference points |  |
| Metaphor | What the response is meant to communicate about weight, material, intent, or state |  |
| Rules | The predictable rule that makes the response fair and learnable |  |
| Anticipation | Pre-action pose, telegraph, warning, or preview |  |
| Action | Animation/logic start and interruption rule |  |
| Impact | Hit, contact, damage, reward, or confirmation |  |
| Polish | Particles, camera, screen effect, haptics, transition |  |
| Audio | Intent, confirm, hit, error, danger, reward, priority |  |
| Recovery | Correction, cancel, invulnerability, retry, or restart path |  |

## Measurement plan

| Metric | Definition | Device/build | Sampling method | Acceptance decision |
|---|---|---|---|---|
| Input-to-logic |  |  |  |  |
| Logic-to-visible response |  |  |  |  |
| Logic-to-audio response |  |  |  |  |
| Threat readability |  |  |  |  |
| Hit/result readability |  |  |  |  |
| Touch/selection error |  |  |  |  |
| Frame-time/loading behavior |  |  |  |  |

## First-minute test

- Can a fresh player state the goal before the first input?
- Does the first successful input produce an understandable result?
- Can the player identify the first threat and its consequence?
- Can the player explain the first reward or route choice?
- After failure, can the player name one change for the next run?
- Does the player continue or restart without being prompted?

## Acceptance and risks

- `[测试结论]` Evidence:
- Acceptance criteria:
- Known obstruction or accessibility risk:
- Low-end fallback:
- Next change:
