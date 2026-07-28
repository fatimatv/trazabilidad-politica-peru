import { actions, commitments, comparisons, sources } from "./demo-data";
import type { Commitment } from "./types";

export function getSectors() {
  return Array.from(new Set(commitments.map((item) => item.sector))).sort();
}

export function filterCommitments(params: { q?: string; sector?: string; state?: string }) {
  const q = params.q?.trim().toLowerCase();
  return commitments.filter((item) => {
    const matchesQuery =
      !q ||
      [item.stableId, item.normalizedText, item.originalExcerpt, item.sector, item.topic, item.speaker]
        .join(" ")
        .toLowerCase()
        .includes(q);
    const matchesSector = !params.sector || params.sector === "all" || item.sector === params.sector;
    const matchesState =
      !params.state || params.state === "all" || item.implementationState === params.state || item.verificationState === params.state;
    return matchesQuery && matchesSector && matchesState;
  });
}

export function getCommitmentById(id: string) {
  return commitments.find((item) => item.id === id || item.stableId === id);
}

export function getActionsForCommitment(id: string) {
  return actions.filter((action) => action.commitmentId === id);
}

export function getDashboardMetrics() {
  const actionCommitments = new Set(actions.map((action) => action.commitmentId));
  const implemented = commitments.filter((item) =>
    ["Presupuesto asignado", "Ejecucion", "Resultado verificado", "Norma aprobada"].includes(item.implementationState)
  ).length;
  const reviewed = commitments.filter((item) => item.verificationState === "REVIEWED" || item.verificationState === "PUBLISHED").length;
  return {
    totalCommitments: commitments.length,
    totalSources: sources.length,
    actionRate: Math.round((actionCommitments.size / commitments.length) * 100),
    implementationRate: Math.round((implemented / commitments.length) * 100),
    reviewedRate: Math.round((reviewed / commitments.length) * 100),
    insufficientEvidence: commitments.filter((item) => item.confidence < 0.6).length,
    comparisons: comparisons.length,
    budgetBacked: actions.filter((action) => action.budget).length
  };
}

export function sectorDistribution() {
  return getSectors().map((sector) => ({
    sector,
    count: commitments.filter((item) => item.sector === sector).length
  }));
}

export function buildTimeline() {
  const commitmentEvents = commitments.map((item) => ({
    id: item.id,
    date: item.emittedAt && item.emittedAt !== "PENDIENTE" ? item.emittedAt : "2026-07-28",
    title: item.normalizedText,
    type: "Compromiso",
    state: item.verificationState,
    sector: item.sector
  }));
  const actionEvents = actions.map((item) => ({
    id: item.id,
    date: item.occurredAt ?? "2026-07-28",
    title: item.title,
    type: "Accion gubernamental",
    state: item.status,
    sector: commitments.find((commitment) => commitment.id === item.commitmentId)?.sector ?? "Sin sector"
  }));
  return [...commitmentEvents, ...actionEvents].sort((a, b) => a.date.localeCompare(b.date));
}

export function toCsv(rows: Commitment[]) {
  const headers = [
    "stableId",
    "sector",
    "topic",
    "kind",
    "normalizedText",
    "implementationState",
    "verificationState",
    "isDemo"
  ];
  const escape = (value: unknown) => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header as keyof Commitment])).join(","))].join("\n");
}
