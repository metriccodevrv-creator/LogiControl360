from __future__ import annotations

import mimetypes
from pathlib import Path

from fastapi import HTTPException, status

from app.core.settings import Settings


class ValidationService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def validate_file(self, file_path: Path) -> str:
        size_bytes = file_path.stat().st_size
        if size_bytes > self.settings.max_file_size_mb * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File exceeds the maximum allowed size.",
            )

        mime_type, _ = mimetypes.guess_type(file_path.name)
        if mime_type not in self.settings.allowed_mime_types:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Unsupported file type.",
            )

        return mime_type or "application/octet-stream"

