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
        description="Concentrara controles repetibles por bus, terminal, rol y campana."
      />
      <RoutePlaceholder
        title="Checklists operativos"
        description="Aqui se integraran plantillas, items, evidencias y firmas digitales."
        nextStep="Siguiente paso: crear plantillas versionadas y resultados por ejecucion."
      />
    </div>
  );
}
