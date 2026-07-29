import Link from "next/link";
import type { Commitment } from "@/lib/types";
import { DemoBadge } from "./DemoBadge";

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
            <th>Implementacion</th>
            <th>Revision</th>
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
              <td>{row.verificationState}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
