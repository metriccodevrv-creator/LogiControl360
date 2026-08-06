from __future__ import annotations

import hashlib
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, status

from app.core.security import AuthenticatedUser
from app.core.settings import Settings
from app.extractors.certificado_aprobacion import CertificadoAprobacionExtractor
from app.extractors.certificado_reinspeccion import CertificadoReinspeccionExtractor
from app.extractors.informe_rechazo import InformeRechazoExtractor
from app.models.document_job import DocumentJob
from app.repositories.job_store import JobStore
from app.schemas.documents import (
    DocumentResultResponse,
    DocumentStatusResponse,
    ExtractedField,
)
from app.services.document_classifier import DocumentClassifier
from app.services.image_processing_service import ImageProcessingService
from app.services.ocr_service import OCRService
from app.services.storage_service import StorageService
from app.services.validation_service import ValidationService


class DocumentService:
    def __init__(
        self,
        settings: Settings,
        store: JobStore,
        storage: StorageService,
        validator: ValidationService,
        image_processing: ImageProcessingService,
        ocr: OCRService,
        classifier: DocumentClassifier,
    ) -> None:
        self.settings = settings
        self.store = store
        self.storage = storage
        self.validator = validator
        self.image_processing = image_processing
        self.ocr = ocr
        self.classifier = classifier
        self.extractors = {
            "certificado_aprobacion": CertificadoAprobacionExtractor(),
            "informe_rechazo": InformeRechazoExtractor(),
            "certificado_reinspeccion": CertificadoReinspeccionExtractor(),
        }

    def create_job(self, user: AuthenticatedUser, storage_path: str | None = None) -> DocumentJob:
        return self.store.create(
            DocumentJob(id=str(uuid4()), user_id=user.id, storage_path=storage_path)
        )

    def process_document(
        self,
        *,
        document_id: str,
        file_path: Path | None,
        storage_path: str | None,
        forced_document_type: str | None = None,
    ) -> None:
        job = self.store.get(document_id)
        if job is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document job not found.")

        self.store.update(document_id, status="PROCESANDO", errors=[], warnings=[])
        cleanup_paths: list[Path] = []

        try:
            source_path = file_path
            if source_path is None:
                if not storage_path:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Either file or storage_path is required.",
                    )
                source_path = self.storage.download_from_storage(storage_path)
                cleanup_paths.append(source_path)

            mime_type = self.validator.validate_file(source_path)
            digest = hashlib.sha256(source_path.read_bytes()).hexdigest()
            image_paths = self.image_processing.preprocess_document(source_path)
            cleanup_paths.extend(
                image for image in image_paths if image.parent != source_path.parent or image != source_path
            )
            ocr_result = self.ocr.read_document(source_path, image_paths)
            document_type = self.classifier.classify(
                str(ocr_result["full_text"]),
                forced_type=forced_document_type,
            )
            extractor = self.extractors[document_type]
            fields = extractor.extract(str(ocr_result["full_text"]))
            raw_result = {
                "document_type": document_type,
                "mime_type": mime_type,
                "hash_sha256": digest,
                "full_text": ocr_result["full_text"],
                "warnings": ocr_result["warnings"],
                "fields": [field.model_dump() for field in fields],
                "raw_fields": ocr_result["raw_fields"],
            }
            self.store.update(
                document_id,
                status="REQUIERE_REVISION",
                document_type=document_type,
                hash_sha256=digest,
                full_text=str(ocr_result["full_text"]),
                warnings=list(ocr_result["warnings"]),
                result=raw_result,
            )
        except HTTPException as exc:
            self.store.update(document_id, status="ERROR", errors=[str(exc.detail)])
        except Exception as exc:  # pragma: no cover - defensive
            self.store.update(document_id, status="ERROR", errors=[str(exc)])
        finally:
            self.storage.cleanup(*cleanup_paths)

    def get_status(self, document_id: str) -> DocumentStatusResponse:
        job = self.store.get(document_id)
        if job is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document job not found.")

        return DocumentStatusResponse(
            document_id=job.id,
            status=job.status,
            warnings=job.warnings,
            errors=job.errors,
        )

    def get_result(self, document_id: str) -> DocumentResultResponse:
        job = self.store.get(document_id)
        if job is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document job not found.")

        raw_result = job.result or {}
        return DocumentResultResponse(
            document_id=job.id,
            status=job.status,
            document_type=job.document_type,
            hash_sha256=job.hash_sha256,
            full_text=job.full_text,
            confidence=raw_result.get("confidence"),
            warnings=job.warnings,
            fields=[ExtractedField(**field) for field in raw_result.get("fields", [])],
            raw_result=raw_result,
        )

    def validate_document(self, document_id: str, fields: dict[str, str], notes: str | None) -> None:
        job = self.store.get(document_id)
        if job is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document job not found.")

        raw_result = job.result or {}
        updated_fields = []
        for field in raw_result.get("fields", []):
            confirmed_value = fields.get(field["name"], field.get("value"))
            updated_fields.append({**field, "value": confirmed_value})

        raw_result["fields"] = updated_fields
        if notes:
            raw_result["validation_notes"] = notes

        self.store.update(document_id, status="VALIDADO", result=raw_result)

    def reject_reading(self, document_id: str, reason: str) -> None:
        job = self.store.get(document_id)
        if job is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document job not found.")

        self.store.update(
            document_id,
            status="ERROR",
            warnings=[*job.warnings, f"Reading rejected: {reason}"],
        )
