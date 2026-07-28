"use client";

import { Search, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { CommitmentTable } from "./CommitmentTable";
import type { Commitment } from "@/lib/types";

export function CommitmentFilters({ rows, sectors }: { rows: Commitment[]; sectors: string[] }) {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("all");
  const [state, setState] = useState("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((item) => {
      const matchesText = !needle || [item.stableId, item.normalizedText, item.sector, item.topic].join(" ").toLowerCase().includes(needle);
      const matchesSector = sector === "all" || item.sector === sector;
      const matchesState = state === "all" || item.implementationState === state || item.verificationState === state;
      return matchesText && matchesSector && matchesState;
    });
  }, [q, rows, sector, state]);

  return (
    <>
      <div className="toolbar">
        <label>
          Buscar texto
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Sector, tema, ID o frase" />
        </label>
        <label>
          Sector
          <select value={sector} onChange={(event) => setSector(event.target.value)}>
            <option value="all">Todos</option>
            {sectors.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Estado
          <select value={state} onChange={(event) => setState(event.target.value)}>
            <option value="all">Todos</option>
            <option value="DEMO">DEMO</option>
            <option value="Sin accion identificada">Sin accion identificada</option>
            <option value="Iniciativa formal">Iniciativa formal</option>
            <option value="Presupuesto asignado">Presupuesto asignado</option>
          </select>
        </label>
        <a className="button" href="/api/export/csv"><Download size={16} aria-hidden />CSV</a>
        <a className="button" href="/api/export/json"><Search size={16} aria-hidden />JSON</a>
      </div>
      <p aria-live="polite">{filtered.length} compromisos visibles.</p>
      <CommitmentTable rows={filtered} />
    </>
  );
}
