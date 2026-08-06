from __future__ import annotations

import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from supabase import Client, create_client

from app.core.settings import Settings


class StorageService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def _create_supabase(self) -> Client | None:
        if not self.settings.supabase_url or not self.settings.supabase_service_role_key:
            return None

        return create_client(
            self.settings.supabase_url,
            self.settings.supabase_service_role_key,
        )

    async def persist_upload(self, upload: UploadFile) -> Path:
        suffix = Path(upload.filename or "document").suffix or ".bin"
        target = Path(self.settings.temp_dir) / f"{uuid4()}{suffix}"
        target.parent.mkdir(parents=True, exist_ok=True)

        with target.open("wb") as buffer:
            while chunk := await upload.read(1024 * 1024):
                buffer.write(chunk)

        await upload.close()
        return target

    def download_from_storage(self, storage_path: str) -> Path:
        client = self._create_supabase()
        if client is None:
            raise RuntimeError("Supabase service role configuration is required.")

        target = Path(self.settings.temp_dir) / f"{uuid4()}-{Path(storage_path).name}"
        target.parent.mkdir(parents=True, exist_ok=True)

        response = client.storage.from_(self.settings.supabase_storage_bucket).download(
            storage_path
        )
        target.write_bytes(response)
        return target

    def cleanup(self, *paths: Path) -> None:
        for path in paths:
            if path.is_dir():
                shutil.rmtree(path, ignore_errors=True)
            elif path.exists():
                path.unlink(missing_ok=True)
