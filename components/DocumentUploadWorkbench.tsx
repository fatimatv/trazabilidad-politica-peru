"use client";

import { Download, FileUp, SearchCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { Commitment } from "@/lib/types";

type Candidate = {
  id: string;
  text: string;
  sector: string;
  kind: string;
  matches: Array<{ id: string; text: string; score: number; source: string }>;
};

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
    importedAt: new Date().toISOString(),
    candidates
  };

  return (
    <section className="upload-workbench">
      <form className="card upload-form">
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
        <a
          className="button primary"
          download="preanalisis-documental.json"
          href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportPayload, null, 2))}`}
        >
          <Download size={16} aria-hidden />Exportar preanalisis
        </a>
      </aside>
    </section>
  );
}
