from __future__ import annotations

import re

from app.extractors.base_extractor import BaseExtractor
from app.schemas.documents import ExtractedField


class CertificadoReinspeccionExtractor(BaseExtractor):
    inspection_pattern = re.compile(
        r"\b(reinspeccion|inspeccion)[:\s#-]*([A-Z0-9-]{2,})\b", re.IGNORECASE
    )

    def extract(self, text: str) -> list[ExtractedField]:
        inspection_match = self.inspection_pattern.search(text)
        inspection_value = inspection_match.group(2) if inspection_match else None

        return [
            ExtractedField(name="PPU", value=self._match(self.ppu_pattern, text), confidence=0.88),
            ExtractedField(name="Folio", value=self._match(self.folio_pattern, text), confidence=0.8),
            ExtractedField(name="Numero reinspeccion", value=inspection_value, confidence=0.77),
            ExtractedField(name="Fecha revision", value=self._match(self.date_pattern, text), confidence=0.8),
        ]
