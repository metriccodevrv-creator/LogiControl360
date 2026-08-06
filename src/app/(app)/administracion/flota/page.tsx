import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/tables/data-table";
import { getFleetRows } from "@/features/fleet/queries";
import { requirePermission } from "@/lib/permissions/access";

export default async function FleetAdminPage() {
  await requirePermission("fleet.read");
  const fleetRows = await getFleetRows();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flota"
        title="Base maestra de buses"
        description="Registro de buses con foco en unicidad PPU + numero interno, estado operacional y control documental."
      />

      <DataTable
        title="Buses registrados"
        description="Listado real de buses disponibles en la base."
        data={fleetRows}
        columns={[
          { key: "internalNumber", label: "N interno" },
          { key: "ppu", label: "PPU" },
          { key: "brand", label: "Marca" },
          { key: "model", label: "Modelo" },
          { key: "energyType", label: "Energia" },
          { key: "terminalName", label: "Terminal" },
          {
            key: "operationalState",
            label: "Estado",
            render: (bus) => <Badge tone="info">{bus.operationalState}</Badge>,
          },
        ]}
      />
    </div>
  );
}
