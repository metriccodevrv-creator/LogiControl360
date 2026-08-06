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
        description="Concentrara presencia, ausencias, reemplazos y respaldos de asistencia escaneada."
      />
      <RoutePlaceholder
        title="Asistencia por turno"
        description="Aqui se integrara el cruce entre personal, turno y marcacion operacional."
        nextStep="Siguiente paso: tabla de presentes, ausentes y reemplazos con evidencia adjunta."
      />
    </div>
  );
}
