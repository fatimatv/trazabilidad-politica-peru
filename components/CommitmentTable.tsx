import Link from "next/link";
import type { Commitment } from "@/lib/types";
import { DemoBadge } from "./DemoBadge";

function sourceStateLabel(row: Commitment) {
  if (row.verificationState === "PUBLISHED" || row.verificationState === "REVIEWED") return "Fuente registrada";
  if (row.verificationState === "AUTOMATIC") return "Preanalisis";
  if (row.verificationState === "DISPUTED") return "En contraste";
  if (row.verificationState === "DEMO") return "Demo";
  return "Fuente pendiente";
}

function sourceDetail(row: Commitment) {
  return [row.sourceType, row.documentTitle, row.emittedAt && row.emittedAt !== "PENDIENTE-CONFIRMAR" ? row.emittedAt : null]
    .filter(Boolean)
    .join(" / ");
}

export function CommitmentTable({ rows }: { rows: Commitment[]; showSource?: boolean }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID estable</th>
            <th>Compromiso normalizado</th>
            <th>Documento de origen</th>
            <th>Sector</th>
            <th>Tipo</th>
            <th>Cumplimiento</th>
            <th>Fuente documental</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                {row.sourceId.startsWith("src-local-") ? row.stableId : <Link href={`/commitments/${row.id}`}>{row.stableId}</Link>}
                {row.isDemo ? <DemoBadge /> : null}
              </td>
              <td>{row.normalizedText}</td>
              <td>
                <strong>{row.sourceType}</strong>
                <small>{sourceDetail(row)}</small>
              </td>
              <td>{row.sector}</td>
              <td>{row.kind}</td>
              <td>{row.implementationState}</td>
              <td>{sourceStateLabel(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
