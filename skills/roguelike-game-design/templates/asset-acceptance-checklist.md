# Asset and Runtime Acceptance Checklist

Use this after a source asset enters the runtime. Replace every empty check with a result or measurement. If the target runtime has not been checked, write a `[项目验收]` item with object, method, pass criterion, and owner/time; do not leave a generic unresolved note.

## Visual readability

- [ ] Player is identifiable at gameplay size and thumbnail size.
- [ ] Enemy class, danger, telegraph, and attack result are distinguishable.
- [ ] Reward, route, hazard, and background do not share the same priority signal.
- [ ] Status is not communicated by color alone.
- [ ] Palette, shadow steps, outline, and global light match `art-direction.md`.
- [ ] Low-brightness and small-screen checks are recorded.

## State and feedback coverage

- [ ] Required states exist: default/idle, active, hit/error, disabled, selected, success, failure, and recovery as applicable.
- [ ] Animation can be interrupted, cancelled, or safely completed.
- [ ] Telegraph precedes the threat result where the player is expected to react.
- [ ] VFX, camera, and audio amplify the result without hiding the game state.
- [ ] Repeated events have a suppression or aggregation rule.
- [ ] Low-end fallback is defined for VFX, camera, and audio.

## Export and source integrity

- [ ] Source and runtime files use the project naming rule.
- [ ] Dimensions, pivot/anchor, collision notes, pixel/grid scale, and frame order are recorded.
- [ ] Transparent bounds and accidental padding are checked.
- [ ] Color mode, scaling filter, compression, and export format are recorded.
- [ ] Atlas grouping and nine-slice rules are recorded where applicable.
- [ ] The runtime asset maps back to one source owner/version.

## Runtime measurements

| Check | Device/build | Measurement | Result | Threshold source | Decision |
|---|---|---|---|---|---|
| Load time |  |  |  | project `[设计默认]`/platform `[项目验收]` |  |
| Memory/texture |  |  |  | project `[设计默认]`/platform `[项目验收]` |  |
| Frame-time/overdraw |  |  |  | project `[设计默认]`/platform `[项目验收]` |  |
| Audio/VFX concurrency |  |  |  | project `[设计默认]`/platform `[项目验收]` |  |

## Sign-off

- Art owner:
- Design owner:
- Engineering owner:
- Target-device evidence:
- Known risks:
- Accepted fallback:
- Date/build/version:
