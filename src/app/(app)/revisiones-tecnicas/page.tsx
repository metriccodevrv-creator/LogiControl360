import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  technicalReviewAlerts,
  technicalReviewMetrics,
  technicalReviewMonthlyResults,
  technicalReviewOperationalItems,
} from "@/features/revisiones-tecnicas/data";
import { StatGrid } from "@/features/revisiones-tecnicas/components/stat-grid";
import { StatusBadge } from "@/features/revisiones-tecnicas/components/status-badge";
import { requirePermission } from "@/lib/permissions/access";

export default async function TechnicalReviewsPage() {
  const user = await requirePermission("technical_reviews.read");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Revisiones Tecnicas"
        title="Centro de control de revision tecnica"
        description="Modulo operacional para envios, recepciones, validacion OCR, rechazos, reinspecciones y vigencias sin perder historial."
        badge={<Badge tone="success">Responsable activo: {user.fullName}</Badge>}
      />

      <StatGrid metrics={technicalReviewMetrics} />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Aprobados y rechazados por mes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {technicalReviewMonthlyResults.map((result) => (
              <div key={result.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--color-primary)]">
                    {result.month}
                  </span>
                  <span className="text-[var(--color-text-soft)]">
                    {result.approved} aprobados / {result.rejected} rechazados
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_1fr] gap-3">
                  <div
                    className="h-3 rounded-full bg-emerald-500"
                    style={{ width: `${Math.min(result.approved * 2, 100)}%` }}
                  />
                  <div
                    className="h-3 rounded-full bg-rose-500"
                    style={{ width: `${Math.min(result.rejected * 8, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas en curso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {technicalReviewAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[var(--color-primary)]">{alert.title}</p>
                  <Badge tone={alert.severity}>{alert.severity}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
                  {alert.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Casos priorizados hoy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {technicalReviewOperationalItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[28px] bg-[var(--color-surface)] p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="text-lg font-semibold text-[var(--color-primary)]">
                    {item.internalNumber} · {item.ppu}
                  </p>
                  <p className="text-sm text-[var(--color-text-soft)]">
                    {item.terminal} · {item.brand} {item.model}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <StatusBadge status={item.status} />
                  <Badge tone="neutral">{item.plant}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accesos rapidos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/revisiones-tecnicas/bandeja">
              <Button className="w-full justify-center">Abrir bandeja operacional</Button>
            </Link>
            <Link href="/revisiones-tecnicas/envios/nuevo">
              <Button variant="secondary" className="w-full justify-center">
                Registrar envio
              </Button>
            </Link>
            <Link href="/revisiones-tecnicas/recepciones/nueva">
              <Button variant="secondary" className="w-full justify-center">
                Registrar recepcion
              </Button>
            </Link>
            <Link href="/revisiones-tecnicas/rechazos">
              <Button variant="ghost" className="w-full justify-center">
                Gestionar rechazos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
