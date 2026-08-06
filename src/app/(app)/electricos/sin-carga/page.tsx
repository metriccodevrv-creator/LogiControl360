import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function ElectricNoLoadPage() {
  await requirePermission("fleet.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Eléctricos"
        title="Buses sin carga eléctrica"
        description="Ruta de excepción para controlar unidades eléctricas fuera de nivel esperado."
      />
      <RoutePlaceholder
        title="Seguimiento de incumplimientos de carga"
        description="Pensada para levantar causa, responsable y traspaso entre turnos."
        nextStep="Próximo paso: control cruzado con SOC mínimo, terminal y disponibilidad de cargadores."
      />
    </div>
  );
}
