"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, EyeOff, GitBranch, PlusCircle, RefreshCcw, SlidersHorizontal } from "lucide-react";
import type { Commitment, Comparison, Source } from "@/lib/types";

type Props = {
  sources: Source[];
  commitments: Commitment[];
  comparisons: Comparison[];
};

type EvolutionRow = {
  id: string;
  from?: Commitment;
  to?: Commitment;
  comparison?: Comparison;
  label: string;
  bucket: "continuidad" | "reformulacion" | "matiz" | "omitida" | "nueva";
  confidence: number;
  sector: string;
};

const sourceOrder = ["src-plan-gobierno", "src-debate-presidencial", "src-debate-tecnico", "src-investidura"];

function relationBucket(relationType: string): EvolutionRow["bucket"] {
  if (relationType === "Coincidencia sustantiva" || relationType === "Coincidencia parcial") return "continuidad";
  if (relationType === "Reformulacion") return "reformulacion";
  if (relationType === "Omision relevante") return "omitida";
  if (relationType === "Cambio de prioridad" || relationType === "Matiz") return "matiz";
  return "matiz";
}

function relationLabel(bucket: EvolutionRow["bucket"]) {
  if (bucket === "continuidad") return "Se conserva";
  if (bucket === "reformulacion") return "Evoluciona";
  if (bucket === "matiz") return "Se matiza";
  if (bucket === "omitida") return "Desaparece";
  return "Aparece nueva";
}

function isTraceable(item: Commitment) {
  return item.kind !== "Diagnostico";
}

