import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function FuelReceptionPage() {
  await requirePermission("fleet.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Combustible"
        title="Recepcion de combustible"
        description="Concentrara el control de camiones, litros, diferencias y evidencias documentales."
      />
      <RoutePlaceholder
        title="Recepciones"
        description="Este modulo integrara proveedor, evidencia y conciliacion de diferencias."
        nextStep="Siguiente paso: formulario de recepcion, respaldo documental y auditoria."
      />
    </div>
  );
}
