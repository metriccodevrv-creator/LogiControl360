import { PageHeader } from "@/components/layout/page-header";
import { technicalReviewDocumentReview } from "@/features/revisiones-tecnicas/data";
import { OcrValidationWorkspace } from "@/features/revisiones-tecnicas/components/ocr-validation-workspace";
import { requirePermission } from "@/lib/permissions/access";

export default async function TechnicalReviewDocumentValidationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("technical_reviews.validate");
  const { id } = await params;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="OCR + validacion humana"
        title={`Revision documental ${id}`}
        description="Pantalla dividida para revisar el documento original, corregir campos y confirmar el cierre sin sobrescribir el OCR bruto."
      />
      <OcrValidationWorkspace document={{ ...technicalReviewDocumentReview, id }} />
    </div>
  );
}
