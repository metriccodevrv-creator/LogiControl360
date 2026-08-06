import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function FuelReceptionPage() {
  await requirePermission("fleet.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Combustible"
        title="Recepción de combustible"
        description="Preparado para controlar camiones, litros, diferencias y evidencias documentales."
      />
      <RoutePlaceholder
        title="Recepciones"
        description="Este módulo conectará proveedor, evidencia y conciliación de diferencias."
        nextStep="Próximo paso: formulario de recepción, respaldo documental y auditoría."
      />
    </div>
  );
}
