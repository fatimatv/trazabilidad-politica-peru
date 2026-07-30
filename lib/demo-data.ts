import fs from "node:fs";
import path from "node:path";
import type { AuditEvent, Commitment, Comparison, GovernmentAction, Source } from "./types";

export const platformTitle = "Trazabilidad documental de compromisos presidenciales - Keiko Fujimori";
export const lastUpdated = "2026-07-28";

type ReferenceTheme = {
  id: string;
  nombre: string;
  icono?: string;
};

type ReferenceProposal = {
  id: string;
  candidato: "keiko";
  tema: string;
  tipo: "propuesta" | "meta" | "diagnostico" | "principio" | "100dias";
  relevancia: "ALTA" | "MEDIA" | "BAJA" | "100 DÍAS";
  texto: string;
  cita_textual: string;
  fuente: {
    archivo: string;
    seccion: string;
    linea_inicio: number;
    linea_fin: number;
  };
  meta_cuantitativa?: string | null;
};

type ReferenceDeclaration = {
  id: string;
  debate_id: "debate-1" | "debate-2";
  candidato: "keiko";
  vocero?: string | null;
  tema: string;
  tipo: "propuesta" | "diagnostico" | "ataque" | "defensa" | "cifra" | "compromiso" | "principio" | "evasion";
  texto: string;
  cita_textual: string;
  contexto: string;
  fuente: {
    archivo: string;
    linea_inicio: number;
    linea_fin: number;
  };
};

type ReferencePlanDebate = {
  id: string;
  candidato: "keiko";
  propuesta_id?: string | null;
  declaracion_id?: string | null;
  relacion: "CONSISTENTE" | "AMPLIA_DEBATE" | "VAGUEA" | "CONTRADICE_DEBATE" | "OMITE" | "NUEVO_DEBATE";
  analisis: string;
};

type ReferenceData = {
  temas: ReferenceTheme[];
  propuestas: ReferenceProposal[];
  declaraciones: ReferenceDeclaration[];
  plan_vs_debate: ReferencePlanDebate[];
};

const root = process.cwd();
const inputDir = path.join(root, "Insumos");
const reference = JSON.parse(fs.readFileSync(path.join(root, "data", "keiko-reference.json"), "utf8")) as ReferenceData;
const themeName = new Map(reference.temas.map((theme) => [theme.id, theme.nombre]));

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeToken(value: string) {
  return stripAccents(value).toLowerCase();
}

function toPlanKind(tipo: ReferenceProposal["tipo"]): Commitment["kind"] {
  if (tipo === "diagnostico") return "Diagnostico";
  if (tipo === "principio") return "Orientacion politica general";
  if (tipo === "meta") return "Promesa concreta";
  if (tipo === "100dias") return "Promesa concreta";
  return "Promesa concreta";
}

function toDebateKind(tipo: ReferenceDeclaration["tipo"]): Commitment["kind"] {
  if (tipo === "diagnostico" || tipo === "cifra") return "Diagnostico";
  if (tipo === "principio") return "Orientacion politica general";
  if (tipo === "compromiso" || tipo === "propuesta") return "Promesa concreta";
  return "Orientacion politica general";
}

function sourceForDebate(debateId: ReferenceDeclaration["debate_id"]) {
  return debateId === "debate-1" ? "src-debate-presidencial" : "src-debate-tecnico";
}

function sourceTitle(sourceId: string) {
  return sources.find((source) => source.id === sourceId)?.title ?? "Fuente documental";
}

function getThemeName(themeId: string) {
  return themeName.get(themeId) ?? themeId;
}

function readInput(file: string) {
  return fs.readFileSync(path.join(inputDir, file), "utf8");
}

