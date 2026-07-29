"use client";

import { CheckCircle2, FileText, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function AdminSimulator() {
  const [role, setRole] = useState("REVIEWER");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [status, setStatus] = useState<{ tone: "idle" | "success" | "error"; message: string }>({
    tone: "idle",
    message: "Aun no hay registros manuales guardados en esta sesion."
  });
  const [savedRows, setSavedRows] = useState<Array<{ id: string; title: string; fileName: string; reviewer: string }>>([]);

  const canPublish = role === "ADMIN" || role === "REVIEWER";

  return (
    <section className="grid cols-2">
      <form
        className="card"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!canPublish) {
            setStatus({ tone: "error", message: "El rol seleccionado no tiene permiso para guardar fuentes." });
            return;
          }
          if (!title.trim() || !originalText.trim()) {
            setStatus({ tone: "error", message: "Selecciona un archivo Markdown para extraer el texto y guardar la fuente." });
            return;
          }
          const response = await fetch("/api/sources", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-demo-role": role
            },
            body: JSON.stringify({
              title,
              url,
              fileName,
              documentType: "Fuente revisada",
              originalText
            })
          });
          const payload = await response.json();
          if (!response.ok) {
            setStatus({ tone: "error", message: payload.error ?? "No se pudo guardar la fuente." });
            return;
          }
          const saved = { id: payload.data.id as string, title, fileName, reviewer: "Revisor documental" };
          setSavedRows((current) => [saved, ...current].slice(0, 5));
          setStatus({
            tone: "success",
            message: `Fuente guardada: ${saved.id}. Estado: lista para revision. Responsable: ${saved.reviewer}.`
          });
        }}
      >
        <h2>Registrar fuente</h2>
        <label>Titulo<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nombre del documento" /></label>
        <label>URL oficial<input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." /></label>
        <label>
          Archivo Markdown
          <input
            accept=".md,.markdown"
            required
            type="file"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setFileName(file.name);
              setTitle((current) => current || file.name.replace(/\.(md|markdown)$/i, ""));
              setOriginalText(await file.text());
            }}
          />
        </label>
        {fileName ? (
          <p className="file-confirmation"><FileText size={16} aria-hidden />Texto extraido de {fileName}</p>
        ) : null}
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
        <p><ShieldCheck size={18} aria-hidden /> El flujo distingue administrador, analista y revisor. En esta demo puedes asumir esos roles desde el selector; en operacion real serian perfiles separados con bitacora.</p>
        <div className="role-guide" aria-label="Responsabilidades por rol">
          <article>
            <strong>Analista</strong>
            <span>Ordena fuente, fecha, tipo de documento y citas verificables.</span>
          </article>
          <article>
            <strong>Revisor</strong>
            <span>Confirma si la lectura del compromiso esta bien sustentada.</span>
          </article>
          <article>
            <strong>Administrador</strong>
            <span>Aprueba la publicacion en compromisos, comparador y grafos.</span>
          </article>
        </div>
        <p className={`upload-status ${status.tone}`} aria-live="polite"><CheckCircle2 size={18} aria-hidden />{status.message}</p>
        {savedRows.length ? (
          <div className="processing-queue">
            <h3>Guardados recientes</h3>
            {savedRows.map((row) => (
              <article key={row.id}>
                <strong>{row.title}</strong>
                <span>{row.fileName} / {row.id}</span>
                <small>{row.reviewer} debe validar metadatos, cita y pertinencia antes de publicar.</small>
              </article>
            ))}
          </div>
        ) : null}
      </aside>
    </section>
  );
}
