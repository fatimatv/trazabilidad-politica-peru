"use client";

import { Save, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function AdminSimulator() {
  const [role, setRole] = useState("REVIEWER");
  const [status, setStatus] = useState("Sin cambios");

  const canPublish = role === "ADMIN" || role === "REVIEWER";

  return (
    <section className="grid cols-2">
      <form
        className="card"
        onSubmit={(event) => {
          event.preventDefault();
          setStatus(canPublish ? "Registro guardado en cola local demo" : "Rol sin permiso para publicar");
        }}
      >
        <h2>Registrar fuente</h2>
        <label>Titulo<input required placeholder="Nombre del documento" /></label>
        <label>URL oficial<input type="url" placeholder="https://..." /></label>
        <label>Texto original<textarea required placeholder="Pegue aqui el texto o transcripcion" /></label>
        <label>
          Rol activo
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="ADMIN">Administrador</option>
            <option value="ANALYST">Analista</option>
            <option value="REVIEWER">Revisor</option>
          </select>
        </label>
        <button className="primary" type="submit"><Save size={16} aria-hidden />Guardar</button>
      </form>
      <aside className="card">
        <h2>Proteccion y auditoria</h2>
        <p><ShieldCheck size={18} aria-hidden /> El flujo distingue administrador, analista y revisor. En esta version demo se simulan permisos en cliente; la arquitectura Prisma incluye usuarios, roles y bitacora para persistencia real.</p>
        <p className="notice" aria-live="polite">{status}</p>
      </aside>
    </section>
  );
}
