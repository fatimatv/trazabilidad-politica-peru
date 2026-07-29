import fs from "node:fs";
import path from "node:path";
import type { AuditEvent, Commitment, Comparison, GovernmentAction, Source } from "./types";

export const platformTitle = "Trazabilidad documental de compromisos presidenciales - Keiko Fujimori";
export const lastUpdated = "2026-07-28";

const root = process.cwd();
const inputDir = path.join(root, "Insumos");

const sourceConfig = {
  debate1: {
    id: "src-debate-presidencial",
    file: "keiko.md",
    title: "Debate presidencial de Keiko Fujimori",
    type: "Debate presidencial",
    speaker: "Keiko Fujimori",
    organization: "Fuerza Popular"
  },
  debate2: {
    id: "src-debate-tecnico",
    file: "keiko debate técnico.md",
    title: "Debate técnico de Fuerza Popular",
    type: "Debate técnico",
    speaker: "Equipo técnico de Fuerza Popular",
    organization: "Fuerza Popular"
  }
} as const;

function readInput(file: string) {
  return fs.readFileSync(path.join(inputDir, file), "utf8");
}

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function toKind(raw: string) {
  const value = stripAccents(raw.toLowerCase());
  if (value.includes("compromiso")) return "Promesa concreta";
  if (value.includes("propuesta")) return "Promesa concreta";
  if (value.includes("anuncio")) return "Anuncio";
  if (value.includes("cifra")) return "Diagnostico";
  if (value.includes("diagnostico")) return "Diagnostico";
  if (value.includes("principio")) return "Orientacion politica general";
  return "Orientacion politica general";
}

function toImplementationState(sourceId: string): Commitment["implementationState"] {
  return sourceId === "src-investidura" ? "Iniciativa formal" : "Sin accion identificada";
}

function parseDebate(source: typeof sourceConfig[keyof typeof sourceConfig]) {
  const content = readInput(source.file);
  const records = Array.from(content.matchAll(
    /^###\s+`([^`]+)`\s+[—-]\s+(.+?)\s*\(([^)]+)\)\s*[\r\n]+[\s\S]*?\*\*Líneas:\*\*\s*([^\r\n]+)[\r\n]+[\s\S]*?(?:\*\*Vocero:\*\*\s*([^\r\n]+)[\r\n]+[\s\S]*?)?\*\*Texto:\*\*\s*([^\r\n]+)[\r\n]+[\s\S]*?^>\s*(.+)$/gmu
  ));

  return records.map((record): Commitment => {
    const stableId = record[1].trim();
    const sector = record[2].trim();
    const rawKind = record[3].trim();
    const lineRef = record[4].trim();
    const vocero = record[5]?.trim();
    const text = record[6].trim();
    const quote = record[7].trim();
    const topic = sector.includes("/") ? sector.split("/")[0].trim() : sector;
    return {
      id: `c-${stableId}`,
      stableId,
      sourceId: source.id,
      documentTitle: source.title,
      emittedAt: "PENDIENTE-CONFIRMAR",
      speaker: vocero ?? source.speaker,
      organization: source.organization,
      kind: toKind(rawKind),
      sector,
      topic,
      geography: sector.includes("Transporte") ? "Nacional / urbano" : "Nacional",
      normalizedText: text,
      originalExcerpt: quote,
      promisedAction: text,
      expectedInstrument: rawKind.includes("propuesta") || rawKind.includes("compromiso") ? "Pendiente de identificar" : undefined,
      tags: ["insumo-local", source.type, rawKind, sector].map(stripAccents),
      verificationState: "UNVERIFIED",
      implementationState: toImplementationState(source.id),
      confidence: 0.72,
      isDemo: false,
      lastReviewedAt: lastUpdated,
      evidence: [
        {
          id: `ev-${stableId}`,
          sourceId: source.id,
          label: lineRef,
          excerpt: quote,
          confidence: 0.72
        }
      ],
      history: [
        {
          date: lastUpdated,
          actor: "parser-local",
          change: `Importado desde ${source.file}; requiere contraste con fuente primaria oficial.`
        }
      ]
    };
  }).slice(0, 22);
}

