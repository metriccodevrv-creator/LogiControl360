import { PageHeader } from "@/components/layout/page-header";
import { SendForm } from "@/features/revisiones-tecnicas/components/send-form";
import { requirePermission } from "@/lib/permissions/access";

export default async function NewTechnicalReviewSendPage() {
  await requirePermission("technical_reviews.manage");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Paso 1"
        title="Registrar envio a revision tecnica"
        description="Busqueda por PPU, numero interno o QR, con control de envios abiertos y trazabilidad del responsable."
      />
      <SendForm />
    </div>
  );
}
