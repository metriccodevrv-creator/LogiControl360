from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


DocumentStatus = Literal[
    "PENDIENTE",
    "PROCESANDO",
    "PROCESADO",
    "REQUIERE_REVISION",
    "VALIDADO",
    "ERROR",
]


class ExtractedField(BaseModel):
    name: str
    value: str | None = None
    confidence: float | None = None
    page: int = 1
    coordinates: dict[str, Any] | None = None


class DocumentProcessResponse(BaseModel):
    document_id: str
    status: DocumentStatus
    message: str


class DocumentStatusResponse(BaseModel):
    document_id: str
    status: DocumentStatus
    warnings: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)


class DocumentResultResponse(BaseModel):
    document_id: str
    status: DocumentStatus
    document_type: str | None = None
    hash_sha256: str | None = None
    full_text: str = ""
    confidence: float | None = None
    warnings: list[str] = Field(default_factory=list)
    fields: list[ExtractedField] = Field(default_factory=list)
    raw_result: dict[str, Any] = Field(default_factory=dict)


class DocumentValidateRequest(BaseModel):
    fields: dict[str, str] = Field(default_factory=dict)
    notes: str | None = None


class DocumentRejectReadingRequest(BaseModel):
    reason: str = Field(min_length=3)


class DocumentReprocessRequest(BaseModel):
    document_id: str
    force_document_type: str | None = None


class SupportedDocumentTypesResponse(BaseModel):
    items: list[str]