const investitureCommitments: Commitment[] = [
  {
    id: "c-investidura-001",
    stableId: "investidura-k-001",
    sourceId: "src-investidura",
    documentTitle: "Mensaje a la Nación del 28 de julio de 2026",
    emittedAt: "2026-07-28",
    speaker: "Keiko Fujimori",
    organization: "Presidencia de la República",
    kind: "Promesa concreta",
    sector: "Seguridad Ciudadana",
    topic: "Emergencias y seguridad ciudadana",
    geography: "Nacional",
    targetPopulation: "Familias peruanas",
    normalizedText: "Priorizar emergencias y seguridad ciudadana como primer objetivo del gobierno.",
    originalExcerpt: "El primer objetivo: Emergencias y Seguridad ciudadana.",
    promisedAction: "Concentrar recursos extraordinarios en mitigación del Fenómeno El Niño y seguridad ciudadana.",
    announcedDeadline: "Plazo inmediato",
    expectedInstrument: "Decretos de urgencia y facultades delegadas",
    tags: ["mensaje-presidencial", "seguridad", "emergencia"],
    verificationState: "UNVERIFIED",
    implementationState: "Iniciativa formal",
    confidence: 0.7,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: "ev-investidura-001",
        sourceId: "src-investidura",
        label: "Insumos/mensaje-a-la-nacion-28-de-julio.md:L182-L190",
        excerpt: "En el plazo inmediato mi gobierno estará concentrado, en dos frentes de emergencia nacional: mitigación del fenómeno El Niño y Seguridad ciudadana.",
        confidence: 0.7
      }
    ],
    history: [{ date: lastUpdated, actor: "curaduria-local", change: "Compromiso extraído del mensaje presidencial local." }]
  },
  {
    id: "c-investidura-002",
    stableId: "investidura-k-002",
    sourceId: "src-investidura",
    documentTitle: "Mensaje a la Nación del 28 de julio de 2026",
    emittedAt: "2026-07-28",
    speaker: "Keiko Fujimori",
    organization: "Presidencia de la República",
    kind: "Promesa concreta",
    sector: "Seguridad Ciudadana",
    topic: "Recuperación territorial",
    geography: "Nacional",
    normalizedText: "Recuperar barrios, carreteras y espacios públicos tomados por crimen organizado, narcotráfico o minería ilegal.",
    originalExcerpt: "vamos a recuperar cada barrio, cada carretera y cada espacio público para las familias peruanas.",
    promisedAction: "Usar herramientas constitucionales y estados de emergencia cuando corresponda.",
    expectedInstrument: "Estados de emergencia / acciones de seguridad",
    tags: ["mensaje-presidencial", "seguridad", "orden-interno"],
    verificationState: "UNVERIFIED",
    implementationState: "Iniciativa formal",
    confidence: 0.7,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: "ev-investidura-002",
        sourceId: "src-investidura",
        label: "Insumos/mensaje-a-la-nacion-28-de-julio.md:L212-L222",
        excerpt: "Durante los estados de emergencia, las Fuerzas Armadas asumirán temporalmente el liderazgo de las operaciones de seguridad y del control del orden interno.",
        confidence: 0.7
      }
    ],
    history: [{ date: lastUpdated, actor: "curaduria-local", change: "Compromiso extraído del mensaje presidencial local." }]
  },
  {
    id: "c-investidura-003",
    stableId: "investidura-k-003",
    sourceId: "src-investidura",
    documentTitle: "Mensaje a la Nación del 28 de julio de 2026",
    emittedAt: "2026-07-28",
    speaker: "Keiko Fujimori",
    organization: "Presidencia de la República",
    kind: "Promesa concreta",
    sector: "Juventud",
    topic: "Jóvenes con Futuro",
    targetPopulation: "Jóvenes de 14 a 24 años",
    normalizedText: "Crear la política de Estado Jóvenes con Futuro para inserción económica juvenil, programas de empleo y capital semilla.",
    originalExcerpt: "La segunda Política de Estado a la que llamaremos “Jóvenes con Futuro” tendrá como objetivo impulsar la inserción económica de los jóvenes.",
    promisedAction: "Expandir Jóvenes Productivos, Capital Semilla Joven y apoyo integral al emprendedor.",
    quantitativeGoal: "Reducir la tasa de desempleo juvenil de casi 10% a la mitad.",
    expectedInstrument: "Política de Estado / programas sociales",
    tags: ["mensaje-presidencial", "juventud", "empleo"],
    verificationState: "UNVERIFIED",
    implementationState: "Iniciativa formal",
    confidence: 0.74,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: "ev-investidura-003",
        sourceId: "src-investidura",
        label: "Insumos/mensaje-a-la-nacion-28-de-julio.md:L349-L359",
        excerpt: "Expandiremos y mejoraremos la calidad de los programas para fortalecer sus capacidades para el empleo, incluyendo Jóvenes Productivos, Capital Semilla Joven.",
        confidence: 0.74
      }
    ],
    history: [{ date: lastUpdated, actor: "curaduria-local", change: "Compromiso extraído del mensaje presidencial local." }]
  },
  {
    id: "c-investidura-004",
    stableId: "investidura-k-004",
    sourceId: "src-investidura",
    documentTitle: "Mensaje a la Nación del 28 de julio de 2026",
    emittedAt: "2026-07-28",
    speaker: "Keiko Fujimori",
    organization: "Presidencia de la República",
    kind: "Promesa concreta",
    sector: "Agua y Saneamiento",
    topic: "Infraestructura social",
    geography: "Nacional",
    normalizedText: "Expandir infraestructura social mediante programas de agua, desagüe, electricidad, telefonía, internet, educación y salud.",
    originalExcerpt: "expandiremos la infraestructura social con la reorganización de los programas de agua y desagüe, electricidad, telefonía e internet.",
    promisedAction: "Reorganizar programas de infraestructura social y expandir acceso a agua potable.",
    expectedInstrument: "Programas de infraestructura social",
    tags: ["mensaje-presidencial", "agua", "infraestructura"],
    verificationState: "UNVERIFIED",
    implementationState: "Iniciativa formal",
    confidence: 0.72,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: "ev-investidura-004",
        sourceId: "src-investidura",
        label: "Insumos/mensaje-a-la-nacion-28-de-julio.md:L404-L420",
        excerpt: "Expandiremos el acceso al agua potable con plantas de tratamiento y sistemas de distribución.",
        confidence: 0.72
      }
    ],
    history: [{ date: lastUpdated, actor: "curaduria-local", change: "Compromiso extraído del mensaje presidencial local." }]
  },
  {
    id: "c-investidura-005",
    stableId: "investidura-k-005",
    sourceId: "src-investidura",
    documentTitle: "Mensaje a la Nación del 28 de julio de 2026",
    emittedAt: "2026-07-28",
    speaker: "Keiko Fujimori",
    organization: "Presidencia de la República",
    kind: "Promesa concreta",
    sector: "Transporte e Infraestructura",
    topic: "Nueva Carretera Central",
    geography: "Lima y centro del país",
    normalizedText: "Culminar la Nueva Carretera Central como obra prioritaria para integrar Lima con el centro del país.",
    originalExcerpt: "Culminaremos la Nueva Carretera Central como una obra prioritaria para integrar Lima con el centro del país.",
    promisedAction: "Culminar obra prioritaria de infraestructura vial.",
    expectedInstrument: "Proyecto de inversión / obra pública",
    tags: ["mensaje-presidencial", "infraestructura", "carretera"],
    verificationState: "UNVERIFIED",
    implementationState: "Iniciativa formal",
    confidence: 0.74,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: "ev-investidura-005",
        sourceId: "src-investidura",
        label: "Insumos/mensaje-a-la-nacion-28-de-julio.md:L437-L439",
        excerpt: "Culminaremos la Nueva Carretera Central como una obra prioritaria para integrar Lima con el centro del país.",
        confidence: 0.74
      }
    ],
    history: [{ date: lastUpdated, actor: "curaduria-local", change: "Compromiso extraído del mensaje presidencial local." }]
  },
  {
    id: "c-investidura-006",
    stableId: "investidura-k-006",
    sourceId: "src-investidura",
    documentTitle: "Mensaje a la Nación del 28 de julio de 2026",
    emittedAt: "2026-07-28",
    speaker: "Keiko Fujimori",
    organization: "Presidencia de la República",
    kind: "Promesa concreta",
    sector: "Modernización del Estado",
    topic: "Estado digital",
    geography: "Nacional",
    normalizedText: "Simplificar el funcionamiento del Estado con tecnología, inteligencia artificial e identidad digital para cada ciudadano.",
    originalExcerpt: "Con tecnología e inteligencia artificial construiremos un Estado eficiente y cercano.",
    promisedAction: "Implementar identidad digital y simplificación de trámites.",
    expectedInstrument: "Reforma del Estado / gobierno digital",
    tags: ["mensaje-presidencial", "estado", "digitalizacion"],
    verificationState: "UNVERIFIED",
    implementationState: "Iniciativa formal",
    confidence: 0.74,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: "ev-investidura-006",
        sourceId: "src-investidura",
        label: "Insumos/mensaje-a-la-nacion-28-de-julio.md:L453-L475",
        excerpt: "Digital para cada ciudadano. Con tecnología e inteligencia artificial construiremos un Estado eficiente y cercano.",
        confidence: 0.74
      }
    ],
    history: [{ date: lastUpdated, actor: "curaduria-local", change: "Compromiso extraído del mensaje presidencial local." }]
  }
];

