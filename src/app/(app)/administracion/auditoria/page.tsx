import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function AuditAdminPage() {
  await requirePermission("administration.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administración"
        title="Auditoría"
        description="Vista base para revisar eventos transversales, cambios de estado, exportaciones y acciones sensibles."
      />
      <RoutePlaceholder
        title="Centro de auditoría"
        description="Se conectará a `audit_logs` con filtros por módulo, usuario, terminal y tipo de acción."
        nextStep="Próximo paso: búsqueda avanzada, exportación y trazabilidad por registro afectado."
      />
    </div>
  );
}
