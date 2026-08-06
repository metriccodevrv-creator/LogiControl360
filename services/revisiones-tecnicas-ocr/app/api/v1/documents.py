from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile

from app.core.security import AuthenticatedUser, get_current_user
from app.main import get_document_service
from app.schemas.documents import (
    DocumentProcessResponse,
    DocumentRejectReadingRequest,
    DocumentReprocessRequest,
    DocumentResultResponse,
    DocumentStatusResponse,
    DocumentValidateRequest,
)
from app.services.document_service import DocumentService
from app.services.storage_service import StorageService


router = APIRouter(prefix="/api/v1/documents", tags=["documents"])


@router.post("/process", response_model=DocumentProcessResponse)
async def process_document(
    background_tasks: BackgroundTasks,
    file: UploadFile | None = File(default=None),
    storage_path: str | None = Form(default=None),
    service: DocumentService = Depends(get_document_service),
    user: AuthenticatedUser = Depends(get_current_user),
) -> DocumentProcessResponse:
    persisted_path: Path | None = None
    if file is not None:
        storage_service: StorageService = service.storage
        persisted_path = await storage_service.persist_upload(file)

    job = service.create_job(user=user, storage_path=storage_path)
    background_tasks.add_task(
        service.process_document,
        document_id=job.id,
        file_path=persisted_path,
        storage_path=storage_path,
        forced_document_type=None,
    )
    return DocumentProcessResponse(
      document_id=job.id,
      status="PENDIENTE",
      message="Document accepted for processing.",
    )


@router.post("/reprocess", response_model=DocumentProcessResponse)
async def reprocess_document(
    payload: DocumentReprocessRequest,
    background_tasks: BackgroundTasks,
    service: DocumentService = Depends(get_document_service),
    _user: AuthenticatedUser = Depends(get_current_user),
) -> DocumentProcessResponse:
    job = service.store.get(payload.document_id)
    if job is None:
        raise ValueError("Document job not found.")

    background_tasks.add_task(
        service.process_document,
        document_id=payload.document_id,
        file_path=None,
        storage_path=job.storage_path,
        forced_document_type=payload.force_document_type,
    )
    return DocumentProcessResponse(
        document_id=payload.document_id,
        status="PENDIENTE",
        message="Document queued for reprocessing.",
    )


@router.get("/{document_id}/status", response_model=DocumentStatusResponse)
async def get_document_status(
    document_id: str,
    service: DocumentService = Depends(get_document_service),
    _user: AuthenticatedUser = Depends(get_current_user),
) -> DocumentStatusResponse:
    return service.get_status(document_id)


@router.get("/{document_id}/result", response_model=DocumentResultResponse)
async def get_document_result(
    document_id: str,
    service: DocumentService = Depends(get_document_service),
    _user: AuthenticatedUser = Depends(get_current_user),
) -> DocumentResultResponse:
    return service.get_result(document_id)


@router.post("/{document_id}/validate", response_model=DocumentProcessResponse)
async def validate_document(
    document_id: str,
    payload: DocumentValidateRequest,
    service: DocumentService = Depends(get_document_service),
    _user: AuthenticatedUser = Depends(get_current_user),
) -> DocumentProcessResponse:
    service.validate_document(document_id, payload.fields, payload.notes)
    return DocumentProcessResponse(
        document_id=document_id,
        status="VALIDADO",
        message="Document validated successfully.",
    )


@router.post("/{document_id}/reject-reading", response_model=DocumentProcessResponse)
async def reject_reading(
    document_id: str,
    payload: DocumentRejectReadingRequest,
    service: DocumentService = Depends(get_document_service),
    _user: AuthenticatedUser = Depends(get_current_user),
) -> DocumentProcessResponse:
    service.reject_reading(document_id, payload.reason)
    return DocumentProcessResponse(
        document_id=document_id,
        status="ERROR",
        message="Reading rejected.",
    )
