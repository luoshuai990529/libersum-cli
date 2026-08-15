import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { InstalledSkillRecord, ManifestStore } from "./manifest-store.js";

interface ManifestDocument {
  readonly schemaVersion: 1;
  readonly records: readonly InstalledSkillRecord[];
}

export class JsonManifestStore implements ManifestStore {
  constructor(private readonly manifestPath: string) {}

  async list(): Promise<readonly InstalledSkillRecord[]> {
    const content = await readFile(this.manifestPath, "utf8").catch((error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") {
        return undefined;
      }
      throw error;
    });
    if (content === undefined) {
      return [];
    }

    let document: unknown;
    try {
      document = JSON.parse(content);
    } catch {
      throw new Error(`Invalid manifest JSON: ${this.manifestPath}`);
    }

    if (!isManifestDocument(document)) {
      throw new Error(`Invalid manifest structure: ${this.manifestPath}`);
    }
    return document.records;
  }

  async save(record: InstalledSkillRecord): Promise<void> {
    const records = (await this.list()).filter((item) => item.name !== record.name);
    const document: ManifestDocument = {
      schemaVersion: 1,
      records: [...records, record],
    };
    const directory = path.dirname(this.manifestPath);
    await mkdir(directory, { recursive: true });
    const temporaryPath = `${this.manifestPath}.${process.pid}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
    await rename(temporaryPath, this.manifestPath);
  }
}

function isManifestDocument(value: unknown): value is ManifestDocument {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return candidate.schemaVersion === 1 && Array.isArray(candidate.records);
}
