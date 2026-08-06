import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function AttendancePage() {
  await requirePermission("personnel.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Asistencia"
        title="Registro de asistencia por turno"
        description="Preparado para controlar presencia, ausencias, reemplazos y respaldos de asistencia escaneada."
      />
      <RoutePlaceholder
        title="Asistencia por turno"
        description="Quedó reservada la ruta para el cruce entre personal, turno y marcación operacional."
        nextStep="Siguiente implementación: tabla de presentes, ausentes y reemplazos con evidencia adjunta."
      />
    </div>
  );
}
