import type { AuditEvent, Commitment, Comparison, GovernmentAction, Source } from "./types";

export const lastUpdated = "2026-07-28";

export const sources: Source[] = [
  {
    id: "src-debate-presidencial",
    title: "Debate presidencial - archivo de trabajo",
    type: "Debate presidencial",
    issuedAt: "PENDIENTE",
    status: "UNVERIFIED",
    coverage: 0.72,
    isDemo: false,
    note: "Insumo local pendiente de contraste con fuente primaria oficial."
  },
  {
    id: "src-debate-tecnico",
    title: "Debate tecnico - archivo de trabajo",
    type: "Debate tecnico",
    issuedAt: "PENDIENTE",
    status: "UNVERIFIED",
    coverage: 0.61,
    isDemo: false,
    note: "Insumo local estructurado; requiere URL y metadatos oficiales."
  },
  {
    id: "src-plan-gobierno",
    title: "Plan de gobierno oficial - pendiente de normalizacion",
    type: "Plan de gobierno",
    issuedAt: "PENDIENTE",
    status: "UNVERIFIED",
    coverage: 0.35,
    isDemo: false,
    note: "Documento local grande; se conserva como fuente pendiente."
  },
  {
    id: "src-investidura",
    title: "Mensaje inaugural del 28 de julio de 2026",
    type: "Mensaje presidencial",
    issuedAt: "2026-07-28",
    status: "UNVERIFIED",
    coverage: 0.44,
    isDemo: false,
    note: "Texto local no contrastado todavia con el portal oficial."
  }
];

export const commitments: Commitment[] = [
  {
    id: "c-demo-001",
    stableId: "DEMO-COMP-001",
    sourceId: "src-debate-presidencial",
    documentTitle: "Debate presidencial - archivo de trabajo",
    emittedAt: "PENDIENTE",
    speaker: "Candidata o voceria politica",
    organization: "Fuerza Popular",
    kind: "Promesa concreta",
    sector: "Seguridad Ciudadana",
    topic: "Extorsion y transporte",
    geography: "Areas metropolitanas",
    targetPopulation: "Transportistas y pasajeros",
    normalizedText: "Implementar un plan de pacificacion con presencia operativa en transporte urbano.",
    originalExcerpt: "DEMO: extracto pendiente de verificacion textual contra fuente primaria.",
    promisedAction: "Diseñar e iniciar plan operativo interinstitucional.",
    announcedDeadline: "Primeros meses de gobierno, pendiente de confirmacion.",
    expectedInstrument: "Plan multisectorial / resolucion sectorial",
    tags: ["DEMO", "seguridad", "transporte", "revision-humana"],
    verificationState: "DEMO",
    implementationState: "Iniciativa formal",
    confidence: 0.58,
    isDemo: true,
    lastReviewedAt: "2026-07-28",
    evidence: [
      {
        id: "ev-demo-001",
        sourceId: "src-debate-presidencial",
        label: "Referencia de debate",
        excerpt: "DEMO: cita no publicada hasta cotejo manual.",
        confidence: 0.4
      }
    ],
    history: [
      { date: "2026-07-28", actor: "Sistema demo", change: "Creacion del compromiso con etiqueta DEMO." }
    ]
  },
  {
    id: "c-demo-002",
    stableId: "DEMO-COMP-002",
    sourceId: "src-debate-tecnico",
    documentTitle: "Debate tecnico - archivo de trabajo",
    emittedAt: "PENDIENTE",
    speaker: "Equipo tecnico",
    organization: "Fuerza Popular",
    kind: "Promesa concreta",
    sector: "Modernizacion del Estado",
    topic: "Digitalizacion publica",
    geography: "Nacional",
    targetPopulation: "Usuarios de servicios publicos",
    normalizedText: "Digitalizar tramites y coordinar servicios publicos entre ministerios, regiones y municipios.",
    originalExcerpt: "DEMO: formulacion sintetica derivada de insumo local pendiente de auditoria.",
    promisedAction: "Interoperabilidad y digitalizacion de servicios.",
    expectedInstrument: "Programa de gobierno digital",
    tags: ["DEMO", "estado", "digitalizacion"],
    verificationState: "DEMO",
    implementationState: "Sin accion identificada",
    confidence: 0.62,
    isDemo: true,
    lastReviewedAt: "2026-07-28",
    evidence: [
      {
        id: "ev-demo-002",
        sourceId: "src-debate-tecnico",
        label: "Referencia de debate tecnico",
        excerpt: "DEMO: debe reemplazarse por cita literal validada.",
        confidence: 0.42
      }
    ],
    history: [
      { date: "2026-07-28", actor: "Sistema demo", change: "Normalizacion inicial propuesta." }
    ]
  },
  {
    id: "c-demo-003",
    stableId: "DEMO-COMP-003",
    sourceId: "src-debate-tecnico",
    documentTitle: "Debate tecnico - archivo de trabajo",
    emittedAt: "PENDIENTE",
    speaker: "Equipo tecnico",
    organization: "Fuerza Popular",
    kind: "Promesa concreta",
    sector: "Educacion",
    topic: "Educacion tecnica",
    targetPopulation: "Jovenes",
    normalizedText: "Modernizar la educacion tecnica y alinear la malla curricular con la demanda regional y laboral.",
    originalExcerpt: "DEMO: marcador de posicion para cita verificada.",
    promisedAction: "Actualizar infraestructura, tecnologia y curricula.",
    expectedInstrument: "Programa sectorial",
    tags: ["DEMO", "juventud", "educacion-tecnica"],
    verificationState: "DEMO",
    implementationState: "Presupuesto asignado",
    confidence: 0.56,
    isDemo: true,
    lastReviewedAt: "2026-07-28",
    evidence: [
      {
        id: "ev-demo-003",
        sourceId: "src-debate-tecnico",
        label: "Insumo tecnico",
        excerpt: "DEMO: pendiente de verificacion independiente.",
        confidence: 0.39
      }
    ],
    history: [
      { date: "2026-07-28", actor: "Analista demo", change: "Se agrego poblacion objetivo jovenes." }
    ]
  },
  {
    id: "c-demo-004",
    stableId: "DEMO-COMP-004",
    sourceId: "src-investidura",
    documentTitle: "Mensaje inaugural del 28 de julio de 2026",
    emittedAt: "2026-07-28",
    speaker: "Presidencia",
    organization: "Presidencia de la Republica",
    kind: "Orientacion politica general",
    sector: "Gobernanza",
    topic: "Objetivos nacionales",
    geography: "Nacional",
    normalizedText: "Organizar al Estado detras de objetivos nacionales y una gestion estrategica.",
    originalExcerpt: "DEMO: el texto local debe ser verificado antes de publicarse como cita oficial.",
    promisedAction: "Definir objetivos nacionales y centro de gestion.",
    expectedInstrument: "Lineamientos de politica general",
    tags: ["DEMO", "investidura", "gestion-estrategica"],
    verificationState: "DEMO",
    implementationState: "Iniciativa formal",
    confidence: 0.51,
    isDemo: true,
    lastReviewedAt: "2026-07-28",
    evidence: [
      {
        id: "ev-demo-004",
        sourceId: "src-investidura",
        label: "Mensaje presidencial",
        excerpt: "DEMO: fragmento sujeto a contraste con version oficial.",
        confidence: 0.35
      }
    ],
    history: [
      { date: "2026-07-28", actor: "Sistema demo", change: "Clasificado como orientacion, no promesa medible." }
    ]
  }
];

