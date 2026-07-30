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

export function CommitmentTable({ rows, showSource = false }: { rows: Commitment[]; showSource?: boolean }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID estable</th>
            {showSource ? <th>Fuente</th> : null}
            <th>Compromiso normalizado</th>
            <th>Sector</th>
            <th>Tipo</th>
            <th>Cumplimiento</th>
            <th>Fuente documental</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td><Link href={`/commitments/${row.id}`}>{row.stableId}</Link>{row.isDemo ? <DemoBadge /> : null}</td>
              {showSource ? <td>{row.documentTitle}</td> : null}
              <td>{row.normalizedText}</td>
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
