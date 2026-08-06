import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function DocumentsPage() {
  await requirePermission("documents.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Documentación"
        title="Control documental de flota"
        description="Ruta base para vigencia, alertas de vencimiento y carga de respaldos en buckets privados."
      />
      <RoutePlaceholder
        title="Documentos de buses"
        description="Esta vista soportará vigencia, observaciones, alertas y renovación auditada."
        nextStep="Próximo paso: tabla documental con filtros por vencimiento y estado."
      />
    </div>
  );
}
