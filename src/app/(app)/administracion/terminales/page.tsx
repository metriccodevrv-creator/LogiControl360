import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/tables/data-table";
import { getTerminalRows } from "@/features/operations/queries";
import { requirePermission } from "@/lib/permissions/access";

export default async function TerminalsAdminPage() {
  await requirePermission("terminals.read");
  const terminals = await getTerminalRows();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administracion base"
        title="Terminales y configuracion operacional"
        description="Soporte multi-terminal, jornadas, zonas y responsables directos conectado a las tablas reales de la base."
      />

      <DataTable
        title="Terminales configurados"
        description="Listado real de terminales disponibles en el sistema."
        data={terminals}
        columns={[
          { key: "code", label: "Codigo" },
          { key: "name", label: "Nombre" },
          { key: "zone", label: "Zona" },
          { key: "shiftWindow", label: "Turnos" },
          {
            key: "active",
            label: "Estado",
            render: (terminal) =>
              terminal.active ? (
                <Badge tone="success">Activo</Badge>
              ) : (
                <Badge tone="warning">Inactivo</Badge>
              ),
          },
          { key: "supervisorName", label: "Supervisor" },
        ]}
      />
    </div>
  );
}
