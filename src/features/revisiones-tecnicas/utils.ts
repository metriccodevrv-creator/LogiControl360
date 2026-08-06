import type { TechnicalReviewStatus } from "@/features/revisiones-tecnicas/types";

export function technicalReviewTone(status: TechnicalReviewStatus) {
  switch (status) {
    case "APROBADO":
    case "VIGENTE":
    case "REPARACION_FINALIZADA":
      return "success" as const;
    case "PROXIMO_A_VENCER":
    case "RECIBIDO_PENDIENTE_DOCUMENTO":
    case "DOCUMENTO_PENDIENTE_VALIDACION":
    case "EN_REPARACION":
      return "warning" as const;
    case "RECHAZADO":
    case "VENCIDO":
    case "ENVIO_CANCELADO":
      return "danger" as const;
    default:
      return "info" as const;
  }
}

export function technicalReviewLabel(status: TechnicalReviewStatus | "SIN_ESTADO") {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function confidenceTone(confidence: number) {
  if (confidence >= 0.9) {
    return "success" as const;
  }

  if (confidence >= 0.75) {
    return "warning" as const;
  }

  return "danger" as const;
}

export function confidenceLabel(confidence: number) {
  if (confidence >= 0.9) {
    return "Alta";
  }

  if (confidence >= 0.75) {
    return "Media";
  }

  return "Baja";
}