const planCommitments: Commitment[] = [
  {
    id: "c-plan-k-001",
    stableId: "plan-k-001",
    sourceId: "src-plan-gobierno",
    documentTitle: "Plan de Gobierno 2026-2031: Peru con Orden",
    emittedAt: "PENDIENTE-CONFIRMAR",
    speaker: "Fuerza Popular",
    organization: "Fuerza Popular",
    kind: "Promesa concreta",
    sector: "Seguridad Ciudadana",
    topic: "C5i y videovigilancia nacional",
    geography: "Nacional",
    normalizedText: "Implementar centros C5i interconectados y una plataforma de informacion en tiempo real para seguridad ciudadana.",
    originalExcerpt: "Implementación rápida de Centros de Comando y Videovigilancia (C5i) interconectados a nivel nacional, con mapas del delito en tiempo real e inteligencia artificial.",
    promisedAction: "Desplegar C5i, mapas del delito, alertas comunitarias y analisis predictivo.",
    quantitativeGoal: "C5i operativo en las 24 regiones al 2031.",
    expectedInstrument: "Plan nacional de seguridad / inversion publica",
    tags: ["plan-gobierno", "seguridad", "c5i", "videovigilancia"],
    verificationState: "UNVERIFIED",
    implementationState: "Sin accion identificada",
    confidence: 0.7,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: "ev-plan-k-001",
        sourceId: "src-plan-gobierno",
        label: "Insumos/Plan-de-Gobierno-Keiko.md:Orden ciudadano",
        excerpt: "Implementar un Centro Nacional de Comando y Videovigilancia (C5i) en las 24 regiones del pais.",
        confidence: 0.7
      }
    ],
    history: [{ date: lastUpdated, actor: "curaduria-local", change: "Compromiso curado desde plan de gobierno local." }]
  },
  {
    id: "c-plan-k-002",
    stableId: "plan-k-002",
    sourceId: "src-plan-gobierno",
    documentTitle: "Plan de Gobierno 2026-2031: Peru con Orden",
    emittedAt: "PENDIENTE-CONFIRMAR",
    speaker: "Fuerza Popular",
    organization: "Fuerza Popular",
    kind: "Promesa concreta",
    sector: "Seguridad Ciudadana",
    topic: "Primeros 100 dias",
    geography: "Lima, Callao, Piura, Trujillo y Tumbes",
    normalizedText: "Iniciar operaciones del C5i en Lima y Callao, fortalecer flagrancia express y financiar patrulleros, camaras y comisarias en los primeros 100 dias.",
    originalExcerpt: "Inicio de operaciones del C5i en Lima y Callao con expansion a ciudades criticas. Fortalecimiento de las Unidades de Flagrancia Express en Lima, Piura y Trujillo.",
    promisedAction: "Emitir decretos de urgencia para seguridad y modernizacion policial.",
    announcedDeadline: "Primeros 100 dias",
    quantitativeGoal: "1,000 patrulleros inteligentes, 10,000 camaras interconectadas y 200 comisarias modernizadas.",
    expectedInstrument: "Decretos de urgencia / presupuesto publico",
    tags: ["plan-gobierno", "seguridad", "100-dias", "patrulleros", "camaras"],
    verificationState: "UNVERIFIED",
    implementationState: "Sin accion identificada",
    confidence: 0.72,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: "ev-plan-k-002",
        sourceId: "src-plan-gobierno",
        label: "Insumos/Plan-de-Gobierno-Keiko.md:Primeros 100 dias",
        excerpt: "Emision de Decretos de Urgencia para financiar 1,000 patrulleros inteligentes, 10,000 camaras interconectadas y modernizacion de 200 comisarias.",
        confidence: 0.72
      }
    ],
    history: [{ date: lastUpdated, actor: "curaduria-local", change: "Compromiso curado desde plan de gobierno local." }]
  },
  {
    id: "c-plan-k-003",
    stableId: "plan-k-003",
    sourceId: "src-plan-gobierno",
    documentTitle: "Plan de Gobierno 2026-2031: Peru con Orden",
    emittedAt: "PENDIENTE-CONFIRMAR",
    speaker: "Fuerza Popular",
    organization: "Fuerza Popular",
    kind: "Promesa concreta",
    sector: "Juventud y Empleo",
    topic: "Empleo Joven con Futuro",
    targetPopulation: "Jovenes",
    normalizedText: "Lanzar Empleo Joven con Futuro como programa preventivo y de insercion laboral juvenil.",
    originalExcerpt: "Lanzamiento de un programa de Empleo Joven con Futuro para reducir el ingreso de jovenes a economias ilegales.",
    promisedAction: "Articular prevencion del delito con empleabilidad juvenil.",
    expectedInstrument: "Programa nacional",
    tags: ["plan-gobierno", "juventud", "empleo", "prevencion"],
    verificationState: "UNVERIFIED",
    implementationState: "Sin accion identificada",
    confidence: 0.7,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: "ev-plan-k-003",
        sourceId: "src-plan-gobierno",
        label: "Insumos/Plan-de-Gobierno-Keiko.md:Prevencion del delito",
        excerpt: "Lanzamiento de un programa de Empleo Joven con Futuro para reducir el ingreso de jovenes a economias ilegales.",
        confidence: 0.7
      }
    ],
    history: [{ date: lastUpdated, actor: "curaduria-local", change: "Compromiso curado desde plan de gobierno local." }]
  },
  {
    id: "c-plan-k-004",
    stableId: "plan-k-004",
    sourceId: "src-plan-gobierno",
    documentTitle: "Plan de Gobierno 2026-2031: Peru con Orden",
    emittedAt: "PENDIENTE-CONFIRMAR",
    speaker: "Fuerza Popular",
    organization: "Fuerza Popular",
    kind: "Promesa concreta",
    sector: "Modernizacion del Estado",
    topic: "Estado digital y transparente",
    geography: "Nacional",
    normalizedText: "Modernizar la gestion publica con un Estado digital, transparente y orientado a resultados.",
    originalExcerpt: "Un Estado al servicio de la poblacion, eficiente y orientado a resultados.",
    promisedAction: "Impulsar gestion publica moderna, descentralizada, digital y transparente.",
    expectedInstrument: "Reforma de gestion publica",
    tags: ["plan-gobierno", "estado", "digital", "transparencia"],
    verificationState: "UNVERIFIED",
    implementationState: "Sin accion identificada",
    confidence: 0.68,
    isDemo: false,
    lastReviewedAt: lastUpdated,
    evidence: [
      {
        id: "ev-plan-k-004",
        sourceId: "src-plan-gobierno",
        label: "Insumos/Plan-de-Gobierno-Keiko.md:Vision 2031",
        excerpt: "Se busca reconstruir la confianza entre el Estado y la sociedad, impulsando una gestion publica moderna, descentralizada, digital y transparente.",
        confidence: 0.68
      }
    ],
    history: [{ date: lastUpdated, actor: "curaduria-local", change: "Compromiso curado desde plan de gobierno local." }]
  }
];

