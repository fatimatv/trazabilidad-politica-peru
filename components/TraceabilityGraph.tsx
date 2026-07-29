"use client";

import { useMemo, useState } from "react";
import type { Commitment, Comparison, Source } from "@/lib/types";

type Node = {
  id: string;
  label: string;
  group: "source" | "sector" | "state";
  x: number;
  y: number;
  size: number;
};

type Edge = {
  id: string;
  from: string;
  to: string;
  weight: number;
  group: "coverage" | "evolution";
};

const stateLabels = [
  ["Coincidencia sustantiva", "Conserva"],
  ["Coincidencia parcial", "Conserva parcial"],
  ["Reformulacion", "Reformula"],
  ["Matiz", "Matiza"],
  ["Cambio de prioridad", "Cambia prioridad"],
  ["Omision relevante", "Omite"]
];

export function TraceabilityGraph({ sources, commitments, comparisons }: { sources: Source[]; commitments: Commitment[]; comparisons: Comparison[] }) {
  const [activeSector, setActiveSector] = useState("all");

  const { nodes, edges, sectors } = useMemo(() => {
    const sectorCounts = Array.from(
      commitments.reduce((acc, item) => acc.set(item.sector, (acc.get(item.sector) ?? 0) + 1), new Map<string, number>())
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
    const selectedSectors = sectorCounts.map(([name]) => name);
    const sourceNodes: Node[] = sources.map((source, index) => ({
      id: source.id,
      label: source.type,
      group: "source",
      x: 120 + index * 210,
      y: 92,
      size: 24 + Math.min(24, commitments.filter((item) => item.sourceId === source.id).length / 18)
    }));
    const sectorNodes: Node[] = sectorCounts.map(([name, count], index) => ({
      id: `sector-${name}`,
      label: name,
      group: "sector",
      x: 90 + (index % 4) * 230,
      y: 250 + Math.floor(index / 4) * 112,
      size: 18 + Math.min(32, count / 5)
    }));
    const stateNodes: Node[] = stateLabels.map(([id, label], index) => ({
      id: `state-${id}`,
      label,
      group: "state",
      x: 118 + index * 152,
      y: 640,
      size: 24
    }));

    const coverageEdges: Edge[] = sources.flatMap((source) =>
      selectedSectors
        .map((sector) => ({
          id: `edge-${source.id}-${sector}`,
          from: source.id,
          to: `sector-${sector}`,
          weight: commitments.filter((item) => item.sourceId === source.id && item.sector === sector).length,
          group: "coverage" as const
        }))
        .filter((edge) => edge.weight > 0)
    );

    const comparisonBySector = comparisons.reduce((acc, comparison) => {
      const from = commitments.find((item) => item.id === comparison.fromCommitmentId);
      if (!from || !selectedSectors.includes(from.sector)) return acc;
      const key = `${from.sector}--${comparison.relationType}`;
      acc.set(key, (acc.get(key) ?? 0) + 1);
      return acc;
    }, new Map<string, number>());

    const evolutionEdges: Edge[] = Array.from(comparisonBySector).map(([key, weight]) => {
      const [sector, relation] = key.split("--");
      return {
        id: `evolution-${sector}-${relation}`,
        from: `sector-${sector}`,
        to: `state-${relation}`,
        weight,
        group: "evolution"
      };
    });

    return {
      nodes: [...sourceNodes, ...sectorNodes, ...stateNodes],
      edges: [...coverageEdges, ...evolutionEdges],
      sectors: sectorCounts
    };
  }, [commitments, comparisons, sources]);

  const visibleNodes = nodes.filter((node) => activeSector === "all" || node.group !== "sector" || node.label === activeSector);
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = edges.filter((edge) => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to));

  return (
    <div className="graph-panel">
      <div className="graph-filters" aria-label="Filtros de grafo">
        <button className={activeSector === "all" ? "active" : ""} onClick={() => setActiveSector("all")} type="button">Todos</button>
        {sectors.slice(0, 8).map(([sector]) => (
          <button className={activeSector === sector ? "active" : ""} key={sector} onClick={() => setActiveSector(sector)} type="button">{sector}</button>
        ))}
      </div>
      <div className="graph-canvas" role="img" aria-label="Grafo de fuentes, temas y relaciones de evolucion">
        <svg viewBox="0 0 980 720">
          <defs>
            <marker id="arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M0,0 L8,4 L0,8 Z" fill="#011ef4" />
            </marker>
          </defs>
          {visibleEdges.map((edge) => {
            const from = nodes.find((node) => node.id === edge.from);
            const to = nodes.find((node) => node.id === edge.to);
            if (!from || !to) return null;
            const strokeWidth = Math.max(1.2, Math.min(8, edge.weight / 8));
            return (
              <line
                key={edge.id}
                markerEnd={edge.group === "evolution" ? "url(#arrow)" : undefined}
                stroke={edge.group === "coverage" ? "rgba(1, 30, 244, 0.22)" : "rgba(251, 187, 2, 0.72)"}
                strokeDasharray={edge.group === "evolution" ? "6 6" : undefined}
                strokeWidth={strokeWidth}
                x1={from.x}
                x2={to.x}
                y1={from.y}
                y2={to.y}
              />
            );
          })}
          {visibleNodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                fill={node.group === "source" ? "#011ef4" : node.group === "sector" ? "#ffffff" : "#fbbb02"}
                r={node.size}
                stroke={node.group === "sector" ? "#011ef4" : "#ffffff"}
                strokeWidth="3"
              />
              <text className={`graph-label ${node.group}`} textAnchor="middle" x={node.x} y={node.y + node.size + 20}>
                {node.label.length > 28 ? `${node.label.slice(0, 25)}...` : node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="graph-legend">
        <span><i className="coverage" /> Fuente a tema</span>
        <span><i className="evolution" /> Tema a evolucion</span>
        <span><b /> Grosor = volumen de registros</span>
      </div>
    </div>
  );
}
