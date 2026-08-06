import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

interface RTGDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RTGDetailPage({ params }: RTGDetailPageProps) {
  await requirePermission("rtg.read");
  const { id } = await params;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Detalle RTG"
        title={`Proceso ${id}`}
        description="Detalle reservado para resultado aprobado o rechazado con evidencia documental."
      />
      <RoutePlaceholder
        title="Detalle de proceso RTG"
        description="Diseñado para conectar salida, revisión, defectos, reparación y reenvío."
        nextStep="Próximo paso: historial del proceso con adjuntos y responsables."
      />
    </div>
  );
}
