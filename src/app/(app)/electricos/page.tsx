import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function ElectricPage() {
  await requirePermission("fleet.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Eléctricos"
        title="Control de carga eléctrica"
        description="Base para SOC inicial/final, duración de carga, interrupciones y buses pendientes."
      />
      <RoutePlaceholder
        title="Operación eléctrica"
        description="Este módulo complementará el estado del turno con visibilidad directa sobre energía cargada."
        nextStep="Próximo paso: registro por bus, punto de carga, operador y alertas por carga incompleta."
      />
    </div>
  );
}
