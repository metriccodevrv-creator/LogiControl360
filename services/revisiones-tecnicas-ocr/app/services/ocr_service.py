from __future__ import annotations

from pathlib import Path

import fitz

from app.core.settings import Settings

try:
    from paddleocr import PaddleOCR
except Exception:  # pragma: no cover - optional dependency at runtime
    PaddleOCR = None


class OCRService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._engine = None

    def _get_engine(self) -> PaddleOCR | None:
        if PaddleOCR is None:
            return None

        if self._engine is None:
            self._engine = PaddleOCR(lang=self.settings.ocr_language, use_angle_cls=True)

        return self._engine

    def read_document(self, original_path: Path, image_paths: list[Path]) -> dict[str, object]:
        full_text = self._extract_pdf_text(original_path) if original_path.suffix.lower() == ".pdf" else ""
        warnings: list[str] = []
        fields: list[dict[str, object]] = []
        overall_confidence = 0.0

        if not full_text:
            engine = self._get_engine()
            if engine is None:
                warnings.append("PaddleOCR is not available in the current runtime.")
            else:
                texts: list[str] = []
                confidences: list[float] = []
                for page_number, image_path in enumerate(image_paths, start=1):
                    result = engine.ocr(str(image_path), cls=True)
                    for line in result:
                        for item in line:
                            text = item[1][0]
                            confidence = float(item[1][1])
                            texts.append(text)
                            confidences.append(confidence)
                            fields.append(
                                {
                                    "name": f"text_{len(fields) + 1}",
                                    "value": text,
                                    "confidence": confidence,
                                    "page": page_number,
                                    "coordinates": {"points": item[0]},
                                }
                            )

                full_text = "\n".join(texts)
                overall_confidence = (
                    sum(confidences) / len(confidences) if confidences else 0.0
                )

        if full_text and overall_confidence == 0.0:
            overall_confidence = 0.99

        return {
            "full_text": full_text,
            "confidence": overall_confidence,
            "warnings": warnings,
            "raw_fields": fields,
        }

    def _extract_pdf_text(self, file_path: Path) -> str:
        if file_path.suffix.lower() != ".pdf":
            return ""

        document = fitz.open(file_path)
        return "\n".join(page.get_text("text") for page in document).strip()
