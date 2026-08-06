from __future__ import annotations

from pathlib import Path
from uuid import uuid4

import fitz
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

from app.core.settings import Settings


class ImageProcessingService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def preprocess_document(self, file_path: Path) -> list[Path]:
        if file_path.suffix.lower() == ".pdf":
            return self._pdf_to_images(file_path)

        return [self._normalize_image(file_path)]

    def _pdf_to_images(self, file_path: Path) -> list[Path]:
        document = fitz.open(file_path)
        output_dir = Path(self.settings.temp_dir) / f"pages-{uuid4()}"
        output_dir.mkdir(parents=True, exist_ok=True)
        pages: list[Path] = []

        for index, page in enumerate(document, start=1):
            pixmap = page.get_pixmap(dpi=200)
            target = output_dir / f"page-{index}.png"
            pixmap.save(target)
            pages.append(self._normalize_image(target))

        return pages

    def _normalize_image(self, image_path: Path) -> Path:
        image = Image.open(image_path)
        image = ImageOps.exif_transpose(image)
        image = image.convert("L")
        image = ImageEnhance.Contrast(image).enhance(1.4)
        image = image.filter(ImageFilter.MedianFilter(size=3))
        image.save(image_path)
        return image_path
