from __future__ import annotations

import re

from app.extractors.base_extractor import BaseExtractor
from app.schemas.documents import ExtractedField


class CertificadoAprobacionExtractor(BaseExtractor):
    certificate_pattern = re.compile(
        r"\bcertificado[:\s#-]*([A-Z0-9-]{4,})\b", re.IGNORECASE
    )

    def extract(self, text: str) -> list[ExtractedField]:
        return [
            ExtractedField(name="PPU", value=self._match(self.ppu_pattern, text), confidence=0.9),
            ExtractedField(
                name="Numero certificado",
                value=self._match(self.certificate_pattern, text),
                confidence=0.85,
            ),
            ExtractedField(name="Fecha revision", value=self._match(self.date_pattern, text), confidence=0.8),
        ]
