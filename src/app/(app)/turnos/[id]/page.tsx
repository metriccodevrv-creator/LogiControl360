import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

interface ShiftDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShiftDetailPage({
  params,
}: ShiftDetailPageProps) {
  await requirePermission("shifts.read");
  const { id } = await params;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Detalle"
        title={`Turno ${id}`}
        description="Espacio reservado para la ficha operacional completa del turno."
      />
      <RoutePlaceholder
        title="Detalle de turno preparado"
        description="Aquí se conectarán tareas, asistencia, novedades, evidencias, validaciones y cierre de turno."
        nextStep="Próximo paso: vista consolidada por turno con control supervisor y estados de ejecución."
      />
    </div>
  );
}
