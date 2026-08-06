import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function WasteContainersPage() {
  await requirePermission("tasks.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Contenedores"
        title="Gestión de contenedores"
        description="Preparado para controlar cambios, evidencias, frecuencia y responsables."
      />
      <RoutePlaceholder
        title="Control de contenedores"
        description="La ruta quedó reservada para integrarse con tareas de limpieza y novedades operacionales."
        nextStep="Próximo paso: registro de cambio, ubicación y trazabilidad de retiro."
      />
    </div>
  );
}
