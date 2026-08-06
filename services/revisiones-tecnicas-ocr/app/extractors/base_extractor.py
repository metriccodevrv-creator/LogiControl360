from __future__ import annotations

import re
from abc import ABC, abstractmethod

from app.schemas.documents import ExtractedField


class BaseExtractor(ABC):
    ppu_pattern = re.compile(r"\b([A-Z]{4}-\d{2})\b")
    date_pattern = re.compile(r"\b(20\d{2}-\d{2}-\d{2})\b")
    folio_pattern = re.compile(r"\bfolio[:\s#-]*([A-Z0-9-]{4,})\b", re.IGNORECASE)

    @abstractmethod
    def extract(self, text: str) -> list[ExtractedField]:
        raise NotImplementedError

    def _match(self, pattern: re.Pattern[str], text: str) -> str | None:
        match = pattern.search(text)
        return match.group(1) if match else None
