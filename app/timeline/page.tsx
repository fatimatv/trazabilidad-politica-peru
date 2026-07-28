import { buildTimeline } from "@/lib/metrics";

export default function TimelinePage() {
  return (
    <>
      <h1>Linea de tiempo</h1>
      <p className="lede">Secuencia navegable desde emision documental hasta accion gubernamental, sin confundir anuncio, norma, presupuesto, ejecucion y resultado.</p>
      <section className="timeline">
        {buildTimeline().map((event) => (
          <article className="timeline-item card" key={`${event.type}-${event.id}`}>
            <strong>{event.date}</strong>
            <h2>{event.title}</h2>
            <p>{event.type} - {event.sector}</p>
            <span className="tag">{event.state}</span>
          </article>
        ))}
      </section>
    </>
  );
}