function planToCommitment(item: ReferenceProposal): Commitment {
  const sector = getThemeName(item.tema);
  return {
    id: `c-${item.id}`,
    stableId: item.id,
    sourceId: "src-plan-gobierno",
    documentTitle: "Plan de Gobierno 2026-2031: Peru con Orden",
    emittedAt: "PENDIENTE-CONFIRMAR",
    speaker: "Fuerza Popular",
    organization: "Fuerza Popular",
    kind: toPlanKind(item.tipo),
    sector,
    topic: item.fuente.seccion,
    normalizedText: item.texto,
    originalExcerpt: item.cita_textual,
    promisedAction: item.tipo === "diagnostico" || item.tipo === "principio" ? undefined : item.texto,
    quantitativeGoal: item.meta_cuantitativa ?? undefined,
    announcedDeadline: item.tipo === "100dias" ? "Primeros 100 dias" : undefined,
    expectedInstrument: item.tipo === "100dias" ? "Medida de primeros 100 dias" : undefined,
    tags: ["plan-gobierno", item.tema, item.tipo, item.relevancia].map(stripAccents),
    verificationState: "PUBLISHED",
    implementationState: "Por cumplir",
    confidence: item.relevancia === "ALTA" ? 0.78 : 0.7,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: `ev-${item.id}`,
        sourceId: "src-plan-gobierno",
        label: `${item.fuente.archivo}:L${item.fuente.linea_inicio}-L${item.fuente.linea_fin}`,
        excerpt: item.cita_textual,
        confidence: 0.76
      }
    ],
    history: [{ date: lastUpdated, actor: "referencia-estructurada", change: "Importado desde el dataset de seguimiento de planes de gobierno." }]
  };
}

function debateToCommitment(item: ReferenceDeclaration): Commitment {
  const sourceId = sourceForDebate(item.debate_id);
  const sector = getThemeName(item.tema);
  return {
    id: `c-${item.id}`,
    stableId: item.id,
    sourceId,
    documentTitle: sourceTitle(sourceId),
    emittedAt: "PENDIENTE-CONFIRMAR",
    speaker: item.vocero ?? "Keiko Fujimori",
    organization: "Fuerza Popular",
    kind: toDebateKind(item.tipo),
    sector,
    topic: item.contexto,
    normalizedText: item.texto,
    originalExcerpt: item.cita_textual,
    promisedAction: item.tipo === "compromiso" || item.tipo === "propuesta" ? item.texto : undefined,
    tags: ["debate", item.debate_id, item.tema, item.tipo].map(stripAccents),
    verificationState: "PUBLISHED",
    implementationState: "Por cumplir",
    confidence: 0.74,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: `ev-${item.id}`,
        sourceId,
        label: `${item.fuente.archivo}:L${item.fuente.linea_inicio}-L${item.fuente.linea_fin}`,
        excerpt: item.cita_textual,
        confidence: 0.74
      }
    ],
    history: [{ date: lastUpdated, actor: "referencia-estructurada", change: "Importado desde declaraciones procesadas de debate." }]
  };
}

function speechSector(text: string) {
  const value = normalizeToken(text);
  if (/seguridad|crimen|policia|carcel|extorsion|sicariato|narcotrafico|mafias/.test(value)) return "Seguridad Ciudadana";
  if (/nino|alimentacion|pronaa|primera infancia|anemia|desnutricion|adolescente/.test(value)) return "Niñez y Adolescencia";
  if (/joven|beca 18|capital semilla|empleo juvenil/.test(value)) return "Juventud";
  if (/adultos mayores|pension 65|pension universal/.test(value)) return "Pensiones / Programas Sociales";
  if (/agua|desague|riego|presas|pozos|infraestructura social/.test(value)) return "Agua y Saneamiento";
  if (/metro|carretera|vial|transporte|puerto/.test(value)) return "Transporte e Infraestructura";
  if (/estado|tramites|digital|compras publicas|servicio civil|desregulacion/.test(value)) return "Modernizacion del Estado";
  if (/mype|cofide|credito|formalidad|inversion|tributaria|laboral/.test(value)) return "MYPE y Emprendimiento";
  if (/fenomeno el nino|defensas riberenas|cuencas|contingencia/.test(value)) return "Gestion del Riesgo";
  if (/politica exterior|integracion|alianzas/.test(value)) return "Relaciones Exteriores";
  return "Gobernanza";
}

