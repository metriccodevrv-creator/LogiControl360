from __future__ import annotations

from dataclasses import dataclass

import jwt
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.settings import Settings, get_settings


bearer_scheme = HTTPBearer(auto_error=True)


@dataclass(slots=True)
class AuthenticatedUser:
    id: str
    role: str | None
    terminal_ids: list[str]
    email: str | None


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
    settings: Settings = Depends(get_settings),
) -> AuthenticatedUser:
    if not settings.supabase_jwt_secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="SUPABASE_JWT_SECRET is not configured.",
        )

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        ) from exc

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not contain a user identifier.",
        )

    metadata = payload.get("user_metadata") or {}
    terminal_ids = metadata.get("terminal_ids") or []

    return AuthenticatedUser(
        id=user_id,
        role=metadata.get("role"),
        terminal_ids=terminal_ids if isinstance(terminal_ids, list) else [],
        email=payload.get("email"),
    )
