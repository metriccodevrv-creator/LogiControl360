import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  technicalReviewConfig,
  technicalReviewPlants,
} from "@/features/revisiones-tecnicas/data";
import { requirePermission } from "@/lib/permissions/access";

export default async function TechnicalReviewAdministrationPage() {
  await requirePermission("technical_reviews.admin");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administracion"
        title="Parametros y mantenedores del modulo"
        description="Catalogos base para plantas revisoras, reglas OCR, limites de carga y comportamiento operacional del flujo."
      />

      <DataTable
        title="Plantas revisoras"
        description="Catalogo operativo disponible para envios y recepciones."
        data={technicalReviewPlants}
        columns={[
          { key: "code", label: "Codigo" },
          { key: "name", label: "Nombre" },
          { key: "commune", label: "Comuna" },
          { key: "region", label: "Region" },
          {
            key: "active",
            label: "Estado",
            render: (item) => (item.active ? "Activa" : "Inactiva"),
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Configuracion central</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {technicalReviewConfig.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <p className="text-sm font-semibold text-[var(--color-primary)]">{item.key}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--color-operational)]">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--color-text-soft)]">
                {item.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
