import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function ShiftsPage() {
  await requirePermission("shifts.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Turnos"
        title="Gestion de turnos"
        description="Base inicial para planificacion, apertura, seguimiento y cierre de turnos operacionales."
      />
      <RoutePlaceholder
        title="Modulo de turnos"
        description="La estructura del proyecto, permisos y tablas base ya contemplan borrador, programacion, apertura, handover y cierre auditado."
        nextStep="Siguiente paso: creacion de turnos, duplicacion de programacion y cierre con transferencia de pendientes."
      />
    </div>
  );
}
