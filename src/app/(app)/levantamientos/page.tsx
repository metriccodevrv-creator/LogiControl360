import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function InspectionsPage() {
  await requirePermission("tasks.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Levantamientos"
        title="Inspecciones y levantamientos"
        description="Espacio reservado para campañas, hallazgos, severidad y estado de resolución."
      />
      <RoutePlaceholder
        title="Levantamientos"
        description="Este módulo conectará hallazgos de terreno con flota, turno y responsable."
        nextStep="Próximo paso: campañas, resultados por ítem y panel de seguimiento."
      />
    </div>
  );
}
