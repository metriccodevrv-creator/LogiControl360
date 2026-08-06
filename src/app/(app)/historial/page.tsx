import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function HistoryPage() {
  await requirePermission("reports.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Historial"
        title="Historico y trazabilidad"
        description="Concentrara la navegacion por actividad de bus, persona, turno, documento o proceso."
      />
      <RoutePlaceholder
        title="Historial auditable"
        description="Se integrara con auditoria transversal, exportaciones y versiones posteriores a cierre."
        nextStep="Siguiente paso: filtros historicos y linea de tiempo por entidad."
      />
    </div>
  );
}
