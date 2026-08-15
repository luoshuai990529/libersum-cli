import path from "node:path";
import { fileURLToPath } from "node:url";

/** Return the Skill directory shipped with both source and compiled CLI runs. */
export function getBundledSkillsDirectory(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../skills");
}
