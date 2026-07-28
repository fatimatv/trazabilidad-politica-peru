import Link from "next/link";
import { AlertTriangle, Database, FileText, GitCompareArrows } from "lucide-react";
import { CommitmentTable } from "@/components/CommitmentTable";
import { SectorChart } from "@/components/SectorChart";
import { commitments, lastUpdated, sources } from "@/lib/demo-data";
import { getDashboardMetrics, sectorDistribution } from "@/lib/metrics";

export default function HomePage() {
  const metrics = getDashboardMetrics();
  return (
    <>
      <section className="hero">
        <div>
          <p className="tag warn">DEMO funcional con datos no publicados como hechos</p>
          <h1>Trazabilidad documental de compromisos publicos</h1>
          <p className="lede">
            Plataforma neutral para seguir compromisos desde discurso y plan hasta normas, presupuesto,
            ejecucion y resultados, separando evidencia, inferencia y revision humana.
          </p>
          <div className="nav" style={{ justifyContent: "flex-start" }}>
            <Link className="button primary" href="/commitments">Explorar compromisos</Link>
            <Link className="button" href="/methodology">Ver metodologia</Link>
          </div>
        </div>
        <aside className="card">
          <h2>Estado del universo</h2>
          <p>Ultima actualizacion: <strong>{lastUpdated}</strong></p>
          <p className="notice">
            La evidencia inicial proviene de archivos locales. Antes de publicar conclusiones reales se debe contrastar cada cita con fuentes primarias oficiales.
          </p>
        </aside>
      </section>

      <section className="grid cols-4" aria-label="Indicadores principales" style={{ marginTop: 24 }}>
        <div className="card metric"><Database size={20} aria-hidden /><strong>{metrics.totalSources}</strong><span>fuentes registradas</span></div>
        <div className="card metric"><FileText size={20} aria-hidden /><strong>{metrics.totalCommitments}</strong><span>compromisos demo</span></div>
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
        <h2>Compromisos recientes</h2>
        <CommitmentTable rows={commitments.slice(0, 4)} />
      </section>
    </>
  );
}
