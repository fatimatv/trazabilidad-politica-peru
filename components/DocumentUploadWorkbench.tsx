"use client";

import { CheckCircle2, ClipboardCheck, Download, FileUp, SearchCheck, Send } from "lucide-react";
import { useMemo, useState } from "react";
import type { Commitment } from "@/lib/types";

type Candidate = {
  id: string;
  text: string;
  sector: string;
  kind: string;
  matches: Array<{ id: string; text: string; score: number; source: string }>;
};

type QueueItem = {
  id: string;
  title: string;
  candidates: number;
  documentType: string;
  reviewer: string;
  nextStep: string;
  status: "Pendiente de revision" | "En revision documental" | "Aprobado para publicar";
};

const reviewSteps = [
  ["Recibido", "Automatico: el documento queda registrado con ID y texto extraido."],
  ["Preanalisis", "Automatico: el sistema propone compromisos, temas y posibles vinculos."],
  ["Revision documental", "Analista: valida citas, fuente, fecha, tipo documental y segmentacion."],
  ["Revision juridica/politica", "Revisor: confirma alcance, consistencia, omisiones y fuerza probatoria."],
  ["Actualizacion", "Administrador: publica cambios aprobados en compromisos, comparador y grafos."]
];

const reviewResponsibilities = [
  ["Tu accion", "Revisar los candidatos del preanalisis, corregir vinculos y marcar si cada idea se conserva, cambia, se matiza, desaparece o aparece nueva."],
  ["Analista documental", "Comprueba que cada candidato tenga fuente, fecha, cita o extracto y una segmentacion razonable."],
  ["Revisor", "Valida la interpretacion politica/juridica antes de convertirla en conclusion publica."],
  ["Administrador", "Publica solo lo aprobado y deja trazabilidad en la bitacora."]
];

