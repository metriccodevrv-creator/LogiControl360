import { OperationalOverviewChart } from "@/components/charts/operational-overview-chart";
import { MetricCard } from "@/components/layout/metric-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getDashboardComplianceSeries,
  getDashboardMetrics,
  getNotificationRows,
  getTerminalRows,
} from "@/features/operations/queries";
import { formatDateTime } from "@/lib/dates/format";
import { requirePermission } from "@/lib/permissions/access";

export default async function DashboardPage() {
  const user = await requirePermission("dashboard.read");
  const [dashboardMetrics, complianceSeries, notifications, terminals] =
    await Promise.all([
      getDashboardMetrics(),
      Promise.resolve(getDashboardComplianceSeries()),
      getNotificationRows(),
      getTerminalRows(),
    ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Turno actual"
        title="Centro de mando operacional"
        description="Vista ejecutiva para seguimiento de turnos, pendientes criticos, cumplimiento por terminal y eventos que requieren intervencion del supervisor o del equipo administrativo."
        badge={<Badge tone="success">Usuario activo: {user.fullName}</Badge>}
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardHeader>
            <CardTitle>Cumplimiento y criticidad semanal</CardTitle>
          </CardHeader>
          <CardContent>
            {complianceSeries.length ? (
              <OperationalOverviewChart data={complianceSeries} />
            ) : (
              <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                Aun no hay una serie historica registrada para este panel.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas activas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.length ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[var(--color-primary)]">
                      {notification.title}
                    </p>
                    <Badge tone={notification.severity}>{notification.severity}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
                    {notification.description}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                No hay notificaciones registradas en la base.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Terminales visibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {terminals.length ? (
              terminals.map((terminal) => (
                <div
                  key={terminal.id}
                  className="flex flex-col gap-3 rounded-3xl bg-[var(--color-surface)] p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-[var(--color-primary)]">
                      {terminal.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-soft)]">
                      {terminal.zone} · Supervisor: {terminal.supervisorName}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Badge tone="info">{terminal.activeBuses} buses</Badge>
                    <Badge tone="neutral">{terminal.activePersonnel} personas</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                Aun no hay terminales cargados en la base.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de la plataforma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-[var(--color-text-soft)]">
            <p>
              La plataforma ya se apoya en lectura real desde Supabase para flota,
              terminales, personal y notificaciones.
            </p>
            <p>
              Si algun panel aun aparece vacio, falta cargar datos operacionales reales
              o ejecutar las migraciones pendientes.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
