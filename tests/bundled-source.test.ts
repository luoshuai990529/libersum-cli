import { test } from "node:test";
import assert from "node:assert/strict";
import { LocalSkillSourceResolver } from "../src/infrastructure/sources/local-source.js";
import { getBundledSkillsDirectory } from "../src/infrastructure/sources/bundled-source.js";

test("bundled catalog exposes exactly the three LiberSum99 Skills", async () => {
  const discovered = await new LocalSkillSourceResolver().discover(getBundledSkillsDirectory());

  assert.deepEqual(
    discovered.map((item) => item.skill.name),
    [
      "analyze-project-architecture",
      "prepare-pr-mr",
      "roguelike-game-design",
    ],
  );
});
