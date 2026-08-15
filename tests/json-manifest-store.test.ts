import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import { JsonManifestStore } from "../src/infrastructure/state/json-manifest-store.js";

async function withTempDirectory(run: (directory: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(path.join(os.tmpdir(), "libersum-manifest-test-"));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

const record = {
  name: "example-skill",
  source: "/tmp/source",
  targets: ["codex"],
  method: "symlink" as const,
  installedAt: "2026-08-15T00:00:00.000Z",
  installerVersion: "0.1.0",
};

test("missing manifest returns an empty list and save creates parents", async () => {
  await withTempDirectory(async (directory) => {
    const store = new JsonManifestStore(path.join(directory, "nested", "manifest.json"));

    assert.deepEqual(await store.list(), []);
    await store.save(record);
    assert.deepEqual(await store.list(), [record]);
  });
});

test("saving the same Skill replaces its record", async () => {
  await withTempDirectory(async (directory) => {
    const store = new JsonManifestStore(path.join(directory, "manifest.json"));
    await store.save(record);
    await store.save({ ...record, targets: ["pi"], method: "copy" });

    assert.deepEqual(await store.list(), [{ ...record, targets: ["pi"], method: "copy" }]);
  });
});

test("malformed manifest fails without overwriting the file", async () => {
  await withTempDirectory(async (directory) => {
    const manifestPath = path.join(directory, "manifest.json");
    await writeFile(manifestPath, "not-json");
    const store = new JsonManifestStore(manifestPath);

    await assert.rejects(() => store.list(), /Invalid manifest/);
    assert.equal(await readFile(manifestPath, "utf8"), "not-json");
  });
});