function speechKind(text: string): Commitment["kind"] {
  const value = normalizeToken(text);
  if (/%|\b[0-9][0-9.,]*\b|mitad|duplicando|primeros cien dias/.test(value)) return "Promesa concreta";
  if (/vamos a|implementaremos|impulsaremos|crearemos|lanzaremos|reduciremos|culminaremos|ejecutaremos|reorganizaremos|fortaleceremos|ampliaremos|presentaremos|emitiremos|solicitaremos/.test(value)) return "Promesa concreta";
  return "Orientacion politica general";
}

function parseSpeechCommitments(): Commitment[] {
  const content = readInput("mensaje-a-la-nacion-28-de-julio.md");
  const lines = content.split(/\r?\n/);
  const promisePattern = /(implementaremos|impulsaremos|fortaleceremos|reorganizaremos|relanzaremos|lanzaremos|expandiremos|ampliaremos|crearemos|culminaremos|ejecutaremos|reduciremos|iniciaremos|garantizaremos|presentaremos|emitiremos|solicitaremos|modernizaci[oó]n|vamos a recuperar|vamos a garantizar|construiremos|otorgaremos|duplicando|pol[ií]tica de estado|programa nacional|programa multisectorial)/i;
  const paragraphs: Array<{ start: number; end: number; text: string }> = [];
  let start = 1;
  let buffer: string[] = [];

  lines.forEach((line, index) => {
    const text = line.trim();
    if (!text) {
      if (buffer.length) {
        paragraphs.push({ start, end: index, text: buffer.join(" ").replace(/\s+/g, " ") });
        buffer = [];
      }
      start = index + 2;
      return;
    }
    if (!buffer.length) start = index + 1;
    buffer.push(text.replace(/^[-•]\s*/, ""));
  });

  if (buffer.length) paragraphs.push({ start, end: lines.length, text: buffer.join(" ").replace(/\s+/g, " ") });

  return paragraphs
    .filter((paragraph) => promisePattern.test(paragraph.text) && paragraph.text.length > 40 && paragraph.text.length < 900)
    .map((paragraph, index): Commitment => {
      const stableId = `mensaje-k-${String(index + 1).padStart(3, "0")}`;
      const sector = speechSector(paragraph.text);
      return {
        id: `c-${stableId}`,
        stableId,
        sourceId: "src-investidura",
        documentTitle: "Mensaje a la Nación del 28 de julio de 2026",
        emittedAt: "2026-07-28",
        speaker: "Keiko Fujimori",
        organization: "Presidencia de la República",
        kind: speechKind(paragraph.text),
        sector,
        topic: sector,
        normalizedText: paragraph.text,
        originalExcerpt: paragraph.text,
        promisedAction: paragraph.text,
        tags: ["mensaje-presidencial", sector].map(stripAccents),
        verificationState: "PUBLISHED",
        implementationState: "Por cumplir",
        confidence: 0.68,
        isDemo: false,
        lastReviewedAt: lastUpdated,
        evidence: [
          {
            id: `ev-${stableId}`,
            sourceId: "src-investidura",
            label: `Insumos/mensaje-a-la-nacion-28-de-julio.md:L${paragraph.start}-L${paragraph.end}`,
            excerpt: paragraph.text,
            confidence: 0.68
          }
        ],
        history: [{ date: lastUpdated, actor: "parser-local", change: "Extraido por regla de verbos de ofrecimiento en mensaje presidencial." }]
      };
    });
}

