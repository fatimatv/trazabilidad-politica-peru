import { notFound } from "next/navigation";
import { DemoBadge } from "@/components/DemoBadge";
import { comparisons } from "@/lib/demo-data";
import { getActionsForCommitment, getCommitmentById } from "@/lib/metrics";

function sourceStateLabel(state: string) {
  if (state === "PUBLISHED" || state === "REVIEWED") return "Fuente registrada";
  if (state === "AUTOMATIC") return "Preanalisis";
  if (state === "DISPUTED") return "En contraste";
  return "Fuente pendiente";
}

export default async function CommitmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getCommitmentById(id);
  if (!item) notFound();
  const itemActions = getActionsForCommitment(item.id);
  const related = comparisons.filter((comparison) => comparison.fromCommitmentId === item.id || comparison.toCommitmentId === item.id);

  return (
    <>
      <h1>{item.stableId}</h1>
      <p className="lede">{item.normalizedText}</p>
      {item.isDemo ? <DemoBadge label="DEMO - no publicado como hecho" /> : null}
      <div className="split" style={{ marginTop: 20 }}>
        <section className="grid">
          <div className="card">
            <h2>Ficha de compromiso</h2>
            <p><strong>Texto original:</strong> {item.originalExcerpt}</p>
            <p><strong>Tipo:</strong> {item.kind}</p>
            <p><strong>Sector:</strong> {item.sector} / {item.topic}</p>
            <p><strong>Emisor:</strong> {item.speaker} - {item.organization}</p>
            <p><strong>Documento de origen:</strong> {item.sourceType} / {item.documentTitle}</p>
            <p><strong>Fecha del documento:</strong> {item.emittedAt && item.emittedAt !== "PENDIENTE-CONFIRMAR" ? item.emittedAt : "Pendiente de precisar"}</p>
            <p><strong>Instrumento previsto:</strong> {item.expectedInstrument ?? "No especificado"}</p>
            <p><strong>Plazo:</strong> {item.announcedDeadline ?? "No especificado"}</p>
            <p><strong>Condiciones:</strong> {item.caveats ?? "Sin salvedades registradas"}</p>
          </div>
          <div className="card">
            <h2>Cadena de aterrizaje</h2>
            <div className="flow">
              <div>Fuente<br /><strong>{item.sourceType}</strong></div>
              <div>Registro<br /><strong>{sourceStateLabel(item.verificationState)}</strong></div>
              <div>Cumplimiento<br /><strong>{item.implementationState}</strong></div>
              <div>Resultado<br /><strong>Por evaluar</strong></div>
            </div>
          </div>
          <div className="card">
            <h2>Evidencia</h2>
            {item.evidence.map((ev) => (
              <blockquote key={ev.id}>
                <strong>{ev.label}</strong>
                <p>{ev.excerpt}</p>
                <small>Confianza: {Math.round((ev.confidence ?? 0) * 100)}%</small>
              </blockquote>
            ))}
          </div>
          <div className="card">
            <h2>Acciones vinculadas</h2>
            {itemActions.length ? itemActions.map((action) => (
              <article key={action.id}>
                <h3>{action.title}</h3>
                <p>{action.entity} - {action.status}</p>
                <p>{action.notes}</p>
              </article>
            )) : <p>Aun no se encontro accion de cumplimiento en las fuentes incorporadas.</p>}
          </div>
        </section>
        <aside className="grid">
          <div className="card">
            <h2>Historial</h2>
            {item.history.map((event) => (
              <p key={`${event.date}-${event.change}`}><strong>{event.date}</strong><br />{event.actor}: {event.change}</p>
            ))}
          </div>
          <div className="card">
            <h2>Comparaciones</h2>
            {related.length ? related.map((comparison) => (
              <p key={comparison.id}><strong>{comparison.relationType}</strong><br />{comparison.justification}</p>
            )) : <p>Sin comparaciones registradas.</p>}
          </div>
        </aside>
      </div>
    </>
  );
}