export function CompareExplorer({ sources, commitments, comparisons }: Props) {
  const [fromSource, setFromSource] = useState("src-plan-gobierno");
  const [toSource, setToSource] = useState("src-investidura");
  const [sector, setSector] = useState("all");
  const [bucket, setBucket] = useState("all");

  const sourceCounts = useMemo(() => {
    return new Map(sources.map((source) => [source.id, commitments.filter((item) => item.sourceId === source.id).length]));
  }, [commitments, sources]);

  const sectors = useMemo(() => {
    const values = commitments
      .filter((item) => item.sourceId === fromSource || item.sourceId === toSource)
      .map((item) => item.sector);
    return Array.from(new Set(values)).sort();
  }, [commitments, fromSource, toSource]);

  const rows = useMemo(() => {
    const fromItems = commitments.filter((item) => item.sourceId === fromSource && isTraceable(item));
    const toItems = commitments.filter((item) => item.sourceId === toSource && isTraceable(item));
    const matched = comparisons
      .map((comparison) => ({
        comparison,
        from: commitments.find((item) => item.id === comparison.fromCommitmentId),
        to: commitments.find((item) => item.id === comparison.toCommitmentId)
      }))
      .filter((item) => item.from?.sourceId === fromSource && item.to?.sourceId === toSource && item.from && item.to)
      .map(({ comparison, from, to }): EvolutionRow => {
        const typedFrom = from as Commitment;
        const typedTo = to as Commitment;
        const itemBucket = relationBucket(comparison.relationType);
        return {
          id: comparison.id,
          from: typedFrom,
          to: typedTo,
          comparison,
          label: relationLabel(itemBucket),
          bucket: itemBucket,
          confidence: comparison.confidence,
          sector: typedFrom.sector
        };
      });

    const matchedFrom = new Set(matched.map((item) => item.from?.id));
    const matchedTo = new Set(matched.map((item) => item.to?.id));
    const omitted = fromItems
      .filter((item) => !matchedFrom.has(item.id))
      .map((item): EvolutionRow => ({
        id: `omitida-${item.id}-${toSource}`,
        from: item,
        label: "Desaparece",
        bucket: "omitida",
        confidence: 0.38,
        sector: item.sector
      }));
    const newIdeas = toItems
      .filter((item) => !matchedTo.has(item.id))
      .map((item): EvolutionRow => ({
        id: `nueva-${fromSource}-${item.id}`,
        to: item,
        label: "Aparece nueva",
        bucket: "nueva",
        confidence: 0.5,
        sector: item.sector
      }));

    return [...matched, ...omitted, ...newIdeas]
      .filter((item) => sector === "all" || item.sector === sector)
      .filter((item) => bucket === "all" || item.bucket === bucket)
      .sort((a, b) => {
        const bucketOrder = ["continuidad", "reformulacion", "matiz", "omitida", "nueva"];
        return bucketOrder.indexOf(a.bucket) - bucketOrder.indexOf(b.bucket) || b.confidence - a.confidence;
      });
  }, [bucket, commitments, comparisons, fromSource, sector, toSource]);

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, item) => {
        acc[item.bucket] += 1;
        return acc;
      },
      { continuidad: 0, reformulacion: 0, matiz: 0, omitida: 0, nueva: 0 }
    );
  }, [rows]);

  const sectorSummary = useMemo(() => {
    return sectors
      .map((name) => {
        const items = rows.filter((row) => row.sector === name);
        const mapped = items.filter((row) => row.bucket !== "omitida").length;
        return { name, total: items.length, mapped };
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 12);
  }, [rows, sectors]);

  const from = sources.find((source) => source.id === fromSource);
  const to = sources.find((source) => source.id === toSource);

  return (
    <div className="compare-explorer">
      <section className="stage-rail" aria-label="Etapas documentales">
        {sourceOrder.map((sourceId, index) => {
          const source = sources.find((item) => item.id === sourceId);
          if (!source) return null;
          return (
            <button
              className={sourceId === fromSource || sourceId === toSource ? "stage-node active" : "stage-node"}
              key={source.id}
              onClick={() => {
                if (index < sourceOrder.indexOf(toSource)) setFromSource(source.id);
                else setToSource(source.id);
              }}
              type="button"
            >
              <span>{index + 1}</span>
              <strong>{source.type}</strong>
              <em>{sourceCounts.get(source.id) ?? 0} registros</em>
            </button>
          );
        })}
      </section>

      <section className="card compare-controls" aria-label="Seleccion de insumos">
        <label>
          Fuente inicial
          <select value={fromSource} onChange={(event) => setFromSource(event.target.value)}>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>{source.title}</option>
            ))}
          </select>
        </label>
        <label>
          Fuente posterior
          <select value={toSource} onChange={(event) => setToSource(event.target.value)}>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>{source.title}</option>
            ))}
          </select>
        </label>
        <label>
          Tema
          <select value={sector} onChange={(event) => setSector(event.target.value)}>
            <option value="all">Todos los temas</option>
            {sectors.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Evolucion
          <select value={bucket} onChange={(event) => setBucket(event.target.value)}>
            <option value="all">Todas</option>
            <option value="continuidad">Se conserva</option>
            <option value="reformulacion">Evoluciona</option>
            <option value="matiz">Se matiza</option>
            <option value="omitida">Desaparece</option>
            <option value="nueva">Aparece nueva</option>
          </select>
        </label>
      </section>

      <section className="evolution-hero card">
        <div>
          <p className="tag warn">Mapa de evolucion</p>
          <h2>{from?.type} <ArrowRight size={28} aria-hidden /> {to?.type}</h2>
          <p>
            Cada fila contrasta una idea de la etapa inicial con su formulacion posterior. Cuando no hay puente suficiente,
            el sistema la marca como desaparecida; cuando aparece solo en la fuente posterior, la marca como nueva.
          </p>
        </div>
        <div className="evolution-stats" aria-label="Resumen de evolucion">
          <article><GitBranch size={18} aria-hidden /><strong>{summary.continuidad}</strong><span>conservadas</span></article>
          <article><RefreshCcw size={18} aria-hidden /><strong>{summary.reformulacion}</strong><span>evolucionan</span></article>
          <article><SlidersHorizontal size={18} aria-hidden /><strong>{summary.matiz}</strong><span>matizadas</span></article>
          <article><EyeOff size={18} aria-hidden /><strong>{summary.omitida}</strong><span>desaparecen</span></article>
          <article><PlusCircle size={18} aria-hidden /><strong>{summary.nueva}</strong><span>nuevas</span></article>
        </div>
      </section>

      <section className="card heatmap">
        <h2>Cobertura por tema</h2>
        <div className="heatmap-grid">
          {sectorSummary.map((item) => (
            <button key={item.name} onClick={() => setSector(item.name)} type="button">
              <span>{item.name}</span>
              <strong>{item.total}</strong>
              <i style={{ width: `${Math.max(8, Math.round((item.mapped / item.total) * 100))}%` }} />
            </button>
          ))}
        </div>
      </section>

      <section className="evolution-matrix" aria-label="Matriz de evolucion documental">
        {rows.map((row) => (
          <article className={`evolution-row ${row.bucket}`} key={row.id}>
            <div className="row-status">
              <span>{row.label}</span>
              <strong>{Math.round(row.confidence * 100)}%</strong>
            </div>
            <div className="row-source">
              <small>{from?.type}</small>
              {row.from ? (
                <Link href={`/commitments/${row.from.id}`}>{row.from.normalizedText}</Link>
              ) : (
                <p>No aparece una formulacion equivalente en la fuente inicial.</p>
              )}
            </div>
            <div className="row-arrow" aria-hidden><ArrowRight size={18} /></div>
            <div className="row-source">
              <small>{to?.type}</small>
              {row.to ? (
                <Link href={`/commitments/${row.to.id}`}>{row.to.normalizedText}</Link>
              ) : (
                <p>No se detecto continuidad suficiente en la fuente posterior seleccionada.</p>
              )}
            </div>
            <div className="row-analysis">
              <strong>{row.sector}</strong>
              <p>{row.comparison?.justification ?? "Inferencia de cobertura: no hay relacion automatica con umbral suficiente para afirmar continuidad."}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
