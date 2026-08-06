import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function HistoryPage() {
  await requirePermission("reports.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Historial"
        title="Histórico y trazabilidad"
        description="Preparado para navegar actividad por bus, persona, turno, documento o proceso."
      />
      <RoutePlaceholder
        title="Historial auditable"
        description="Se enlazará con auditoría transversal, exportaciones y versiones posteriores a cierre."
        nextStep="Próximo paso: filtros históricos y línea de tiempo por entidad."
      />
    </div>
  );
}
