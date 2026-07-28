import { AdminSimulator } from "@/components/AdminSimulator";
import { auditEvents } from "@/lib/demo-data";

export default function AdminPage() {
  return (
    <>
      <h1>Administracion y revision</h1>
      <p className="lede">Flujo demo para registrar fuente, conservar texto original, revisar compromisos y auditar acciones sensibles.</p>
      <AdminSimulator />
      <section className="card" style={{ marginTop: 20 }}>
        <h2>Bitacora de auditoria</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Fecha</th><th>Actor</th><th>Accion</th><th>Entidad</th></tr></thead>
            <tbody>
              {auditEvents.map((event) => (
                <tr key={event.id}><td>{event.date}</td><td>{event.actor}</td><td>{event.action}</td><td>{event.entity}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
