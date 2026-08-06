import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function WasteContainersPage() {
  await requirePermission("tasks.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Contenedores"
        title="Gestion de contenedores"
        description="Concentrara cambios, evidencias, frecuencia y responsables."
      />
      <RoutePlaceholder
        title="Control de contenedores"
        description="Aqui se integrara con tareas de limpieza y novedades operacionales."
        nextStep="Siguiente paso: registro de cambio, ubicacion y trazabilidad de retiro."
      />
    </div>
  );
}