export const actions: GovernmentAction[] = [
  {
    id: "act-demo-001",
    commitmentId: "c-demo-001",
    title: "Mesa tecnica de seguridad en transporte",
    actionType: "Coordinacion",
    entity: "PCM / Interior",
    status: "Iniciativa formal",
    occurredAt: "2026-08-12",
    notes: "DEMO: ejemplo de accion formal; requiere fuente oficial antes de publicarse."
  },
  {
    id: "act-demo-002",
    commitmentId: "c-demo-003",
    title: "Partida piloto para institutos tecnicos",
    actionType: "Presupuesto",
    entity: "MEF / Educacion",
    status: "Presupuesto asignado",
    occurredAt: "2026-09-03",
    notes: "DEMO: muestra diferencia entre asignacion y ejecucion.",
    budget: { year: 2026, amount: 25000000, currency: "PEN", executionRate: 0.12 }
  },
  {
    id: "act-demo-003",
    commitmentId: "c-demo-004",
    title: "Borrador de lineamientos de gestion estrategica",
    actionType: "Documento de trabajo",
    entity: "PCM",
    status: "Iniciativa formal",
    occurredAt: "2026-08-01",
    notes: "DEMO: no equivale a norma aprobada."
  }
];

export const comparisons: Comparison[] = [
  {
    id: "cmp-demo-001",
    fromCommitmentId: "c-demo-002",
    toCommitmentId: "c-demo-004",
    relationType: "Coincidencia parcial",
    justification: "Ambos registros apuntan a gestion estrategica del Estado, pero el segundo no conserva todos los elementos operativos de digitalizacion.",
    evidenceFor: "Comparten el eje de coordinacion estatal.",
    evidenceAgainst: "La fuente posterior tiene menor especificidad tecnologica.",
    confidence: 0.54,
    method: "Comparacion manual asistida con etiquetas tematicas",
    generatedBy: "demo-seed",
    analyzedAt: "2026-07-28",
    state: "DEMO"
  },
  {
    id: "cmp-demo-002",
    fromCommitmentId: "c-demo-001",
    toCommitmentId: "c-demo-003",
    relationType: "No comparable",
    justification: "Los compromisos pertenecen a sectores, poblaciones e instrumentos distintos.",
    evidenceFor: "No hay superposicion sustantiva.",
    evidenceAgainst: "Ambos son promesas de campana, pero esa coincidencia formal no basta.",
    confidence: 0.81,
    method: "Regla de taxonomia",
    generatedBy: "demo-seed",
    analyzedAt: "2026-07-28",
    state: "DEMO"
  }
];

export const auditEvents: AuditEvent[] = [
  { id: "audit-001", date: "2026-07-28", actor: "admin.demo", action: "Registro de fuente", entity: "src-investidura" },
  { id: "audit-002", date: "2026-07-28", actor: "analyst.demo", action: "Clasificacion preliminar", entity: "cmp-demo-001" },
  { id: "audit-003", date: "2026-07-28", actor: "reviewer.demo", action: "Marcado como DEMO pendiente", entity: "c-demo-004" }
];