const sectorRules: Array<[string, RegExp]> = [
  ["Seguridad Ciudadana", /seguridad|crimen|policia|carcel|extorsion|sicariato|narcotrafico|mafias/i],
  ["Economia / Macroeconomia", /economia|crecimiento|inversion|tributaria|fiscal|pbi|empleo/i],
  ["MYPE y Emprendimiento", /mype|emprendedor|cofide|credito|formalidad|compras myperu/i],
  ["Agua y Saneamiento", /agua|desague|saneamiento|riego|presas|pozos/i],
  ["Transporte e Infraestructura", /metro|carretera|vial|transporte|puerto|infraestructura/i],
  ["Juventud", /joven|beca|capital semilla|empleo juvenil/i],
  ["Modernizacion del Estado", /estado|tramite|digital|compras publicas|servicio civil|desregulacion/i],
  ["Salud", /salud|hospital|medicamento|medico|postas/i],
  ["Educacion", /educacion|colegio|docente|aprendizaje|beca/i]
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function tokens(value: string) {
  const stop = new Set(["para", "como", "este", "esta", "cada", "desde", "hasta", "entre", "sobre", "tambien", "nuestro", "nuestra", "peru", "gobierno"]);
  return new Set(normalize(value).split(/[^a-z0-9]+/).filter((token) => token.length > 3 && !stop.has(token)));
}

function inferSector(text: string) {
  return sectorRules.find(([, rule]) => rule.test(text))?.[0] ?? "Gobernanza";
}

function inferKind(text: string) {
  if (/%|\b[0-9][0-9.,]*\b|mitad|duplicaremos|reduciremos/i.test(text)) return "Meta u ofrecimiento medible";
  if (/implementaremos|impulsaremos|crearemos|lanzaremos|fortaleceremos|presentaremos|emitiremos|vamos a|se implementara|se creara/i.test(text)) return "Compromiso u ofrecimiento";
  return "Declaracion relevante";
}

function scoreText(a: string, b: string) {
  const aTokens = tokens(a);
  const bTokens = tokens(b);
  let overlap = 0;
  aTokens.forEach((token) => {
    if (bTokens.has(token)) overlap += 1;
  });
  return overlap / Math.max(Math.min(aTokens.size, bTokens.size), 1);
}

export function DocumentUploadWorkbench({ commitments }: { commitments: Commitment[] }) {
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("Discurso");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<{ tone: "idle" | "success" | "error"; message: string }>({
    tone: "idle",
    message: "Sin documentos guardados en esta sesion."
  });
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const candidates = useMemo(() => {
    const paragraphs = text
      .split(/\n\s*\n|(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ])/)
      .map((item) => item.trim().replace(/\s+/g, " "))
      .filter((item) => item.length > 60 && item.length < 850)
      .filter((item) => /implementaremos|impulsaremos|crearemos|lanzaremos|fortaleceremos|presentaremos|emitiremos|vamos a|reduciremos|garantizaremos|programa|plan|norma|decreto|ley/i.test(item))
      .slice(0, 16);

    return paragraphs.map((item, index): Candidate => {
      const matches = commitments
        .map((commitment) => ({
          id: commitment.id,
          text: commitment.normalizedText,
          source: commitment.documentTitle,
          score: scoreText(item, `${commitment.sector} ${commitment.topic} ${commitment.normalizedText}`)
        }))
        .filter((match) => match.score >= 0.18)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      return {
        id: `nuevo-${String(index + 1).padStart(3, "0")}`,
        text: item,
        sector: inferSector(item),
        kind: inferKind(item),
        matches
      };
    });
  }, [commitments, text]);

  const exportPayload = {
    title: title || "Documento sin titulo",
    documentType,
    fileName,
    importedAt: new Date().toISOString(),
    candidates
  };

  return (
    <section className="upload-workbench">
      <form
        className="card upload-form"
        id="upload-form"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!title.trim() || !text.trim()) {
            setStatus({ tone: "error", message: "Falta titulo o archivo/texto para guardar el insumo." });
            return;
          }
          const response = await fetch("/api/sources", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-demo-role": "REVIEWER"
            },
            body: JSON.stringify({
              title,
              documentType,
              fileName,
              originalText: text,
              candidates
            })
          });
          const payload = await response.json();
          if (!response.ok) {
            setStatus({ tone: "error", message: payload.error ?? "No se pudo guardar el insumo." });
            return;
          }
          const saved = {
            id: payload.data.id as string,
            title,
            documentType,
            candidates: candidates.length,
            reviewer: "Analista documental",
            nextStep: "Validar citas, metadatos y candidatos detectados",
            status: "Pendiente de revision" as const
          };
          setQueue((current) => [saved, ...current].slice(0, 5));
          setStatus({
            tone: "success",
            message: `Insumo guardado: ${saved.id}. Estado: Recibido. Responsable siguiente: ${saved.reviewer}.`
          });
        }}
      >
        <div className="section-heading compact">
          <div>
            <h2>Cargar nuevo insumo</h2>
            <p>Sube discursos, notas de prensa, declaraciones, comunicados o normas para revisar consistencia y cumplimiento.</p>
          </div>
          <FileUp size={24} aria-hidden />
        </div>
        <label>
          Tipo de documento
          <select value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
            <option>Discurso</option>
            <option>Nota de prensa</option>
            <option>Declaracion</option>
            <option>Comunicado</option>
            <option>Norma</option>
            <option>Informe de avance</option>
          </select>
        </label>
        <label>Titulo o referencia<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Mensaje presidencial, comunicado, decreto..." /></label>
        <label>
          Archivo de texto
          <input
            accept=".txt,.md,.csv,.json"
            type="file"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setFileName(file.name);
              setTitle((current) => current || file.name.replace(/\.[^.]+$/, ""));
              setText(await file.text());
            }}
          />
        </label>
        <label>Texto original<textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Pega aqui el texto si no tienes archivo." /></label>
      </form>

      <aside className="card upload-results">
        <div className="section-heading compact">
          <div>
            <h2>Preanalisis</h2>
            <p>{candidates.length} posibles compromisos u ofrecimientos detectados.</p>
          </div>
          <SearchCheck size={24} aria-hidden />
        </div>
        <div className="upload-actions">
          <button className="primary" type="submit" form="upload-form">
            <Send size={16} aria-hidden />Guardar para procesamiento
          </button>
          <a
            className="button"
            download="preanalisis-documental.json"
            href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportPayload, null, 2))}`}
          >
            <Download size={16} aria-hidden />Exportar preanalisis
          </a>
        </div>
        <div className={`upload-status ${status.tone}`} aria-live="polite">
          <CheckCircle2 size={18} aria-hidden />
          <span>{status.message}</span>
        </div>
        <div className="review-flow" aria-label="Flujo de revision del insumo">
          {reviewSteps.map(([step, description], index) => (
            <article className={index === 0 ? "active" : ""} key={step}>
              <strong>{step}</strong>
              <span>{description}</span>
            </article>
          ))}
        </div>
        <div className="review-guide" aria-label="Como hacer la revision">
          <h3>Como se revisa</h3>
          <p>
            En esta version, la plataforma deja el insumo en cola y te muestra el preanalisis. La revision humana consiste
            en aceptar, corregir o descartar cada candidato antes de publicarlo como compromiso trazable.
          </p>
          <div>
            {reviewResponsibilities.map(([role, description]) => (
              <article key={role}>
                <strong>{role}</strong>
                <span>{description}</span>
              </article>
            ))}
          </div>
        </div>
        {candidates.length ? (
          <div className="candidate-list" aria-live="polite">
            {candidates.map((candidate) => (
              <article key={candidate.id}>
                <span className="tag">{candidate.sector}</span>
                <strong>{candidate.kind}</strong>
                <p>{candidate.text}</p>
                {candidate.matches.length ? (
                  <ul>
                    {candidate.matches.map((match) => (
                      <li key={match.id}>
                        {Math.round(match.score * 100)}% con {match.source}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <small>No se encontro vinculo automatico suficiente; revisar como posible idea nueva.</small>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="notice">Carga o pega un texto para generar candidatos. La revision final debe hacerla una persona antes de publicar conclusiones.</p>
        )}
        {queue.length ? (
          <div className="processing-queue">
            <h3>Cola de procesamiento</h3>
            <div className="approval-instructions">
              <ClipboardCheck size={18} aria-hidden />
              <p>
                Para continuar: revisa los candidatos del preanalisis, corrige mentalmente lo que no corresponde y pulsa
                <strong> Marcar revision documental</strong>. Si el insumo esta listo para incorporarse al seguimiento,
                pulsa <strong>Aprobar incorporacion</strong>.
              </p>
            </div>
            {queue.map((item) => (
              <article className={item.status === "Aprobado para publicar" ? "approved" : ""} key={item.id}>
                <strong>{item.title}</strong>
                <span>{item.documentType} / {item.candidates} candidatos / {item.reviewer}</span>
                <span>Estado: {item.status}</span>
                <small>{item.nextStep}</small>
                <div className="queue-actions">
                  <button
                    className="button"
                    disabled={item.status === "Aprobado para publicar"}
                    type="button"
                    onClick={() => {
                      setQueue((current) =>
                        current.map((row) =>
                          row.id === item.id
                            ? {
                                ...row,
                                status: "En revision documental",
                                nextStep: "Revisar candidatos uno por uno y confirmar si actualizan cumplimiento o solo agregan contexto"
                              }
                            : row
                        )
                      );
                      setStatus({
                        tone: "success",
                        message: `${item.id}: revision documental abierta. Revisa candidatos, citas y vinculos antes de aprobar.`
                      });
                    }}
                  >
                    Marcar revision documental
                  </button>
                  <button
                    className="primary"
                    disabled={item.status === "Aprobado para publicar"}
                    type="button"
                    onClick={() => {
                      setQueue((current) =>
                        current.map((row) =>
                          row.id === item.id
                            ? {
                                ...row,
                                status: "Aprobado para publicar",
                                nextStep: "Listo para que el administrador lo incorpore a compromisos, comparador y grafos"
                              }
                            : row
                        )
                      );
                      setStatus({
                        tone: "success",
                        message: `${item.id}: aprobado. En esta demo queda marcado como listo para publicacion; en produccion se guardaria en base de datos y actualizaria la plataforma.`
                      });
                    }}
                  >
                    Aprobar incorporacion
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </aside>
    </section>
  );
}