export const sources: Source[] = [
  {
    id: "src-debate-presidencial",
    title: "Debate presidencial de Keiko Fujimori",
    type: "Debate presidencial",
    issuedAt: "PENDIENTE-CONFIRMAR",
    status: "UNVERIFIED",
    coverage: 0.85,
    isDemo: false,
    note: "47 declaraciones estructuradas en el insumo local; pendiente contraste con transcripción oficial."
  },
  {
    id: "src-debate-tecnico",
    title: "Debate técnico de Fuerza Popular",
    type: "Debate técnico",
    issuedAt: "PENDIENTE-CONFIRMAR",
    status: "UNVERIFIED",
    coverage: 0.78,
    isDemo: false,
    note: "34 declaraciones de vocerías técnicas en el insumo local; pendiente URL oficial."
  },
  {
    id: "src-plan-gobierno",
    title: "Plan de gobierno de Keiko Fujimori / Fuerza Popular",
    type: "Plan de gobierno",
    issuedAt: "PENDIENTE-CONFIRMAR",
    status: "UNVERIFIED",
    coverage: 0.35,
    isDemo: false,
    note: "Documento local disponible para siguiente etapa de normalización."
  },
  {
    id: "src-investidura",
    title: "Mensaje a la Nación del 28 de julio de 2026",
    type: "Mensaje presidencial",
    issuedAt: "2026-07-28",
    status: "UNVERIFIED",
    coverage: 0.65,
    isDemo: false,
    note: "Compromisos curados desde el texto local del discurso; requiere validación contra portal oficial."
  }
];

