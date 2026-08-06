import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function UsersAdminPage() {
  await requirePermission("administration.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administración"
        title="Usuarios y accesos"
        description="Ruta preparada para alta controlada de usuarios, activación, bloqueo y asignación de terminales."
      />
      <RoutePlaceholder
        title="Administración de usuarios"
        description="Se conectará a `profiles`, roles, permisos y accesos por terminal."
        nextStep="Próximo paso: gestión de cuentas, activación/inactivación y último acceso."
      />
    </div>
  );
}
