import type { ErrorResponse, SuccessResponse } from "./response.js";

export type OutputFormat = "json" | "table";
export type CliResponse<T> = SuccessResponse<T> | ErrorResponse;

export function resolveOutputFormat(value?: string): OutputFormat {
  if (value === "json" || value === "table") {
    return value;
  }
  if (value) {
    throw new Error(`Unsupported output format: ${value}. Use json or table.`);
  }
  return process.stdout.isTTY ? "table" : "json";
}

export function renderResponse<T>(response: CliResponse<T>, format: OutputFormat): void {
  if (format === "json") {
    process.stdout.write(`${JSON.stringify(response, null, 2)}\n`);
    return;
  }

  if (!response.ok) {
    process.stderr.write(`Error [${response.error.code}]: ${response.error.message}\n`);
    return;
  }

  process.stdout.write(`${JSON.stringify(response.data, null, 2)}\n`);
}
