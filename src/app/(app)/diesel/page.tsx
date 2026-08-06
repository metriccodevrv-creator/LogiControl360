import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function DieselPage() {
  await requirePermission("fleet.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Diésel"
        title="Control de carga diésel"
        description="Módulo reservado para carga, litros, operador, observaciones y buses sin carga."
      />
      <RoutePlaceholder
        title="Operación diésel"
        description="La estructura contempla registros por turno, control de camiones y revisión de buses sin carga."
        nextStep="Próximo paso: formularios transaccionales y dashboard de litros por terminal."
      />
    </div>
  );
}