export const commitments: Commitment[] = [
  ...parseDebate(sourceConfig.debate1),
  ...parseDebate(sourceConfig.debate2),
  ...planCommitments,
  ...investitureCommitments
];

export const actions: GovernmentAction[] = investitureCommitments.map((commitment): GovernmentAction => ({
  id: `act-${commitment.stableId}`,
  commitmentId: commitment.id,
  title: `Anuncio presidencial vinculado: ${commitment.topic}`,
  actionType: "Anuncio presidencial",
  entity: "Presidencia de la República",
  status: "Iniciativa formal",
  occurredAt: "2026-07-28",
  notes: "Registro creado desde el mensaje presidencial local. No equivale a norma aprobada, presupuesto ejecutado ni resultado verificado."
})).concat([
  {
    id: "act-pendiente-validacion",
    commitmentId: "c-debate-1-k-013",
    title: "Facultades para primeros 100 días",
    actionType: "Solicitud anunciada",
    entity: "Poder Ejecutivo / Congreso",
    status: "Sin accion identificada",
    notes: "Compromiso de campaña pendiente de contraste contra expedientes legislativos."
  }
]);

function scorePair(a: Commitment, b: Commitment) {
  const tokensA = new Set(stripAccents(`${a.sector} ${a.topic} ${a.tags.join(" ")} ${a.normalizedText}`).toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 3));
  const tokensB = new Set(stripAccents(`${b.sector} ${b.topic} ${b.tags.join(" ")} ${b.normalizedText}`).toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 3));
  let overlap = 0;
  tokensA.forEach((token) => {
    if (tokensB.has(token)) overlap += 1;
  });
  return overlap / Math.max(tokensA.size, tokensB.size, 1);
}

