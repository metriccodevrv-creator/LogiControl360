from __future__ import annotations

import re

from app.extractors.base_extractor import BaseExtractor
from app.schemas.documents import ExtractedField


class InformeRechazoExtractor(BaseExtractor):
    rejection_code_pattern = re.compile(r"\b([A-Z]{2}-\d{2})\b")

    def extract(self, text: str) -> list[ExtractedField]:
        return [
            ExtractedField(name="PPU", value=self._match(self.ppu_pattern, text), confidence=0.85),
            ExtractedField(name="Folio", value=self._match(self.folio_pattern, text), confidence=0.8),
            ExtractedField(
                name="Codigo rechazo",
                value=self._match(self.rejection_code_pattern, text),
                confidence=0.76,
            ),
            ExtractedField(name="Fecha revision", value=self._match(self.date_pattern, text), confidence=0.8),
        ]
