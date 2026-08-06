import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function DieselNoLoadPage() {
  await requirePermission("fleet.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Diésel"
        title="Buses sin carga diésel"
        description="Ruta dedicada a detectar buses programados que no completaron su carga."
      />
      <RoutePlaceholder
        title="Seguimiento de buses sin carga"
        description="Se usará para marcar causa raíz, reasignación y transferencia de pendientes."
        nextStep="Próximo paso: revisión cruzada con programación de buses y consumo esperado."
      />
    </div>
  );
}
