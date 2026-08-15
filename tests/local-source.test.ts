import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import { LocalSkillSourceResolver } from "../src/infrastructure/sources/local-source.js";

async function withTempDirectory(run: (directory: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(path.join(os.tmpdir(), "libersum-source-test-"));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("discovers and validates a root Skill bundle", async () => {
  await withTempDirectory(async (directory) => {
    await writeFile(
      path.join(directory, "SKILL.md"),
      "---\nname: root-skill\ndescription: Root skill\n---\n\n# Root\n",
    );
    await writeFile(path.join(directory, "reference.md"), "reference");

    const [resolved] = await new LocalSkillSourceResolver().discover(directory);

    assert.equal(resolved.skill.name, "root-skill");
    assert.equal(resolved.skill.description, "Root skill");
    assert.equal(resolved.directory, directory);
    assert.match(resolved.skill.contentDigest ?? "", /^sha256:[0-9a-f]{64}$/);
  });
});

test("discovers nested Skills and selects one by name", async () => {
  await withTempDirectory(async (directory) => {
    for (const name of ["first-skill", "second-skill"]) {
      const skillDirectory = path.join(directory, "skills", name);
      await mkdir(skillDirectory, { recursive: true });
      await writeFile(
        path.join(skillDirectory, "SKILL.md"),
        `---\nname: ${name}\ndescription: ${name} description\n---\n`,
      );
    }

    const resolver = new LocalSkillSourceResolver();
    const all = await resolver.discover(directory);
    const [selected] = await resolver.resolve(directory, "second-skill");

    assert.deepEqual(all.map((item) => item.skill.name), ["first-skill", "second-skill"]);
    assert.equal(selected.skill.name, "second-skill");
  });
});

test("rejects a source without a valid SKILL.md", async () => {
  await withTempDirectory(async (directory) => {
    await assert.rejects(
      () => new LocalSkillSourceResolver().discover(directory),
      (error: Error) => /SKILL\.md/.test(error.message),
    );
  });
});
