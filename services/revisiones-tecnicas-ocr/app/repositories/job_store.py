from __future__ import annotations

from dataclasses import replace
from threading import Lock

from app.models.document_job import DocumentJob, utc_now


class JobStore:
    def __init__(self) -> None:
        self._items: dict[str, DocumentJob] = {}
        self._lock = Lock()

    def create(self, job: DocumentJob) -> DocumentJob:
        with self._lock:
            self._items[job.id] = job
            return job

    def get(self, document_id: str) -> DocumentJob | None:
        with self._lock:
            return self._items.get(document_id)

    def update(self, document_id: str, **changes: object) -> DocumentJob:
        with self._lock:
            current = self._items[document_id]
            updated = replace(current, updated_at=utc_now(), **changes)
            self._items[document_id] = updated
            return updated


job_store = JobStore()
