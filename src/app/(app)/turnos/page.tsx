import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function ShiftsPage() {
  await requirePermission("shifts.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Turnos"
        title="Gestión de turnos"
        description="Base inicial para planificación, apertura, seguimiento y cierre de turnos operacionales."
      />
      <RoutePlaceholder
        title="Módulo de turnos en preparación"
        description="La estructura del proyecto, permisos y tablas base ya contemplan borrador, programación, apertura, handover y cierre auditado."
        nextStep="Siguiente implementación: creación de turnos, duplicación de programación y cierre con transferencia de pendientes."
      />
    </div>
  );
}
