from pathlib import Path

from app.core.settings import Settings
from app.services.validation_service import ValidationService


def test_validation_accepts_pdf(tmp_path: Path) -> None:
    target = tmp_path / "sample.pdf"
    target.write_text("sample", encoding="utf-8")

    service = ValidationService(Settings())
    mime_type = service.validate_file(target)

    assert mime_type == "application/pdf"
