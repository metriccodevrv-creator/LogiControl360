import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  technicalReviewOperationalItems,
  technicalReviewRejections,
  technicalReviewTimeline,
} from "@/features/revisiones-tecnicas/data";
import { Timeline } from "@/features/revisiones-tecnicas/components/timeline";
import { StatusBadge } from "@/features/revisiones-tecnicas/components/status-badge";
import { requirePermission } from "@/lib/permissions/access";

export default async function TechnicalReviewHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("technical_reviews.read");
  const { id } = await params;
  const fallbackItem = technicalReviewOperationalItems[0];
  if (!fallbackItem) {
    notFound();
  }

  const item =
    technicalReviewOperationalItems.find((current) => current.busId === id) ??
    fallbackItem;
  const busTimeline = technicalReviewTimeline.filter((event) => event.busId === item.busId);
  const rejectionCases = technicalReviewRejections.filter(
    (rejection) => rejection.busId === item.busId,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Historial por bus"
        title={`Bus ${item.internalNumber} · ${item.ppu}`}
        description="Linea de tiempo completa del proceso, con usuario responsable, documentos, cambios de estado y motivos de rechazo."
        badge={<StatusBadge status={item.status} />}
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Ficha de control</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <Info label="Marca y modelo" value={`${item.brand} ${item.model}`} />
            <Info label="Terminal" value={item.terminal} />
            <Info label="Planta revisora" value={item.plant} />
            <Info label="Ultimo resultado" value={item.lastResult} />
            <Info label="Vencimiento" value={item.dueDate} />
            <Info label="Responsable" value={item.responsible} />
            <div className="flex flex-wrap gap-3">
              <Badge tone="neutral">{item.attemptCount} intento(s)</Badge>
              <Badge tone="warning">{item.rejectionCount} rechazo(s)</Badge>
            </div>
          </CardContent>
        </Card>

        <Timeline items={busTimeline} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Rechazos asociados</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {rejectionCases.length ? (
            rejectionCases.map((rejection) => (
              <div
                key={rejection.id}
                className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[var(--color-primary)]">{rejection.owner}</p>
                  <Badge tone="warning">{rejection.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--color-text-soft)]">
                  {rejection.workDone}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {rejection.reasons.map((reason) => (
                    <Badge key={reason} tone="danger">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--color-text-soft)]">
              Este bus no registra rechazos en la muestra actual.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-[var(--color-primary)]">{value}</p>
    </div>
  );
}
