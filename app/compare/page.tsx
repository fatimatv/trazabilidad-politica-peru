import Link from "next/link";
import { commitments, comparisons } from "@/lib/demo-data";

export default function ComparePage() {
  return (
    <>
      <h1>Comparador documental</h1>
      <p className="lede">Relaciones entre compromisos, discursos y acciones con justificacion, evidencia a favor y evidencia en contra.</p>
      <div className="grid">
        {comparisons.map((comparison) => {
          const from = commitments.find((item) => item.id === comparison.fromCommitmentId);
          const to = commitments.find((item) => item.id === comparison.toCommitmentId);
          return (
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
          );
        })}
      </div>
    </>
  );
}
