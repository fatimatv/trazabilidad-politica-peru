import { AdminSimulator } from "@/components/AdminSimulator";
import { DocumentUploadWorkbench } from "@/components/DocumentUploadWorkbench";
import { auditEvents, commitments } from "@/lib/demo-data";

export default function AdminPage() {
  return (
    <>
      <h1>Administracion y revision</h1>
      <p className="lede">Carga nuevos insumos, genera un preanalisis de compromisos y conserva una bitacora para revision humana.</p>
      <DocumentUploadWorkbench commitments={commitments} />
      <section style={{ marginTop: 20 }}>
        <h2>Registro manual</h2>
        <p>Usa este formulario cuando ya tengas una fuente revisada y quieras documentar el ingreso al flujo de auditoria.</p>
      </section>
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
