from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    supabase_url: str = Field(default="")
    supabase_anon_key: str = Field(default="")
    supabase_service_role_key: str = Field(default="")
    supabase_jwt_secret: str = Field(default="")
    supabase_storage_bucket: str = Field(default="revisiones-tecnicas")
    ocr_engine: str = Field(default="paddleocr")
    ocr_language: str = Field(default="es")
    ocr_min_confidence: float = Field(default=0.75)
    max_file_size_mb: int = Field(default=15)
    allowed_file_types: str = Field(
        default="application/pdf,image/jpeg,image/png"
    )
    frontend_url: str = Field(default="http://localhost:3000")
    backend_url: str = Field(default="http://localhost:8000")
    environment: str = Field(default="production")
    log_level: str = Field(default="INFO")
    temp_dir: str = Field(default="/tmp/revisiones-tecnicas")

    @property
    def allowed_mime_types(self) -> list[str]:
      return [item.strip() for item in self.allowed_file_types.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
