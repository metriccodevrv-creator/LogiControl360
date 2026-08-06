import { PageHeader } from "@/components/layout/page-header";
import { ReceptionForm } from "@/features/revisiones-tecnicas/components/reception-form";
import { requirePermission } from "@/lib/permissions/access";

export default async function NewTechnicalReviewReceptionPage() {
  await requirePermission("technical_reviews.manage");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Paso 2"
        title="Registrar recepcion y documento"
        description="Cierre operacional del envio con carga documental, chequeos de kilometraje y preparacion para OCR."
      />
      <ReceptionForm />
    </div>
  );
}
