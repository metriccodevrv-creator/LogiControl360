import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { technicalReviewOperationalItems } from "@/features/revisiones-tecnicas/data";
import { OperationalTable } from "@/features/revisiones-tecnicas/components/operational-table";
import { requirePermission } from "@/lib/permissions/access";

export default async function TechnicalReviewTrayPage() {
  await requirePermission("technical_reviews.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Bandeja operacional"
        title="Seguimiento diario de la flota"
        description="Tabla central para buscar buses, priorizar proximos vencimientos y actuar sobre envios, recepciones y rechazos."
      />

      <Card>
        <CardHeader>
          <CardTitle>Filtros activos del turno</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge tone="info">Fecha: 2026-08-06</Badge>
          <Badge tone="neutral">Terminales: El Roble, Lo Echevers, Colo Colo</Badge>
          <Badge tone="warning">Estados: criticos y pendientes</Badge>
          <Badge tone="neutral">Busqueda rapida por PPU o numero interno</Badge>
        </CardContent>
      </Card>

      <OperationalTable items={technicalReviewOperationalItems} />
    </div>
  );
}
