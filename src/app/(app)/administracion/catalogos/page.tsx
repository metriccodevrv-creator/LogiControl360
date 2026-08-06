import { PageHeader } from "@/components/layout/page-header";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { requirePermission } from "@/lib/permissions/access";

export default async function CatalogsAdminPage() {
  await requirePermission("administration.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administración"
        title="Catálogos maestros"
        description="Ruta base para marcas, modelos, tipos, energía, documentos y catálogos configurables."
      />
      <RoutePlaceholder
        title="Catálogos"
        description="Se usará para mantener tablas maestras separadas y reutilizables en todo el sistema."
        nextStep="Próximo paso: ABM de marcas, modelos, tipos y estados."
      />
    </div>
  );
}
