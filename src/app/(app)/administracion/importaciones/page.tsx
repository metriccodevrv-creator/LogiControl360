import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/permissions/access";

const importAreas = [
  {
    title: "Flota",
    description:
      "Carga archivos Excel o CSV, normaliza columnas, elimina duplicados y consolida la base limpia antes de guardar en Supabase.",
    href: "/flota",
    action: "Abrir carga de flota",
    tone: "success" as const,
    status: "Disponible",
  },
  {
    title: "Personal, terminales y catalogos",
    description:
      "Este panel seguira centralizando futuras cargas masivas para mantener el mismo flujo de validacion y trazabilidad.",
    tone: "warning" as const,
    status: "Siguiente etapa",
  },
];

export default async function ImportsAdminPage() {
  await requirePermission("administration.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administracion"
        title="Importaciones de datos"
        description="Centraliza las cargas masivas con limpieza previa, validacion y trazabilidad antes de persistir informacion operativa."
      />

      <section className="grid gap-5 xl:grid-cols-2">
        {importAreas.map((item) => (
          <Card key={item.title} className="h-full">
            <CardHeader className="space-y-3">
              <Badge tone={item.tone} className="w-fit">
                {item.status}
              </Badge>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                {item.description}
              </p>
              {item.href && item.action ? (
                <Link
                  href={item.href}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-strong)]"
                >
                  {item.action}
                </Link>
              ) : (
                <p className="text-sm font-medium text-[var(--color-operational)]">
                  Esta area quedo lista para incorporar nuevas bases con el mismo criterio de
                  limpieza.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