export const sources: Source[] = [
  {
    id: "src-plan-gobierno",
    title: "Plan de gobierno de Keiko Fujimori / Fuerza Popular",
    type: "Plan de gobierno",
    issuedAt: "PENDIENTE-CONFIRMAR",
    status: "PUBLISHED",
    coverage: 1,
    isDemo: false,
    note: "446 propuestas, metas, diagnosticos, principios y compromisos de 100 dias importados desde el proyecto de referencia."
  },
  {
    id: "src-debate-presidencial",
    title: "Debate presidencial de Keiko Fujimori",
    type: "Debate presidencial",
    issuedAt: "PENDIENTE-CONFIRMAR",
    status: "PUBLISHED",
    coverage: 1,
    isDemo: false,
    note: "47 declaraciones estructuradas del debate presidencial."
  },
  {
    id: "src-debate-tecnico",
    title: "Debate técnico de Fuerza Popular",
    type: "Debate técnico",
    issuedAt: "PENDIENTE-CONFIRMAR",
    status: "PUBLISHED",
    coverage: 1,
    isDemo: false,
    note: "34 declaraciones de vocerías técnicas de Fuerza Popular."
  },
  {
    id: "src-investidura",
    title: "Mensaje a la Nación del 28 de julio de 2026",
    type: "Mensaje presidencial",
    issuedAt: "2026-07-28",
    status: "PUBLISHED",
    coverage: 0.78,
    isDemo: false,
    note: "Ofrecimientos extraidos del discurso local mediante reglas de verbos de compromiso; cumplimiento aun por evaluar."
  }
];

export const commitments: Commitment[] = [
  ...reference.propuestas.map(planToCommitment),
  ...reference.declaraciones.map(debateToCommitment),
  ...parseSpeechCommitments()
];

function tokensFor(item: Commitment) {
  const stop = new Set(["para", "como", "este", "esta", "sera", "seran", "cada", "desde", "hasta", "entre", "sobre", "tambien", "nuestra", "nuestro", "pais", "peru", "gobierno"]);
  return new Set(
    normalizeToken(`${item.sector} ${item.topic} ${item.tags.join(" ")} ${item.normalizedText}`)
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3 && !stop.has(token))
  );
}

function scorePair(a: Commitment, b: Commitment) {
  const tokensA = tokensFor(a);
  const tokensB = tokensFor(b);
  let overlap = 0;
  tokensA.forEach((token) => {
    if (tokensB.has(token)) overlap += 1;
  });
  const lexical = overlap / Math.max(Math.min(tokensA.size, tokensB.size), 1);
  const sectorBoost = a.sector === b.sector ? 0.26 : normalizeToken(a.sector).includes(normalizeToken(b.sector)) || normalizeToken(b.sector).includes(normalizeToken(a.sector)) ? 0.16 : 0;
  const numericBoost = /\b[0-9][0-9.,%]*\b/.test(a.normalizedText) && /\b[0-9][0-9.,%]*\b/.test(b.normalizedText) ? 0.06 : 0;
  return Math.min(1, lexical + sectorBoost + numericBoost);
}

function relationFor(score: number, from: Commitment, to: Commitment): Comparison["relationType"] {
  if (score >= 0.58) return "Coincidencia sustantiva";
  if (score >= 0.42 && to.normalizedText.length > from.normalizedText.length * 1.2) return "Reformulacion";
  if (score >= 0.42) return "Coincidencia parcial";
  if (score >= 0.3) return "Matiz";
  return "Cambio de prioridad";
}

function translateReferenceRelation(relacion: ReferencePlanDebate["relacion"]): Comparison["relationType"] {
  if (relacion === "CONSISTENTE") return "Coincidencia sustantiva";
  if (relacion === "AMPLIA_DEBATE") return "Reformulacion";
  if (relacion === "VAGUEA") return "Matiz";
  if (relacion === "CONTRADICE_DEBATE") return "Contradiccion directa";
  if (relacion === "NUEVO_DEBATE") return "Reformulacion";
  return "Omision relevante";
}

