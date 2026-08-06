import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function TemplatesAdminPage() {
  await requirePermission("administration.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administración"
        title="Plantillas operacionales"
        description="Espacio reservado para plantillas de tareas, checklists y controles recurrentes."
      />
      <RoutePlaceholder
        title="Plantillas"
        description="Se conectará con tipos de tarea, frecuencia, evidencia obligatoria y rol responsable."
        nextStep="Próximo paso: CRUD de plantillas y aplicación por terminal o turno."
      />
    </div>
  );
}