export function buildComparisons(fromSourceId = "src-debate-presidencial", toSourceId = "src-investidura") {
  const left = commitments.filter((item) => item.sourceId === fromSourceId && item.kind !== "Diagnostico");
  const right = commitments.filter((item) => item.sourceId === toSourceId);
  return left.flatMap((from) =>
    right
      .map((to) => ({ from, to, score: scorePair(from, to) }))
      .filter((item) => item.score >= 0.12)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((item, index): Comparison => ({
        id: `cmp-${from.stableId}-${item.to.stableId}-${index}`,
        fromCommitmentId: from.id,
        toCommitmentId: item.to.id,
        relationType: item.score > 0.26 ? "Coincidencia parcial" : "Evidencia insuficiente",
        justification: "Relación preliminar generada por coincidencia de sector, tema y vocabulario entre insumos locales.",
        evidenceFor: `${from.originalExcerpt} / ${item.to.originalExcerpt}`,
        evidenceAgainst: "La relación requiere revisión humana y contraste con fuentes primarias antes de publicarse como conclusión.",
        confidence: Math.min(0.82, Math.max(0.45, item.score + 0.42)),
        method: "Coincidencia léxica y temática local",
        generatedBy: "local-comparator-v1",
        analyzedAt: lastUpdated,
        state: "AUTOMATIC"
      }))
  );
}

export const comparisons: Comparison[] = [
  ...buildComparisons("src-debate-presidencial", "src-investidura"),
  ...buildComparisons("src-debate-tecnico", "src-investidura"),
  ...buildComparisons("src-plan-gobierno", "src-investidura"),
  ...buildComparisons("src-debate-presidencial", "src-plan-gobierno"),
  ...buildComparisons("src-debate-tecnico", "src-plan-gobierno")
].slice(0, 36);

export const auditEvents: AuditEvent[] = [
  { id: "audit-001", date: lastUpdated, actor: "parser-local", action: "Importación de debate presidencial", entity: "src-debate-presidencial" },
  { id: "audit-002", date: lastUpdated, actor: "parser-local", action: "Importación de debate técnico", entity: "src-debate-tecnico" },
  { id: "audit-003", date: lastUpdated, actor: "curaduria-local", action: "Extracción de compromisos del mensaje presidencial", entity: "src-investidura" }
];
