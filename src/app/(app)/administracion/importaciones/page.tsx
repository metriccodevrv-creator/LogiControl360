import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function ImportsAdminPage() {
  await requirePermission("administration.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administración"
        title="Importaciones de datos"
        description="Ruta reservada para asistentes de carga Excel/CSV, mapeo, validación y reversión auditada."
      />
      <RoutePlaceholder
        title="Importador de bases"
        description="Preparado para flota, personal, marcas, modelos y terminales."
        nextStep="Próximo paso: flujo de subida, vista previa, errores y resultado exportable."
      />
    </div>
  );
}
