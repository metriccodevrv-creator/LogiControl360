import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/tables/data-table";
import { getPersonnelRows } from "@/features/operations/queries";
import { requirePermission } from "@/lib/permissions/access";

export default async function PersonnelAdminPage() {
  await requirePermission("personnel.read");
  const personnel = await getPersonnelRows();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Personal"
        title="Base maestra de personal"
        description="Separacion entre autenticacion y ficha laboral, con rol del sistema, terminal principal, turno habitual y supervisor asociado."
      />

      <DataTable
        title="Personal operativo y administrativo"
        description="Listado real del personal registrado en la base."
        data={personnel}
        columns={[
          { key: "internalCode", label: "Codigo" },
          { key: "fullName", label: "Nombre" },
          { key: "roleLabel", label: "Cargo" },
          { key: "mainTerminal", label: "Terminal" },
          { key: "habitualShift", label: "Turno habitual" },
          {
            key: "status",
            label: "Estado",
            render: (member) => <Badge tone="success">{member.status}</Badge>,
          },
        ]}
      />
    </div>
  );
}
