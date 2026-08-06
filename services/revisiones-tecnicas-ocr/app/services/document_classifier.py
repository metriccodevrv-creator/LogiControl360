from __future__ import annotations


class DocumentClassifier:
    def classify(self, text: str, forced_type: str | None = None) -> str:
        if forced_type:
            return forced_type

        normalized = text.lower()
        if "reinspeccion" in normalized:
            return "certificado_reinspeccion"
        if "rechazo" in normalized or "defecto" in normalized:
            return "informe_rechazo"
        return "certificado_aprobacion"
