import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function ReportsPage() {
  await requirePermission("reports.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Informes"
        title="Exportaciones e informes"
        description="Ruta lista para centralizar exportación Excel, generación PDF y copia opcional a Storage."
      />
      <RoutePlaceholder
        title="Centro de informes"
        description="Este espacio reunirá filtros, formatos corporativos y trazabilidad de exportaciones."
        nextStep="Próximo paso: primera tanda de Excel/PDF para estado del turno, flota y documentos."
      />
    </div>
  );
}
