import { TraceabilityGraph } from "@/components/TraceabilityGraph";
import { commitments, comparisons, sources } from "@/lib/demo-data";

export default function GraphsPage() {
  return (
    <>
      <h1>Grafos de trazabilidad</h1>
      <p className="lede">
        Visualiza como las fuentes documentales alimentan temas de politica publica y como esos temas derivan en
        continuidad, reformulacion, matices, cambios de prioridad u omisiones.
      </p>
      <section className="card">
        <h2>Red fuente-tema-evolucion</h2>
        <p>
          Los nodos superiores son fuentes, los nodos centrales son temas y los nodos inferiores resumen relaciones
          de evolucion detectadas en el comparador. El grosor de cada linea representa volumen documental.
        </p>
        <TraceabilityGraph sources={sources} commitments={commitments} comparisons={comparisons} />
      </section>
    </>
  );
}
