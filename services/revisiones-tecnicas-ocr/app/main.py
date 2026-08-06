from __future__ import annotations

from functools import lru_cache

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.documents import router as documents_router
from app.api.v1.ocr import router as ocr_router
from app.core.logging import configure_logging
from app.core.settings import Settings, get_settings
from app.repositories.job_store import job_store
from app.services.document_classifier import DocumentClassifier
from app.services.document_service import DocumentService
from app.services.image_processing_service import ImageProcessingService
from app.services.ocr_service import OCRService
from app.services.storage_service import StorageService
from app.services.validation_service import ValidationService


@lru_cache
def get_document_service() -> DocumentService:
    settings = get_settings()
    return DocumentService(
        settings=settings,
        store=job_store,
        storage=StorageService(settings),
        validator=ValidationService(settings),
        image_processing=ImageProcessingService(settings),
        ocr=OCRService(settings),
        classifier=DocumentClassifier(),
    )


settings: Settings = get_settings()
configure_logging(settings.log_level)

app = FastAPI(
    title="LogiControl360 Revisiones Tecnicas OCR API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url] if settings.frontend_url else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router)
app.include_router(ocr_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
