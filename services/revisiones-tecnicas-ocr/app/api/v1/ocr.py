from fastapi import APIRouter, Depends

from app.core.security import AuthenticatedUser, get_current_user
from app.schemas.documents import SupportedDocumentTypesResponse


router = APIRouter(prefix="/api/v1/ocr", tags=["ocr"])


@router.get("/supported-document-types", response_model=SupportedDocumentTypesResponse)
async def get_supported_document_types(
    _user: AuthenticatedUser = Depends(get_current_user),
) -> SupportedDocumentTypesResponse:
    return SupportedDocumentTypesResponse(
        items=[
            "certificado_aprobacion",
            "informe_rechazo",
            "certificado_reinspeccion",
        ]
    )
