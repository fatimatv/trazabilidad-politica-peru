export type VerificationState = "DEMO" | "UNVERIFIED" | "AUTOMATIC" | "REVIEWED" | "DISPUTED" | "PUBLISHED";

export type CommitmentKind =
  | "Promesa concreta"
  | "Orientacion politica general"
  | "Diagnostico"
  | "Valor o aspiracion"
  | "Anuncio"
  | "Medida adoptada"
  | "Resultado declarado"
  | "Resultado comprobado";

export type RelationType =
  | "Coincidencia sustantiva"
  | "Coincidencia parcial"
  | "Contradiccion directa"
  | "Contradiccion por alcance"
  | "Contradiccion presupuestal"
  | "Reformulacion"
  | "Matiz"
  | "Cambio de prioridad"
  | "Omision relevante"
  | "Implementacion parcial"
  | "Implementacion completa"
  | "Accion en sentido contrario"
  | "Sin accion identificada"
  | "Evidencia insuficiente"
  | "No comparable";

export type Source = {
  id: string;
  title: string;
  type: string;
  url?: string;
  issuedAt?: string;
  status: VerificationState;
  coverage: number;
  isDemo: boolean;
  note: string;
};

export type Evidence = {
  id: string;
  sourceId: string;
  label: string;
  excerpt: string;
  url?: string;
  confidence?: number;
};

export type GovernmentAction = {
  id: string;
  commitmentId: string;
  title: string;
  actionType: string;
  entity: string;
  status: "Por cumplir" | "Iniciativa formal" | "Norma aprobada" | "Presupuesto asignado" | "Ejecucion" | "Resultado verificado";
  occurredAt?: string;
  sourceUrl?: string;
  notes: string;
  budget?: {
    year: number;
    amount: number;
    currency: string;
    executionRate?: number;
  };
};

export type Commitment = {
  id: string;
  stableId: string;
  sourceId: string;
  documentTitle: string;
  emittedAt?: string;
  speaker: string;
  organization: string;
  kind: CommitmentKind;
  sector: string;
  topic: string;
  subtopic?: string;
  geography?: string;
  targetPopulation?: string;
  normalizedText: string;
  originalExcerpt: string;
  promisedAction?: string;
  quantitativeGoal?: string;
  announcedDeadline?: string;
  expectedInstrument?: string;
  budgetReference?: string;
  caveats?: string;
  tags: string[];
  verificationState: VerificationState;
  implementationState: GovernmentAction["status"];
  confidence: number;
  isDemo: boolean;
  lastReviewedAt?: string;
  evidence: Evidence[];
  history: Array<{ date: string; actor: string; change: string }>;
};

export type Comparison = {
  id: string;
  fromCommitmentId: string;
  toCommitmentId: string;
  relationType: RelationType;
  justification: string;
  evidenceFor: string;
  evidenceAgainst: string;
  confidence: number;
  method: string;
  generatedBy: string;
  analyzedAt: string;
  state: VerificationState;
};

export type AuditEvent = {
  id: string;
  date: string;
  actor: string;
  action: string;
  entity: string;
};
