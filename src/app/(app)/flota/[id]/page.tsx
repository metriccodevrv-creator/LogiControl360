import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { getFleetBusById } from "@/features/fleet/queries";
import { requirePermission } from "@/lib/permissions/access";

interface FleetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FleetDetailPage({
  params,
}: FleetDetailPageProps) {
  await requirePermission("fleet.read");
  const { id } = await params;

  const bus = await getFleetBusById(id);

  if (!bus) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Detalle de flota"
        title={`Bus ${bus.internalNumber} · ${bus.ppu}`}
        description="Ficha resumida conectada a la base actual para evolucionar hacia historial, documentacion, RTG y evidencias."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identificacion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Marca: {bus.brand}</p>
            <p>Modelo: {bus.model}</p>
            <p>Tipo de energia: {bus.energyType}</p>
            <p>Terminal: {bus.terminalName}</p>
            <p>Zona: {bus.zone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Badge tone="info">{bus.operationalState}</Badge>
            <p>Estado administrativo: {bus.administrativeState}</p>
            <p>Documentos por vencer: {bus.documentsExpiring}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
