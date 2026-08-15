import { test } from "node:test";
import assert from "node:assert/strict";
import { okResponse, errorResponse } from "../src/output/response.js";

test("success responses expose a stable machine-readable envelope", () => {
  assert.deepEqual(okResponse("agent.list", { count: 2 }), {
    schemaVersion: 1,
    ok: true,
    action: "agent.list",
    data: { count: 2 },
  });
});

test("error responses expose a stable error code and message", () => {
  assert.deepEqual(errorResponse("CONFLICT", "Target already exists"), {
    schemaVersion: 1,
    ok: false,
    error: {
      code: "CONFLICT",
      message: "Target already exists",
    },
  });
});
