import Link from "next/link";
import { AlertTriangle, Database, FileText, GitCompareArrows } from "lucide-react";
import { CommitmentTable } from "@/components/CommitmentTable";
import { SectorChart } from "@/components/SectorChart";
import { commitments, lastUpdated, platformTitle, sources } from "@/lib/demo-data";
import { getDashboardMetrics, sectorDistribution } from "@/lib/metrics";

export default function HomePage() {
  const metrics = getDashboardMetrics();
  const sourceCounts = sources.map((source) => ({
    ...source,
    commitments: commitments.filter((commitment) => commitment.sourceId === source.id).length
  }));
  const traceableSample = commitments
    .filter((commitment) => commitment.sourceId === "src-plan-gobierno" && commitment.kind === "Promesa concreta")
    .slice(0, 4);

  return (
    <>
      <section className="hero">
        <div>
          <p className="brand-kicker">IALAW Digital Lawyers</p>
          <p className="tag warn">Seguimiento de cumplimiento en etapa inicial</p>
          <h1>{platformTitle}</h1>
          <p className="lede">
            Plataforma neutral para seguir compromisos de debates, plan de gobierno y discurso presidencial
            hasta acciones, normas, presupuesto, ejecucion y resultados, sin confundir existencia del compromiso con cumplimiento.
          </p>
          <div className="nav" style={{ justifyContent: "flex-start" }}>
            <Link className="button primary" href="/commitments">Explorar compromisos</Link>
            <Link className="button" href="/compare">Comparar insumos</Link>
            <Link className="button" href="/graphs">Ver grafos</Link>
          </div>
        </div>
        <aside className="card">
          <h2>Insumos normalizados</h2>
          <p>Ultima actualizacion: <strong>{lastUpdated}</strong></p>
          <ul className="source-list">
            {sourceCounts.map((source) => (
              <li key={source.id}>
                <strong>{source.commitments}</strong>
                <span>{source.type}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="grid cols-4" aria-label="Indicadores principales" style={{ marginTop: 24 }}>
        <div className="card metric"><Database size={20} aria-hidden /><strong>{metrics.totalSources}</strong><span>fuentes registradas</span></div>
        <div className="card metric"><FileText size={20} aria-hidden /><strong>{metrics.totalCommitments}</strong><span>compromisos desde insumos</span></div>
        <div className="card metric"><GitCompareArrows size={20} aria-hidden /><strong>{metrics.actionRate}%</strong><span>con accion identificada</span></div>
        <div className="card metric"><AlertTriangle size={20} aria-hidden /><strong>{metrics.insufficientEvidence}</strong><span>con evidencia debil</span></div>
      </section>

      <section className="grid cols-2" style={{ marginTop: 24 }}>
        <div className="card">
          <h2>Cobertura por fuente</h2>
          {sources.map((source) => (
            <div key={source.id} style={{ marginBottom: 14 }}>
              <strong>{source.title}</strong>
              <p>{source.note}</p>
              <div className="bar"><span style={{ width: `${source.coverage * 100}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="card">
          <h2>Distribucion por sector</h2>
          <SectorChart data={sectorDistribution()} />
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <div className="section-heading">
          <div>
            <h2>Registros trazables destacados</h2>
            <p>
              Esta muestra proviene del Plan de Gobierno de Keiko Fujimori / Fuerza Popular. Su vinculacion se evalua
              contra debates y mensaje presidencial en el comparador documental.
            </p>
          </div>
          <Link className="button primary" href="/compare">Ver evolucion</Link>
        </div>
        <CommitmentTable rows={traceableSample} showSource />
      </section>
    </>
  );
}