function buildReferenceComparisons() {
  return reference.plan_vs_debate
    .filter((item) => item.propuesta_id && item.declaracion_id)
    .map((item): Comparison | null => {
      const from = commitments.find((commitment) => commitment.stableId === item.propuesta_id);
      const to = commitments.find((commitment) => commitment.stableId === item.declaracion_id);
      if (!from || !to) return null;
      return {
        id: item.id,
        fromCommitmentId: from.id,
        toCommitmentId: to.id,
        relationType: translateReferenceRelation(item.relacion),
        justification: item.analisis,
        evidenceFor: `${from.originalExcerpt} / ${to.originalExcerpt}`,
        evidenceAgainst: "Relacion importada como analisis preliminar; requiere revision humana antes de publicarse como conclusion.",
        confidence: item.relacion === "CONSISTENTE" ? 0.82 : 0.72,
        method: "Comparacion estructurada del proyecto de referencia",
        generatedBy: "seguimiento-planes-referencia",
        analyzedAt: lastUpdated,
        state: "AUTOMATIC"
      };
    })
    .filter((item): item is Comparison => item !== null);
}

export function buildComparisons(fromSourceId = "src-plan-gobierno", toSourceId = "src-debate-presidencial") {
  const left = commitments.filter((item) => item.sourceId === fromSourceId && item.kind !== "Diagnostico");
  const right = commitments.filter((item) => item.sourceId === toSourceId);
  return left
    .map((from): Comparison | null => {
      const candidates = right
        .map((to) => ({ to, score: scorePair(from, to) }))
        .filter((item) => item.score >= 0.28)
        .sort((a, b) => b.score - a.score);
      const best = candidates[0];
      if (!best) return null;
      return {
        id: `cmp-${from.stableId}-${best.to.stableId}`,
        fromCommitmentId: from.id,
        toCommitmentId: best.to.id,
        relationType: relationFor(best.score, from, best.to),
        justification: "Relacion preliminar por continuidad de tema, vocabulario y alcance entre etapas documentales.",
        evidenceFor: `${from.originalExcerpt} / ${best.to.originalExcerpt}`,
        evidenceAgainst: "Puede haber matices no capturados por la regla automatica; debe revisarse contra las fuentes primarias.",
        confidence: Math.min(0.86, Math.max(0.5, best.score)),
        method: "Coincidencia tematica y lexical con penalizacion por baja especificidad",
        generatedBy: "local-evolution-mapper-v2",
        analyzedAt: lastUpdated,
        state: "AUTOMATIC"
      };
    })
    .filter((item): item is Comparison => item !== null);
}

export const comparisons: Comparison[] = [
  ...buildReferenceComparisons(),
  ...buildComparisons("src-debate-presidencial", "src-debate-tecnico"),
  ...buildComparisons("src-debate-tecnico", "src-investidura"),
  ...buildComparisons("src-plan-gobierno", "src-investidura")
].filter((comparison, index, list) => list.findIndex((item) => item.id === comparison.id) === index);

export const actions: GovernmentAction[] = commitments
  .filter((commitment) => commitment.sourceId === "src-investidura")
  .map((commitment): GovernmentAction => ({
    id: `act-${commitment.stableId}`,
    commitmentId: commitment.id,
    title: `Anuncio presidencial vinculado: ${commitment.sector}`,
    actionType: "Anuncio presidencial",
    entity: "Presidencia de la República",
    status: "Iniciativa formal",
    occurredAt: "2026-07-28",
    notes: "Registro creado desde el mensaje presidencial local. No equivale a norma aprobada, presupuesto ejecutado ni resultado verificado."
  }));

export const auditEvents: AuditEvent[] = [
  { id: "audit-001", date: lastUpdated, actor: "referencia-estructurada", action: "Importacion completa de plan Keiko", entity: "src-plan-gobierno" },
  { id: "audit-002", date: lastUpdated, actor: "referencia-estructurada", action: "Importacion completa de debates Keiko", entity: "src-debate-presidencial/src-debate-tecnico" },
  { id: "audit-003", date: lastUpdated, actor: "parser-local", action: "Extraccion ampliada de ofrecimientos del mensaje presidencial", entity: "src-investidura" }
];
