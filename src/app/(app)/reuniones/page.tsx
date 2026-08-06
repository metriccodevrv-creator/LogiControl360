import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function MeetingsPage() {
  await requirePermission("reports.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reuniones"
        title="Reuniones y capacitaciones"
        description="Ruta lista para actas, asistentes, documentos y compromisos de seguimiento."
      />
      <RoutePlaceholder
        title="Módulo de reuniones"
        description="Cubrirá minutas, asistencia, material adjunto y compromisos por responsable."
        nextStep="Próximo paso: agenda, actas firmadas y seguimiento de compromisos."
      />
    </div>
  );
}
