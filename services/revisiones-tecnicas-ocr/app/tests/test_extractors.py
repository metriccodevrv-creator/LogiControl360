from app.extractors.certificado_aprobacion import CertificadoAprobacionExtractor
from app.extractors.informe_rechazo import InformeRechazoExtractor


def test_certificado_aprobacion_extractor_reads_ppu() -> None:
    extractor = CertificadoAprobacionExtractor()
    fields = extractor.extract("CERTIFICADO LCHT-82 2026-08-01")
    assert any(field.value == "LCHT-82" for field in fields)


def test_informe_rechazo_extractor_reads_code() -> None:
    extractor = InformeRechazoExtractor()
    fields = extractor.extract("Informe de rechazo FR-12 folio 81294 JXWK-17")
    assert any(field.value == "FR-12" for field in fields)
