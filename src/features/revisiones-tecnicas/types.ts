export const technicalReviewStatuses = [
  "PENDIENTE_ENVIO",
  "ENVIADO_PRIMERA_REVISION",
  "ENVIADO_REINSPECCION",
  "EN_PLANTA_REVISORA",
  "RECIBIDO_PENDIENTE_DOCUMENTO",
  "DOCUMENTO_PENDIENTE_VALIDACION",
  "RECHAZADO",
  "EN_REPARACION",
  "REPARACION_FINALIZADA",
  "APROBADO",
  "VIGENTE",
  "PROXIMO_A_VENCER",
  "VENCIDO",
  "ENVIO_CANCELADO",
] as const;

export type TechnicalReviewStatus = (typeof technicalReviewStatuses)[number];

export interface TechnicalReviewMetric {
  label: string;
  value: string;
  helper: string;
  tone: "neutral" | "success" | "warning" | "danger";
}

export interface TechnicalReviewAlert {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "danger" | "success";
  createdAt: string;
}

export interface TechnicalReviewMonthlyResult {
  month: string;
  approved: number;
  rejected: number;
}

export interface TechnicalReviewOperationalItem {
  id: string;
  busId: string;
  ppu: string;
  internalNumber: string;
  brand: string;
  model: string;
  terminal: string;
  dueDate: string;
  daysRemaining: number;
  status: TechnicalReviewStatus;
  lastSentAt: string;
  lastReceivedAt: string | null;
  lastResult: "APROBADO" | "RECHAZADO" | "PENDIENTE";
  rejectionCount: number;
  attemptCount: number;
  plant: string;
  responsible: string;
}

export interface TechnicalReviewTimelineEvent {
  id: string;
  busId: string;
  at: string;
  user: string;
  action: string;
  previousState: TechnicalReviewStatus | "SIN_ESTADO";
  nextState: TechnicalReviewStatus;
  observations: string;
  documents: string[];
  rejectionReasons: string[];
}

export interface TechnicalReviewRejectionCase {
  id: string;
  busId: string;
  ppu: string;
  internalNumber: string;
  terminal: string;
  plant: string;
  status: "PENDIENTE" | "EN_REPARACION" | "LISTO_REINSPECCION" | "CERRADO";
  startedAt: string;
  estimatedAt: string | null;
  finishedAt: string | null;
  owner: string;
  reasons: string[];
  workDone: string;
}

export interface TechnicalReviewExtractedField {
  id: string;
  name: string;
  ocrValue: string;
  confirmedValue: string;
  confidence: number;
  page: number;
  corrected: boolean;
}

export interface TechnicalReviewDocumentReview {
  id: string;
  busId: string;
  ppu: string;
  documentType: string;
  processingStatus:
    | "PENDIENTE"
    | "PROCESANDO"
    | "PROCESADO"
    | "REQUIERE_REVISION"
    | "VALIDADO"
    | "ERROR";
  overallConfidence: number;
  pages: number;
  warnings: string[];
  fields: TechnicalReviewExtractedField[];
}

export interface TechnicalReviewPlant {
  id: string;
  code: string;
  name: string;
  commune: string;
  region: string;
  active: boolean;
}

export interface TechnicalReviewConfigItem {
  id: string;
  key: string;
  value: string;
  description: string;
}
