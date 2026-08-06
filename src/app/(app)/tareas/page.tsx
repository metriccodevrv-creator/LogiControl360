import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function TasksPage() {
  await requirePermission("tasks.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tareas"
        title="Control de tareas por turno"
        description="Eje principal del sistema: asignación, ejecución, evidencia, validación e histórico."
      />
      <RoutePlaceholder
        title="Motor de tareas"
        description="La base visual y de permisos ya está lista para estados operacionales, prioridad, responsable y validación."
        nextStep="Siguiente implementación: tablero de tareas, filtros por estado y flujo de evidencias privadas en Storage."
      />
    </div>
  );
}
