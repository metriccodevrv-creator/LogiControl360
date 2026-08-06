import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({
  params,
}: TaskDetailPageProps) {
  await requirePermission("tasks.read");
  const { id } = await params;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Detalle"
        title={`Tarea ${id}`}
        description="Detalle reservado para ejecución, evidencias, comentarios y validación del supervisor."
      />
      <RoutePlaceholder
        title="Ficha de tarea"
        description="Diseñada para soportar historial de estados, comentarios, URLs firmadas y rechazo con observaciones."
        nextStep="Próximo paso: integración con `tasks`, `task_evidences` y `task_status_history`."
      />
    </div>
  );
}
