import { PageHeader } from "@/components/layout/page-header";
import { FleetImportWorkspace } from "@/features/fleet/components/fleet-import-workspace";
import { getFleetRows } from "@/features/fleet/queries";
import { hasPermission, requirePermission } from "@/lib/permissions/access";

export default async function FleetPage() {
  const user = await requirePermission("fleet.read");
  const fleetRows = await getFleetRows();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flota"
        title="Base operacional de buses"
        description="Carga un archivo Excel o CSV, limpia duplicados y revisa una tabla base normalizada antes de integrarla al flujo real de flota."
      />

      <FleetImportWorkspace
        initialFleet={fleetRows}
        canManage={hasPermission(user.role, "fleet.manage")}
      />
    </div>
  );
}
