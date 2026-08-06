import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { technicalReviewRejections } from "@/features/revisiones-tecnicas/data";
import { requirePermission } from "@/lib/permissions/access";

export default async function TechnicalReviewRejectionsPage() {
  await requirePermission("technical_reviews.manage");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Gestion de rechazos"
        title="Seguimiento de reparaciones y reinspecciones"
        description="Pantalla de trabajo para asignar responsables, registrar avances y dejar listo cada caso para reinspeccion."
      />

      <section className="grid gap-6 lg:grid-cols-2">
        {technicalReviewRejections.map((rejection) => (
          <Card key={rejection.id}>
            <CardHeader>
              <CardTitle>
                {rejection.internalNumber} · {rejection.ppu}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone="warning">{rejection.status}</Badge>
                <Badge tone="neutral">{rejection.terminal}</Badge>
                <Badge tone="info">{rejection.plant}</Badge>
              </div>
              <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                Responsable: {rejection.owner}
              </p>
              <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                Trabajo realizado: {rejection.workDone}
              </p>
              <div className="flex flex-wrap gap-2">
                {rejection.reasons.map((reason) => (
                  <Badge key={reason} tone="danger">
                    {reason}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
