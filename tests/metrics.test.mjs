import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const demoData = readFileSync(new URL("../lib/demo-data.ts", import.meta.url), "utf8");
const metrics = readFileSync(new URL("../lib/metrics.ts", import.meta.url), "utf8");
const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
const auth = readFileSync(new URL("../lib/auth.ts", import.meta.url), "utf8");

test("demo commitments are visibly flagged", () => {
  const matches = demoData.match(/isDemo: true/g) ?? [];
  assert.ok(matches.length >= 4);
  assert.match(demoData, /DEMO: cita no publicada/);
});

test("csv export includes audit-relevant fields", () => {
  assert.match(metrics, /verificationState/);
  assert.match(metrics, /implementationState/);
  assert.match(metrics, /isDemo/);
});

test("prisma schema includes required audit and traceability models", () => {
  for (const model of [
    "Source",
    "Document",
    "DocumentVersion",
    "Commitment",
    "CommitmentVersion",
    "Comparison",
    "Evidence",
    "GovernmentAction",
    "LegalInstrument",
    "BudgetRecord",
    "Project",
    "Work",
    "Outcome",
    "Review",
    "User",
    "AuditLog"
  ]) {
    assert.match(schema, new RegExp(`model ${model} `));
  }
});

test("write APIs are designed around explicit roles", () => {
  assert.match(auth, /x-demo-role/);
  assert.match(auth, /ADMIN/);
  assert.match(auth, /REVIEWER/);
});
