"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Commitment, Comparison, Source } from "@/lib/types";

type Props = {
  sources: Source[];
  commitments: Commitment[];
  comparisons: Comparison[];
};

export function CompareExplorer({ sources, commitments, comparisons }: Props) {
  const sourceIds = sources.map((source) => source.id);
  const [fromSource, setFromSource] = useState("src-debate-presidencial");
  const [toSource, setToSource] = useState("src-investidura");

  const rows = useMemo(() => {
    return comparisons
      .map((comparison) => ({
        comparison,
        from: commitments.find((item) => item.id === comparison.fromCommitmentId),
        to: commitments.find((item) => item.id === comparison.toCommitmentId)
      }))
      .filter((item) => item.from?.sourceId === fromSource && item.to?.sourceId === toSource)
      .sort((a, b) => b.comparison.confidence - a.comparison.confidence);
  }, [commitments, comparisons, fromSource, toSource]);

  const leftCount = commitments.filter((item) => item.sourceId === fromSource).length;
  const rightCount = commitments.filter((item) => item.sourceId === toSource).length;

  return (
    <div className="compare-explorer">
      <section className="card compare-controls" aria-label="Seleccion de insumos">
        <label>
          Fuente A
          <select value={fromSource} onChange={(event) => setFromSource(event.target.value)}>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>{source.title}</option>
            ))}
          </select>
        </label>
        <label>
          Fuente B
          <select value={toSource} onChange={(event) => setToSource(event.target.value)}>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>{source.title}</option>
            ))}
          </select>
        </label>
        <div className="compare-summary">
          <span><strong>{leftCount}</strong> registros en A</span>
          <span><strong>{rightCount}</strong> registros en B</span>
          <span><strong>{rows.length}</strong> relaciones</span>
        </div>
      </section>

      {sourceIds.includes(fromSource) && sourceIds.includes(toSource) && rows.length > 0 ? (
        <div className="grid">
          {rows.map(({ comparison, from, to }) => (
            <article className="card" key={comparison.id}>
              <p className="tag warn">{comparison.state}</p>
              <h2>{comparison.relationType}</h2>
              <div className="grid cols-2">
                <p><strong>Fuente A</strong><br /><Link href={`/commitments/${from?.id}`}>{from?.normalizedText}</Link></p>
                <p><strong>Fuente B</strong><br /><Link href={`/commitments/${to?.id}`}>{to?.normalizedText}</Link></p>
              </div>
              <p><strong>Justificacion:</strong> {comparison.justification}</p>
              <p><strong>Evidencia a favor:</strong> {comparison.evidenceFor}</p>
              <p><strong>Evidencia en contra:</strong> {comparison.evidenceAgainst}</p>
              <p><strong>Metodo:</strong> {comparison.method}. Confianza: {Math.round(comparison.confidence * 100)}%</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="demo-banner">
          No hay relaciones automaticas para este par de fuentes. Cambia los insumos o carga mas compromisos normalizados para habilitar el contraste.
        </div>
      )}
    </div>
  );
}
