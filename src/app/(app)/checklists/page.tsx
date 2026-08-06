import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function ChecklistsPage() {
  await requirePermission("tasks.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Checklists"
        title="Plantillas y resultados de checklist"
        description="Preparado para controles repetibles por bus, terminal, rol y campaña."
      />
      <RoutePlaceholder
        title="Checklists operativos"
        description="Quedó reservada la ruta para plantillas, ítems, evidencias y firmas digitales."
        nextStep="Próximo paso: crear plantillas versionadas y resultados por ejecución."
      />
    </div>
  );
}
